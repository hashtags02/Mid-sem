import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate("/")}>CraveCart</div>
      <ul className="navbar-links">
        <li onClick={() => navigate("/")}>Home</li>
        <li onClick={() => navigate("/track")}>Track Order</li>
        <li>About us</li>
        <li>Help/Support</li>
      </ul>
      <button className="navbar-login" onClick={() => navigate("/login")}>Login</button>
    </nav>
  );
}

export default Navbar;
