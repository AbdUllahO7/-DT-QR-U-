import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Users, Plus } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { logger } from '../../../utils/logger';
import TableCard from './table-management/QRCodeCard';
import QRCodeModal from './table-management/QRCodeModal';
import AddQRCodeCard from './table-management/AddQRCodeCard';
import TableCategoryModal from './table-management/TableCategoryModal';
import { RestaurantBranchDropdownItem, TableData, TableCategory, BranchDropdownItem } from '../../../types/api';
import { branchService } from '../../../services/branchService';
import { useClickOutside } from '../../../hooks';
import { useSignalR } from '../../../hooks/useSignalR';
import { SignalRCallbacks } from '../../../types/signalR';

interface Props {
  selectedBranch: RestaurantBranchDropdownItem | null;
}

interface GroupedTables {
  [categoryId: string]: {
    category: TableCategory;
    tables: TableData[];
  };
}

// TableManagement: Masa yönetimi ve SignalR ile gerçek zamanlı güncelleme
// SignalR entegrasyonu: useSignalR ile tablo değişiklikleri anlık işlenir
const TableManagement: React.FC<Props> = ({ selectedBranch }) => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
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
        setError(t('tableManagement.error.loadFailed'));
      }
    };

    fetchBranches();
  }, []);

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
      setError(t('tableManagement.error.dataLoadFailed'));
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
    setEditingTable(table);
    setIsModalOpen(true);
  };

  const handleUpdateTable = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // API call to update table
    setTimeout(() => {
      setIsSubmitting(false);
      setIsModalOpen(false);
      setEditingTable(null);
      // Tabloları yeniden yükle
      fetchTablesAndCategories();
    }, 1000);
  };

  const handleDeleteTable = (id: number) => {
    // API call to delete table
    logger.info('Delete Table:', id);
    // Tabloları yeniden yükle
    fetchTablesAndCategories();
  };

  const handleToggleStatus = async (id: number) => {
    // Optimistic UI: Önce UI'da güncelle
    let newStatus = false;
    setTables(prev => prev.map(table => {
      if (table.id === id) {
        newStatus = !table.isOccupied;
        return { ...table, isOccupied: newStatus };
      }
      return table;
    }));
    try {
      await branchService.toggleTableStatus(id, selectedBranchForTables?.branchId ?? 0, newStatus);
    } catch (error) {
      logger.error('Masa durumu güncellenirken hata:', error);
      // Hata olursa eski haline döndür
      setTables(prev => prev.map(table =>
        table.id === id ? { ...table, isOccupied: !newStatus } : table
      ));
    }
  };

  const downloadQR = (table: TableData) => {
    // Download QR code image
    if (table.qrCodeUrl) {
      window.open(table.qrCodeUrl, '_blank');
    }
    logger.info('Download QR:', table);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('common.refresh')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('dashboard.tables.title')}
          </h2>
          
          {/* Şube Seçici Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
              className="flex items-center justify-between min-w-[200px] px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                {selectedBranchForTables ? selectedBranchForTables.branchName : t('branchManagement.actions.selectBranch')}
              </span>
              <ChevronDown className={`h-4 w-4 ml-2 transition-transform duration-200 ${isBranchDropdownOpen ? 'transform rotate-180' : ''}`} />
            </button>

            {isBranchDropdownOpen && (
              <div className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 max-h-60 overflow-auto">
                {branches.length === 0 ? (
                  <div className="px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
                    {t('branchManagement.error.noBranchesFound')}
                  </div>
                ) : (
                  branches.map(branch => (
                    <button
                      key={branch.branchId}
                      onClick={() => handleBranchSelect(branch)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        selectedBranchForTables?.branchId === branch.branchId
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-200'
                      }`}
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
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('tableManagement.categories.addCategory')}
        </button>
      </div>

      {/* İçerik */}
      {!selectedBranchForTables ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {t('dashboard.tables.selectBranch')}
            </p>
          </div>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-300 dark:border-gray-600 border-t-blue-600 mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">{t('dashboard.tables.loading')}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.keys(groupedTables).length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {t('dashboard.tables.noCategories')}
              </p>
              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                İlk Kategoriyi Oluştur
              </button>
            </div>
          ) : (
            Object.entries(groupedTables).map(([categoryId, { category, tables }]) => (
              <div key={categoryId} className="space-y-4">
                {/* Kategori Başlığı */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.colorCode || '#3B82F6' }}
                    ></div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {category.categoryName}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                      {tables.length} {t('dashboard.tables.tableCount')}
                    </span>
                  </div>
                </div>

                {/* Masalar Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {tables.map((table, index) => (
                    <motion.div
                      key={table.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <TableCard
                        table={table}
                        onEdit={handleEditTable}
                        onDelete={handleDeleteTable}
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
        onClose={() => {
          setIsModalOpen(false);
          setEditingTable(null);
        }}
        qrData={editingTable || {}}
        onChange={(field, value) => {
          if (editingTable) {
            setEditingTable({ ...editingTable, [field]: value });
          }
        }}
        onSubmit={handleUpdateTable}
        isSubmitting={isSubmitting}
        isEditMode={!!editingTable}
        onSuccess={() => {
          // Masa oluşturulduktan sonra verileri yenile
          fetchTablesAndCategories();
        }}
      />

      <TableCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        selectedBranch={selectedBranch}
        onSuccess={() => {
          fetchTablesAndCategories();
        }}
      />
    </div>
  );
};

export default TableManagement; 