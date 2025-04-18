import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const updateAuthState = (userData) => {
    if (!userData || !userData.id) {
      throw new Error('Invalid user data');
    }
    
    setIsLoggedIn(true);
    setUserRole(userData.role);
    setUsername(userData.username);
    setUserId(userData.id);
    setUser(userData);
    sessionStorage.setItem('user', JSON.stringify(userData));
  };

  const clearAuthState = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setUsername('');
    setUserId(null);
    setUser(null);
    localStorage.removeItem('token');
    sessionStorage.removeItem('user');
  };

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        clearAuthState();
        setIsLoading(false);
        return;
      }

      // Set token in api headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Try to get user data from session storage first for immediate UI update
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        updateAuthState(userData);
      }

      // Verify token and get fresh user data from server
      const response = await api.get('/users/me');
      const userData = response.data;
      
      if (!userData || !userData.id) {
        throw new Error('Invalid user data received from server');
      }

      updateAuthState(userData);
    } catch (error) {
      console.error('Error checking auth status:', error);
      clearAuthState();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (token, userData) => {
    try {
      if (!token || !userData || !userData.id) {
        throw new Error('Invalid login data');
      }

      // Store token and set in api headers
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Update auth state with user data
      updateAuthState(userData);

      // Verify token immediately
      const response = await api.get('/users/me');
      if (response.data.id !== userData.id) {
        throw new Error('User verification failed');
      }

      return true;
    } catch (error) {
      console.error('Error during login:', error);
      clearAuthState();
      throw error;
    }
  };

  const logout = () => {
    clearAuthState();
    delete api.defaults.headers.common['Authorization'];
  };

  // Initialize auth state when component mounts
  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuth();
    };
    initializeAuth();
  }, []);

  const value = {
    isLoggedIn,
    userRole,
    username,
    userId,
    user,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 