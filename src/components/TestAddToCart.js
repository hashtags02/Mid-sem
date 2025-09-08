import React from 'react';
import { useAddToCart } from '../hooks/useAddToCart';

const TestAddToCart = () => {
  const { addToCart } = useAddToCart();

  const testItems = [
    {
      name: 'Margherita Pizza',
      price: 299,
      image: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1753335236/pizza_eo0k4v.jpg'
    },
    {
      name: 'Chicken Wings',
      price: 199,
      image: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752252983/859adef90e854238d9b330d0c7d2cf73_get6ol.jpg'
    },
    {
      name: 'Coca Cola',
      price: 79,
      image: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752252980/01a8503fdbc5be552ae436c2aafcd064_sjk2uw.jpg'
    }
  ];

  return (
    <div style={{ 
      padding: '20px', 
      background: '#f5f5f5', 
      margin: '20px', 
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <h3>🧪 Test Split Bill Functionality</h3>
      <p>Add these items to test the split bill feature:</p>
      
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {testItems.map((item, index) => (
          <div key={index} style={{ 
            background: 'white', 
            padding: '10px', 
            borderRadius: '8px',
            border: '1px solid #ddd',
            minWidth: '150px'
          }}>
            <img 
              src={item.image} 
              alt={item.name} 
              style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
            />
            <p style={{ margin: '5px 0', fontWeight: 'bold' }}>{item.name}</p>
            <p style={{ margin: '5px 0', color: '#666' }}>₹{item.price}</p>
            <button 
              onClick={() => addToCart(item)}
              style={{
                background: '#007bff',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <a 
          href="/cart" 
          style={{
            background: '#28a745',
            color: 'white',
            padding: '10px 20px',
            textDecoration: 'none',
            borderRadius: '4px',
            display: 'inline-block'
          }}
        >
          🛒 Go to Cart & Test Split Bill
        </a>
      </div>
    </div>
  );
};

export default TestAddToCart;