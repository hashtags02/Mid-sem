import React, { useState } from 'react';
import './SantoshPavBhajiPage.css';

const restaurant = {
  name: 'Santosh Pav Bhaji',
  photo: process.env.PUBLIC_URL + '/menu-images/santosh-pav-bhaji.jpg', // Street food restaurant image
  cuisines: ['Street Food', 'Pav Bhaji', 'Fast Food', 'Beverages', 'Snacks', 'Desserts'],
  address: '123, Street Food Lane, Alkapuri, Vadodara',
  timings: '8am – 10pm',
  contact: '+916666666666',
  rating: 4.7,
  ratingCount: 567,
  menu: [
    { name: 'Pav Bhaji', price: 89, description: 'Spicy mixed vegetable curry with butter pav.', category: 'Pav Bhaji', photo: process.env.PUBLIC_URL + '/menu-images/pav-bhaji.jpg' },
    { name: 'Cheese Pav Bhaji', price: 129, description: 'Pav bhaji with extra cheese topping.', category: 'Pav Bhaji', photo: process.env.PUBLIC_URL + '/menu-images/cheese-pav-bhaji.jpg' },
    { name: 'Butter Pav Bhaji', price: 109, description: 'Pav bhaji with extra butter and cream.', category: 'Pav Bhaji', photo: process.env.PUBLIC_URL + '/menu-images/butter-pav-bhaji.jpg' },
    { name: 'Pani Puri', price: 49, description: 'Crispy puris with spicy water and chutney.', category: 'Snacks', photo: process.env.PUBLIC_URL + '/menu-images/pani-puri.jpg' },
    { name: 'Dahi Puri', price: 69, description: 'Puri with yogurt, chutney and sev.', category: 'Snacks', photo: process.env.PUBLIC_URL + '/menu-images/dahi-puri.jpg' },
    { name: 'Sev Puri', price: 59, description: 'Puri with chutney, yogurt and sev toppings.', category: 'Snacks', photo: process.env.PUBLIC_URL + '/menu-images/sev-puri.jpg' },
    { name: 'Masala Chai', price: 25, description: 'Spicy Indian tea with milk and spices.', category: 'Beverages', photo: process.env.PUBLIC_URL + '/menu-images/masala-chai.jpg' },
    { name: 'Filter Coffee', price: 35, description: 'South Indian filter coffee with milk.', category: 'Beverages', photo: process.env.PUBLIC_URL + '/menu-images/filter-coffee.jpeg' },
    { name: 'Gulab Jamun', price: 45, description: 'Sweet milk dumplings in sugar syrup.', category: 'Desserts', photo: process.env.PUBLIC_URL + '/menu-images/gulab-jamun.jpeg' },
    { name: 'Rasmalai', price: 55, description: 'Soft cottage cheese patties in sweet milk.', category: 'Desserts', photo: process.env.PUBLIC_URL + '/menu-images/rasmalai.jpeg' },
  ],
};

const categories = Array.from(new Set(restaurant.menu.map(item => item.category)));

export default function SantoshPavBhajiPage() {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  const handleAddToCart = (item) => {
    setCart([...cart, item]);
  };

  return (
    <div className="restaurant-detail-bg">
      <div
        className="restaurant-header restaurant-header-bgimg"
        style={{ backgroundImage: `url(${restaurant.photo})` }}
      >
        <div className="cravecart-header-row">
          <span className="cravecart-title">CraveCart</span>
          <input
            type="text"
            placeholder="Search for your cravings..."
            className="cravecart-search"
          />
          <span className="cravecart-icons">
            <span className="cravecart-cart-icon">🛒</span>
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
                    <button className="add-to-cart-btn" onClick={() => handleAddToCart(item)}>
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