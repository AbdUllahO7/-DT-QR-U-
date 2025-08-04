import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Sparkles } from 'lucide-react';

import { authService } from '../services/authService';
import { useAuth, useCarousel } from '../hooks';
import { isBranchOnlyUser } from '../utils/http';
import { logger } from '../utils/logger';
import type { SelectionScreenData } from '../types/api';

// Modern Components
import SelectionCard from '../components/SelectionCard';
import ModernLoader from '../components/ModernLoader';
import ModernError from '../components/ModernError';
import ThemeToggle from '../components/ThemeToggle';

const SelectionScreen: React.FC = () => {
  const navigate = useNavigate();
  const { requireAuth, clearAuth } = useAuth();
  const [data, setData] = useState<SelectionScreenData | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const isMounted = useRef(true);
  const requestInProgress = useRef(false);

  // Prepare carousel data
  const allCards = data ? [
    {
      type: 'restaurant' as const,
      id: data.restaurantId,
      name: data.restaurantName,
      status: data.restaurantStatus,
      logoPath: data.restaurantLogoPath,
      canAccess: data.canAccessRestaurantPanel
    },
    ...data.availableBranches.map(branch => ({
      type: 'branch' as const,
      id: branch.branchId,
      name: branch.branchName,
      status: branch.branchStatus,
      isOpenNow: branch.isOpenNow,
      isTemporarilyClosed: branch.isTemporarilyClosed
    }))
  ] : [];

  // Use carousel hook
  const { currentSlide, goToSlide, handlers } = useCarousel({ 
    totalItems: allCards.length 
  });

  // "Tekrar Dene" butonu için kullanılacak fonksiyon
  const retryFetch = async () => {
    if (requestInProgress.current) {
      return;
    }
    
    if (!requireAuth()) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      requestInProgress.current = true;
      const response = await authService.getSelectionScreenData();
      if (isMounted.current) {
        if (!response || !response.data) {
          throw new Error('API yanıtı boş');
        }
        setData(response.data);
        setError('');
        setIsLoading(false);
      }
    } catch (error: any) {
      if (isMounted.current) {
        setError(error.message || 'Veri yüklenirken bir hata oluştu');
        setIsLoading(false);
      }
    } finally {
      requestInProgress.current = false;
    }
  };

  // Component mount olduğunda tek seferlik API çağrısı
  useEffect(() => {
    const initialize = async () => {
      isMounted.current = true;
      
      // Auth kontrolü
      const isAuth = requireAuth();
      if (!isAuth) {
        return;
      }
      
      // Branch-only kullanıcı kontrolü
      if (isBranchOnlyUser()) {
        logger.info('Branch-only user detected, redirecting to dashboard');
        navigate('/dashboard');
        return;
      }
      
      setAuthChecked(true);
      
      // API çağrısı
      if (requestInProgress.current) {
        return;
      }
      
      setIsLoading(true);
      try {
        requestInProgress.current = true;
        const response = await authService.getSelectionScreenData();
        if (isMounted.current) {
          if (!response || !response.data) {
            throw new Error('API yanıtı boş');
          }
          setData(response.data);
          setError('');
          setIsLoading(false);
        }
      } catch (error: any) {
        if (isMounted.current) {
          setError(error.message || 'Veri yüklenirken bir hata oluştu');
          setIsLoading(false);
        }
      } finally {
        requestInProgress.current = false;
      }
    };
    
    initialize();
    
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleRestaurantSelect = () => {
    if (data?.restaurantId) {
      logger.info('Restaurant selected:', data.restaurantId);
      
      localStorage.setItem('restaurantName', data.restaurantName);
      localStorage.removeItem('selectedBranchId');
      localStorage.removeItem('selectedBranchName');
      
      navigate('/dashboard');
    }
  };

  const handleBranchSelect = (branchId: number | string) => {
    if (branchId) {
      logger.info('Branch selected:', branchId);
      const selectedBranch = data?.availableBranches.find(b => b.branchId === Number(branchId));
      
      localStorage.setItem('selectedBranchId', branchId.toString());
      localStorage.setItem('selectedBranchName', selectedBranch?.branchName || 'Bilinmeyen Şube');
      
      navigate('/dashboard');
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/', { replace: true });
  };

  // Auth kontrolü tamamlanmadıysa loading göster
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <ModernLoader text="Kimlik doğrulanıyor..." />
      </div>
    );
  }

  // Loading durumu
  if (isLoading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <ModernLoader text="Veriler yükleniyor..." />
      </div>
    );
  }

  // Hata durumu
  if (error && !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <ModernError 
          message={error}
          onRetry={() => {
            requestInProgress.current = false;
            retryFetch();
          }}
        />
      </div>
    );
  }

  // Veri yoksa
  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <ModernError 
          title="Veri Bulunamadı"
          message="Lütfen daha sonra tekrar deneyin."
          onRetry={() => {
            requestInProgress.current = false;
            retryFetch();
          }}
        />
      </div>
    );
  }

  // API'den gelen verinin doğru formatta olduğunu kontrol et
  if (!data.availableBranches || !Array.isArray(data.availableBranches)) {
    logger.error('Invalid data format:', data);
    data.availableBranches = [];
  }

  // Ana render fonksiyonu
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-400/20 to-primary-600/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90]
          }}
          transition={{ duration: 25, repeat: Infinity }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full px-6 py-6 backdrop-blur-md bg-white/30 dark:bg-gray-900/30 border-b border-white/20 dark:border-gray-700/20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Hoş Geldiniz
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {data?.restaurantName}
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4"
          >
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 transform hover:scale-105"
            >
              <LogOut size={20} />
              <span>Çıkış</span>
            </button>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="relative w-full max-w-6xl mx-auto">
          
          {/* Welcome Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Hangi paneli kullanmak istiyorsunuz?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Restoran yönetimi için genel kontrol panelini veya belirli bir şube için özel yönetim panelini seçin.
            </p>
          </motion.div>

          {/* Cards Container */}
          <div 
            className="relative flex justify-center items-center min-h-[600px]"
            onTouchStart={handlers.handleTouchStart}
            onTouchMove={handlers.handleTouchMove}
            onTouchEnd={handlers.handleTouchEnd}
            onMouseDown={handlers.handleMouseDown}
            onMouseMove={handlers.handleMouseMove}
            onMouseUp={handlers.handleMouseUp}
          >
            {allCards.map((card, index) => {
              const position = index - currentSlide;
              const isActive = position === 0;
              
              return (
                <div
                  key={`${card.type}-${card.id}`}
                  className="absolute"
                  style={{
                    left: '50%',
                    transform: `translateX(${-50 + position * 70}%)`,
                    zIndex: isActive ? 20 : 10 - Math.abs(position)
                  }}
                >
                  <SelectionCard
                    item={card}
                    isActive={isActive}
                    index={index}
                    onClick={() => !isActive && goToSlide(index)}
                    onSelect={card.type === 'restaurant' ? handleRestaurantSelect : handleBranchSelect}
                  />
                </div>
              );
            })}
          </div>

          {/* Navigation Dots */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center gap-3 mt-12"
          >
            {allCards.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goToSlide(index)}
                className={`relative transition-all duration-300 ${
                  currentSlide === index
                    ? 'w-10 h-3'
                    : 'w-3 h-3 hover:w-5'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <div className={`w-full h-full rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`} />
                {currentSlide === index && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-600 to-primary-700"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default SelectionScreen; 