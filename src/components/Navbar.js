import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

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
      <div className="navbar-logo" onClick={() => navigate("/")}>CraveCart</div>
      <ul className="navbar-links">
        <li onClick={() => navigate("/")}>Home</li>
        <li onClick={() => navigate("/track")}>Track Order</li>
        <li onClick={() => navigate("/group/join")}>Join Group Order</li>
        <li onClick={() => navigate("/about")}>About us</li>
        <li onClick={() => navigate("/help")}>Help/Support</li>
      </ul>

      {!user ? (
        // Show login button when not logged in
        <button className="navbar-login" onClick={handleLoginClick}>
          Login
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
                <li onClick={() => { navigate("/dashboard"); setIsMenuOpen(false); }}>Dashboard</li>
                <li onClick={() => { navigate("/cart"); setIsMenuOpen(false); }}>Cart</li>
                <li onClick={() => { navigate("/"); setIsMenuOpen(false); }}>Home</li>
                <li onClick={() => { navigate("/about"); setIsMenuOpen(false); }}>About Us</li>
                <li onClick={() => { navigate("/help"); setIsMenuOpen(false); }}>Help/Support</li>
                <li onClick={handleLogout}>Logout</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
