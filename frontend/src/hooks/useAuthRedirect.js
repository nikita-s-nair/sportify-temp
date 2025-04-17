import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const useAuthRedirect = (requiredRole) => {
  const { isLoggedIn, userRole, username, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't redirect while checking authentication
    if (isLoading) return;

    if (!isLoggedIn) {
      navigate('/login', { state: { from: location }, replace: true });
      return;
    }

    if (requiredRole && userRole !== requiredRole) {
      navigate('/dashboard', { replace: true });
    }
  }, [isLoggedIn, userRole, requiredRole, navigate, location, isLoading]);

  // Return a user object that matches the expected structure
  const user = isLoggedIn ? {
    username,
    role: userRole
  } : null;

  return { user, isAuthenticated: isLoggedIn };
}; 