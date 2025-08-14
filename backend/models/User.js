const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  avatar: {
    type: String,
    default: 'default-avatar.jpg'
  },
  role: {
    type: String,
    enum: ['user', 'restaurant_owner', 'admin', 'delivery_partner'],
    default: 'user'
  },
  addresses: [{
    type: {
      type: String,
      enum: ['home', 'work', 'other'],
      default: 'home'
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      landmark: String
    },
    isDefault: {
      type: Boolean,
      default: false
    }
  }],
  preferences: {
    isVegOnly: {
      type: Boolean,
      default: false
    },
    spiceLevel: {
      type: String,
      enum: ['mild', 'medium', 'hot'],
      default: 'medium'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      }
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  },
  favoriteRestaurants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  }],
  favoriteDishes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dish'
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return this.name;
});

// Virtual for default address
userSchema.virtual('defaultAddress').get(function() {
  const defaultAddr = this.addresses.find(addr => addr.isDefault);
  if (defaultAddr) {
    return `${defaultAddr.address.street}, ${defaultAddr.address.city}, ${defaultAddr.address.state} ${defaultAddr.address.zipCode}`;
  }
  return null;
});

module.exports = mongoose.model('User', userSchema);
