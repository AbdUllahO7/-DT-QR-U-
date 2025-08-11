import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, AlertTriangle, Plus } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { 
  BranchInfo, 
  CreateBranchWithDetailsDto, 
  CreateBranchWorkingHourCoreDto,
  BranchDetailResponse,
} from '../../../types/api';
import { branchService } from '../../../services/branchService';
import { getRestaurantIdFromToken } from '../../../utils/http';
import BranchCard from './branch-management/BranchCard';
import BranchModal from './branch-management/BranchModal';
import BranchEditModal from './branch-management/BranchEditModal';
import AddBranchCard from './branch-management/AddBranchCard';
import { logger } from '../../../utils/logger';
import { ConfirmDeleteModal } from '../../ConfirmDeleteModal';

const BranchManagement: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [branches, setBranches] = useState<BranchInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingBranch, setEditingBranch] = useState<BranchDetailResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete confirmation modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState<BranchInfo | null>(null);
  const [isDeletingBranch, setIsDeletingBranch] = useState(false);

  const defaultWorkingHours: CreateBranchWorkingHourCoreDto[] = [
    { dayOfWeek: 1, openTime: '08:00:00', closeTime: '22:00:00', isWorkingDay: true }, // Monday
    { dayOfWeek: 2, openTime: '08:00:00', closeTime: '22:00:00', isWorkingDay: true }, // Tuesday
    { dayOfWeek: 3, openTime: '08:00:00', closeTime: '22:00:00', isWorkingDay: true }, // Wednesday
    { dayOfWeek: 4, openTime: '08:00:00', closeTime: '22:00:00', isWorkingDay: true }, // Thursday
    { dayOfWeek: 5, openTime: '08:00:00', closeTime: '22:00:00', isWorkingDay: true }, // Friday
    { dayOfWeek: 6, openTime: '08:00:00', closeTime: '22:00:00', isWorkingDay: true }, // Saturday
    { dayOfWeek: 0, openTime: '08:00:00', closeTime: '22:00:00', isWorkingDay: true }  // Sunday
  ];

  const getEmptyFormData = (): CreateBranchWithDetailsDto => {
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

  const [formData, setFormData] = useState<CreateBranchWithDetailsDto>(getEmptyFormData());
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    logger.info('BranchManagement component mount oldu', null, { prefix: 'BranchManagement' });
    
    // Token kontrolü
    const token = localStorage.getItem('token');
    if (!token) {
      logger.error('Token bulunamadı', null, { prefix: 'BranchManagement' });
      setError(t('branchManagement.error.sessionExpired'));
      return;
    }
    
    // Restaurant ID kontrolü
    const restaurantId = getRestaurantIdFromToken();
    if (!restaurantId) {
      logger.error('Restaurant ID bulunamadı', null, { prefix: 'BranchManagement' });
      setError(t('branchManagement.error.restaurantIdNotFound'));
      return;
    }
    
    logger.info(`Restaurant ID: ${restaurantId} ile şube listesi isteniyor`, null, { prefix: 'BranchManagement' });
    fetchBranches();
  }, [t]);

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
      
      let errorMessage = t('branchManagement.error.loadFailed');
      
      // Handle specific error types
      if (err?.response?.status === 401) {
        errorMessage = t('branchManagement.error.sessionExpired');
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      } else if (err?.response?.status === 403) {
        errorMessage = t('branchManagement.error.noPermission');
      } else if (err?.response?.status === 404) {
        errorMessage = t('branchManagement.error.branchNotFound');
      } else if (err?.response?.status === 0 || !navigator.onLine) {
        errorMessage = t('branchManagement.error.connectionError');
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
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
      const restaurantId = getRestaurantIdFromToken();
      if (!restaurantId) {
        setError(t('branchManagement.error.restaurantIdNotFound'));
        return;
      }

      const transformedData: CreateBranchWithDetailsDto = {
        branchName: data.branchName?.trim() || null,
        whatsappOrderNumber: data.whatsappOrderNumber?.trim() || null,
        restaurantId: restaurantId,
        branchLogoPath: data.branchLogoPath || null,
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
          dayOfWeek: hour.dayOfWeek,
          openTime: hour.openTime,
          closeTime: hour.closeTime,
          isWorkingDay: hour.isWorkingDay
        })) || null
      };

      if (isEditMode && editingBranch) {
        await branchService.updateBranch(editingBranch.branchId, transformedData);
        logger.info('Branch successfully updated', { branchId: editingBranch.branchId }, { prefix: 'BranchManagement' });
      } else {
        await branchService.createBranch(transformedData);
        logger.info('Branch successfully created', null, { prefix: 'BranchManagement' });
      }
      
      await fetchBranches();
      handleCloseModal();
    } catch (err: any) {
      logger.error('Error submitting branch:', err, { prefix: 'BranchManagement' });
      
      let errorMessage = isEditMode 
        ? t('branchManagement.error.updateFailed') 
        : t('branchManagement.error.createFailed');
      
      // Handle specific error types
      if (err?.response?.status === 401) {
        errorMessage = t('branchManagement.error.sessionExpired');
      } else if (err?.response?.status === 403) {
        errorMessage = t('branchManagement.error.noPermission');
      } else if (err?.response?.status === 404) {
        errorMessage = t('branchManagement.error.branchNotFound');
      } else if (err?.response?.status === 0 || !navigator.onLine) {
        errorMessage = t('branchManagement.error.connectionError');
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditBranch = async (branch: BranchInfo) => {
    try {
      logger.info(`Fetching branch details for branchId: ${branch.branchId}`, null, { prefix: 'BranchManagement' });
      
      // Use the new API with includes to get full branch details
      const branchDetail = await branchService.getBranchById(branch.branchId);
      logger.info('Branch details fetched with includes', branchDetail, { prefix: 'BranchManagement' });

      if (branchDetail) {
        setEditingBranch(branchDetail);
        setIsEditMode(true);
        setIsModalOpen(true);
        setHasChanges(false);
        
        logger.info('Edit mode activated for branch', { branchId: branchDetail.branchId, branchName: branchDetail.branchName }, { prefix: 'BranchManagement' });
      } else {
        logger.error('No branch details returned', null, { prefix: 'BranchManagement' });
        setError(t('branchManagement.error.detailsLoadFailed'));
      }
    } catch (err: any) {
      logger.error('Error loading branch details', err, { prefix: 'BranchManagement' });
      
      let errorMessage = t('branchManagement.error.detailsLoadFailed');
      
      if (err?.response?.status === 401) {
        errorMessage = t('branchManagement.error.sessionExpired');
      } else if (err?.response?.status === 403) {
        errorMessage = t('branchManagement.error.noPermission');
      } else if (err?.response?.status === 404) {
        errorMessage = t('branchManagement.error.branchNotFound');
      }
      
      setError(errorMessage);
    }
  };

  // Updated delete handler to use confirmation modal
  const handleDeleteBranch = (branch: BranchInfo) => {
    setBranchToDelete(branch);
    setIsDeleteModalOpen(true);
  };

  // Actual delete operation called by the confirmation modal
  const performDeleteBranch = async () => {
    if (!branchToDelete) {
      throw new Error(t('branchManagement.error.branchNotFound'));
    }

    setIsDeletingBranch(true);

    // Store branch backup for potential revert
    const branchBackup = branchToDelete;

    // Optimistic UI update: Remove branch from UI immediately
    setBranches(prev => prev.filter(branch => branch.branchId !== branchToDelete.branchId));

    try {
      await branchService.deleteBranch(branchToDelete.branchId);
      logger.info('Branch deleted successfully', { branchId: branchToDelete.branchId }, { prefix: 'BranchManagement' });
      
      // Reset modal states
      setBranchToDelete(null);
      setIsDeleteModalOpen(false);

      // Refresh the list to ensure consistency
      await fetchBranches();

    } catch (err: any) {
      logger.error('Error deleting branch:', err, { prefix: 'BranchManagement' });
      
      // Revert optimistic update on error
      setBranches(prev => [...prev, branchBackup].sort((a, b) => a.branchId - b.branchId));
      
      let errorMessage = t('branchManagement.error.deleteFailed');
      
      if (err?.response?.status === 401) {
        errorMessage = t('branchManagement.error.sessionExpired');
      } else if (err?.response?.status === 403) {
        errorMessage = t('branchManagement.error.noPermission');
      } else if (err?.response?.status === 404) {
        errorMessage = t('branchManagement.error.branchNotFound');
      } else if (err?.response?.status === 409) {
        errorMessage = t('branchManagement.error.branchInUse');
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
      
      // Re-throw error to be handled by the modal
      throw new Error(errorMessage);
    } finally {
      setIsDeletingBranch(false);
    }
  };

  // Close delete modal handler
  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setBranchToDelete(null);
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
    const branch = branches.find(b => b.branchId === branchId);
    const isOpenNow = branch ? branch.isOpenNow : false;
    
    try {
      // Optimistic update
      setBranches(prev => prev.map(branch => 
        branch.branchId === branchId 
          ? { ...branch, isTemporarilyClosed } 
          : branch
      ));

      await branchService.toggleTemporaryClose(branchId, isTemporarilyClosed, isOpenNow);
    } catch (err: any) {
      // Revert on error
      setBranches(prev => prev.map(branch => 
        branch.branchId === branchId 
          ? { ...branch, isTemporarilyClosed: !isTemporarilyClosed } 
          : branch
      ));
      
      let errorMessage = t('branchManagement.error.statusUpdateFailed');
      
      if (err?.response?.status === 401) {
        errorMessage = t('branchManagement.error.sessionExpired');
      } else if (err?.response?.status === 403) {
        errorMessage = t('branchManagement.error.noPermission');
      } else if (err?.response?.status === 404) {
        errorMessage = t('branchManagement.error.branchNotFound');
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setTimeout(() => setError(null), 3000);
    }
  };

  const dismissError = () => {
    setError(null);
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('branchManagement.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('branchManagement.description')}
          </p>
        </div>

        {/* Error message */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400 dark:text-red-500" />
              </div>
              <div className={`${isRTL ? 'mr-3' : 'ml-3'} flex-1`}>
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  {t('branchManagement.error.title')}
                </h3>
                <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                  {error}
                </p>
              </div>
              <button
                onClick={dismissError}
                className={`${isRTL ? 'mr-auto' : 'ml-auto'} flex-shrink-0 text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors`}
                aria-label={t('common.dismiss')}
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
            <span className={`${isRTL ? 'mr-3' : 'ml-3'} text-gray-600 dark:text-gray-400`}>
              {t('branchManagement.loading')}
            </span>
          </div>
        )}

        {/* Branch list */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AddBranchCard onClick={handleAddBranch} />
            </motion.div>
            
            {branches.map((branch, index) => (
              <motion.div
                key={branch.branchId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: (index + 1) * 0.1 }}
              >
                <BranchCard
                  branch={branch}
                  onEdit={handleEditBranch}
                  onDelete={() => handleDeleteBranch(branch)}
                  onToggleTemporaryClose={handleToggleTemporaryClose}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* No branches message */}
        {!isLoading && !error && branches.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <Building2 className="mx-auto h-16 w-16" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t('branchManagement.noBranches.title')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {t('branchManagement.noBranches.description')}
            </p>
            <button
              onClick={handleAddBranch}
              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Plus className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('branchManagement.addBranch')}
            </button>
          </motion.div>
        )}
      </div>

      {/* Modal - Conditional rendering based on mode */}
      {isModalOpen && (
        <>
          {isEditMode && editingBranch ? (
            <BranchEditModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onSubmit={handleSubmit}
              branchDetail={editingBranch}
              isSubmitting={isSubmitting}
            />
          ) : (
            <BranchModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onSubmit={handleSubmit}
              formData={formData}
              setFormData={setFormData}
              isSubmitting={isSubmitting}
              hasChanges={hasChanges}
              onInputChange={handleInputChange}
              onWorkingHourChange={handleWorkingHourChange}
            />
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={performDeleteBranch}
        title={t('branchManagement.deleteConfirm.title')}
        message={t('branchManagement.deleteConfirm.description')}
        isSubmitting={isDeletingBranch}
        itemType="branch"
        itemName={branchToDelete?.branchName || ''}
      />
    </div>
  );
};

export default BranchManagement;