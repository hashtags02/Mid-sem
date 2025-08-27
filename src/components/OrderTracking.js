import React, { useState } from 'react';
import LeafletTracking from './LeafletTracking';
import { GOOGLE_MAPS_CONFIG } from '../config/googleMaps';
import './OrderTracking.css';

const OrderTracking = ({ orderId, onClose }) => {
  const [orderData] = useState({ status: 'out_for_delivery', orderId });
  const [isLoading] = useState(false);
  const [error] = useState(null);

  // Load Google Maps
  // Google Maps implementation replaced by Leaflet (OSM) for free usage

  // Fetch order tracking data
  // Tracking data is now loaded within LeafletTracking via /api/orders/:id

  // Removed Google Maps imperative code

  // Get status color and icon
  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { color: '#FFA500', icon: '⏳', text: 'Order Received' },
      confirmed: { color: '#4CAF50', icon: '✅', text: 'Order Confirmed' },
      preparing: { color: '#2196F3', icon: '👨‍🍳', text: 'Being Prepared' },
      ready: { color: '#9C27B0', icon: '📦', text: 'Ready for Pickup' },
      out_for_delivery: { color: '#FF6B35', icon: '🚗', text: 'Out for Delivery' },
      delivered: { color: '#4CAF50', icon: '🎉', text: 'Delivered' },
      cancelled: { color: '#F44336', icon: '❌', text: 'Cancelled' }
    };
    
    return statusMap[status] || { color: '#757575', icon: '❓', text: 'Unknown' };
  };

  // Format time remaining
  const formatTimeRemaining = (minutes) => {
    if (!minutes) return 'Calculating...';
    
    if (minutes < 60) {
      return `${minutes} min${minutes !== 1 ? 's' : ''}`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}m`;
    }
  };

  // Initialization handled by LeafletTracking + sockets

  if (isLoading) {
    return (
      <div className="tracking-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading tracking information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tracking-container">
        <div className="error-message">
          <h3>⚠️ Error</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="tracking-container">
        <div className="error-message">
          <h3>📦 Order Not Found</h3>
          <p>Unable to find tracking information for order: {orderId}</p>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(orderData.status);

  return (
    <div className="tracking-container">
      <div className="tracking-header">
        <div className="order-info">
          <h2>🍕 Order #{orderData.orderId}</h2>
          <div className="status-badge" style={{ backgroundColor: statusInfo.color }}>
            <span className="status-icon">{statusInfo.icon}</span>
            <span className="status-text">{statusInfo.text}</span>
          </div>
        </div>
        
        {onClose && (
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        )}
      </div>

      <div className="tracking-content">
        <div className="map-section">
          <LeafletTracking orderId={orderId} />
        </div>

        <div className="tracking-details">
          <div className="delivery-info">
            <h3>📍 Delivery Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <strong>Address:</strong>
                <p>{orderData.deliveryAddress?.street}, {orderData.deliveryAddress?.city}</p>
              </div>
              
              {orderData.tracking?.estimatedTimeRemaining && (
                <div className="info-item">
                  <strong>ETA:</strong>
                  <p className="eta-time">
                    {formatTimeRemaining(orderData.tracking.estimatedTimeRemaining)}
                  </p>
                </div>
              )}
              
              {orderData.tracking?.distanceRemaining && (
                <div className="info-item">
                  <strong>Distance:</strong>
                  <p>{orderData.tracking.distanceRemaining} km</p>
                </div>
              )}
            </div>
          </div>

          {orderData.driver && (
            <div className="driver-info">
              <h3>🚗 Driver Information</h3>
              <div className="driver-details">
                <p><strong>Name:</strong> {orderData.driver.name}</p>
                <p><strong>Phone:</strong> {orderData.driver.phone}</p>
                <p><strong>Vehicle:</strong> {orderData.driver.vehicleNumber}</p>
                <p><strong>Rating:</strong> ⭐ {orderData.driver.rating}/5</p>
              </div>
            </div>
          )}

          <div className="restaurant-info">
            <h3>🏪 Restaurant Information</h3>
            <div className="restaurant-details">
              <p><strong>Name:</strong> {orderData.restaurant?.name}</p>
              <p><strong>Phone:</strong> {orderData.restaurant?.phone}</p>
            </div>
          </div>

          {orderData.status === 'out_for_delivery' && (
            <div className="live-tracking-notice">
              <div className="pulse-dot"></div>
              <span>Live tracking active - Updates every 30 seconds</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;