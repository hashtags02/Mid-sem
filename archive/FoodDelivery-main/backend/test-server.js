const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const app = express();

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// In-memory storage for testing
const users = new Map();
const phoneNumbers = new Map();

// Test data
const testUsers = [
  {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    phone: '9876543210',
    address: 'Test Address',
    verified: true,
    role: 'customer'
  }
];

// Initialize test data
testUsers.forEach(user => {
  users.set(user.id, user);
  phoneNumbers.set(user.phone, user);
});

// OTP endpoints for testing
app.post('/api/auth/check-phone', (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  try {
    // Format phone number (remove +91 if present for consistency)
    const formattedPhone = phoneNumber.replace(/^\+91/, '');
    
    // Check if user exists with this phone number
    const user = phoneNumbers.get(formattedPhone);
    
    res.json({ 
      isRegistered: !!user,
      message: user ? 'Phone number is registered' : 'Phone number is not registered'
    });
  } catch (error) {
    console.error('Error checking phone number:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/send-login-otp', (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  try {
    // Format phone number
    const formattedPhone = phoneNumber.replace(/^\+91/, '');
    
    // Verify user exists
    const user = phoneNumbers.get(formattedPhone);
    if (!user) {
      return res.status(404).json({ error: 'User not found with this phone number' });
    }

    // For testing, we'll just return success
    // In production, this would trigger Firebase OTP
    res.json({ 
      message: 'OTP sent successfully (TEST MODE)',
      phoneNumber: formattedPhone,
      testOTP: '123456' // This is just for testing!
    });
  } catch (error) {
    console.error('Error sending login OTP:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/send-registration-otp', (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  try {
    // Format phone number
    const formattedPhone = phoneNumber.replace(/^\+91/, '');
    
    // Verify user doesn't exist
    const existingUser = phoneNumbers.get(formattedPhone);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this phone number' });
    }

    // For testing, we'll just return success
    res.json({ 
      message: 'OTP sent successfully (TEST MODE)',
      phoneNumber: formattedPhone,
      testOTP: '123456' // This is just for testing!
    });
  } catch (error) {
    console.error('Error sending registration OTP:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/verify-login-otp', (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).json({ error: 'Phone number and OTP are required' });
  }

  try {
    // Format phone number
    const formattedPhone = phoneNumber.replace(/^\+91/, '');
    
    // Find user by phone number
    const user = phoneNumbers.get(formattedPhone);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // For testing, accept any 6-digit OTP
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      return res.status(400).json({ error: 'Invalid OTP format' });
    }

    // Create a simple JWT-like token for testing
    const token = `test-token-${Date.now()}`;
    
    res.json({ 
      token, 
      user,
      message: 'Login successful (TEST MODE)'
    });
  } catch (error) {
    console.error('Error verifying login OTP:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/verify-registration-otp', (req, res) => {
  const { phoneNumber, otp, userData } = req.body;

  if (!phoneNumber || !otp || !userData) {
    return res.status(400).json({ error: 'Phone number, OTP, and user data are required' });
  }

  try {
    // Format phone number
    const formattedPhone = phoneNumber.replace(/^\+91/, '');
    
    // Verify user doesn't exist
    const existingUser = phoneNumbers.get(formattedPhone);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this phone number' });
    }

    // For testing, accept any 6-digit OTP
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      return res.status(400).json({ error: 'Invalid OTP format' });
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      phone: formattedPhone,
      address: userData.address || '',
      verified: true,
      role: 'customer'
    };

    // Store in memory
    users.set(newUser.id, newUser);
    phoneNumbers.set(formattedPhone, newUser);

    // Create a simple JWT-like token for testing
    const token = `test-token-${Date.now()}`;
    
    res.status(201).json({ 
      token, 
      user: newUser,
      message: 'Registration successful (TEST MODE)'
    });
  } catch (error) {
    console.error('Error verifying registration OTP:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'CraveCart Test Backend is running!',
    timestamp: new Date().toISOString(),
    mode: 'TEST MODE - No MongoDB Required'
  });
});

// Get all test users
app.get('/api/test/users', (req, res) => {
  res.json(Array.from(users.values()));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🧪 CraveCart Test Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`👥 Test users: http://localhost:${PORT}/api/test/users`);
  console.log(`🔐 OTP endpoints ready for testing!`);
});
