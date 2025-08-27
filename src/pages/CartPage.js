// src/CartPage.js

import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "./CartContent.css";

const CartPage = () => {
  const navigate = useNavigate();
  const { 
    cartItems, 
    increaseQuantity, 
    decreaseQuantity,
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
  const [instructions, setInstructions] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem('order_instructions') || '';
    setInstructions(saved);
  }, []);

  const total = calculateTotal();
  const splitAmount = calculateSplitAmount();
  const manualSplitSummary = getManualSplitSummary();

  const handlePromoApply = () => {
    alert(`Promo "${promoCode}" applied! (you can add discount logic)`);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    // Validate manual split if enabled
    if (splitBillEnabled && splitBillType === 'manual') {
      const manualSummary = getManualSplitSummary();
      if (!manualSummary.isValid) {
        alert('Please complete the manual split configuration before proceeding to checkout.');
        return;
      }
    }

    // Persist instructions for payment page
    localStorage.setItem('order_instructions', instructions || '');

    // Navigate to payment page
    navigate('/payment');
  };

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item, index) => (
              <div key={index} className="cart-item">
                <img src={item.image} alt={item.name} />
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

            <div className="instructions-section" style={{ marginTop: 10 }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Instructions for restaurant</label>
              <textarea
                placeholder="Add notes like no onions, extra spicy, ring the bell, etc."
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                rows={3}
                style={{ width: '100%', padding: 10, borderRadius: 8 }}
              />
            </div>

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
                {splitBillEnabled && (
                  <div className="split-bill-notice">
                    <p style={{ 
                      color: '#ff7f00', 
                      fontSize: '0.85rem', 
                      margin: '8px 0 0 0',
                      fontStyle: 'italic'
                    }}>
                      💳 Note: Split bills require UPI payment
                    </p>
                  </div>
                )}
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
                      <div className="split-bill-result">
                        <p>Each person pays: ₹ {splitAmount}</p>
                      </div>
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
                        <p>Total Allocated: ₹ {manualSplitSummary.manualTotal}</p>
                        <p>Remaining: ₹ {manualSplitSummary.remaining}</p>
                        {!manualSplitSummary.isValid && (
                          <p className="error-message">
                            {manualSplitSummary.manualTotal > manualSplitSummary.total 
                              ? "Total allocated amount exceeds cart total" 
                              : "Please fill all names and ensure total doesn't exceed cart amount"}
                          </p>
                        )}
                      </div>
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

            <button className="checkout-btn" onClick={handleCheckout}>
              {splitBillEnabled ? `Proceed to Checkout (₹ ${splitAmount})` : "Proceed to Checkout"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
