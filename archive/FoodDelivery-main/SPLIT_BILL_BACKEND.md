# Split Bill Backend Integration

## Overview

The split bill functionality is now fully integrated with the backend database. All split bill data is saved when an order is placed and can be retrieved later.

## What Gets Saved in Backend

### 1. Order Model Structure

The `Order` model includes a comprehensive `splitBill` object:

```javascript
splitBill: {
  enabled: Boolean,           // Whether split bill is enabled
  type: String,              // 'equal' or 'manual'
  numberOfPeople: Number,    // Number of people splitting
  equalSplitAmount: Number,  // Amount per person (for equal split)
  manualSplit: [{            // Array of people and amounts (for manual split)
    name: String,            // Person's name
    amount: Number           // Amount they're paying
  }],
  totalAllocated: Number,    // Total amount allocated across all people
  remainingAmount: Number    // Remaining amount (should be 0 for valid splits)
}
```

### 2. Data Persistence

When a user places an order:

1. **Cart Items**: All items in the cart are saved with quantities and prices
2. **Split Bill Configuration**: Complete split bill setup is saved
3. **Validation**: Backend validates that manual splits don't exceed total
4. **Calculations**: Backend automatically calculates equal split amounts and remaining amounts

### 3. API Endpoints

#### Create Order with Split Bill
```
POST /api/orders
```

**Request Body:**
```javascript
{
  "items": [...],
  "restaurantId": "...",
  "deliveryAddress": {...},
  "paymentMethod": "cash",
  "splitBill": {
    "enabled": true,
    "type": "manual", // or "equal"
    "numberOfPeople": 3,
    "manualSplit": [
      { "name": "John", "amount": 150 },
      { "name": "Jane", "amount": 200 },
      { "name": "Bob", "amount": 100 }
    ]
  }
}
```

#### Get Order with Split Bill Data
```
GET /api/orders/:id
```

**Response includes:**
```javascript
{
  "order": {
    "_id": "...",
    "totalAmount": 450,
    "splitBill": {
      "enabled": true,
      "type": "manual",
      "numberOfPeople": 3,
      "manualSplit": [...],
      "totalAllocated": 450,
      "remainingAmount": 0
    }
  },
  "orderSummary": {
    "totalItems": 5,
    "totalAmount": 450,
    "splitBillInfo": {...}
  }
}
```

## Database Schema

### Order Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId,           // Reference to User
  restaurant: ObjectId,     // Reference to Restaurant
  items: [{
    dish: ObjectId,         // Reference to Dish
    name: String,
    price: Number,
    quantity: Number,
    photo: String
  }],
  totalAmount: Number,
  deliveryAddress: {...},
  paymentMethod: String,
  orderStatus: String,
  splitBill: {
    enabled: Boolean,
    type: String,
    numberOfPeople: Number,
    equalSplitAmount: Number,
    manualSplit: [{
      name: String,
      amount: Number
    }],
    totalAllocated: Number,
    remainingAmount: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

## Validation Rules

### Backend Validation
1. **Equal Split**: Automatically calculates amount per person
2. **Manual Split**: 
   - All people must have names
   - Total allocated amount cannot exceed order total
   - Remaining amount is calculated automatically
3. **Order Creation**: Only valid splits are allowed

### Frontend Validation
1. **Real-time Validation**: Shows validation errors immediately
2. **Checkout Prevention**: Disables checkout if split bill is invalid
3. **User Feedback**: Clear error messages and visual indicators

## Usage Examples

### Equal Split
```javascript
// Frontend sends
{
  "splitBill": {
    "enabled": true,
    "type": "equal",
    "numberOfPeople": 4
  }
}

// Backend calculates
{
  "splitBill": {
    "enabled": true,
    "type": "equal",
    "numberOfPeople": 4,
    "equalSplitAmount": 125,  // 500 / 4 = 125
    "totalAllocated": 500,
    "remainingAmount": 0
  }
}
```

### Manual Split
```javascript
// Frontend sends
{
  "splitBill": {
    "enabled": true,
    "type": "manual",
    "numberOfPeople": 3,
    "manualSplit": [
      { "name": "Alice", "amount": 200 },
      { "name": "Bob", "amount": 150 },
      { "name": "Charlie", "amount": 150 }
    ]
  }
}

// Backend validates and saves
{
  "splitBill": {
    "enabled": true,
    "type": "manual",
    "numberOfPeople": 3,
    "manualSplit": [...],
    "totalAllocated": 500,
    "remainingAmount": 0
  }
}
```

## Benefits

1. **Data Persistence**: Split bill data survives page refreshes and app restarts
2. **Order History**: Users can view their split bill history
3. **Restaurant Management**: Restaurants can see split bill details for orders
4. **Analytics**: Split bill patterns can be analyzed
5. **Audit Trail**: Complete record of how bills were split

## Security

- Only authenticated users can create orders
- Users can only view their own orders
- Restaurant owners can only view orders for their restaurants
- All data is validated on both frontend and backend
