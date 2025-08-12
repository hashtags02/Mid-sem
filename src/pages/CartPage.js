// src/CartPage.js

import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import "./CartContent.css";

const CartPage = () => {
  const { cartItems, increaseQuantity, decreaseQuantity } = useContext(CartContext);
  const [promoCode, setPromoCode] = useState("");

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handlePromoApply = () => {
    alert(`Promo "${promoCode}" applied! (you can add discount logic)`);
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

            <div className="promo-code">
              <input
                type="text"
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button onClick={handlePromoApply}>Apply</button>
            </div>

            <button className="checkout-btn">Proceed to Checkout</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
