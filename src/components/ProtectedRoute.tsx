import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { logger } from '../utils/logger';
import { authStorage } from '../utils/authStorage';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute component ensures that only authenticated users
 * with valid, non-expired tokens can access protected routes.
 *
 * Security checks:
 * 1. Verifies token exists in storage (sessionStorage or localStorage)
 * 2. Validates token expiry date
 * 3. Redirects to login if authentication fails
 * 4. Prevents cross-device session hijacking by using sessionStorage by default
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const validateAuth = () => {
      try {
        // Use authStorage for secure, centralized authentication validation
        const authenticated = authStorage.isAuthenticated();

        if (!authenticated) {
          logger.warn('Authentication validation failed - redirecting to login');
          authStorage.clearAuth();
          setIsAuthenticated(false);
          setIsValidating(false);
          return;
        }

        // Token is valid
        logger.info('Authentication validated successfully');
        setIsAuthenticated(true);
        setIsValidating(false);
      } catch (error) {
        logger.error('Error validating authentication:', error);
        authStorage.clearAuth();
        setIsAuthenticated(false);
        setIsValidating(false);
      }
    };

    validateAuth();
  }, [location.pathname]);

  // Show loading state while validating
  if (isValidating) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    logger.info('User not authenticated - redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render protected content
  return <>{children}</>;
};

export default ProtectedRoute;
