import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';
import { BranchInfo, BranchesResponse, CreateBranchWithDetailsDto, CreateBranchWorkingHourCoreDto, BranchDetailResponse } from '../../../types/api';
import { branchService } from '../../../services/branchService';
import { getRestaurantIdFromToken } from '../../../utils/http';
import BranchCard from './branch-management/BranchCard';
import BranchModal from './branch-management/BranchModal';
import AddBranchCard from './branch-management/AddBranchCard';
import { logger } from '../../../utils/logger';

interface BranchFormData extends CreateBranchWithDetailsDto {
  createBranchWorkingHourCoreDto: CreateBranchWorkingHourCoreDto[];
}

const BranchManagement: React.FC = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const [branches, setBranches] = useState<BranchInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingBranch, setEditingBranch] = useState<BranchDetailResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState<BranchInfo | null>(null);

  const defaultWorkingHours: CreateBranchWorkingHourCoreDto[] = [
    { dayOfWeek: 1, openTime: '08:00:00', closeTime: '22:00:00', isWorkingDay: true }, // Pazartesi
    { dayOfWeek: 2, openTime: '08:00:00', closeTime: '22:00:00', isWorkingDay: true }, // Salı
    { dayOfWeek: 3, openTime: '08:00:00', closeTime: '22:00:00', isWorkingDay: true }, // Çarşamba
    { dayOfWeek: 4, openTime: '08:00:00', closeTime: '22:00:00', isWorkingDay: true }, // Perşembe
    { dayOfWeek: 5, openTime: '08:00:00', closeTime: '22:00:00', isWorkingDay: true }, // Cuma
    { dayOfWeek: 6, openTime: '08:00:00', closeTime: '22:00:00', isWorkingDay: true }, // Cumartesi
    { dayOfWeek: 0, openTime: '08:00:00', closeTime: '22:00:00', isWorkingDay: true }  // Pazar
  ];

  const getEmptyFormData = (): BranchFormData => {
    const restaurantId = getRestaurantIdFromToken();
    return {
      branchName: null,
      whatsappOrderNumber: null,
      restaurantId: restaurantId || 0,
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
      createBranchWorkingHourCoreDto: defaultWorkingHours,
    };
  };

  const [formData, setFormData] = useState<BranchFormData>(getEmptyFormData());
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Sadece component mount olduğunda bir kez çalışsın
    logger.info('BranchManagement component mount oldu', null, { prefix: 'BranchManagement' });
    
    // Token kontrolü
    const token = localStorage.getItem('token');
    if (!token) {
      logger.error('Token bulunamadı', null, { prefix: 'BranchManagement' });
      setError('Oturum bilgisi bulunamadı. Lütfen tekrar giriş yapın.');
      return;
    }
    
    // Restaurant ID kontrolü
    const restaurantId = getRestaurantIdFromToken();
    if (!restaurantId) {
      logger.error('Restaurant ID bulunamadı', null, { prefix: 'BranchManagement' });
      setError('Restaurant bilgisi bulunamadı.');
      return;
    }
    
    logger.info(`Restaurant ID: ${restaurantId} ile şube listesi isteniyor`, null, { prefix: 'BranchManagement' });
    fetchBranches();
  }, []); // branchIsOpenFilter kaldırıldı

  const fetchBranches = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      logger.info('Şube listesi alınıyor...', null, { prefix: 'BranchManagement' });
      const branchesData = await branchService.getBranches();
      logger.info(`Şube listesi alındı, toplam: ${branchesData.length}`, branchesData, { prefix: 'BranchManagement' });
      setBranches(branchesData);
    } catch (err: any) {
      logger.error('Şube listesi alınırken hata', err, { prefix: 'BranchManagement' });
      const errorMessage = err?.message || t('branchManagement.error.loadFailed');
      setError(errorMessage);
      
      // Kullanıcıya daha detaylı hata mesajı göster
      if (err?.message?.includes('Oturum')) {
        // Token hatası varsa kullanıcıyı login sayfasına yönlendir
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof CreateBranchWithDetailsDto] as any),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    setHasChanges(true);
  };

  const handleWorkingHourChange = (dayIndex: number, field: keyof CreateBranchWorkingHourCoreDto, value: any) => {
    setFormData(prev => ({
      ...prev,
      createBranchWorkingHourCoreDto: prev.createBranchWorkingHourCoreDto
        ? prev.createBranchWorkingHourCoreDto.map((hours: CreateBranchWorkingHourCoreDto, idx: number) =>
            idx === dayIndex ? Object.assign({}, hours, { [field]: value }) : hours
          )
        : []
    }));
    setHasChanges(true);
  };

  const handleSubmit = async (data: CreateBranchWithDetailsDto) => {
    setIsSubmitting(true);
    try {
      // RestaurantId kontrolü
      const restaurantId = getRestaurantIdFromToken();
      if (!restaurantId) {
        setError(t('branchManagement.error.restaurantIdNotFound'));
        return;
      }

      // Onboarding'deki gibi API schema'sına göre data dönüştür
      const transformedData: CreateBranchWithDetailsDto = {
        branchName: data.branchName?.trim() || null,
        whatsappOrderNumber: data.whatsappOrderNumber?.trim() || null,
        restaurantId: restaurantId,
        branchLogoPath: data.branchLogoPath || null, // Boş string yerine null gönder
        createAddressDto: {
          country: data.createAddressDto.country?.trim() || null,
          city: data.createAddressDto.city?.trim() || null,
          street: data.createAddressDto.street?.trim() || null,
          zipCode: data.createAddressDto.zipCode?.trim() || null,
          addressLine1: data.createAddressDto.addressLine1?.trim() || null,
          addressLine2: data.createAddressDto.addressLine2?.trim() || null,
        },
        createContactDto: {
          phone: data.createContactDto.phone?.trim() || null,
          mail: data.createContactDto.mail?.trim() || null,
          location: data.createContactDto.location?.trim() || null,
          contactHeader: data.createContactDto.contactHeader?.trim() || null,
          footerTitle: data.createContactDto.footerTitle?.trim() || null,
          footerDescription: data.createContactDto.footerDescription?.trim() || null,
          openTitle: data.createContactDto.openTitle?.trim() || null,
          openDays: data.createContactDto.openDays?.trim() || null,
          openHours: data.createContactDto.openHours?.trim() || null,
        },
        createBranchWorkingHourCoreDto: data.createBranchWorkingHourCoreDto?.map(hour => ({
          dayOfWeek: hour.dayOfWeek, // 0-6 enum değeri
          openTime: hour.openTime, // "HH:mm:ss" formatı
          closeTime: hour.closeTime, // "HH:mm:ss" formatı  
          isWorkingDay: hour.isWorkingDay
        })) || null
      };

      // Transformed data ready for submission

      if (isEditMode && editingBranch) {
        await branchService.updateBranch(editingBranch.branchId, transformedData);
      } else {
        // Onboarding'deki gibi aynı schema ile /api/Branches endpoint'ine post et
        await branchService.createBranch(transformedData);
      }
      await fetchBranches();
      handleCloseModal();
    } catch (err) {
      setError(isEditMode ? t('branchManagement.error.updateFailed') : t('branchManagement.error.createFailed'));
      console.error('Error submitting branch:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditBranch = async (branch: BranchInfo) => {
    try {
      // Branch detaylarını API'den al
      const branchDetail = await branchService.getBranchById(branch.branchId);
      if (branchDetail) {
        setEditingBranch(branchDetail);
        setFormData({
          branchName: branchDetail.branchName,
          whatsappOrderNumber: branchDetail.whatsappOrderNumber || null,
          restaurantId: branchDetail.restaurantId,
          branchLogoPath: branchDetail.branchLogoPath || null,
          createAddressDto: branchDetail.address ? {
            country: branchDetail.address.country || null,
            city: branchDetail.address.city || null,
            street: branchDetail.address.street || null,
            zipCode: branchDetail.address.zipCode || null,
            addressLine1: branchDetail.address.addressLine1 || null,
            addressLine2: branchDetail.address.addressLine2 || null,
          } : getEmptyFormData().createAddressDto,
          createContactDto: branchDetail.contact ? {
            phone: branchDetail.contact.phone || null,
            mail: branchDetail.contact.mail || null,
            location: branchDetail.contact.location || null,
            contactHeader: branchDetail.contact.contactHeader || null,
            footerTitle: branchDetail.contact.footerTitle || null,
            footerDescription: branchDetail.contact.footerDescription || null,
            openTitle: branchDetail.contact.openTitle || null,
            openDays: branchDetail.contact.openDays || null,
            openHours: branchDetail.contact.openHours || null,
          } : getEmptyFormData().createContactDto,
          createBranchWorkingHourCoreDto: branchDetail.workingHours?.map(wh => ({
            dayOfWeek: wh.dayOfWeek as any,
            openTime: wh.openTime,
            closeTime: wh.closeTime,
            isWorkingDay: wh.isWorkingDay
          })) || defaultWorkingHours,
        });
        setIsEditMode(true);
        setIsModalOpen(true);
        setHasChanges(false);
      }
    } catch (err) {
      setError(t('dashboard.branches.error.detailsLoadFailed'));
      console.error('Error loading branch details:', err);
    }
  };

  const handleDeleteBranch = (branch: BranchInfo) => {
    setBranchToDelete(branch);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!branchToDelete) return;
    try {
      await branchService.deleteBranch(branchToDelete.branchId);
      await fetchBranches();
      setShowDeleteConfirm(false);
      setBranchToDelete(null);
    } catch (err) {
      setError(t('dashboard.branches.error.deleteFailed'));
      console.error('Error deleting branch:', err);
    }
  };

  const handleAddBranch = () => {
    setFormData(getEmptyFormData());
    setIsEditMode(false);
    setEditingBranch(null);
    setIsModalOpen(true);
    setHasChanges(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingBranch(null);
    setFormData(getEmptyFormData());
    setHasChanges(false);
  };

  const handleToggleTemporaryClose = async (branchId: number, isTemporarilyClosed: boolean) => {
    // İlgili branch'ın mevcut isOpenNow değerini bul
    const branch = branches.find(b => b.branchId === branchId);
    const isOpenNow = branch ? branch.isOpenNow : false;
    try {
      // Optimistic update - UI'yi hemen güncelle
      setBranches(prev => prev.map(branch => 
        branch.branchId === branchId 
          ? { ...branch, isTemporarilyClosed } 
          : branch
      ));

      // API çağrısı
      await branchService.toggleTemporaryClose(branchId, isTemporarilyClosed, isOpenNow);
      
      // Başarılı güncelleme - zaten UI güncellenmiş
    } catch (err: any) {
      // Hata durumunda UI'yi geri al
      setBranches(prev => prev.map(branch => 
        branch.branchId === branchId 
          ? { ...branch, isTemporarilyClosed: !isTemporarilyClosed } 
          : branch
      ));
      
      // Kullanıcıya anlamlı hata mesajı göster
      const errorMessage = err?.message || t('dashboard.branches.error.statusUpdateFailed');
      setError(errorMessage);
      
      // 3 saniye sonra hata mesajını temizle
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className={`min-h-screen ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('branchManagement.title')}
          </h1>
          <p className="text-gray-600">
            {t('branchManagement.description')}
          </p>
        </div>

        {/* Error mesajı */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <p className="font-semibold">Hata:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Loading durumu */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Şubeler yükleniyor...</span>
          </div>
        )}

        {/* Şube listesi */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Yeni şube ekleme kartı */}
            <AddBranchCard onClick={handleAddBranch} />
            
            {/* Mevcut şubeler */}
            {branches.map((branch) => (
              <BranchCard
                key={branch.branchId}
                branch={branch}
                onEdit={handleEditBranch}
                onDelete={handleDeleteBranch}
                onToggleTemporaryClose={handleToggleTemporaryClose}
              />
            ))}
          </div>
        )}

        {/* Şube yoksa mesaj */}
        {!isLoading && !error && branches.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('branchManagement.noBranches.title')}
            </h3>
            <p className="text-gray-500 mb-4">
              {t('branchManagement.noBranches.description')}
            </p>
            <button
              onClick={handleAddBranch}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {t('branchManagement.addBranch')}
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      <BranchModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        editingBranch={editingBranch}
        isSubmitting={isSubmitting}
        hasChanges={hasChanges}
        onInputChange={handleInputChange}
        onWorkingHourChange={handleWorkingHourChange}
      />

      {/* Silme onay modalı */}
      {showDeleteConfirm && branchToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {t('branchManagement.deleteConfirm.title')}
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                {t('branchManagement.deleteConfirm.description', { branchName: branchToDelete.branchName })}
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {t('common.delete')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchManagement; 