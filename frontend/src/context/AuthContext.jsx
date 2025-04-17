import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await api.get('/users/me');
        setIsLoggedIn(true);
        setUserRole(response.data.role);
        setUsername(response.data.username);
      } catch (error) {
        console.error('Error checking auth status:', error);
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUserRole(null);
        setUsername('');
      }
    } else {
      setIsLoggedIn(false);
      setUserRole(null);
      setUsername('');
    }
    setIsLoading(false);
  };

  const login = async (token, userData) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
    setUserRole(userData.role);
    setUsername(userData.username);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserRole(null);
    setUsername('');
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, username, login, logout, isLoading }}>
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