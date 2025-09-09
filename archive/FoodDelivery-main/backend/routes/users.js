const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  auth,
  body('name').optional().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('phone').optional().matches(/^[0-9]{10}$/).withMessage('Valid 10-digit phone number is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update fields
    const { name, email, phone, preferences, addresses } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };
    if (addresses) user.addresses = addresses;

    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/users/orders
// @desc    Get user orders
// @access  Private
router.get('/orders', auth, async (req, res) => {
  try {
    // This will be implemented when Order model is created
    res.json({ message: 'Orders endpoint - to be implemented' });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/users/favorites
// @desc    Add/remove from favorites
// @access  Private
router.post('/favorites', [
  auth,
  body('type').isIn(['restaurant', 'dish']).withMessage('Type must be restaurant or dish'),
  body('itemId').notEmpty().withMessage('Item ID is required'),
  body('action').isIn(['add', 'remove']).withMessage('Action must be add or remove')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { type, itemId, action } = req.body;
    const user = await User.findById(req.user.id);

    if (type === 'restaurant') {
      if (action === 'add') {
        if (!user.favoriteRestaurants.includes(itemId)) {
          user.favoriteRestaurants.push(itemId);
        }
      } else {
        user.favoriteRestaurants = user.favoriteRestaurants.filter(id => id.toString() !== itemId);
      }
    } else if (type === 'dish') {
      if (action === 'add') {
        if (!user.favoriteDishes.includes(itemId)) {
          user.favoriteDishes.push(itemId);
        }
      } else {
        user.favoriteDishes = user.favoriteDishes.filter(id => id.toString() !== itemId);
      }
    }

    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Error updating favorites:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/users/favorites
// @desc    Get user favorites
// @access  Private
router.get('/favorites', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('favoriteRestaurants', 'name slug photo rating')
      .populate('favoriteDishes', 'name image price restaurant')
      .select('favoriteRestaurants favoriteDishes');

    res.json(user);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
