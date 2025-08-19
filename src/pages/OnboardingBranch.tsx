import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Store, Building2, Phone, Mail, MapPin, Clock, 
  ArrowLeft, AlertCircle, CheckCircle, Globe, 
  MapPinned, FileText, Home, Info, ArrowRight, Upload 
} from 'lucide-react';
import type { 
  CreateBranchWithDetailsDto, 
  CreateAddressCoreDto, 
  CreateContactCoreDto,
  CreateBranchWorkingHourCoreDto,
  DayOfWeek,
  ApiError,
  CreateBranchDto,
  TimeSpan
} from '../types/api';
import { branchService } from '../services/branchService';
import { mediaService } from '../services/mediaService';
import { restaurantService } from '../services/restaurantService';
import { logger } from '../utils/logger';

const OnboardingBranch: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    branchName?: string;
    whatsappOrderNumber?: string;
    'createAddressDto.country'?: string;
    'createAddressDto.city'?: string;
    'createAddressDto.street'?: string;
    'createAddressDto.addressLine1'?: string;
    'createAddressDto.zipCode'?: string;
    'createContactDto.phone'?: string;
    'createContactDto.mail'?: string;
    'createContactDto.location'?: string;
    workingHours?: string;
  }>({});
  const [apiError, setApiError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [restaurantId, setRestaurantId] = useState<number | null>(null);
  const [restaurantLogoPath, setRestaurantLogoPath] = useState<string | null>(null);
  
  // Logo upload states
  const [branchLogo, setBranchLogo] = useState<File | null>(null);
  const [branchLogoPreview, setBranchLogoPreview] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState<boolean>(false);

  // Form data state
  const [formData, setFormData] = useState<CreateBranchWithDetailsDto>({
    branchName: '',
    whatsappOrderNumber: '',
    restaurantId: 0,
    branchLogoPath: null,
    createAddressDto: {
      country: '',
      city: '',
      street: '',
      zipCode: '',
      addressLine1: '',
      addressLine2: ''
    },
    createContactDto: {
      phone: '',
      mail: '',
      location: '',
      contactHeader: '',
      footerTitle: '',
      footerDescription: '',
      openTitle: '',
      openDays: '',
      openHours: ''
    },
    createBranchWorkingHourCoreDto: [
      { dayOfWeek: 1, openTime: "08:00:00", closeTime: "22:00:00", isWorkingDay: true }, // Pazartesi
      { dayOfWeek: 2, openTime: "08:00:00", closeTime: "22:00:00", isWorkingDay: true }, // Salı
      { dayOfWeek: 3, openTime: "08:00:00", closeTime: "22:00:00", isWorkingDay: true }, // Çarşamba
      { dayOfWeek: 4, openTime: "08:00:00", closeTime: "22:00:00", isWorkingDay: true }, // Perşembe
      { dayOfWeek: 5, openTime: "08:00:00", closeTime: "22:00:00", isWorkingDay: true }, // Cuma
      { dayOfWeek: 6, openTime: "08:00:00", closeTime: "22:00:00", isWorkingDay: true }, // Cumartesi
      { dayOfWeek: 0, openTime: "08:00:00", closeTime: "22:00:00", isWorkingDay: false }  // Pazar - varsayılan olarak kapalı
    ]
  });

  // Helper function to convert time input value to API time format
  const formatTimeForApi = (timeStr: string): string => {
    return `${timeStr}:00`;
  };

  // Helper function to convert API time format to input value
  const formatTimeForInput = (timeStr: string): string => {
    return timeStr.substring(0, 5);
  };

  // Günlerin Türkçe isimleri - Görünüm sırası: Pazartesi-Pazar
  const dayNamesDisplay = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
  const dayNamesMapping = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

  // Get restaurantId from location state or localStorage and fetch restaurant info
  useEffect(() => {
    const restaurantIdFromState = location.state?.restaurantId;
    const restaurantIdFromStorage = localStorage.getItem('onboarding_restaurantId');
    
    if (import.meta.env.DEV) {
      logger.info('RestaurantId kontrol ediliyor', {
        state: restaurantIdFromState,
        localStorage: restaurantIdFromStorage
      });
    }
    
    let finalRestaurantId: number | null = null;
    
    if (restaurantIdFromState) {
      const id = parseInt(restaurantIdFromState);
      if (!isNaN(id) && id > 0) {
        finalRestaurantId = id;
        if (import.meta.env.DEV) {
          logger.info('RestaurantId state\'ten alındı', { id });
        }
      }
    } else if (restaurantIdFromStorage) {
      const id = parseInt(restaurantIdFromStorage);
      if (!isNaN(id) && id > 0) {
        finalRestaurantId = id;
        if (import.meta.env.DEV) {
          logger.info('RestaurantId localStorage\'tan alındı', { id });
        }
      }
    }

    if (finalRestaurantId) {
      setRestaurantId(finalRestaurantId);
      setFormData(prev => ({
        ...prev,
        restaurantId: finalRestaurantId
      }));

      // Restaurant bilgilerini al ve logo path'ini sakla
      fetchRestaurantInfo(finalRestaurantId);
    } else {
      logger.warn('RestaurantId bulunamadı! OnboardingRestaurant sayfasına yönlendirilecek.');
    }
  }, [location.state]);

  // Restaurant bilgilerini al ve logo path'ini sakla
  const fetchRestaurantInfo = async (restaurantId: number): Promise<void> => {
    try {
      if (import.meta.env.DEV) {
        logger.info('Restaurant bilgileri alınıyor', { restaurantId });
      }

      // Önce localStorage'dan restaurant logo path'ini kontrol et
      const storedRestaurantLogoPath = localStorage.getItem('restaurantLogoPath');
      if (storedRestaurantLogoPath) {
        setRestaurantLogoPath(storedRestaurantLogoPath);
        if (import.meta.env.DEV) {
          logger.info('Restaurant logo path localStorage\'dan alındı', { restaurantLogoPath: storedRestaurantLogoPath });
        }
        return;
      }

      // localStorage'da yoksa API'den al
      const restaurantInfo = await restaurantService.getRestaurantManagementInfo();
      
      if (restaurantInfo && restaurantInfo.restaurantLogoPath) {
        setRestaurantLogoPath(restaurantInfo.restaurantLogoPath);
        if (import.meta.env.DEV) {
          logger.info('Restaurant logo path API\'den alındı', { restaurantLogoPath: restaurantInfo.restaurantLogoPath });
        }
      }
    } catch (error) {
      logger.error('Restaurant bilgileri alınırken hata oluştu', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    
    // Handle nested objects (address and contact)
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        createAddressDto: {
          ...prev.createAddressDto,
          [addressField]: value || ''
        }
      }));
    } else if (name.startsWith('contact.')) {
      const contactField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        createContactDto: {
          ...prev.createContactDto,
          [contactField]: value || ''
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value || ''
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleWorkingHourChange = (dayIndex: number, field: keyof CreateBranchWorkingHourCoreDto, value: any): void => {
    setFormData(prev => ({
      ...prev,
      createBranchWorkingHourCoreDto: prev.createBranchWorkingHourCoreDto?.map((day, index) => {
        if (index === dayIndex) {
          if (field === 'openTime' || field === 'closeTime') {
            return { 
              ...day, 
              [field]: formatTimeForApi(value)
            };
          }
          if (field === 'isWorkingDay') {
            return { ...day, isWorkingDay: value };
          }
          return { ...day, [field]: value };
        }
        return day;
      }) || []
    }));
  };

  // Logo upload handlers
  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    if (file) {
      setBranchLogo(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setBranchLogoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Otomatik upload başlat
      await handleLogoUpload(file);
    }
  };

  const handleLogoUpload = async (file?: File): Promise<void> => {
    const uploadFile = file || branchLogo;
    if (!uploadFile) return;

    setIsUploadingLogo(true);
    try {
      if (import.meta.env.DEV) {
        logger.info('branchLogoPath dosya yükleme başlatılıyor', { uploadFile });
      }
      
      const responseUrl = await mediaService.uploadFile(uploadFile);
      
      if (import.meta.env.DEV) {
        logger.info('branchLogoPath başarıyla yüklendi', { responseUrl });
      }
      
      setFormData(prev => ({
        ...prev,
        branchLogoPath: responseUrl
      }));
      
      // Reset file input
      setBranchLogo(null);
      
    } catch (error) {
      console.error('Logo yükleme hatası:', error);
      setApiError('Logo yüklenirken hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: {
      branchName?: string;
      whatsappOrderNumber?: string;
      'createAddressDto.country'?: string;
      'createAddressDto.city'?: string;
      'createAddressDto.street'?: string;
      'createAddressDto.addressLine1'?: string;
      'createAddressDto.zipCode'?: string;
      'createContactDto.phone'?: string;
      'createContactDto.mail'?: string;
      'createContactDto.location'?: string;
      workingHours?: string;
    } = {};
    
    switch (step) {
      case 1: // Basic Info
        if (!formData.branchName?.trim()) {
          newErrors.branchName = 'Şube adı gereklidir';
        }
        if (!formData.whatsappOrderNumber?.trim()) {
          newErrors.whatsappOrderNumber = 'WhatsApp sipariş numarası gereklidir';
        }
        break;
        
      case 2: // Address Info
        if (!formData.createAddressDto.country?.trim()) {
          newErrors['createAddressDto.country'] = 'Ülke gereklidir';
        }
        if (!formData.createAddressDto.city?.trim()) {
          newErrors['createAddressDto.city'] = 'Şehir gereklidir';
        }
        if (!formData.createAddressDto.street?.trim()) {
          newErrors['createAddressDto.street'] = 'Sokak gereklidir';
        }
        if (!formData.createAddressDto.addressLine1?.trim()) {
          newErrors['createAddressDto.addressLine1'] = 'Adres satırı 1 gereklidir';
        }
        if (!formData.createAddressDto.zipCode?.trim()) {
          newErrors['createAddressDto.zipCode'] = 'Posta kodu gereklidir';
        }
        break;
        
      case 3: // Contact Info & Working Hours
        if (!formData.createContactDto.phone?.trim()) {
          newErrors['createContactDto.phone'] = 'Telefon numarası gereklidir';
        }
        if (!formData.createContactDto.mail?.trim()) {
          newErrors['createContactDto.mail'] = 'E-posta adresi gereklidir';
        }
        if (!formData.createContactDto.location?.trim()) {
          newErrors['createContactDto.location'] = 'Konum bilgisi gereklidir';
        }
        
        // Çalışma saatleri validation
        // eslint-disable-next-line no-case-declarations
        const workingDays = formData.createBranchWorkingHourCoreDto?.filter(day => day.isWorkingDay) || [];
        if (workingDays.length === 0) {
          newErrors.workingHours = 'En az bir gün için çalışma saati belirtmelisiniz';
        } else {
          // Çalışma saatlerinin doğru format olduğunu kontrol et
          for (const day of workingDays) {
            if (!day.openTime || !day.closeTime) {
              newErrors.workingHours = 'Tüm çalışma günleri için açılış ve kapanış saati belirtmelisiniz';
              break;
            }
            
            // Açılış saatinin kapanış saatinden önce olduğunu kontrol et
            const openTime = new Date(`2000-01-01T${day.openTime}`);
            const closeTime = new Date(`2000-01-01T${day.closeTime}`);
            
            if (openTime >= closeTime) {
              newErrors.workingHours = 'Açılış saati kapanış saatinden önce olmalıdır';
              break;
            }
          }
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

    if (!restaurantId) {
      setApiError('Restaurant bilgisi bulunamadı. Lütfen tekrar restaurant oluşturun.');
      setTimeout(() => {
        navigate('/onboarding/restaurant');
      }, 2000);
      return;
    }

    // Çalışma saatlerini filtrele ve temizle
    const filteredWorkingHours = formData.createBranchWorkingHourCoreDto?.filter(day => 
      day.isWorkingDay && day.openTime && day.closeTime
    ) || [];

    // Eğer hiç çalışma saati yoksa hata ver
    if (filteredWorkingHours.length === 0) {
      setApiError('En az bir gün için çalışma saati belirtmelisiniz.');
      return;
    }

    // Şube profil fotoğrafı yüklenmezse restaurant logo path'ini kullan
    let finalBranchLogoPath = formData.branchLogoPath;
    if (!finalBranchLogoPath && restaurantLogoPath) {
      finalBranchLogoPath = restaurantLogoPath;
      if (import.meta.env.DEV) {
        logger.info('Şube profil fotoğrafı yüklenmedi, restaurant logo path\'i kullanılıyor', { 
          restaurantLogoPath 
        });
      }
    }

    // RestaurantId'nin formData'ya kesinlikle set edildiğinden emin ol ve null değerleri temizle
    const finalFormData: CreateBranchWithDetailsDto = {
      branchName: formData.branchName?.trim() || null,
      whatsappOrderNumber: formData.whatsappOrderNumber?.trim() || null,
      restaurantId: restaurantId,
      branchLogoPath: finalBranchLogoPath,
      createAddressDto: {
        country: formData.createAddressDto.country?.trim() || null,
        city: formData.createAddressDto.city?.trim() || null,
        street: formData.createAddressDto.street?.trim() || null,
        zipCode: formData.createAddressDto.zipCode?.trim() || null,
        addressLine1: formData.createAddressDto.addressLine1?.trim() || null,
        addressLine2: formData.createAddressDto.addressLine2?.trim() || null
      },
      createContactDto: {
        phone: formData.createContactDto.phone?.trim() || null,
        mail: formData.createContactDto.mail?.trim() || null,
        location: formData.createContactDto.location?.trim() || null,
        contactHeader: formData.createContactDto.contactHeader?.trim() || null,
        footerTitle: formData.createContactDto.footerTitle?.trim() || null,
        footerDescription: formData.createContactDto.footerDescription?.trim() || null,
        openTitle: formData.createContactDto.openTitle?.trim() || null,
        openDays: formData.createContactDto.openDays?.trim() || null,
        openHours: formData.createContactDto.openHours?.trim() || null
      },
      createBranchWorkingHourCoreDto: filteredWorkingHours
    };
    
    setIsSubmitting(true);
    
    try {
      if (import.meta.env.DEV) {
        logger.info('Branch verisi gönderiliyor', { finalFormData });
      }
      
      const response = await branchService.createOnboardingBranch(finalFormData);
      if (import.meta.env.DEV) {
        logger.info('Branch Creation Response', { response });
      }
      
      if (response.branchId) {
        setSuccessMessage('Şube bilgileriniz başarıyla kaydedildi! Yönlendiriliyorsunuz...');
        
        // Store branchId for future use
        const branchId = response.branchId;
        if (import.meta.env.DEV) {
          logger.info('Oluşturulan Branch ID', { branchId });
        }
        localStorage.setItem('onboarding_branchId', branchId.toString());
        
        // Redirect to complete page
        setTimeout(() => {
          navigate('/onboarding/complete');
        }, 2000);
      } else {
        if (import.meta.env.DEV) {
          console.error('BranchId alınamadı! Response:', response);
        }
        setApiError('Şube ID alınamadı. Lütfen tekrar deneyin.');
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Branch creation error:', error);
      }
      
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
        setApiError('Bu şube adı zaten kullanımda. Lütfen farklı bir ad deneyin.');
      } else if (apiErr.status === 0) {
        setApiError('Sunucuya bağlanılamıyor. Lütfen internet bağlantınızı kontrol edin.');
      } else if (apiErr.status === 500) {
        setApiError('Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin veya form verilerinizi kontrol edin.');
      } else {
        setApiError(apiErr.message || 'Şube kaydı sırasında bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Switch component
  const Toggle = ({ checked, onChange, disabled }: { checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean }) => (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
        checked ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
                  <div>
        <label htmlFor="branchName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Şube Adı *
                        </label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            id="branchName"
            name="branchName"
            value={formData.branchName || ''}
                            onChange={handleInputChange}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
              errors.branchName
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
            } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
            placeholder="Şube adını girin"
          />
        </div>
                          {errors.branchName && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.branchName}</p>
                          )}
                      </div>

      <div>
        <label htmlFor="whatsappOrderNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          WhatsApp Sipariş Numarası *
                        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
            type="tel"
                            id="whatsappOrderNumber"
            name="whatsappOrderNumber"
            value={formData.whatsappOrderNumber || ''}
                            onChange={handleInputChange}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
              errors.whatsappOrderNumber
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
            } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
            placeholder="WhatsApp sipariş numarasını girin"
          />
        </div>
                          {errors.whatsappOrderNumber && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.whatsappOrderNumber}</p>
                          )}
                        </div>

      {/* Branch Logo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Şube Logosu (Opsiyonel)
        </label>
        <div className="space-y-4">
          {/* Logo Preview */}
          {(branchLogoPreview || formData.branchLogoPath) && (
            <div className="flex items-center space-x-4">
              <img
                src={branchLogoPreview || formData.branchLogoPath || ''}
                alt="Şube logosu önizleme"
                className="w-24 h-24 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600"
              />
              {formData.branchLogoPath && (
                <div className="text-sm text-green-600 dark:text-green-400">
                  ✓ Logo başarıyla yüklendi
                </div>
              )}
            </div>
          )}

          {/* File Input */}
          <div className="flex items-center space-x-4">
            <input
              type="file"
              id="branchLogo"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
              disabled={isUploadingLogo}
            />
            <label
              htmlFor="branchLogo"
              className={`inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 ${
                isUploadingLogo ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploadingLogo ? 'Yükleniyor...' : 'Logo Seç'}
            </label>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            PNG, JPG, GIF formatları desteklenir. Maksimum dosya boyutu: 5MB
          </p>

          {/* Restaurant logo path bilgisi */}
          {restaurantLogoPath && !formData.branchLogoPath && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Otomatik Logo Kullanımı
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Şube logosu yüklemezseniz, restaurant logosu otomatik olarak şube logosu olarak kullanılacaktır.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
                      </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
                  <div>
        <label htmlFor="address.country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Ülke *
                        </label>
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            id="address.country"
            name="address.country"
            value={formData.createAddressDto.country || ''}
                            onChange={handleInputChange}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
              errors['createAddressDto.country']
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
            } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
            placeholder="Ülke adını girin"
          />
        </div>
                          {errors['createAddressDto.country'] && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['createAddressDto.country']}</p>
                          )}
                      </div>

      <div>
        <label htmlFor="address.city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Şehir *
                        </label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            id="address.city"
            name="address.city"
            value={formData.createAddressDto.city || ''}
                            onChange={handleInputChange}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
              errors['createAddressDto.city']
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
            } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
            placeholder="Şehir adını girin"
          />
        </div>
                          {errors['createAddressDto.city'] && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['createAddressDto.city']}</p>
                          )}
                      </div>

      <div>
        <label htmlFor="address.street" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Sokak *
                        </label>
        <div className="relative">
          <MapPinned className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            id="address.street"
            name="address.street"
            value={formData.createAddressDto.street || ''}
                            onChange={handleInputChange}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
              errors['createAddressDto.street']
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
            } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
            placeholder="Sokak adını girin"
          />
        </div>
                          {errors['createAddressDto.street'] && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['createAddressDto.street']}</p>
                          )}
                      </div>

      <div>
        <label htmlFor="address.zipCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Posta Kodu *
                        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
            id="address.zipCode"
            name="address.zipCode"
            value={formData.createAddressDto.zipCode || ''}
                            onChange={handleInputChange}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
              errors['createAddressDto.zipCode']
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
            } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
            placeholder="Posta kodunu girin"
          />
        </div>
        {errors['createAddressDto.zipCode'] && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['createAddressDto.zipCode']}</p>
        )}
                      </div>

      <div>
        <label htmlFor="address.addressLine1" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Adres Satırı 1 *
                        </label>
        <div className="relative">
          <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
            id="address.addressLine1"
            name="address.addressLine1"
            value={formData.createAddressDto.addressLine1 || ''}
                            onChange={handleInputChange}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
              errors['createAddressDto.addressLine1']
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
            } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
            placeholder="Detaylı adres bilgisi girin"
                          />
                        </div>
        {errors['createAddressDto.addressLine1'] && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['createAddressDto.addressLine1']}</p>
        )}
                      </div>

      <div>
        <label htmlFor="address.addressLine2" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Adres Satırı 2 (Opsiyonel)
                        </label>
        <div className="relative">
          <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
            id="address.addressLine2"
            name="address.addressLine2"
            value={formData.createAddressDto.addressLine2 || ''}
                            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Ek adres bilgisi girin (opsiyonel)"
                          />
                        </div>
                      </div>
                    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
                  <div>
        <label htmlFor="contact.phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Telefon Numarası *
                        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="tel"
                            id="contact.phone"
            name="contact.phone"
            value={formData.createContactDto.phone || ''}
                            onChange={handleInputChange}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
              errors['createContactDto.phone']
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
            } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
            placeholder="Telefon numarasını girin"
          />
        </div>
                          {errors['createContactDto.phone'] && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['createContactDto.phone']}</p>
                          )}
                      </div>

      <div>
        <label htmlFor="contact.mail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          E-posta Adresi *
                        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="email"
                            id="contact.mail"
            name="contact.mail"
            value={formData.createContactDto.mail || ''}
                            onChange={handleInputChange}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
              errors['createContactDto.mail']
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
            } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
            placeholder="E-posta adresini girin"
          />
        </div>
                          {errors['createContactDto.mail'] && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['createContactDto.mail']}</p>
                          )}
                      </div>

      <div>
        <label htmlFor="contact.location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Konum Bilgisi *
                        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            id="contact.location"
            name="contact.location"
            value={formData.createContactDto.location || ''}
                            onChange={handleInputChange}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
              errors['createContactDto.location']
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
            } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
            placeholder="Konum bilgisini girin (Örn: 40.9795,28.7225)"
          />
        </div>
                          {errors['createContactDto.location'] && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['createContactDto.location']}</p>
                          )}
                      </div>

      <div>
        <label htmlFor="contact.contactHeader" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          İletişim Başlığı (Opsiyonel)
                        </label>
        <div className="relative">
          <Info className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            id="contact.contactHeader"
            name="contact.contactHeader"
            value={formData.createContactDto.contactHeader || ''}
                            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="İletişim başlığını girin (opsiyonel)"
                          />
                        </div>
                      </div>

      <div>
        <label htmlFor="contact.footerTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Footer Başlığı (Opsiyonel)
                        </label>
        <div className="relative">
          <Info className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            id="contact.footerTitle"
            name="contact.footerTitle"
            value={formData.createContactDto.footerTitle || ''}
                            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Footer başlığını girin (opsiyonel)"
                          />
                        </div>
                      </div>

      <div>
        <label htmlFor="contact.footerDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Footer Açıklaması (Opsiyonel)
                        </label>
        <div className="relative">
          <Info className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <textarea
                            id="contact.footerDescription"
            name="contact.footerDescription"
            value={formData.createContactDto.footerDescription || ''}
                            onChange={handleInputChange}
                            rows={3}
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Footer açıklamasını girin (opsiyonel)"
                          />
                        </div>
                      </div>

      <div>
        <label htmlFor="contact.openTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Çalışma Saatleri Başlığı (Opsiyonel)
                        </label>
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            id="contact.openTitle"
            name="contact.openTitle"
            value={formData.createContactDto.openTitle || ''}
                            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Çalışma saatleri başlığını girin (opsiyonel)"
                          />
                        </div>
                      </div>

      <div>
        <label htmlFor="contact.openDays" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Açık Günler (Opsiyonel)
                        </label>
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            id="contact.openDays"
            name="contact.openDays"
            value={formData.createContactDto.openDays || ''}
                            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Açık günleri girin (opsiyonel)"
                          />
                        </div>
                      </div>

      <div>
        <label htmlFor="contact.openHours" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Açık Saatler (Opsiyonel)
                        </label>
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            id="contact.openHours"
            name="contact.openHours"
            value={formData.createContactDto.openHours || ''}
                            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Açık saatleri girin (opsiyonel)"
                          />
                        </div>
                      </div>

      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Clock className="h-6 w-6 text-primary-600" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Çalışma Saatleri</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          İşletmenizin çalışma saatlerini belirleyin
        </p>
        
        <div className="space-y-3">
          {formData.createBranchWorkingHourCoreDto?.map((day, index) => (
            <div 
              key={day.dayOfWeek} 
              className={`relative group p-5 border border-gray-200 dark:border-gray-700 rounded-xl transition-all duration-200 hover:shadow-md ${
                day.isWorkingDay 
                  ? 'bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-700' 
                  : 'bg-gray-50 dark:bg-gray-800/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="min-w-[100px]">
                    <span className="text-base font-medium text-gray-900 dark:text-gray-100">
                      {dayNamesDisplay[index]}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Toggle
                      checked={day.isWorkingDay}
                      onChange={(checked) => handleWorkingHourChange(index, 'isWorkingDay', checked)}
                    />
                    <span className={`text-sm font-medium transition-colors ${
                      day.isWorkingDay 
                        ? 'text-green-700 dark:text-green-400' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {day.isWorkingDay ? 'Açık' : 'Kapalı'}
                    </span>
                  </div>
                </div>

                <div className={`flex items-center space-x-3 transition-opacity ${
                  !day.isWorkingDay ? 'opacity-40' : ''
                }`}>
                  <div className="flex items-center space-x-2">
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      Açılış
                    </label>
                    <input
                      title='time'
                      type="time"
                      value={formatTimeForInput(day.openTime)}
                      onChange={(e) => handleWorkingHourChange(index, 'openTime', e.target.value)}
                      disabled={!day.isWorkingDay}
                      className={`px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium transition-all focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        !day.isWorkingDay ? 'cursor-not-allowed bg-gray-100 dark:bg-gray-800' : 'hover:border-primary-300'
                      }`}
                    />
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-px bg-gray-300 dark:bg-gray-600"></div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      Kapanış
                    </label>
                    <input
                      title='time'
                      type="time"
                      value={formatTimeForInput(day.closeTime)}
                      onChange={(e) => handleWorkingHourChange(index, 'closeTime', e.target.value)}
                      disabled={!day.isWorkingDay}
                      className={`px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium transition-all focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        !day.isWorkingDay ? 'cursor-not-allowed bg-gray-100 dark:bg-gray-800' : 'hover:border-primary-300'
                      }`}
                    />
                  </div>
                </div>
              </div>
              
              {/* İşletme açık durumunda ek bilgi */}
              {day.isWorkingDay && (
                <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-700/50">
                  <p className="text-xs text-green-600 dark:text-green-400">
                    ✓ Bu gün müşteriler sipariş verebilecek
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Çalışma saatleri hata mesajı */}
        {errors.workingHours && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-300">
                {errors.workingHours}
              </p>
            </div>
          </div>
        )}
        
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Çalışma Saatleri Hakkında
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Burada belirlediğiniz saatler, müşterilerin QR menünüz üzerinden sipariş verebileceği zamanları belirler. 
                Kapalı günlerde sipariş alınmaz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <Link
                to="/onboarding/restaurant"
                className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-2"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Restaurant Bilgilerine Geri Dön
              </Link>
              <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
                Şube Bilgileri
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Restoranınızın şube bilgilerini adım adım girebilirsiniz
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="px-4 sm:px-0 mb-8">
          <nav aria-label="Progress">
            <ol role="list" className="flex items-center">
              {[
                { id: 1, name: 'Temel Bilgiler', icon: Store },
                { id: 2, name: 'Adres Bilgileri', icon: MapPinned },
                { id: 3, name: 'İletişim Bilgileri', icon: Phone }
              ].map((step, stepIdx) => {
                const StepIcon = step.icon;
                return (
                  <li
                    key={step.name}
                    className={`relative ${stepIdx !== 2 ? 'pr-8 sm:pr-20' : ''}`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`${
                          currentStep >= step.id
                            ? 'bg-primary-600 border-primary-600'
                            : 'bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                        } rounded-full transition-colors duration-200 h-8 w-8 flex items-center justify-center border-2`}
                      >
                        <StepIcon
                          className={`w-4 h-4 ${
                            currentStep >= step.id ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                          }`}
                        />
                      </div>
                      <div
                        className={`hidden sm:block text-sm font-medium ${
                          currentStep >= step.id ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'
                        } ml-2`}
                      >
                        {step.name}
                      </div>
                      {stepIdx !== 2 && (
                        <div
                          className={`hidden sm:block absolute top-4 right-0 w-16 h-0.5 transition-colors duration-200 ${
                            currentStep > step.id ? 'bg-primary-600 dark:bg-primary-400' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        />
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>

        {/* Error/Success Messages */}
        {apiError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-md bg-red-50 dark:bg-red-900/20 p-4 mx-4 sm:mx-0"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Hata</h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300 whitespace-pre-line">
                  {apiError}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-md bg-green-50 dark:bg-green-900/20 p-4 mx-4 sm:mx-0"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800 dark:text-green-200">Başarılı</h3>
                <div className="mt-2 text-sm text-green-700 dark:text-green-300">{successMessage}</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg mx-4 sm:mx-0">
          <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200 dark:divide-gray-700">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="p-8">
                <div className="text-center mb-8">
                  <Store className="h-12 w-12 mx-auto text-primary-600 mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Şube Bilgileri
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Şubenizin temel bilgilerini girin
                  </p>
                </div>
                {renderStep1()}
              </div>
            )}

            {/* Step 2: Address Info */}
            {currentStep === 2 && (
              <div className="p-8">
                <div className="text-center mb-8">
                  <MapPin className="h-12 w-12 mx-auto text-primary-600 mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Adres Bilgileri
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Şubenizin adres bilgilerini girin
                  </p>
                </div>
                {renderStep2()}
              </div>
            )}

            {/* Step 3: Contact Info */}
            {currentStep === 3 && (
              <div className="p-8">
                <div className="text-center mb-8">
                  <Phone className="h-12 w-12 mx-auto text-primary-600 mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    İletişim Bilgileri
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Şubenizin iletişim bilgilerini girin
                  </p>
                </div>
                {renderStep3()}
              </div>
            )}

            {/* Form Actions */}
            <div className="px-8 py-4 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePreviousStep}
                disabled={currentStep === 1}
                className={`inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm ${
                  currentStep === 1
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                  Geri
                </button>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  İleri
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                    isSubmitting
                      ? 'bg-primary-400 cursor-not-allowed'
                      : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Kaydediliyor...
                    </>
                  ) : (
                    'Kaydet'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default OnboardingBranch; 