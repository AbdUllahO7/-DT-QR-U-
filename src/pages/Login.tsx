import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, Mail, Lock, ArrowLeft } from 'lucide-react';
import { authService } from '../services/authService';
import { useLanguage } from '../contexts/LanguageContext';
import { logger } from '../utils/logger';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { logError } from '../utils/errorHandler';
import { authStorage } from '../utils/authStorage';
import type { LoginDto } from '../types/api';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const { isOnline, testConnection } = useNetworkStatus();
  
  const [formData, setFormData] = useState<LoginDto>({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (authStorage.isAuthenticated()) {
      logger.info('User already authenticated, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name as keyof typeof errors] || errors.general) {
      setErrors(prev => ({ ...prev, [name]: undefined, general: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    if (!formData.email?.trim()) {
      newErrors.email = t('pages.login.errors.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('pages.login.errors.emailInvalid');
    }
    if (!formData.password?.trim()) {
      newErrors.password = t('pages.login.errors.passwordRequired');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    if (!isOnline) {
      const isConnected = await testConnection();
      if (!isConnected) {
        setErrors({ general: 'İnternet bağlantınız kesilmiş. Lütfen kontrol edin.' });
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const { rememberMe, ...apiCredentials } = formData;
      const response = await authService.login(apiCredentials);

      if (response.accessToken) {
        const tokenParts = response.accessToken.split('.');
        const payload = JSON.parse(atob(tokenParts[1]));
        const userId = payload.user_id;

        authStorage.saveAuth({
          token: response.accessToken,
          userId: userId,
          tokenExpiry: response.expiresAt
        }, rememberMe);

        logger.info(`Login successful. Remember me: ${rememberMe}`);

        const onboardingUserId = localStorage.getItem('onboarding_userId');

        if (onboardingUserId) {
          navigate('/onboarding/restaurant');
        } else {
          window.location.href = '/dashboard';
        }
      }
    } catch (error: any) {
      logError(error, 'Login error');
      
      // Extraction logic for your specific API response structure
      const apiErrorMessage = 
        error.response?.data?.errorMessage || 
        error.message || 
        "An unexpected error occurred";

      setErrors({ general: apiErrorMessage });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8 pt-10"
        >
          <Link
            to="/"
            className={`inline-flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''} text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors`}
          >
            <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
            <span>{t('pages.login.backToHome')}</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-center mb-8 ${isRTL ? 'text-right' : ''}`}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('pages.login.title')}</h1>
          <p className="text-gray-600 dark:text-gray-400">{t('pages.login.subtitle')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
        >
          {errors.general && (
            <div className="mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 p-4 border border-red-200">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                <div className="ml-3 text-sm text-red-700 dark:text-red-300">
                  {errors.general}
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('pages.login.email')}
              </label>
              <div className="relative">
                <Mail className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400`} />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full ${isRTL ? 'pr-10' : 'pl-10'} py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                  placeholder={t('pages.register.placeholders.email')}
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('pages.login.password')}
              </label>
              <div className="relative">
                <Lock className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400`} />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full ${isRTL ? 'pr-10' : 'pl-10'} py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                  placeholder={t('pages.register.placeholders.password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-gray-400`}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600 rounded border-gray-300"
                />
                <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {t('pages.login.rememberMe')}
                </label>
              </div>
              <Link to="/resetPassword" className="text-sm font-medium text-primary-600 hover:underline">
                {t('pages.login.forgotPassword')}
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center items-center py-3 px-4 rounded-lg text-white font-medium ${isSubmitting ? 'bg-primary-400' : 'bg-primary-600 hover:bg-primary-700'} transition-all`}
            >
              {isSubmitting ? (
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : t('pages.login.signIn')}
            </button>

            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              {t('pages.login.noAccount')}{' '}
              <Link to="/register" className="font-medium text-primary-600 hover:underline">
                {t('pages.login.registerNow')}
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;