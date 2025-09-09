const express = require('express');
const router = express.Router();
const Dish = require('../models/Dish');
const { body, validationResult } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');

// @route   GET /api/dishes
// @desc    Get all dishes
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      category, 
      isVeg, 
      isSpicy, 
      search,
      restaurant,
      sortBy = 'name',
      order = 'asc'
    } = req.query;

    const query = { isAvailable: true };

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by veg/non-veg
    if (isVeg !== undefined) {
      query.isVeg = isVeg === 'true';
    }

    // Filter by spicy
    if (isSpicy !== undefined) {
      query.isSpicy = isSpicy === 'true';
    }

    // Filter by restaurant
    if (restaurant) {
      query.restaurant = restaurant;
    }

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = order === 'desc' ? -1 : 1;

    const dishes = await Dish.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('restaurant', 'name slug')
      .exec();

    const total = await Dish.countDocuments(query);

    res.json({
      dishes,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching dishes:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/dishes/:id
// @desc    Get dish by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id)
      .populate('restaurant', 'name slug address')
      .populate('ratings.user', 'name avatar');

    if (!dish) {
      return res.status(404).json({ error: 'Dish not found' });
    }

    res.json(dish);
  } catch (error) {
    console.error('Error fetching dish:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/dishes
// @desc    Create a new dish
// @access  Private (Restaurant Owner/Admin)
router.post('/', [
  auth,
  authorize('restaurant_owner', 'admin'),
  body('name').notEmpty().withMessage('Dish name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('price').isNumeric().withMessage('Valid price is required'),
  body('image').notEmpty().withMessage('Dish image is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('restaurant').notEmpty().withMessage('Restaurant reference is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const dish = new Dish(req.body);
    await dish.save();
    res.status(201).json(dish);
  } catch (error) {
    console.error('Error creating dish:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/dishes/:id
// @desc    Update dish
// @access  Private (Restaurant Owner/Admin)
router.put('/:id', [auth], async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);

    if (!dish) {
      return res.status(404).json({ error: 'Dish not found' });
    }

    const updatedDish = await Dish.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedDish);
  } catch (error) {
    console.error('Error updating dish:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/dishes/:id
// @desc    Delete dish
// @access  Private (Restaurant Owner/Admin)
router.delete('/:id', [auth], async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);

    if (!dish) {
      return res.status(404).json({ error: 'Dish not found' });
    }

    await dish.remove();
    res.json({ message: 'Dish removed' });
  } catch (error) {
    console.error('Error deleting dish:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/dishes/:id/rate
// @desc    Rate a dish
// @access  Private
router.post('/:id/rate', [
  auth,
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('review').optional().isString().withMessage('Review must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const dish = await Dish.findById(req.params.id);
    if (!dish) {
      return res.status(404).json({ error: 'Dish not found' });
    }

    const { rating, review } = req.body;
    const userId = req.user.id;

    // Check if user already rated this dish
    const existingRating = dish.ratings.find(r => r.user.toString() === userId);
    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      existingRating.review = review;
      existingRating.date = new Date();
    } else {
      // Add new rating
      dish.ratings.push({
        user: userId,
        rating,
        review,
        date: new Date()
      });
    }

    await dish.save();
    res.json(dish);
  } catch (error) {
    console.error('Error rating dish:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
