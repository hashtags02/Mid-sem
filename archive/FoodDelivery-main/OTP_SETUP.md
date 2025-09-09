# OTP-Based Authentication Setup for CraveCart

## Overview
This document explains how to set up and use the new OTP-based authentication system for CraveCart. The system uses Firebase Phone Authentication for sending and verifying OTPs, combined with a custom backend for user management.

## Features
- **Phone Number Verification**: Users enter their phone number to start authentication
- **Automatic User Detection**: System automatically detects if the phone number is registered
- **OTP via Firebase**: Secure OTP delivery through Firebase Phone Authentication
- **Seamless Login/Registration**: Single flow handles both new and existing users
- **User Profile Creation**: New users can provide additional details during registration

## Flow Diagram
```
User enters phone number
         ↓
System checks if number exists
         ↓
┌─────────────────┬─────────────────┐
│   Existing User │   New User      │
│        ↓        │        ↓        │
│   Send Login    │ Send Registration│
│      OTP        │      OTP        │
│        ↓        │        ↓        │
│   Verify OTP    │  Fill Details   │
│        ↓        │        ↓        │
│   Login User    │  Verify OTP     │
│                 │        ↓        │
│                 │  Create User    │
└─────────────────┴─────────────────┘
```

## Backend API Endpoints

### 1. Check Phone Number
```http
POST /api/auth/check-phone
Content-Type: application/json

{
  "phoneNumber": "9876543210"
}
```

**Response:**
```json
{
  "isRegistered": true,
  "message": "Phone number is registered"
}
```

### 2. Send Login OTP
```http
POST /api/auth/send-login-otp
Content-Type: application/json

{
  "phoneNumber": "9876543210"
}
```

### 3. Send Registration OTP
```http
POST /api/auth/send-registration-otp
Content-Type: application/json

{
  "phoneNumber": "9876543210"
}
```

### 4. Verify Login OTP
```http
POST /api/auth/verify-login-otp
Content-Type: application/json

{
  "phoneNumber": "9876543210",
  "otp": "123456"
}
```

### 5. Verify Registration OTP
```http
POST /api/auth/verify-registration-otp
Content-Type: application/json

{
  "phoneNumber": "9876543210",
  "otp": "123456",
  "userData": {
    "name": "John Doe",
    "email": "john@example.com",
    "address": "123 Main St"
  }
}
```

## Frontend Components

### PhoneNumberInput Component
The main component that handles the entire OTP flow:

- **Phone Input**: User enters phone number
- **User Details**: New users fill in profile information
- **OTP Verification**: Users enter the 6-digit OTP
- **Error Handling**: Displays validation and API errors
- **Loading States**: Shows appropriate loading indicators

### Key Features:
- Automatic phone number formatting (adds +91 for India)
- Input validation and sanitization
- Responsive design for mobile and desktop
- Integration with Firebase OTP service
- Backend API integration for user management

## Firebase Configuration

### Required Setup:
1. **Firebase Project**: Create a project in Firebase Console
2. **Phone Authentication**: Enable Phone Authentication in Firebase
3. **reCAPTCHA**: Configure reCAPTCHA v3 for web
4. **Service Account**: Download service account key for backend

### Frontend Configuration:
```javascript
// src/firebase.js
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  // ... other config
};

export const auth = getAuth(app);
```

### Backend Configuration:
```javascript
// backend/server.js
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
```

## Environment Variables

### Backend (.env):
```env
MONGODB_URI=mongodb://localhost:27017/cravecart
JWT_SECRET=your-jwt-secret
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

### Frontend:
No additional environment variables needed for OTP functionality.

## Usage Examples

### Basic Implementation:
```jsx
import PhoneNumberInput from './components/PhoneNumberInput';

function LoginPage() {
  const handleAuthSuccess = (user) => {
    console.log('User authenticated:', user);
    // Redirect to dashboard or home
  };

  return (
    <PhoneNumberInput 
      onSuccess={handleAuthSuccess}
      onBack={() => navigate('/')}
    />
  );
}
```

### Custom Styling:
The component uses CSS classes that can be customized:
- `.phone-input-container`: Main container
- `.input-group`: Input field wrapper
- `.primary-button`: Primary action buttons
- `.secondary-button`: Secondary action buttons
- `.error-message`: Error display
- `.resend-section`: OTP resend functionality

## Security Features

1. **Phone Number Validation**: Server-side validation of phone numbers
2. **OTP Verification**: Firebase handles secure OTP delivery
3. **Rate Limiting**: Backend implements rate limiting for API endpoints
4. **JWT Tokens**: Secure session management with JWT
5. **Input Sanitization**: Client and server-side input validation

## Testing

### Test Phone Numbers:
For development, you can use Firebase's test phone numbers:
- `+1 650-555-1234` (US)
- `+91 98765-43210` (India - custom)

### Testing Flow:
1. Enter a test phone number
2. Firebase will send a test OTP
3. Verify the OTP to complete authentication
4. Check backend logs for API calls

## Troubleshooting

### Common Issues:

1. **reCAPTCHA not loading**:
   - Check Firebase configuration
   - Verify domain is whitelisted in Firebase Console

2. **OTP not received**:
   - Check phone number format
   - Verify Firebase Phone Authentication is enabled
   - Check browser console for errors

3. **Backend API errors**:
   - Verify MongoDB connection
   - Check JWT_SECRET environment variable
   - Review server logs for detailed errors

### Debug Mode:
Enable debug logging in the frontend:
```javascript
// In PhoneNumberInput component
console.log('Phone number:', phoneNumber);
console.log('Step:', step);
console.log('Error:', error);
```

## Future Enhancements

1. **SMS Fallback**: Add SMS delivery as backup to Firebase
2. **Voice OTP**: Implement voice-based OTP delivery
3. **Multi-factor Authentication**: Add additional security layers
4. **Biometric Authentication**: Integrate fingerprint/face recognition
5. **Social Login**: Add Google, Facebook, etc. login options

## Support

For technical support or questions about the OTP system:
1. Check Firebase Console for authentication logs
2. Review backend server logs
3. Check browser console for frontend errors
4. Verify all environment variables are set correctly
