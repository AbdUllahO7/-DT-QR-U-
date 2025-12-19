import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Users, Plus, Trash2, MapPin, Edit2, MoreVertical, LayoutGrid, X, Loader2, Grid, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { useClickOutside, useSignalR } from '../../../../hooks';
import { SignalRCallbacks } from '../../../../types/signalR';
import { logger } from '../../../../utils/logger';
import { branchService } from '../../../../services/branchService';
import AddQRCodeCard from './AddQRCodeCard';
import TableCategoryModal from './TableCategoryModal';
import { ConfirmDeleteModal } from '../../common/ConfirmDeleteModal';
import { BranchDropdownItem, GroupedTables, RestaurantBranchDropdownItem, TableCategory, TableData } from '../../../../types/BranchManagement/type';
import { useNavigate } from 'react-router-dom';
import { tableService } from '../../../../services/Branch/branchTableService';
import TableCard from '../../Branch/Table/TableCard';
import QRCodeModalAdd from './QRCodeModal';

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

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [tableToDelete, setTableToDelete] = useState<TableData | null>(null);
  const [isDeletingTable, setIsDeletingTable] = useState(false);

  // Category management states
  const [editingCategory, setEditingCategory] = useState<TableCategory | null>(null);
  const [isCategoryDeleteModalOpen, setIsCategoryDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<TableCategory | null>(null);
  const [isDeletingCategory, setIsDeletingCategory] = useState(false);
  const [openCategoryMenu, setOpenCategoryMenu] = useState<number | null>(null);

    const [qrModal, setQrModal] = useState<{
      isOpen: boolean;
      table: TableData | null;
    }>({
      isOpen: false,
      table: null
    });


  const dropdownRef = React.useRef<HTMLDivElement>(null);
  
  useClickOutside(dropdownRef, () => setIsBranchDropdownOpen(false));

  const generateQRCodeImageUrl = (qrCode: string): string => {
    if (!qrCode) return '';
    
    const baseUrl = window.location.origin;
    const tableUrl = `${baseUrl}/table/qr/${qrCode}`;
    
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(tableUrl)}`;
  };

    const handleCloseQRModal = (): void => {
    setQrModal({
      isOpen: false,
      table: null
    });
  };

  
  const navigate = useNavigate();
  const token = localStorage.getItem('token') || '';

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
      } catch (error:any) {
        logger.error('Şube listesi yüklenirken hata:', error);
         setError(error.response.data.message);
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
    } catch (error:any) {
      logger.error('Masalar ve kategoriler yüklenirken hata:', error);
      setError(error.response.data.message);

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
    if (categories.length === 0) {
      setError(t('tableManagement.error.createCategoryFirst') || 'Please create a table category first.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

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
      
      setError(error.response.data.message);

      
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
    } catch (error:any) {
      logger.error('Masa durumu güncellenirken hata:', error);
      setError(error.response.data.message);

      
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

  // Category management handlers
  const handleCreateCategory = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (category: TableCategory) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
    setOpenCategoryMenu(null);
  };

  const handleDeleteCategory = (category: TableCategory) => {
    setCategoryToDelete(category);
    setIsCategoryDeleteModalOpen(true);
    setOpenCategoryMenu(null);
  };

  const performDeleteCategory = async () => {
    if (!categoryToDelete) {
      throw new Error('Category not selected');
    }

    setIsDeletingCategory(true);

    try {
      await tableService.deleteCategory(categoryToDelete.id , selectedBranchForTables?.branchId);
      logger.info('Category deleted successfully:', { id: categoryToDelete.id });
      
      await fetchTablesAndCategories();
      
      setCategoryToDelete(null);
      setIsCategoryDeleteModalOpen(false);

    } catch (error: any) {
      logger.error('Category deletion error:', error);
      
      let errorMessage = 'Failed to delete category';
      
      if (error.response?.status === 409) {
        errorMessage = 'Cannot delete category with existing tables';
      } else if (error.response?.status === 404) {
        errorMessage = 'Category not found';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(error.response.data.message);

      setTimeout(() => setError(null), 5000);
      
      throw new Error(errorMessage);
    } finally {
      setIsDeletingCategory(false);
    }
  };

  const handleCategoryDeleteModalClose = () => {
    setIsCategoryDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

    const handleShowQRCode = (table: TableData): void => {
      setQrModal({
        isOpen: true,
        table
      });
    };

  const handleCategoryModalClose = () => {
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
  };

  const handleCategoryModalSuccess = () => {
    fetchTablesAndCategories();
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
  };

  const toggleCategoryMenu = (categoryId: number) => {
    setOpenCategoryMenu(openCategoryMenu === categoryId ? null : categoryId);
  };

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

  return (
    <div className={`p-6 bg-gray-50 dark:bg-gray-900 min-h-screen ${isRTL ? 'text-right' : 'text-left'}`}>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header & Controls Panel */}
        <div className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-700`}>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            {t('tableManagement.title')}
          </h1>

          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Branch Selector Dropdown */}
            <div className="relative z-30" ref={dropdownRef}>
              <button
                title='Branch Dropdown'
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
                      {t('TableManagement.error.loadFailed')}
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

            <button
              onClick={handleCreateTable}
              disabled={categories.length === 0}
              className={`inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-xl shadow-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ${isRTL ? 'flex-row-reverse' : ''}`}
              title={categories.length === 0 ? t('tableManagement.error.createCategoryFirst') || 'Create a category first' : ''}
            >
              <LayoutGrid className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('tableManagement.addTable') || 'Add Table'}
            </button>

            {/* Add Category Button */}
            <button
              onClick={handleCreateCategory}
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
                  onClick={handleCreateCategory}
                  className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <Plus className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {t('tableManagement.createFirstCategory')}
                </button>
              </div>
            ) : (
              Object.entries(groupedTables).map(([categoryId, { category, tables }]) => (
                <section key={categoryId} className="space-y-6" role="region" aria-label={`${category.categoryName} ${t('tableManagement.accessibility.categorySection')}`}>
                  {/* Category Header with Actions */}
                  <div className={`flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-md border-t-4`}
                    style={{ borderTopColor: category.colorCode || '#3B82F6' }}
                  >
                    <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {category.categoryName}
                      </h3>
                      <span className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                        {tables.length} {tables.length === 1 ? 'table' : 'tables'}
                      </span>
                    </div>

                    {/* Category Actions Menu */}
                <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCategoryMenu(category.id);
                        }}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        aria-label="Category Actions"
                      >
                        <MoreVertical className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </button>

                      {openCategoryMenu === category.id && (
                        <>
                          {/* Backdrop to close menu when clicking outside */}
                          <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => setOpenCategoryMenu(null)}
                          />
                          
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50`}
                          >
                            <button
                              onClick={() => handleEditCategory(category)}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors"
                            >
                              <Edit2 className="h-4 w-4" />
                             {t('tableManagement.categories.editCategory')}
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category)}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                              {t('tableManagement.categories.deleteCategory')}
                            </button>
                          </motion.div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Tables Grid */}
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
                          onEdit={handleEditTable}
                          onDelete={() => handleDeleteTable(table)} 
                          onToggleStatus={handleToggleStatus}
                          onDownload={downloadQR}
                                              onShowQRCode={handleShowQRCode}
                          isToggling={false}
                        />
                      </motion.div>
                    ))}
                    
                    {/* Add New Table Card */}
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

      {/* Modals */}
      <QRCodeModalAdd
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

        {/* QR Code Modal */}
        {qrModal.table && (
          <QRCodeModal
            isOpen={qrModal.isOpen}
            onClose={handleCloseQRModal}
            table={qrModal.table}
            qrCodeImageUrl={generateQRCodeImageUrl(qrModal.table.qrCode || '')}
          />
        )}

      <TableCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={handleCategoryModalClose}
        selectedBranch={selectedBranch}
        onSuccess={handleCategoryModalSuccess}
        editingCategory={editingCategory}
        isEditMode={!!editingCategory}
      />

      {/* Table Delete Modal */}
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

      {/* Category Delete Modal */}
      <ConfirmDeleteModal
        isOpen={isCategoryDeleteModalOpen}
        onClose={handleCategoryDeleteModalClose}
        onConfirm={performDeleteCategory}
        title={t('branchCategories.deleteModal.title')}
        message={t('branchCategories.deleteModal.message')}
        isSubmitting={isDeletingCategory}
        itemType="category"
        itemName={categoryToDelete?.categoryName || ''}
      />
    </div>
  </div>
  );
};

export default TableManagement;


const QRCodeModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  table: TableData;
  qrCodeImageUrl: string;
}> = ({ isOpen, onClose, table, qrCodeImageUrl }) => {
  const { t } = useLanguage();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  if (!isOpen) return null;

  const getTableUrl = (): string => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/table/qr/${table.qrCode}`;
  };

  const handleDownloadQR = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(qrCodeImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `table-${table.menuTableName}-qr.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading QR code:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyUrl = async () => {
    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(getTableUrl());
      setTimeout(() => setIsCopying(false), 2000);
    } catch (error) {
      console.error('Error copying URL:', error);
      setIsCopying(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {t('BranchTableManagement.qrCodeTitle', { tableName: table.menuTableName })}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="bg-white p-4 rounded-xl border-2 border-gray-200 inline-block">
            <img 
              src={qrCodeImageUrl} 
              alt={t('BranchTableManagement.qrCodeTitle', { tableName: table.menuTableName })}
              className="w-48 h-48 mx-auto"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNzBDOTQuNDc3MiA3MCA5MCA3NC40NzcyIDkwIDgwVjEyMEM5MCA5NC40NzcyIDk0LjQ3NzIgOTAgMTAwIDkwSDE0MEM5NC40NzcyIDkwIDkwIDk0LjQ3NzIgOTAgMTAwVjE0MEg5MFY4MEg5MFY3MEgxMDBaIiBmaWxsPSIjOUI5QkEwIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTMwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5QjlCQTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk5vIFFSIENvZGU8L3RleHQ+Cjwvc3ZnPgo=';
              }}
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
            {t('BranchTableManagement.qrCodeDescription')}
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleDownloadQR}
            disabled={isDownloading}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isDownloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Grid className="h-4 w-4" />
            )}
            {isDownloading ? t('BranchTableManagement.downloading') : t('BranchTableManagement.downloadQR')}
          </button>

          <button
            onClick={handleCopyUrl}
            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center gap-2"
          >
            {isCopying ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-600" />
                {t('BranchTableManagement.copied')}
              </>
            ) : (
              <>
                <Grid className="h-4 w-4" />
                {t('BranchTableManagement.copyQRUrl')}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};