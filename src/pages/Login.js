import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import burger from './burger.png';
import googleLogo from './google-logo.png';
import { auth } from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Initialize reCAPTCHA
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'normal',
        'callback': (response) => {
          console.log('reCAPTCHA solved');
        }
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!phone || phone.length < 10) {
      alert('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    
    try {
      setupRecaptcha();
      
      // Format phone number with country code
      const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
      
      const confirmationResult = await signInWithPhoneNumber(
        auth, 
        formattedPhone, 
        window.recaptchaVerifier
      );
      
      // Store the confirmation result for OTP verification
      window.confirmationResult = confirmationResult;
      
      // Navigate to OTP page
      navigate('/otp', { state: { phone: formattedPhone } });
      
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // For now, redirect to backend Google OAuth
    // You can implement Firebase Google Auth later if needed
    window.location.href = 'http://localhost:5000/auth/google';
  };

  const goToSignup = () => {
    navigate('/signup');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="left-side">
          <img src={burger} alt="Burger" className="burger-img" />
        </div>
        <div className="right-side">
          <h1 className="title">CRAVECART</h1>
          <form onSubmit={handleLogin}>
            <input
              type="tel"
              placeholder="Phone Number"
              required
              className="input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
          
          {/* reCAPTCHA container */}
          <div id="recaptcha-container"></div>
          
          <div className="or">or</div>
          <button className="google-btn" onClick={handleGoogleLogin}>
            <img src={googleLogo} alt="Google" className="google-icon" />
            Continue with Google
          </button>
          <p className="new-user" onClick={goToSignup}>New User?</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
