import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

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

  // Function to check localStorage for user data
  const checkLocalStorage = () => {
    const localUser = localStorage.getItem('user');
    console.log('AuthContext - Checking localStorage:', localUser);
    if (localUser) {
      try {
        const parsedUser = JSON.parse(localUser);
        console.log('AuthContext - Parsed user from localStorage:', parsedUser);
        setUser(parsedUser);
        return true;
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        localStorage.removeItem('user');
        setUser(null);
        return false;
      }
    }
    return false;
  };

  useEffect(() => {
    console.log('AuthContext - useEffect running, checking Firebase auth...');
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log('AuthContext - Firebase auth state changed:', firebaseUser);
      if (firebaseUser) {
        // User is signed in via Firebase
        const userData = {
          uid: firebaseUser.uid,
          phone: firebaseUser.phoneNumber,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          method: firebaseUser.phoneNumber ? 'firebase' : 'google'
        };
        console.log('AuthContext - Setting user from Firebase:', userData);
        setUser(userData);
        // Also store in localStorage for consistency
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        // Check localStorage for user data
        console.log('AuthContext - No Firebase user, checking localStorage...');
        checkLocalStorage();
      }
      setLoading(false);
    });

    // Also check localStorage on mount
    console.log('AuthContext - Component mounted, checking localStorage...');
    checkLocalStorage();

    return unsubscribe;
  }, []);

  // Listen for storage changes (when localStorage is updated from other tabs/windows)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        if (e.newValue) {
          try {
            const parsedUser = JSON.parse(e.newValue);
            setUser(parsedUser);
          } catch (error) {
            console.error('Error parsing user data from storage change:', error);
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      // Even if Firebase logout fails, clear localStorage
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 