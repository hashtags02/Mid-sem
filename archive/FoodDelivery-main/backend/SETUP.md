# 🚀 Quick Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation Steps

### 1. Install Dependencies
```bash
cd FinalCraveCart/cravecart/backend
npm install
```

### 2. Environment Setup
```bash
# Copy the example environment file
cp env.example .env

# Edit .env with your configuration
# At minimum, set:
# - JWT_SECRET (any random string)
# - MONGODB_URI (your MongoDB connection string)
```

### 3. Start MongoDB
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env
```

### 4. Start the Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

### 5. Test the API
```bash
# Run the test script
npm test
```

## API Endpoints

### Health Check
```bash
GET http://localhost:5000/api/health
```

### Restaurants
```bash
GET http://localhost:5000/api/restaurants
GET http://localhost:5000/api/restaurants/:id
GET http://localhost:5000/api/restaurants/slug/:slug
```

### Dishes
```bash
GET http://localhost:5000/api/dishes
GET http://localhost:5000/api/dishes/:id
```

### Authentication
```bash
POST http://localhost:5000/api/auth/register
POST http://localhost:5000/api/auth/login
GET http://localhost:5000/api/auth/me
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `JWT_SECRET` | ✅ | Secret key for JWT tokens |
| `MONGODB_URI` | ✅ | MongoDB connection string |
| `PORT` | ❌ | Server port (default: 5000) |
| `NODE_ENV` | ❌ | Environment (default: development) |
| `FRONTEND_URL` | ❌ | Frontend URL for CORS |

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check your connection string
- For Atlas: whitelist your IP address

### Port Already in Use
- Change PORT in .env
- Or kill the process using port 5000

### JWT Issues
- Set a strong JWT_SECRET
- Ensure it's at least 32 characters long

## Next Steps

1. **Connect Frontend**: Update your React app to use these API endpoints
2. **Add Data**: Create restaurants and dishes using the API
3. **Implement Orders**: Complete the order management system
4. **Add Features**: Implement ratings, reviews, favorites, etc.
5. **Deploy**: Deploy to production (Heroku, Vercel, etc.)

## Support

If you encounter issues:
1. Check the console logs
2. Verify your environment variables
3. Ensure MongoDB is running
4. Check the API documentation in README.md
