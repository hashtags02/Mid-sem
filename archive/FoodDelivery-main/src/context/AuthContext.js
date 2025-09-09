import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export { AuthContext };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isExistingUser, setIsExistingUser] = useState(false);

  // Function to check localStorage for user data
  const checkLocalStorage = () => {
    const localUser = localStorage.getItem('user');
    const token = localStorage.getItem('jwt_token');
    console.log('AuthContext - Checking localStorage:', localUser);
    
    if (localUser && token) {
      try {
        const parsedUser = JSON.parse(localUser);
        console.log('AuthContext - Parsed user from localStorage:', parsedUser);
        setUser(parsedUser);
        return true;
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('jwt_token');
        setUser(null);
        return false;
      }
    }
    return false;
  };

  // Function to validate token with backend
  const validateToken = async () => {
    const token = localStorage.getItem('jwt_token');
    if (!token) return false;

    try {
      const userData = await authAPI.getCurrentUser();
      console.log('AuthContext - Token validated, user data:', userData);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('AuthContext - Token validation failed:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('jwt_token');
      setUser(null);
      return false;
    }
  };

  useEffect(() => {
    console.log('AuthContext - useEffect running, checking authentication...');
    
    const initializeAuth = async () => {
      // First check localStorage for existing data
      const hasLocalData = checkLocalStorage();
      
      if (hasLocalData) {
        // If we have local data, validate the token with the backend
        await validateToken();
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Listen for storage changes (when localStorage is updated from other tabs/windows)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'user' || e.key === 'jwt_token') {
        if (e.key === 'jwt_token' && !e.newValue) {
          // Token was removed, clear user
          setUser(null);
        } else if (e.key === 'user' && e.newValue) {
          try {
            const parsedUser = JSON.parse(e.newValue);
            setUser(parsedUser);
          } catch (error) {
            console.error('Error parsing user data from storage change:', error);
            setUser(null);
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { token } = response;
      
      // Store token
      localStorage.setItem('jwt_token', token);
      
      // Get user data
      const userData = await authAPI.getCurrentUser();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { token } = response;
      
      // Store token
      localStorage.setItem('jwt_token', token);
      
      // Get user data
      const user = await authAPI.getCurrentUser();
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { success: true, user };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Always clear local data
      localStorage.removeItem('user');
      localStorage.removeItem('jwt_token');
      setUser(null);
    }
  };

  // Check if phone number is registered
  const checkPhoneNumber = async (phone) => {
    try {
      const response = await authAPI.checkPhoneNumber(phone);
      setIsExistingUser(response.isRegistered);
      setPhoneNumber(phone);
      return { success: true, isRegistered: response.isRegistered };
    } catch (error) {
      console.error('Phone number check error:', error);
      return { success: false, error: error.message };
    }
  };

  // Send OTP for login
  const sendLoginOTP = async (phone) => {
    try {
      await authAPI.sendLoginOTP(phone);
      setOtpSent(true);
      setPhoneNumber(phone);
      return { success: true };
    } catch (error) {
      console.error('Send login OTP error:', error);
      return { success: false, error: error.message };
    }
  };

  // Send OTP for registration
  const sendRegistrationOTP = async (phone) => {
    try {
      await authAPI.sendRegistrationOTP(phone);
      setOtpSent(true);
      setPhoneNumber(phone);
      return { success: true };
    } catch (error) {
      console.error('Send registration OTP error:', error);
      return { success: false, error: error.message };
    }
  };

  // Verify OTP for login
  const verifyLoginOTP = async (phoneNumber, idToken) => {
    try {
      const response = await authAPI.verifyLoginOTP(phoneNumber, idToken);
      const { token } = response;
      
      // Store token
      localStorage.setItem('jwt_token', token);
      
      // Get user data
      const userData = await authAPI.getCurrentUser();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Reset OTP state
      setOtpSent(false);
      setPhoneNumber('');
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Verify login OTP error:', error);
      return { success: false, error: error.message };
    }
  };

  // Verify OTP for registration
  const verifyRegistrationOTP = async (phoneNumber, idToken, userData) => {
    try {
      const response = await authAPI.verifyRegistrationOTP(phoneNumber, idToken, userData);
      const { token } = response;
      
      // Store token
      localStorage.setItem('jwt_token', token);
      
      // Get user data
      const user = await authAPI.getCurrentUser();
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Reset OTP state
      setOtpSent(false);
      setPhoneNumber('');
      setIsExistingUser(false);
      
      return { success: true, user };
    } catch (error) {
      console.error('Verify registration OTP error:', error);
      return { success: false, error: error.message };
    }
  };

  // Reset OTP state
  const resetOTPState = () => {
    setOtpSent(false);
    setPhoneNumber('');
    setIsExistingUser(false);
  };

  const value = {
    user,
    loading,
    otpSent,
    phoneNumber,
    isExistingUser,
    login,
    register,
    logout,
    checkPhoneNumber,
    sendLoginOTP,
    sendRegistrationOTP,
    verifyLoginOTP,
    verifyRegistrationOTP,
    resetOTPState
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 