import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import burger from './burger.png';
import PhoneNumberInput from '../components/PhoneNumberInput';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [showOTP, setShowOTP] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleAuthSuccess = (userData) => {
    alert('✅ Successfully authenticated!');
    navigate('/dashboard');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-header">
          <img src={burger} alt="Burger" className="burger-icon" />
          <h1>CraveCart</h1>
        </div>

        <div className="login-form-container">
          <PhoneNumberInput 
            onSuccess={handleAuthSuccess}
            onBack={handleBackToHome}
          />
          
          <div className="login-footer">
            <button 
              type="button" 
              className="back-home-button"
              onClick={handleBackToHome}
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
