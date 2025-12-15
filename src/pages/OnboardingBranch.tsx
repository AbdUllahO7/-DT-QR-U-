import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Store, Building2, Phone, Mail, MapPin, Clock, 
  ArrowLeft, AlertCircle, CheckCircle, Globe, 
  MapPinned, FileText, Home, Info, ArrowRight, Upload, X, Navigation
} from 'lucide-react';
import type { 
  CreateBranchWithDetailsDto, 
  CreateBranchWorkingHourCoreDto,
  ApiError,
} from '../types/api';
import { branchService } from '../services/branchService';
import { mediaService } from '../services/mediaService';
import { restaurantService } from '../services/restaurantService';
import { logger } from '../utils/logger';
import { useLanguage } from '../contexts/LanguageContext';
import { countriesWithCodes, countryKeys } from '../data/mockData';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icon issue with Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Default logo URL when no logo is provided
const DEFAULT_LOGO_URL = 'https://media.istockphoto.com/id/2173059563/vector/coming-soon-image-on-white-background-no-photo-available.jpg?s=612x612&w=0&k=20&c=v0a_B58wPFNDPULSiw_BmPyhSNCyrP_d17i2BPPyDTk=';

const OnboardingBranch: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, isRTL } = useLanguage();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    branchName?: string;
    whatsappOrderNumber?: string;
    'createAddressDto.country'?: string;
    'createAddressDto.city'?: string;
    'createAddressDto.street'?: string;
    'createAddressDto.addressLine1'?: string;
    'createAddressDto.addressLine2'?: string;
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

  // Phone country codes
  const [whatsappCountryCode, setWhatsappCountryCode] = useState<string>('+90');
  const [contactCountryCode, setContactCountryCode] = useState<string>('+90');

  // Map modal state
  const [isMapModalOpen, setIsMapModalOpen] = useState<boolean>(false);
  const [selectedLatLng, setSelectedLatLng] = useState<{ lat: number; lng: number }>({
    lat: 41.0082, // Default to Istanbul
    lng: 28.9784
  });
  const [googleMapsLink, setGoogleMapsLink] = useState<string>('');
  const [linkError, setLinkError] = useState<string>('');

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
      { dayOfWeek: 1, openTime: "08:00:00", closeTime: "22:00:00", isWorkingDay: true },
      { dayOfWeek: 2, openTime: "08:00:00", closeTime: "22:00:00", isWorkingDay: true },
      { dayOfWeek: 3, openTime: "08:00:00", closeTime: "22:00:00", isWorkingDay: true },
      { dayOfWeek: 4, openTime: "08:00:00", closeTime: "22:00:00", isWorkingDay: true },
      { dayOfWeek: 5, openTime: "08:00:00", closeTime: "22:00:00", isWorkingDay: true },
      { dayOfWeek: 6, openTime: "08:00:00", closeTime: "22:00:00", isWorkingDay: true },
      { dayOfWeek: 0, openTime: "08:00:00", closeTime: "22:00:00", isWorkingDay: false }
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

  // Helper function to validate time ranges (handles cross-midnight scenarios)
  const isValidTimeRange = (openTime: string, closeTime: string): boolean => {
    const open = new Date(`2000-01-01T${openTime}`);
    const close = new Date(`2000-01-01T${closeTime}`);
    
    if (close <= open) {
      const nextDayClose = new Date(`2000-01-02T${closeTime}`);
      const hoursSpan = (nextDayClose.getTime() - open.getTime()) / (1000 * 60 * 60);
      return hoursSpan <= 12 && hoursSpan > 0;
    }
    
    return close > open;
  };

  const dayNamesDisplay = [
    t('onboardingBranch.form.step3.workingHours.dayNames.0'),
    t('onboardingBranch.form.step3.workingHours.dayNames.1'),
    t('onboardingBranch.form.step3.workingHours.dayNames.2'),
    t('onboardingBranch.form.step3.workingHours.dayNames.3'),
    t('onboardingBranch.form.step3.workingHours.dayNames.4'),
    t('onboardingBranch.form.step3.workingHours.dayNames.5'),
    t('onboardingBranch.form.step3.workingHours.dayNames.6')
  ];

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

      fetchRestaurantInfo(finalRestaurantId);
    } else {
      logger.warn('RestaurantId bulunamadı! OnboardingRestaurant sayfasına yönlendirilecek.');
    }
  }, [location.state]);

  const fetchRestaurantInfo = async (restaurantId: number): Promise<void> => {
    try {
      if (import.meta.env.DEV) {
        logger.info('Restaurant bilgileri alınıyor', { restaurantId });
      }

      const storedRestaurantLogoPath = localStorage.getItem('restaurantLogoPath');
      if (storedRestaurantLogoPath) {
        setRestaurantLogoPath(storedRestaurantLogoPath);
        if (import.meta.env.DEV) {
          logger.info('Restaurant logo path localStorage\'dan alındı', { restaurantLogoPath: storedRestaurantLogoPath });
        }
        return;
      }

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
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
  const { name, value } = e.target;
  
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
  
  if (errors[name as keyof typeof errors]) {
    setErrors(prev => ({
      ...prev,
      [name]: null
    }));
  }
};

  // Handlers for WhatsApp Number
  const handleWhatsappNationalPhoneChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target;
    const digitsOnly = value.replace(/\D/g, '');
    
    setFormData(prev => ({
      ...prev,
      whatsappOrderNumber: digitsOnly
    }));
    
    if (errors.whatsappOrderNumber) {
      setErrors(prev => ({ ...prev, whatsappOrderNumber: undefined }));
    }
  };

  const handleWhatsappCountryCodeChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setWhatsappCountryCode(e.target.value);
  };

  // Handlers for Contact Phone Number
  const handleContactNationalPhoneChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target;
    const digitsOnly = value.replace(/\D/g, '');
    
    setFormData(prev => ({
      ...prev,
      createContactDto: {
        ...prev.createContactDto,
        phone: digitsOnly
      }
    }));
    
    if (errors['createContactDto.phone']) {
      setErrors(prev => ({ ...prev, 'createContactDto.phone': undefined }));
    }
  };

  const handleContactCountryCodeChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setContactCountryCode(e.target.value);
  };

  // Function to extract coordinates from Google Maps link
  const extractCoordinatesFromLink = (link: string): { lat: number; lng: number } | null => {
    try {
      // Pattern 1: google.com/maps/@lat,lng,zoom
      const pattern1 = /@(-?\d+\.?\d*),(-?\d+\.?\d*)/;
      const match1 = link.match(pattern1);
      if (match1) {
        return {
          lat: parseFloat(match1[1]),
          lng: parseFloat(match1[2])
        };
      }

      // Pattern 2: google.com/maps?q=lat,lng
      const pattern2 = /q=(-?\d+\.?\d*),(-?\d+\.?\d*)/;
      const match2 = link.match(pattern2);
      if (match2) {
        return {
          lat: parseFloat(match2[1]),
          lng: parseFloat(match2[2])
        };
      }

      // Pattern 3: google.com/maps/place/.../@lat,lng
      const pattern3 = /place\/[^@]*@(-?\d+\.?\d*),(-?\d+\.?\d*)/;
      const match3 = link.match(pattern3);
      if (match3) {
        return {
          lat: parseFloat(match3[1]),
          lng: parseFloat(match3[2])
        };
      }

      // Pattern 4: ll=lat,lng or !3d lat !4d lng
      const pattern4 = /!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/;
      const match4 = link.match(pattern4);
      if (match4) {
        return {
          lat: parseFloat(match4[1]),
          lng: parseFloat(match4[2])
        };
      }

      return null;
    } catch (error) {
      console.error('Error extracting coordinates:', error);
      return null;
    }
  };

  const handleGoogleMapsLinkChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const link = e.target.value;
    setGoogleMapsLink(link);
    setLinkError('');

    if (link.trim()) {
      const coords = extractCoordinatesFromLink(link);
      if (coords) {
        setSelectedLatLng(coords);
        setLinkError('');
      } else if (link.includes('google.com/maps') || link.includes('maps.app.goo.gl')) {
        setLinkError(t('onboardingBranch.form.step3.location.invalidLink') || 'Could not extract coordinates from this link. Please try a different format.');
      }
    }
  };

  // Map modal handlers
  const handleOpenMapModal = (): void => {
    // Parse existing location if available
    if (formData.createContactDto.location) {
      const coords = formData.createContactDto.location.split(',');
      if (coords.length === 2) {
        const lat = parseFloat(coords[0].trim());
        const lng = parseFloat(coords[1].trim());
        if (!isNaN(lat) && !isNaN(lng)) {
          setSelectedLatLng({ lat, lng });
        }
      }
    }
    setIsMapModalOpen(true);
  };

  const handleCloseMapModal = (): void => {
    setIsMapModalOpen(false);
  };

  const handleConfirmLocation = (): void => {
    const locationString = `${selectedLatLng.lat.toFixed(6)},${selectedLatLng.lng.toFixed(6)}`;
    setFormData(prev => ({
      ...prev,
      createContactDto: {
        ...prev.createContactDto,
        location: locationString
      }
    }));
    setIsMapModalOpen(false);
    if (errors['createContactDto.location']) {
      setErrors(prev => ({ ...prev, 'createContactDto.location': undefined }));
    }
  };

  const handleGetCurrentLocation = (): void => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSelectedLatLng({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          alert(t('onboardingBranch.form.step3.location.geolocationError') || 'Could not get your location. Please select manually.');
        }
      );
    } else {
      alert(t('onboardingBranch.form.step3.location.geolocationNotSupported') || 'Geolocation is not supported by your browser.');
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

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    if (file) {
      setBranchLogo(file);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setBranchLogoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
      
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
      
      setBranchLogo(null);
      
    } catch (error) {
      console.error('Logo yükleme hatası:', error);
      setApiError(t('onboardingBranch.messages.api.logoUploadError'));
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
      'createAddressDto.addressLine2'?: string;
      'createAddressDto.zipCode'?: string;
      'createContactDto.phone'?: string;
      'createContactDto.mail'?: string;
      'createContactDto.location'?: string;
      workingHours?: string;
    } = {};
    
    switch (step) {
      case 1: // Basic Info
        if (!formData.branchName?.trim()) {
          newErrors.branchName = t('onboardingBranch.form.step1.branchName.error');
        }
        
        // WhatsApp number is required
        if (!formData.whatsappOrderNumber?.trim()) {
          newErrors.whatsappOrderNumber = t('onboardingBranch.form.step1.whatsappNumber.error');
        } else if (!/^\d{7,15}$/.test(formData.whatsappOrderNumber.trim())) {
          newErrors.whatsappOrderNumber = t('onboardingBranch.form.step1.whatsappNumber.errorInvalid');
        }
        break;
        
      case 2: // Address Info
        if (!formData.createAddressDto.country?.trim()) {
          newErrors['createAddressDto.country'] = t('onboardingBranch.form.step2.country.error');
        }
        if (!formData.createAddressDto.city?.trim()) {
          newErrors['createAddressDto.city'] = t('onboardingBranch.form.step2.city.error');
        }
     
       
        break;
        
      case 3: // Contact Info & Working Hours
        
        
        if (!formData.createContactDto.mail?.trim()) {
          newErrors['createContactDto.mail'] = t('onboardingBranch.form.step3.email.error');
        }
       
        
        // eslint-disable-next-line no-case-declarations
        const workingDays = formData.createBranchWorkingHourCoreDto?.filter(day => day.isWorkingDay) || [];
        if (workingDays.length === 0) {
          newErrors.workingHours = t('onboardingBranch.form.step3.workingHours.error.minOneDay');
        } else {
          for (const day of workingDays) {
            if (!day.openTime || !day.closeTime) {
              newErrors.workingHours = t('onboardingBranch.form.step3.workingHours.error.allTimesRequired');
              break;
            }
            
            if (!isValidTimeRange(day.openTime, day.closeTime)) {
              const openTimeFormatted = formatTimeForInput(day.openTime);
              const closeTimeFormatted = formatTimeForInput(day.closeTime);
              
              if (day.closeTime <= day.openTime) {
                newErrors.workingHours = t('onboardingBranch.form.step3.workingHours.error.invalidRange', {
                  openTime: openTimeFormatted,
                  closeTime: closeTimeFormatted
                });
              } else {
                newErrors.workingHours = t('onboardingBranch.form.step3.workingHours.error.openBeforeClose', {
                  openTime: openTimeFormatted,
                  closeTime: closeTimeFormatted
                });
              }
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePreviousStep = (): void => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    setApiError('');
    setSuccessMessage('');
    
    if (!validateStep(3)) {
      return;
    }

    if (!restaurantId) {
      setApiError(t('onboardingBranch.messages.api.restaurantNotFound'));
      setTimeout(() => {
        navigate('/onboarding/restaurant');
      }, 2000);
      return;
    }

    const allWorkingHours = formData.createBranchWorkingHourCoreDto || [];
    
    const workingDays = allWorkingHours.filter(day => day.isWorkingDay);
    if (workingDays.length === 0) {
      setApiError(t('onboardingBranch.form.step3.workingHours.error.minOneDay'));
      return;
    }

    for (const day of workingDays) {
      if (!day.openTime || !day.closeTime) {
        setApiError(t('onboardingBranch.form.step3.workingHours.error.allTimesRequired'));
        return;
      }
    }

    // Determine final branch logo path with priority:
    // 1. User uploaded logo
    // 2. Restaurant logo path
    // 3. Default logo URL
    let finalBranchLogoPath = formData.branchLogoPath;
    if (!finalBranchLogoPath && restaurantLogoPath) {
      finalBranchLogoPath = restaurantLogoPath;
      if (import.meta.env.DEV) {
        logger.info('Şube profil fotoğrafı yüklenmedi, restaurant logo path\'i kullanılıyor', { 
          restaurantLogoPath 
        });
      }
    }
    if (!finalBranchLogoPath) {
      finalBranchLogoPath = DEFAULT_LOGO_URL;
      if (import.meta.env.DEV) {
        logger.info('Ne şube ne restaurant logosu yüklenmedi, varsayılan logo kullanılıyor', { 
          DEFAULT_LOGO_URL 
        });
      }
    }
    
    const fullWhatsappNumber = formData.whatsappOrderNumber 
      ? `${whatsappCountryCode}${(formData.whatsappOrderNumber).replace(/\D/g, '')}`
      : ''; 
    const fullContactPhone = fullWhatsappNumber;

    const finalFormData: CreateBranchWithDetailsDto = {
      branchName: formData.branchName?.trim() || null,
      whatsappOrderNumber: fullWhatsappNumber,
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
        phone: fullContactPhone || '',
        mail: formData.createContactDto.mail?.trim() || null,
        location: formData.createContactDto.location?.trim() || null,
        contactHeader: formData.createContactDto.contactHeader?.trim() || null,
        footerTitle: formData.createContactDto.footerTitle?.trim() || null,
        footerDescription: formData.createContactDto.footerDescription?.trim() || null,
        openTitle: formData.createContactDto.openTitle?.trim() || null,
        openDays: formData.createContactDto.openDays?.trim() || null,
        openHours: formData.createContactDto.openHours?.trim() || null
      },
      createBranchWorkingHourCoreDto: allWorkingHours
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
        setSuccessMessage(t('onboardingBranch.messages.successMessage'));
        
        const branchId = response.branchId;
        if (import.meta.env.DEV) {
          logger.info('Oluşturulan Branch ID', { branchId });
        }
        localStorage.setItem('onboarding_branchId', branchId.toString());
        
        setTimeout(() => {
          navigate('/onboarding/complete');
        }, 2000);
      } else {
        if (import.meta.env.DEV) {
          console.error('BranchId alınamadı! Response:', response);
        }
        setApiError(t('onboardingBranch.messages.api.branchIdMissing'));
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Branch creation error:', error);
      }
      
      const apiErr = error as ApiError;
      
      if (apiErr.status === 400 && apiErr.errors) {
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
        setApiError(t('onboardingBranch.messages.api.nameInUse'));
      } else if (apiErr.status === 0) {
        setApiError(t('onboardingBranch.messages.api.connectionError'));
      } else if (apiErr.status === 500) {
        setApiError(t('onboardingBranch.messages.api.serverError'));
      } else {
        setApiError(apiErr.message || t('onboardingBranch.messages.api.genericCreateError'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Component to update map view when coordinates change
  const MapUpdater = ({ center }: { center: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
  };

  // Component to handle map click events
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setSelectedLatLng({
          lat: e.latlng.lat,
          lng: e.latlng.lng
        });
      },
    });

    return <Marker position={[selectedLatLng.lat, selectedLatLng.lng]} />;
  };

  const MapPickerModal = () => {
    useEffect(() => {
      if (isMapModalOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
      return () => {
        document.body.style.overflow = 'unset';
      };
    }, [isMapModalOpen]);

    if (!isMapModalOpen) return null;

    return (
      <AnimatePresence>
        <div className="fixed inset-0 z-50 overflow-y-auto " dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseMapModal}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className={`flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <MapPin className="h-6 w-6 text-primary-600" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {t('onboardingBranch.form.step3.location.mapTitle') || 'حدد الموقع'}
                  </h3>
                </div>
                <button
                  onClick={handleCloseMapModal}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {/* Google Maps Link Input */}
                <div className="space-y-2">
                  <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('onboardingBranch.form.step3.location.googleMapsLink') || 'رابط خرائط جوجل (اختياري)'}
                  </label>
                  <div className="relative">
                    <Globe className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`} />
                    <input
                      type="text"
                      value={googleMapsLink}
                      onChange={handleGoogleMapsLinkChange}
                      placeholder={t('onboardingBranch.form.step3.location.googleMapsLinkPlaceholder') || 'https://maps.google.com/...'}
                      className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border ${
                        linkError ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                      } rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${isRTL ? 'text-right' : 'text-left'}`}
                      dir="ltr"
                    />
                  </div>
                  {linkError && (
                    <p className={`text-xs text-red-600 dark:text-red-400 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {linkError}
                    </p>
                  )}
                  <p className={`text-xs text-gray-500 dark:text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('onboardingBranch.form.step3.location.googleMapsLinkHelper') || 'الصق رابط خرائط جوجل وسيتم استخراج الإحداثيات تلقائيًا'}
                  </p>
                </div>

                {/* Current Location Button */}
                <button
                  type="button"
                  onClick={handleGetCurrentLocation}
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 transition-all duration-200 border border-blue-200 dark:border-blue-700 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  <Navigation className="h-5 w-5" />
                  <span className="font-medium">
                    {t('onboardingBranch.form.step3.location.useCurrentLocation') || 'استخدم موقعي الحالي'}
                  </span>
                </button>

                {/* Interactive Map Container */}
                <div className="space-y-2">
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <label className={`text-sm font-medium text-gray-700 dark:text-gray-300 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t('onboardingBranch.form.step3.location.interactiveMap') || 'الخريطة التفاعلية'}
                    </label>
                    <span className={`text-xs text-gray-500 dark:text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t('onboardingBranch.form.step3.location.clickToPin') || 'اضغط على الخريطة لتحديد الموقع'}
                    </span>
                  </div>
                  <div className="relative w-full h-[400px] bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden border-2 border-gray-300 dark:border-gray-600 shadow-inner">
                    {/* Interactive Leaflet Map */}
                    <MapContainer
                      center={[selectedLatLng.lat, selectedLatLng.lng]}
                      zoom={13}
                      style={{ height: '100%', width: '100%' }}
                      scrollWheelZoom={true}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <MapUpdater center={[selectedLatLng.lat, selectedLatLng.lng]} />
                      <LocationMarker />
                    </MapContainer>

                    {/* Overlay with instructions */}
                    <div className="absolute top-3 left-1/2 transform -translate-x-1/2 z-[1000] pointer-events-none">
                      <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-600">
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary-600" />
                          {t('onboardingBranch.form.step3.location.markerPosition') || 'موقع العلامة'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* External Map Link */}
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${selectedLatLng.lat}&mlon=${selectedLatLng.lng}#map=15/${selectedLatLng.lat}/${selectedLatLng.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <span>{t('onboardingBranch.form.step3.location.openFullMap') || 'فتح في خريطة كاملة'}</span>
                    <ArrowRight className={`h-3 w-3 ${isRTL ? 'mr-1 rotate-180' : 'ml-1'}`} />
                  </a>
                </div>

                {/* Coordinate Inputs */}
                <div className="space-y-3">
                  <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('onboardingBranch.form.step3.location.manualCoordinates') || 'الإحداثيات اليدوية'}
                  </label>
                  <div className={`grid grid-cols-2 gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <div>
                      <label className={`block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                        {t('onboardingBranch.form.step3.location.latitude') || 'خط العرض'}
                      </label>
                      <input
                      title='number'
                        type="number"
                        step="1"
                        value={selectedLatLng.lat}
                        onChange={(e) => {
                          const newLat = parseFloat(e.target.value) || 0;
                          if (newLat >= -90 && newLat <= 90) {
                            setSelectedLatLng(prev => ({ ...prev, lat: newLat }));
                          }
                        }}
                        className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${isRTL ? 'text-right' : 'text-left'}`}
                        dir="ltr"
                        min="-90"
                        max="90"
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                        {t('onboardingBranch.form.step3.location.longitude') || 'خط الطول'}
                      </label>
                      <input
                        title='bumber2'
                        type="number"
                        step="1"
                        value={selectedLatLng.lng}
                        onChange={(e) => {
                          const newLng = parseFloat(e.target.value) || 0;
                          if (newLng >= -180 && newLng <= 180) {
                            setSelectedLatLng(prev => ({ ...prev, lng: newLng }));
                          }
                        }}
                        className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${isRTL ? 'text-right' : 'text-left'}`}
                        dir="ltr"
                        min="-180"
                        max="180"
                      />
                    </div>
                  </div>
                </div>

                {/* Info Box */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-xl">
                  <div className={`flex items-start space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className={`text-sm text-blue-700 dark:text-blue-300 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <p className="font-medium mb-2">
                        {t('onboardingBranch.form.step3.location.mapHelp') || 'كيفية استخدام الخريطة:'}
                      </p>
                      <ul className={`space-y-1.5 ${isRTL ? 'mr-4' : 'ml-4'}`}>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400">①</span>
                          <span>{t('onboardingBranch.form.step3.location.mapHelp1') || 'الصق رابط خرائط جوجل في الحقل أعلاه'}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400">②</span>
                          <span>{t('onboardingBranch.form.step3.location.mapHelp2') || 'أو اضغط "استخدم موقعي الحالي"'}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400">③</span>
                          <span>{t('onboardingBranch.form.step3.location.mapHelp3') || 'أو أدخل الإحداثيات يدويًا'}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400">④</span>
                          <span>{t('onboardingBranch.form.step3.location.mapHelp4') || 'افتح الخريطة الكاملة لتحديد الموقع بدقة'}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Current Selected Coordinates Display */}
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className={`text-sm font-medium text-gray-700 dark:text-gray-300 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t('onboardingBranch.form.step3.location.selectedCoordinates') || 'الإحداثيات المحددة:'}
                    </span>
                    <code className="text-sm font-mono text-primary-600 dark:text-primary-400" dir="ltr">
                      {selectedLatLng.lat.toFixed(6)}, {selectedLatLng.lng.toFixed(6)}
                    </code>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className={`flex items-center justify-end space-x-3 px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <button
                  type="button"
                  onClick={handleCloseMapModal}
                  className="px-5 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
                >
                  {t('onboardingBranch.buttons.cancel') || 'إلغاء'}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmLocation}
                  className="px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium shadow-sm"
                >
                  {t('onboardingBranch.buttons.confirm') || 'تأكيد الموقع'}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </AnimatePresence>
    );
  };

  const Toggle = ({ checked, onChange, disabled }: { checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean }) => (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
        checked ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
      }`}
      dir="ltr"
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
          {t('onboardingBranch.form.step1.branchName.label')} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Building2 className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`} />
          <input
            type="text"
            id="branchName"
            name="branchName"
            value={formData.branchName || ''}
            onChange={handleInputChange}
            className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
              errors.branchName
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
            } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}
            placeholder={t('onboardingBranch.form.step1.branchName.placeholder')}
            dir={isRTL ? 'rtl' : 'ltr'}
            required
          />
        </div>
        {errors.branchName && (
          <p className={`mt-1 text-sm text-red-600 dark:text-red-400 ${isRTL ? 'text-right' : 'text-left'}`}>{errors.branchName}</p>
        )}
      </div>

      {/* WhatsApp Phone Input */}
      <div>
        <label htmlFor="whatsappOrderNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('onboardingBranch.form.step1.whatsappNumber.label')} <span className="text-red-500">*</span>
        </label>
        <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
          {/* Country Code Selector */}
          <div className="relative">
            <select
              id="whatsappCountryCode"
              name="whatsappCountryCode"
              value={whatsappCountryCode}
           
              onChange={handleWhatsappCountryCodeChange}
              className={`h-full py-3 pl-3 pr-8 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors duration-200 border-gray-300 dark:border-gray-600 appearance-none ${isRTL ? 'text-right' : 'text-left'}`}
              aria-label={t('onboardingBranch.form.step1.whatsappNumber.ariaLabel')}
              dir={isRTL ? 'rtl' : 'ltr'}
              required
            >
              {countriesWithCodes.map(country => (
                <option key={country.name} value={country.code}>
                  {country.name} ({country.code})
                </option>
              ))}
            </select>
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
              id="whatsappOrderNumber"
              name="whatsappOrderNumber"
              type="tel"
              autoComplete="tel-national"
              maxLength={10}
              value={formData.whatsappOrderNumber || ''}
              onChange={handleWhatsappNationalPhoneChange}
              className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                errors.whatsappOrderNumber
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
              } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}
              placeholder={t('onboardingBranch.form.step1.whatsappNumber.placeholder')}
              dir={isRTL ? 'rtl' : 'ltr'}
              required
            />
          </div>
        </div>
        {errors.whatsappOrderNumber && (
          <p className={`mt-1 text-sm text-red-600 dark:text-red-400 ${isRTL ? 'text-right' : 'text-left'}`}>{errors.whatsappOrderNumber}</p>
        )}
      </div>

      {/* Branch Logo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('onboardingBranch.form.step1.branchLogo.label')}
        </label>
        <div className="space-y-4">
          {(branchLogoPreview || formData.branchLogoPath) && (
            <div className={`flex items-center space-x-4 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <img
                src={branchLogoPreview || formData.branchLogoPath || ''}
                alt="Şube logosu önizleme"
                className="w-24 h-24 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600"
              />
              {formData.branchLogoPath && (
                <div className={`text-sm text-green-600 dark:text-green-400 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('onboardingBranch.form.step1.branchLogo.success')}
                </div>
              )}
            </div>
          )}

          <div className={`flex items-center space-x-4 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
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
              } ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <Upload className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isUploadingLogo ? t('onboardingBranch.form.step1.branchLogo.buttonUploading') : t('onboardingBranch.form.step1.branchLogo.button')}
            </label>
          </div>

          <p className={`text-sm text-gray-500 dark:text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('onboardingBranch.form.step1.branchLogo.helper')}
          </p>

          {restaurantLogoPath && !formData.branchLogoPath && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
              <div className={`flex items-start space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <h4 className={`text-sm font-medium text-blue-900 dark:text-blue-100 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('onboardingBranch.form.step1.branchLogo.infoTitle')}
                  </h4>
                  <p className={`text-sm text-blue-700 dark:text-blue-300 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('onboardingBranch.form.step1.branchLogo.infoDescription')}
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
          {t('onboardingBranch.form.step2.country.label')} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Globe className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`} />
         <select
          id="address.country"
          name="address.country"
          value={formData.createAddressDto.country || ''}
          onChange={handleInputChange}
          className={`w-full ${isRTL ? 'pr-10 pl-8' : 'pl-10 pr-8'} py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
            errors['createAddressDto.country']
              ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
          } text-gray-900 dark:text-white appearance-none ${isRTL ? 'text-right' : 'text-left'}`}
          dir={isRTL ? 'rtl' : 'ltr'}
          required
        >
          <option value="" disabled>
            {t('onboardingBranch.form.step2.country.placeholder')}
          </option>
          {countryKeys.map((countryKey) => (
            <option key={countryKey} value={t(countryKey)}>
              {t(countryKey)}
            </option>
          ))}
        </select>
        {/* Custom dropdown arrow */}
        <div className={`absolute inset-y-0 ${isRTL ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center pointer-events-none`}>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      </div>

      <div>
        <label htmlFor="address.city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('onboardingBranch.form.step2.city.label')} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Building2 className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`} />
          <input
            type="text"
            id="address.city"
            name="address.city"
            value={formData.createAddressDto.city || ''}
            onChange={handleInputChange}
            className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
              errors['createAddressDto.city']
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
            } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}
            placeholder={t('onboardingBranch.form.step2.city.placeholder')}
            dir={isRTL ? 'rtl' : 'ltr'}
            required
          />
        </div>
        {errors['createAddressDto.city'] && (
          <p className={`mt-1 text-sm text-red-600 dark:text-red-400 ${isRTL ? 'text-right' : 'text-left'}`}>{errors['createAddressDto.city']}</p>
        )}
      </div>

      <div>
        <label htmlFor="address.street" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('onboardingBranch.form.step2.street.label')}
        </label>
        <div className="relative">
          <MapPinned className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`} />
          <input
            type="text"
            id="address.street"
            name="address.street"
            value={formData.createAddressDto.street || ''}
            onChange={handleInputChange}
            className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
              errors['createAddressDto.street']
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
            } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}
            placeholder={t('onboardingBranch.form.step2.street.placeholder')}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        </div>
        {errors['createAddressDto.street'] && (
          <p className={`mt-1 text-sm text-red-600 dark:text-red-400 ${isRTL ? 'text-right' : 'text-left'}`}>{errors['createAddressDto.street']}</p>
        )}
      </div>

      <div>
        <label htmlFor="address.zipCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('onboardingBranch.form.step2.zipCode.label')}
        </label>
        <div className="relative">
          <FileText className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`} />
          <input
            type="text"
            id="address.zipCode"
            name="address.zipCode"
            value={formData.createAddressDto.zipCode || ''}
            onChange={handleInputChange}
            className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
              errors['createAddressDto.zipCode']
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
            } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}
            placeholder={t('onboardingBranch.form.step2.zipCode.placeholder')}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        </div>
        {errors['createAddressDto.zipCode'] && (
          <p className={`mt-1 text-sm text-red-600 dark:text-red-400 ${isRTL ? 'text-right' : 'text-left'}`}>{errors['createAddressDto.zipCode']}</p>
        )}
      </div>

      <div>
        <label htmlFor="address.addressLine1" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('onboardingBranch.form.step2.addressLine1.label')}
        </label>
        <div className="relative">
          <Home className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`} />
          <input
            type="text"
            id="address.addressLine1"
            name="address.addressLine1"
            value={formData.createAddressDto.addressLine1 || ''}
            onChange={handleInputChange}
            className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
              errors['createAddressDto.addressLine1']
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
            } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}
            placeholder={t('onboardingBranch.form.step2.addressLine1.placeholder')}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        </div>
        {errors['createAddressDto.addressLine1'] && (
          <p className={`mt-1 text-sm text-red-600 dark:text-red-400 ${isRTL ? 'text-right' : 'text-left'}`}>{errors['createAddressDto.addressLine1']}</p>
        )}
      </div>

      <div>
        <label htmlFor="address.addressLine2" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('onboardingBranch.form.step2.addressLine2.label')}
        </label>
        <div className="relative">
          <Home className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`} />
          <input
            type="text"
            id="address.addressLine2"
            name="address.addressLine2"
            value={formData.createAddressDto.addressLine2 || ''}
            onChange={handleInputChange}
            className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
              errors['createAddressDto.addressLine2']
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
            } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}
            placeholder={t('onboardingBranch.form.step2.addressLine2.placeholder')}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        </div>
        {errors['createAddressDto.addressLine2'] && (
          <p className={`mt-1 text-sm text-red-600 dark:text-red-400 ${isRTL ? 'text-right' : 'text-left'}`}>{errors['createAddressDto.addressLine2']}</p>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      
     
      <div>
        <label htmlFor="contact.mail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('onboardingBranch.form.step3.email.label')} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Mail className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`} />
          <input
            type="email"
            id="contact.mail"
            name="contact.mail"
            value={formData.createContactDto.mail || ''}
            onChange={handleInputChange}
            className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
              errors['createContactDto.mail']
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
            } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}
            placeholder={t('onboardingBranch.form.step3.email.placeholder')}
            dir={isRTL ? 'rtl' : 'ltr'}
            required
          />
        </div>
        {errors['createContactDto.mail'] && (
          <p className={`mt-1 text-sm text-red-600 dark:text-red-400 ${isRTL ? 'text-right' : 'text-left'}`}>{errors['createContactDto.mail']}</p>
        )}
      </div>

      <div>
        <label htmlFor="contact.location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('onboardingBranch.form.step3.location.label')}
        </label>
        <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} gap-2`}>
          <div className="relative flex-1">
            <MapPin className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`} />
            <input
              type="text"
              id="contact.location"
              name="contact.location"
              value={formData.createContactDto.location || ''}
              onChange={handleInputChange}
              className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                errors['createContactDto.location']
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
              } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}
              placeholder={t('onboardingBranch.form.step3.location.placeholder')}
              dir="ltr"
            />
          </div>
          <button
            type="button"
            onClick={handleOpenMapModal}
            className={`px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-2 whitespace-nowrap ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}
          >
            <MapPinned className="h-5 w-5" />
            <span className="hidden sm:inline">{t('onboardingBranch.form.step3.location.selectOnMap') || 'اختر من الخريطة'}</span>
          </button>
        </div>
        {errors['createContactDto.location'] && (
          <p className={`mt-1 text-sm text-red-600 dark:text-red-400 ${isRTL ? 'text-right' : 'text-left'}`}>{errors['createContactDto.location']}</p>
        )}
      </div>

      <div>
        <label htmlFor="contact.contactHeader" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('onboardingBranch.form.step3.contactHeader.label')}
        </label>
        <div className="relative">
          <Info className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`} />
          <input
            type="text"
            id="contact.contactHeader"
            name="contact.contactHeader"
            value={formData.createContactDto.contactHeader || ''}
            onChange={handleInputChange}
            className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}
            placeholder={t('onboardingBranch.form.step3.contactHeader.placeholder')}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact.footerTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('onboardingBranch.form.step3.footerTitle.label')}
        </label>
        <div className="relative">
          <Info className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`} />
          <input
            type="text"
            id="contact.footerTitle"
            name="contact.footerTitle"
            value={formData.createContactDto.footerTitle || ''}
            onChange={handleInputChange}
            className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}
            placeholder={t('onboardingBranch.form.step3.footerTitle.placeholder')}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact.footerDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('onboardingBranch.form.step3.footerDescription.label')}
        </label>
        <div className="relative">
          <Info className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3 h-5 w-5 text-gray-400`} />
          <textarea
            id="contact.footerDescription"
            name="contact.footerDescription"
            value={formData.createContactDto.footerDescription || ''}
            onChange={handleInputChange}
            rows={3}
            className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}
            placeholder={t('onboardingBranch.form.step3.footerDescription.placeholder')}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact.openTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('onboardingBranch.form.step3.openTitle.label')}
        </label>
        <div className="relative">
          <Clock className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`} />
          <input
            type="text"
            id="contact.openTitle"
            name="contact.openTitle"
            value={formData.createContactDto.openTitle || ''}
            onChange={handleInputChange}
            className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}
            placeholder={t('onboardingBranch.form.step3.openTitle.placeholder')}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact.openDays" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('onboardingBranch.form.step3.openDays.label')}
        </label>
        <div className="relative">
          <Clock className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`} />
          <input
            type="text"
            id="contact.openDays"
            name="contact.openDays"
            value={formData.createContactDto.openDays || ''}
            onChange={handleInputChange}
            className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}
            placeholder={t('onboardingBranch.form.step3.openDays.placeholder')}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact.openHours" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('onboardingBranch.form.step3.openHours.label')}
        </label>
        <div className="relative">
          <Clock className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`} />
          <input
            type="text"
            id="contact.openHours"
            name="contact.openHours"
            value={formData.createContactDto.openHours || ''}
            onChange={handleInputChange}
            className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}
            placeholder={t('onboardingBranch.form.step3.openHours.placeholder')}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        </div>
      </div>

      <div className="space-y-6">
        <div className={`flex items-center space-x-2 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
          <Clock className="h-6 w-6 text-primary-600" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {t('onboardingBranch.form.step3.workingHours.title')}
          </h3>
        </div>
        <p className={`text-sm text-gray-600 dark:text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}>
          {t('onboardingBranch.form.step3.workingHours.description')}
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
              {/* Mobile/Tablet: Stack vertically */}
              <div className="flex flex-col space-y-4">
                {/* Day name and toggle */}
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="min-w-[100px]">
                    <span className={`text-base font-medium text-gray-900 dark:text-gray-100 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {dayNamesDisplay[index]}
                    </span>
                  </div>
                  
                  <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <Toggle
                      checked={day.isWorkingDay}
                      onChange={(checked) => handleWorkingHourChange(index, 'isWorkingDay', checked)}
                    />
                    <span className={`text-sm font-medium transition-colors ${
                      day.isWorkingDay 
                        ? 'text-green-700 dark:text-green-400' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {day.isWorkingDay ? t('onboardingBranch.form.step3.workingHours.toggleOpen') : t('onboardingBranch.form.step3.workingHours.toggleClosed')}
                    </span>
                  </div>
                </div>

                {/* Time inputs - Now in a separate row */}
                <div className={`flex items-center justify-center gap-3 transition-opacity ${
                  !day.isWorkingDay ? 'opacity-40' : ''
                } ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <label className={`text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t('onboardingBranch.form.step3.workingHours.openLabel')}
                    </label>
                    <input
                      title='time'
                      type="time"
                      value={formatTimeForInput(day.openTime)}
                      onChange={(e) => handleWorkingHourChange(index, 'openTime', e.target.value)}
                      disabled={!day.isWorkingDay}
                      className={`px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium transition-all focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        !day.isWorkingDay ? 'cursor-not-allowed bg-gray-100 dark:bg-gray-800' : 'hover:border-primary-300'
                      } ${isRTL ? 'text-right' : 'text-left'}`}
                      dir="ltr"
                    />
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-px bg-gray-300 dark:bg-gray-600"></div>
                  </div>
                  
                  <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <label className={`text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t('onboardingBranch.form.step3.workingHours.closeLabel')}
                    </label>
                    <input
                      title='time'
                      type="time"
                      value={formatTimeForInput(day.closeTime)}
                      onChange={(e) => handleWorkingHourChange(index, 'closeTime', e.target.value)}
                      disabled={!day.isWorkingDay}
                      className={`px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium transition-all focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        !day.isWorkingDay ? 'cursor-not-allowed bg-gray-100 dark:bg-gray-800' : 'hover:border-primary-300'
                      } ${isRTL ? 'text-right' : 'text-left'}`}
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>
              
              {day.isWorkingDay && (
                <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-700/50">
                  <p className={`text-xs text-green-600 dark:text-green-400 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('onboardingBranch.form.step3.workingHours.workingDayNote')}
                    {formatTimeForInput(day.closeTime) <= formatTimeForInput(day.openTime) && (
                      <span className={`${isRTL ? 'mr-2' : 'ml-2'} text-blue-600 dark:text-blue-400`}>
                        {t('onboardingBranch.form.step3.workingHours.overnightNote')}
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {errors.workingHours && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
            <div className={`flex items-start space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <p className={`text-sm text-red-700 dark:text-red-300 ${isRTL ? 'text-right' : 'text-left'}`}>
                {errors.workingHours}
              </p>
            </div>
          </div>
        )}
        
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
          <div className={`flex items-start space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <h4 className={`text-sm font-medium text-blue-900 dark:text-blue-100 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('onboardingBranch.form.step3.workingHours.infoBox.title')}
              </h4>
              <ul className={`text-sm text-blue-700 dark:text-blue-300 space-y-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                <li>{t('onboardingBranch.form.step3.workingHours.infoBox.item1')}</li>
                <li>{t('onboardingBranch.form.step3.workingHours.infoBox.item2')}</li>
                <li>{t('onboardingBranch.form.step3.workingHours.infoBox.item3')}</li>
                <li>{t('onboardingBranch.form.step3.workingHours.infoBox.item4')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <MapPickerModal />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 mt-[100px] to-white dark:from-gray-900 dark:to-gray-800" dir={isRTL ? 'rtl' : 'ltr'}>
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <Link
                to="/onboarding/restaurant"
                className={`inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <ArrowLeft className={`w-4 h-4 ${isRTL ? 'ml-1 rotate-180' : 'mr-1'}`} />
                {t('onboardingBranch.header.backLink')}
              </Link>
              <h2 className={`text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('onboardingBranch.header.title')}
              </h2>
              <p className={`mt-1 text-sm text-gray-500 dark:text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('onboardingBranch.header.subtitle')}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0 mb-8">
          <nav aria-label="Progress">
            <ol role="list" className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              {[
                { id: 1, name: t('onboardingBranch.steps.basic'), icon: Store },
                { id: 2, name: t('onboardingBranch.steps.address'), icon: MapPinned },
                { id: 3, name: t('onboardingBranch.steps.contact'), icon: Phone }
              ].map((step, stepIdx) => {
                const StepIcon = step.icon;
                return (
                  <li
                    key={step.name}
                    className={`relative ${stepIdx !== 2 ? (isRTL ? 'pl-8 sm:pl-20' : 'pr-8 sm:pr-20') : ''}`}
                  >
                    <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
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
                        } ${isRTL ? 'mr-2' : 'ml-2'}`}
                      >
                        {step.name}
                      </div>
                      {stepIdx !== 2 && (
                        <div
                          className={`hidden sm:block absolute top-4 ${isRTL ? 'left-0' : 'right-0'} w-16 h-0.5 transition-colors duration-200 ${
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

        {apiError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-md bg-red-50 dark:bg-red-900/20 p-4 mx-4 sm:mx-0"
          >
            <div className={`flex ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className={`${isRTL ? 'mr-3' : 'ml-3'}`}>
                <h3 className={`text-sm font-medium text-red-800 dark:text-red-200 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('onboardingBranch.messages.errorTitle')}
                </h3>
                <div className={`mt-2 text-sm text-red-700 dark:text-red-300 whitespace-pre-line ${isRTL ? 'text-right' : 'text-left'}`}>
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
            <div className={`flex ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div className={`${isRTL ? 'mr-3' : 'ml-3'}`}>
                <h3 className={`text-sm font-medium text-green-800 dark:text-green-200 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('onboardingBranch.messages.successTitle')}
                </h3>
                <div className={`mt-2 text-sm text-green-700 dark:text-green-300 ${isRTL ? 'text-right' : 'text-left'}`}>{successMessage}</div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg mx-4 sm:mx-0">
          <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200 dark:divide-gray-700">
            {currentStep === 1 && (
              <div className="p-8">
                <div className="text-center mb-8">
                  <Store className="h-12 w-12 mx-auto text-primary-600 mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {t('onboardingBranch.form.step1.title')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('onboardingBranch.form.step1.description')}
                  </p>
                </div>
                {renderStep1()}
              </div>
            )}

            {currentStep === 2 && (
              <div className="p-8">
                <div className="text-center mb-8">
                  <MapPin className="h-12 w-12 mx-auto text-primary-600 mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {t('onboardingBranch.form.step2.title')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('onboardingBranch.form.step2.description')}
                  </p>
                </div>
                {renderStep2()}
              </div>
            )}

            {currentStep === 3 && (
              <div className="p-8">
                <div className="text-center mb-8">
                  <Phone className="h-12 w-12 mx-auto text-primary-600 mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {t('onboardingBranch.form.step3.title')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('onboardingBranch.form.step3.description')}
                  </p>
                </div>
                {renderStep3()}
              </div>
            )}

            <div className={`px-8 py-4 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <button
                type="button"
                onClick={handlePreviousStep}
                disabled={currentStep === 1}
                className={`inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm ${
                  currentStep === 1
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                } ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <ArrowLeft className={`w-4 h-4 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
                {t('onboardingBranch.buttons.back')}
              </button>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  {t('onboardingBranch.buttons.next')}
                  <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                    isSubmitting
                      ? 'bg-primary-400 cursor-not-allowed'
                      : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                  } ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <div className={`w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`}></div>
                      {t('onboardingBranch.buttons.saving')}
                    </>
                  ) : (
                    t('onboardingBranch.buttons.save')
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
    </>
  );
};

export default OnboardingBranch;
