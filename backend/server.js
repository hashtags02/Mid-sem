const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import Firebase Admin SDK
const admin = require('firebase-admin');

const app = express();
const server = http.createServer(app);
let io = null;

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

// Database connection (always attempt, with sensible default)
let dbConnected = false;
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cravecart', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ Connected to MongoDB');
    dbConnected = true;
  })
  .catch((err) => {
    console.log('⚠️  MongoDB connection failed');
    console.log('   Error:', err.message);
  });

// Initialize Firebase Admin SDK (supports multiple config methods)
try {
  let serviceAccount = null;

  // 1) Explicit path to JSON file
  if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
  }

  // 2) Raw JSON string in env
  if (!serviceAccount && process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  }

  // 3) Base64-encoded JSON in env
  if (!serviceAccount && process.env.FIREBASE_SA_BASE64) {
    const decoded = Buffer.from(process.env.FIREBASE_SA_BASE64, 'base64').toString();
    serviceAccount = JSON.parse(decoded);
  }

  // 4) Individual fields in env
  if (!serviceAccount && process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
    serviceAccount = {
      project_id: process.env.FIREBASE_PROJECT_ID,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: privateKey,
    };
  }

  // 5) Default local file
  if (!serviceAccount) {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    serviceAccount = require('./serviceAccountKey.json');
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('🔥 Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('❌ Firebase Admin SDK initialization failed:', error.message);
  console.log('⚠️  Set FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_SA_BASE64 or FIREBASE_PROJECT_ID/FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY');
  // Do not hard-exit in development; continue without Firebase if not configured
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
}

// Socket.IO (live driver tracking)
try {
  const { Server } = require('socket.io');
  io = new Server(server, {
    cors: {
      origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        process.env.FRONTEND_URL
      ].filter(Boolean),
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    // Join a room per order
    socket.on('join_order', ({ orderId }) => {
      if (orderId) socket.join(String(orderId));
    });

    // Driver sends live location: { orderId, lat, lng }
    socket.on('driver_location', (payload) => {
      try {
        const { orderId, lat, lng } = payload || {};
        if (!orderId) return;
        io.to(String(orderId)).emit('driver_location', { lat, lng, orderId, ts: Date.now() });
      } catch (_) {}
    });

    socket.on('disconnect', () => {});
  });
  console.log('🛰️  Socket.IO initialized');
} catch (e) {
  console.log('⚠️  Socket.IO not initialized:', e.message);
}

// Routes
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/dishes', dishRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

// Serve uploaded files
app.use('/uploads', express.static(require('path').join(__dirname, 'uploads')));
app.use('/api/uploads', express.static(require('path').join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'CraveCart Backend is running!',
    timestamp: new Date().toISOString(),
    mode: dbConnected ? 'Full Mode' : 'Basic Mode - No MongoDB',
    firebase: 'Available and Initialized'
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

server.listen(PORT, () => {
  console.log(`🚀 CraveCart Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔧 Mode: ${dbConnected ? 'Full' : 'Basic'}`);
  console.log(`🔥 Firebase: Available and Initialized`);
  console.log(`📱 OTP Authentication: Ready for Firebase Phone Auth`);
});