import React, { useState, useEffect } from 'react';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Upload,
  X,
  Globe,
  Home,
  Info,
  Clock,
  MapPinned,
  FileText,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import type { CreateBranchWithDetailsDto, CreateBranchWorkingHourCoreDto } from '../../../../types/api';
import { mediaService } from '../../../../services/mediaService';

interface BranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBranchWithDetailsDto) => Promise<void>;
  formData: CreateBranchWithDetailsDto;
  setFormData: React.Dispatch<React.SetStateAction<CreateBranchWithDetailsDto>>;
  isSubmitting: boolean;
  hasChanges: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onWorkingHourChange: (dayIndex: number, field: keyof CreateBranchWorkingHourCoreDto, value: any) => void;
}

const BranchModal: React.FC<BranchModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  isSubmitting,
  hasChanges,
  onInputChange,
  onWorkingHourChange
}) => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [branchLogo, setBranchLogo] = useState<File | null>(null);
  const [branchLogoPreview, setBranchLogoPreview] = useState<string | null>(formData.branchLogoPath || null);
  const [isUploadingLogo, setIsUploadingLogo] = useState<boolean>(false);

  const dayNamesDisplay = Array.isArray(t('branchModal.workingHours.days'))
    ? t('branchModal.workingHours.days')
    : language === 'ar'
    ? ['الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد']
    : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Update branchLogoPreview when formData.branchLogoPath changes
  useEffect(() => {
    setBranchLogoPreview(formData.branchLogoPath || null);
  }, [formData.branchLogoPath]);

  // Helper functions
  const formatTimeForInput = (timeStr: string): string => {
    return timeStr.substring(0, 5);
  };

  const formatTimeForApi = (timeStr: string): string => {
    return `${timeStr}:00`;
  };

  // Toggle component for working hours
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
          checked ? (isRTL ? '-translate-x-6' : 'translate-x-6') : (isRTL ? '-translate-x-1' : 'translate-x-1')
        }`}
      />
    </button>
  );

  // Form validation
  const validateStep = (step: number): boolean => {
    const errors: { [key: string]: string } = {};

    if (step === 1) {
      if (!formData.branchName?.trim()) {
        errors.branchName = t('branchModal.errors.branchName');
      }
      if (!formData.whatsappOrderNumber?.trim()) {
        errors.whatsappOrderNumber = t('branchModal.errors.whatsappNumber');
      }
    } else if (step === 2) {
      if (!formData.createAddressDto.country?.trim()) {
        errors['address.country'] = t('branchModal.errors.country');
      }
      if (!formData.createAddressDto.city?.trim()) {
        errors['address.city'] = t('branchModal.errors.city');
      }
      if (!formData.createAddressDto.street?.trim()) {
        errors['address.street'] = t('branchModal.errors.street');
      }
      if (!formData.createAddressDto.addressLine1?.trim()) {
        errors['address.addressLine1'] = t('branchModal.errors.addressLine1');
      }
      if (!formData.createAddressDto.zipCode?.trim()) {
        errors['address.zipCode'] = t('branchModal.errors.zipCode');
      }
    } else if (step === 3) {
      if (!formData.createContactDto.phone?.trim()) {
        errors['contact.phone'] = t('branchModal.errors.phone');
      }
      if (!formData.createContactDto.mail?.trim()) {
        errors['contact.mail'] = t('branchModal.errors.email');
      }
      if (!formData.createContactDto.location?.trim()) {
        errors['contact.location'] = t('branchModal.errors.location');
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Input change handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    let updatedFormData: CreateBranchWithDetailsDto;

    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      updatedFormData = {
        ...formData,
        createAddressDto: {
          ...formData.createAddressDto,
          [addressField]: value
        }
      };
    } else if (name.startsWith('contact.')) {
      const contactField = name.split('.')[1];
      updatedFormData = {
        ...formData,
        createContactDto: {
          ...formData.createContactDto,
          [contactField]: value
        }
      };
    } else {
      updatedFormData = {
        ...formData,
        [name]: value
      };
    }

    setFormData(updatedFormData);

    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    onInputChange(e);
  };

  // Working hours change handler
  const handleWorkingHourChange = (dayIndex: number, field: keyof CreateBranchWorkingHourCoreDto, value: any) => {
    if (!formData.createBranchWorkingHourCoreDto) return;

    const updatedFormData = {
      ...formData,
      createBranchWorkingHourCoreDto: formData.createBranchWorkingHourCoreDto.map((day, index) => {
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
      })
    };

    setFormData(updatedFormData);
    onWorkingHourChange(dayIndex, field, value);
  };

  // Logo upload handlers
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
      const responseUrl = await mediaService.uploadFile(uploadFile);

      setFormData(prev => ({
        ...prev,
        branchLogoPath: responseUrl
      }));

      setBranchLogo(null);
    } catch (error) {
      console.error('Logo upload error:', error);
    } finally {
      setIsUploadingLogo(false);
    }
  };

  // Step navigation
  const handleNextStep = () => {
    if (validateStep(currentStep) && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Form submit
  const handleSubmit = async () => {
    if (!validateStep(3)) {
      return;
    }
    await onSubmit(formData);
  };

  // Render functions for each step
  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          {t('branchModal.sections.basicInfo')}
        </h4>
        <div className="space-y-6">
          <div>
            <label htmlFor="branchName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('branchModal.fields.branchName.label')}
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
                  formErrors.branchName
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}
                placeholder={t('branchModal.fields.branchName.placeholder')}
              />
            </div>
            {formErrors.branchName && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.branchName}</p>
            )}
          </div>

          <div>
            <label htmlFor="whatsappOrderNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('branchModal.fields.whatsappNumber.label')}
            </label>
            <div className="relative">
              <Phone className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`} />
              <input
                type="tel"
                id="whatsappOrderNumber"
                name="whatsappOrderNumber"
                value={formData.whatsappOrderNumber || ''}
                onChange={handleInputChange}
                className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                  formErrors.whatsappOrderNumber
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}
                placeholder={t('branchModal.fields.whatsappNumber.placeholder')}
              />
            </div>
            {formErrors.whatsappOrderNumber && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.whatsappOrderNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('branchModal.fields.branchLogo.label')}
            </label>
            <div className="space-y-4">
              {(branchLogoPreview || formData.branchLogoPath) && (
                <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                  <img
                    src={branchLogoPreview || formData.branchLogoPath || ''}
                    alt={t('branchModal.fields.branchLogo.preview')}
                    className="w-24 h-24 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600"
                  />
                  {formData.branchLogoPath && (
                    <div className="text-sm text-green-600 dark:text-green-400">
                      {t('branchModal.fields.branchLogo.success')}
                    </div>
                  )}
                </div>
              )}

              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
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
                  <Upload className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {isUploadingLogo ? t('branchModal.fields.branchLogo.uploading') : t('branchModal.fields.branchLogo.select')}
                </label>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('branchModal.fields.branchLogo.supportText')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          {t('branchModal.sections.addressInfo')}
        </h4>
        <div className="space-y-6">
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('branchModal.fields.country.label')}
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="country"
                name="address.country"
                value={formData.createAddressDto.country || ''}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                  formErrors['address.country']
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                placeholder={t('branchModal.fields.country.placeholder')}
              />
            </div>
            {formErrors['address.country'] && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors['address.country']}</p>
            )}
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('branchModal.fields.city.label')}
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="city"
                name="address.city"
                value={formData.createAddressDto.city || ''}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                  formErrors['address.city']
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                placeholder={t('branchModal.fields.city.placeholder')}
              />
            </div>
            {formErrors['address.city'] && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors['address.city']}</p>
            )}
          </div>

          <div>
            <label htmlFor="street" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('branchModal.fields.street.label')}
            </label>
            <div className="relative">
              <MapPinned className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="street"
                name="address.street"
                value={formData.createAddressDto.street || ''}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                  formErrors['address.street']
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                placeholder={t('branchModal.fields.street.placeholder')}
              />
            </div>
            {formErrors['address.street'] && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors['address.street']}</p>
            )}
          </div>

          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('branchModal.fields.zipCode.label')}
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="zipCode"
                name="address.zipCode"
                value={formData.createAddressDto.zipCode || ''}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                  formErrors['address.zipCode']
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                placeholder={t('branchModal.fields.zipCode.placeholder')}
              />
            </div>
            {formErrors['address.zipCode'] && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors['address.zipCode']}</p>
            )}
          </div>

          <div>
            <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('branchModal.fields.addressLine1.label')}
            </label>
            <div className="relative">
              <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="addressLine1"
                name="address.addressLine1"
                value={formData.createAddressDto.addressLine1 || ''}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                  formErrors['address.addressLine1']
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                placeholder={t('branchModal.fields.addressLine1.placeholder')}
              />
            </div>
            {formErrors['address.addressLine1'] && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors['address.addressLine1']}</p>
            )}
          </div>

          <div>
            <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('branchModal.fields.addressLine2.label')}
            </label>
            <div className="relative">
              <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="addressLine2"
                name="address.addressLine2"
                value={formData.createAddressDto.addressLine2 || ''}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder={t('branchModal.fields.addressLine2.placeholder')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          {t('branchModal.sections.contactInfo')}
        </h4>
        <div className="space-y-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('branchModal.fields.phone.label')}
            </label>
            <div className="relative">
              <Phone className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`} />
              <input
                type="tel"
                id="phone"
                name="contact.phone"
                value={formData.createContactDto.phone || ''}
                onChange={handleInputChange}
                className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                  formErrors['contact.phone']
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}
                placeholder={t('branchModal.fields.phone.placeholder')}
              />
            </div>
            {formErrors['contact.phone'] && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors['contact.phone']}</p>
            )}
          </div>

          <div>
            <label htmlFor="mail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('branchModal.fields.email.label')}
            </label>
            <div className="relative">
              <Mail className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`} />
              <input
                type="email"
                id="mail"
                name="contact.mail"
                value={formData.createContactDto.mail || ''}
                onChange={handleInputChange}
                className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                  formErrors['contact.mail']
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}
                placeholder={t('branchModal.fields.email.placeholder')}
              />
            </div>
            {formErrors['contact.mail'] && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors['contact.mail']}</p>
            )}
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('branchModal.fields.location.label')}
            </label>
            <div className="relative">
              <MapPin className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`} />
              <input
                type="text"
                id="location"
                name="contact.location"
                value={formData.createContactDto.location || ''}
                onChange={handleInputChange}
                className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                  formErrors['contact.location']
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}
                placeholder={t('branchModal.fields.location.placeholder')}
              />
            </div>
            {formErrors['contact.location'] && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors['contact.location']}</p>
            )}
          </div>

          <div>
            <label htmlFor="contactHeader" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('branchModal.fields.contactHeader.label')}
            </label>
            <input
              type="text"
              id="contactHeader"
              name="contact.contactHeader"
              value={formData.createContactDto.contactHeader || ''}
              onChange={handleInputChange}
              className="w-full py-3 px-4 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder={t('branchModal.fields.contactHeader.placeholder')}
            />
          </div>

          <div>
            <label htmlFor="footerTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('branchModal.fields.footerTitle.label')}
            </label>
            <input
              type="text"
              id="footerTitle"
              name="contact.footerTitle"
              value={formData.createContactDto.footerTitle || ''}
              onChange={handleInputChange}
              className="w-full py-3 px-4 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder={t('branchModal.fields.footerTitle.placeholder')}
            />
          </div>

          <div>
            <label htmlFor="footerDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('branchModal.fields.footerDescription.label')}
            </label>
            <input
              type="text"
              id="footerDescription"
              name="contact.footerDescription"
              value={formData.createContactDto.footerDescription || ''}
              onChange={handleInputChange}
              className="w-full py-3 px-4 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder={t('branchModal.fields.footerDescription.placeholder')}
            />
          </div>

          <div>
            <label htmlFor="openTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('branchModal.fields.openTitle.label')}
            </label>
            <input
              type="text"
              id="openTitle"
              name="contact.openTitle"
              value={formData.createContactDto.openTitle || ''}
              onChange={handleInputChange}
              className="w-full py-3 px-4 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder={t('branchModal.fields.openTitle.placeholder')}
            />
          </div>

          <div>
            <label htmlFor="openDays" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('branchModal.fields.openDays.label')}
            </label>
            <input
              type="text"
              id="openDays"
              name="contact.openDays"
              value={formData.createContactDto.openDays || ''}
              onChange={handleInputChange}
              className="w-full py-3 px-4 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder={t('branchModal.fields.openDays.placeholder')}
            />
          </div>

          <div>
            <label htmlFor="openHours" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('branchModal.fields.openHours.label')}
            </label>
            <input
              type="text"
              id="openHours"
              name="contact.openHours"
              value={formData.createContactDto.openHours || ''}
              onChange={handleInputChange}
              className="w-full py-3 px-4 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder={t('branchModal.fields.openHours.placeholder')}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
          <Clock className="h-6 w-6 text-primary-600" />
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('branchModal.sections.workingHours')}
          </h4>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('branchModal.workingHours.description')}
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
                <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                  <div className="min-w-[100px]">
                    <span className="text-base font-medium text-gray-900 dark:text-gray-100">
                      {dayNamesDisplay[day.dayOfWeek === 0 ? 6 : day.dayOfWeek - 1]}
                    </span>
                  </div>

                  <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                    <Toggle
                      checked={day.isWorkingDay}
                      onChange={(checked) => handleWorkingHourChange(index, 'isWorkingDay', checked)}
                    />
                    <span
                      className={`text-sm font-medium transition-colors ${
                        day.isWorkingDay
                          ? 'text-green-700 dark:text-green-400'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {day.isWorkingDay ? t('branchModal.workingHours.open') : t('branchModal.workingHours.closed')}
                    </span>
                  </div>
                </div>

                <div
                  className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} transition-opacity ${
                    !day.isWorkingDay ? 'opacity-40' : ''
                  }`}
                >
                  <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      {t('branchModal.workingHours.openTime')}
                    </label>
                    <input
                      title="time"
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

                  <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      {t('branchModal.workingHours.closeTime')}
                    </label>
                    <input
                      title="time"
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

              {day.isWorkingDay && (
                <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-700/50">
                  <p className="text-xs text-green-600 dark:text-green-400">
                    {t('branchModal.workingHours.canOrder')}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
          <div className={`flex items-start ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                {t('branchModal.workingHours.infoTitle')}
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {t('branchModal.workingHours.infoText')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-6xl h-[95vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {formData.branchName ? t('branchModal.title.edit') : t('branchModal.title.add')}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t('branchModal.subtitle')}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <nav aria-label="Progress">
            <ol role="list" className="flex items-center">
              {[
                { id: 1, name: t('branchModal.steps.basic'), icon: Building2 },
                { id: 2, name: t('branchModal.steps.address'), icon: MapPin },
                { id: 3, name: t('branchModal.steps.contact'), icon: Clock }
              ].map((step, stepIdx) => {
                const StepIcon = step.icon;
                const isClickable = currentStep >= step.id;
                return (
                  <li
                    key={step.name}
                    className={`relative ${stepIdx !== 2 ? (isRTL ? 'pl-8 sm:pl-20' : 'pr-8 sm:pr-20') : ''}`}
                  >
                    <div className="flex items-center">
                      <button
                        type="button"
                        disabled={!isClickable}
                        onClick={() => isClickable && setCurrentStep(step.id)}
                        className={`focus:outline-none transition-shadow duration-200 rounded-full ${isClickable ? 'hover:shadow-lg' : ''}`}
                        aria-label={step.name}
                      >
                        <div
                          className={`${
                            currentStep >= step.id
                              ? 'bg-primary-600 border-primary-600'
                              : 'bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                          } rounded-full transition-colors duration-200 h-10 w-10 flex items-center justify-center border-2`}
                        >
                          <StepIcon
                            className={`w-5 h-5 ${
                              currentStep >= step.id ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                            }`}
                          />
                        </div>
                      </button>
                      <div
                        className={`hidden sm:block text-sm font-medium ${
                          currentStep >= step.id ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'
                        } ${isRTL ? 'mr-3' : 'ml-3'}`}
                      >
                        {step.name}
                      </div>
                      {stepIdx !== 2 && (
                        <div
                          className={`hidden sm:block absolute top-5 ${isRTL ? 'left-0' : 'right-0'} w-20 h-0.5 transition-colors duration-200 ${
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

        <div className="flex-1 overflow-y-auto p-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>

        <div className="flex justify-between items-center p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <button
            type="button"
            onClick={currentStep === 1 ? onClose : handlePreviousStep}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            {currentStep === 1 ? <X className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} /> : (isRTL ? <ArrowRight className="w-4 h-4 ml-2" /> : <ArrowLeft className="w-4 h-4 mr-2" />)}
            {currentStep === 1 ? t('branchModal.buttons.cancel') : t('branchModal.buttons.back')}
          </button>
          <button
            type="button"
            onClick={currentStep === 3 ? handleSubmit : handleNextStep}
            className="inline-flex items-center px-4 py-2 text-sm fonßt-medium rounded-md bg-primary-600 text-white hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {currentStep === 3 ? (isSubmitting ? t('branchModal.buttons.saving') : t('branchModal.buttons.save')) : t('branchModal.buttons.next')}
            {currentStep === 3 ? <></> : (isRTL ? <ArrowLeft className="w-4 h-4 ml-2" /> : <ArrowRight className="w-4 h-4 ml-2" />)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BranchModal;