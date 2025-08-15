const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Dish name is required'],
    trim: true,
    maxlength: [100, 'Dish name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Dish description is required'],
    maxlength: [300, 'Description cannot exceed 300 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  image: {
    type: String,
    required: [true, 'Dish image is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Appetizers', 'Main Course', 'Desserts', 'Beverages', 
      'Pizza', 'Biryani', 'North Indian', 'South Indian', 
      'Chinese', 'Italian', 'Mexican', 'Fast Food', 
      'Snacks', 'Chaat', 'Sides', 'Cocktails', 'Wine', 'Sushi', 'Burgers'
    ]
  },
  dietaryInfo: [{
    type: String,
    enum: ['Vegetarian', 'Vegan', 'Non-Vegetarian', 'Gluten-Free', 'Dairy-Free']
  }],
  isVeg: {
    type: Boolean,
    default: true
  },
  isSpicy: {
    type: Boolean,
    default: false
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  preparationTime: {
    type: Number,
    default: 20, // minutes
    min: [1, 'Preparation time must be at least 1 minute']
  },
  calories: {
    type: Number,
    min: [0, 'Calories cannot be negative']
  },
  allergens: [{
    type: String,
    enum: ['Gluten', 'Dairy', 'Nuts', 'Eggs', 'Soy', 'Fish', 'Shellfish', 'Pork', 'Beef']
  }],
  ingredients: [{
    type: String,
    trim: true
  }],
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: [true, 'Restaurant reference is required']
  },
  customizations: [{
    name: {
      type: String,
      required: true
    },
    options: [{
      type: String,
      required: true
    }],
    prices: [{
      type: Number,
      default: 0
    }]
  }],
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate average rating before saving
dishSchema.pre('save', function(next) {
  if (this.ratings.length > 0) {
    const totalRating = this.ratings.reduce((sum, rating) => sum + rating.rating, 0);
    this.averageRating = totalRating / this.ratings.length;
    this.totalRatings = this.ratings.length;
  }
  next();
});

// Index for search
dishSchema.index({ name: 'text', description: 'text', category: 'text' });

// Virtual for formatted price
dishSchema.virtual('formattedPrice').get(function() {
  return `₹${this.price}`;
});

module.exports = mongoose.model('Dish', dishSchema);
