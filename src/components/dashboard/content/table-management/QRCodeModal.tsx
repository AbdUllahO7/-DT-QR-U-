import React, { useState, useEffect } from 'react';
import { Plus, Users, QrCode, Minus } from 'lucide-react';
import { QRCodeData } from './QRCodeCard';
import { logger } from '../../../../utils/logger';
import { branchService } from '../../../../services/branchService';
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
  onSubmit: (e: React.FormEvent) => void;
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
  onSubmit,
  isSubmitting,
  isEditMode = false,
  onSuccess,
  selectedBranchForEdit,
  categories: passedCategories
}) => {
  const { t, isRTL } = useLanguage();
  const [currentStep, setCurrentStep] = useState<ModalStep>('selection');
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
    onClose();
  };

  const handleSingleTableSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Determine which branch ID to use
    const branchIdToUse = isEditMode ? selectedBranchForEdit?.branchId : selectedBranchId;
    
    if (!branchIdToUse) {
      logger.error('Şube seçimi gerekli');
      return;
    }

    try {
      const tableData: CreateMenuTableDto = {
        menuTableName: singleTableData.menuTableName,
        menuTableCategoryId: singleTableData.menuTableCategoryId,
        capacity: singleTableData.capacity,
        displayOrder: singleTableData.displayOrder,
        isActive: singleTableData.isActive
      };
      
      if (isEditMode) {
        // For edit mode, call the parent's onSubmit handler
        logger.info('Edit mode: Calling parent onSubmit handler', { tableData });
        onSubmit(e);
        return;
      } else {
        // For create mode
        await branchService.createTable(tableData, branchIdToUse);
        logger.info('Masa başarıyla oluşturuldu');
        
        try {
          await httpClient.get(`/api/branches/tables?branchId=${branchIdToUse}`);
          logger.info('Masalar yeniden yüklendi');
        } catch (error) {
          logger.error('Masalar yeniden yüklenirken hata', error);
        }
      }
      
      onSuccess && onSuccess();
      handleClose();
    } catch (error) {
      logger.error('Masa oluşturma/güncelleme hatası:', error);
    }
  };

  const handleBulkTableSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBranchId || categoryQuantities.length === 0) {
      logger.error('Şube seçimi ve en az bir kategori gerekli');
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
          reject(new Error('İşlem zaman aşımına uğradı. Lütfen tekrar deneyin.'));
        }, 120000);
      });
      
      const batchPromise = branchService.createBatchTables(batchDto, selectedBranchId);
      
      await Promise.race([batchPromise, timeoutPromise]);
      
      logger.info(`${totalTableCount} adet masa başarıyla oluşturuldu`, {
        branchId: selectedBranchId,
        totalTables: totalTableCount
      }, { prefix: 'QRCodeModal' });
      
      onSuccess && onSuccess();
      handleClose();
    } catch (error: any) {
      logger.error('Toplu masa oluşturma hatası:', error, { prefix: 'QRCodeModal' });
      
      let errorMessage = 'Toplu masa oluşturma sırasında bir hata oluştu.';
      
      if (error.message?.includes('timeout') || error.message?.includes('zaman aşımı')) {
        errorMessage = 'İşlem zaman aşımına uğradı. Lütfen daha az masa ile tekrar deneyin.';
        logger.warn('Batch işlem timeout hatası', { totalTables: totalTableCount }, { prefix: 'QRCodeModal' });
      } else if (error.response?.status === 400) {
        errorMessage = 'Geçersiz veri formatı. Lütfen girdiğiniz bilgileri kontrol edin.';
        logger.warn('Batch işlem validation hatası', error.response.data, { prefix: 'QRCodeModal' });
      } else if (error.response?.status === 500) {
        errorMessage = 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
        logger.error('Batch işlem server hatası', error.response.data, { prefix: 'QRCodeModal' });
      } else if (error.response?.status === 401) {
        errorMessage = 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.';
        logger.warn('Batch işlem authentication hatası', { prefix: 'QRCodeModal' });
      }
      
      console.error('❌ Toplu masa oluşturma hatası:', errorMessage);
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
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none"
            aria-label={t('QRCodeModal.cancel')}
          >
            {t('QRCodeModal.cancel')}
          </button>
          <button
            type="submit"
            disabled={isSubmitting || (!isEditMode && !selectedBranchId) || singleTableData.menuTableCategoryId === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? t('QRCodeModal.adding') : isEditMode ? t('QRCodeModal.update') : t('QRCodeModal.addTable')}
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
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          aria-label={t('QRCodeModal.accessibility.backButton')}
        >
          {isRTL ? '→' : '←'}
        </button>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {t('QRCodeModal.addBulkTables')}
        </h2>
      </div>

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
              disabled={tableCategories.length === 0 || categoryQuantities.length >= tableCategories.length}
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
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
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
                      className="w-full text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1.5 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400"
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
                      className="w-full text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1.5 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400"
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
                      className="w-full text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1.5 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400"
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
                      className="w-full text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1.5 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400"
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
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none"
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
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={handleClose}></div>
        
        <div className={`relative w-full max-w-4xl rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg max-h-[90vh] overflow-y-auto ${isRTL ? 'text-right' : 'text-left'}`}>
          {/* Header */}
          <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div></div>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
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