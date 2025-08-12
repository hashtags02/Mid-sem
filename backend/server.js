require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('./model/User');

// Firebase Admin SDK
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();

// =======================
// 🔐 Middleware
// =======================
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());
app.use(session({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// =======================
// 🌍 MongoDB Connection
// =======================
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// =======================
// 🔑 Passport: Google OAuth
// =======================
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:5000/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// =======================
// 🔸 Firebase Auth Verification
// =======================
app.post('/verify-firebase-token', async (req, res) => {
  const { idToken, phone } = req.body;

  if (!idToken || !phone) {
    return res.status(400).json({ success: false, message: 'ID token and phone are required' });
  }

  try {
    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    
    console.log(`🔐 Firebase token verified for UID: ${uid}`);

    let user = await User.findOne({ phone });
    
    if (!user) {
      user = new User({ 
        phone, 
        verified: true,
        firebaseUid: uid 
      });
      await user.save();
      console.log(`📦 New user created for phone: ${phone}`);
    } else {
      user.verified = true;
      user.firebaseUid = uid;
      await user.save();
      console.log(`👤 Existing user updated: ${phone}`);
    }

    req.session.user = {
      method: 'firebase',
      uid: uid,
      phone: phone
    };

    console.log("✅ Firebase user verified:", phone);
    res.status(200).json({ success: true, redirect: '/dashboard' });
  } catch (error) {
    console.error("❌ Firebase verification failed:", error);
    res.status(401).json({ success: false, message: 'Invalid Firebase token', error: error.message });
  }
});

// =======================
// 🔸 Google OAuth Routes
// =======================
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:3000/login' }),
  (req, res) => {
    console.log('✅ Google login successful:', req.user);
    res.redirect('http://localhost:3000/dashboard');
  }
);

// =======================
// 🔸 User Info + Logout
// =======================
app.get('/user', async (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({ user: req.user });
  }

  if (req.session.user?.method === 'firebase') {
    const user = await User.findOne({ phone: req.session.user.phone });
    if (user) return res.json({ user: { phone: user.phone, method: 'firebase', uid: req.session.user.uid } });
  }

  res.status(401).json({ error: 'Not logged in' });
});

app.get('/logout', (req, res) => {
  req.logout(() => {
    req.session.destroy();
    res.redirect('http://localhost:3000/login');
  });
});

// =======================
// 🟢 Default Route
// =======================
app.get('/', (req, res) => {
  res.send('Backend running!');
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
