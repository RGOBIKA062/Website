import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing user session on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (authAPI.isAuthenticated()) {
        try {
          const response = await authAPI.getCurrentUser();
          if (response.success) {
            setUser(response.data.user);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Error getting current user:', error);
          authAPI.logout();
          setIsAuthenticated(false);
        }
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email, password, masterPassword) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await authAPI.login({ email, password, masterPassword });
      
      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      setError(error.message);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, masterPassword, username) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await authAPI.register({ username: username || email, email, password, masterPassword });
      
      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        throw new Error(response.message || 'Signup failed');
      }
    } catch (error) {
      setError(error.message);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    setError(null);
    setIsAuthenticated(false);
  };

  const verifyMasterPassword = async (masterPassword) => {
    try {
      setError(null);
      
      if (!masterPassword) {
        throw new Error('Master password is required');
      }

      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // For demo purposes, accept any master password of 8+ characters
      if (masterPassword.length >= 8) {
        return { success: true };
      } else {
        throw new Error('Invalid master password');
      }
    } catch (error) {
      setError(error.message);
      return { success: false, message: error.message };
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    verifyMasterPassword,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
