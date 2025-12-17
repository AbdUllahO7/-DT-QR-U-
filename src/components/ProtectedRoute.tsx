import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();

  // Check if user is authenticated
  const token = localStorage.getItem('token');
  const tokenExpiry = localStorage.getItem('tokenExpiry');
  const onboardingUserId = localStorage.getItem('onboarding_userId');

  // Allow onboarding routes without token if user is in onboarding process
  const isOnboardingRoute = location.pathname.startsWith('/onboarding');
  if (isOnboardingRoute && onboardingUserId) {
    return children;
  }

  // If no token, redirect to login
  if (!token || !tokenExpiry) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if token is expired
  try {
    const expiryDate = new Date(tokenExpiry);
    const now = new Date();

    if (expiryDate <= now) {
      // Token expired, clear it and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiry');
      localStorage.removeItem('userId');
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  } catch (error) {
    // Invalid expiry date, clear everything and redirect
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('userId');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Token is valid, render the protected component
  return children;
};

export default ProtectedRoute;
