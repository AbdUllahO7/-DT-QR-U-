import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const checkIntervalRef = useRef<number | null>(null);  // Changed from NodeJS.Timeout to number

  // Check auth status and set up automatic checking
  useEffect(() => {
    checkAuth();
    
    // Set up periodic token expiry checking (every 30 seconds)
    const startTokenExpiryCheck = () => {
      // Clear any existing interval
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
      
      // Check every 30 seconds
      checkIntervalRef.current = window.setInterval(() => {  // Using window.setInterval for clarity
        checkTokenExpiry();
      }, 30000); // 30 seconds
    };

    startTokenExpiryCheck();

    // Cleanup on unmount
    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, []);

  // Check if token is expired and redirect if necessary
  const checkTokenExpiry = useCallback(() => {
    try {
      const token = localStorage.getItem('token');
      const tokenExpiry = localStorage.getItem('tokenExpiry');

      if (!token || !tokenExpiry) {
        if (isAuthenticated) {
          clearAuth();
          navigate('/login', { replace: true });
        }
        return false;
      }

      const expiryDate = new Date(tokenExpiry);
      const now = new Date();

      // Check if date is valid
      if (isNaN(expiryDate.getTime())) {
        clearAuth();
        navigate('/login', { replace: true });
        return false;
      }

      // Check if token has expired
      if (expiryDate <= now) {
        clearAuth();
        navigate('/login', { replace: true });
        return false;
      }

      // Optional: Warn user when token is about to expire (5 minutes before)
      const timeUntilExpiry = expiryDate.getTime() - now.getTime();
      const fiveMinutes = 5 * 60 * 1000;
      
      if (timeUntilExpiry <= fiveMinutes && timeUntilExpiry > 0) {
        console.warn(`Token will expire in ${Math.round(timeUntilExpiry / 1000)} seconds`);
        // You could show a warning notification here
        // Example: showNotification('Your session will expire soon. Please save your work.');
      }

      return true;
    } catch (error) {
      console.error('Error checking token expiry:', error);
      clearAuth();
      navigate('/login', { replace: true });
      return false;
    }
  }, [isAuthenticated, navigate]);

  const checkAuth = useCallback(() => {
    try {
      const token = localStorage.getItem('token');
      const tokenExpiry = localStorage.getItem('tokenExpiry');

      if (token && tokenExpiry) {
        const expiryDate = new Date(tokenExpiry);
        const now = new Date();
        
        if (!isNaN(expiryDate.getTime()) && expiryDate > now) {
          setIsAuthenticated(true);
          
          // Calculate time until expiry and set a timeout for automatic logout
          const timeUntilExpiry = expiryDate.getTime() - now.getTime();
          
          if (timeUntilExpiry > 0) {
            window.setTimeout(() => {  // Using window.setTimeout for clarity
              clearAuth();
              navigate('/login', { replace: true });
            }, timeUntilExpiry);
          }
        } else {
          clearAuth();
          navigate('/login', { replace: true });
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error during checkAuth:', error);
      clearAuth();
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const clearAuth = useCallback(() => {
    // Clear all auth-related data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('userId');
    localStorage.removeItem('restaurantName');
    localStorage.removeItem('selectedBranchId');
    localStorage.removeItem('selectedBranchName');
    
    // Clear the interval when logging out
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
      checkIntervalRef.current = null;
    }
    
    setIsAuthenticated(false);
  }, []);

  const requireAuth = useCallback((callback?: () => void) => {
    try {
      const token = localStorage.getItem('token');
      const tokenExpiry = localStorage.getItem('tokenExpiry');

      if (!token || !tokenExpiry) {
        clearAuth();
        navigate('/login', { replace: true });
        return false;
      }
      
      const expiryDate = new Date(tokenExpiry);
      const now = new Date();
      
      // Check for invalid date
      if (isNaN(expiryDate.getTime())) {
        clearAuth();
        navigate('/login', { replace: true });
        return false;
      }
      
      // Check if expired
      if (expiryDate <= now) {
        clearAuth();
        navigate('/login', { replace: true });
        return false;
      }
      
      // Execute callback if provided
      if (callback) {
        callback();
      }
      
      return true;
    } catch (error) {
      console.error('Error during requireAuth:', error);
      clearAuth();
      navigate('/login', { replace: true });
      return false;
    }
  }, [navigate, clearAuth]);

  // Function to manually trigger auth check
  const refreshAuth = useCallback(() => {
    return checkTokenExpiry();
  }, [checkTokenExpiry]);

  return {
    isAuthenticated,
    isLoading,
    checkAuth,
    clearAuth,
    requireAuth,
    refreshAuth,
    checkTokenExpiry
  };
};