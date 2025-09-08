// src/CartPage.js

import React, { useContext, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { useGroupOrder } from "../context/GroupOrderContext";
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
  const { group, isHost, startGroup, joinGroup, setPaymentMode, checkout } = useGroupOrder();

  useEffect(() => {
    const saved = localStorage.getItem('order_instructions') || '';
    setInstructions(saved);
  }, []);

  const total = calculateTotal();
  const discount = total >= 1000 ? 200 : total >= 500 ? 100 : total >= 200 ? 50 : 0;
  const payable = Math.max(0, total - discount);
  const splitAmount = calculateSplitAmount();
  const manualSplitSummary = getManualSplitSummary();

  const groupedByMember = useMemo(() => {
    if (!group?.items) return {};
    return group.items.reduce((acc, item) => {
      const key = item.memberName || 'Member';
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  }, [group]);

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

      <div style={{ display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
        {!group && (
          <>
            <button onClick={() => startGroup()} className="checkout-btn">Start Group Order</button>
            <button onClick={async () => {
              const code = prompt('Enter group code');
              if (code) await joinGroup(code.trim());
            }} className="checkout-btn">Join Group Order</button>
          </>
        )}
        {group && (
          <div style={{ padding: '8px 12px', background: '#f2f2f2', borderRadius: 8 }}>
            <strong>Group Code:</strong> {group.code}
          </div>
        )}
      </div>

      {group && (
        <div style={{ margin: '12px 0', padding: 12, border: '1px solid #eee', borderRadius: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700 }}>Participants:</span>
            {group.members?.map((m, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', background: '#fff', borderRadius: 999, border: '1px solid #eee' }}>
                <img src={m.avatar || '/logo192.png'} alt={m.name} style={{ width: 22, height: 22, borderRadius: '50%' }} />
                <span>{m.name}{m.isHost ? ' (Host)' : ''}</span>
              </div>
            ))}
          </div>

          <div>
            <h3 style={{ margin: '10px 0' }}>Group Cart</h3>
            {Object.keys(groupedByMember).length === 0 && <p>No items yet. Add from menus.</p>}
            {Object.entries(groupedByMember).map(([memberName, items]) => (
              <div key={memberName} style={{ marginBottom: 10 }}>
                <h4 style={{ margin: '6px 0' }}>{memberName}'s items</h4>
                {items.map((gi) => (
                  <div key={gi._id} className="cart-item">
                    <img src={gi.photo} alt={gi.name} />
                    <div className="cart-item-info">
                      <h4>{gi.name}</h4>
                      <p>₹ {gi.price}</p>
                      <div className="cart-item-quantity">
                        <button onClick={() => {
                          const newQty = Math.max(1, (gi.quantity || 1) - 1);
                          // Only allow host or owner to edit handled by backend
                          // Optimistic UI not required
                          fetch('');
                        }}>-</button>
                        <span>{gi.quantity}</span>
                        <button onClick={() => {}}>+</button>
                      </div>
                      <p>Subtotal: ₹ {gi.price * gi.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {isHost && (
            <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button className="checkout-btn" onClick={() => setPaymentMode('host')}>Host Pays All</button>
              <button className="checkout-btn" onClick={() => setPaymentMode('split')}>Split Bill Mode</button>
              <button className="checkout-btn" onClick={checkout}>Proceed to Checkout</button>
            </div>
          )}
        </div>
      )}
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
            {discount > 0 && (
              <div style={{ marginTop: 6, color: '#16a34a', fontWeight: 600 }}>
                Discount applied: −₹{discount}
              </div>
            )}
            <div style={{ marginTop: 6, fontWeight: 700 }}>
              Payable: ₹ {payable}
            </div>

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
              {splitBillEnabled ? `Proceed to Checkout (₹ ${splitAmount})` : `Proceed to Checkout (₹ ${payable})`}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
