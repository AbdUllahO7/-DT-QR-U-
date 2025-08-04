import React, { useState, useEffect } from 'react';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
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
import type { BranchDetailResponse, CreateBranchWithDetailsDto, CreateBranchWorkingHourCoreDto } from '../../../../types/api';
import { mediaService } from '../../../../services/mediaService';

interface BranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBranchWithDetailsDto) => Promise<void>;
  editingBranch: BranchDetailResponse | null;
  isSubmitting: boolean;
  hasChanges: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onWorkingHourChange: (dayIndex: number, field: keyof CreateBranchWorkingHourCoreDto, value: any) => void;
}

const BranchModal: React.FC<BranchModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingBranch,
  isSubmitting,
  hasChanges,
  onInputChange,
  onWorkingHourChange
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
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
      { dayOfWeek: 0, openTime: "08:00:00", closeTime: "22:00:00", isWorkingDay: true }  // Pazar
    ]
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [branchLogo, setBranchLogo] = useState<File | null>(null);
  const [branchLogoPreview, setBranchLogoPreview] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState<boolean>(false);

  const dayNamesDisplay = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

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
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  // Form validation
  const validateStep = (step: number): boolean => {
    const errors: { [key: string]: string } = {};

    if (step === 1) {
      if (!formData.branchName?.trim()) {
        errors.branchName = 'Şube adı gereklidir';
      }
      if (!formData.whatsappOrderNumber?.trim()) {
        errors.whatsappOrderNumber = 'WhatsApp sipariş numarası gereklidir';
      }
    } else if (step === 2) {
      if (!formData.createAddressDto.country?.trim()) {
        errors['address.country'] = 'Ülke gereklidir';
      }
      if (!formData.createAddressDto.city?.trim()) {
        errors['address.city'] = 'Şehir gereklidir';
      }
      if (!formData.createAddressDto.street?.trim()) {
        errors['address.street'] = 'Sokak gereklidir';
      }
      if (!formData.createAddressDto.addressLine1?.trim()) {
        errors['address.addressLine1'] = 'Adres satırı 1 gereklidir';
      }
      if (!formData.createAddressDto.zipCode?.trim()) {
        errors['address.zipCode'] = 'Posta kodu gereklidir';
      }
    } else if (step === 3) {
      if (!formData.createContactDto.phone?.trim()) {
        errors['contact.phone'] = 'Telefon numarası gereklidir';
      }
      if (!formData.createContactDto.mail?.trim()) {
        errors['contact.mail'] = 'E-posta adresi gereklidir';
      }
      if (!formData.createContactDto.location?.trim()) {
        errors['contact.location'] = 'Konum bilgisi gereklidir';
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

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Parent component'teki onInputChange'i çağır
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

    // Parent component'teki onWorkingHourChange'i çağır
    onWorkingHourChange(dayIndex, field, value);
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
      const responseUrl = await mediaService.uploadFile(uploadFile);
      
      setFormData(prev => ({
        ...prev,
        branchLogoPath: responseUrl
      }));
      
      // Reset file input
      setBranchLogo(null);
      
    } catch (error) {
      console.error('Logo yükleme hatası:', error);
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
          Temel Bilgiler
        </h4>
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
                  formErrors.branchName
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                placeholder="Şube adını girin"
              />
            </div>
            {formErrors.branchName && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.branchName}</p>
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
                  formErrors.whatsappOrderNumber
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                placeholder="WhatsApp sipariş numarasını girin"
              />
            </div>
            {formErrors.whatsappOrderNumber && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.whatsappOrderNumber}</p>
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
          Adres Bilgileri
        </h4>
        <div className="space-y-6">
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ülke *
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
                placeholder="Ülke adını girin"
              />
            </div>
            {formErrors['address.country'] && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors['address.country']}</p>
            )}
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Şehir *
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
                placeholder="Şehir adını girin"
              />
            </div>
            {formErrors['address.city'] && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors['address.city']}</p>
            )}
          </div>

          <div>
            <label htmlFor="street" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sokak *
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
                placeholder="Sokak adını girin"
              />
            </div>
            {formErrors['address.street'] && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors['address.street']}</p>
            )}
          </div>

          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Posta Kodu *
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
                placeholder="Posta kodunu girin"
              />
            </div>
            {formErrors['address.zipCode'] && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors['address.zipCode']}</p>
            )}
          </div>

          <div>
            <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Adres Satırı 1 *
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
                placeholder="Detaylı adres bilgisi girin"
              />
            </div>
            {formErrors['address.addressLine1'] && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors['address.addressLine1']}</p>
            )}
          </div>

          <div>
            <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Adres Satırı 2 (Opsiyonel)
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
                placeholder="Ek adres bilgisi girin (opsiyonel)"
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
          İletişim Bilgileri
        </h4>
        <div className="space-y-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Telefon Numarası *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                id="phone"
                name="contact.phone"
                value={formData.createContactDto.phone || ''}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                  formErrors['contact.phone']
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                placeholder="Telefon numarasını girin"
              />
            </div>
            {formErrors['contact.phone'] && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors['contact.phone']}</p>
            )}
          </div>

          <div>
            <label htmlFor="mail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              E-posta Adresi *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                id="mail"
                name="contact.mail"
                value={formData.createContactDto.mail || ''}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                  formErrors['contact.mail']
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                placeholder="E-posta adresini girin"
              />
            </div>
            {formErrors['contact.mail'] && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors['contact.mail']}</p>
            )}
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Konum Bilgisi *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="location"
                name="contact.location"
                value={formData.createContactDto.location || ''}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                  formErrors['contact.location']
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                placeholder="Konum bilgisini girin (Örn: 40.9795,28.7225)"
              />
            </div>
            {formErrors['contact.location'] && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors['contact.location']}</p>
            )}
          </div>

          <div>
            <label htmlFor="contactHeader" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              İletişim Başlığı (Opsiyonel)
            </label>
            <div className="relative">
              <Info className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="contactHeader"
                name="contact.contactHeader"
                value={formData.createContactDto.contactHeader || ''}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="İletişim başlığını girin (opsiyonel)"
              />
            </div>
          </div>

          <div>
            <label htmlFor="footerTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Footer Başlığı (Opsiyonel)
            </label>
            <div className="relative">
              <Info className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="footerTitle"
                name="contact.footerTitle"
                value={formData.createContactDto.footerTitle || ''}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Footer başlığını girin (opsiyonel)"
              />
            </div>
          </div>

          <div>
            <label htmlFor="footerDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Footer Açıklaması (Opsiyonel)
            </label>
            <div className="relative">
              <Info className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <textarea
                id="footerDescription"
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
            <label htmlFor="openTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Çalışma Saatleri Başlığı (Opsiyonel)
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="openTitle"
                name="contact.openTitle"
                value={formData.createContactDto.openTitle || ''}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Çalışma saatleri başlığını girin (opsiyonel)"
              />
            </div>
          </div>

          <div>
            <label htmlFor="openDays" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Açık Günler (Opsiyonel)
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="openDays"
                name="contact.openDays"
                value={formData.createContactDto.openDays || ''}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Açık günleri girin (opsiyonel)"
              />
            </div>
          </div>

          <div>
            <label htmlFor="openHours" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Açık Saatler (Opsiyonel)
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="openHours"
                name="contact.openHours"
                value={formData.createContactDto.openHours || ''}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Açık saatleri girin (opsiyonel)"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Working Hours */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Clock className="h-6 w-6 text-primary-600" />
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            Çalışma Saatleri
          </h4>
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

  useEffect(() => {
    if (editingBranch) {
      setFormData({
        branchName: editingBranch.branchName || '',
        whatsappOrderNumber: editingBranch.whatsappOrderNumber || '',
        restaurantId: editingBranch.restaurantId || 0,
        branchLogoPath: editingBranch.branchLogoPath || '',
        createAddressDto: {
          country: editingBranch.address?.country || '',
          city: editingBranch.address?.city || '',
          street: editingBranch.address?.street || '',
          zipCode: editingBranch.address?.zipCode || '',
          addressLine1: editingBranch.address?.addressLine1 || '',
          addressLine2: editingBranch.address?.addressLine2 || ''
        },
        createContactDto: {
          phone: editingBranch.contact?.phone || '',
          mail: editingBranch.contact?.mail || '',
          location: editingBranch.contact?.location || '',
          contactHeader: editingBranch.contact?.contactHeader || '',
          footerTitle: editingBranch.contact?.footerTitle || '',
          footerDescription: editingBranch.contact?.footerDescription || '',
          openTitle: editingBranch.contact?.openTitle || '',
          openDays: editingBranch.contact?.openDays || '',
          openHours: editingBranch.contact?.openHours || ''
        },
        createBranchWorkingHourCoreDto: editingBranch.workingHours?.map(wh => ({
          dayOfWeek: wh.dayOfWeek,
          openTime: wh.openTime,
          closeTime: wh.closeTime,
          isWorkingDay: wh.isWorkingDay
        })) || [
          { dayOfWeek: 1, openTime: '08:00:00', closeTime: '22:00:00', isWorkingDay: true },
          { dayOfWeek: 2, openTime: '08:00:00', closeTime: '22:00:00', isWorkingDay: true },
          { dayOfWeek: 3, openTime: '08:00:00', closeTime: '22:00:00', isWorkingDay: true },
          { dayOfWeek: 4, openTime: '08:00:00', closeTime: '22:00:00', isWorkingDay: true },
          { dayOfWeek: 5, openTime: '08:00:00', closeTime: '22:00:00', isWorkingDay: true },
          { dayOfWeek: 6, openTime: '08:00:00', closeTime: '22:00:00', isWorkingDay: true },
          { dayOfWeek: 0, openTime: '08:00:00', closeTime: '22:00:00', isWorkingDay: true }
        ]
      });
      if (editingBranch.branchLogoPath) {
        setBranchLogoPreview(editingBranch.branchLogoPath);
      }
    }
  }, [editingBranch]);

  if (!isOpen) return null;

  // ... (buraya stepper, step içerikleri ve butonlar gelecek)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-6xl h-[95vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editingBranch ? 'Şube Düzenle' : 'Yeni Şube Ekle'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Şube bilgilerini adım adım girebilirsiniz
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
        {/* Stepper */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <nav aria-label="Progress">
            <ol role="list" className="flex items-center">
              {[
                { id: 1, name: 'Temel Bilgiler', icon: Building2 },
                { id: 2, name: 'Adres Bilgileri', icon: MapPin },
                { id: 3, name: 'İletişim & Çalışma Saatleri', icon: Clock }
              ].map((step, stepIdx) => {
                const StepIcon = step.icon;
                const isClickable = currentStep >= step.id;
                return (
                  <li
                    key={step.name}
                    className={`relative ${stepIdx !== 2 ? 'pr-8 sm:pr-20' : ''}`}
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
                        } ml-3`}
                      >
                        {step.name}
                      </div>
                      {stepIdx !== 2 && (
                        <div
                          className={`hidden sm:block absolute top-5 right-0 w-20 h-0.5 transition-colors duration-200 ${
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
        {/* İçerik Alanı */}
        <div className="flex-1 overflow-y-auto p-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>
        {/* Stepper Butonları */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <button
            type="button"
            onClick={currentStep === 1 ? onClose : handlePreviousStep}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            {currentStep === 1 ? <X className="w-4 h-4 mr-2" /> : <ArrowLeft className="w-4 h-4 mr-2" />}
            {currentStep === 1 ? 'İptal' : 'Geri'}
          </button>
          <button
            type={currentStep === 3 ? 'button' : 'button'}
            onClick={currentStep === 3 ? handleSubmit : handleNextStep}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-primary-600 text-white hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {currentStep === 3 ? (isSubmitting ? 'Kaydediliyor...' : 'Kaydet') : 'İleri'}
            {currentStep === 3 ? <></> : <ArrowRight className="w-4 h-4 ml-2" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BranchModal; 