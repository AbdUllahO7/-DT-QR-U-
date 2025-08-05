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

  // Token kontrolü
  useEffect(() => {
    const token = localStorage.getItem('token');
    const tokenExpiry = localStorage.getItem('tokenExpiry');

    if (token) {
      // Token'ın geçerlilik süresini kontrol et
      if (tokenExpiry && new Date(tokenExpiry) > new Date()) {
        navigate('/selection');
      } else {
        // Token süresi dolmuşsa token'ı temizle
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
    // Clear error when user starts typing
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

    // Network bağlantısını kontrol et
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
      logger.info('Login response received', { response });
      
      // AccessToken kontrolü - response direkt LoginResponse formatında geliyor
      if (response.accessToken) {
        // JWT'den userId çıkarma
        const tokenParts = response.accessToken.split('.');
        const payload = JSON.parse(atob(tokenParts[1]));
        const userId = payload.user_id;

        logger.info('Login successful, saving token and redirecting');
        
        // Token ve kullanıcı bilgilerini kaydet
        localStorage.setItem('token', response.accessToken);
        localStorage.setItem('userId', userId);
        localStorage.setItem('tokenExpiry', response.expiresAt);
        
        // Onboarding sürecinde mi kontrol et
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
        
        // Normal giriş, selection screen'e yönlendir
        navigate('/selection');
      } else {
        logger.error('Invalid login response - no access token');
        throw new Error('Geçersiz giriş yanıtı');
      }
    } catch (error: any) {
      logError(error, 'Login error');

      // Kullanıcı dostu hata mesajını al
      const userFriendlyMessage = getUserFriendlyErrorMessage(error);
      setErrors({
        general: userFriendlyMessage
      });
      setIsSubmitting(false);
      
      // Başarılı yanıt ama hata mesajı varsa
      if (error.message === 'Sunucudan geçersiz yanıt alındı' && error.response?.status === 200) {
        try {
          logger.info('Trying to parse successful response with error', { data: error.response?.data });
          // API başarılı yanıt vermiş olabilir
          const accessToken = error.response?.data?.accessToken;
          if (accessToken) {
            // JWT'den userId çıkarma
            const tokenParts = accessToken.split('.');
            const payload = JSON.parse(atob(tokenParts[1]));
            const userId = payload.user_id;
            
            logger.info('Found access token in error response, saving and redirecting');
            
            // Token ve kullanıcı bilgilerini kaydet
            localStorage.setItem('token', accessToken);
            localStorage.setItem('userId', userId);
            localStorage.setItem('tokenExpiry', error.response.data.expiresAt);
            
            // Onboarding sürecinde mi kontrol et
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
            
            // Normal giriş, selection screen'e yönlendir
            navigate('/selection');
            return;
          }
        } catch (innerError) {
          logger.error('Response parsing error', innerError);
        }
      }
      
      if (error.status === 400) {
        // Validation errors
        if (error.errors) {
          const validationErrors: typeof errors = {};
          Object.entries(error.errors).forEach(([key, value]) => {
            validationErrors[key as keyof typeof errors] = Array.isArray(value) 
              ? (value as string[])[0]
              : value as string;
          });
          setErrors(validationErrors);
        } else {
          setErrors({
            general: error.message || t('pages.login.errors.generalError')
          });
        }
      } else if (error.status === 401) {
        setErrors({
          general: t('pages.login.errors.invalidCredentials')
        });
      } else {
        setErrors({
          general: error.message || t('pages.login.errors.generalError')
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            to="/"
            className={`inline-flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''} text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200`}
          >
            <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
            <span>{t('pages.login.backToHome')}</span>
          </Link>
        </motion.div>

        {/* Header */}
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

        {/* Form */}
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
                  to="/forgotpassword"
                  className="font-medium text-primary-600 dark:text-primary-400 hover:underline"
                >
                  {t('pages.login.forgotPassword')}
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