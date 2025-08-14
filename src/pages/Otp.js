import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Otp.css';
import burger from './burger.png';

const Otp = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone;

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus to next input
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
      // Verify OTP using Firebase
      if (window.confirmationResult) {
        const result = await window.confirmationResult.confirm(code);
        
        if (result.user) {
          // Successfully verified
          alert('✅ OTP verified successfully!');
          
          try {
            // Store user info directly in localStorage after successful verification
            const userData = {
              uid: result.user.uid,
              phone: result.user.phoneNumber,
              method: 'firebase'
            };
            
            localStorage.setItem('user', JSON.stringify(userData));
            console.log('OTP - User data stored in localStorage:', userData);
            
            // Navigate to dashboard
            navigate('/dashboard');
            
          } catch (error) {
            console.error('Error storing user data:', error);
            alert('❌ Failed to store user data. Please try again.');
          }
        }
      } else {
        alert('❌ OTP session expired. Please try again.');
        navigate('/login');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      alert('❌ Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      // Navigate back to login to resend OTP
      navigate('/login');
    } catch (error) {
      alert('❌ Failed to resend OTP. Please try again.');
    }
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
