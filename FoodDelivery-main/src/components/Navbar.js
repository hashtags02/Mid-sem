import React, { useState, useEffect, useRef, useContext } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { cartItems } = useContext(CartContext);

  // Count total items by summing quantity
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Debug logging
  console.log('Navbar - Current user state:', user);
  console.log('Navbar - localStorage user:', localStorage.getItem('user'));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">CraveCart</div>
      <ul className="navbar-links">
        <li>Home</li>
        <li>About us</li>
        <li>Help/Support</li>
      </ul>
      
      {/* Cart Icon - Always Visible */}
      <div 
        className="navbar-cart-icon" 
        onClick={() => navigate('/cart')}
        style={{ 
          cursor: 'pointer', 
          marginRight: '20px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {totalItems > 0 && (
          <span style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            backgroundColor: '#ff4444',
            color: 'white',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {totalItems}
          </span>
        )}
      </div>
      
      {!user ? (
        // Show login button when not logged in
        <button className="navbar-login" onClick={handleLoginClick}>
          Login (User: {user ? 'Logged In' : 'Not Logged In'})
        </button>
      ) : (
        // Show hamburger menu when logged in
        <div className="navbar-user-section" ref={menuRef}>
          <div className="hamburger-menu" onClick={toggleMenu}>
            <div className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></div>
            <div className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></div>
            <div className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></div>
          </div>
          
          {isMenuOpen && (
            <div className="dropdown-menu">
              <div className="user-info">
                <span>Welcome, User!</span>
              </div>
              <ul className="menu-items">
                <li onClick={() => { navigate("/dashboard"); setIsMenuOpen(false); }}>
                  Dashboard
                </li>
                <li onClick={() => { navigate("/cart"); setIsMenuOpen(false); }}>
                  Cart
                </li>
                <li onClick={() => { navigate("/"); setIsMenuOpen(false); }}>
                  Home
                </li>
                <li onClick={handleLogout}>
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
