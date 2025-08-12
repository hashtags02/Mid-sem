import React, { useState } from 'react';
import './LePrivePage.css';

const restaurant = {
  name: 'Le Prive',
  photo: process.env.PUBLIC_URL + '/menu-images/le-prive.jpg', // Fine dining restaurant image
  cuisines: ['French', 'European', 'Fine Dining', 'Wine', 'Desserts', 'Cocktails'],
  address: '789, Champs-Élysées Avenue, Race Course Road, Vadodara',
  timings: '6pm – 11pm',
  contact: '+919999999999',
  rating: 4.9,
  ratingCount: 432,
  menu: [
    { name: 'Escargots de Bourgogne', price: 899, description: 'Burgundy snails in garlic herb butter.', category: 'Appetizers', photo: process.env.PUBLIC_URL + '/menu-images/escargots.jpg' },
    { name: 'Coq au Vin', price: 1299, description: 'Braised chicken in red wine with mushrooms.', category: 'Main Course', photo: process.env.PUBLIC_URL + '/menu-images/coq-au-vin.jpg' },
    { name: 'Beef Bourguignon', price: 1499, description: 'Slow-cooked beef in red wine sauce.', category: 'Main Course', photo: process.env.PUBLIC_URL + '/menu-images/beef-bourguignon.jpg' },
    { name: 'Ratatouille', price: 799, description: 'Provençal vegetable stew with herbs.', category: 'Main Course', photo: process.env.PUBLIC_URL + '/menu-images/ratatouille.jpg' },
    { name: 'Crème Brûlée', price: 399, description: 'Classic French vanilla custard with caramelized sugar.', category: 'Desserts', photo: process.env.PUBLIC_URL + '/menu-images/creme-brulee.jpg' },
    { name: 'French Red Wine', price: 599, description: 'Premium French red wine selection.', category: 'Beverages', photo: process.env.PUBLIC_URL + '/menu-images/french-wine.jpg' },
  ],
};

const categories = Array.from(new Set(restaurant.menu.map(item => item.category)));

export default function LePrivePage() {
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