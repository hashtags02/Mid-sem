# Firebase Authentication Setup Guide

This guide will help you set up Firebase Authentication to replace the Twilio OTP system.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "CraveCart")
4. Follow the setup wizard (you can disable Google Analytics for now)
5. Click "Create project"

## Step 2: Enable Phone Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Click on "Phone" provider
5. Enable it and click "Save"

## Step 3: Get Your Firebase Configuration

1. In your Firebase project, click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>)
5. Register your app with a nickname (e.g., "CraveCart Web")
6. Copy the Firebase configuration object

## Step 4: Update Firebase Configuration

1. Open `src/firebase.js` in your project
2. Replace the placeholder configuration with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

## Step 5: Test the Authentication

1. Start your React app: `npm start`
2. Start your backend server: `cd backend && npm start`
3. Go to the login page
4. Enter a phone number and click "Send OTP"
5. Complete the reCAPTCHA verification
6. Enter the OTP received on your phone
7. You should be redirected to the dashboard upon successful verification

## Important Notes

- **Phone Number Format**: Make sure to enter phone numbers with the country code (e.g., +91 for India)
- **reCAPTCHA**: Firebase Phone Auth requires reCAPTCHA verification
- **Test Phone Numbers**: For development, you can use test phone numbers provided by Firebase
- **Production**: For production, you'll need to add your domain to the authorized domains in Firebase Console

## Troubleshooting

1. **reCAPTCHA not loading**: Make sure your domain is added to authorized domains in Firebase Console
2. **OTP not received**: Check if the phone number format is correct and the number is valid
3. **Firebase config errors**: Double-check your Firebase configuration in `src/firebase.js`

## Environment Variables

Make sure your `.env` file in the backend directory has the necessary variables:

```
MONGO_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
```

The Twilio-related environment variables are no longer needed since we're using Firebase for OTP. 