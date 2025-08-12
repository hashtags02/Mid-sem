// /CartContext.js

import React, { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((i) => i.name === item.name);
      if (existing) {
        // Increment quantity
        return prevItems.map((i) =>
          i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        // Add new item with quantity
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const increaseQuantity = (name) => {
    setCartItems((prev) =>
      prev.map((i) =>
        i.name === name ? { ...i, quantity: i.quantity + 1 } : i
      )
    );
  };

  const decreaseQuantity = (name) => {
    setCartItems((prev) =>
      prev
        .map((i) =>
          i.name === name ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, increaseQuantity, decreaseQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};
