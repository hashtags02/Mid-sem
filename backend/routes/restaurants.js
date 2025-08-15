const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const Dish = require('../models/Dish');
const { body, validationResult } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');

// @route   GET /api/restaurants
// @desc    Get all restaurants
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      cuisine, 
      rating, 
      isVegOnly, 
      search,
      sortBy = 'rating',
      order = 'desc'
    } = req.query;

    const query = { isActive: true };

    // Filter by cuisine
    if (cuisine) {
      query.cuisines = { $in: cuisine.split(',') };
    }

    // Filter by rating
    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }

    // Filter by veg only
    if (isVegOnly === 'true') {
      query.isVegOnly = true;
    }

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = order === 'desc' ? -1 : 1;

    const restaurants = await Restaurant.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('owner', 'name email')
      .exec();

    const total = await Restaurant.countDocuments(query);

    res.json({
      restaurants,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/restaurants/:id
// @desc    Get restaurant by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate('owner', 'name email')
      .populate({
        path: 'dishes',
        select: 'name description price image category isVeg isAvailable averageRating'
      });

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.json(restaurant);
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/restaurants/slug/:slug
// @desc    Get restaurant by slug
// @access  Public
router.get('/slug/:slug', async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ slug: req.params.slug })
      .populate('owner', 'name email');

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    // Get dishes for this restaurant
    const dishes = await Dish.find({ 
      restaurant: restaurant._id, 
      isAvailable: true 
    }).select('name description price image category isVeg isSpicy isPopular averageRating totalRatings');

    res.json({ restaurant, dishes });
  } catch (error) {
    console.error('Error fetching restaurant by slug:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/restaurants
// @desc    Create a new restaurant
// @access  Private (Restaurant Owner/Admin)
router.post('/', [
  auth,
  authorize('restaurant_owner', 'admin'),
  body('name').notEmpty().withMessage('Restaurant name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('photo').notEmpty().withMessage('Restaurant photo is required'),
  body('cuisines').isArray({ min: 1 }).withMessage('At least one cuisine is required'),
  body('address.street').notEmpty().withMessage('Street address is required'),
  body('address.city').notEmpty().withMessage('City is required'),
  body('address.state').notEmpty().withMessage('State is required'),
  body('address.zipCode').notEmpty().withMessage('Zip code is required'),
  body('contact.phone').notEmpty().withMessage('Phone number is required'),
  body('contact.email').isEmail().withMessage('Valid email is required'),
  body('timings.open').notEmpty().withMessage('Opening time is required'),
  body('timings.close').notEmpty().withMessage('Closing time is required'),
  body('timings.daysOpen').isArray({ min: 1 }).withMessage('Days open is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const restaurant = new Restaurant({
      ...req.body,
      owner: req.user.id
    });

    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (error) {
    console.error('Error creating restaurant:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Restaurant with this name already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/restaurants/:id
// @desc    Update restaurant
// @access  Private (Restaurant Owner/Admin)
router.put('/:id', [auth], async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    // Check if user owns the restaurant or is admin
    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ error: 'Not authorized' });
    }

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedRestaurant);
  } catch (error) {
    console.error('Error updating restaurant:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/restaurants/:id
// @desc    Delete restaurant
// @access  Private (Restaurant Owner/Admin)
router.delete('/:id', [auth], async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    // Check if user owns the restaurant or is admin
    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ error: 'Not authorized' });
    }

    await restaurant.remove();
    res.json({ message: 'Restaurant removed' });
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/restaurants/:id/menu
// @desc    Get restaurant menu
// @access  Public
router.get('/:id/menu', async (req, res) => {
  try {
    const { category, isVeg, search } = req.query;
    
    const query = { 
      restaurant: req.params.id, 
      isAvailable: true 
    };

    if (category) {
      query.category = category;
    }

    if (isVeg === 'true') {
      query.isVeg = true;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const dishes = await Dish.find(query)
      .sort({ category: 1, name: 1 });

    res.json(dishes);
  } catch (error) {
    console.error('Error fetching restaurant menu:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
