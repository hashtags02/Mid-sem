import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalSearch from './GlobalSearch';
import './MomosHutPage.css';
import { CartContext } from '../context/CartContext';

const restaurant = {
  name: 'Momos Hut',
  photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752398135/0b5eb439a0fe2c71aa7b427d3402e1ea_jd6bkm.jpg',
  cuisines: ['Momos', 'Indo-Chinese', 'Street Food', 'Beverages', 'Snacks', 'Desserts'],
  address: '234, Food Court, Alkapuri, Vadodara',
  timings: '12pm – 11pm',
  contact: '+912222222222',
  rating: 4.3,
  ratingCount: 388,
  menu: [
    { name: 'Veg Steamed Momos', price: 99, description: 'Steamed dumplings stuffed with veggies.', category: 'Momos', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752398135/0b5eb439a0fe2c71aa7b427d3402e1ea_jd6bkm.jpg' },
    { name: 'Chicken Steamed Momos', price: 129, description: 'Steamed dumplings stuffed with chicken.', category: 'Momos', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752563713/043f9704cb216d23dab6ebb934b9f7b7_v01vwv.jpg' },
    { name: 'Veg Fried Momos', price: 109, description: 'Crispy fried momos with spicy dip.', category: 'Momos', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752252983/859adef90e854238d9b330d0c7d2cf73_get6ol.jpg' },
    { name: 'Chicken Fried Momos', price: 139, description: 'Fried chicken momos with spicy sauce.', category: 'Momos', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752252984/410b32a87e020b0e8dbe8a2850d8ca29_prsyzo.jpg' },
    { name: 'Paneer Momos', price: 119, description: 'Steamed momos stuffed with paneer.', category: 'Momos', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752398998/7525c28b815e93b8f4ad4a3bb889090e_aunwup.jpg' },
    { name: 'Chilli Momos', price: 129, description: 'Momos tossed in spicy Indo-Chinese sauce.', category: 'Indo-Chinese', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752252986/930a559fbe007109bb73b2be1f53411a_ojpdss.jpg' },
    { name: 'Spring Rolls', price: 99, description: 'Crispy rolls stuffed with veggies.', category: 'Indo-Chinese', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1753335242/samosa_q7pecl.jpg' },
    { name: 'Fried Rice', price: 119, description: 'Indo-Chinese style fried rice.', category: 'Indo-Chinese', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752398029/3e10bbc839b5ab13a9561cfed1f6fa8b_brpb4b.jpg' },
    { name: 'Lemon Iced Tea', price: 59, description: 'Refreshing lemon iced tea.', category: 'Beverages', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752252980/01a8503fdbc5be552ae436c2aafcd064_sjk2uw.jpg' },
    { name: 'Cold Coffee', price: 69, description: 'Chilled coffee with ice.', category: 'Beverages', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752252983/400b385226afc26f539aa732d38b14a6_k6si5f.jpg' },
    { name: 'Brownie Sundae', price: 99, description: 'Brownie with ice cream and chocolate sauce.', category: 'Desserts', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752252984/684ca1498560c84097bebc3805da551b_mt0neb.jpg' },
    { name: 'Ice Cream', price: 79, description: 'Assorted ice cream scoops.', category: 'Desserts', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752252982/10e3906d61a1e09dcb471723d5b28347_ckpxxi.jpg' },
  ],
};

const categories = Array.from(new Set(restaurant.menu.map(item => item.category)));

export default function MomosHutPage() {
  const { addToCart, cartItems } = useContext(CartContext);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const navigate = useNavigate();

  // Count total items by summing quantity
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

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
            <span className="cravecart-cart-icon" onClick={() => navigate('/cart')} style={{ cursor: 'pointer' }}>
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