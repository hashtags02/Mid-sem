import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

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
