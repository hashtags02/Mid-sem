import React, { useState } from 'react';
import './UrbanBitesPage.css';

const restaurant = {
  name: 'Urban Bites',
  photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752397646/ae21f90d2d9471f8d345edfbe03e4ee2_pxltci.jpg',
  cuisines: ['Modern Indian', 'Fusion', 'Fast Casual', 'Beverages', 'Desserts', 'Snacks'],
  address: '789, Urban Plaza, Race Course Road, Vadodara',
  timings: '11am – 11pm',
  contact: '+914444444444',
  rating: 4.4,
  ratingCount: 456,
  menu: [
    { name: 'Butter Chicken Bowl', price: 299, description: 'Creamy butter chicken with rice and naan.', category: 'Modern Indian', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752252983/859adef90e854238d9b330d0c7d2cf73_get6ol.jpg' },
    { name: 'Paneer Tikka Wrap', price: 199, description: 'Grilled paneer with mint chutney in tortilla.', category: 'Modern Indian', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752398998/7525c28b815e93b8f4ad4a3bb889090e_aunwup.jpg' },
    { name: 'Chicken Biryani Bowl', price: 249, description: 'Fragrant biryani with tender chicken pieces.', category: 'Modern Indian', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752398029/3e10bbc839b5ab13a9561cfed1f6fa8b_brpb4b.jpg' },
    { name: 'Fusion Tacos', price: 179, description: 'Indian spiced filling in Mexican tacos.', category: 'Fusion', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1753335242/samosa_q7pecl.jpg' },
    { name: 'Quinoa Salad', price: 159, description: 'Fresh quinoa with vegetables and herbs.', category: 'Fusion', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752398575/15de2cac5615a54813f8e0a8530c6876_whxeeu.jpg' },
    { name: 'Sweet Potato Fries', price: 129, description: 'Crispy sweet potato fries with dip.', category: 'Snacks', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1753335197/burger_yrnmbm.jpg' },
    { name: 'Mango Lassi', price: 89, description: 'Refreshing mango yogurt drink.', category: 'Beverages', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1753074301/4d65723ca703fe8bbf6f0d60fdd70939_xpu8pr.jpg' },
    { name: 'Masala Chai Latte', price: 99, description: 'Spiced chai with steamed milk.', category: 'Beverages', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752252980/01a8503fdbc5be552ae436c2aafcd064_sjk2uw.jpg' },
    { name: 'Chocolate Brownie', price: 119, description: 'Warm chocolate brownie with ice cream.', category: 'Desserts', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752252984/684ca1498560c84097bebc3805da551b_mt0neb.jpg' },
    { name: 'Gulab Jamun Cheesecake', price: 139, description: 'Fusion dessert with traditional flavors.', category: 'Desserts', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752252983/400b385226afc26f539aa732d38b14a6_k6si5f.jpg' },
  ],
};

const categories = Array.from(new Set(restaurant.menu.map(item => item.category)));

export default function UrbanBitesPage() {
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
            <span className="cravecart-cart-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
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