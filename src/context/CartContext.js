// /CartContext.js

import React, { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [splitBillEnabled, setSplitBillEnabled] = useState(false);
  const [splitBillType, setSplitBillType] = useState('equal'); // 'equal' or 'manual'
  const [splitBillCount, setSplitBillCount] = useState(2);
  const [manualSplitData, setManualSplitData] = useState([
    { name: '', amount: 0 },
    { name: '', amount: 0 }
  ]);

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

  const clearCart = () => {
    setCartItems([]);
    setSplitBillEnabled(false);
    setSplitBillType('equal');
    setSplitBillCount(2);
    setManualSplitData([
      { name: '', amount: 0 },
      { name: '', amount: 0 }
    ]);
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  };

  const calculateSplitAmount = () => {
    const total = calculateTotal();
    if (!splitBillEnabled) return total;
    
    if (splitBillType === 'equal') {
      return Math.ceil(total / splitBillCount);
    } else {
      // For manual split, return the total divided by the number of people
      return Math.ceil(total / splitBillCount);
    }
  };

  const getManualSplitSummary = () => {
    const total = calculateTotal();
    const manualTotal = manualSplitData.reduce((sum, person) => sum + person.amount, 0);
    const remaining = total - manualTotal;
    
    return {
      total,
      manualTotal,
      remaining,
      isValid: manualTotal <= total && manualSplitData.every(person => person.name.trim() !== '')
    };
  };

  const toggleSplitBill = () => {
    setSplitBillEnabled(!splitBillEnabled);
    if (!splitBillEnabled) {
      // Reset manual split data when enabling
      setManualSplitData([
        { name: '', amount: 0 },
        { name: '', amount: 0 }
      ]);
    }
  };

  const updateSplitBillType = (type) => {
    setSplitBillType(type);
    if (type === 'manual') {
      // Initialize manual split data with current count
      const newManualData = Array.from({ length: splitBillCount }, () => ({ name: '', amount: 0 }));
      setManualSplitData(newManualData);
    }
  };

  const updateSplitBillCount = (count) => {
    setSplitBillCount(Math.max(1, count));
    if (splitBillType === 'manual') {
      // Update manual split data array
      const newManualData = Array.from({ length: count }, (_, index) => 
        manualSplitData[index] || { name: '', amount: 0 }
      );
      setManualSplitData(newManualData);
    }
  };

  const updateManualSplitPerson = (index, field, value) => {
    const newManualData = [...manualSplitData];
    newManualData[index] = { ...newManualData[index], [field]: value };
    setManualSplitData(newManualData);
  };

  const addManualSplitPerson = () => {
    setManualSplitData([...manualSplitData, { name: '', amount: 0 }]);
    setSplitBillCount(splitBillCount + 1);
  };

  const removeManualSplitPerson = (index) => {
    if (manualSplitData.length > 1) {
      const newManualData = manualSplitData.filter((_, i) => i !== index);
      setManualSplitData(newManualData);
      setSplitBillCount(splitBillCount - 1);
    }
  };

  return (
    <CartContext.Provider
      value={{ 
        cartItems, 
        addToCart, 
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
