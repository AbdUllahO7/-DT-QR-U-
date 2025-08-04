import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const token = localStorage.getItem('token');
      const tokenExpiry = localStorage.getItem('tokenExpiry');

      if (token && tokenExpiry) {
        // Token'ın geçerlilik süresini kontrol et
        const expiryDate = new Date(tokenExpiry);
        if (!isNaN(expiryDate.getTime()) && expiryDate > new Date()) {
          setIsAuthenticated(true);
        } else {
          // Token süresi dolmuşsa token'ı temizle
          console.log('Token expired during checkAuth');
          clearAuth();
        }
      } else {
        // Token yoksa authenticated değil
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error during checkAuth:', error);
      clearAuth();
    } finally {
      setIsLoading(false);
    }
  };

  const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('userId');
    localStorage.removeItem('restaurantName');
    localStorage.removeItem('selectedBranchId');
    localStorage.removeItem('selectedBranchName');
    setIsAuthenticated(false);
  };

  const requireAuth = (callback?: () => void) => {
    try {
      const token = localStorage.getItem('token');
      const tokenExpiry = localStorage.getItem('tokenExpiry');

      if (!token || !tokenExpiry) {
        console.log('Auth check failed: Token or expiry not found');
        clearAuth();
        navigate('/login', { replace: true });
        return false;
      }
      
      // Token süresini kontrol et
      const expiryDate = new Date(tokenExpiry);
      
      // Geçersiz tarih kontrolü
      if (isNaN(expiryDate.getTime())) {
        console.log('Auth check failed: Invalid expiry date');
        clearAuth();
        navigate('/login', { replace: true });
        return false;
      }
      
      // Süre dolmuş mu kontrolü
      if (expiryDate <= new Date()) {
        console.log('Auth check failed: Token expired');
        clearAuth();
        navigate('/login', { replace: true });
        return false;
      }
      
      // Callback fonksiyonu varsa çağır
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
  };

  return {
    isAuthenticated,
    isLoading,
    checkAuth,
    clearAuth,
    requireAuth
  };
}; 