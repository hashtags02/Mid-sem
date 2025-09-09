// src/CartPage.js

import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { ordersAPI } from "../services/api";
import "./CartContent.css";

const CartPage = () => {
  const { 
    cartItems, 
    increaseQuantity, 
    decreaseQuantity,
    clearCart,
    splitBillEnabled,
    splitBillType,
    splitBillCount,
    manualSplitData,
    toggleSplitBill,
    updateSplitBillType,
    updateSplitBillCount,
    updateManualSplitPerson,
    addManualSplitPerson,
    removeManualSplitPerson,
    calculateTotal,
    calculateSplitAmount,
    getManualSplitSummary
  } = useContext(CartContext);
  const [promoCode, setPromoCode] = useState("");
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const navigate = useNavigate();

  console.log('CartPage - cartItems:', cartItems);
  console.log('CartPage - cartItems length:', cartItems.length);

  const total = calculateTotal();
  const splitAmount = calculateSplitAmount();
  const manualSplitSummary = getManualSplitSummary();

  const handlePromoApply = () => {
    alert(`Promo "${promoCode}" applied! (you can add discount logic)`);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setCheckoutError("Cart is empty");
      return;
    }

    if (splitBillEnabled && splitBillType === 'manual' && !manualSplitSummary.isValid) {
      setCheckoutError("Please fix the split bill validation errors");
      return;
    }

    setIsCheckoutLoading(true);
    setCheckoutError("");

    try {
      // Check if user is authenticated
      const token = localStorage.getItem('jwt_token');
      if (!token) {
        setCheckoutError("Please login to place an order. You can login using your phone number.");
        return;
      }

      // Decode token to check if it's valid (basic check)
      try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        if (tokenPayload.exp < currentTime) {
          setCheckoutError("Your session has expired. Please login again.");
          localStorage.removeItem('jwt_token');
          return;
        }
        console.log('Token is valid, user ID:', tokenPayload.user?.id);
      } catch (tokenError) {
        console.error('Token validation error:', tokenError);
        setCheckoutError("Invalid authentication token. Please login again.");
        localStorage.removeItem('jwt_token');
        return;
      }

      // Get restaurant ID from the first item (assuming all items are from same restaurant)
      const restaurantId = cartItems[0]?.restaurantId || "dominos-pizza"; // Use a default if not available

      // Prepare order data
      const orderData = {
        items: cartItems.map(item => ({
          dish: item.id, // Use 'dish' instead of 'dishId' to match backend schema
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          photo: item.photo
        })),
        restaurantId: restaurantId,
        deliveryAddress: {
          street: "123 Main St", // This should come from user profile or form
          city: "Vadodara",
          state: "Gujarat",
          zipCode: "390001",
          landmark: "Near Alkapuri"
        },
        deliveryInstructions: "Please deliver at the main gate",
        paymentMethod: "cash", // This should come from a form
        splitBill: {
          enabled: splitBillEnabled,
          type: splitBillType,
          numberOfPeople: splitBillCount,
          manualSplit: splitBillType === 'manual' ? manualSplitData : []
        }
      };

      console.log('Creating order with data:', orderData);
      console.log('API URL:', 'http://localhost:5000/api/orders');
      console.log('Auth token exists:', !!token);

      // Test backend connection first
      try {
        const healthResponse = await fetch('http://localhost:5000/api/health');
        if (!healthResponse.ok) {
          throw new Error(`Backend health check failed: ${healthResponse.status}`);
        }
        console.log('Backend is running');
      } catch (healthError) {
        console.error('Backend health check failed:', healthError);
        setCheckoutError("Cannot connect to server. Please check if the backend is running on http://localhost:5000");
        return;
      }

      // Create order in backend
      const response = await ordersAPI.create(orderData);
      
      console.log('Order created successfully:', response);

      // Show success message
      alert(`Order placed successfully! Order ID: ${response.order._id}`);

      // Clear cart and redirect to home
      clearCart();
      navigate('/');

    } catch (error) {
      console.error('Checkout error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      // More specific error messages
      if (error.message.includes('fetch')) {
        setCheckoutError("Cannot connect to server. Please check if the backend is running.");
      } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        setCheckoutError("Authentication failed. Please login again.");
      } else if (error.message.includes('404')) {
        setCheckoutError("Server endpoint not found. Please contact support.");
      } else if (error.message.includes('500')) {
        setCheckoutError("Server error. Please try again later.");
      } else {
        setCheckoutError(error.message || "Failed to place order. Please try again.");
      }
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  return (
    <div className="cart-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Your Cart</h2>
        <button 
          onClick={() => navigate('/')} 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: 'pointer' 
          }}
        >
          Back to Home
        </button>
      </div>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item, index) => (
              <div key={index} className="cart-item">
                <img src={item.photo} alt={item.name} />
                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <p>₹ {item.price}</p>
                  <div className="cart-item-quantity">
                    <button onClick={() => decreaseQuantity(item.name)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQuantity(item.name)}>+</button>
                  </div>
                  <p>Subtotal: ₹ {item.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Cart Total: ₹ {total}</h3>

            {/* Split Bill Section */}
            <div className="split-bill-section">
              <div className="split-bill-toggle">
                <label className="split-bill-label">
                  <input
                    type="checkbox"
                    checked={splitBillEnabled}
                    onChange={toggleSplitBill}
                    className="split-bill-checkbox"
                  />
                  <span className="split-bill-text">Split Bill</span>
                </label>
              </div>

              {splitBillEnabled && (
                <div className="split-bill-options">
                  <div className="split-bill-type">
                    <label>
                      <input
                        type="radio"
                        name="splitType"
                        value="equal"
                        checked={splitBillType === 'equal'}
                        onChange={(e) => updateSplitBillType(e.target.value)}
                      />
                      Split Equally
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="splitType"
                        value="manual"
                        checked={splitBillType === 'manual'}
                        onChange={(e) => updateSplitBillType(e.target.value)}
                      />
                      Split Manually (Add Names & Amounts)
                    </label>
                  </div>

                  {splitBillType === 'equal' && (
                    <div className="split-bill-count">
                      <label>Number of People:</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={splitBillCount}
                        onChange={(e) => updateSplitBillCount(parseInt(e.target.value))}
                        className="split-bill-input"
                      />
                    </div>
                  )}

                  {splitBillType === 'manual' && (
                    <div className="manual-split-section">
                      <div className="manual-split-header">
                        <h4>Manual Split</h4>
                        <button 
                          onClick={addManualSplitPerson}
                          className="add-person-btn"
                        >
                          + Add Person
                        </button>
                      </div>
                      
                      <div className="manual-split-people">
                        {manualSplitData.map((person, index) => (
                          <div key={index} className="manual-split-person">
                            <div className="person-inputs">
                              <input
                                type="text"
                                placeholder="Enter name"
                                value={person.name}
                                onChange={(e) => updateManualSplitPerson(index, 'name', e.target.value)}
                                className="person-name-input"
                              />
                              <input
                                type="number"
                                placeholder="Amount"
                                value={person.amount || ''}
                                onChange={(e) => updateManualSplitPerson(index, 'amount', parseFloat(e.target.value) || 0)}
                                className="person-amount-input"
                              />
                            </div>
                            {manualSplitData.length > 1 && (
                              <button 
                                onClick={() => removeManualSplitPerson(index)}
                                className="remove-person-btn"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="manual-split-summary">
                        <div className="summary-row">
                          <span>Total Bill:</span>
                          <span>₹ {manualSplitSummary.total}</span>
                        </div>
                        <div className="summary-row">
                          <span>Allocated:</span>
                          <span>₹ {manualSplitSummary.manualTotal}</span>
                        </div>
                        <div className={`summary-row ${manualSplitSummary.remaining < 0 ? 'error' : manualSplitSummary.remaining > 0 ? 'warning' : 'success'}`}>
                          <span>Remaining:</span>
                          <span>₹ {manualSplitSummary.remaining}</span>
                        </div>
                        {!manualSplitSummary.isValid && (
                          <div className="validation-error">
                            Please enter names for all people and ensure total amount doesn't exceed bill total.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {splitBillType === 'equal' && (
                    <div className="split-bill-result">
                      <p className="split-amount">
                        Amount per person: <strong>₹ {splitAmount}</strong>
                      </p>
                      <p className="split-total">
                        Total: ₹ {total} ÷ {splitBillCount} people
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="promo-code">
              <input
                type="text"
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button onClick={handlePromoApply}>Apply</button>
            </div>

            {checkoutError && (
              <div className="checkout-error">
                {checkoutError}
              </div>
            )}

            <button 
              className="checkout-btn"
              disabled={
                isCheckoutLoading || 
                (splitBillEnabled && splitBillType === 'manual' && !manualSplitSummary.isValid)
              }
              onClick={handleCheckout}
            >
              {isCheckoutLoading ? 'Processing...' : 
                splitBillEnabled ? 
                  (splitBillType === 'equal' ? 
                    `Proceed to Checkout (₹ ${splitAmount} each)` : 
                    'Proceed to Checkout'
                  ) : 
                  'Proceed to Checkout'
              }
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
