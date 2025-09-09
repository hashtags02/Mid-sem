import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import './HeroSection.css';

function HeroSection() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/logout', {
        method: 'GET',
        credentials: 'include'
      });
      localStorage.removeItem('user');
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('user');
      logout();
      navigate('/login');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <section className="hero">
      <nav className="navbar">
        <div className="navbar-logo" onClick={() => navigate('/')}>CraveCart</div>
        <ul className="navbar-links">
          <li onClick={() => navigate('/')}>Home</li>
          <li onClick={() => navigate('/about')}>About us</li>
          <li onClick={() => navigate('/help')}>Help/Support</li>
        </ul>

        <div className="navbar-icons">
          {user ? (
            <>
              <span className="cart-icon" onClick={() => navigate('/cart')}>
                🛒
                {totalItems > 0 && <span className="cart-count-badge">{totalItems}</span>}
              </span>
              <div className="hamburger-menu" onClick={toggleMenu}>
                <div className={`hamburger ${isMenuOpen ? 'active' : ''}`}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </>
          ) : (
            <Link to="/login" className="login-button"> Login</Link>
          )}
        </div>
      </nav>

      {user && isMenuOpen && (
        <div className="menu-overlay" onClick={closeMenu}>
          <div className="menu-content" onClick={(e) => e.stopPropagation()}>
            <div className="menu-header">
              <h3>Menu</h3>
              <button className="close-menu" onClick={closeMenu}>×</button>
            </div>

            <div className="user-info">
              <p>Welcome, {user?.phone || user?.displayName || 'User'}!</p>
              <p className="login-method">
                {user?.method === 'firebase' ? (
                  <span>📱 Phone Authentication</span>
                ) : (
                  <span>🔐 Google Authentication</span>
                )}
              </p>
            </div>

            <nav className="menu-nav">
              <ul>
                <li><a href="#home" onClick={closeMenu}>🏠 Home</a></li>
                <li><a href="#menu" onClick={closeMenu}>🍽️ Menu</a></li>
                <li><a href="#about" onClick={closeMenu}>ℹ️ About</a></li>
                <li><a href="#contact" onClick={closeMenu}>📞 Contact</a></li>
                <li><a href="#cart" onClick={closeMenu}>🛒 Cart</a></li>
                <li><a href="#orders" onClick={closeMenu}>📋 My Orders</a></li>
                <li><a href="#profile" onClick={closeMenu}>👤 Profile</a></li>
              </ul>
            </nav>

            <div className="logout-section">
              <button onClick={handleLogout} className="logout-btn">🚪 Logout</button>
            </div>
          </div>
        </div>
      )}

      <div className="hero-content">
        <h1>
          Your Favourite Meals,<br />
          Delivered Faster
        </h1>
        <p className="hero-desc">
          Craving something delicious?<br />
          Order from local restaurants near you
        </p>
        <button className="order-btn" onClick={() => navigate('/categories')}>Order Now</button>
      </div>
    </section>
  );
}

export default HeroSection;
