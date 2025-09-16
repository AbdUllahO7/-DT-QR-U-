import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Users, Plus } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { useClickOutside, useSignalR } from '../../../../hooks';
import { SignalRCallbacks } from '../../../../types/signalR';
import { logger } from '../../../../utils/logger';
import { branchService } from '../../../../services/branchService';
import TableCard from './QRCodeCard';
import AddQRCodeCard from './AddQRCodeCard';
import QRCodeModal from './QRCodeModal';
import TableCategoryModal from './TableCategoryModal';
import { ConfirmDeleteModal } from '../../common/ConfirmDeleteModal';
import { BranchDropdownItem, GroupedTables, RestaurantBranchDropdownItem, TableCategory, TableData } from '../../../../types/BranchManagement/type';

interface Props {
  selectedBranch: RestaurantBranchDropdownItem | null;
}



const TableManagement: React.FC<Props> = ({ selectedBranch }) => {
  const { t, isRTL } = useLanguage();
  const [branches, setBranches] = useState<BranchDropdownItem[]>([]);
  const [selectedBranchForTables, setSelectedBranchForTables] = useState<BranchDropdownItem | null>(null);
  const [tables, setTables] = useState<TableData[]>([]);
  const [categories, setCategories] = useState<TableCategory[]>([]);
  const [groupedTables, setGroupedTables] = useState<GroupedTables>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<TableData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Delete confirmation modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [tableToDelete, setTableToDelete] = useState<TableData | null>(null);
  const [isDeletingTable, setIsDeletingTable] = useState(false);

  const dropdownRef = React.useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => setIsBranchDropdownOpen(false));


  const token = localStorage.getItem('token') || '';

  // SignalR ile gerçek zamanlı güncelleme - Dokümantasyona uygun event'ler
  const signalRCallbacks: SignalRCallbacks = {
    onTableChanged: (data) => {
      logger.info('TableChanged event alındı', data);
      fetchTablesAndCategories();
    },
    onTablesBatchCreated: (data) => {
      logger.info('TablesBatchCreated event alındı', data);
      fetchTablesAndCategories();
    },
    onTableCategoryChanged: (data) => {
      logger.info('TableCategoryChanged event alındı', data);
      fetchTablesAndCategories();
    },
    onTableStatusChanged: (data) => {
      logger.info('TableStatusChanged event alındı', data);
      // Sadece ilgili tablonun durumunu güncelle
      setTables(prev => prev.map(table =>
        table.id === data.tableId
          ? { ...table, isOccupied: data.isOccupied, status: data.status }
          : table
      ));
    },
    onRefreshTableList: (data) => {
      logger.info('RefreshTableList event alındı', data);
      fetchTablesAndCategories();
    },
    onError: (data) => {
      logger.error('SignalR Error:', data.message);
      // TODO: Kullanıcıya toast ile göster
    }
  };

  useSignalR(token, selectedBranchForTables?.branchId ?? 0, signalRCallbacks);

  // Şube listesini yükle
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const branchList = await branchService.getBranchesDropdown();
        setBranches(branchList);
        
        // İlk şubeyi otomatik seç
        if (branchList.length > 0 && !selectedBranchForTables) {
          setSelectedBranchForTables(branchList[0]);
        }
      } catch (error) {
        logger.error('Şube listesi yüklenirken hata:', error);
        setError(t('TableManagement.error.loadFailed'));
      }
    };

    fetchBranches();
  }, [t]);

  // Seçilen şube değiştiğinde tabloları ve kategorileri yükle
  useEffect(() => {
    if (selectedBranchForTables) {
      fetchTablesAndCategories();
    }
  }, [selectedBranchForTables]);

  // Tablolar değiştiğinde gruplandır
  useEffect(() => {
    groupTablesByCategory();
  }, [tables, categories]);

  const fetchTablesAndCategories = async () => {
    if (!selectedBranchForTables) return;

    setIsLoading(true);
    setError(null);

    try {
      // Paralel olarak masalar ve kategorileri yükle
      const [tablesData, categoriesData] = await Promise.all([
        branchService.getTables(selectedBranchForTables.branchId),
        branchService.getTableCategories(selectedBranchForTables.branchId, true, true)
      ]);

      setTables(tablesData);
      setCategories(categoriesData);
      
      logger.info('Masalar ve kategoriler başarıyla yüklendi', {
        branchId: selectedBranchForTables.branchId,
        tablesCount: tablesData.length,
        categoriesCount: categoriesData.length
      });
    } catch (error) {
      logger.error('Masalar ve kategoriler yüklenirken hata:', error);
      setError(t('TableManagement.error.dataLoadFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const groupTablesByCategory = () => {
    const grouped: GroupedTables = {};

    // Önce tüm kategorileri ekle
    categories.forEach(category => {
      grouped[category.id.toString()] = {
        category,
        tables: []
      };
    });

    // Tabloları kategorilere dağıt
    tables.forEach(table => {
      const categoryId = table.menuTableCategoryId.toString();
      if (grouped[categoryId]) {
        grouped[categoryId].tables.push(table);
      }
    });

    setGroupedTables(grouped);
  };

  const handleBranchSelect = (branch: BranchDropdownItem) => {
    setSelectedBranchForTables(branch);
    setIsBranchDropdownOpen(false);
  };

  const handleCreateTable = () => {
    setEditingTable(null);
    setIsModalOpen(true);
  };

  const handleEditTable = (table: TableData) => {
    // Find the category name for the table
    const tableCategory = categories.find(cat => cat.id === table.menuTableCategoryId);
    const enrichedTable = {
      ...table,
      categoryName: tableCategory?.categoryName || ''
    };
    
    setEditingTable(enrichedTable);
    setIsModalOpen(true);
  };

  // Updated handleDeleteTable to use the confirmation modal
  const handleDeleteTable = (table: TableData) => {
    setTableToDelete(table);
    setIsDeleteModalOpen(true);
  };

  // Actual delete operation called by the confirmation modal
  const performDeleteTable = async () => {
    if (!tableToDelete || !selectedBranchForTables?.branchId) {
      throw new Error(t('TableManagement.error.branchRequired'));
    }

    setIsDeletingTable(true);

    // Optimistic UI update: Remove table from UI immediately
    const tableBackup = tableToDelete;
    setTables((prev) => prev.filter((table) => table.id !== tableToDelete.id));

    try {
      await branchService.deleteTable(tableToDelete.id, selectedBranchForTables.branchId);
      logger.info('Table deleted successfully:', { 
        id: tableToDelete.id, 
        branchId: selectedBranchForTables.branchId 
      });
      
      // Reset delete modal state
      setTableToDelete(null);
      setIsDeleteModalOpen(false);

    } catch (error: any) {
      logger.error('Table deletion error:', error);
      
      // Revert optimistic update on error
      setTables((prev) => [...prev, tableBackup].sort((a, b) => a.id - b.id));
      
      // Set user-friendly error message based on the actual API response
      let errorMessage = t('TableManagement.error.deleteFailed');
      
      if (error.response?.status === 400) {
        // Check if it's the specific branch error
        if (error.response?.data?.message?.includes('Branch information')) {
          errorMessage = 'Branch information could not be determined. Please refresh and try again.';
        } else {
          errorMessage = t('TableManagement.error.invalidRequest');
        }
      } else if (error.response?.status === 404) {
        errorMessage = t('TableManagement.error.tableNotFound');
      } else if (error.response?.status === 409) {
        errorMessage = t('TableManagement.error.tableInUse');
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
      
      // Re-throw error to be handled by the modal
      throw new Error(errorMessage);
    } finally {
      setIsDeletingTable(false);
    }
  };

  // Close delete modal handler
  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setTableToDelete(null);
  };

  const handleToggleStatus = async (id: number) => {
    // Find the current table to get its current status
    const currentTable = tables.find(table => table.id === id);
    if (!currentTable) return;

    const newStatus = !currentTable.isActive; // Toggle isActive, not isOccupied
    
    // Optimistic UI: Önce UI'da güncelle
    setTables(prev => prev.map(table => {
      if (table.id === id) {
        return { ...table, isActive: newStatus };
      }
      return table;
    }));

    try {
      await branchService.toggleTableStatus(id, selectedBranchForTables?.branchId ?? 0, newStatus);
      logger.info('Table status updated:', { id, newStatus });
    } catch (error) {
      logger.error('Masa durumu güncellenirken hata:', error);
      setError(t('TableManagement.error.statusUpdateFailed'));
      
      // Hata olursa eski haline döndür
      setTables(prev => prev.map(table =>
        table.id === id ? { ...table, isActive: !newStatus } : table
      ));
      
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    }
  };

  const downloadQR = (table: TableData) => {
    // Download QR code image
    if (table.qrCodeUrl) {
      window.open(table.qrCodeUrl, '_blank');
    }
    logger.info('Download QR:', table);
  };

  // Create a QRCodeData object for the modal that includes necessary branch information
  const getModalTableData = () => {
    if (!editingTable) return {};
    
    return {
      ...editingTable,
      // Ensure we have the branch information for the modal
      branchId: selectedBranchForTables?.branchId,
      branchName: selectedBranchForTables?.branchName
    };
  };

  const handleModalSuccess = () => {
    // Called when modal operations (create/update) succeed
    fetchTablesAndCategories();
    setIsModalOpen(false);
    setEditingTable(null);
    setError(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTable(null);
    setError(null);
  };

  // Display error messages
  const renderError = () => {
    if (!error) return null;
    
    return (
      <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
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

  if (error && !tables.length) {
    return (
      <div className={`flex items-center justify-center min-h-[400px] ${isRTL ? 'text-right' : 'text-left'}`}>
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('tableManagement.refresh')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Header */}
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4 flex-row-reverse' : 'space-x-4'}`}>
          <h2 className="text-2xl mr-2 font-bold text-gray-900 dark:text-white">
            {t('tableManagement.title')}
          </h2>
          
          {/* Şube Seçici Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              title='isBranchDropdownOpen'
              onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
              className={`flex items-center justify-between min-w-[200px] px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isRTL ? 'flex-row-reverse' : ''}`}
              aria-label={t('tableManagement.accessibility.branchSelector')}
              aria-haspopup="true"
            >
              <span className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Users className={`h-4 w-4 text-gray-500 dark:text-gray-400 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {selectedBranchForTables ? selectedBranchForTables.branchName : t('tableManagement.selectBranch')}
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isBranchDropdownOpen ? 'transform rotate-180' : ''} ${isRTL ? 'mr-2' : 'ml-2'}`} />
            </button>

            {isBranchDropdownOpen && (
              <div className={`absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 max-h-60 overflow-auto ${isRTL ? 'right-0' : 'left-0'}`}>
                {branches.length === 0 ? (
                  <div className="px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
                    {t('tableManagement.error.loadFailed')}
                  </div>
                ) : (
                  branches.map(branch => (
                    <button
                      key={branch.branchId}
                      onClick={() => handleBranchSelect(branch)}
                      className={`w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        selectedBranchForTables?.branchId === branch.branchId
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-200'
                      } ${isRTL ? 'text-right' : 'text-left'}`}
                    >
                      {branch.branchName}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => setIsCategoryModalOpen(true)}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isRTL ? 'flex-row-reverse' : ''}`}
          aria-label={t('tableManagement.accessibility.addCategoryButton')}
        >
          <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t('tableManagement.categories.addCategory')}
        </button>
      </div>

      {/* Error Display */}
      {renderError()}

      {/* İçerik */}
      {!selectedBranchForTables ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {t('tableManagement.selectBranch')}
            </p>
          </div>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-300 dark:border-gray-600 border-t-blue-600 mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">{t('tableManagement.loading')}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.keys(groupedTables).length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {t('tableManagement.noCategories')}
              </p>
              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('tableManagement.createFirstCategory')}
              </button>
            </div>
          ) : (
            Object.entries(groupedTables).map(([categoryId, { category, tables }]) => (
              <div key={categoryId} className="space-y-4" role="region" aria-label={t('tableManagement.accessibility.categorySection')}>
                {/* Kategori Başlığı */}
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div 
                      className="w-4 h-4 rounded-full mr-2"
                      style={{ backgroundColor: category.colorCode || '#3B82F6' }}
                    ></div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {category.categoryName}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                      {tables.length} 
                    </span>
                  </div>
                </div>

                {/* Masalar Grid */}
                <div 
                  className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                  role="grid"
                  radioGroup=''
                  aria-label={t('tableManagement.accessibility.tablesGrid')}
                >
                  {tables.map((table, index) => (
                    <motion.div
                      key={table.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      role="gridcell"
                    >
                      <TableCard
                        table={table}
                        onEdit={handleEditTable}
                        onDelete={() => handleDeleteTable(table)} // Pass the entire table object
                        onToggleStatus={handleToggleStatus}
                        onDownload={downloadQR}
                      />
                    </motion.div>
                  ))}
                  
                  {/* Yeni Masa Ekle Kartı - Her kategorinin sonunda */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: tables.length * 0.1 }}
                    role="gridcell"
                  >
                    <AddQRCodeCard onClick={handleCreateTable} />
                  </motion.div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        qrData={getModalTableData()}
        onChange={(field, value) => {
          if (editingTable) {
            setEditingTable({ ...editingTable, [field]: value });
          }
        }}
        onSubmit={() => {}} 
        isSubmitting={isSubmitting}
        isEditMode={!!editingTable}
        selectedBranchForEdit={selectedBranchForTables}
        categories={categories}
        onSuccess={handleModalSuccess}
      />

      <TableCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        selectedBranch={selectedBranch}
        onSuccess={() => {
          fetchTablesAndCategories();
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={performDeleteTable}
        title={t('tableManagement.deleteModal.title')}
        message={t('tableManagement.deleteModal.message')}
        isSubmitting={isDeletingTable}
        itemType="table"
        itemName={tableToDelete?.menuTableName || ''}
      />
    </div>
  );
};

export default TableManagement;