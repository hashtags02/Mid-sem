# Checkout Debugging Guide

## "Failed to Fetch" Error Troubleshooting

If you're getting a "failed to fetch" error when clicking "Proceed to Checkout", follow these steps:

### 1. Check Backend Server Status

**Start the backend server:**
```bash
cd FoodDelivery-main/backend
npm install
npm start
```

**Expected output:**
```
✅ Connected to MongoDB
🔥 Firebase Admin SDK initialized successfully
Server running on port 5000
```

### 2. Check Frontend Console

Open browser developer tools (F12) and check the console for:
- Authentication token status
- Backend health check results
- API request details

**Look for these logs:**
```
Token is valid, user ID: [some-id]
Backend is running
Creating order with data: {...}
API URL: http://localhost:5000/api/orders
Auth token exists: true
```

### 3. Authentication Issues

**If you see "Please login to place an order":**
1. Go to the login page
2. Login with your phone number
3. Complete the OTP verification
4. Try checkout again

**If you see "Your session has expired":**
1. Clear browser storage: `localStorage.clear()`
2. Login again
3. Try checkout again

### 4. Backend Connection Issues

**If you see "Cannot connect to server":**

1. **Check if backend is running:**
   ```bash
   curl http://localhost:5000/api/health
   ```
   Should return: `{"status":"OK","message":"CraveCart Backend is running!"}`

2. **Check MongoDB connection:**
   - Ensure MongoDB is running
   - Check your `.env` file has `MONGODB_URI`

3. **Check Firebase setup:**
   - Ensure `serviceAccountKey.json` exists in backend folder
   - Verify Firebase configuration

### 5. Common Issues & Solutions

#### Issue: "Backend health check failed"
**Solution:** Start the backend server on port 5000

#### Issue: "No token, authorization denied"
**Solution:** Login to the application first

#### Issue: "Token is not valid"
**Solution:** Clear localStorage and login again

#### Issue: "Restaurant not found"
**Solution:** The restaurant ID in cart items is invalid

#### Issue: "Validation failed"
**Solution:** Check that all required fields are provided

### 6. Testing Steps

1. **Add items to cart** from any restaurant
2. **Enable split bill** (optional)
3. **Login** to the application
4. **Click "Proceed to Checkout"**
5. **Check console** for detailed error messages

### 7. Manual API Testing

**Test the orders endpoint manually:**
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "items": [{"dish": "test-dish", "name": "Test Item", "price": 100, "quantity": 1, "photo": "test.jpg"}],
    "restaurantId": "dominos-pizza",
    "deliveryAddress": {"street": "123 Test St", "city": "Test City"},
    "paymentMethod": "cash",
    "splitBill": {"enabled": false}
  }'
```

### 8. Environment Variables

**Ensure these are set in backend/.env:**
```
MONGODB_URI=mongodb://localhost:27017/cravecart
JWT_SECRET=your_jwt_secret_here
```

### 9. Database Setup

**Ensure MongoDB collections exist:**
- `users` - for user authentication
- `restaurants` - for restaurant data
- `dishes` - for menu items
- `orders` - for order storage

### 10. Firebase Setup

**Ensure Firebase is configured:**
- `serviceAccountKey.json` in backend folder
- Firebase project properly set up
- OTP verification working

## Quick Fix Checklist

- [ ] Backend server running on port 5000
- [ ] MongoDB connected
- [ ] Firebase configured
- [ ] User logged in with valid JWT token
- [ ] Cart has items with proper IDs
- [ ] No CORS issues
- [ ] All environment variables set

## Still Having Issues?

1. Check the browser console for specific error messages
2. Check the backend server logs for errors
3. Verify all dependencies are installed
4. Ensure all files are properly saved
5. Try clearing browser cache and localStorage
