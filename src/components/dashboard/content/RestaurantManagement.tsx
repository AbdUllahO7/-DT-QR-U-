
import React, { useEffect, useState, useRef } from 'react';
import {
  Camera,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  Building2,
  FileText,
  Info,
  Store,
  Utensils,
  Hash,
  Building,
} from 'lucide-react';
import { restaurantService } from '../../../services/restaurantService';
import { useLogoUpload } from '../../../hooks/useLogoUpload';
import { getRestaurantIdFromToken } from '../../../utils/http';
import { logger } from '../../../utils/logger';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { RestaurantManagementInfo, CreateAboutDto } from '../../../types/api';

interface ToastState {
  show: boolean;
  type: 'success' | 'error' | 'info';
  message: string;
}

const RestaurantManagement: React.FC = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  const tabs = [
    { id: 'general', label: t('restaurantManagement.tabs.general'), icon: Building2 },
    { id: 'legal', label: t('restaurantManagement.tabs.legal'), icon: FileText },
    { id: 'about', label: t('restaurantManagement.tabs.about'), icon: Info },
  ];
  const [info, setInfo] = useState<RestaurantManagementInfo | null>(null);
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [hasAboutChanges, setHasAboutChanges] = useState(false);
  const [formData, setFormData] = useState<Partial<RestaurantManagementInfo>>({});
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [aboutFormData, setAboutFormData] = useState<CreateAboutDto>({
    imageUrl: '',
    title: '',
    description: '',
    restaurantId: 0
  });
  const [toast, setToast] = useState<ToastState>({ show: false, type: 'info', message: '' });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [aboutImageFile, setAboutImageFile] = useState<File | null>(null);

  const { uploadLogo, isUploading } = useLogoUpload();
  const fetched = useRef(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const aboutImageInputRef = useRef<HTMLInputElement>(null);

  const showToast = (type: ToastState['type'], message: string) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000);
  };

  const refreshRestaurantInfo = async () => {
    try {
      const restaurantData = await restaurantService.getRestaurantManagementInfo();
      setInfo(restaurantData);

      if (restaurantData) {
        const cleaned: any = {};
        Object.entries(restaurantData).forEach(([k, v]) => {
          cleaned[k] = v === null || v === 'string' ? '' : v;
        });
        setFormData(cleaned);
      }

      logger.info('Restaurant info refreshed successfully');
    } catch (err) {
      logger.error('Failed to refresh restaurant info', err);
      showToast('error', t('restaurantManagement.error.loadFailed'));
    }
  };

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    const fetchInfo = async () => {
      setIsLoading(true);
      try {
        const restaurantId = getRestaurantIdFromToken();
        if (!restaurantId) {
          showToast('error', t('restaurantManagement.error.userInfoFailed'));
          return;
        }

        const data = await restaurantService.getRestaurantManagementInfo();
        setInfo(data);

        if (data) {
          const cleaned: any = {};
          Object.entries(data).forEach(([k, v]) => {
            cleaned[k] = v === null || v === 'string' ? '' : v;
          });
          setFormData(cleaned);
        }

        setAboutFormData({
          imageUrl: '',
          title: '',
          description: '',
          restaurantId: restaurantId
        });

        logger.info('Restaurant management info loaded successfully');
      } catch (err) {
        logger.error('Failed to fetch restaurant management info', err);
        showToast('error', t('restaurantManagement.error.loadFailed'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchInfo();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData(prev => ({ ...prev, [name]: finalValue }));
    setHasChanges(true);
  };

  const handleAboutChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setAboutFormData(prev => ({ ...prev, [name]: value }));
    setHasAboutChanges(true);
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('error', t('restaurantManagement.error.imageValidationFailed'));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showToast('error', t('restaurantManagement.error.fileSizeError'));
        return;
      }
      setLogoFile(file);
      setHasChanges(true);
    }
  };

  const handleAboutImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('error', t('restaurantManagement.error.imageValidationFailed'));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showToast('error', t('restaurantManagement.error.fileSizeError'));
        return;
      }
      setAboutImageFile(file);
      setHasAboutChanges(true);
    }
  };

  const handleSave = async () => {
    if (!hasChanges && !logoFile) return;

    setIsLoading(true);
    try {
      let updatedFormData = { ...formData };

      if (logoFile) {
        try {
          const logoUrl = await uploadLogo(logoFile, formData.restaurantLogoPath);
          updatedFormData.restaurantLogoPath = logoUrl;
          showToast('success', t('restaurantManagement.success.logoUploaded'));
        } catch (err) {
          logger.error('Logo upload failed', err);
          showToast('error', t('restaurantManagement.error.logoUploadFailed'));
          return;
        }
      }

      await restaurantService.updateRestaurantManagementInfo(updatedFormData as any);

      setFormData(updatedFormData);
      setHasChanges(false);
      setLogoFile(null);

      logger.info('Restaurant management info updated successfully');
      showToast('success', t('restaurantManagement.success.infoUpdated'));

      await refreshRestaurantInfo();

    } catch (err) {
      logger.error('Failed to update restaurant management info', err);
      showToast('error', t('restaurantManagement.error.updateFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAbout = async () => {
    if (!aboutFormData.title?.trim() || !aboutFormData.description?.trim()) {
      showToast('error', 'Başlık ve açıklama alanları zorunludur');
      return;
    }

    setIsLoading(true);
    try {
      const restaurantId = getRestaurantIdFromToken();
      if (!restaurantId) {
        showToast('error', 'Kullanıcı bilgileri alınamadı');
        return;
      }

      let finalAboutData = { ...aboutFormData, restaurantId };

      if (aboutImageFile) {
        try {
          const imageUrl = await uploadLogo(aboutImageFile);
          finalAboutData.imageUrl = imageUrl;
        } catch (err) {
          logger.error('About image upload failed', err);
          showToast('error', 'Görsel yüklenirken hata oluştu');
          return;
        }
      }

      await restaurantService.createAbout(finalAboutData);

      logger.info('About section created successfully');
      showToast('success', 'Hakkında bölümü başarıyla eklendi');

      setAboutModalOpen(false);
      setAboutFormData({
        imageUrl: '',
        title: '',
        description: '',
        restaurantId: restaurantId
      });
      setAboutImageFile(null);
      setHasAboutChanges(false);

      await refreshRestaurantInfo();

    } catch (err) {
      logger.error('Failed to create about section', err);
      showToast('error', 'Hakkında bölümü oluşturulurken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !info) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="text-gray-600 dark:text-gray-400">{t('dashboard.restaurant.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 sm:pb-0" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('dashboard.restaurant.title')}</h2>
        {(hasChanges || hasAboutChanges) && (
          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-3 py-1.5 rounded-lg`}>
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Kaydedilmemiş değişiklikler var</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto scrollbar-hide">
        <nav className={`-mb-px flex ${isRTL ? 'space-x-reverse space-x-8' : 'space-x-8'} min-w-max`}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group inline-flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === tab.id
                  ? 'border-primary-800 text-primary-800 dark:text-primary-800'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
              >
                <Icon className={`h-5 w-5 ${activeTab === tab.id
                  ? 'text-primary-800 dark:text-primary-800'
                  : 'text-gray-400 group-hover:text-gray-500'
                  }`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        {activeTab === 'general' && (
          <div className="p-4 sm:p-6 lg:p-8 space-y-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">{t('restaurantManagement.GeneralInformation')}</h3>

            {/* Logo Upload Section - En üstte */}
            <div className="space-y-6 border-b border-gray-200 dark:border-gray-700 pb-8">
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">{t('restaurant.restaurantLogo')}</h4>
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  disabled={isUploading}
                  className={`inline-flex justify-center items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto`}
                >
                  <Camera className="h-4 w-4" />
                  <span>{isUploading ? 'Yükleniyor...' : 'Logo Yükle'}</span>
                </button>
              </div>

              <input
                title='logoInputRef'
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoFileChange}
                className="hidden"
              />

              {/* Logo Preview */}
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                {(formData.restaurantLogoPath || logoFile) && (
                  <div className="relative">
                    <img
                      src={logoFile ? URL.createObjectURL(logoFile) : formData.restaurantLogoPath}
                      alt="Restaurant Logo"
                      className="h-20 w-20 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                    />
                    {logoFile && (
                      <div className={`absolute -top-2 ${isRTL ? '-left-2' : '-right-2'} bg-green-500 text-white rounded-full p-1`}>
                        <Upload className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                )}
                {logoFile && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p className="font-medium">{logoFile.name}</p>
                    <p>{(logoFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-6 md:gap-8 md:grid-cols-2">
              {/* Restaurant Name */}
              <div>
                <label htmlFor="restaurantName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('dashboard.restaurant.restaurantName')} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Store className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`} />
                  <input
                    type="text"
                    id="restaurantName"
                    name="restaurantName"
                    value={formData.restaurantName || ''}
                    onChange={handleChange}
                    className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                    placeholder={t('dashboard.restaurant.placeholders.restaurantName')}
                    required
                  />
                </div>
              </div>

              {/* Restaurant Status - Readonly */}
              <div>
                <label htmlFor="restaurantStatus" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('dashboard.restaurant.restaurantStatus')}
                </label>
                <div className="relative">
                  <CheckCircle className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`} />
                  <select
                    id="restaurantStatus"
                    name="restaurantStatus"
                    value={formData.restaurantStatus ? 'true' : 'false'}
                    disabled
                    className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border rounded-lg transition-colors duration-200 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 cursor-not-allowed`}
                  >
                    <option value="true">Aktif</option>
                    <option value="false">Pasif</option>
                  </select>
                </div>
                <p className={`mt-1 text-xs text-gray-500 dark:text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}>
                  Bu alan sistem tarafından yönetilir
                </p>
              </div>

              {/* Cuisine Type */}
              <div>
                <label htmlFor="cuisineTypeId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mutfak Türü
                </label>
                <div className="relative">
                  <Utensils className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`} />
                  <select
                    id="cuisineTypeId"
                    name="cuisineTypeId"
                    value={formData.cuisineTypeId || ''}
                    onChange={handleChange}
                    className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  >
                    <option value="">Seçiniz</option>
                    <option value="1">Türk Mutfağı</option>
                    <option value="2">İtalyan Mutfağı</option>
                    <option value="3">Çin Mutfağı</option>
                    <option value="4">Fast Food</option>
                    <option value="5">Deniz Ürünleri</option>
                    <option value="6">Et Yemekleri</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'legal' && (
          <div className="p-4 sm:p-6 lg:p-8 space-y-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">{t('dashboard.restaurant.companyInfo')}</h3>

            <div className="grid gap-6 md:gap-8 md:grid-cols-2">
              <div>
                <label htmlFor="companyTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Şirket Ünvanı
                </label>
                <div className="relative">
                  <Building className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`} />
                  <input
                    type="text"
                    id="companyTitle"
                    name="companyTitle"
                    value={formData.companyTitle || ''}
                    onChange={handleChange}
                    className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                    placeholder="ABC Gıda A.Ş."
                  />
                </div>
              </div>

              <div>
                <label htmlFor="taxNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Vergi Numarası
                </label>
                <div className="relative">
                  <Hash className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`} />
                  <input
                    type="text"
                    id="taxNumber"
                    name="taxNumber"
                    value={formData.taxNumber || ''}
                    onChange={handleChange}
                    className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                    placeholder="1234567890"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="taxOffice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Vergi Dairesi
                </label>
                <div className="relative">
                  <Building2 className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`} />
                  <input
                    type="text"
                    id="taxOffice"
                    name="taxOffice"
                    value={formData.taxOffice || ''}
                    onChange={handleChange}
                    className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                    placeholder="İstanbul Vergi Dairesi"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="mersisNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mersis Numarası
                </label>
                <div className="relative">
                  <Hash className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`} />
                  <input
                    type="text"
                    id="mersisNumber"
                    name="mersisNumber"
                    value={formData.mersisNumber || ''}
                    onChange={handleChange}
                    className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                    placeholder="Mersis numarası"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="tradeRegistryNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ticaret Sicil Numarası
                </label>
                <div className="relative">
                  <Hash className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`} />
                  <input
                    type="text"
                    id="tradeRegistryNumber"
                    name="tradeRegistryNumber"
                    value={formData.tradeRegistryNumber || ''}
                    onChange={handleChange}
                    className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                    placeholder="Ticaret sicil numarası"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="legalType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Şirket Türü
                </label>
                <div className="relative">
                  <FileText className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`} />
                  <select
                    id="legalType"
                    name="legalType"
                    value={formData.legalType || ''}
                    onChange={handleChange}
                    className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  >
                    <option value="">Seçiniz</option>
                    <option value="Anonim Şirket">Anonim Şirket</option>
                    <option value="Limited Şirket">Limited Şirket</option>
                    <option value="Kollektif Şirket">Kollektif Şirket</option>
                    <option value="Komandit Şirket">Komandit Şirket</option>
                    <option value="Şahıs Şirketi">Şahıs Şirketi</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Hakkında Bölümü</h3>
              {!info?.about && (
                <button
                  onClick={() => setAboutModalOpen(true)}
                  className="inline-flex justify-center items-center space-x-2 px-4 py-2 text-primary-800 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200 w-full sm:w-auto"
                >
                  <Info className="h-4 w-4" />
                  <span>Hakkında Bilgisi Ekle</span>
                </button>
              )}
            </div>

            {info?.about ? (
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 sm:p-6 space-y-4">
                {typeof info.about === 'string' ? (
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{info.about}</p>
                ) : (
                  <>
                    {(info.about as any)?.title && (
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        {(info.about as any).title}
                      </h4>
                    )}

                    {(info.about as any)?.imageUrl && (
                      <div className="mb-4">
                        <img
                          src={(info.about as any).imageUrl}
                          alt={(info.about as any).title || 'Restaurant About'}
                          className="w-full max-w-md h-auto sm:h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                        />
                      </div>
                    )}

                    {(info.about as any)?.description && (
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                        {(info.about as any).description}
                      </p>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Henüz hakkında bilgisi eklenmemiş
                </p>
                <button
                  onClick={() => setAboutModalOpen(true)}
                  className="btn-primary w-full sm:w-auto"
                >
                  İlk Hakkında Bilgisini Ekle
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Fixed Save Button */}
      {(hasChanges || logoFile) && (
        <div className={`fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-auto z-10`}>
          <div className={`bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between sm:justify-start gap-4 sm:gap-4`}>
            <div className={`flex items-center space-x-2 text-orange-600 dark:text-orange-400`}>
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Değişikliklerinizi kaydedin</span>
            </div>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className={`inline-flex justify-center items-center space-x-2 px-6 py-2 text-primary-800 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200 w-full sm:w-auto`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Kaydediliyor...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>Kaydet</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* About Modal */}
      {aboutModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full mx-4 sm:mx-0">
              <div className="bg-white dark:bg-gray-800 px-6 pt-6 pb-4">
                <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t('dashboard.restaurant.addAboutInfo')}
                  </h3>
                  <button
                    onClick={() => setAboutModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Görsel</label>
                    <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                      <button
                        type="button"
                        onClick={() => aboutImageInputRef.current?.click()}
                        disabled={isUploading}
                        className={`inline-flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <Camera className="h-4 w-4" />
                        <span>{isUploading ? 'Yükleniyor...' : 'Görsel Seç'}</span>
                      </button>
                      {aboutImageFile && (
                        <span className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[150px]">
                          {aboutImageFile.name}
                        </span>
                      )}
                    </div>
                    <input
                      title='aboutImageInputRef'
                      ref={aboutImageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAboutImageFileChange}
                      className="hidden"
                    />
                    {aboutImageFile && (
                      <img
                        src={URL.createObjectURL(aboutImageFile)}
                        alt="Preview"
                        className="mt-4 h-24 w-24 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                      />
                    )}
                  </div>

                  {/* Title */}
                  <div>
                    <label htmlFor="aboutTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Başlık <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FileText className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`} />
                      <input
                        type="text"
                        id="aboutTitle"
                        name="title"
                        value={aboutFormData.title || ''}
                        onChange={handleAboutChange}
                        className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                        placeholder={t('dashboard.restaurant.placeholders.aboutStory')}
                        required
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="aboutDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Açıklama <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="aboutDescription"
                      name="description"
                      rows={4}
                      value={aboutFormData.description || ''}
                      onChange={handleAboutChange}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                      placeholder={t('dashboard.restaurant.placeholders.aboutDetails')}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className={`bg-gray-50 dark:bg-gray-900 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:gap-3`}>
                <button
                  onClick={() => setAboutModalOpen(false)}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  İptal
                </button>
                <button
                  onClick={handleCreateAbout}
                  disabled={isLoading || !aboutFormData.title?.trim() || !aboutFormData.description?.trim()}
                  className={`w-full sm:w-auto inline-flex justify-center items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} px-4 py-2 text-primary-800 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-md`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Kaydediliyor...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      <span>Kaydet</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 ${isRTL ? 'left-4' : 'right-4'} z-50 max-w-sm w-full mx-auto`}>
          <div className={`rounded-lg shadow-lg p-4 mx-4 sm:mx-0 ${toast.type === 'success'
            ? 'bg-green-100 border border-green-200 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-200'
            : toast.type === 'error'
              ? 'bg-red-100 border border-red-200 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-200'
              : 'bg-blue-100 border border-blue-200 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-200'
            }`}>
            <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
              {toast.type === 'success' && <CheckCircle className="h-5 w-5 flex-shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="h-5 w-5 flex-shrink-0" />}
              {toast.type === 'info' && <Info className="h-5 w-5 flex-shrink-0" />}
              <p className="text-sm font-medium">{toast.message}</p>
              <button
                onClick={() => setToast(prev => ({ ...prev, show: false }))}
                className={`${isRTL ? 'mr-auto' : 'ml-auto'} text-gray-400 hover:text-gray-600`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantManagement;

