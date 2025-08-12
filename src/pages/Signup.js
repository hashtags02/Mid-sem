import React from 'react';
import './Signup.css';
import { useNavigate } from 'react-router-dom';
import burger from './burger.png';

const Signup = () => {
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    // Add validation/backend call here if needed
    alert("Signup successful!");
    navigate('/dashboard'); // Redirect to dashboard
  };

  const goToLogin = () => {
    console.log("Login redirect clicked");
    navigate('/'); // Redirects to Login page
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-container">
        <div className="signup-left">
          <img src={burger} alt="Burger" className="signup-burger" />
        </div>
        <div className="signup-right">
          <h1>CRAVECART</h1>
          <p className="subtitle">Create your account</p>

          <form onSubmit={handleSignup} className="signup-form">
            <input type="text" placeholder="Full Name" required />
            <input type="email" placeholder="Email (optional)" />
            <input type="text" placeholder="Phone Number" required />
            <input
              type="date"
              placeholder="Date of Birth"
              required
              style={{ textTransform: 'uppercase', color: 'white' }}
            />
            <button type="submit" className="signup-btn">Sign Up</button>
          </form>

          <p className="login-link">
            Already have an account?{' '}
            <span
              onClick={goToLogin}
              style={{ cursor: 'pointer', color: '#ff7c00', textDecoration: 'underline' }}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
