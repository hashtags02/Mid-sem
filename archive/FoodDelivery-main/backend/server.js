const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import Firebase Admin SDK
const admin = require('firebase-admin');

const app = express();

// Import routes
const restaurantRoutes = require('./routes/restaurants');
const dishRoutes = require('./routes/dishes');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection
let dbConnected = false;
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cravecart', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ Connected to MongoDB');
    dbConnected = true;
  })
  .catch(err => {
    console.log('⚠️  MongoDB connection failed');
    console.log('   Error:', err.message);
  });
} else {
  console.log('⚠️  No MongoDB URI - running in basic mode');
}

// Initialize Firebase Admin SDK
let firebaseInitialized = false;
try {
  const serviceAccount = require('./serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('🔥 Firebase Admin SDK initialized successfully');
  firebaseInitialized = true;
} catch (error) {
  console.warn('⚠️  Firebase Admin SDK initialization failed:', error.message);
  console.log('⚠️  Make sure serviceAccountKey.json exists and is valid');
  console.log('⚠️  Running without Firebase OTP functionality');
  firebaseInitialized = false;
  // Don't exit - allow server to run without Firebase
}

// Routes
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/dishes', dishRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'CraveCart Backend is running!',
    timestamp: new Date().toISOString(),
    mode: dbConnected ? 'Full Mode' : 'Basic Mode - No MongoDB',
    firebase: firebaseInitialized ? 'Available and Initialized' : 'Not Available',
    database: dbConnected ? 'Connected' : 'Not Connected',
    orders: 'Available',
    splitBill: 'Available'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
 });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 CraveCart Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔧 Mode: ${dbConnected ? 'Full' : 'Basic'}`);
  console.log(`🔥 Firebase: ${firebaseInitialized ? 'Available and Initialized' : 'Not Available'}`);
  console.log(`📱 OTP Authentication: Ready for Firebase Phone Auth`);
});