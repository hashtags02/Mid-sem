import React, { useState } from 'react';
import './PunjabiDhabaPage.css';

const restaurant = {
  name: 'Punjabi Dhaba',
  photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752252985/a79424d1606a535db91108548167727f_rpmxgv.jpg',
  cuisines: ['Punjabi', 'North Indian', 'Dhaba', 'Beverages', 'Desserts', 'Breads'],
  address: '567, Highway Road, Alkapuri, Vadodara',
  timings: '7am – 11pm',
  contact: '+913333333333',
  rating: 4.6,
  ratingCount: 634,
  menu: [
    { name: 'Butter Chicken', price: 299, description: 'Creamy tomato-based curry with tender chicken.', category: 'Punjabi', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752252983/859adef90e854238d9b330d0c7d2cf73_get6ol.jpg' },
    { name: 'Paneer Butter Masala', price: 249, description: 'Cottage cheese in rich tomato gravy.', category: 'Punjabi', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752398998/7525c28b815e93b8f4ad4a3bb889090e_aunwup.jpg' },
    { name: 'Dal Makhani', price: 199, description: 'Slow-cooked black lentils with cream.', category: 'Punjabi', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752252984/0892e095adc768a6f3daa568d10b74c5_kytasc.jpg' },
    { name: 'Chicken Biryani', price: 349, description: 'Fragrant rice with tender chicken and spices.', category: 'Punjabi', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752398029/3e10bbc839b5ab13a9561cfed1f6fa8b_brpb4b.jpg' },
    { name: 'Veg Biryani', price: 249, description: 'Aromatic rice with mixed vegetables.', category: 'Punjabi', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752252983/859adef90e854238d9b330d0c7d2cf73_get6ol.jpg' },
    { name: 'Butter Naan', price: 29, description: 'Soft bread brushed with butter.', category: 'Breads', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1753335197/burger_yrnmbm.jpg' },
    { name: 'Tandoori Roti', price: 19, description: 'Whole wheat bread cooked in tandoor.', category: 'Breads', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1753335211/food1_z8vt3v.jpg' },
    { name: 'Lassi', price: 79, description: 'Traditional Punjabi sweet yogurt drink.', category: 'Beverages', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1753074301/4d65723ca703fe8bbf6f0d60fdd70939_xpu8pr.jpg' },
    { name: 'Masala Chai', price: 25, description: 'Spiced Indian tea with milk.', category: 'Beverages', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752252980/01a8503fdbc5be552ae436c2aafcd064_sjk2uw.jpg' },
    { name: 'Gulab Jamun', price: 45, description: 'Sweet milk dumplings in sugar syrup.', category: 'Desserts', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752252983/400b385226afc26f539aa732d38b14a6_k6si5f.jpg' },
    { name: 'Rasmalai', price: 55, description: 'Soft cottage cheese patties in sweet milk.', category: 'Desserts', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752252982/10e3906d61a1e09dcb471723d5b28347_ckpxxi.jpg' },
  ],
};

const categories = Array.from(new Set(restaurant.menu.map(item => item.category)));

export default function PunjabiDhabaPage() {
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