# 🧪 Testing Your OTP System

## 🚀 Quick Start Testing

### 1. **Start the Test Backend**
```bash
cd FinalCraveCart/cravecart/backend
node test-server.js
```
You should see:
```
🧪 CraveCart Test Backend running on port 5000
📊 Health check: http://localhost:5000/api/health
👥 Test users: http://localhost:5000/api/test/users
🔐 OTP endpoints ready for testing!
```

### 2. **Open the Test Page**
Open `test-otp.html` in your browser. This will automatically check if the server is running.

### 3. **Run Tests**
- **Individual Tests**: Use each test button to test specific functionality
- **Full Test Suite**: Click "Run Full Test Suite" to test everything automatically

## 📱 Test Scenarios

### **Existing User Login Flow**
1. **Phone Number**: `9876543210` (pre-loaded test user)
2. **Click**: "Send Login OTP"
3. **Enter OTP**: `123456` (test OTP)
4. **Click**: "Verify Login OTP"
5. **Expected**: Success message with user data

### **New User Registration Flow**
1. **Phone Number**: `1234567890` (or any new number)
2. **Click**: "Send Registration OTP"
3. **Fill Details**: Name, Email, Address
4. **Click**: "Continue"
5. **Enter OTP**: `123456` (test OTP)
6. **Click**: "Verify Registration OTP"
7. **Expected**: Success message with new user data

## 🔍 What's Being Tested

### **Backend Endpoints**
- ✅ `/api/health` - Server status
- ✅ `/api/auth/check-phone` - Phone number validation
- ✅ `/api/auth/send-login-otp` - Login OTP sending
- ✅ `/api/auth/send-registration-otp` - Registration OTP sending
- ✅ `/api/auth/verify-login-otp` - Login OTP verification
- ✅ `/api/auth/verify-registration-otp` - Registration OTP verification
- ✅ `/api/test/users` - Get all test users

### **Frontend Integration**
- ✅ Phone number input validation
- ✅ OTP input handling
- ✅ User details form
- ✅ Error handling
- ✅ Success responses

## 🎯 Test Data

### **Pre-loaded Test User**
```json
{
  "id": "1",
  "name": "Test User",
  "email": "test@example.com",
  "phone": "9876543210",
  "address": "Test Address",
  "verified": true,
  "role": "customer"
}
```

### **Test OTP**
- **All OTPs**: `123456` (for testing purposes)
- **Format**: 6-digit numbers only
- **Validation**: Backend accepts any 6-digit OTP in test mode

## 🚨 Troubleshooting

### **Server Not Running**
```
❌ Error: Failed to fetch
```
**Solution**: Make sure `test-server.js` is running on port 5000

### **CORS Issues**
```
❌ CORS error in browser console
```
**Solution**: Check that the backend CORS origin is set to `http://localhost:3000`

### **Port Already in Use**
```
❌ EADDRINUSE: address already in use :::5000
```
**Solution**: 
1. Find process using port 5000: `netstat -ano | findstr :5000`
2. Kill the process or use a different port

### **API Endpoints Not Found**
```
❌ 404: Route not found
```
**Solution**: Check that the test server is running and the routes are properly defined

## 🔧 Advanced Testing

### **Custom Phone Numbers**
- Test with different phone number formats
- Test with invalid phone numbers
- Test edge cases (very long, very short)

### **OTP Validation**
- Test with invalid OTP formats
- Test with wrong OTP codes
- Test OTP length validation

### **User Data Validation**
- Test with missing required fields
- Test with invalid email formats
- Test with very long input data

## 📊 Expected Test Results

### **Successful Tests**
- ✅ Green success messages
- ✅ Proper JSON responses
- ✅ User data returned correctly
- ✅ Phone number status updated

### **Error Tests**
- ❌ Red error messages
- ❌ Proper error codes
- ❌ Descriptive error messages
- ❌ Validation errors for invalid input

## 🎉 Success Criteria

Your OTP system is working correctly if:
1. **All API endpoints respond** without errors
2. **Phone number checking works** for both existing and new users
3. **OTP sending works** for both login and registration
4. **OTP verification works** and returns proper user data
5. **User registration creates** new users correctly
6. **Error handling works** for invalid inputs
7. **Frontend integration** works smoothly

## 🚀 Next Steps

After successful testing:
1. **Integrate with Firebase** for real OTP delivery
2. **Connect to MongoDB** for persistent user storage
3. **Add real JWT tokens** for authentication
4. **Implement rate limiting** for production use
5. **Add security measures** like phone number validation

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Check the backend terminal for server errors
3. Verify all dependencies are installed
4. Ensure ports are not blocked by firewall
5. Check that the test server is running

---

**Happy Testing! 🎯**
