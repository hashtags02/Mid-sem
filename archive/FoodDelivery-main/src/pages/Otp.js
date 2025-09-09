import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Otp.css';
import burger from './burger.png';

const Otp = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // These come from Login.js
  const phone = location.state?.phone;
  const isNewUser = location.state?.isNewUser;
  const signupData = location.state?.signupData || {};

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join('');

    if (code.length !== 6) {
      alert('Please enter a 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      if (!window.confirmationResult) {
        alert('❌ OTP session expired. Please try again.');
        navigate('/login');
        return;
      }

      const result = await window.confirmationResult.confirm(code);

      if (result.user) {
        // Firebase verification success
        const idToken = await result.user.getIdToken();

        let backendResponse;
        if (isNewUser) {
          // Create account in backend
          backendResponse = await fetch('http://localhost:5000/api/auth/signup-phone', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify({
              phone,
              name: signupData.name,
              email: signupData.email,
            }),
          });
        } else {
          // Login existing account in backend
          backendResponse = await fetch('http://localhost:5000/api/auth/login-phone', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify({ phone }),
          });
        }

        const data = await backendResponse.json();
        if (!backendResponse.ok) throw new Error(data.message || 'Backend error');

        // Store token & user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        navigate('/dashboard');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      alert('❌ Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    navigate('/login');
  };

  if (!phone) {
    return (
      <div className="otp-container">
        <div className="otp-box">
          <div className="left-side">
            <img src={burger} alt="Burger" className="burger-img" />
          </div>
          <div className="right-side">
            <h1 className="title">CRAVECART</h1>
            <p className="subtitle">Phone number not found. Please try again.</p>
            <button onClick={() => navigate('/login')} className="login-btn">
              Go Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="otp-container">
      <div className="otp-box">
        <div className="left-side">
          <img src={burger} alt="Burger" className="burger-img" />
        </div>
        <div className="right-side">
          <h1 className="title">CRAVECART</h1>
          <p className="subtitle">Enter the OTP sent to {phone}</p>

          <form onSubmit={handleSubmit}>
            <div className="otp-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  className="otp-input"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  disabled={loading}
                />
              ))}
            </div>

            <div className="resend" onClick={handleResend}>Resend OTP</div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <p className="footer-text">By verifying, you agree to our terms</p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Otp;
