#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🗺️ Applying Google Maps Live Tracking Implementation to Archi Branch\n');

// OrderTracking CSS
const orderTrackingCSS = `/* Order Tracking Component Styles */
.tracking-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  background: #f8f9fa;
  min-height: 100vh;
}

/* Header Section */
.tracking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.order-info h2 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1.5em;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 20px;
  color: white;
  font-weight: bold;
  font-size: 0.9em;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.status-icon {
  margin-right: 8px;
  font-size: 1.1em;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  color: #666;
  padding: 10px;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #f0f0f0;
  color: #333;
}

/* Main Content */
.tracking-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  min-height: 600px;
}

/* Map Section */
.map-section {
  position: relative;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.tracking-map {
  width: 100%;
  height: 500px;
  border-radius: 12px;
}

.last-update {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 0.8em;
  z-index: 1000;
}

/* Tracking Details */
.tracking-details {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.delivery-info,
.driver-info,
.restaurant-info {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.delivery-info h3,
.driver-info h3,
.restaurant-info h3 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 1.1em;
  display: flex;
  align-items: center;
}

.info-grid {
  display: grid;
  gap: 15px;
}

.info-item {
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.info-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.info-item strong {
  color: #666;
  font-size: 0.9em;
  display: block;
  margin-bottom: 5px;
}

.info-item p {
  margin: 0;
  color: #333;
  font-size: 1em;
}

.eta-time {
  font-size: 1.2em !important;
  font-weight: bold !important;
  color: #FF6B35 !important;
}

/* Driver Details */
.driver-details,
.restaurant-details {
  display: grid;
  gap: 10px;
}

.driver-details p,
.restaurant-details p {
  margin: 0;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
}

.driver-details p:last-child,
.restaurant-details p:last-child {
  border-bottom: none;
}

/* Live Tracking Notice */
.live-tracking-notice {
  background: linear-gradient(135deg, #FF6B35, #FF8E53);
  color: white;
  padding: 15px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  font-weight: bold;
  box-shadow: 0 2px 10px rgba(255, 107, 53, 0.3);
}

.pulse-dot {
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  margin-right: 10px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
  }
  
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
  }
  
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
}

/* Loading States */
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #FF6B35;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-spinner p {
  color: #666;
  font-size: 1.1em;
  margin: 0;
}

/* Error States */
.error-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 40px;
  text-align: center;
}

.error-message h3 {
  color: #F44336;
  margin: 0 0 15px 0;
  font-size: 1.3em;
}

.error-message p {
  color: #666;
  margin: 0 0 20px 0;
  font-size: 1em;
}

.error-message button {
  background: #FF6B35;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 1em;
  cursor: pointer;
  transition: background 0.3s ease;
}

.error-message button:hover {
  background: #e55a2b;
}

/* Responsive Design */
@media (max-width: 768px) {
  .tracking-container {
    padding: 10px;
  }
  
  .tracking-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .tracking-content {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .tracking-map {
    height: 300px;
  }
}`;

// TrackingPage component
const trackingPageJS = `import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import OrderTracking from '../components/OrderTracking';
import Navbar from '../components/Navbar';
import './TrackingPage.css';

const TrackingPage = () => {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [trackingOrderId, setTrackingOrderId] = useState('');
  const [showTracking, setShowTracking] = useState(false);
  const [error, setError] = useState('');

  // Get order ID from URL params or search params
  useEffect(() => {
    const orderIdFromUrl = orderId || searchParams.get('orderId');
    if (orderIdFromUrl) {
      setTrackingOrderId(orderIdFromUrl);
      setShowTracking(true);
    }
  }, [orderId, searchParams]);

  const handleTrackOrder = (e) => {
    e.preventDefault();
    setError('');

    if (!trackingOrderId.trim()) {
      setError('Please enter a valid order ID');
      return;
    }

    // Validate order ID format (should start with ORD)
    if (!trackingOrderId.startsWith('ORD')) {
      setError('Order ID should start with "ORD"');
      return;
    }

    setShowTracking(true);
    // Update URL without page reload
    navigate(\`/track/\${trackingOrderId}\`, { replace: true });
  };

  const handleBackToForm = () => {
    setShowTracking(false);
    setTrackingOrderId('');
    setError('');
    navigate('/track', { replace: true });
  };

  if (showTracking && trackingOrderId) {
    return (
      <>
        <Navbar />
        <OrderTracking 
          orderId={trackingOrderId} 
          onClose={handleBackToForm}
        />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="tracking-page">
        <div className="tracking-form-container">
          <div className="tracking-hero">
            <h1>📍 Track Your Order</h1>
            <p>Get real-time updates on your food delivery in Vadodara</p>
          </div>

          <div className="tracking-form-card">
            <form onSubmit={handleTrackOrder} className="tracking-form">
              <div className="form-group">
                <label htmlFor="orderId">Order ID</label>
                <input
                  type="text"
                  id="orderId"
                  value={trackingOrderId}
                  onChange={(e) => setTrackingOrderId(e.target.value)}
                  placeholder="Enter your order ID (e.g., ORD1234567890)"
                  className={error ? 'error' : ''}
                />
                {error && <span className="error-text">{error}</span>}
                <small className="help-text">
                  You can find your order ID in the confirmation email or SMS
                </small>
              </div>

              <button type="submit" className="track-btn">
                🔍 Track Order
              </button>
            </form>

            <div className="tracking-features">
              <h3>🚀 Live Tracking Features</h3>
              <div className="features-grid">
                <div className="feature-item">
                  <div className="feature-icon">🗺️</div>
                  <h4>Real-time Map</h4>
                  <p>See your delivery driver's live location on Google Maps</p>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">⏱️</div>
                  <h4>Accurate ETA</h4>
                  <p>Get precise delivery time estimates for Vadodara traffic</p>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">📱</div>
                  <h4>Driver Contact</h4>
                  <p>Direct contact with your delivery driver when needed</p>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🔔</div>
                  <h4>Status Updates</h4>
                  <p>Get notified at every step from kitchen to your doorstep</p>
                </div>
              </div>
            </div>
          </div>

          <div className="vadodara-info">
            <h3>🏙️ Delivering across Vadodara</h3>
            <div className="delivery-zones">
              <div className="zone-item">
                <strong>Central Vadodara</strong>
                <span>Free delivery • 20-25 mins</span>
              </div>
              <div className="zone-item">
                <strong>Sayajigunj & Alkapuri</strong>
                <span>₹20 delivery • 25-30 mins</span>
              </div>
              <div className="zone-item">
                <strong>Outer Areas</strong>
                <span>₹40 delivery • 35-45 mins</span>
              </div>
            </div>
          </div>

          <div className="sample-order">
            <h4>📝 Sample Order ID for Testing</h4>
            <p>
              Don't have an order? Try tracking with this sample order ID: 
              <button 
                className="sample-btn"
                onClick={() => {
                  setTrackingOrderId('ORD1234567890');
                  setError('');
                }}
              >
                ORD1234567890
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrackingPage;`;

// TrackingPage CSS
const trackingPageCSS = `/* Tracking Page Styles */
.tracking-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
}

.tracking-form-container {
  max-width: 800px;
  margin: 0 auto;
}

/* Hero Section */
.tracking-hero {
  text-align: center;
  margin-bottom: 40px;
  color: white;
}

.tracking-hero h1 {
  font-size: 2.5em;
  margin: 0 0 15px 0;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.tracking-hero p {
  font-size: 1.2em;
  margin: 0;
  opacity: 0.9;
}

/* Main Form Card */
.tracking-form-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.tracking-form {
  margin-bottom: 40px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #333;
  font-size: 1.1em;
}

.form-group input {
  width: 100%;
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1.1em;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input.error {
  border-color: #f44336;
  box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1);
}

.error-text {
  color: #f44336;
  font-size: 0.9em;
  margin-top: 5px;
  display: block;
}

.help-text {
  color: #666;
  font-size: 0.9em;
  margin-top: 5px;
  display: block;
}

.track-btn {
  width: 100%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 15px;
  border-radius: 10px;
  font-size: 1.2em;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.track-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

/* Features Section */
.tracking-features {
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #eee;
}

.tracking-features h3 {
  text-align: center;
  margin: 0 0 30px 0;
  color: #333;
  font-size: 1.3em;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

.feature-item {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 15px;
  transition: transform 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 2em;
  margin-bottom: 10px;
}

.feature-item h4 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 1em;
}

.feature-item p {
  margin: 0;
  color: #666;
  font-size: 0.85em;
  line-height: 1.4;
}

/* Vadodara Info Section */
.vadodara-info {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.vadodara-info h3 {
  text-align: center;
  margin: 0 0 25px 0;
  color: #333;
  font-size: 1.3em;
}

.delivery-zones {
  display: grid;
  gap: 15px;
}

.zone-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
  border-left: 4px solid #667eea;
}

.zone-item strong {
  color: #333;
  font-size: 1em;
}

.zone-item span {
  color: #666;
  font-size: 0.9em;
}

/* Sample Order Section */
.sample-order {
  background: white;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.sample-order h4 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 1.1em;
}

.sample-order p {
  margin: 0;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.sample-btn {
  background: #e3f2fd;
  color: #1976d2;
  border: 1px solid #1976d2;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-family: monospace;
  font-weight: bold;
  transition: all 0.3s ease;
}

.sample-btn:hover {
  background: #1976d2;
  color: white;
}

/* Responsive Design */
@media (max-width: 768px) {
  .tracking-page {
    padding: 20px 10px;
  }
  
  .tracking-hero h1 {
    font-size: 2em;
  }
  
  .tracking-form-card {
    padding: 25px;
    border-radius: 15px;
  }
  
  .features-grid {
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 15px;
  }
}`;

// Environment file
const envContent = `# Google Maps Configuration for Vadodara Food Delivery Tracking
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Backend API Configuration
REACT_APP_API_URL=http://localhost:5000/api

# Firebase Configuration (if using Firebase for additional features)
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id

# Vadodara Location Settings
REACT_APP_DEFAULT_CITY=Vadodara
REACT_APP_DEFAULT_STATE=Gujarat
REACT_APP_DEFAULT_COUNTRY=India

# Delivery Settings
REACT_APP_MAX_DELIVERY_DISTANCE=15
REACT_APP_FREE_DELIVERY_MINIMUM=300
REACT_APP_STANDARD_DELIVERY_FEE=40

# Environment
NODE_ENV=development`;

// Test tracking server
const testServerJS = `const express = require('express');
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
  
  console.log(\`📍 Tracking request for order: \${orderId}\`);
  
  if (!mockOrders[orderId]) {
    return res.status(404).json({ 
      error: 'Order not found',
      message: \`Order \${orderId} does not exist in test data\`,
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
  
  console.log(\`✅ Returning tracking data for \${orderId}\`);
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
  console.log(\`\\n🚀 Test Tracking Server running on http://localhost:\${PORT}\`);
  console.log(\`📍 Health check: http://localhost:\${PORT}/api/health\`);
  console.log(\`🧪 Test tracking: http://localhost:\${PORT}/api/orders/tracking/ORD1234567890\`);
  console.log('\\n🗺️  Ready for Google Maps testing!\\n');
});

module.exports = app;`;

// Apply all files
function createFile(filePath, content, description) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, content);
    console.log(`✅ Created: ${filePath} - ${description}`);
  } catch (error) {
    console.error(`❌ Failed to create ${filePath}:`, error.message);
  }
}

console.log('📝 Creating all tracking implementation files...\n');

// Create all files
createFile('src/components/OrderTracking.css', orderTrackingCSS, 'OrderTracking component styles');
createFile('src/pages/TrackingPage.js', trackingPageJS, 'TrackingPage component');
createFile('src/pages/TrackingPage.css', trackingPageCSS, 'TrackingPage styles');
createFile('.env.example', envContent, 'Environment configuration example');
createFile('backend/test-tracking-server.js', testServerJS, 'Test tracking server');

console.log('\n🎉 All Google Maps tracking files have been applied to the archi branch!');
console.log('\n📋 Next steps:');
console.log('1. Update src/App.js to add tracking routes');
console.log('2. Update src/components/Navbar.js to add tracking link');
console.log('3. Get Google Maps API key and update .env file');
console.log('4. Test the implementation');
console.log('\n🚀 Ready for Google Maps live tracking in Vadodara!');