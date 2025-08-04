import React, { useState, useEffect } from 'react';
import { Plus, Users, QrCode, Minus } from 'lucide-react';
import { QRCodeData } from './QRCodeCard';
import { logger } from '../../../../utils/logger';
import { branchService } from '../../../../services/branchService';
import { httpClient } from '../../../../utils/http';

// API Response Types
interface BranchDropdownItem {
  branchId: number;
  branchName: string;
}

interface TableCategory {
  id: number;
  categoryName: string;  // API response'da categoryName geliyor
  branchId: number;
  colorCode: string;
  displayOrder: number;
  iconClass: string;
  isActive: boolean;
  tableCount: number | null;
  description?: string;  // Opsiyonel
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
  onSuccess
}) => {
  const [currentStep, setCurrentStep] = useState<ModalStep>('selection');
  
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
      fetchBranches();
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
      }
    }
  }, [isOpen, isEditMode, qrData]);

  // Fetch table categories when branch is selected
  useEffect(() => {
    if (selectedBranchId) {
      logger.info('Şube seçildi, kategoriler fetch ediliyor', { selectedBranchId });
      fetchTableCategories(selectedBranchId);
    } else {
      // Sadece debug modunda log göster
      if (import.meta.env.DEV) {
        logger.debug('Şube seçimi sıfırlandı');
      }
      setTableCategories([]);
    }
  }, [selectedBranchId]);

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
    setTableCategories([]); // Önce temizle
    
    try {
      const data = await branchService.getTableCategories(branchId, true, false);
      logger.info('API response kategoriler alındı', { data });
      
      setTableCategories(data);
      
      // Reset form data when categories change
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
    if (!selectedBranchId) {
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
      
      await branchService.createTable(tableData, selectedBranchId);
      logger.info('Masa başarıyla oluşturuldu');
      
      // Masa oluşturulduktan sonra masaları yeniden yükle
      try {
        await httpClient.get(`/api/branches/tables?branchId=${selectedBranchId}`);
        logger.info('Masalar yeniden yüklendi');
      } catch (error) {
        logger.error('Masalar yeniden yüklenirken hata', error);
      }
      
      // Success callback'i çağır
      onSuccess && onSuccess();
      handleClose();
    } catch (error) {
      logger.error('Masa oluşturma hatası:', error);
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
      
      // Progress tracking için timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('İşlem zaman aşımına uğradı. Lütfen tekrar deneyin.'));
        }, 120000); // 2 dakika timeout
      });
      
      // Batch işlemi ile timeout'u yarıştır
      const batchPromise = branchService.createBatchTables(batchDto, selectedBranchId);
      
      await Promise.race([batchPromise, timeoutPromise]);
      
      logger.info(`${totalTableCount} adet masa başarıyla oluşturuldu`, {
        branchId: selectedBranchId,
        totalTables: totalTableCount
      }, { prefix: 'QRCodeModal' });
      
      // SignalR otomatik olarak TablesBatchCreated event'i gönderecek
      // Manuel HTTP çağrısına gerek yok
      
      // Success callback'i çağır
      onSuccess && onSuccess();
      handleClose();
    } catch (error: any) {
      logger.error('Toplu masa oluşturma hatası:', error, { prefix: 'QRCodeModal' });
      
      // Kullanıcıya daha detaylı hata mesajı göster
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
      
      // Hata mesajını kullanıcıya göster (toast veya alert)
      console.error('❌ Toplu masa oluşturma hatası:', errorMessage);
      
      // Hata durumunda modal'ı kapatma, kullanıcının tekrar denemesine izin ver
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
        Şube Seçimi*
      </label>
      <select
        id="branchSelect"
        value={selectedBranchId || ''}
        onChange={(e) => setSelectedBranchId(e.target.value ? parseInt(e.target.value) : null)}
        required
        disabled={isLoadingBranches}
        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50"
      >
        <option value="">
          {isLoadingBranches ? 'Şubeler yükleniyor...' : 'Şube Seçin'}
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
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Masa Ekleme Seçeneği
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Nasıl masa eklemek istiyorsunuz?
        </p>
      </div>

      {renderBranchSelector()}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => setCurrentStep('single')}
          disabled={!selectedBranchId || isLoadingCategories}
          className="p-6 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex flex-col items-center space-y-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
              <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tek Masa Ekle</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Tek bir masa oluştur</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setCurrentStep('bulk')}
          disabled={!selectedBranchId || isLoadingCategories}
          className="p-6 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex flex-col items-center space-y-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
              <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Toplu Masa Ekle</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Birden fazla masa oluştur</p>
            </div>
          </div>
        </button>
      </div>

      {isLoadingCategories && (
        <div className="text-center text-gray-500 dark:text-gray-400">
          Kategoriler yükleniyor...
        </div>
      )}
    </div>
  );

  const renderSingleTableForm = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        {!isEditMode && (
          <button
            onClick={() => setCurrentStep('selection')}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            ←
          </button>
        )}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {isEditMode ? 'Masayı Düzenle' : 'Tek Masa Ekle'}
        </h2>
      </div>

      {!isEditMode && renderBranchSelector()}

      <form onSubmit={handleSingleTableSubmit} className="space-y-4">
        <div>
          <label htmlFor="menuTableName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Masa Adı
          </label>
          <input
            type="text"
            id="menuTableName"
            value={singleTableData.menuTableName || ''}
            onChange={(e) => setSingleTableData({ ...singleTableData, menuTableName: e.target.value })}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400"
            placeholder="Örn: Masa 1"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Boş bırakılırsa otomatik isim verilir
          </p>
        </div>

        <div>
          <label htmlFor="menuTableCategoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Masa Kategorisi* 
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
            }}
            required
            disabled={isLoadingCategories || tableCategories.length === 0}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50"
          >
            <option value={0}>
              {isLoadingCategories ? 'Kategoriler yükleniyor...' : 
               tableCategories.length === 0 ? 'Kategori bulunamadı' : 'Kategori Seçin'}
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
          {import.meta.env.DEV && tableCategories.length === 0 && !isLoadingCategories && (
            <p className="text-xs text-red-500 mt-1">
              Debug: Seçilen şube ({selectedBranchId}) için kategori bulunamadı
            </p>
          )}
        </div>

        <div>
          <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Kapasite*
          </label>
          <input
            type="number"
            id="capacity"
            min="1"
            max="20"
            value={singleTableData.capacity}
            onChange={(e) => setSingleTableData({ ...singleTableData, capacity: parseInt(e.target.value) || 1 })}
            required
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400"
            placeholder="Kişi sayısı"
          />
        </div>

        <div>
          <label htmlFor="displayOrder" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Görünüm Sırası
          </label>
                     <input
             type="number"
             id="displayOrder"
             min="0"
             value={singleTableData.displayOrder || ''}
             onChange={(e) => setSingleTableData({ ...singleTableData, displayOrder: e.target.value ? parseInt(e.target.value) : null })}
             className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400"
             placeholder="Sıralama için numara"
           />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Boş bırakılırsa otomatik sıralama yapılır
          </p>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            checked={singleTableData.isActive}
            onChange={(e) => setSingleTableData({ ...singleTableData, isActive: e.target.checked })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Masa aktif olsun
          </label>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !selectedBranchId || singleTableData.menuTableCategoryId === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Ekleniyor...' : isEditMode ? 'Güncelle' : 'Masa Ekle'}
          </button>
        </div>
      </form>
    </div>
  );

  const renderBulkTableForm = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setCurrentStep('selection')}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          ←
        </button>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Toplu Masa Ekle
        </h2>
      </div>

      {renderBranchSelector()}

      <form onSubmit={handleBulkTableSubmit} className="space-y-6">
        {/* Category Quantities */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Kategori Bazında Masa Miktarları*
            </label>
            <button
              type="button"
              onClick={addCategoryQuantity}
              disabled={tableCategories.length === 0 || categoryQuantities.length >= tableCategories.length}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-3 w-3 mr-1" />
              Kategori Ekle
            </button>
          </div>

          <div className="space-y-4">
            {categoryQuantities.map((item, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Kategori {index + 1}
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
                      Kategori
                    </label>
                    <select
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
                      Masa Sayısı
                    </label>
                    <input
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
                      Kapasite
                    </label>
                    <input
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
                      Sıra No.
                    </label>
                                         <input
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
                Kategori eklemek için "Kategori Ekle" butonuna tıklayın
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="bulkIsActive"
            checked={bulkIsActive}
            onChange={(e) => setBulkIsActive(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="bulkIsActive" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Tüm masalar aktif olsun
          </label>
        </div>

        {categoryQuantities.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              Oluşturulacak Masalar Özeti:
            </h4>
            <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
              {categoryQuantities.map((item, index) => {
                const category = tableCategories.find(c => c.id === item.categoryId);
                return (
                  <div key={index}>
                    • {category?.categoryName}: {item.quantity} masa ({item.capacity} kişilik)
                  </div>
                );
              })}
              <div className="pt-2 border-t border-blue-200 dark:border-blue-700 font-medium">
                Toplam: {getTotalQuantity()} masa
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !selectedBranchId || categoryQuantities.length === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Oluşturuluyor... ({getTotalQuantity()} masa)</span>
              </>
            ) : (
              <span>{getTotalQuantity()} Masa Oluştur</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={handleClose}></div>
        
        <div className="relative w-full max-w-4xl rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div></div>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
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