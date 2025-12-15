import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, MapPin, Phone, Clock, Upload, Trash2, Image as ImageIcon, AlertTriangle, Globe } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { 
  BranchDetailResponse, 
  BranchEditFormData, 
  CreateBranchWorkingHourCoreDto,
  CreateBranchWithDetailsDto
} from '../../../../types/api';
import { mediaService } from '../../../../services/mediaService';
import { logger } from '../../../../utils/logger';
import { countriesWithCodes, countryKeys } from '../../../../data/mockData';



interface BranchEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBranchWithDetailsDto) => Promise<void>;
  branchDetail: BranchDetailResponse;
  isSubmitting: boolean;
}

const BranchEditModal: React.FC<BranchEditModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  branchDetail,
  isSubmitting,
}) => {
  const { t, isRTL } = useLanguage();
  
  const [formData, setFormData] = useState<BranchEditFormData>({
    branchName: '',
    restaurantId: branchDetail.restaurantId,
    whatsappOrderNumber: null,
    branchLogoPath: null,
    createAddressDto: {
      country: null,
      city: null,
      street: null,
      zipCode: null,
      addressLine1: null,
      addressLine2: null,
    },
    createContactDto: {
      phone: null,
      mail: null,
      location: null,
      contactHeader: null,
      footerTitle: null,
      footerDescription: null,
      openTitle: null,
      openDays: null,
      openHours: null,
    },
    createBranchWorkingHourCoreDto: []
  });
  
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'address' | 'contact' | 'workingHours'>('general');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  // Image upload states
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const defaultWorkingHours: CreateBranchWorkingHourCoreDto[] = [
    { dayOfWeek: 1, openTime: '08:00:00', closeTime: '22:00:00', isWorkingDay: true },
    { dayOfWeek: 2, openTime: '08:00:00', closeTime: '22:00:00', isWorkingDay: true },
    { dayOfWeek: 3, openTime: '08:00:00', closeTime: '22:00:00', isWorkingDay: true },
    { dayOfWeek: 4, openTime: '08:00:00', closeTime: '22:00:00', isWorkingDay: true },
    { dayOfWeek: 5, openTime: '08:00:00', closeTime: '22:00:00', isWorkingDay: true },
    { dayOfWeek: 6, openTime: '08:00:00', closeTime: '22:00:00', isWorkingDay: true },
    { dayOfWeek: 0, openTime: '08:00:00', closeTime: '22:00:00', isWorkingDay: true }
  ];

  const getDayName = (dayOfWeek: number): string => {
    return t(`branchManagement.form.dayNames.${dayOfWeek}`);
  };

  // --- ADDED: Helper to parse full phone number into code and local number ---
  const getPhoneParts = (fullNumber: string | null) => {
    if (!fullNumber) return { code: '+90', number: '' }; // Default to TR if empty
    
    // Sort countries by code length desc to match longest prefix first (e.g. match +971 before +97)
    const sortedCountries = [...countriesWithCodes].sort((a, b) => b.code.length - a.code.length);
    const country = sortedCountries.find(c => fullNumber.startsWith(c.code));
    
    if (country) {
      return {
        code: country.code,
        number: fullNumber.slice(country.code.length)
      };
    }
    
    // Fallback if no matching code found (assume default)
    return { code: '+90', number: fullNumber };
  };

  useEffect(() => {
    if (branchDetail && isOpen) {
      logger.info('Initializing form data from branch detail', branchDetail, { prefix: 'BranchEditModal' });
      
      const initialFormData = {
        branchName: branchDetail.branchName || '',
        restaurantId: branchDetail.restaurantId,
        whatsappOrderNumber: branchDetail.whatsappOrderNumber || null,
        branchLogoPath: branchDetail.branchLogoPath || null,
        createAddressDto: {
          country: branchDetail.address?.country || null,
          city: branchDetail.address?.city || null,
          street: branchDetail.address?.street || null,
          zipCode: branchDetail.address?.zipCode || null,
          addressLine1: branchDetail.address?.addressLine1 || null,
          addressLine2: branchDetail.address?.addressLine2 || null,
        },
        createContactDto: {
          phone: branchDetail.contact?.phone || null,
          mail: branchDetail.contact?.mail || null,
          location: branchDetail.contact?.location || null,
          contactHeader: branchDetail.contact?.contactHeader || null,
          footerTitle: branchDetail.contact?.footerTitle || null,
          footerDescription: branchDetail.contact?.footerDescription || null,
          openTitle: branchDetail.contact?.openTitle || null,
          openDays: branchDetail.contact?.openDays || null,
          openHours: branchDetail.contact?.openHours || null,
        },
        createBranchWorkingHourCoreDto: branchDetail.workingHours?.length
          ? branchDetail.workingHours.map(wh => ({
              dayOfWeek: wh.dayOfWeek,
              openTime: wh.openTime || '08:00:00',
              closeTime: wh.closeTime || '22:00:00',
              isWorkingDay: wh.isWorkingDay ?? true,
            }))
          : defaultWorkingHours,
      };
      
      setFormData(initialFormData);
      setImagePreview(branchDetail.branchLogoPath);
      setHasChanges(false);
      setActiveTab('general');
      setValidationErrors({});
      setUploadError(null);
    }
  }, [branchDetail, isOpen]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.branchName?.trim()) {
      errors.branchName = t('branchManagement.form.branchNameRequired');
    }

    const hasWorkingDay = formData.createBranchWorkingHourCoreDto?.some(day => day.isWorkingDay);
    if (!hasWorkingDay) {
      errors.workingHours = t('branchManagement.form.workingHoursRequired');
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof BranchEditFormData] as any),
          [child]: value || null
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value || null
      }));
    }
    setHasChanges(true);

    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // --- ADDED: Handler for Country Code + Phone Number updates ---
  const handlePhoneCompositeChange = (
    fullFieldName: string, // e.g., 'whatsappOrderNumber' or 'createContactDto.phone'
    currentFullValue: string | null,
    partType: 'code' | 'number',
    newValue: string
  ) => {
    const { code, number } = getPhoneParts(currentFullValue);
    
    let newFullNumber = '';
    
    if (partType === 'code') {
      newFullNumber = newValue + number;
    } else {
      newFullNumber = code + newValue;
    }

    // Reuse the existing input change logic by creating a synthetic event
    handleInputChange({
      target: {
        name: fullFieldName,
        value: newFullNumber
      }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleWorkingHourChange = (dayIndex: number, field: keyof CreateBranchWorkingHourCoreDto, value: any) => {
    setFormData(prev => ({
      ...prev,
      createBranchWorkingHourCoreDto: prev.createBranchWorkingHourCoreDto.map((hours, idx) =>
        idx === dayIndex ? { ...hours, [field]: value } : hours
      )
    }));
    setHasChanges(true);
    
    if (validationErrors.workingHours) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.workingHours;
        return newErrors;
      });
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError(t('branchManagement.modal.errors.invalidFileType'));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError(t('branchManagement.modal.errors.fileSizeError'));
      return;
    }

    setUploadError(null);
    setIsUploadingImage(true);

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);

      const previousUrl = formData.branchLogoPath;
      const newImageUrl = await mediaService.uploadFile(file, previousUrl || undefined);
      
      setFormData(prev => ({
        ...prev,
        branchLogoPath: newImageUrl
      }));
      
      setHasChanges(true);
      logger.info('Image uploaded successfully', { newImageUrl }, { prefix: 'BranchEditModal' });
      
    } catch (error) {
      logger.error('Image upload failed', error, { prefix: 'BranchEditModal' });
      setUploadError(t('branchManagement.modal.errors.imageUploadError'));
      setImagePreview(formData.branchLogoPath);
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = async () => {
    if (!formData.branchLogoPath) return;

    try {
      await mediaService.deleteFile(formData.branchLogoPath);
      setFormData(prev => ({
        ...prev,
        branchLogoPath: null
      }));
      setImagePreview(null);
      setHasChanges(true);
      logger.info('Image removed successfully', null, { prefix: 'BranchEditModal' });
    } catch (error) {
      logger.error('Image removal failed', error, { prefix: 'BranchEditModal' });
      setUploadError(t('branchManagement.modal.errors.imageRemoveError'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      if (validationErrors.branchName) setActiveTab('general');
      if (validationErrors.workingHours) setActiveTab('workingHours');
      return;
    }

    setUploadError(null);

    try {
      const submitData: CreateBranchWithDetailsDto = {
        branchName: formData.branchName?.trim() || null,
        whatsappOrderNumber: formData.whatsappOrderNumber?.trim() || null,
        restaurantId: formData.restaurantId,
        branchLogoPath: formData.branchLogoPath || null,
        createAddressDto: {
          country: formData.createAddressDto.country?.trim() || null,
          city: formData.createAddressDto.city?.trim() || null,
          street: formData.createAddressDto.street?.trim() || null,
          zipCode: formData.createAddressDto.zipCode?.trim() || null,
          addressLine1: formData.createAddressDto.addressLine1?.trim() || null,
          addressLine2: formData.createAddressDto.addressLine2?.trim() || null,
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
          openHours: formData.createContactDto.openHours?.trim() || null,
        },
        createBranchWorkingHourCoreDto: formData.createBranchWorkingHourCoreDto?.map(hour => ({
          dayOfWeek: hour.dayOfWeek,
          openTime: hour.openTime,
          closeTime: hour.closeTime,
          isWorkingDay: hour.isWorkingDay
        })) || []
      };

      logger.info('Submitting branch update data', submitData, { prefix: 'BranchEditModal' });
      await onSubmit(submitData);
      logger.info('Branch update successful', null, { prefix: 'BranchEditModal' });
      
    } catch (error: any) {
      logger.error('Branch update failed', error, { prefix: 'BranchEditModal' });
      
      if (error?.response?.status === 400) {
        const errorData = error?.response?.data;
        if (errorData?.errors) {
          const apiErrors: Record<string, string> = {};
          
          Object.entries(errorData.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages) && messages.length > 0) {
              const formField = field.toLowerCase();
              if (formField.includes('branchname')) {
                apiErrors.branchName = messages[0];
              } else if (formField.includes('address')) {
                apiErrors.address = messages[0];
                setActiveTab('address');
              } else if (formField.includes('contact')) {
                apiErrors.contact = messages[0];
                setActiveTab('contact');
              } else if (formField.includes('workinghour')) {
                apiErrors.workingHours = messages[0];
                setActiveTab('workingHours');
              } else {
                apiErrors[field] = messages[0];
              }
            }
          });
          
          setValidationErrors(apiErrors);
          setUploadError(t('branchManagement.modal.errors.validationFailed'));
        } else {
          setUploadError(t('branchManagement.modal.errors.dataValidationError'));
        }
      } else if (error?.response?.status === 401) {
        setUploadError(t('branchManagement.error.sessionExpired'));
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else if (error?.response?.status === 403) {
        setUploadError(t('branchManagement.error.noPermission'));
      } else if (error?.response?.status === 404) {
        setUploadError(t('branchManagement.error.branchNotFound'));
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else if (error?.response?.status === 0 || !navigator.onLine) {
        setUploadError(t('branchManagement.error.connectionError'));
      } else {
        setUploadError(
          error?.message || 
          t('branchManagement.error.unknownError')
        );
      }
    } 
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 overflow-y-auto h-full w-full z-50 flex items-start justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`relative w-full max-w-4xl bg-white dark:bg-gray-800 shadow-xl rounded-lg mt-8 mb-8 ${isRTL ? 'rtl' : 'ltr'}`}
        >
          {/* Header */}
          <div className={`flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('branchManagement.modal.editTitle', { branchName: branchDetail.branchName })}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('branchManagement.modal.editDescription')}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label={t('common.close')}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Error Display */}
          {uploadError && (
            <div className="mx-6 mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-400 dark:text-red-500" />
                </div>
                <div className={`${isRTL ? 'mr-3' : 'ml-3'}`}>
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    {t('branchManagement.modal.errors.updateError')}
                  </h3>
                  <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                    {uploadError}
                  </p>
                </div>
                <button
                  onClick={() => setUploadError(null)}
                  className={`${isRTL ? 'mr-auto' : 'ml-auto'} flex-shrink-0 text-red-400 hover:text-red-600 dark:hover:text-red-300`}
                  aria-label={t('common.dismiss')}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          <div className="p-6">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
              <nav className={`-mb-px flex ${isRTL ? 'space-x-reverse space-x-8' : 'space-x-8'} overflow-x-auto`}>
                {[
                  { 
                    id: 'general', 
                    label: t('branchManagement.modal.tabs.general'), 
                    icon: <Building2 className="w-4 h-4" />,
                    hasError: !!validationErrors.branchName
                  },
                  { 
                    id: 'address', 
                    label: t('branchManagement.modal.tabs.address'), 
                    icon: <MapPin className="w-4 h-4" />,
                    hasError: !!validationErrors.address
                  },
                  { 
                    id: 'contact', 
                    label: t('branchManagement.modal.tabs.contact'), 
                    icon: <Phone className="w-4 h-4" />,
                    hasError: !!validationErrors.contact
                  },
                  { 
                    id: 'workingHours', 
                    label: t('branchManagement.modal.tabs.workingHours'), 
                    icon: <Clock className="w-4 h-4" />,
                    hasError: !!validationErrors.workingHours
                  }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : tab.hasError
                        ? 'border-red-300 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                    {tab.hasError && (
                      <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* General Tab */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('branchManagement.form.branchName')} *
                    </label>
                    <input
                      type="text"
                      name="branchName"
                      value={formData.branchName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                        validationErrors.branchName 
                          ? 'border-red-300 dark:border-red-600 focus:ring-red-500' 
                          : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                      }`}
                      placeholder={t('branchManagement.form.branchNamePlaceholder')}
                    />
                    {validationErrors.branchName && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        {validationErrors.branchName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('branchManagement.form.whatsappNumber')}
                    </label>
                    {/* --- CHANGED: Split Phone Input (Code Selector + Input) --- */}
                    <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <select
                        title='Country Code'
                        value={getPhoneParts(formData.whatsappOrderNumber).code}
                        onChange={(e) => handlePhoneCompositeChange(
                          'whatsappOrderNumber', 
                          formData.whatsappOrderNumber, 
                          'code', 
                          e.target.value
                        )}
                        className="w-1/3 md:w-1/4 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                      >
                        {countriesWithCodes.map((country) => (
                          <option key={country.code + country.name} value={country.code}>
                            {country.name} ({country.code})
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        value={getPhoneParts(formData.whatsappOrderNumber).number}
                        onChange={(e) => handlePhoneCompositeChange(
                          'whatsappOrderNumber', 
                          formData.whatsappOrderNumber, 
                          'number', 
                          e.target.value
                        )}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                        placeholder={t('branchManagement.form.whatsappPlaceholder')}
                      />
                    </div>
                  </div>

                  {/* Logo Upload Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      {t('branchManagement.form.branchLogo')}
                    </label>
                    
                    {/* Current Logo Display */}
                    {imagePreview && (
                      <div className="mb-4">
                        <div className="relative inline-block">
                          <img
                            src={imagePreview}
                            alt={t('branchManagement.form.branchLogo')}
                            className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-sm"
                          />
                          {!isUploadingImage && (
                            <button
                              type="button"
                              onClick={handleRemoveImage}
                              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors shadow-lg"
                              title={t('branchManagement.form.logoRemove')}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                          {isUploadingImage && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Upload Controls */}
                    <div className="space-y-3">
                      <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                        <input
                          type="file"
                          id="logoUpload"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                          disabled={isUploadingImage}
                        />
                        <label
                          htmlFor="logoUpload"
                          className={`inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                            isUploadingImage ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                          }`}
                        >
                          {isUploadingImage ? (
                            <>
                              <div className={`animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 dark:border-gray-400 ${isRTL ? 'ml-2' : 'mr-2'}`}></div>
                              {t('branchManagement.modal.errors.uploadingImage')}
                            </>
                          ) : (
                            <>
                              <Upload className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                              {imagePreview ? t('branchManagement.form.logoChange') : t('branchManagement.form.logoUpload')}
                            </>
                          )}
                        </label>
                        
                        {!imagePreview && !isUploadingImage && (
                          <div className={`flex items-center text-gray-400 dark:text-gray-500 ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                            <ImageIcon className="h-5 w-5" />
                            <span className="text-sm">{t('branchManagement.form.logoNotSelected')}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('branchManagement.form.logoInstructions')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Address Tab */}
              {activeTab === 'address' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('branchManagement.form.country')}
                      </label>
                      <div className="relative">
                        <Globe className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10`} />
                        <select
                        title='Country'
                          name="createAddressDto.country"
                          value={formData.createAddressDto.country || ''}
                          onChange={handleInputChange}
                          className={`w-full ${isRTL ? 'pr-10 pl-8' : 'pl-10 pr-8'} py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors appearance-none ${isRTL ? 'text-right' : 'text-left'}`}
                          dir={isRTL ? 'rtl' : 'ltr'}
                        >
                          <option value="" disabled>
                            {t('branchManagement.form.countryPlaceholder')}
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
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('branchManagement.form.city')}
                      </label>
                      <input
                        type="text"
                        name="createAddressDto.city"
                        value={formData.createAddressDto.city || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                        placeholder={t('branchManagement.form.cityPlaceholder')}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('branchManagement.form.street')}
                    </label>
                    <input
                      type="text"
                      name="createAddressDto.street"
                      value={formData.createAddressDto.street || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                      placeholder={t('branchManagement.form.streetPlaceholder')}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('branchManagement.form.zipCode')}
                      </label>
                      <input
                        type="text"
                        name="createAddressDto.zipCode"
                        value={formData.createAddressDto.zipCode || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                        placeholder={t('branchManagement.form.zipCodePlaceholder')}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('branchManagement.form.addressLine1')}
                      </label>
                      <input
                        type="text"
                        name="createAddressDto.addressLine1"
                        value={formData.createAddressDto.addressLine1 || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                        placeholder={t('branchManagement.form.addressLine1Placeholder')}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('branchManagement.form.addressLine2')}
                    </label>
                    <input
                      type="text"
                      name="createAddressDto.addressLine2"
                      value={formData.createAddressDto.addressLine2 || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                      placeholder={t('branchManagement.form.addressLine2Placeholder')}
                    />
                  </div>
                </div>
              )}

              {/* Contact Tab */}
              {activeTab === 'contact' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('branchManagement.form.phone')}
                      </label>
                      {/* --- CHANGED: Split Phone Input for Contact Phone as well --- */}
                      <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <select
                          title='Country Code'
                          value={getPhoneParts(formData.createContactDto.phone).code}
                          onChange={(e) => handlePhoneCompositeChange(
                            'createContactDto.phone', 
                            formData.createContactDto.phone, 
                            'code', 
                            e.target.value
                          )}
                          className="w-1/3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                        >
                          {countriesWithCodes.map((country) => (
                            <option key={country.code + country.name} value={country.code}>
                              {country.name} ({country.code})
                            </option>
                          ))}
                        </select>
                        <input
                          type="tel"
                          value={getPhoneParts(formData.createContactDto.phone).number}
                          onChange={(e) => handlePhoneCompositeChange(
                            'createContactDto.phone', 
                            formData.createContactDto.phone, 
                            'number', 
                            e.target.value
                          )}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                          placeholder={t('branchManagement.form.phonePlaceholder')}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('branchManagement.form.email')}
                      </label>
                      <input
                        type="email"
                        name="createContactDto.mail"
                        value={formData.createContactDto.mail || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                        placeholder={t('branchManagement.form.emailPlaceholder')}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('branchManagement.form.location')}
                    </label>
                    <input
                      type="text"
                      name="createContactDto.location"
                      value={formData.createContactDto.location || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                      placeholder={t('branchManagement.form.locationPlaceholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('branchManagement.form.contactHeader')}
                    </label>
                    <input
                      type="text"
                      name="createContactDto.contactHeader"
                      value={formData.createContactDto.contactHeader || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                      placeholder={t('branchManagement.form.contactHeaderPlaceholder')}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('branchManagement.form.footerTitle')}
                      </label>
                      <input
                        type="text"
                        name="createContactDto.footerTitle"
                        value={formData.createContactDto.footerTitle || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                        placeholder={t('branchManagement.form.footerTitlePlaceholder')}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('branchManagement.form.openTitle')}
                      </label>
                      <input
                        type="text"
                        name="createContactDto.openTitle"
                        value={formData.createContactDto.openTitle || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                        placeholder={t('branchManagement.form.openTitlePlaceholder')}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('branchManagement.form.footerDescription')}
                    </label>
                    <textarea
                      name="createContactDto.footerDescription"
                      value={formData.createContactDto.footerDescription || ''}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors resize-none"
                      placeholder={t('branchManagement.form.footerDescriptionPlaceholder')}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('branchManagement.form.openDays')}
                      </label>
                      <input
                        type="text"
                        name="createContactDto.openDays"
                        value={formData.createContactDto.openDays || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                        placeholder={t('branchManagement.form.openDaysPlaceholder')}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('branchManagement.form.openHours')}
                      </label>
                      <input
                        type="text"
                        name="createContactDto.openHours"
                        value={formData.createContactDto.openHours || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                        placeholder={t('branchManagement.form.openHoursPlaceholder')}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Working Hours Tab */}
              {activeTab === 'workingHours' && (
                <div className="space-y-4">
                  <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} mb-4`}>
                    <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                      {t('branchManagement.form.workingHours')}
                    </h4>
                  </div>
                  
                  {validationErrors.workingHours && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
                      <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        {validationErrors.workingHours}
                      </p>
                    </div>
                  )}
                  
                  {formData.createBranchWorkingHourCoreDto.map((hours, index) => (
                    <div key={index} className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'} p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50`}>
                      <div className="w-24 flex-shrink-0">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {getDayName(hours.dayOfWeek)}
                        </span>
                      </div>
                      
                      <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                        <input
                          title="isWorkingDay"
                          type="checkbox"
                          checked={hours.isWorkingDay}
                          onChange={(e) => handleWorkingHourChange(index, 'isWorkingDay', e.target.checked)}
                          className="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {t('branchManagement.form.isOpen')}
                        </span>
                      </div>

                      {hours.isWorkingDay && (
                        <>
                          <div>
                            <input
                              title="time"
                              type="time"
                              value={hours.openTime}
                              onChange={(e) => handleWorkingHourChange(index, 'openTime', e.target.value)}
                              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-colors"
                            />
                          </div>
                          <span className="text-gray-500 dark:text-gray-400">-</span>
                          <div>
                            <input
                              title="time"
                              type="time"
                              value={hours.closeTime}
                              onChange={(e) => handleWorkingHourChange(index, 'closeTime', e.target.value)}
                              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-colors"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Form Actions */}
              <div className={`flex justify-end ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} pt-6 border-t border-gray-200 dark:border-gray-700`}>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !hasChanges || isUploadingImage}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {t('branchManagement.modal.buttons.updating')}
                    </div>
                  ) : (
                    t('branchManagement.modal.buttons.update')
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BranchEditModal;