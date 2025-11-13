import React, { useState, useCallback } from 'react';
// import { Link, useNavigate } from 'react-router-dom'; // Mocked below
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, User, Mail, Phone, Lock, ArrowLeft } from 'lucide-react';
 import { authService } from '../services/authService'; // Mocked below
 import { useLanguage } from '../contexts/LanguageContext'; // Mocked below
 import type { RegisterDto } from '../types/api'; // Mocked below
import { Link, useNavigate } from 'react-router-dom';
import { logger } from '../utils/logger';
import { countries } from '../data/mockData';



const Register: React.FC = () => {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  
  const [formData, setFormData] = useState({
    name: '',
    surName: '',
    email: '',
    password: '',
    passwordConfirm: '',
    phoneNumber: '', // This will now store the NATIONAL number
    countryCode: '+90', // Default country code
    profileImagePath: ' ', // API required field
    termsofUserService: false
  });

  const [errors, setErrors] = useState<{
    name?: string;
    surName?: string;
    email?: string;
    password?: string;
    passwordConfirm?: string;
    phoneNumber?: string; 
    termsofUserService?: string;
    general?: string;
  }>({});


  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value, type } = e.target;
    // Handle checkbox
    const isCheckbox = type === 'checkbox';
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: isCheckbox ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  }, [errors]);

  // Special handler for the national phone number to only allow digits
  const handleNationalPhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target;
    const digitsOnly = value.replace(/\D/g, ''); // Allow only digits
    
    setFormData(prev => ({
      ...prev,
      phoneNumber: digitsOnly
    }));
    
    // Clear error when user starts typing
    if (errors.phoneNumber) {
      setErrors(prev => ({
        ...prev,
        phoneNumber: undefined
      }));
    }
  }, [errors.phoneNumber]);


  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    // Name validation
    if (!formData.name?.trim()) {
      newErrors.name = t('pages.register.validation.nameRequired');
    } else if (formData.name.trim().length < 2) {
      newErrors.name = t('pages.register.validation.nameMin');
    }

    // Surname validation
    if (!formData.surName?.trim()) {
      newErrors.surName = t('pages.register.validation.surnameRequired');
    } else if (formData.surName.trim().length < 2) {
      newErrors.surName = t('pages.register.validation.surnameMin');
    }

    // Email validation
    if (!formData.email?.trim()) {
      newErrors.email = t('pages.register.validation.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = t('pages.register.validation.emailInvalid');
    }

    // Password validation
    if (!formData.password?.trim()) {
      newErrors.password = t('pages.register.validation.passwordRequired');
    } else if (formData.password.length < 8) {
      newErrors.password = t('pages.register.validation.passwordMin');
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = t('pages.register.validation.passwordPattern');
    }

    // Password confirm validation
    if (!formData.passwordConfirm?.trim()) {
      newErrors.passwordConfirm = t('pages.register.validation.passwordConfirmRequired');
    } else if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = t('pages.register.validation.passwordMismatch');
    }

    // Phone number validation (now for the national part)
    if (!formData.phoneNumber?.trim()) {
      newErrors.phoneNumber = t('pages.register.validation.phoneRequired');
    } else {
      // Generic regex for 7-15 digits. This can be adjusted.
      const phoneRegex = /^\d{7,15}$/; 
      const cleanPhone = formData.phoneNumber.replace(/[\s\-\(\)]/g, '');
      if (!phoneRegex.test(cleanPhone)) {
        newErrors.phoneNumber = t('pages.register.validation.phoneInvalid');
      }
    }

    // Terms validation
    if (!formData.termsofUserService) {
      newErrors.termsofUserService = t('pages.register.validation.termsRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Combine country code and national number
      const fullPhoneNumber = `${formData.countryCode}${formData.phoneNumber.replace(/\D/g, '')}`;

      // Prepare data for the API, matching the RegisterDto
      const cleanedData: RegisterDto = {
        name: formData.name.trim(),
        surName: formData.surName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        passwordConfirm: formData.passwordConfirm,
        phoneNumber: fullPhoneNumber, // Send the combined number
        profileImagePath: ' ', // API required - boş string gönderiyoruz
        termsofUserService: formData.termsofUserService,
      };

      const response = await authService.register(cleanedData);

      // API response kontrolü
      if (!response?.success || !response.data?.userId) {
        // Use a generic error message if response is malformed
        throw new Error(response.message || 'Sunucudan geçersiz yanıt alındı');
      }

      // Store userId for onboarding and future use
      localStorage.setItem('onboarding_userId', response.data.userId);
      localStorage.setItem('userId', response.data.userId);
      
      // Redirect to restaurant onboarding
      navigate('/onboarding/restaurant', { 
        state: { 
          message: t('pages.register.success.message'),
          userId: response.data.userId 
        } 
      });

    } catch (error: any) {
      // const { logger } = await import('../utils/logger'); // Mocked above
      logger.error('Register error:', error.response || error); // Log the response object if it exists

      // --- START: MODIFIED ERROR HANDLING ---

      // CHANGED: Get status from error.response
      const status = error.response?.status;
      
      // CHANGED: Get validation errors from error.response.data
      const validationErrorsFromApi = error.response?.data?.errors;
      
      // CHANGED: Get server messages from error.response.data
      const detailedMessage = error.response?.data?.details?.message;
      const dataMessage = error.response?.data?.message;

      if (status === 400) {
        // Validation errors
        const validationErrors: typeof errors = {};
        
        // CHANGED: Use validationErrorsFromApi
        if (validationErrorsFromApi) {
          Object.entries(validationErrorsFromApi).forEach(([key, value]) => {
            // ProfileImagePath hatasını gösterme
            if (key !== 'profileImagePath' && key !== 'ProfileImagePath') {
              validationErrors[key as keyof typeof errors] = Array.isArray(value) 
                ? (value as string[])[0] 
                : value as string;
            }
          });
          
          if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
          } else {
            setErrors({
              // CHANGED: Use dataMessage as fallback
              general: dataMessage || error.message || t('pages.register.errors.validation')
            });
          }
        } else {
          setErrors({
            general: dataMessage || error.message || t('pages.register.errors.validation')
          });
        }
      } else if (status === 409) {
        setErrors({
          email: t('pages.register.validation.emailExists')
        });
      } else if (status === 422) {
        setErrors({
          general: t('pages.register.errors.invalidData')
        });
      } else {
        // This is the new logic to handle 500 errors and other cases
        
        // 1. Get the generic axios message
        const genericMessage = error.message;

        // 2. Check if the detailed message is the "already taken" error
        if (detailedMessage && (detailedMessage.includes('is already taken') || detailedMessage.includes('zaten alınmış'))) {
          setErrors({
            email: t('pages.register.validation.emailExists')
          });
        } else {
          // 3. Show the best available message as a general error
          setErrors({
            general: detailedMessage || dataMessage || genericMessage || t('pages.register.errors.general')
          });
        }
      }
      // --- END: MODIFIED ERROR HANDLING ---

    } finally {
      setIsSubmitting(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = (password: string): { score: number; text: string; color: string } => {
    let score = 0;
    
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++; // Corrected regex (was /\d]/)
    if (/[^a-zA-Z\d]/.test(password)) score++;
    
    const levels = [
      { text: t('pages.register.passwordStrength.veryWeak'), color: 'text-red-500' },
      { text: t('pages.register.passwordStrength.weak'), color: 'text-red-400' },
      { text: t('pages.register.passwordStrength.medium'), color: 'text-yellow-500' },
      { text: t('pages.register.passwordStrength.good'), color: 'text-blue-500' },
      { text: t('pages.register.passwordStrength.strong'), color: 'text-green-500' }
    ];
    
    return { score, ...levels[Math.min(score, 4)] };
  };

  // Real-time validation state
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  const handleBlur = useCallback((fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            to="/"
            className={`inline-flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''} text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200`}
          >
            <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
            <span>{t('pages.register.backToHome')}</span>
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
            {t('pages.register.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('pages.register.subtitle')}
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
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  {t('pages.register.firstName')}
                </label>
                <div className="relative">
                  <User className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`} />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="given-name"
                    value={formData.name}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('name')}
                    className={`w-full ${isRTL ? 'pr-10 pl-2' : 'pl-12 pr-4'} py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors duration-200 ${
                      errors.name 
                        ? 'border-red-500 dark:border-red-500' 
                        : touched.name && formData.name.trim() 
                          ? 'border-green-500 dark:border-green-400'
                          : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder={t('pages.register.placeholders.firstName')}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="surName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  {t('pages.register.lastName')}
                </label>
                <div className="relative">
                  <User className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`} />
                  <input
                    id="surName"
                    name="surName"
                    type="text"
                    autoComplete="family-name"
                    value={formData.surName}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('surName')}
                    className={`w-full ${isRTL ? 'pr-10 pl-2' : 'pl-12 pr-4'} py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors duration-200 ${
                      errors.surName 
                        ? 'border-red-500 dark:border-red-500' 
                        : touched.surName && formData.surName.trim()
                          ? 'border-green-500 dark:border-green-400'
                          : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder={t('pages.register.placeholders.lastName')}
                  />
                </div>
                {errors.surName && (
                  <p className="mt-1 text-sm text-red-500">{errors.surName}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {t('pages.register.email')}
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
                  onBlur={() => handleBlur('email')}
                  className={`w-full ${isRTL ? 'pr-10 pl-2' : 'pl-12 pr-4'} py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors duration-200 ${
                    errors.email 
                      ? 'border-red-500 dark:border-red-500' 
                      : touched.email && formData.email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
                        ? 'border-green-500 dark:border-green-400'
                        : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder={t('pages.register.placeholders.email')}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* UPDATED PHONE NUMBER SECTION */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {t('pages.register.phone')}
              </label>
              <div className={`flex space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                {/* Country Code Selector */}
                <div className="relative">
                  <select
                    id="countryCode"
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleInputChange}
                    className={`h-full py-3 ${isRTL ? 'pr-8 pl-3' : 'pl-3 pr-8'} border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors duration-200 border-gray-300 dark:border-gray-600 appearance-none`}
                    aria-label={t('pages.register.countryCode')}
                  >
                    {countries.map(country => (
                      <option key={country.name} value={country.code}>
                        {country.name} ({country.code})
                      </option>
                    ))}
                  </select>
                  {/* Chevron for select */}
                  <div className={`absolute inset-y-0 ${isRTL ? 'left-0 pl-2' : 'right-0 pr-2'} flex items-center pointer-events-none`}>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Phone Number Input */}
                <div className="relative flex-1">
                  <Phone className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10`} />
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel" // Use tel type
                    autoComplete="tel-national"
                    value={formData.phoneNumber}
                    onChange={handleNationalPhoneChange} // Use new handler
                    onBlur={() => handleBlur('phoneNumber')}
                    maxLength={10}
                    className={`w-full ${isRTL ? 'pr-10 pl-2' : 'pl-12 pr-4'} py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors duration-200 ${
                      errors.phoneNumber 
                        ? 'border-red-500 dark:border-red-500' 
                        // Updated validation check for green border
                        : touched.phoneNumber && formData.phoneNumber.trim() && /^\d{7,15}$/.test(formData.phoneNumber.trim())
                          ? 'border-green-500 dark:border-green-400'
                          : 'border-gray-300 dark:border-gray-600'
                    }`}
                    // Assuming this placeholder is for the national part, e.g., "555 123 4567"
                    placeholder={t('pages.register.placeholders.phone')} 
                  />
                </div>
              </div>
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
              )}
            </div>
            {/* END OF UPDATED PHONE SECTION */}


            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {t('pages.register.password')}
              </label>
              <div className="relative">
                <Lock className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`} />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('password')}
                  className={`w-full ${isRTL ? 'pr-10 pl-12' : 'pl-12 pr-12'} py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors duration-200 ${
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
              
              {/* Password Strength Indicator */}
              {formData.password && touched.password && (
                <div className="mt-2">
                  {(() => {
                    const strength = getPasswordStrength(formData.password);
                    return (
                      <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              strength.score <= 1 ? 'bg-red-500' :
                              strength.score <= 2 ? 'bg-yellow-500' :
                              strength.score <= 3 ? 'bg-blue-500' :
                              'bg-green-500'
                            } ${isRTL ? 'ml-auto' : ''}`}
                            style={{ width: `${(strength.score / 5) * 100}%` }}
                          />
                        </div>
                        <span className={`text-xs font-medium ${strength.color}`}>
                          {strength.text}
                        </span>
                      </div>
                    );
                  })()}
                </div>
              )}
              
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="passwordConfirm"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {t('pages.register.confirmPassword')}
              </label>
              <div className="relative">
                <Lock className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`} />
                <input
                  id="passwordConfirm"
                  name="passwordConfirm"
                  type={showPasswordConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.passwordConfirm}
                  onChange={handleInputChange}
                  className={`w-full ${isRTL ? 'pr-10 pl-12' : 'pl-12 pr-12'} py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors duration-200 ${
                    errors.passwordConfirm 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder={t('pages.register.placeholders.confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300`}
                >
                  {showPasswordConfirm ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.passwordConfirm && (
                <p className="mt-1 text-sm text-red-500">{errors.passwordConfirm}</p>
              )}
            </div>

            <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''}`}>
              <input
                id="termsofUserService"
                name="termsofUserService"
                type="checkbox"
                checked={formData.termsofUserService}
                onChange={handleInputChange}
                className={`h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded ${
                  errors.termsofUserService ? 'border-red-500' : ''
                }`}
              />
              <label htmlFor="termsofUserService" className={`${isRTL ? 'mr-2' : 'ml-2'} block text-sm text-gray-700 dark:text-gray-300`}>
                <Link to="/terms" className="text-primary-600 dark:text-primary-400 hover:underline">
                  {t('pages.register.terms.service')}
                </Link>
                {' '}{t('pages.register.terms.and')}{' '}
                <Link to="/privacy" className="text-primary-600 dark:text-primary-400 hover:underline">
                  {t('pages.register.terms.privacy')}
                </Link>
                {' '}{t('pages.register.terms.accept')}
              </label>
            </div>
            {errors.termsofUserService && (
              <p className="mt-1 text-sm text-red-500">{errors.termsofUserService}</p>
            )}

            <div>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-white text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                  isSubmitting
                    ? 'bg-primary-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 hover:shadow-lg'
                }`}
              >
                {isSubmitting ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center"
                  >
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
                    {t('pages.register.creating')}
                  </motion.div>
                ) : (
                  t('pages.register.createAccount')
                )}
              </motion.button>
              
              {/* Form Progress Indicator */}
              <div className="mt-4 text-center">
                <div className={`flex items-center justify-center space-x-2 ${isRTL ? 'space-x-reverse' : ''} text-xs text-gray-500 dark:text-gray-400`}>
                  {(() => {
                    const completedFields = [
                      formData.name.trim(),
                      formData.surName.trim(),
                      formData.email.trim(),
                      formData.phoneNumber.trim(),
                      formData.password.trim(),
                      formData.passwordConfirm.trim(),
                      formData.termsofUserService
                    ].filter(Boolean).length;
                    
                    const totalFields = 7;
                    const progress = (completedFields / totalFields) * 100;
                    
                    return (
                      <>
                        <span>{t('pages.register.formProgress')}:</span>
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                          <div 
                            className={`bg-primary-600 h-1 rounded-full transition-all duration-300 ${isRTL ? 'ml-auto' : ''}`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span>{Math.round(progress)}%</span>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('pages.register.haveAccount')}{' '}
                <Link 
                  to="/login" 
                  className="font-medium text-primary-600 dark:text-primary-400 hover:underline"
                >
                  {t('pages.register.signInNow')}
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;