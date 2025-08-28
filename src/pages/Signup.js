import React from 'react';
import './Signup.css';
import { useNavigate } from 'react-router-dom';
import burger from './burger.png';
import PhoneNumberInput from '../components/PhoneNumberInput';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'restaurant_owner') {
        navigate('/resturant-dashboard');
      } else if (user.role === 'delivery' || user.role === 'delivery_partner') {
        navigate('/delivery');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  const handleAuthSuccess = (userData) => {
    alert('✅ Successfully registered!');
    if (!userData) {
      navigate('/dashboard');
      return;
    }
    if (userData.role === 'admin') {
      navigate('/admin');
    } else if (userData.role === 'restaurant_owner') {
      navigate('/resturant-dashboard');
    } else if (userData.role === 'delivery' || userData.role === 'delivery_partner') {
      navigate('/delivery');
    } else {
      navigate('/dashboard');
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="signup-container">
      <div className="signup-content">
        <div className="signup-header">
          <img src={burger} alt="Burger" className="burger-icon" />
          <h1>CraveCart</h1>
        </div>

        <div className="signup-form-container">
          <h2>Join CraveCart</h2>
          <p>Create your account to start ordering delicious food</p>
          
          <PhoneNumberInput 
            onSuccess={handleAuthSuccess}
            onBack={handleBackToHome}
          />
          
          <div className="signup-footer">
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

export default Signup;
