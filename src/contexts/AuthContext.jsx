import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Configure axios defaults - use environment variable or fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

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

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // For production deployment without backend, skip auth check
      if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
        console.log('Production mode: Skipping auth check');
        setLoading(false);
        return;
      }
      
      const response = await axios.get('/auth/status');
      if (response.data.authenticated) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Auth status check failed:', error);
      // For production, create a demo user if no backend
      if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
        setUser({ username: 'demo', email: 'demo@example.com' });
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      // For production deployment without backend, create demo user
      if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
        setUser({ username, email: `${username}@example.com` });
        return { success: true, message: 'Demo login successful' };
      }
      
      const response = await axios.post('/auth/login', { username, password });
      setUser(response.data.user);
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed';
      return { success: false, message };
    }
  };

  const signup = async (username, email, password) => {
    try {
      // For production deployment without backend, create demo user
      if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
        setUser({ username, email });
        return { success: true, message: 'Demo signup successful' };
      }
      
      const response = await axios.post('/auth/signup', { username, email, password });
      setUser(response.data.user);
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.error || 'Signup failed';
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
        setUser(null);
        return { success: true, message: 'Logged out successfully' };
      }
      
      await axios.post('/auth/logout');
      setUser(null);
      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null); // Clear user state even if logout request fails
      return { success: true, message: 'Logged out successfully' };
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    signup,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
