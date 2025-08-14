import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import burger from './burger.png';
import googleLogo from './google-logo.png';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user starts typing
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return false;
    }

    if (!isLogin) {
      // Registration validation
      if (!formData.name || !formData.phone) {
        setError('Name and phone number are required');
        return false;
      }
      
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return false;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      
      if (!/^[0-9]{10}$/.test(formData.phone)) {
        setError('Please enter a valid 10-digit phone number');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      let result;
      
      if (isLogin) {
        // Login
        result = await login({
          email: formData.email,
          password: formData.password
        });
      } else {
        // Register
        result = await register({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        });
      }

      if (result.success) {
        alert(`✅ Successfully ${isLogin ? 'logged in' : 'registered'}!`);
        navigate('/dashboard');
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError(error.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    });
    setError('');
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-header">
          <img src={burger} alt="Burger" className="burger-icon" />
          <h1>CraveCart</h1>
        </div>

        <div className="login-form-container">
          <h2>{isLogin ? 'Welcome Back!' : 'Create Account'}</h2>
          <p className="login-subtitle">
            {isLogin ? 'Sign in to continue to CraveCart' : 'Join CraveCart to start ordering'}
          </p>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            {!isLogin && (
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            {!isLogin && (
              <div className="form-group">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number (10 digits)"
                  value={formData.phone}
                  onChange={handleInputChange}
                  maxLength="10"
                  required
                />
              </div>
            )}

            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            {!isLogin && (
              <div className="form-group">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}

            <button 
              type="submit" 
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="login-divider">
            <span>or</span>
          </div>

          <button className="google-login-button" disabled>
            <img src={googleLogo} alt="Google" />
            Continue with Google (Coming Soon)
          </button>

          <div className="login-footer">
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button" 
                className="toggle-mode-button"
                onClick={toggleMode}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
