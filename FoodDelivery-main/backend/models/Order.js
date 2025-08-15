const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  items: [{
    dish: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dish',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    photo: String
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    landmark: String
  },
  deliveryInstructions: String,
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'upi', 'wallet'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  // Split Bill Information
  splitBill: {
    enabled: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      enum: ['equal', 'manual'],
      default: 'equal'
    },
    numberOfPeople: {
      type: Number,
      default: 1
    },
    equalSplitAmount: {
      type: Number,
      default: 0
    },
    manualSplit: [{
      name: {
        type: String,
        required: function() { return this.parent.type === 'manual'; }
      },
      amount: {
        type: Number,
        required: function() { return this.parent.type === 'manual'; },
        min: 0
      }
    }],
    totalAllocated: {
      type: Number,
      default: 0
    },
    remainingAmount: {
      type: Number,
      default: 0
    }
  },
  estimatedDeliveryTime: Date,
  actualDeliveryTime: Date,
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  review: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Calculate total amount before saving
orderSchema.pre('save', function(next) {
  if (this.items && this.items.length > 0) {
    this.totalAmount = this.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }
  
  // Calculate split bill amounts
  if (this.splitBill.enabled) {
    if (this.splitBill.type === 'equal') {
      this.splitBill.equalSplitAmount = Math.ceil(this.totalAmount / this.splitBill.numberOfPeople);
    } else if (this.splitBill.type === 'manual') {
      this.splitBill.totalAllocated = this.splitBill.manualSplit.reduce((sum, person) => sum + person.amount, 0);
      this.splitBill.remainingAmount = this.totalAmount - this.splitBill.totalAllocated;
    }
  }
  
  next();
});

// Virtual for order summary
orderSchema.virtual('orderSummary').get(function() {
  return {
    totalItems: this.items.reduce((sum, item) => sum + item.quantity, 0),
    totalAmount: this.totalAmount,
    splitBillInfo: this.splitBill.enabled ? {
      type: this.splitBill.type,
      numberOfPeople: this.splitBill.numberOfPeople,
      equalSplitAmount: this.splitBill.equalSplitAmount,
      manualSplit: this.splitBill.manualSplit,
      totalAllocated: this.splitBill.totalAllocated,
      remainingAmount: this.splitBill.remainingAmount
    } : null
  };
});

// Static method to get orders by user
orderSchema.statics.findByUser = function(userId) {
  return this.find({ user: userId, isActive: true })
    .populate('restaurant', 'name photo')
    .populate('items.dish', 'name price photo')
    .sort({ createdAt: -1 });
};

// Static method to get orders by restaurant
orderSchema.statics.findByRestaurant = function(restaurantId) {
  return this.find({ restaurant: restaurantId, isActive: true })
    .populate('user', 'name phone')
    .populate('items.dish', 'name price photo')
    .sort({ createdAt: -1 });
};

module.exports = mongoose.model('Order', orderSchema);
