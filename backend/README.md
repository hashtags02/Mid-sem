# 🍽️ CraveCart Backend API

A robust Node.js/Express backend for the CraveCart food delivery platform with MongoDB database.

## 🚀 Features

- **Restaurant Management** - CRUD operations for restaurants
- **Menu Management** - Dish management with categories and customizations
- **User Authentication** - JWT-based authentication with role-based access
- **Search & Filtering** - Advanced search with multiple filters
- **Rating & Reviews** - Dish and restaurant rating system
- **Image Upload** - Cloudinary integration for image storage
- **Order Management** - Complete order lifecycle
- **Real-time Updates** - WebSocket support for live updates

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer + Cloudinary
- **Validation**: Express-validator
- **Security**: Helmet, CORS, Rate Limiting

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🔧 Installation

1. **Clone the repository**
   ```bash
   cd FinalCraveCart/cravecart/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the backend directory:
   ```env
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

   # Cloudinary Configuration (for image uploads)
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   ```

4. **Start MongoDB**
   ```bash
   # Local MongoDB
   mongod

   # Or use MongoDB Atlas (cloud)
   # Update MONGODB_URI in .env
   ```

5. **Run the server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## 📚 API Endpoints

### 🔐 Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### 🏪 Restaurants
- `GET /api/restaurants` - Get all restaurants (with filters)
- `GET /api/restaurants/:id` - Get restaurant by ID
- `GET /api/restaurants/slug/:slug` - Get restaurant by slug
- `POST /api/restaurants` - Create restaurant (Private)
- `PUT /api/restaurants/:id` - Update restaurant (Private)
- `DELETE /api/restaurants/:id` - Delete restaurant (Private)
- `GET /api/restaurants/:id/menu` - Get restaurant menu

### 🍽️ Dishes
- `GET /api/dishes` - Get all dishes (with filters)
- `GET /api/dishes/:id` - Get dish by ID
- `POST /api/dishes` - Create dish (Private)
- `PUT /api/dishes/:id` - Update dish (Private)
- `DELETE /api/dishes/:id` - Delete dish (Private)
- `POST /api/dishes/:id/rate` - Rate a dish (Private)

### 👥 Users
- `GET /api/users/profile` - Get user profile (Private)
- `PUT /api/users/profile` - Update user profile (Private)
- `GET /api/users/orders` - Get user orders (Private)
- `POST /api/users/favorites` - Add to favorites (Private)

### 📦 Orders
- `GET /api/orders` - Get all orders (Private)
- `POST /api/orders` - Create order (Private)
- `GET /api/orders/:id` - Get order by ID (Private)
- `PUT /api/orders/:id/status` - Update order status (Private)

## 🗄️ Database Models

### Restaurant Schema
```javascript
{
  name: String,
  slug: String,
  description: String,
  photo: String,
  cuisines: [String],
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  contact: {
    phone: String,
    email: String
  },
  timings: {
    open: String,
    close: String,
    daysOpen: [String]
  },
  rating: Number,
  ratingCount: Number,
  deliveryFee: Number,
  minimumOrder: Number,
  isActive: Boolean,
  isVegOnly: Boolean,
  owner: ObjectId
}
```

### Dish Schema
```javascript
{
  name: String,
  description: String,
  price: Number,
  image: String,
  category: String,
  isVeg: Boolean,
  isSpicy: Boolean,
  isPopular: Boolean,
  isAvailable: Boolean,
  preparationTime: Number,
  calories: Number,
  allergens: [String],
  ingredients: [String],
  restaurant: ObjectId,
  customizations: [{
    name: String,
    options: [{
      name: String,
      price: Number
    }]
  }],
  ratings: [{
    user: ObjectId,
    rating: Number,
    review: String,
    date: Date
  }],
  averageRating: Number,
  totalRatings: Number
}
```

### User Schema
```javascript
{
  name: String,
  email: String,
  phone: String,
  password: String,
  avatar: String,
  role: String,
  addresses: [{
    type: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      landmark: String
    },
    isDefault: Boolean
  }],
  preferences: {
    isVegOnly: Boolean,
    spiceLevel: String,
    notifications: {
      email: Boolean,
      sms: Boolean,
      push: Boolean
    }
  },
  isActive: Boolean,
  isEmailVerified: Boolean,
  isPhoneVerified: Boolean,
  lastLogin: Date,
  favoriteRestaurants: [ObjectId],
  favoriteDishes: [ObjectId]
}
```

## 🔍 Search & Filtering

### Restaurant Search
```bash
GET /api/restaurants?search=pizza&cuisine=Italian&rating=4&isVegOnly=true&sortBy=rating&order=desc&page=1&limit=10
```

### Menu Search
```bash
GET /api/restaurants/:id/menu?category=Pizza&isVeg=true&search=margherita
```

## 🔐 Authentication

All private routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/cravecart |
| `JWT_SECRET` | JWT secret key | Required |
| `JWT_EXPIRE` | JWT expiration time | 7d |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Required |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Required |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Required |

## 🚀 Deployment

### Heroku
1. Create Heroku app
2. Set environment variables
3. Deploy:
   ```bash
   git push heroku main
   ```

### Vercel
1. Install Vercel CLI
2. Deploy:
   ```bash
   vercel
   ```

### Docker
```bash
# Build image
docker build -t cravecart-backend .

# Run container
docker run -p 5000:5000 cravecart-backend
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## 📊 Health Check

```bash
GET /api/health
```

Response:
```json
{
  "status": "OK",
  "message": "CraveCart Backend is running!",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@cravecart.com or create an issue in the repository.
