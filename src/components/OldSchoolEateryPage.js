import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalSearch from './GlobalSearch';
import './OldSchoolEateryPage.css';
import { CartContext } from '../context/CartContext'; // ✅ import context
import { useAddToCart } from '../hooks/useAddToCart';

const restaurant = {
  name: 'Old School Eatery',
  photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752252981/cbf0e26a374f31531096c56671993220_ffd7xy.jpg',
  cuisines: ['North Indian', 'Biryani', 'Pizza', 'Sandwich', 'Chinese', 'Desserts', 'Beverages'],
  address: '17/B, Nutan Bharat Society, Opposite Relience Fresh, Alkapuri, Vadodara',
  timings: '12noon – 3pm, 7pm – 10:30pm',
  contact: '+918888856567',
  rating: 4.6,
  ratingCount: 833,
  menu: [
    // North Indian
    { name: 'Paneer Butter Masala', price: 299, description: 'Cottage cheese in creamy tomato gravy.', category: 'North Indian', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752398998/7525c28b815e93b8f4ad4a3bb889090e_aunwup.jpg' },
    { name: 'Dal Makhani', price: 249, description: 'Slow-cooked black lentils in creamy sauce.', category: 'North Indian', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752252984/0892e095adc768a6f3daa568d10b74c5_kytasc.jpg' },
    { name: 'Butter Naan', price: 49, description: 'Soft Indian bread with butter.', category: 'North Indian', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1753335197/burger_yrnmbm.jpg' },
    { name: 'Aloo Gobi', price: 199, description: 'Potato and cauliflower cooked with spices.', category: 'North Indian', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1753335235/pasta_kikytt.jpg' },
    // Biryani
    { name: 'Veg Biryani', price: 249, description: 'Aromatic rice with mixed vegetables and spices.', category: 'Biryani', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752252983/859adef90e854238d9b330d0c7d2cf73_get6ol.jpg' },
    { name: 'Paneer Biryani', price: 279, description: 'Biryani rice with paneer and spices.', category: 'Biryani', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752252984/410b32a87e020b0e8dbe8a2850d8ca29_prsyzo.jpg' },
    { name: 'Hyderabadi Biryani', price: 299, description: 'Spicy biryani with authentic Hyderabadi flavors.', category: 'Biryani', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752398029/3e10bbc839b5ab13a9561cfed1f6fa8b_brpb4b.jpg' },
    // Pizza
    { name: 'Margherita Pizza', price: 199, description: 'Classic cheese and tomato pizza.', category: 'Pizza', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1753335236/pizza_eo0k4v.jpg' },
    { name: 'Farmhouse Pizza', price: 249, description: 'Loaded with veggies and cheese.', category: 'Pizza', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752563696/410b32a87e020b0e8dbe8a2850d8ca29_socitw.jpg' },
    { name: 'Peppy Paneer Pizza', price: 269, description: 'Paneer, capsicum, and spicy seasoning.', category: 'Pizza', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1753335211/food1_z8vt3v.jpg' },
    { name: 'Mexican Green Wave', price: 259, description: 'Mexican herbs, veggies, and cheese.', category: 'Pizza', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1753335242/samosa_q7pecl.jpg' },
    // South Indian
    { name: 'Masala Dosa', price: 149, description: 'Crispy rice crepe with spiced potato filling.', category: 'South Indian', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752252984/781c6867d971c5fa7a704c992dc755c3_waxhi9.jpg' },
    { name: 'Idli Sambar', price: 99, description: 'Steamed rice cakes with sambar.', category: 'South Indian', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752398575/15de2cac5615a54813f8e0a8530c6876_whxeeu.jpg' },
    { name: 'Medu Vada', price: 109, description: 'Crispy lentil doughnuts with chutney.', category: 'South Indian', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752252982/10e3906d61a1e09dcb471723d5b28347_ckpxxi.jpg' },
    // Chaat
    { name: 'Pav Bhaji', price: 129, description: 'Spicy mashed veggies with buttered buns.', category: 'Chaat', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752252985/a79424d1606a535db91108548167727f_rpmxgv.jpg' },
    { name: 'Pani Puri', price: 99, description: 'Crispy puris with spicy water.', category: 'Chaat', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752252986/930a559fbe007109bb73b2be1f53411a_ojpdss.jpg' },
    { name: 'Dahi Puri', price: 109, description: 'Puris filled with yogurt and chutneys.', category: 'Chaat', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752398135/0b5eb439a0fe2c71aa7b427d3402e1ea_jd6bkm.jpg' },
    { name: 'Sev Puri', price: 109, description: 'Crispy puris topped with sev and chutneys.', category: 'Chaat', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752563713/043f9704cb216d23dab6ebb934b9f7b7_v01vwv.jpg' },
    // Desserts
    { name: 'Brownie Sundae', price: 129, description: 'Chocolate brownie with ice cream.', category: 'Desserts', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752252984/684ca1498560c84097bebc3805da551b_mt0neb.jpg' },
    { name: 'Gulab Jamun', price: 99, description: 'Soft sweet dumplings in syrup.', category: 'Desserts', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752252983/400b385226afc26f539aa732d38b14a6_k6si5f.jpg' },
    { name: 'Rasmalai', price: 139, description: 'Soft cheese patties in sweetened milk.', category: 'Desserts', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752252982/10e3906d61a1e09dcb471723d5b28347_ckpxxi.jpg' },
    { name: 'Ice Cream (2 scoops)', price: 89, description: 'Choice of vanilla, chocolate, or strawberry.', category: 'Desserts', photo: 'https://res.cloudinary.com/dlurlrbou/image/upload/v1752252980/01a8503fdbc5be552ae436c2aafcd064_sjk2uw.jpg' },
  ],
};

const categories = Array.from(new Set(restaurant.menu.map(item => item.category)));

export default function OldSchoolEateryPage() {
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
            {restaurant.menu
              .filter(item => item.category === selectedCategory)
              .map((item, idx) => {
                const isDalMakhani = item.name === 'Dal Makhani';
                return (
                  <div className="menu-item" key={idx}>
                    <div className="menu-item-main">
                      <div className="menu-item-name-desc">
                        <span className="menu-item-name">{item.name}</span>
                        <div className="menu-item-desc">{item.description}</div>
                        <button
                          className="add-to-cart-btn"
                          onClick={() => addToCart(item)}
                        >
                          Add to Cart
                        </button>
                      </div>
                      <span className="menu-item-price">₹{item.price}</span>
                      <img
                        src={item.photo}
                        alt={item.name}
                        className={`menu-item-photo${isDalMakhani ? ' dal-makhani-zoom' : ''}`}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
