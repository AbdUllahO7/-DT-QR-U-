import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, MapPin, Phone, Clock, Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { 
  BranchDetailResponse, 
  BranchEditFormData, 
  CreateBranchWorkingHourCoreDto,
  CreateBranchWithDetailsDto
} from '../../../../types/api';
import { mediaService } from '../../../../services/mediaService';
import { logger } from '../../../../utils/logger';

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
  isSubmitting
}) => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  
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

  const dayNames = [
    'Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'
  ];

  // Initialize form data when branch detail changes
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

  // Validation function
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.branchName?.trim()) {
      errors.branchName = 'Şube adı gereklidir';
    }

    // Check if at least one working day is selected
    const hasWorkingDay = formData.createBranchWorkingHourCoreDto?.some(day => day.isWorkingDay);
    if (!hasWorkingDay) {
      errors.workingHours = 'En az bir çalışma günü seçmelisiniz';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    
    // Clear validation error for the field being edited
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleWorkingHourChange = (dayIndex: number, field: keyof CreateBranchWorkingHourCoreDto, value: any) => {
    setFormData(prev => ({
      ...prev,
      createBranchWorkingHourCoreDto: prev.createBranchWorkingHourCoreDto.map((hours, idx) =>
        idx === dayIndex ? { ...hours, [field]: value } : hours
      )
    }));
    setHasChanges(true);
    
    // Clear working hours validation error
    if (validationErrors.workingHours) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.workingHours;
        return newErrors;
      });
    }
  };

  // Image upload handlers
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Lütfen geçerli bir resim dosyası seçin');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Dosya boyutu 5MB\'dan küçük olmalıdır');
      return;
    }

    setUploadError(null);
    setIsUploadingImage(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload file
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
      setUploadError('Resim yüklenirken hata oluştu. Lütfen tekrar deneyin.');
      // Reset preview on error
      setImagePreview(formData.branchLogoPath);
    } finally {
      setIsUploadingImage(false);
      // Clear the file input
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
      setUploadError('Resim silinirken hata oluştu.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Switch to the tab with the first error
      if (validationErrors.branchName) setActiveTab('general');
      if (validationErrors.workingHours) setActiveTab('workingHours');
      return;
    }

    // Convert form data to API format
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
      createBranchWorkingHourCoreDto: formData.createBranchWorkingHourCoreDto
    };

    await onSubmit(submitData);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative top-4 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white m-4"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-900">
                  Şube Düzenle - {branchDetail.branchName}
                </h3>
                <p className="text-sm text-gray-500">
                  Şube bilgilerini düzenleyin
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              {[
                { 
                  id: 'general', 
                  label: 'Genel Bilgiler', 
                  icon: <Building2 className="w-4 h-4" />,
                  hasError: !!validationErrors.branchName
                },
                { 
                  id: 'address', 
                  label: 'Adres', 
                  icon: <MapPin className="w-4 h-4" />,
                  hasError: false
                },
                { 
                  id: 'contact', 
                  label: 'İletişim', 
                  icon: <Phone className="w-4 h-4" />,
                  hasError: false
                },
                { 
                  id: 'workingHours', 
                  label: 'Çalışma Saatleri', 
                  icon: <Clock className="w-4 h-4" />,
                  hasError: !!validationErrors.workingHours
                }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : tab.hasError
                      ? 'border-red-300 text-red-600 hover:text-red-700'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.hasError && (
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Şube Adı *
                  </label>
                  <input
                    type="text"
                    name="branchName"
                    value={formData.branchName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                      validationErrors.branchName 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="Şube adını girin"
                  />
                  {validationErrors.branchName && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.branchName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    WhatsApp Sipariş Numarası
                  </label>
                  <input
                    type="text"
                    name="whatsappOrderNumber"
                    value={formData.whatsappOrderNumber || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="WhatsApp numarasını girin"
                  />
                </div>

                {/* Logo Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Şube Logosu
                  </label>
                  
                  {/* Current Logo Display */}
                  {imagePreview && (
                    <div className="mb-4">
                      <div className="relative inline-block">
                        <img
                          src={imagePreview}
                          alt="Şube logosu"
                          className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300 shadow-sm"
                        />
                        {!isUploadingImage && (
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            title="Logoyu kaldır"
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
                    <div className="flex items-center space-x-4">
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
                        className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                          isUploadingImage ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                      >
                        {isUploadingImage ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                            Yükleniyor...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            {imagePreview ? 'Logo Değiştir' : 'Logo Yükle'}
                          </>
                        )}
                      </label>
                      
                      {!imagePreview && !isUploadingImage && (
                        <div className="flex items-center text-gray-400">
                          <ImageIcon className="h-5 w-5 mr-2" />
                          <span className="text-sm">Logo seçilmedi</span>
                        </div>
                      )}
                    </div>

                    {uploadError && (
                      <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
                        {uploadError}
                      </div>
                    )}

                    <p className="text-sm text-gray-500">
                      JPG, PNG veya GIF formatında, maksimum 5MB boyutunda dosya yükleyebilirsiniz.
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ülke
                    </label>
                    <input
                      type="text"
                      name="createAddressDto.country"
                      value={formData.createAddressDto.country || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ülke adını girin"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Şehir
                    </label>
                    <input
                      type="text"
                      name="createAddressDto.city"
                      value={formData.createAddressDto.city || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Şehir adını girin"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sokak
                  </label>
                  <input
                    type="text"
                    name="createAddressDto.street"
                    value={formData.createAddressDto.street || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Sokak adını girin"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Posta Kodu
                    </label>
                    <input
                      type="text"
                      name="createAddressDto.zipCode"
                      value={formData.createAddressDto.zipCode || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Posta kodunu girin"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adres Satırı 1
                    </label>
                    <input
                      type="text"
                      name="createAddressDto.addressLine1"
                      value={formData.createAddressDto.addressLine1 || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Adres detayını girin"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adres Satırı 2
                  </label>
                  <input
                    type="text"
                    name="createAddressDto.addressLine2"
                    value={formData.createAddressDto.addressLine2 || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ek adres bilgisi (opsiyonel)"
                  />
                </div>
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      name="createContactDto.phone"
                      value={formData.createContactDto.phone || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Telefon numarasını girin"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      E-posta
                    </label>
                    <input
                      type="email"
                      name="createContactDto.mail"
                      value={formData.createContactDto.mail || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="E-posta adresini girin"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Konum
                  </label>
                  <input
                    type="text"
                    name="createContactDto.location"
                    value={formData.createContactDto.location || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Konum bilgisini girin"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    İletişim Başlığı
                  </label>
                  <input
                    type="text"
                    name="createContactDto.contactHeader"
                    value={formData.createContactDto.contactHeader || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="İletişim başlığını girin"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Footer Başlığı
                    </label>
                    <input
                      type="text"
                      name="createContactDto.footerTitle"
                      value={formData.createContactDto.footerTitle || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Footer başlığını girin"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Açık Başlığı
                    </label>
                    <input
                      type="text"
                      name="createContactDto.openTitle"
                      value={formData.createContactDto.openTitle || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Açık başlığını girin"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Footer Açıklaması
                  </label>
                  <textarea
                    name="createContactDto.footerDescription"
                    value={formData.createContactDto.footerDescription || ''}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Footer açıklamasını girin"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Açık Günler
                    </label>
                    <input
                      type="text"
                      name="createContactDto.openDays"
                      value={formData.createContactDto.openDays || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Açık günleri girin"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Açık Saatler
                    </label>
                    <input
                      type="text"
                      name="createContactDto.openHours"
                      value={formData.createContactDto.openHours || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Açık saatleri girin"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Working Hours Tab */}
            {activeTab === 'workingHours' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Clock className="h-6 w-6 text-blue-600" />
                  <h4 className="text-lg font-medium text-gray-900">Çalışma Saatleri</h4>
                </div>
                
                {validationErrors.workingHours && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                    <p className="text-sm text-red-600">{validationErrors.workingHours}</p>
                  </div>
                )}
                
                {formData.createBranchWorkingHourCoreDto.map((hours, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-md">
                    <div className="w-24">
                      <span className="text-sm font-medium text-gray-700">
                        {dayNames[hours.dayOfWeek]}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                         title='isWorkingDay'
                        type="checkbox"
                        checked={hours.isWorkingDay}
                        onChange={(e) => handleWorkingHourChange(index, 'isWorkingDay', e.target.checked)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-600">Açık</span>
                    </div>

                    {hours.isWorkingDay && (
                      <>
                        <div>
                          <input
                            title='time'
                            type="time"
                            value={hours.openTime}
                            onChange={(e) => handleWorkingHourChange(index, 'openTime', e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                          />
                        </div>
                        <span className="text-gray-500">-</span>
                        <div>
                          <input
                            title='time'
                            type="time"
                            value={hours.closeTime}
                            onChange={(e) => handleWorkingHourChange(index, 'closeTime', e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                          />
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !hasChanges || isUploadingImage}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Güncelleniyor...' : 'Güncelle'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BranchEditModal;