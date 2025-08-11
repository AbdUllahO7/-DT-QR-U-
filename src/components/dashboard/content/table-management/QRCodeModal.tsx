import React, { useState, useEffect } from 'react';
import { Plus, Users, QrCode, Minus } from 'lucide-react';
import { QRCodeData } from './QRCodeCard';
import { logger } from '../../../../utils/logger';
import { branchService, UpdateMenuTableDto } from '../../../../services/branchService';
import { httpClient } from '../../../../utils/http';
import { useLanguage } from '../../../../contexts/LanguageContext';

// API Response Types
interface BranchDropdownItem {
  branchId: number;
  branchName: string;
}

interface TableCategory {
  id: number;
  categoryName: string;
  branchId: number;
  colorCode: string;
  displayOrder: number;
  iconClass: string;
  isActive: boolean;
  tableCount: number | null;
  description?: string;
}

// API DTO Types
interface CreateMenuTableDto {
  menuTableName: string | null;
  menuTableCategoryId: number;
  capacity: number;
  displayOrder: number | null;
  isActive: boolean;
}

interface BatchCreateMenuTableItemDto {
  categoryId: number;
  quantity: number;
  capacity: number;
  displayOrder: number | null;
  isActive: boolean;
}

interface CreateBatchMenuTableDto {
  items: BatchCreateMenuTableItemDto[];
}

// Component Types
interface CategoryQuantityItem {
  categoryId: number;
  quantity: number;
  capacity: number;
  displayOrder: number | null;
  isActive: boolean;
}

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrData: Partial<QRCodeData>;
  onChange: (field: keyof QRCodeData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void; // Keep for compatibility but not used
  isSubmitting: boolean;
  isEditMode?: boolean;
  onSuccess?: () => void;
  selectedBranchForEdit?: BranchDropdownItem | null;
  categories?: TableCategory[];
}

type ModalStep = 'selection' | 'single' | 'bulk';

const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  qrData,
  onChange,
  onSubmit, // Keep for compatibility
  isSubmitting: externalIsSubmitting,
  isEditMode = false,
  onSuccess,
  selectedBranchForEdit,
  categories: passedCategories
}) => {
  const { t, isRTL } = useLanguage();
  const [currentStep, setCurrentStep] = useState<ModalStep>('selection');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  console.log("qrData", qrData);
  console.log("selectedBranchForEdit", selectedBranchForEdit);
  console.log("passedCategories", passedCategories);
  
  // Branch and category data
  const [branches, setBranches] = useState<BranchDropdownItem[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
  const [tableCategories, setTableCategories] = useState<TableCategory[]>([]);
  const [isLoadingBranches, setIsLoadingBranches] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  // Single table form data
  const [singleTableData, setSingleTableData] = useState<CreateMenuTableDto>({
    menuTableName: '',
    menuTableCategoryId: 0,
    capacity: 4,
    displayOrder: 0,
    isActive: true,
  });

  // Bulk table form data
  const [categoryQuantities, setCategoryQuantities] = useState<CategoryQuantityItem[]>([]);
  const [bulkIsActive, setBulkIsActive] = useState(true);

  // Clear error when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setError(null);
    }
  }, [isOpen]);

  // Fetch branches on modal open
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && selectedBranchForEdit) {
        // For edit mode, use the passed branch and categories
        setSelectedBranchId(selectedBranchForEdit.branchId);
        if (passedCategories) {
          setTableCategories(passedCategories);
          logger.info('Edit mode: Using passed categories', { categories: passedCategories });
        }
      } else {
        // For create mode, fetch branches
        fetchBranches();
      }
      
      setCurrentStep(isEditMode ? 'single' : 'selection');
      
      if (isEditMode && qrData) {
        setSingleTableData(prev => ({
          ...prev,
          menuTableName: qrData.menuTableName || '',
          menuTableCategoryId: qrData.menuTableCategoryId || 0,
          capacity: qrData.capacity || 4,
          displayOrder: qrData.displayOrder ?? 0,
          isActive: qrData.isActive !== undefined ? qrData.isActive : true
        }));
        
        logger.info('Edit mode: Pre-filling form data', {
          menuTableName: qrData.menuTableName,
          menuTableCategoryId: qrData.menuTableCategoryId,
          capacity: qrData.capacity,
          displayOrder: qrData.displayOrder,
          isActive: qrData.isActive
        });
      }
    }
  }, [isOpen, isEditMode, qrData, selectedBranchForEdit, passedCategories]);

  // Fetch table categories when branch is selected (only for create mode)
  useEffect(() => {
    if (selectedBranchId && !isEditMode) {
      logger.info('Şube seçildi, kategoriler fetch ediliyor', { selectedBranchId });
      fetchTableCategories(selectedBranchId);
    } else if (!selectedBranchId && !isEditMode) {
      if (import.meta.env.DEV) {
        logger.debug('Şube seçimi sıfırlandı');
      }
      setTableCategories([]);
    }
  }, [selectedBranchId, isEditMode]);

  const fetchBranches = async () => {
    setIsLoadingBranches(true);
    try {
      const data = await branchService.getBranchesDropdown();
      setBranches(data);
      logger.info('Şubeler başarıyla yüklendi:', data);
    } catch (error) {
      logger.error('Şubeler yüklenemedi:', error);
      setError(t('QRCodeModal.error.branchLoadFailed'));
    } finally {
      setIsLoadingBranches(false);
    }
  };

  const fetchTableCategories = async (branchId: number) => {
    logger.info('fetchTableCategories başlatılıyor', { branchId });
    setIsLoadingCategories(true);
    setTableCategories([]);
    
    try {
      const data = await branchService.getTableCategories(branchId, true, false);
      logger.info('API response kategoriler alındı', { data });
      
      setTableCategories(data);
      
      if (data.length > 0) {
        logger.info('İlk kategori seçiliyor', { category: data[0] });
        setSingleTableData(prev => ({ ...prev, menuTableCategoryId: data[0].id }));
        setCategoryQuantities([]);
      } else {
        logger.warn('Hiç kategori bulunamadı');
        setSingleTableData(prev => ({ ...prev, menuTableCategoryId: 0 }));
      }
      
      logger.info('Kategoriler başarıyla yüklendi', { data });
    } catch (error) {
      logger.error('Kategori fetch hatası', error);
      setTableCategories([]);
      setError(t('QRCodeModal.error.categoryLoadFailed'));
    } finally {
      logger.info('fetchTableCategories tamamlandı');
      setIsLoadingCategories(false);
    }
  };

  const handleClose = () => {
    setCurrentStep('selection');
    setSelectedBranchId(null);
    setTableCategories([]);
    setCategoryQuantities([]);
    setSingleTableData({
      menuTableName: '',
      menuTableCategoryId: 0,
      capacity: 4,
      displayOrder: 0,
      isActive: true,
    });
    setBulkIsActive(true);
    setError(null);
    setIsSubmitting(false);
    onClose();
  };

  const handleSingleTableSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setError(null);

    const branchIdToUse = isEditMode ? selectedBranchForEdit?.branchId : selectedBranchId;
    if (!branchIdToUse) {
      setError(t('QRCodeModal.error.branchRequired'));
      setIsSubmitting(false);
      return;
    }

    if (singleTableData.menuTableCategoryId === 0) {
      setError(t('QRCodeModal.error.categoryRequired'));
      setIsSubmitting(false);
      return;
    }

    try {
      if (isEditMode) {
        // Update existing table
        if (!qrData.id) {
          throw new Error('Table ID is required for update');
        }

        const updateData: UpdateMenuTableDto = {
          id: qrData.id,
          menuTableName: singleTableData.menuTableName || null,
          menuTableCategoryId: singleTableData.menuTableCategoryId,
          capacity: singleTableData.capacity,
          isActive: singleTableData.isActive,
          isOccupied: qrData.isOccupied || false,
          rowVersion: qrData.rowVersion || "",
        };

        // Pass branch ID to update method to ensure proper branch context
        await branchService.updateTable(qrData.id, updateData, branchIdToUse);
        logger.info('Table updated successfully', { tableId: qrData.id, updateData, branchId: branchIdToUse });
      } else {
        // Create new table
        const createData: CreateMenuTableDto = {
          menuTableName: singleTableData.menuTableName || null,
          menuTableCategoryId: singleTableData.menuTableCategoryId,
          capacity: singleTableData.capacity,
          displayOrder: singleTableData.displayOrder,
          isActive: singleTableData.isActive,
        };

        await branchService.createTable(createData, branchIdToUse);
        logger.info('Table created successfully', { createData, branchId: branchIdToUse });
      }

      // Success callback
      if (onSuccess) {
        onSuccess();
      }
      
      handleClose();
    } catch (error: any) {
      logger.error('Table operation failed:', error);
      
      // Set user-friendly error message based on the actual API response
      let errorMessage = t('QRCodeModal.error.operationFailed');
      
      if (error.response?.status === 400) {
        // Check if it's the specific branch error
        if (error.response?.data?.message?.includes('Branch information')) {
          errorMessage = 'Branch information could not be determined. Please refresh and try again.';
        } else {
          errorMessage = t('QRCodeModal.error.invalidData');
        }
      } else if (error.response?.status === 404) {
        errorMessage = t('QRCodeModal.error.tableNotFound');
      } else if (error.response?.status === 409) {
        errorMessage = t('QRCodeModal.error.concurrencyIssue');
      } else if (error.response?.status === 401) {
        errorMessage = t('QRCodeModal.error.unauthorized');
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkTableSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setError(null);
    
    if (!selectedBranchId || categoryQuantities.length === 0) {
      setError(t('QRCodeModal.error.bulkDataRequired'));
      setIsSubmitting(false);
      return;
    }

    const items: BatchCreateMenuTableItemDto[] = categoryQuantities.map(item => ({
      categoryId: item.categoryId,
      quantity: item.quantity,
      capacity: item.capacity,
      displayOrder: item.displayOrder,
      isActive: item.isActive
    }));

    const batchDto: CreateBatchMenuTableDto = {
      items
    };

    const totalTableCount = categoryQuantities.reduce((sum, item) => sum + item.quantity, 0);
    
    try {
      logger.info(`Toplu masa oluşturma başlatılıyor: ${totalTableCount} masa`, {
        branchId: selectedBranchId,
        categories: categoryQuantities.map(item => ({
          categoryId: item.categoryId,
          quantity: item.quantity,
          capacity: item.capacity
        }))
      }, { prefix: 'QRCodeModal' });
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error(t('QRCodeModal.error.timeout')));
        }, 120000);
      });
      
      const batchPromise = branchService.createBatchTables(batchDto, selectedBranchId);
      
      await Promise.race([batchPromise, timeoutPromise]);
      
      logger.info(`${totalTableCount} adet masa başarıyla oluşturuldu`, {
        branchId: selectedBranchId,
        totalTables: totalTableCount
      }, { prefix: 'QRCodeModal' });
      
      if (onSuccess) {
        onSuccess();
      }
      
      handleClose();
    } catch (error: any) {
      logger.error('Toplu masa oluşturma hatası:', error, { prefix: 'QRCodeModal' });
      
      let errorMessage = t('QRCodeModal.error.batchCreateFailed');
      
      if (error.message?.includes('timeout') || error.message?.includes('zaman aşımı')) {
        errorMessage = t('QRCodeModal.error.timeoutAdvice');
        logger.warn('Batch işlem timeout hatası', { totalTables: totalTableCount }, { prefix: 'QRCodeModal' });
      } else if (error.response?.status === 400) {
        errorMessage = t('QRCodeModal.error.invalidBatchData');
        logger.warn('Batch işlem validation hatası', error.response.data, { prefix: 'QRCodeModal' });
      } else if (error.response?.status === 500) {
        errorMessage = t('QRCodeModal.error.serverError');
        logger.error('Batch işlem server hatası', error.response.data, { prefix: 'QRCodeModal' });
      } else if (error.response?.status === 401) {
        errorMessage = t('QRCodeModal.error.sessionExpired');
        logger.warn('Batch işlem authentication hatası', { prefix: 'QRCodeModal' });
      }
      
      setError(errorMessage);
      console.error('❌ Toplu masa oluşturma hatası:', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addCategoryQuantity = () => {
    if (tableCategories.length === 0) return;
    
    const availableCategories = tableCategories.filter(
      cat => !categoryQuantities.find(cq => cq.categoryId === cat.id)
    );
    
    if (availableCategories.length > 0) {
      setCategoryQuantities(prev => [...prev, {
        categoryId: availableCategories[0].id,
        quantity: 1,
        capacity: 4,
        displayOrder: null,
        isActive: bulkIsActive
      }]);
    }
  };

  const removeCategoryQuantity = (index: number) => {
    setCategoryQuantities(prev => prev.filter((_, i) => i !== index));
  };

  const updateCategoryQuantity = (index: number, field: keyof CategoryQuantityItem, value: number | boolean | null) => {
    setCategoryQuantities(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const getTotalQuantity = () => {
    return categoryQuantities.reduce((sum, item) => sum + item.quantity, 0);
  };

  // Error display component
  const renderError = () => {
    if (!error) return null;
    
    return (
      <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
          <div className="ml-auto pl-3">
            <button
              onClick={() => setError(null)}
              className="inline-flex text-red-400 hover:text-red-600 dark:hover:text-red-300"
            >
              <span className="sr-only">Dismiss</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  const renderBranchSelector = () => (
    <div className="mb-6">
      <label htmlFor="branchSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {t('QRCodeModal.branchSelection')}*
      </label>
      <select
        id="branchSelect"
        value={selectedBranchId || ''}
        onChange={(e) => setSelectedBranchId(e.target.value ? parseInt(e.target.value) : null)}
        required
        disabled={isLoadingBranches}
        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50"
        aria-label={t('QRCodeModal.accessibility.branchSelector')}
      >
        <option value="">
          {isLoadingBranches ? t('QRCodeModal.loadingBranches') : t('QRCodeModal.selectBranch')}
        </option>
        {branches.map(branch => (
          <option key={branch.branchId} value={branch.branchId}>
            {branch.branchName}
          </option>
        ))}
      </select>
    </div>
  );

  const renderSelectionStep = () => (
    <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {t('QRCodeModal.tableAddOption')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {t('QRCodeModal.howToAddTables')}
        </p>
      </div>

      {renderError()}
      {renderBranchSelector()}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => setCurrentStep('single')}
          disabled={!selectedBranchId || isLoadingCategories}
          className="p-6 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={t('QRCodeModal.createSingleTable')}
        >
          <div className={`flex flex-col items-center space-y-3 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
              <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('QRCodeModal.singleTable')}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('QRCodeModal.createSingleTable')}</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setCurrentStep('bulk')}
          disabled={!selectedBranchId || isLoadingCategories}
          className="p-6 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={t('QRCodeModal.createMultipleTables')}
        >
          <div className={`flex flex-col items-center space-y-3 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
              <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('QRCodeModal.bulkTable')}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('QRCodeModal.createMultipleTables')}</p>
            </div>
          </div>
        </button>
      </div>

      {isLoadingCategories && (
        <div className="text-center text-gray-500 dark:text-gray-400">
          {t('QRCodeModal.loadingCategories')}
        </div>
      )}
    </div>
  );

  const renderSingleTableForm = () => (
    <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {!isEditMode && (
          <button
            onClick={() => setCurrentStep('selection')}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            aria-label={t('QRCodeModal.accessibility.backButton')}
          >
            {isRTL ? '→' : '←'}
          </button>
        )}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {isEditMode ? t('QRCodeModal.editTable') : t('QRCodeModal.addSingleTable')}
        </h2>
      </div>

      {renderError()}
      {!isEditMode && renderBranchSelector()}

      <form onSubmit={handleSingleTableSubmit} className="space-y-4" role="form" aria-label={t('QRCodeModal.accessibility.tableForm')}>
        <div>
          <label htmlFor="menuTableName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('QRCodeModal.tableName')}
          </label>
          <input
            type="text"
            id="menuTableName"
            value={singleTableData.menuTableName || ''}
            onChange={(e) => {
              setSingleTableData({ ...singleTableData, menuTableName: e.target.value });
              // Also call the parent onChange if provided
              if (onChange) {
                onChange('menuTableName' as keyof QRCodeData, e.target.value);
              }
            }}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400"
            placeholder={t('QRCodeModal.tableNamePlaceholder')}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {t('QRCodeModal.autoNameNote')}
          </p>
        </div>

        <div>
          <label htmlFor="menuTableCategoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('QRCodeModal.tableCategory')}*
            {import.meta.env.DEV && (
              <span className="text-xs text-blue-500 ml-2">
                ({tableCategories.length} kategori)
              </span>
            )}
          </label>
          <select
            id="menuTableCategoryId"
            value={singleTableData.menuTableCategoryId}
            onChange={(e) => {
              const categoryId = parseInt(e.target.value);
              logger.info('Kategori seçildi', { categoryId });
              setSingleTableData({ ...singleTableData, menuTableCategoryId: categoryId });
              // Also call the parent onChange if provided
              if (onChange) {
                onChange('menuTableCategoryId' as keyof QRCodeData, e.target.value);
              }
            }}
            required
            disabled={isLoadingCategories || tableCategories.length === 0}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50"
            aria-label={t('QRCodeModal.accessibility.categorySelector')}
          >
            <option value={0}>
              {isLoadingCategories ? t('QRCodeModal.loadingCategories') : 
               tableCategories.length === 0 ? t('QRCodeModal.noCategories') : t('QRCodeModal.selectCategory')}
            </option>
            {tableCategories.map(category => {
              if (import.meta.env.DEV) {
                logger.info('Dropdown kategori', { category });
              }
              return (
                <option key={category.id} value={category.id}>
                  {category.categoryName}
                </option>
              );
            })}
          </select>
          {import.meta.env.DEV && tableCategories.length === 0 && !isLoadingCategories && !isEditMode && (
            <p className="text-xs text-red-500 mt-1">
              Debug: Seçilen şube ({selectedBranchId}) için kategori bulunamadı
            </p>
          )}
          {isEditMode && selectedBranchForEdit && (
            <p className="text-xs text-blue-500 mt-1">
              Editing table for branch: {selectedBranchForEdit.branchName} | Categories loaded: {tableCategories.length}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('QRCodeModal.capacity')}*
          </label>
          <input
            type="number"
            id="capacity"
            min="1"
            max="20"
            value={singleTableData.capacity}
            onChange={(e) => {
              const newCapacity = parseInt(e.target.value) || 1;
              setSingleTableData({ ...singleTableData, capacity: newCapacity });
              // Also call the parent onChange if provided
              if (onChange) {
                onChange('capacity' as keyof QRCodeData, e.target.value);
              }
            }}
            required
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400"
            placeholder={t('QRCodeModal.capacityPlaceholder')}
          />
        </div>

        {!isEditMode && (
          <div>
            <label htmlFor="displayOrder" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('QRCodeModal.displayOrder')}
            </label>
            <input
              type="number"
              id="displayOrder"
              min="0"
              value={singleTableData.displayOrder || ''}
              onChange={(e) => {
                const newDisplayOrder = e.target.value ? parseInt(e.target.value) : null;
                setSingleTableData({ ...singleTableData, displayOrder: newDisplayOrder });
                // Also call the parent onChange if provided
                if (onChange) {
                  onChange('displayOrder' as keyof QRCodeData, e.target.value);
                }
              }}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400"
              placeholder={t('QRCodeModal.displayOrderPlaceholder')}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {t('QRCodeModal.autoOrderNote')}
            </p>
          </div>
        )}

        <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
          <input
            type="checkbox"
            id="isActive"
            checked={singleTableData.isActive}
            onChange={(e) => {
              setSingleTableData({ ...singleTableData, isActive: e.target.checked });
              // Also call the parent onChange if provided
              if (onChange) {
                onChange('isActive' as keyof QRCodeData, e.target.checked.toString());
              }
            }}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className={`block text-sm text-gray-700 dark:text-gray-300 ${isRTL ? 'mr-2' : 'ml-2'}`}>
            {t('QRCodeModal.tableActive')}
          </label>
        </div>

        <div className={`flex justify-end space-x-4 pt-4 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none disabled:opacity-50"
            aria-label={t('QRCodeModal.cancel')}
          >
            {t('QRCodeModal.cancel')}
          </button>
          <button
            type="submit"
            disabled={isSubmitting || (!isEditMode && !selectedBranchId) || singleTableData.menuTableCategoryId === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isSubmitting && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            )}
            <span>
              {isSubmitting 
                ? (isEditMode ? t('QRCodeModal.updating') : t('QRCodeModal.adding'))
                : (isEditMode ? t('QRCodeModal.update') : t('QRCodeModal.addTable'))
              }
            </span>
          </button>
        </div>
      </form>
    </div>
  );

  const renderBulkTableForm = () => (
    <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <button
          onClick={() => setCurrentStep('selection')}
          disabled={isSubmitting}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 disabled:opacity-50"
          aria-label={t('QRCodeModal.accessibility.backButton')}
        >
          {isRTL ? '→' : '←'}
        </button>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {t('QRCodeModal.addBulkTables')}
        </h2>
      </div>

      {renderError()}
      {renderBranchSelector()}

      <form onSubmit={handleBulkTableSubmit} className="space-y-6" role="form" aria-label={t('QRCodeModal.accessibility.bulkForm')}>
        {/* Category Quantities */}
        <div>
          <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('QRCodeModal.categoryQuantities')}*
            </label>
            <button
              type="button"
              onClick={addCategoryQuantity}
              disabled={tableCategories.length === 0 || categoryQuantities.length >= tableCategories.length || isSubmitting}
              className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <Plus className={`h-3 w-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
              {t('QRCodeModal.addCategory')}
            </button>
          </div>

          <div className="space-y-4">
            {categoryQuantities.map((item, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className={`flex items-center justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {t('QRCodeModal.category')} {index + 1}
                  </h4>
                  <button
                    type="button"
                    onClick={() => removeCategoryQuantity(index)}
                    disabled={isSubmitting}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('QRCodeModal.category')}
                    </label>
                    <select
                      title='categoryId'
                      value={item.categoryId}
                      onChange={(e) => updateCategoryQuantity(index, 'categoryId', parseInt(e.target.value))}
                      required
                      disabled={isSubmitting}
                      className="w-full text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1.5 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50"
                    >
                      {tableCategories
                        .filter(cat => cat.id === item.categoryId || !categoryQuantities.find(cq => cq.categoryId === cat.id))
                        .map(category => (
                          <option key={category.id} value={category.id}>
                            {category.categoryName}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('QRCodeModal.tableCount')}
                    </label>
                    <input
                      title='number'
                      type="number"
                      min="1"
                      max="50"
                      value={item.quantity}
                      onChange={(e) => updateCategoryQuantity(index, 'quantity', parseInt(e.target.value) || 1)}
                      required
                      disabled={isSubmitting}
                      className="w-full text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1.5 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('QRCodeModal.capacity')}
                    </label>
                    <input
                      title='number'
                      type="number"
                      min="1"
                      max="20"
                      value={item.capacity}
                      onChange={(e) => updateCategoryQuantity(index, 'capacity', parseInt(e.target.value) || 1)}
                      required
                      disabled={isSubmitting}
                      className="w-full text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1.5 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('QRCodeModal.displayOrder')}
                    </label>
                    <input
                      title='number'
                      type="number"
                      min="0"
                      value={item.displayOrder || ''}
                      onChange={(e) => updateCategoryQuantity(index, 'displayOrder', e.target.value ? parseInt(e.target.value) : null)}
                      disabled={isSubmitting}
                      className="w-full text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1.5 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>
            ))}

            {categoryQuantities.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {t('QRCodeModal.addCategory')}
              </div>
            )}
          </div>
        </div>

        <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
          <input
            type="checkbox"
            id="bulkIsActive"
            checked={bulkIsActive}
            onChange={(e) => setBulkIsActive(e.target.checked)}
            disabled={isSubmitting}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
          />
          <label htmlFor="bulkIsActive" className={`block text-sm text-gray-700 dark:text-gray-300 ${isRTL ? 'mr-2' : 'ml-2'}`}>
            {t('QRCodeModal.allTablesActive')}
          </label>
        </div>

        {categoryQuantities.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              {t('QRCodeModal.tableSummary')}
            </h4>
            <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
              {categoryQuantities.map((item, index) => {
                const category = tableCategories.find(c => c.id === item.categoryId);
                return (
                  <div key={index}>
                    • {category?.categoryName}: {item.quantity} {t('QRCodeModal.tables')} ({item.capacity} {t('QRCodeModal.capacity')})
                  </div>
                );
              })}
              <div className="pt-2 border-t border-blue-200 dark:border-blue-700 font-medium">
                {t('QRCodeModal.total')}: {getTotalQuantity()} {t('QRCodeModal.tables')}
              </div>
            </div>
          </div>
        )}

        <div className={`flex justify-end space-x-4 pt-4 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none disabled:opacity-50"
          >
            {t('QRCodeModal.cancel')}
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !selectedBranchId || categoryQuantities.length === 0}
            className={`px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>{t('QRCodeModal.creating').replace('{count}', getTotalQuantity().toString())}</span>
              </>
            ) : (
              <span>{t('QRCodeModal.createTables').replace('{count}', getTotalQuantity().toString())}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-label={t('QRCodeModal.accessibility.modal')}>
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={!isSubmitting ? handleClose : undefined}></div>
        
        <div className={`relative w-full max-w-4xl rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg max-h-[90vh] overflow-y-auto ${isRTL ? 'text-right' : 'text-left'}`}>
          {/* Header */}
          <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div></div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
              aria-label={t('QRCodeModal.accessibility.closeButton')}
            >
              <QrCode className="h-6 w-6" />
            </button>
          </div>

          {/* Content based on current step */}
          {currentStep === 'selection' && renderSelectionStep()}
          {currentStep === 'single' && renderSingleTableForm()}
          {currentStep === 'bulk' && renderBulkTableForm()}
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;