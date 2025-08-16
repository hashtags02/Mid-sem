import React, { useState, useEffect } from 'react';
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
    navigate(`/track/${trackingOrderId}`, { replace: true });
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

export default TrackingPage;