// src/pages/PaymentPage.js

import React, { useState, useContext, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./PaymentPage.css";

const PaymentPage = () => {
  const { 
    cartItems, 
    calculateTotal, 
    splitBillEnabled, 
    splitBillType,
    calculateSplitAmount,
    manualSplitData,
    clearCart 
  } = useContext(CartContext);
  
  const navigate = useNavigate();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [showUPIForm, setShowUPIForm] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const totalAmount = calculateTotal();
  const splitAmount = calculateSplitAmount();

  useEffect(() => {
    // If cart is empty, redirect to home
    if (cartItems.length === 0) {
      navigate('/');
    }
  }, [cartItems, navigate]);

  const selectPayment = (method) => {
    setSelectedPaymentMethod(method);
  };

  const proceedToPayment = () => {
    if (!selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }
    
    if (selectedPaymentMethod === 'cod') {
      // Cash on Delivery doesn't support split payments
      if (splitBillEnabled) {
        alert('Split bill is not available for Cash on Delivery. Please choose UPI payment for split bills.');
        return;
      }
      showSuccessMessage(`Order placed successfully! You will pay ₹${totalAmount} on delivery.`);
      return;
    }
    
    if (selectedPaymentMethod === 'upi') {
      if (splitBillEnabled) {
        // For split payments, redirect to dedicated UPI collection page
        navigate('/split-upi-collection');
      } else {
        // For regular payments, show UPI form
        setShowUPIForm(true);
      }
    }
  };

  const processUPIPayment = () => {
    if (!upiId.trim()) {
      alert('Please enter your UPI ID');
      return;
    }
    
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      showSuccessMessage(`Payment successful! Order confirmed. Amount paid: ₹${totalAmount}`);
    }, 2000);
  };

  const showSuccessMessage = (message) => {
    setShowSuccess(true);
    setShowUPIForm(false);
    // Clear cart after successful payment
    setTimeout(() => {
      clearCart();
      // You can navigate to order confirmation page or home
      // navigate('/order-confirmation');
    }, 3000);
  };

  const goBack = () => {
    navigate('/cart');
  };

  const goHome = () => {
    navigate('/');
  };

  if (showSuccess) {
    return (
      <div className="payment-container">
        <div className="payment-card">
          <div className="logo">
            <div className="logo-icon">🍔</div>
            <span className="logo-text">FoodDelivery</span>
          </div>
          <div className="success-message">
            <div className="success-icon">✅</div>
            <h2>Success!</h2>
            <p>Payment successful! Order confirmed.</p>
            <button className="primary-btn" onClick={goHome}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showUPIForm) {
    return (
      <div className="payment-container">
        <div className="payment-card">
          <div className="logo">
            <div className="logo-icon">🍔</div>
            <span className="logo-text">FoodDelivery</span>
          </div>
          
          <div className="upi-payment-form">
            <h2>UPI Payment</h2>
            <div className="input-group">
              <label>UPI ID</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="Enter your UPI ID"
              />
            </div>
            <div className="amount-display">
              <span>Amount to Pay:</span>
              <span className="amount">₹{totalAmount}</span>
            </div>
            
            {isProcessing ? (
              <div className="loading-content">
                <div className="spinner"></div>
                <p>Processing payment...</p>
              </div>
            ) : (
              <>
                <button className="primary-btn" onClick={processUPIPayment}>
                  Pay Now
                </button>
                <button className="secondary-btn" onClick={() => setShowUPIForm(false)}>
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <div className="payment-card">
        <div className="logo">
          <div className="logo-icon">🍔</div>
          <span className="logo-text">FoodDelivery</span>
        </div>
        
        <h1 className="main-heading">Choose Payment Method</h1>
        <p className="sub-text">Select your preferred payment option</p>
        
        <div className="order-summary">
          <h2>Order Summary</h2>
          {cartItems.map((item, index) => (
            <div key={index} className="order-item">
              <span>{item.name} x{item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="order-total">
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>
          {splitBillEnabled && (
            <div className="split-info">
              <span>
                {splitBillType === 'equal' 
                  ? `Split equally (You pay: ₹${splitAmount})`
                  : 'Manual split enabled'
                }
              </span>
            </div>
          )}
        </div>
        
        {splitBillEnabled && (
          <div className="split-payment-info">
            <div className="split-info-card">
              <h3 style={{ color: '#ff7f00', marginBottom: '10px' }}>
                🔄 Split Bill Enabled
              </h3>
              {splitBillType === 'equal' ? (
                <p style={{ color: '#ffffff', margin: '0' }}>
                  Split equally among {splitBillCount} people - Each pays: ₹{splitAmount}
                </p>
              ) : (
                <p style={{ color: '#ffffff', margin: '0' }}>
                  Manual split configured for {manualSplitData.filter(p => p.name.trim()).length} people
                </p>
              )}
              <p style={{ color: '#aaaaaa', fontSize: '0.9rem', marginTop: '8px' }}>
                💳 UPI IDs will be collected on the next page
              </p>
            </div>
          </div>
        )}
        
        <div className="payment-options">
          <div 
            className={`payment-option ${selectedPaymentMethod === 'upi' ? 'selected' : ''}`}
            onClick={() => selectPayment('upi')}
          >
            <div className="payment-icon">📱</div>
            <div className="payment-details">
              <h3>UPI Payment</h3>
              <p>Pay using UPI apps like Google Pay, PhonePe, Paytm</p>
            </div>
            <div className="radio-btn">
              <input
                type="radio"
                name="payment"
                value="upi"
                checked={selectedPaymentMethod === 'upi'}
                onChange={() => selectPayment('upi')}
              />
              <span className="radio-checkmark"></span>
            </div>
          </div>
          
          <div 
            className={`payment-option ${selectedPaymentMethod === 'cod' ? 'selected' : ''} ${splitBillEnabled ? 'disabled' : ''}`}
            onClick={() => !splitBillEnabled && selectPayment('cod')}
            style={{
              opacity: splitBillEnabled ? 0.5 : 1,
              cursor: splitBillEnabled ? 'not-allowed' : 'pointer',
              pointerEvents: splitBillEnabled ? 'none' : 'auto'
            }}
          >
            <div className="payment-icon">💵</div>
            <div className="payment-details">
              <h3>Cash on Delivery</h3>
              <p>{splitBillEnabled ? 'Not available with split bills' : 'Pay when you receive your order'}</p>
            </div>
            <div className="radio-btn">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={selectedPaymentMethod === 'cod'}
                onChange={() => !splitBillEnabled && selectPayment('cod')}
                disabled={splitBillEnabled}
              />
              <span className="radio-checkmark"></span>
            </div>
          </div>
        </div>
        
        <button className="primary-btn" onClick={proceedToPayment}>
          Proceed to Payment
        </button>
        
        <button className="secondary-btn" onClick={goBack}>
          ← Back to Cart
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;