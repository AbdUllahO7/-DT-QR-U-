import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, Mail, Lock, ArrowLeft } from 'lucide-react';
import { authService } from '../services/authService';
import { isBranchOnlyUser } from '../utils/http';
import { useLanguage } from '../contexts/LanguageContext';
import { logger } from '../utils/logger';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { getUserFriendlyErrorMessage, logError } from '../utils/errorHandler';
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
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const tokenExpiry = localStorage.getItem('tokenExpiry');

    if (token) {
      if (tokenExpiry && new Date(tokenExpiry) > new Date()) {
        navigate('/dashboard');
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiry');
        localStorage.removeItem('userId');
      }
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
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
    logger.info('Form submitted');

    if (!validateForm()) {
      logger.warn('Form validation failed');
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    if (!isOnline) {
      logger.warn('Network bağlantısı yok, bağlantı test ediliyor...');
      const isConnected = await testConnection();
      if (!isConnected) {
        setErrors({
          general: 'İnternet bağlantınız kesilmiş. Lütfen bağlantınızı kontrol edin.'
        });
        setIsSubmitting(false);
        return;
      }
    }

    try {
      logger.info('Sending login request with data', { formData });
      const response = await authService.login(formData);

      // CRITICAL DEBUG - Force console output
      console.log('=== LOGIN RESPONSE DEBUG ===');
      console.log('Full response:', response);
      console.log('Response type:', typeof response);
      console.log('Response keys:', response ? Object.keys(response) : 'null');
      console.log('Response:', JSON.stringify(response, null, 2));
      console.log('========================');

      logger.info('Login response received', { response });
      logger.info('Response type:', typeof response);
      logger.info('Response keys:', response ? Object.keys(response) : 'null');

      // Handle different response formats
      let loginData = response;

      // Check if response is wrapped in a data property
      if (response && !response.accessToken && (response as any).data?.accessToken) {
        console.log('Response is wrapped in data property');
        logger.info('Response is wrapped in data property');
        loginData = (response as any).data;
      }

      console.log('AccessToken value:', loginData?.accessToken);
      console.log('loginData type:', typeof loginData);
      console.log('loginData is null?', loginData === null);
      console.log('loginData is undefined?', loginData === undefined);
      console.log('accessToken truthy?', !!loginData?.accessToken);
      console.log('About to check if condition...');

      logger.info('AccessToken value:', loginData?.accessToken);

      if (loginData?.accessToken) {
        console.log('✅ INSIDE IF BLOCK - Token exists!');
        const tokenParts = loginData.accessToken.split('.');
        const payload = JSON.parse(atob(tokenParts[1]));
        const userId = payload.user_id;

        logger.info('Login successful, saving token and redirecting');
        logger.info('Saving to localStorage:', {
          token: loginData.accessToken.substring(0, 20) + '...',
          userId,
          expiresAt: loginData.expiresAt
        });

        localStorage.setItem('token', loginData.accessToken);
        localStorage.setItem('userId', userId);
        localStorage.setItem('tokenExpiry', loginData.expiresAt);

        // Verify token was saved
        const savedToken = localStorage.getItem('token');
        logger.info('Token saved to localStorage:', savedToken ? 'YES' : 'NO');

        const onboardingUserId = localStorage.getItem('onboarding_userId');
        if (onboardingUserId) {
          logger.info('Onboarding süreci devam ediyor, restaurant onboarding sayfasına yönlendiriliyor');
          navigate('/onboarding/restaurant');
          return;
        }

        // Kullanıcı tipini kontrol et
        if (isBranchOnlyUser()) {
          logger.info('Branch-only user detected, redirecting to dashboard');
          navigate('/dashboard');
          return;
        }

        logger.info('Redirecting to dashboard...');
        navigate('/dashboard');
      } else {
        console.log('❌ ELSE BLOCK - Token does NOT exist!');
        console.log('loginData:', loginData);
        logger.error('Invalid login response - no access token', { loginData });
        throw new Error('Geçersiz giriş yanıtı - accessToken bulunamadı');
      }

      console.log('After if/else block');
    } catch (error: any) {
      console.log('=== LOGIN ERROR ===');
      console.log('Error:', error);
      console.log('Error status:', error.status);
      console.log('Error message:', error.message);
      console.log('Error response:', error.response);
      console.log('==================');

      logError(error, 'Login error');

      const userFriendlyMessage = getUserFriendlyErrorMessage(error);

      // Handle 400 validation errors
      if (error.status === 400 && error.errors) {
        const validationErrors: typeof errors = {};
        Object.entries(error.errors).forEach(([key, value]) => {
          validationErrors[key as keyof typeof errors] = Array.isArray(value)
            ? (value as string[])[0]
            : value as string;
        });
        setErrors(validationErrors);
      } else {
        // Handle all other errors with the error message from ApiError
        setErrors({
          general: error.message || userFriendlyMessage || t('pages.login.errors.generalError')
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 pt-10"
        >
          <Link
            to="/"
            className={`inline-flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''} text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200`}
          >
            <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
            <span>{t('pages.login.backToHome')}</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`text-center mb-8 ${isRTL ? 'text-right' : ''}`}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('pages.login.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('pages.login.subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
        >
          {/* Error Message */}
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800"
            >
              <div className={`flex ${isRTL ? 'space-x-reverse' : ''}`}>
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className={`${isRTL ? 'mr-3' : 'ml-3'}`}>
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-400">{t('common.error')}</h3>
                  <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                    {errors.general}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {t('pages.login.email')}
              </label>
              <div className="relative">
                <Mail className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full ${isRTL ? 'pr-10 pl-2' : 'pl-12 pr-4'} py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors duration-200 ${
                    errors.email 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder={t('pages.register.placeholders.email')}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {t('pages.login.password')}
              </label>
              <div className="relative">
                <Lock className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`} />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full ${isRTL ? 'pr-10 pl-2' : 'pl-12 pr-12'} py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors duration-200 ${
                    errors.password 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder={t('pages.register.placeholders.password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300`}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2`}>
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                />
                <label htmlFor="rememberMe" className={`${isRTL ? 'mr-2' : 'ml-2'} block text-sm text-gray-700 dark:text-gray-300`}>
                  {t('pages.login.rememberMe')}
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/resetPassword"
                  className="font-medium text-primary-600 dark:text-primary-400 hover:underline"
                >
                  {t('pages.login.forgotPassword')}
                </Link>
              </div>
               <div className="text-sm">
                <Link
                  to="/confirmMail"
                  className="font-medium text-primary-600 dark:text-primary-400 hover:underline"
                >
                  {t('pages.login.confirimEmail')}
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                onClick={(e) => {
                  logger.info('Login button clicked');
                  if (!isSubmitting) {
                    handleSubmit(e);
                  }
                }}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-white text-sm font-medium ${
                  isSubmitting
                    ? 'bg-primary-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700'
                } transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className={`animate-spin ${isRTL ? 'ml-3 -mr-1' : '-ml-1 mr-3'} h-5 w-5 text-white`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    {t('pages.login.signingIn')}
                  </>
                ) : (
                  t('pages.login.signIn')
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('pages.login.noAccount')}{' '}
                <Link 
                  to="/register" 
                  className="font-medium text-primary-600 dark:text-primary-400 hover:underline"
                >
                  {t('pages.login.registerNow')}
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login; 