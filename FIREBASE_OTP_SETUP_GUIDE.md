# Firebase OTP Setup Guide for CraveCart

## 🚨 Current Issues Fixed

1. **Missing JWT_SECRET** - Backend was failing due to missing environment variable
2. **Firebase Admin SDK initialization** - Properly configured for phone authentication
3. **Frontend OTP flow** - Fixed confirmation result handling
4. **API parameter mismatch** - Corrected ID token vs OTP parameter confusion
5. **Phone number formatting** - Consistent handling between frontend and backend

## 📋 Prerequisites

1. **Firebase Project** ✅ (You already have: `cravecartauth`)
2. **Service Account Key** ✅ (You already have: `serviceAccountKey.json`)
3. **MongoDB** ✅ (Running on localhost:27017)

## 🔧 Setup Steps

### Step 1: Create Environment File

Create a `.env` file in your backend directory (`FinalCraveCart/cravecart/backend/.env`):

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/cravecart

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Firebase Configuration
FIREBASE_PROJECT_ID=cravecartauth
```

### Step 2: Test Firebase OTP

1. **Open the test file**: `test-firebase-otp-simple.html` in your browser
2. **Enter your phone number**: +919081215550 (already pre-filled)
3. **Click "Send OTP"** - This will test Firebase phone authentication
4. **Check console** for any errors

### Step 3: Start Backend Server

```bash
cd FinalCraveCart/cravecart/backend
npm install
npm start
```

**Expected output:**
```
✅ Connected to MongoDB
🔥 Firebase Admin SDK initialized successfully
🚀 CraveCart Backend running on port 5000
```

### Step 4: Test Complete Flow

1. **Start your React app**: `npm start` in the frontend directory
2. **Navigate to login page**
3. **Enter phone number**: 9081215550 (without +91)
4. **Complete OTP verification**

## 🔍 Troubleshooting

### Issue: "Phone number and ID tokens required"

**Cause**: Backend is not receiving the ID token properly
**Solution**: 
- Check that `window.confirmationResult` is set in frontend
- Verify Firebase Admin SDK is initialized in backend
- Ensure JWT_SECRET is set in .env file

### Issue: "Firebase Admin SDK initialization failed"

**Cause**: Missing or invalid service account key
**Solution**:
- Verify `serviceAccountKey.json` exists in backend directory
- Check that the file contains valid Firebase project credentials
- Ensure the project ID matches your Firebase project

### Issue: "Phone number mismatch in token"

**Cause**: Phone number format inconsistency
**Solution**:
- Frontend sends: `+919081215550`
- Backend expects: `9081215550` (without +91)
- Firebase stores: `+919081215550`

## 📱 Testing Phone Numbers

For testing, you can use these numbers:
- **Your number**: +919081215550
- **Test numbers**: +1234567890, +9876543210

## 🔐 Security Notes

1. **JWT_SECRET**: Change this in production
2. **Service Account Key**: Never commit to version control
3. **Phone Verification**: Firebase handles the actual SMS sending
4. **Rate Limiting**: Backend has rate limiting enabled

## 🚀 Production Deployment

1. **Environment Variables**: Set all required env vars on your hosting platform
2. **Firebase Rules**: Configure proper security rules in Firebase Console
3. **HTTPS**: Ensure your domain uses HTTPS for Firebase to work
4. **Domain Verification**: Add your domain to Firebase Console

## 📞 Support

If you still face issues:

1. **Check browser console** for frontend errors
2. **Check backend logs** for server errors
3. **Verify Firebase Console** for authentication logs
4. **Test with simple HTML file** first to isolate issues

## ✅ Success Indicators

When everything works correctly:

1. ✅ Firebase Admin SDK initializes without errors
2. ✅ OTP is sent successfully (check Firebase Console)
3. ✅ OTP verification completes
4. ✅ User is created/logged in successfully
5. ✅ JWT token is generated and stored

---

**Remember**: The key is ensuring Firebase Admin SDK is properly initialized and the JWT_SECRET environment variable is set!
