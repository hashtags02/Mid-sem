import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import burger from './burger.png';
import googleLogo from './google-logo.png';
import { auth } from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
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

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    
    try {
      const provider = new GoogleAuthProvider();
      
      // Add custom parameters for better user experience
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      const result = await signInWithPopup(auth, provider);
      
      if (result.user) {
        // Successfully signed in with Google
        alert('✅ Successfully signed in with Google!');
        
        // Store user info in localStorage
        const userData = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          method: 'google'
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('Google Login - User data stored in localStorage:', userData);
        
        // Navigate to dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      
      // Handle specific error cases
      if (error.code === 'auth/popup-closed-by-user') {
        alert('Sign-in was cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        alert('Pop-up was blocked. Please allow pop-ups for this site and try again.');
      } else {
        alert('Failed to sign in with Google. Please try again.');
      }
    } finally {
      setGoogleLoading(false);
    }
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
          <button 
            className="google-btn" 
            onClick={handleGoogleLogin}
            disabled={googleLoading}
          >
            <img src={googleLogo} alt="Google" className="google-icon" />
            {googleLoading ? 'Signing in...' : 'Continue with Google'}
          </button>
          <p className="new-user" onClick={goToSignup}>New User?</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
