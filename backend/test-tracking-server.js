const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock order data for testing
const mockOrders = {
  'ORD1234567890': {
    orderId: 'ORD1234567890',
    status: 'out_for_delivery',
    restaurant: {
      name: 'Vadodara Delights Restaurant',
      location: {
        latitude: 22.3072,
        longitude: 73.1812
      },
      address: 'Sayajigunj Main Road, Vadodara, Gujarat',
      phone: '+91 265 123 4567'
    },
    deliveryAddress: {
      street: 'Alkapuri Society, Block A, Flat 304',
      city: 'Vadodara',
      state: 'Gujarat',
      coordinates: {
        latitude: 22.2950,
        longitude: 73.2020
      }
    },
    driver: {
      name: 'Rahul Patel',
      phone: '+91 98765 43210',
      vehicleNumber: 'GJ-06-AB-1234',
      rating: 4.8
    },
    tracking: {
      currentLocation: {
        latitude: 22.3010 + (Math.random() - 0.5) * 0.005,
        longitude: 73.1900 + (Math.random() - 0.5) * 0.005,
        address: 'Moving towards Alkapuri, Vadodara',
        timestamp: new Date().toISOString()
      },
      estimatedDeliveryTime: new Date(Date.now() + 15 * 60000).toISOString(),
      estimatedTimeRemaining: 12 + Math.floor(Math.random() * 6),
      distanceRemaining: (2.1 + Math.random() * 0.8).toFixed(1),
      deliveryPath: [
        {
          latitude: 22.3072,
          longitude: 73.1812,
          address: 'Restaurant - Sayajigunj',
          timestamp: new Date(Date.now() - 10 * 60000).toISOString()
        },
        {
          latitude: 22.3045,
          longitude: 73.1850,
          address: 'Sayajigunj Circle',
          timestamp: new Date(Date.now() - 8 * 60000).toISOString()
        },
        {
          latitude: 22.3010,
          longitude: 73.1900,
          address: 'Current Location - En route',
          timestamp: new Date().toISOString()
        }
      ],
      lastUpdate: new Date().toISOString()
    }
  }
};

// Get tracking data by order ID
app.get('/api/orders/tracking/:orderId', (req, res) => {
  const { orderId } = req.params;
  
  console.log(`📍 Tracking request for order: ${orderId}`);
  
  if (!mockOrders[orderId]) {
    return res.status(404).json({ 
      error: 'Order not found',
      message: `Order ${orderId} does not exist in test data`,
      availableOrders: Object.keys(mockOrders)
    });
  }

  // Simulate real-time updates for out_for_delivery orders
  const order = { ...mockOrders[orderId] };
  
  if (order.status === 'out_for_delivery' && order.tracking.currentLocation) {
    // Slightly move the driver towards destination (simulate movement)
    const current = order.tracking.currentLocation;
    const destination = order.deliveryAddress.coordinates;
    
    // Move 10% closer to destination each time
    const moveRatio = 0.1;
    current.latitude += (destination.latitude - current.latitude) * moveRatio;
    current.longitude += (destination.longitude - current.longitude) * moveRatio;
    current.timestamp = new Date().toISOString();
    
    // Update estimated time
    order.tracking.estimatedTimeRemaining = Math.max(1, 
      order.tracking.estimatedTimeRemaining - (1 + Math.random())
    );
    
    // Update distance
    const distance = calculateDistance(
      current.latitude, current.longitude,
      destination.latitude, destination.longitude
    );
    order.tracking.distanceRemaining = distance.toFixed(1);
    
    // Add to delivery path
    order.tracking.deliveryPath.push({
      latitude: current.latitude,
      longitude: current.longitude,
      address: 'Updated location',
      timestamp: current.timestamp
    });
    
    // Keep only last 10 path points
    if (order.tracking.deliveryPath.length > 10) {
      order.tracking.deliveryPath = order.tracking.deliveryPath.slice(-10);
    }
  }
  
  console.log(`✅ Returning tracking data for ${orderId}`);
  res.json(order);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Test tracking server is running',
    timestamp: new Date().toISOString(),
    availableOrders: Object.keys(mockOrders)
  });
});

// Utility function to calculate distance
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Test Tracking Server running on http://localhost:${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🧪 Test tracking: http://localhost:${PORT}/api/orders/tracking/ORD1234567890`);
  console.log('\n🗺️  Ready for Google Maps testing!\n');
});

module.exports = app;