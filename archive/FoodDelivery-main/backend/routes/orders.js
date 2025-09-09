const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');

// @route   GET /api/orders
// @desc    Get all orders for the authenticated user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.findByUser(req.user.id);
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/orders
// @desc    Create a new order with split bill support
// @access  Private
router.post('/', [
  auth,
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('deliveryAddress').notEmpty().withMessage('Delivery address is required'),
  body('paymentMethod').isIn(['cash', 'card', 'upi', 'wallet']).withMessage('Invalid payment method'),
  body('restaurantId').notEmpty().withMessage('Restaurant ID is required'),
  body('splitBill.enabled').optional().isBoolean(),
  body('splitBill.type').optional().isIn(['equal', 'manual']),
  body('splitBill.numberOfPeople').optional().isInt({ min: 1, max: 10 }),
  body('splitBill.manualSplit').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      items,
      deliveryAddress,
      deliveryInstructions,
      paymentMethod,
      restaurantId,
      splitBill
    } = req.body;

    // Validate restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    // Create order object
    const orderData = {
      user: req.user.id,
      restaurant: restaurantId,
      items: items.map(item => ({
        dish: item.dishId || item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        photo: item.photo
      })),
      deliveryAddress,
      deliveryInstructions,
      paymentMethod,
      splitBill: {
        enabled: splitBill?.enabled || false,
        type: splitBill?.type || 'equal',
        numberOfPeople: splitBill?.numberOfPeople || 1,
        manualSplit: splitBill?.manualSplit || []
      }
    };

    // Create the order
    const order = new Order(orderData);
    await order.save();

    // Populate the order with restaurant and dish details
    await order.populate([
      { path: 'restaurant', select: 'name photo' },
      { path: 'items.dish', select: 'name price photo' }
    ]);

    res.status(201).json({
      message: 'Order created successfully',
      order: order,
      orderSummary: order.orderSummary
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('restaurant', 'name photo')
      .populate('items.dish', 'name price photo')
      .populate('user', 'name phone');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user owns this order or is admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json({
      order: order,
      orderSummary: order.orderSummary
    });

  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private (Admin/Restaurant Owner)
router.put('/:id/status', [
  auth,
  body('status').isIn(['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'])
    .withMessage('Invalid order status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user is authorized to update order status
    if (req.user.role !== 'admin' && req.user.role !== 'restaurant_owner') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    order.orderStatus = req.body.status;
    
    // Set delivery time when status is delivered
    if (req.body.status === 'delivered') {
      order.actualDeliveryTime = new Date();
    }

    await order.save();

    res.json({
      message: 'Order status updated successfully',
      order: order,
      orderSummary: order.orderSummary
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/orders/:id/rating
// @desc    Add rating and review to order
// @access  Private
router.put('/:id/rating', [
  auth,
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('review').optional().isString().isLength({ max: 500 }).withMessage('Review must be less than 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Check if order is delivered
    if (order.orderStatus !== 'delivered') {
      return res.status(400).json({ error: 'Can only rate delivered orders' });
    }

    order.rating = req.body.rating;
    order.review = req.body.review;

    await order.save();

    res.json({
      message: 'Rating added successfully',
      order: order
    });

  } catch (error) {
    console.error('Error adding rating:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/orders/restaurant/:restaurantId
// @desc    Get orders for a specific restaurant (for restaurant owners)
// @access  Private (Restaurant Owner/Admin)
router.get('/restaurant/:restaurantId', auth, async (req, res) => {
  try {
    // Check if user is authorized
    if (req.user.role !== 'admin' && req.user.role !== 'restaurant_owner') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const orders = await Order.findByRestaurant(req.params.restaurantId);
    res.json(orders);

  } catch (error) {
    console.error('Error fetching restaurant orders:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
