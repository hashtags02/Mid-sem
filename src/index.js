// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// ✅ Import your CartProvider from where you defined it:
import { CartProvider } from './context/CartContext'; // adjust path if needed

// ✅ Create root
const root = ReactDOM.createRoot(document.getElementById('root'));

// ✅ Wrap your whole app inside the CartProvider
root.render(
  <React.StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </React.StrictMode>
);

// ✅ CRA default: measure performance if needed
reportWebVitals();
