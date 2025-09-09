import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { firebaseOTPService } from '../services/firebaseOTP';
import './PhoneNumberInput.css';

const PhoneNumberInput = ({ onSuccess, onBack }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('phone'); // 'phone', 'otp', 'userDetails'
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    address: ''
  });
  const recaptchaContainerRef = useRef(null);

  const { 
    checkPhoneNumber, 
    sendLoginOTP, 
    sendRegistrationOTP, 
    verifyLoginOTP, 
    verifyRegistrationOTP,
    isExistingUser,
    resetOTPState 
  } = useAuth();

  // Cleanup Firebase OTP service on unmount
  useEffect(() => {
    return () => {
      firebaseOTPService.clearRecaptcha();
    };
  }, []);

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Format phone number for Firebase (add +91 for India)
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      
      console.log('Checking phone number:', phoneNumber);
      console.log('Formatted phone for Firebase:', formattedPhone);
      
      // Check if phone number is registered
      const checkResult = await checkPhoneNumber(phoneNumber);
      
      console.log('Phone check result:', checkResult);
      
      if (checkResult.success) {
        if (checkResult.isRegistered) {
          console.log('User exists - proceeding to login OTP');
          // User exists, send login OTP via Firebase
          const otpResult = await firebaseOTPService.sendOTP(formattedPhone, 'recaptcha-container');
          if (otpResult.success) {
            // Store confirmation result globally for OTP verification
            window.confirmationResult = firebaseOTPService.confirmationResult;
            setStep('otp');
          } else {
            setError(otpResult.error || 'Failed to send OTP');
          }
        } else {
          console.log('New user - proceeding to user details');
          // New user, send registration OTP via Firebase
          const otpResult = await firebaseOTPService.sendOTP(formattedPhone, 'recaptcha-container');
          if (otpResult.success) {
            // Store confirmation result globally for OTP verification
            window.confirmationResult = firebaseOTPService.confirmationResult;
            setStep('userDetails');
          } else {
            setError(otpResult.error || 'Failed to send OTP');
          }
        }
      } else {
        setError(checkResult.error || 'Failed to check phone number');
      }
    } catch (error) {
      console.error('Phone submit error:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let result;
      
      // Debug logging
      console.log('OTP Verification - isExistingUser:', isExistingUser);
      console.log('OTP Verification - phoneNumber:', phoneNumber);
      console.log('OTP Verification - userDetails:', userDetails);
      
      if (isExistingUser) {
        console.log('Processing as existing user login...');
        // Verify login OTP via Firebase
        const firebaseResult = await firebaseOTPService.verifyOTP(otp);
        if (firebaseResult.success) {
          // Get Firebase ID token
          const idToken = await firebaseResult.user.getIdToken();
          console.log('Firebase ID token obtained for login');
          
          // Verify with backend using ID token
          result = await verifyLoginOTP(phoneNumber, idToken);
        } else {
          setError(firebaseResult.error || 'Invalid OTP');
          setLoading(false);
          return;
        }
      } else {
        console.log('Processing as new user registration...');
        // Verify registration OTP via Firebase
        const firebaseResult = await firebaseOTPService.verifyOTP(otp);
        if (firebaseResult.success) {
          // Get Firebase ID token
          const idToken = await firebaseResult.user.getIdToken();
          console.log('Firebase ID token obtained for registration');
          
          // Register user with backend using ID token
          result = await verifyRegistrationOTP(phoneNumber, idToken, userDetails);
        } else {
          setError(firebaseResult.error || 'Invalid OTP');
          setLoading(false);
          return;
        }
      }

      if (result.success) {
        resetOTPState();
        firebaseOTPService.clearRecaptcha();
        onSuccess(result.user);
      } else {
        setError(result.error || 'Authentication failed');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUserDetailsSubmit = (e) => {
    e.preventDefault();
    if (!userDetails.name || !userDetails.email) {
      setError('Please fill in all required fields');
      return;
    }
    setStep('otp');
  };

  const handleBack = () => {
    if (step === 'otp') {
      setStep('phone');
      setOtp('');
    } else if (step === 'userDetails') {
      setStep('phone');
    }
    setError('');
    resetOTPState();
    firebaseOTPService.clearRecaptcha();
  };

  const resendOTP = async () => {
    setLoading(true);
    setError('');
    
    try {
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      const result = await firebaseOTPService.sendOTP(formattedPhone, 'recaptcha-container');
      
      if (!result.success) {
        setError(result.error || 'Failed to resend OTP');
      }
    } catch (error) {
      setError('Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'phone') {
    return (
      <div className="phone-input-container">
        <h2>Welcome to CraveCart</h2>
        <p>Enter your phone number to continue</p>
        
        <form onSubmit={handlePhoneSubmit}>
          <div className="input-group">
            <input
              type="tel"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
              disabled={loading}
              required
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" disabled={loading} className="primary-button">
            {loading ? 'Checking...' : 'Continue'}
          </button>
        </form>
        
        {/* Hidden reCAPTCHA container */}
        <div id="recaptcha-container" ref={recaptchaContainerRef}></div>
      </div>
    );
  }

  if (step === 'userDetails') {
    return (
      <div className="phone-input-container">
        <h2>Complete Your Profile</h2>
        <p>Please provide your details to complete registration</p>
        
        <form onSubmit={handleUserDetailsSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Full Name"
              value={userDetails.name}
              onChange={(e) => setUserDetails({...userDetails, name: e.target.value})}
              required
            />
          </div>
          
          <div className="input-group">
            <input
              type="email"
              placeholder="Email Address"
              value={userDetails.email}
              onChange={(e) => setUserDetails({...userDetails, email: e.target.value})}
              required
            />
          </div>
          
          <div className="input-group">
            <textarea
              placeholder="Delivery Address (Optional)"
              value={userDetails.address}
              onChange={(e) => setUserDetails({...userDetails, address: e.target.value})}
              rows="3"
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="button-group">
            <button type="button" onClick={handleBack} className="secondary-button">
              Back
            </button>
            <button type="submit" className="primary-button">
              Continue
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (step === 'otp') {
    return (
      <div className="phone-input-container">
        <h2>Verify OTP</h2>
        <p>Enter the 6-digit code sent to {phoneNumber}</p>
        
        <form onSubmit={handleOTPSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength="6"
              disabled={loading}
              required
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="button-group">
            <button type="button" onClick={handleBack} className="secondary-button">
              Back
            </button>
            <button type="submit" disabled={loading} className="primary-button">
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
          
          <div className="resend-section">
            <p>Didn't receive the code?</p>
            <button type="button" onClick={resendOTP} disabled={loading} className="resend-button">
              Resend OTP
            </button>
          </div>
        </form>
      </div>
    );
  }

  return null;
};

export default PhoneNumberInput;
