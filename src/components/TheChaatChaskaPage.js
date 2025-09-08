import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalSearch from './GlobalSearch';
import './TheChaatChaskaPage.css';
import { CartContext } from '../context/CartContext';
import { useAddToCart } from '../hooks/useAddToCart';

const restaurant = {
  name: 'The Chaat Chaska',
  photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752252986/930a559fbe007109bb73b2be1f53411a_ojpdss.jpg',
  cuisines: ['Chaat', 'Street Food', 'Fast Food', 'Beverages', 'Snacks', 'Desserts'],
  address: '456, Chaat Corner, Alkapuri, Vadodara',
  timings: '10am – 11pm',
  contact: '+915555555555',
  rating: 4.5,
  ratingCount: 723,
  menu: [
    { name: 'Dahi Puri', price: 79, description: 'Crispy puris with yogurt, chutney and sev.', category: 'Chaat', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752398135/0b5eb439a0fe2c71aa7b427d3402e1ea_jd6bkm.jpg' },
    { name: 'Pani Puri', price: 59, description: 'Crispy puris with spicy water and chutney.', category: 'Chaat', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752252986/930a559fbe007109bb73b2be1f53411a_ojpdss.jpg' },
    { name: 'Sev Puri', price: 69, description: 'Puri with chutney, yogurt and sev toppings.', category: 'Chaat', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752563713/043f9704cb216d23dab6ebb934b9f7b7_v01vwv.jpg' },
    { name: 'Bhel Puri', price: 89, description: 'Puffed rice with vegetables and chutney.', category: 'Chaat', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752252984/0892e095adc768a6f3daa568d10b74c5_kytasc.jpg' },
    { name: 'Ragda Pattice', price: 99, description: 'Potato patties with white peas curry.', category: 'Chaat', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1753335197/burger_yrnmbm.jpg' },
    { name: 'Samosa Chaat', price: 109, description: 'Samosa topped with chutney and yogurt.', category: 'Chaat', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1753335242/samosa_q7pecl.jpg' },
    { name: 'Masala Chai', price: 25, description: 'Spicy Indian tea with milk and spices.', category: 'Beverages', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752252980/01a8503fdbc5be552ae436c2aafcd064_sjk2uw.jpg' },
    { name: 'Filter Coffee', price: 35, description: 'South Indian filter coffee with milk.', category: 'Beverages', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752252983/400b385226afc26f539aa732d38b14a6_k6si5f.jpg' },
    { name: 'Jassi', price: 49, description: 'Sweet lassi with rose water and cardamom.', category: 'Beverages', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1753074301/4d65723ca703fe8bbf6f0d60fdd70939_xpu8pr.jpg' },
    { name: 'Gulab Jamun', price: 45, description: 'Sweet milk dumplings in sugar syrup.', category: 'Desserts', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752252983/400b385226afc26f539aa732d38b14a6_k6si5f.jpg' },
    { name: 'Rasmalai', price: 55, description: 'Soft cottage cheese patties in sweet milk.', category: 'Desserts', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752252982/10e3906d61a1e09dcb471723d5b28347_ckpxxi.jpg' },
    { name: 'Payasam', price: 65, description: 'Traditional rice pudding with nuts.', category: 'Desserts', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752252984/684ca1498560c84097bebc3805da551b_mt0neb.jpg' },
  ],
};

const categories = Array.from(new Set(restaurant.menu.map(item => item.category)));

export default function TheChaatChaskaPage() {
  const { cartItems } = useContext(CartContext);
  const { addToCart } = useAddToCart();
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const navigate = useNavigate(); // ✅ Add navigation

  // ✅ Count total items by summing quantity
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // ✅ Handle cart click
  const handleCartClick = () => {
    navigate('/cart');
  };

  return (
    <div className="restaurant-detail-bg">
      <div
        className="restaurant-header restaurant-header-bgimg"
        style={{ backgroundImage: `url(${restaurant.photo})` }}
      >
        <div className="cravecart-header-row">
          <span className="cravecart-title">CraveCart</span>
          <GlobalSearch placeholder="Search for your cravings..." />
          <span className="cravecart-icons">
            <span className="cravecart-cart-icon" onClick={handleCartClick} style={{ cursor: 'pointer' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {totalItems > 0 && <span className="cart-count-badge">{totalItems}</span>}
            </span>
          </span>
        </div>
        <div className="restaurant-header-content-bg">
          <div className="restaurant-header-info">
            <h1 className="restaurant-title">{restaurant.name}</h1>
            <div className="restaurant-cuisines">{restaurant.cuisines.join(', ')}</div>
            <div className="restaurant-address">{restaurant.address}</div>
            <div className="restaurant-meta">
              <span className="restaurant-timings">{restaurant.timings}</span>
              <span className="restaurant-contact">{restaurant.contact}</span>
              <span className="restaurant-rating">
                <span className="rating-badge">{restaurant.rating}★</span>
                <span className="rating-count">{restaurant.ratingCount} ratings</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="restaurant-menu-section menu-flex-layout">
        <h2 className="menu-title">Menu</h2>
        <div className="menu-flex-row">
          <div className="menu-categories-vertical">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`menu-category-btn${selectedCategory === cat ? ' active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="menu-list-vertical">
            {restaurant.menu.filter(item => item.category === selectedCategory).map((item, idx) => (
              <div className="menu-item" key={idx}>
                <div className="menu-item-main">
                  <div className="menu-item-name-desc">
                    <span className="menu-item-name">{item.name}</span>
                    <div className="menu-item-desc">{item.description}</div>
                    <button className="add-to-cart-btn" onClick={() => addToCart(item)}>
                      Add to Cart
                    </button>
                  </div>
                  <span className="menu-item-price">₹{item.price}</span>
                  <img src={item.photo} alt={item.name} className="menu-item-photo" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 