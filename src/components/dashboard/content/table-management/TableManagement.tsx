import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Users, Plus, Trash2, MapPin } from 'lucide-react'; // Added MapPin for the branch
import { useLanguage } from '../../../../contexts/LanguageContext';
import { useClickOutside, useSignalR } from '../../../../hooks';
import { SignalRCallbacks } from '../../../../types/signalR';
import { logger } from '../../../../utils/logger';
import { branchService } from '../../../../services/branchService';
import AddQRCodeCard from './AddQRCodeCard';
import QRCodeModal from './QRCodeModal';
import TableCategoryModal from './TableCategoryModal';
import { ConfirmDeleteModal } from '../../common/ConfirmDeleteModal';
import { BranchDropdownItem, GroupedTables, RestaurantBranchDropdownItem, TableCategory, TableData } from '../../../../types/BranchManagement/type';
import { useNavigate } from 'react-router-dom';
import TableCard from '../../Branch/Table/TableCard';

interface Props {
  selectedBranch: RestaurantBranchDropdownItem | null;
}

const TableManagement: React.FC<Props> = ({ selectedBranch }) => {
  // --- Existing State and Hooks (Kept for functionality) ---
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

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [tableToDelete, setTableToDelete] = useState<TableData | null>(null);
  const [isDeletingTable, setIsDeletingTable] = useState(false);

  const dropdownRef = React.useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => setIsBranchDropdownOpen(false));
  const navigate = useNavigate()
  const token = localStorage.getItem('token') || '';

  // --- SignalR, Data Fetching, Grouping, and Handlers (Kept as is for functionality) ---
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

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const branchList = await branchService.getBranchesDropdown();
        setBranches(branchList);
        
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

  useEffect(() => {
    if (selectedBranchForTables) {
      fetchTablesAndCategories();
    }
  }, [selectedBranchForTables]);

  useEffect(() => {
    groupTablesByCategory();
  }, [tables, categories]);

  const fetchTablesAndCategories = async () => {
    if (!selectedBranchForTables) return;

    setIsLoading(true);
    setError(null);

    try {
      const [tablesData, categoriesData] = await Promise.all([
        branchService.getTables(selectedBranchForTables.branchId),
        branchService.getTableCategories(selectedBranchForTables.branchId, false, true)
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

    categories.forEach(category => {
      grouped[category.id.toString()] = {
        category,
        tables: []
      };
    });

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
    const tableCategory = categories.find(cat => cat.id === table.menuTableCategoryId);
    const enrichedTable = {
      ...table,
      categoryName: tableCategory?.categoryName || ''
    };
    
    setEditingTable(enrichedTable);
    setIsModalOpen(true);
  };

  const handleDeleteTable = (table: TableData) => {
    setTableToDelete(table);
    setIsDeleteModalOpen(true);
  };

  const performDeleteTable = async () => {
    if (!tableToDelete || !selectedBranchForTables?.branchId) {
      throw new Error(t('TableManagement.error.branchRequired'));
    }

    setIsDeletingTable(true);

    const tableBackup = tableToDelete;
    setTables((prev) => prev.filter((table) => table.id !== tableToDelete.id));

    try {
      await branchService.deleteTable(tableToDelete.id, selectedBranchForTables.branchId);
      logger.info('Table deleted successfully:', { 
        id: tableToDelete.id, 
        branchId: selectedBranchForTables.branchId 
      });
      
      setTableToDelete(null);
      setIsDeleteModalOpen(false);

    } catch (error: any) {
      logger.error('Table deletion error:', error);
      
      setTables((prev) => [...prev, tableBackup].sort((a, b) => a.id - b.id));
      
      let errorMessage = t('TableManagement.error.deleteFailed');
      
      if (error.response?.status === 400) {
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
      
      setTimeout(() => setError(null), 5000);
      
      throw new Error(errorMessage);
    } finally {
      setIsDeletingTable(false);
    }
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setTableToDelete(null);
  };

  const handleToggleStatus = async (id: number) => {
    const currentTable = tables.find(table => table.id === id);
    if (!currentTable) return;

    const newStatus = !currentTable.isActive; 
    
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
      
      setTables(prev => prev.map(table =>
        table.id === id ? { ...table, isActive: !newStatus } : table
      ));
      
      setTimeout(() => setError(null), 5000);
    }
  };

  const downloadQR = (table: TableData) => {
    if (table.qrCodeUrl) {
      window.open(table.qrCodeUrl, '_blank');
    }
    logger.info('Download QR:', table);
  };

  const getModalTableData = () => {
    if (!editingTable) return {};
    
    return {
      ...editingTable,
      branchId: selectedBranchForTables?.branchId,
      branchName: selectedBranchForTables?.branchName
    };
  };

  const handleModalSuccess = () => {
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

  // --- Render Functions (Styling Modernized) ---

  const renderError = () => {
    if (!error) return null;
    
    return (
      <div 
        className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl shadow-lg"
        role="alert"
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <svg className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-base font-medium text-red-800 dark:text-red-200">{error}</p>
          </div>
          <div className="ml-auto pl-3">
            <button
              onClick={() => setError(null)}
              className="inline-flex text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors rounded-full p-1"
              aria-label={t('TableManagement.accessibility.dismissError')}
            >
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
      <div className={`flex items-center justify-center min-h-[60vh] bg-white dark:bg-gray-900 rounded-xl p-8 shadow-2xl ${isRTL ? 'text-right' : 'text-left'}`}>
        <div className="text-center">
          <p className="text-xl font-semibold text-red-600 dark:text-red-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-md"
          >
            {t('tableManagement.refresh')}
          </button>
        </div>
      </div>
    );
  }

  // --- Main Component JSX (Redesigned) ---

  return (
    <div className={`p-6 bg-gray-50 dark:bg-gray-900 min-h-screen ${isRTL ? 'text-right' : 'text-left'}`}>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header & Controls Panel */}
        <div className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-700`}>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            {t('tableManagement.title')}
          </h1>

          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Şube Seçici Dropdown - Modernized */}
            <div className="relative z-30" ref={dropdownRef}>
              <button
                title='isBranchDropdownOpen'
                onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
                className={`flex items-center justify-between min-w-[220px] px-5 py-2.5 text-base font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-xl shadow-sm hover:bg-blue-100 dark:hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-300/50 dark:focus:ring-blue-800/50 transition-all duration-200 ${isRTL ? 'flex-row-reverse' : ''}`}
                aria-label={t('tableManagement.accessibility.branchSelector')}
                aria-haspopup="true"
              >
                <span className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <MapPin className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {selectedBranchForTables ? selectedBranchForTables.branchName : t('tableManagement.selectBranch')}
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isBranchDropdownOpen ? 'transform rotate-180' : ''} ${isRTL ? 'mr-2' : 'ml-2'}`} />
              </button>

              {isBranchDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className={`absolute z-20 mt-2 w-full min-w-[220px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 py-1 max-h-80 overflow-auto ${isRTL ? 'right-0' : 'left-0'}`}
                >
                  {branches.length === 0 ? (
                    <div className="px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
                      {t('tableManagement.error.loadFailed')}
                    </div>
                  ) : (
                    branches.map(branch => (
                      <button
                        key={branch.branchId}
                        onClick={() => handleBranchSelect(branch)}
                        className={`w-full px-4 py-2 text-sm transition-colors duration-150 ${isRTL ? 'text-right' : 'text-left'} ${
                          selectedBranchForTables?.branchId === branch.branchId
                            ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-semibold'
                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {branch.branchName}
                      </button>
                    ))
                  )}
                </motion.div>
              )}
            </div>

            {/* Action Buttons */}
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className={`inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-xl shadow-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 ${isRTL ? 'flex-row-reverse' : ''}`}
              aria-label={t('tableManagement.accessibility.addCategoryButton')}
            >
              <Plus className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('tableManagement.categories.addCategory')}
            </button>

            <button 
              onClick={() => {
                navigate('/dashboard/RecycleBin', { 
                  state: { 
                    source: 'tables',
                    branchId: selectedBranchForTables?.branchId 
                  } 
                })
              }}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900 rounded-xl transition-colors duration-200 shadow-sm`}
            >
              <Trash2 className="h-5 w-5" />
              <span className="hidden sm:inline">{t('productsContent.actions.RecycleBin')}</span>
            </button>
          </div>
        </div>
        
        {/* Content Area */}
        
        {renderError()}

        {!selectedBranchForTables ? (
          <div className="flex items-center justify-center min-h-[400px] bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12">
            <div className="text-center">
              <MapPin className="h-16 w-16 mx-auto text-blue-500 mb-6" />
              <p className="text-xl font-medium text-gray-700 dark:text-gray-300">
                {t('tableManagement.selectBranchPrompt')}
              </p>
            </div>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center min-h-[400px] bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-300 dark:border-gray-600 border-t-blue-600 mb-4"></div>
              <p className="text-lg text-gray-500 dark:text-gray-400">{t('tableManagement.loading')}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.keys(groupedTables).length === 0 && tables.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <Users className="h-16 w-16 mx-auto text-gray-400 mb-6" />
                <p className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-6">
                  {t('tableManagement.noCategories')}
                </p>
                <button
                  onClick={() => setIsCategoryModalOpen(true)}
                  className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <Plus className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {t('tableManagement.createFirstCategory')}
                </button>
              </div>
            ) : (
              Object.entries(groupedTables).map(([categoryId, { category, tables }]) => (
                <section key={categoryId} className="space-y-6" role="region" aria-label={`${category.categoryName} ${t('tableManagement.accessibility.categorySection')}`}>
                  {/* Kategori Başlığı - Elevated Design */}
                  <div className={`flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-md border-t-4`}
                    style={{ borderTopColor: category.colorCode || '#3B82F6' }}
                  >
                    <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {category.categoryName}
                      </h3>
                     
                    </div>
                  </div>

                  {/* Masalar Grid - Enhanced Grid Structure */}
                  <div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    role="grid"
                    aria-label={`${category.categoryName} ${t('tableManagement.accessibility.tablesGrid')}`}
                  >
                    {tables.map((table, index) => (
                      <motion.div
                        key={table.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        role="gridcell"
                      >
                        <TableCard
                          table={table}
                          onEdit={() => handleEditTable(table)}
                          onDelete={() => handleDeleteTable(table)}
                          onToggleStatus={(id) => handleToggleStatus(id)}
                          onDownload={downloadQR}
                          categoryColor={category.colorCode}
                        />
                      </motion.div>
                    ))}
                    
                    {/* Yeni Masa Ekle Kartı - More prominent */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: tables.length * 0.05, duration: 0.3 }}
                      role="gridcell"
                    >
                      <AddQRCodeCard onClick={handleCreateTable} />
                    </motion.div>
                  </div>
                </section>
              ))
            )}
          </div>
        )}

      {/* --- Modals (Kept as is, but will inherit modern context styles) --- */}
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
  </div>
  );
};

export default TableManagement;