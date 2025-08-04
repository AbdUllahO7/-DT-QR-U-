import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { authService } from '../services/authService';
import { logger } from '../utils/logger';

interface ForgotPasswordForm {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const { t, isRTL } = useLanguage();
  
  const [formData, setFormData] = useState<ForgotPasswordForm>({
    email: ''
  });

  const [errors, setErrors] = useState<{
    email?: string;
    general?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);

  // Countdown timer effect
  useEffect(() => {
    let interval: number;
    
    if (countdown > 0) {
      interval = window.setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [countdown]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
      newErrors.email = t('pages.forgotPassword.errors.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('pages.forgotPassword.errors.emailInvalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    logger.info('Forgot password form submitted');

    if (!validateForm()) {
      logger.warn('Form validation failed');
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await authService.forgotPassword(formData.email);
      
      logger.info('Password reset email sent successfully');
      setIsSuccess(true);
      setCanResend(false);
      setCountdown(60); // 1 minute countdown
      
    } catch (error: any) {
      logger.error('Error sending password reset email:', error);
      
      if (error.status === 404) {
        setErrors({
          email: t('pages.forgotPassword.errors.emailNotFound')
        });
      } else {
        setErrors({
          general: error.message || t('pages.forgotPassword.errors.general')
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async (): Promise<void> => {
    if (!canResend || countdown > 0) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await authService.forgotPassword(formData.email);
      
      logger.info('Password reset email resent successfully');
      setCanResend(false);
      setCountdown(60); // 1 minute countdown
      
    } catch (error: any) {
      logger.error('Error resending password reset email:', error);
      setErrors({
        general: error.message || t('pages.forgotPassword.errors.general')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className={`mb-6 ${isRTL ? 'text-right' : 'text-left'}`}
        >
          <Link
            to="/login"
            className={`inline-flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('pages.forgotPassword.backToLogin')}
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
            {t('pages.forgotPassword.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('pages.forgotPassword.subtitle')}
          </p>
        </motion.div>

        {/* Success Message */}
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-lg bg-green-50 dark:bg-green-900/20 p-4 border border-green-200 dark:border-green-800"
          >
            <div className={`flex ${isRTL ? 'space-x-reverse' : ''}`}>
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div className={`${isRTL ? 'mr-3' : 'ml-3'}`}>
                <h3 className="text-sm font-medium text-green-800 dark:text-green-400">
                  {t('pages.forgotPassword.success.title')}
                </h3>
                <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                  {t('pages.forgotPassword.success.message')}
                </div>
              </div>
            </div>
          </motion.div>
        )}

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
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-400">
                    {t('common.error')}
                  </h3>
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
                {t('pages.forgotPassword.email')}
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
                  disabled={isSubmitting}
                  className={`w-full ${isRTL ? 'pr-10 pl-2' : 'pl-12 pr-4'} py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors duration-200 ${
                    errors.email 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  placeholder={t('pages.forgotPassword.placeholders.email')}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-4">
              {/* Submit Button */}
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
                    {t('pages.forgotPassword.sending')}
                  </>
                ) : (
                  t('pages.forgotPassword.sendResetLink')
                )}
              </button>

              {/* Resend Button */}
              {isSuccess && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={!canResend || countdown > 0 || isSubmitting}
                    className={`text-sm font-medium transition-colors duration-200 ${
                      canResend && countdown === 0 && !isSubmitting
                        ? 'text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300'
                        : 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {countdown > 0 
                      ? `${countdown} ${t('pages.forgotPassword.countdown')}`
                      : t('pages.forgotPassword.resendCode')
                    }
                  </button>
                </div>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword; 