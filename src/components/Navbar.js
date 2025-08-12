import React from "react";


function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">CraveCart</div>
      <ul className="navbar-links">
        <li>Home</li>
        <li>About us</li>
        <li>Help/Support</li>
      </ul>
      <button className="navbar-login">Login</button>
    </nav>
  );
}

export default Navbar;
