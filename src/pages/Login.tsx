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

  // Load saved email if Remember Me was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail');
    const isRemembered = localStorage.getItem('rememberMe') === 'true';

    if (isRemembered && savedEmail) {
      setFormData(prev => ({
        ...prev,
        email: savedEmail,
        rememberMe: true
      }));
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const tokenExpiry = localStorage.getItem('tokenExpiry');

    if (token && tokenExpiry) {
      try {
        const expiryDate = new Date(tokenExpiry);
        if (expiryDate > new Date()) {
          logger.info('Valid token found, redirecting to dashboard');
          navigate('/dashboard');
        } else {
          logger.info('Token expired, clearing localStorage');
          localStorage.removeItem('token');
          localStorage.removeItem('tokenExpiry');
          localStorage.removeItem('userId');
        }
      } catch (error) {
        logger.error('Error parsing token expiry', error);
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
    logger.info('Form submitted', {
      email: formData.email,
      rememberMe: formData.rememberMe,
      hasPassword: !!formData.password
    });

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
      logger.info('Sending login request', {
        email: formData.email,
        rememberMe: formData.rememberMe
      });

      // Don't send rememberMe to the backend - it's frontend-only
      const loginCredentials = {
        email: formData.email,
        password: formData.password
      };

      const response = await authService.login(loginCredentials as any);
      logger.info('Login response received', {
        hasAccessToken: !!response?.accessToken,
        hasExpiresAt: !!response?.expiresAt
      });
      
      if (response.accessToken) {
        const tokenParts = response.accessToken.split('.');
        const payload = JSON.parse(atob(tokenParts[1]));
        const userId = payload.user_id;

        logger.info('Login successful, saving token and redirecting');

        // Save authentication data
        localStorage.setItem('token', response.accessToken);
        localStorage.setItem('userId', userId);
        localStorage.setItem('tokenExpiry', response.expiresAt);
        logger.info('Token saved to localStorage', {
          tokenLength: response.accessToken.length,
          userId: userId,
          expiresAt: response.expiresAt
        });

        // Handle Remember Me
        if (formData.rememberMe) {
          localStorage.setItem('savedEmail', formData.email);
          localStorage.setItem('rememberMe', 'true');
              localStorage.setItem('token', response.accessToken);
        localStorage.setItem('userId', userId);
        localStorage.setItem('tokenExpiry', response.expiresAt);
          logger.info('Remember Me enabled - email saved', { email: formData.email });
        } else {
          localStorage.removeItem('savedEmail');
          localStorage.removeItem('rememberMe');
          logger.info('Remember Me disabled - email removed');
        }

        // Verify localStorage after saving
        const savedToken = localStorage.getItem('token');
        logger.info('Verifying localStorage after save', {
          tokenExists: !!savedToken,
          rememberMe: localStorage.getItem('rememberMe'),
          savedEmail: localStorage.getItem('savedEmail')
        });

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

        navigate('/dashboard');
      } else {
        logger.error('Invalid login response - no access token');
        throw new Error('Geçersiz giriş yanıtı');
      }
    } catch (error: any) {
      logError(error, 'Login error');

      setErrors({
        general: error.response?.data?.errorMessage || getUserFriendlyErrorMessage(error)
      });
      setIsSubmitting(false);
      
      if (error.message === 'Sunucudan geçersiz yanıt alındı' && error.response?.status === 200) {
        try {
          logger.info('Trying to parse successful response with error', { data: error.response?.data });
          const accessToken = error.response?.data?.accessToken;
          if (accessToken) {
            const tokenParts = accessToken.split('.');
            const payload = JSON.parse(atob(tokenParts[1]));
            const userId = payload.user_id;
            
            logger.info('Found access token in error response, saving and redirecting');
            
            localStorage.setItem('token', accessToken);
            localStorage.setItem('userId', userId);
            localStorage.setItem('tokenExpiry', error.response.data.expiresAt);

            // Handle Remember Me
            if (formData.rememberMe) {
              localStorage.setItem('savedEmail', formData.email);
              localStorage.setItem('rememberMe', 'true');
              logger.info('Remember Me enabled - email saved');
            } else {
              localStorage.removeItem('savedEmail');
              localStorage.removeItem('rememberMe');
              logger.info('Remember Me disabled - email removed');
            }

            const onboardingUserId = localStorage.getItem('onboarding_userId');
            if (onboardingUserId) {
              logger.info('Onboarding süreci devam ediyor, restaurant onboarding sayfasına yönlendiriliyor');
              navigate('/onboarding/restaurant');
              return;
            }

            if (isBranchOnlyUser()) {
              logger.info('Branch-only user detected, redirecting to dashboard');
              navigate('/dashboard');
              return;
            }

            navigate('/dashboard');
            return;
          }
        } catch (innerError) {
          logger.error('Response parsing error', innerError);
        }
      }
      
      if (error.status === 400) {
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
            general: error.response.data.errorMessage || t('pages.login.errors.generalError')
          });
        }
      } else if (error.status === 401) {
        setErrors({
          general: error.response.data.errorMessage
        });
      } else {
        setErrors({
          general:  error.response.data.errorMessage || t('pages.login.errors.generalError')
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