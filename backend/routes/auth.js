const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');

// Import Firebase Admin SDK
const admin = require('firebase-admin');

// @route   POST /api/auth/check-phone
// @desc    Check if phone number is registered
// @access  Public
router.post('/check-phone', async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  try {
    // Format phone number (remove +91 if present for consistency)
    const formattedPhone = phoneNumber.replace(/^\+91/, '');
    
    // Check if user exists with this phone number
    const user = await User.findOne({ phone: formattedPhone });
    
    res.json({ 
      isRegistered: !!user,
      role: user ? user.role : null,
      isDelivery: user ? user.role === 'delivery_partner' : false,
      message: user ? 'Phone number is registered' : 'Phone number is not registered'
    });
  } catch (error) {
    console.error('Error checking phone number:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/auth/send-login-otp
// @desc    Send OTP for login (phone number is already verified to exist)
// @access  Public
router.post('/send-login-otp', async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  try {
    // Format phone number
    const formattedPhone = phoneNumber.replace(/^\+91/, '');
    
    // Verify user exists
    const user = await User.findOne({ phone: formattedPhone });
    if (!user) {
      return res.status(404).json({ error: 'User not found with this phone number' });
    }

    // OTP is sent via Firebase on the frontend
    // This endpoint just validates the phone number exists
    res.json({ 
      message: 'OTP sent successfully via Firebase',
      phoneNumber: formattedPhone
    });
  } catch (error) {
    console.error('Error sending login OTP:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/auth/send-registration-otp
// @desc    Send OTP for registration (phone number is verified to not exist)
// @access  Public
router.post('/send-registration-otp', async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  try {
    // Format phone number
    const formattedPhone = phoneNumber.replace(/^\+91/, '');
    
    // Verify user doesn't exist
    const existingUser = await User.findOne({ phone: formattedPhone });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this phone number' });
    }

    // OTP is sent via Firebase on the frontend
    // This endpoint just validates the phone number is available
    res.json({ 
      message: 'OTP sent successfully via Firebase',
      phoneNumber: formattedPhone
    });
  } catch (error) {
    console.error('Error sending registration OTP:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/auth/verify-login-otp
// @desc    Verify OTP for login and return user data
// @access  Public
router.post('/verify-login-otp', async (req, res) => {
  const { phoneNumber, idToken } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  try {
    // Format phone number (remove +91 if present for database consistency)
    const formattedPhone = phoneNumber.replace(/^\+91/, '');
    
    // Check if Firebase Admin SDK is available
    if (admin.apps.length === 0) {
      console.log('Firebase Admin SDK not initialized, using fallback verification');
      
      // Fallback: Find user by phone number without Firebase verification
      const user = await User.findOne({ phone: formattedPhone });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Create JWT token
      const payload = {
        user: {
          id: user.id,
          role: user.role
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: process.env.JWT_EXPIRE || '7d' },
        (err, token) => {
          if (err) throw err;
          res.json({ 
            token, 
            user,
            message: 'Login successful (Firebase fallback mode)'
          });
        }
      );
      return;
    }

    // Firebase verification (if available)
    if (!idToken) {
      return res.status(400).json({ error: 'Firebase ID token is required when Firebase is configured' });
    }

    // Verify Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Check if the token belongs to the specified phone number
    // Firebase stores phone numbers with country code, so we need to format both
    const tokenPhone = decodedToken.phone_number;
    const expectedPhone = `+91${formattedPhone}`;
    
    if (tokenPhone !== expectedPhone) {
      console.log('Phone mismatch:', { tokenPhone, expectedPhone, formattedPhone });
      return res.status(401).json({ error: 'Phone number mismatch in token' });
    }
    
    // Find user by phone number
    const user = await User.findOne({ phone: formattedPhone });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Create JWT token
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: process.env.JWT_EXPIRE || '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token, 
          user,
          message: 'Login successful via Firebase OTP'
        });
      }
    );
  } catch (error) {
    console.error('Error verifying login OTP:', error);
    if (error.code === 'auth/id-token-expired') {
      res.status(401).json({ error: 'OTP token expired. Please request a new OTP.' });
    } else if (error.code === 'auth/invalid-id-token') {
      res.status(401).json({ error: 'Invalid OTP token. Please try again.' });
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  }
});

// @route   POST /api/auth/verify-registration-otp
// @desc    Verify OTP for registration and create new user
// @access  Public
router.post('/verify-registration-otp', async (req, res) => {
  const { phoneNumber, idToken, userData } = req.body;

  if (!phoneNumber || !userData) {
    return res.status(400).json({ error: 'Phone number and user data are required' });
  }

  try {
    // Format phone number (remove +91 if present for database consistency)
    const formattedPhone = phoneNumber.replace(/^\+91/, '');
    
    // Check if Firebase Admin SDK is available
    if (admin.apps.length === 0) {
      console.log('Firebase Admin SDK not initialized, using fallback registration');
      
      // Fallback: Create user without Firebase verification
      const existingUser = await User.findOne({ phone: formattedPhone });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists with this phone number' });
      }

      // Create new user
      let mappedRole = 'user';
      if (userData.role === 'delivery' || userData.role === 'delivery_partner') {
        mappedRole = 'delivery_partner';
      } else if (userData.role === 'restaurant_owner') {
        mappedRole = 'restaurant_owner';
      } else if (userData.role === 'admin') {
        mappedRole = 'admin';
      }

      const user = new User({
        name: userData.name,
        email: userData.email,
        phone: formattedPhone,
        gender: userData.gender || 'prefer_not_to_say',
        birthdate: userData.birthdate ? new Date(userData.birthdate) : undefined,
        addresses: userData.address ? [{
          type: 'home',
          address: {
            street: userData.address,
            city: '',
            state: '',
            zipCode: '',
            landmark: ''
          },
          isDefault: true
        }] : [],
        isPhoneVerified: true,
        isEmailVerified: false,
        role: mappedRole
      });

      await user.save();

      // Create JWT token
      const payload = {
        user: {
          id: user.id,
          role: user.role
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: process.env.JWT_EXPIRE || '7d' },
        (err, token) => {
          if (err) throw err;
          res.status(201).json({ 
            token, 
            user,
            message: 'Registration successful (Firebase fallback mode)'
          });
        }
      );
      return;
    }

    // Firebase verification (if available)
    if (!idToken) {
      return res.status(400).json({ error: 'Firebase ID token is required when Firebase is configured' });
    }

    // Verify Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Check if the token belongs to the specified phone number
    const tokenPhone = decodedToken.phone_number;
    const expectedPhone = `+91${formattedPhone}`;
    
    if (tokenPhone !== expectedPhone) {
      console.log('Phone mismatch:', { tokenPhone, expectedPhone, formattedPhone });
      return res.status(401).json({ error: 'Phone number mismatch in token' });
    }
    
    // Verify user doesn't exist
    const existingUser = await User.findOne({ phone: formattedPhone });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this phone number' });
    }

    // Create new user
    // Map incoming role values to backend-accepted roles
    let mappedRole = 'user';
    if (userData.role === 'delivery' || userData.role === 'delivery_partner') {
      mappedRole = 'delivery_partner';
    } else if (userData.role === 'restaurant_owner') {
      mappedRole = 'restaurant_owner';
    } else if (userData.role === 'admin') {
      mappedRole = 'admin';
    }

    const user = new User({
      name: userData.name,
      email: userData.email,
      phone: formattedPhone,
      gender: userData.gender || 'prefer_not_to_say',
      birthdate: userData.birthdate ? new Date(userData.birthdate) : undefined,
      addresses: userData.address ? [{
        type: 'home',
        address: {
          street: userData.address,
          city: '',
          state: '',
          zipCode: '',
          landmark: ''
        },
        isDefault: true
      }] : [],
      isPhoneVerified: true,
      isEmailVerified: false,
      role: mappedRole,
      firebaseUid: decodedToken.uid // Store Firebase UID for future reference
    });

    await user.save();

    // Create JWT token
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: process.env.JWT_EXPIRE || '7d' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ 
          token, 
          user,
          message: 'Registration successful via Firebase OTP'
        });
      }
    );
  } catch (error) {
    console.error('Error verifying registration OTP:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    if (error.code === 'auth/id-token-expired') {
      res.status(401).json({ error: 'OTP token expired. Please request a new OTP.' });
    } else if (error.code === 'auth/invalid-id-token') {
      res.status(401).json({ error: 'Invalid OTP token. Please try again.' });
    } else {
      res.status(500).json({ 
        error: 'Server error during registration',
        details: error.message 
      });
    }
  }
});

// @route   POST /api/auth/signup-phone
// @desc    Register a new user with phone number and Firebase token
// @access  Public
router.post('/signup-phone', async (req, res) => {
  const { idToken, name, email } = req.body;

  if (!idToken) {
    return res.status(400).json({ message: 'No ID token provided.' });
  }

  try {
    // 1. Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const phoneNumber = decodedToken.phone_number;

    if (!phoneNumber) {
      return res.status(400).json({ message: 'ID token does not contain a phone number.' });
    }

    // 2. Check if a user with this phone number already exists
    let user = await User.findOne({ phone: phoneNumber });

    if (user) {
      return res.status(400).json({ error: 'User already exists with this phone number.' });
    }

    // 3. Create a new user with data from the request body
    user = new User({
      name,
      email,
      phone: phoneNumber.replace(/^\+91/, ''), // Remove +91 for database consistency
      isPhoneVerified: true,
      isEmailVerified: false,
      role: 'user',
      firebaseUid: decodedToken.uid
    });
    
    // Hash the password if you are storing one, but for phone auth,
    // you might not need a password field. Adjust your User model accordingly.
    // For this example, we'll assume a dummy password if needed.
    // user.password = await bcrypt.hash('dummy_password', 10); 
    
    await user.save();

    // 4. Create and return a JWT for the new user session
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token, user });
      }
    );

  } catch (error) {
    console.error('Firebase token verification failed:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    res.status(401).json({ 
      message: 'Invalid or expired Firebase token.', 
      error: error.message 
    });
  }
});

// @route   POST /api/auth/login-phone
// @desc    Login an existing user with a phone number and Firebase token
// @access  Public
router.post('/login-phone', async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ message: 'No ID token provided.' });
  }

  try {
    // 1. Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const phoneNumber = decodedToken.phone_number;
    
    // 2. Find the user in your database using the verified phone number
    const user = await User.findOne({ phone: phoneNumber });

    if (!user) {
      return res.status(404).json({ error: 'User not found. Please register.' });
    }

    // 3. Update last login time
    user.lastLogin = new Date();
    await user.save();

    // 4. Create and return a JWT for the user session
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user });
      }
    );

  } catch (error) {
    console.error('Firebase token verification failed:', error);
    res.status(401).json({ message: 'Invalid or expired Firebase token.', error: error.message });
  }
});


// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').matches(/^[0-9]{10}$/).withMessage('Valid 10-digit phone number is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ $or: [{ email }, { phone }] });
    if (user) {
      return res.status(400).json({ error: 'User already exists with this email or phone' });
    }

    // Create new user
    user = new User({
      name,
      email,
      phone,
      password
    });

    await user.save();

    // Create JWT token
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Create JWT token
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    // User is already fetched and attached to req.user by auth middleware
    res.json(req.user);
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;