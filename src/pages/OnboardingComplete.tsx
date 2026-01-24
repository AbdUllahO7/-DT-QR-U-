import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Timer } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

const OnboardingComplete: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [countdown, setCountdown] = useState<number>(10);

  // 1. Add this useEffect to scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      localStorage.removeItem('onboarding_userId');
      localStorage.removeItem('onboarding_restaurantId');
      localStorage.removeItem('onboarding_branchId');
      localStorage.removeItem('userId');
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [countdown, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden"
        >
          <div className="px-4 py-5 sm:p-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 dark:bg-green-900"
            >
              <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6"
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('onboardingComplete.title')}
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {t('onboardingComplete.message')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 flex items-center justify-center"
            >
              <div className="relative">
                <Timer className="h-6 w-6 text-primary-800 dark:text-primary-800" />
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-medium text-primary-800 dark:text-primary-800">
                  {countdown}
                </span>
              </div>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                {t('onboardingComplete.redirectingIn')}
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingComplete; 