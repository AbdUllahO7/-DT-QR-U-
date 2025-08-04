import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Building2, 
  Upload, 
  AlertCircle, 
  CheckCircle, 
  Store, 
  FileText, 
  Shield, 
  Utensils,
  Wine,
  Building,
  Hash,
  Camera
} from 'lucide-react';
import { CuisineType } from '../types';
import type { CreateRestaurantDto, ApiError } from '../types/api';
import { restaurantService } from '../services/restaurantService';
import { mediaService } from '../services/mediaService';
import { logger } from '../utils/logger';

const OnboardingRestaurant: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<CreateRestaurantDto>>({});
  const [apiError, setApiError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  
  // File upload loading states
  const [isUploadingLogo, setIsUploadingLogo] = useState<boolean>(false);
  const [isUploadingWorkPermit, setIsUploadingWorkPermit] = useState<boolean>(false);
  const [isUploadingFoodCertificate, setIsUploadingFoodCertificate] = useState<boolean>(false);
  
  // File upload progress (optional)
  const [uploadProgress, setUploadProgress] = useState<{
    logo: number;
    workPermit: number;
    foodCertificate: number;
  }>({
    logo: 0,
    workPermit: 0,
    foodCertificate: 0
  });

  const [formData, setFormData] = useState<CreateRestaurantDto>({
    restaurantName: '',
    restaurantLogoPath: '',
    isActive: true,
    cuisineType: CuisineType.Turkish,
    hasAlcoholService: false,
    companyTitle: '',
    taxNumber: '',
    taxOffice: '',
    mersisNumber: '',
    tradeRegistryNumber: '',
    legalType: '',
    workPermitFilePath: '',
    foodCertificateFilePath: '',
    userId: ''
  });

  // Get userId from localStorage on component mount
  useEffect(() => {
    const storedUserId = localStorage.getItem('onboarding_userId');
    
    if (!storedUserId) {
      logger.error('UserId bulunamadı!');
      setApiError('Oturum bilgisi bulunamadı. Lütfen tekrar giriş yapın.');
      // Redirect to register after 2 seconds
      setTimeout(() => {
        navigate('/register');
      }, 2000);
      return;
    }
    
    setUserId(storedUserId);
    // Update formData with userId
    setFormData(prev => ({ ...prev, userId: storedUserId }));
    logger.info('UserId yüklendi', { storedUserId });
  }, [navigate]);

  const cuisineOptions = [
    { value: 0, label: 'Türk Mutfağı' },
    { value: 1, label: 'İtalyan Mutfağı' },
    { value: 2, label: 'Çin Mutfağı' },
    { value: 3, label: 'Japon Mutfağı' },
    { value: 4, label: 'Meksika Mutfağı' },
    { value: 5, label: 'Hint Mutfağı' },
    { value: 6, label: 'Fransız Mutfağı' },
    { value: 7, label: 'Amerikan Mutfağı' },
    { value: 8, label: 'Akdeniz Mutfağı' },
    { value: 9, label: 'Tayland Mutfağı' },
    { value: 10, label: 'Kore Mutfağı' },
    { value: 11, label: 'Vietnam Mutfağı' },
    { value: 12, label: 'Yunan Mutfağı' },
    { value: 13, label: 'İspanyol Mutfağı' },
    { value: 14, label: 'Lübnan Mutfağı' },
    { value: 15, label: 'Brezilya Mutfağı' },
    { value: 16, label: 'Alman Mutfağı' },
    { value: 17, label: 'Rus Mutfağı' },
    { value: 18, label: 'İngiliz Mutfağı' },
    { value: 19, label: 'Etiyopya Mutfağı' },
    { value: 20, label: 'Fas Mutfağı' },
    { value: 21, label: 'Arjantin Mutfağı' },
    { value: 22, label: 'Peru Mutfağı' },
    { value: 23, label: 'Karayip Mutfağı' },
    { value: 24, label: 'Fusion Mutfağı' },
    { value: 25, label: 'Vegan Mutfağı' },
    { value: 26, label: 'Deniz Ürünleri' },
    { value: 27, label: 'Et Restoranı' },
    { value: 28, label: 'Fast Food' }
  ];

  const legalTypeOptions = [
    'Anonim Şirket (A.Ş.)',
    'Limited Şirket (Ltd. Şti.)',
    'Kollektif Şirket',
    'Komandit Şirket',
    'Şahıs İşletmesi',
    'Diğer'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: checked !== undefined ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof CreateRestaurantDto]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleFileUpload = (fieldName: 'restaurantLogoPath' | 'workPermitFilePath' | 'foodCertificateFilePath') =>
    async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Set loading state based on field
      const setLoading = (loading: boolean) => {
        switch (fieldName) {
          case 'restaurantLogoPath':
            setIsUploadingLogo(loading);
            break;
          case 'workPermitFilePath':
            setIsUploadingWorkPermit(loading);
            break;
          case 'foodCertificateFilePath':
            setIsUploadingFoodCertificate(loading);
            break;
        }
      };

      // Clear any previous errors for this field
      setErrors(prev => ({
        ...prev,
        [fieldName]: null
      }));

      setLoading(true);

      try {
        logger.info(`${fieldName} dosya yükleme başlatılıyor`, {
          fileName: file.name,
          fileSize: file.size
        });

        // Upload file to media service
        const filePath = await mediaService.uploadFile(file);

        if (filePath) {
          // Update form data with file path
          setFormData(prev => ({
            ...prev,
            [fieldName]: filePath
          }));

          logger.info(`${fieldName} başarıyla yüklendi`, { filePath });
        } else {
          throw new Error('Dosya yükleme başarısız: Dosya yolu alınamadı');
        }

      } catch (error: any) {
        logger.error(`${fieldName} yükleme hatası`, error);
        
        // Set error message
        const errorMessage = error.message || 'Dosya yüklenirken hata oluştu';
        setErrors(prev => ({
          ...prev,
          [fieldName]: errorMessage
        }));

        // Clear the form field on error
        setFormData(prev => ({
          ...prev,
          [fieldName]: ''
        }));

        // Reset file input
        e.target.value = '';

      } finally {
        setLoading(false);
      }
    };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<CreateRestaurantDto> = {};
    
    switch (step) {
      case 1: // Basic Info
        if (!formData.restaurantName?.trim()) {
          newErrors.restaurantName = 'Restaurant adı gereklidir';
        }
        if (formData.cuisineType === undefined || formData.cuisineType === null) {
          newErrors.cuisineType = 'Mutfak türü seçiniz' as any;
        }
        break;
        
      case 2: // Company Info
        if (!formData.companyTitle?.trim()) {
          newErrors.companyTitle = 'Şirket unvanı gereklidir';
        }
        if (!formData.legalType?.trim()) {
          newErrors.legalType = 'Hukuki yapı seçiniz';
        }
        break;
        
      case 3: // Legal Info
        if (!formData.taxNumber?.trim()) {
          newErrors.taxNumber = 'Vergi numarası gereklidir';
        }
        if (!formData.taxOffice?.trim()) {
          newErrors.taxOffice = 'Vergi dairesi gereklidir';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = (): void => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePreviousStep = (): void => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    // Clear previous errors
    setApiError('');
    setSuccessMessage('');
    
    if (!validateStep(3)) {
      return;
    }

    if (!userId) {
      setApiError('Oturum bilgisi bulunamadı. Lütfen tekrar giriş yapın.');
      setTimeout(() => {
        navigate('/register');
      }, 2000);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      logger.info('Restaurant verisi gönderiliyor', { formData });
      
      // Ensure cuisineType is sent as integer and add userId
      const processedData = {
        ...formData,
        userId: userId,
        cuisineType: parseInt(formData.cuisineType.toString(), 10)
      };
      
              logger.info('Processed data with userId and integer cuisineType', { processedData });
      
      const response = await restaurantService.createRestaurant(processedData);
              logger.info('Restaurant Creation Response', { response });
      
      if (response && response.restaurantId !== undefined) {
        setSuccessMessage('Restaurant bilgileriniz başarıyla kaydedildi! Şube bilgilerinizi girmeniz için yönlendiriliyorsunuz...');
        
        // Clear onboarding data
        localStorage.removeItem('onboarding_userId');
        
        // Store restaurantId for branch creation
        const restaurantId = response.restaurantId;
                  logger.info('Oluşturulan Restaurant ID', { restaurantId });
        
        localStorage.setItem('onboarding_restaurantId', restaurantId.toString());
                  logger.info('RestaurantId localStorage\'a kaydedildi', { restaurantId });

        // Store restaurant logo path for branch creation
        if (formData.restaurantLogoPath) {
          localStorage.setItem('restaurantLogoPath', formData.restaurantLogoPath);
          logger.info('Restaurant logo path localStorage\'a kaydedildi', { restaurantLogoPath: formData.restaurantLogoPath });
        }
        
        // Redirect to branch onboarding after 2 seconds
        setTimeout(() => {
          navigate('/onboarding/branch', { 
            state: { 
              message: 'Restaurant bilgileriniz başarıyla kaydedildi. Şimdi şube bilgilerinizi girebilirsiniz.',
              restaurantId: restaurantId.toString()
            } 
          });
        }, 2000);
      } else {
        console.error('RestaurantId alınamadı! Response:', response);
        setApiError('Restaurant ID alınamadı. Lütfen tekrar deneyin.');
      }
    } catch (error: any) {
      console.error('Restaurant creation error:', error);
      
      const apiErr = error as ApiError;
      
      if (apiErr.status === 400 && apiErr.errors) {
        // Handle validation errors from API
        const errorMessages = [];
        for (const field in apiErr.errors) {
          const fieldErrors = apiErr.errors[field];
          if (Array.isArray(fieldErrors)) {
            errorMessages.push(`${field}: ${fieldErrors.join(', ')}`);
          } else {
            errorMessages.push(`${field}: ${fieldErrors}`);
          }
        }
        setApiError(errorMessages.join('\n'));
      } else if (apiErr.status === 409) {
        setApiError('Bu restaurant adı zaten kullanımda. Lütfen farklı bir ad deneyin.');
      } else if (apiErr.status === 0) {
        setApiError('Sunucuya bağlanılamıyor. Lütfen internet bağlantınızı kontrol edin.');
      } else {
        setApiError(apiErr.message || 'Restaurant kaydı sırasında bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Store className="h-12 w-12 mx-auto text-primary-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Restaurant Bilgileri
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Restaurant'ınızın temel bilgilerini girin
        </p>
      </div>

      {/* Restaurant Name */}
      <div>
        <label htmlFor="restaurantName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Restaurant Adı *
        </label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            id="restaurantName"
            name="restaurantName"
            value={formData.restaurantName}
            onChange={handleInputChange}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
              errors.restaurantName
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
            } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
            placeholder="Restaurant adınızı girin"
          />
        </div>
        {errors.restaurantName && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.restaurantName}</p>
        )}
      </div>

      {/* Restaurant Logo */}
      <div>
        <label htmlFor="restaurantLogo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Restaurant Logosu
        </label>
        <div className="relative">
          <Camera className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="file"
            id="restaurantLogo"
            accept="image/*"
            onChange={handleFileUpload('restaurantLogoPath')}
            disabled={isUploadingLogo}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
              isUploadingLogo 
                ? 'opacity-50 cursor-not-allowed' 
                : ''
            } ${
              errors.restaurantLogoPath
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
            } text-gray-900 dark:text-white`}
          />
          {isUploadingLogo && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        
        {/* Upload Status */}
        {isUploadingLogo && (
          <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
            Logo yükleniyor...
          </p>
        )}
        
        {/* Error Message */}
        {errors.restaurantLogoPath && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.restaurantLogoPath}</p>
        )}
        
        {/* Success Preview */}
        {formData.restaurantLogoPath && !isUploadingLogo && (
          <div className="mt-3">
            <div className="flex items-center space-x-3">
              <img 
                src={formData.restaurantLogoPath} 
                alt="Restaurant Logo Preview" 
                className="h-16 w-16 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
              />
              <div>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                  ✓ Logo başarıyla yüklendi
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Cloudinary URL alındı
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cuisine Type */}
      <div>
        <label htmlFor="cuisineType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Mutfak Türü *
        </label>
        <div className="relative">
          <Utensils className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <select
            id="cuisineType"
            name="cuisineType"
            value={formData.cuisineType}
            onChange={handleInputChange}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
              errors.cuisineType
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
            } text-gray-900 dark:text-white`}
          >
            {cuisineOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {errors.cuisineType && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.cuisineType}</p>
        )}
      </div>

      {/* Alcohol Service */}
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="hasAlcoholService"
          name="hasAlcoholService"
          checked={formData.hasAlcoholService}
          onChange={handleInputChange}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor="hasAlcoholService" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
          <Wine className="h-4 w-4 mr-2" />
          Alkol servisi yapıyoruz
        </label>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Building className="h-12 w-12 mx-auto text-primary-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Şirket Bilgileri
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Şirket bilgilerinizi girin
        </p>
      </div>

      {/* Company Title */}
      <div>
        <label htmlFor="companyTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Şirket Unvanı *
        </label>
        <div className="relative">
          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            id="companyTitle"
            name="companyTitle"
            value={formData.companyTitle}
            onChange={handleInputChange}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
              errors.companyTitle
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
            } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
            placeholder="Şirket unvanınızı girin"
          />
        </div>
        {errors.companyTitle && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.companyTitle}</p>
        )}
      </div>

      {/* Legal Type */}
      <div>
        <label htmlFor="legalType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Hukuki Yapı *
        </label>
        <div className="relative">
          <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <select
            id="legalType"
            name="legalType"
            value={formData.legalType}
            onChange={handleInputChange}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
              errors.legalType
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
            } text-gray-900 dark:text-white`}
          >
            <option value="">Hukuki yapı seçiniz</option>
            {legalTypeOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        {errors.legalType && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.legalType}</p>
        )}
      </div>

      {/* MERSİS Number */}
      <div>
        <label htmlFor="mersisNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          MERSİS Numarası
        </label>
        <div className="relative">
          <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            id="mersisNumber"
            name="mersisNumber"
            value={formData.mersisNumber}
            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="MERSİS numaranızı girin"
          />
        </div>
      </div>

      {/* Trade Registry Number */}
      <div>
        <label htmlFor="tradeRegistryNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Ticaret Sicil Numarası
        </label>
        <div className="relative">
          <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            id="tradeRegistryNumber"
            name="tradeRegistryNumber"
            value={formData.tradeRegistryNumber}
            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Ticaret sicil numaranızı girin"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <FileText className="h-12 w-12 mx-auto text-primary-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Yasal Belgeler
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Vergi ve belge bilgilerinizi girin
        </p>
      </div>

      {/* Tax Number */}
      <div>
        <label htmlFor="taxNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Vergi Numarası *
        </label>
        <div className="relative">
          <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            id="taxNumber"
            name="taxNumber"
            value={formData.taxNumber}
            onChange={handleInputChange}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
              errors.taxNumber
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
            } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
            placeholder="Vergi numaranızı girin"
          />
        </div>
        {errors.taxNumber && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.taxNumber}</p>
        )}
      </div>

      {/* Tax Office */}
      <div>
        <label htmlFor="taxOffice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Vergi Dairesi *
        </label>
        <div className="relative">
          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            id="taxOffice"
            name="taxOffice"
            value={formData.taxOffice}
            onChange={handleInputChange}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
              errors.taxOffice
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
            } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
            placeholder="Vergi dairenizi girin"
          />
        </div>
        {errors.taxOffice && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.taxOffice}</p>
        )}
      </div>

      {/* Work Permit File */}
      <div>
        <label htmlFor="workPermitFile" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Çalışma İzni Belgesi
        </label>
        <div className="relative">
          <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="file"
            id="workPermitFile"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileUpload('workPermitFilePath')}
            disabled={isUploadingWorkPermit}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
              isUploadingWorkPermit 
                ? 'opacity-50 cursor-not-allowed' 
                : ''
            } ${
              errors.workPermitFilePath
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
            } text-gray-900 dark:text-white`}
          />
          {isUploadingWorkPermit && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        
        {/* Upload Status */}
        {isUploadingWorkPermit && (
          <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
            Çalışma izni belgesi yükleniyor...
          </p>
        )}
        
        {/* Error Message */}
        {errors.workPermitFilePath && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.workPermitFilePath}</p>
        )}
        
        {/* Success Message */}
        {formData.workPermitFilePath && !isUploadingWorkPermit && (
          <p className="mt-1 text-sm text-green-600 dark:text-green-400 font-medium">
            ✓ Çalışma izni belgesi başarıyla yüklendi
          </p>
        )}
      </div>

      {/* Food Certificate File */}
      <div>
        <label htmlFor="foodCertificateFile" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Gıda Belgesi
        </label>
        <div className="relative">
          <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="file"
            id="foodCertificateFile"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileUpload('foodCertificateFilePath')}
            disabled={isUploadingFoodCertificate}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
              isUploadingFoodCertificate 
                ? 'opacity-50 cursor-not-allowed' 
                : ''
            } ${
              errors.foodCertificateFilePath
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
            } text-gray-900 dark:text-white`}
          />
          {isUploadingFoodCertificate && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        
        {/* Upload Status */}
        {isUploadingFoodCertificate && (
          <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
            Gıda belgesi yükleniyor...
          </p>
        )}
        
        {/* Error Message */}
        {errors.foodCertificateFilePath && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.foodCertificateFilePath}</p>
        )}
        
        {/* Success Message */}
        {formData.foodCertificateFilePath && !isUploadingFoodCertificate && (
          <p className="mt-1 text-sm text-green-600 dark:text-green-400 font-medium">
            ✓ Gıda belgesi başarıyla yüklendi
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            to="/register"
            className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kayıt Sayfasına Dön</span>
          </Link>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  ${currentStep >= step 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                  }
                `}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`
                    w-full h-1 ml-4
                    ${currentStep > step 
                      ? 'bg-primary-600' 
                      : 'bg-gray-300 dark:bg-gray-600'
                    }
                  `} style={{ width: '100px' }} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600 dark:text-gray-400">
            <span>Temel Bilgiler</span>
            <span>Şirket Bilgileri</span>
            <span>Yasal Belgeler</span>
          </div>
        </motion.div>

        {/* Welcome Message */}
        {location.state?.message && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
          >
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
              <p className="text-green-800 dark:text-green-200">{location.state.message}</p>
            </div>
          </motion.div>
        )}

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="p-8">
            {/* Error Message */}
            {apiError && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                  <p className="text-red-800 dark:text-red-200">{apiError}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                  <p className="text-green-800 dark:text-green-200">{successMessage}</p>
                </div>
              </div>
            )}

            {/* Form Steps */}
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Önceki Adım
                </button>
              )}
              
              <div className="flex-1"></div>
              
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                >
                  Sonraki Adım
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || isUploadingLogo || isUploadingWorkPermit || isUploadingFoodCertificate}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Kaydediliyor...</span>
                    </>
                  ) : (isUploadingLogo || isUploadingWorkPermit || isUploadingFoodCertificate) ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Dosyalar Yükleniyor...</span>
                    </>
                  ) : (
                    <span>Restaurant'ı Kaydet</span>
                  )}
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingRestaurant; 