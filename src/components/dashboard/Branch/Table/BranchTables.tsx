import React, { useState, useEffect } from 'react';
import { 
  Plus,
  Search,
  Building,
  Grid,
  UserX,
  UserCheck,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Loader2,
  X,
  Save,
  XCircle,
  Settings,
  Users,
  Copy
} from 'lucide-react';
import { 
  CreateMenuTableDto, 
  UpdateMenuTableDto, 
  CreateTableCategoryDto,
  UpdateTableCategoryDto,
  BatchCreateMenuTableItemDto,
  CreateBatchMenuTableDto,
  tableService 
} from '../../../../services/Branch/branchTableService';
import { useLanguage } from '../../../../contexts/LanguageContext';
import CategorySection from './CategorySection';

// QR Code Modal Component
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

  // Generate the table URL that the QR code points to
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
                {t('BranchTableManagement.copyUrl')}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Interfaces
interface CategoryData {
  id: number;
  categoryName: string;
  colorCode: string;
  iconClass: string;
  displayOrder: number;
  isActive: boolean;
  branchId: number;
  tableCount?: number;
}

interface TableData {
  id: number;
  menuTableName: string;
  menuTableCategoryId: number;
  capacity: number;
  isActive: boolean;
  isOccupied: boolean;
  displayOrder: number;
  rowVersion?: string;
  qrCode?: string;
  qrCodeUrl?: string;
}

const BranchTableManagement: React.FC = () => {
  const { t, isRTL } = useLanguage();
  
  // State management
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [tables, setTables] = useState<TableData[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [editingCategory, setEditingCategory] = useState<number | null>(null);
  const [editingTable, setEditingTable] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showAddCategory, setShowAddCategory] = useState<boolean>(false);
  const [showAddTable, setShowAddTable] = useState<number | null>(null);
  const [showBatchCreate, setShowBatchCreate] = useState<boolean>(false);
  

  const [qrModal, setQrModal] = useState<{
    isOpen: boolean;
    table: TableData | null;
  }>({
    isOpen: false,
    table: null
  });

  const [toggleLoading, setToggleLoading] = useState<{
    categories: Set<number>;
    tables: Set<number>;
  }>({
    categories: new Set(),
    tables: new Set()
  });

  const [newCategory, setNewCategory] = useState<{
    categoryName: string;
    colorCode: string;
    iconClass: string;
    isActive: boolean;
  }>({
    categoryName: '',
    colorCode: '#3b82f6',
    iconClass: 'table',
    isActive: true
  });

  const [newTable, setNewTable] = useState<{
    menuTableName: string;
    capacity: number;
    isActive: boolean;
  }>({
    menuTableName: '',
    capacity: 4,
    isActive: true
  });

  // Batch creation states
  const [batchItems, setBatchItems] = useState<BatchCreateMenuTableItemDto[]>([
    {
      categoryId: 0,
      quantity: 1,
      capacity: 4,
      displayOrder: null,
      isActive: true
    }
  ]);
  const [isBatchCreating, setIsBatchCreating] = useState<boolean>(false);

  const iconOptions: string[] = ['table', 'users', 'grid', 'building', 'settings'];

  // Effects
  useEffect(() => {
    fetchCategories();
    fetchTables();
  }, []);

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  // Utility functions
  const generateQRCodeImageUrl = (qrCode: string): string => {
    if (!qrCode) return '';
    
    const baseUrl = window.location.origin;
    const tableUrl = `${baseUrl}/table/qr/${qrCode}`;
    
    // Using QR Server API to generate QR code image
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(tableUrl)}`;
  };

  const getTablesForCategory = (categoryId: number): TableData[] => {
    return tables.filter(table => table.menuTableCategoryId === categoryId);
  };

  const filteredCategories = categories.filter(category => 
    category.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Batch creation methods
  const addBatchItem = () => {
    setBatchItems(prev => [...prev, {
      categoryId: 0,
      quantity: 1,
      capacity: 4,
      displayOrder: null,
      isActive: true
    }]);
  };

  const removeBatchItem = (index: number) => {
    setBatchItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateBatchItem = (index: number, field: keyof BatchCreateMenuTableItemDto, value: any) => {
    setBatchItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  // API functions
  const fetchCategories = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const categoriesData = await tableService.getCategories(true, true);
      setCategories(categoriesData as CategoryData[]);
      if (categoriesData.length > 0) {
        setExpandedCategories(new Set([categoriesData[0].id]));
      }
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      setError(t('BranchTableManagement.error.fetchCategoriesFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTables = async (): Promise<void> => {
    setError(null);
    
    try {
      const tablesData = await tableService.getTables(undefined, false, true);
      
      // Process tables and ensure QR code data is properly set
      const processedTables = tablesData.map(table => ({
        ...table,
        // Ensure we have the qrCode token from the API response
        qrCode: table.qrCode || '',
        // Generate the QR code image URL using the token
        qrCodeImageUrl: table.qrCode ? generateQRCodeImageUrl(table.qrCode) : ''
      }));
      
      setTables(processedTables);
    } catch (err: any) {
      console.error('Error fetching tables:', err);
      setError(t('BranchTableManagement.error.tableUpdated'));
    }
  };

  const handleRefresh = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await Promise.all([fetchCategories(), fetchTables()]);
      setSuccessMessage(t('BranchTableManagement.success.dataRefreshed'));
    } catch (err: any) {
      setError(t('BranchTableManagement.error.updateTableStatusFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  // Batch creation handler
  const handleBatchCreateTables = async (): Promise<void> => {
    const validItems = batchItems.filter(item => 
      item.categoryId > 0 && 
      item.quantity > 0 && 
      item.capacity > 0
    );

    if (validItems.length === 0) {
      setError(t('BranchTableManagement.error.addTableFailed'));
      return;
    }

    setIsBatchCreating(true);
    try {
      const batchData: CreateBatchMenuTableDto = {
        items: validItems
      };

      await tableService.createBatchTables(batchData);
      await fetchTables();
      await fetchCategories();
      
      setShowBatchCreate(false);
      setBatchItems([{
        categoryId: 0,
        quantity: 1,
        capacity: 4,
        displayOrder: null,
        isActive: true
      }]);
      
      setSuccessMessage(t('BranchTableManagement.success.tableAdded'));
    } catch (err: any) {
      console.error('Error creating batch tables:', err);
      setError(t('BranchTableManagement.error.batchCreateFailed'));
    } finally {
      setIsBatchCreating(false);
    }
  };

  // Event handlers
  const toggleCategory = (categoryId: number): void => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleToggleCategoryStatus = async (categoryId: number, newStatus: boolean): Promise<void> => {
    setToggleLoading(prev => ({
      ...prev,
      categories: new Set(prev.categories).add(categoryId)
    }));

    const currentCategory = categories.find(cat => cat.id === categoryId);
    if (!currentCategory) {
      console.error('Category not found for status toggle:', { categoryId });
      setToggleLoading(prev => {
        const newSet = new Set(prev.categories);
        newSet.delete(categoryId);
        return { ...prev, categories: newSet };
      });
      return;
    }

    const previousCategories = [...categories];
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId ? { ...cat, isActive: newStatus } : cat
    ));

    try {
      const updateData: UpdateTableCategoryDto = {
        id: currentCategory.id,
        categoryName: currentCategory.categoryName,
        colorCode: currentCategory.colorCode,
        iconClass: currentCategory.iconClass,
        isActive: newStatus,
        rowVersion: (currentCategory as any).rowVersion || ''
      };

      await tableService.updateCategory(categoryId, updateData);
      setSuccessMessage(t(`BranchTableManagement.success.category${newStatus ? 'Activated' : 'Deactivated'}`));
    } catch (err: any) {
      console.error('Error updating category status:', err);
      setCategories(previousCategories);
      setError(t('BranchTableManagement.error.updateCategoryStatusFailed'));
    } finally {
      setToggleLoading(prev => {
        const newSet = new Set(prev.categories);
        newSet.delete(categoryId);
        return { ...prev, categories: newSet };
      });
    }
  };

  const handleToggleTableStatus = async (tableId: number, newStatus: boolean): Promise<void> => {
    setToggleLoading(prev => ({
      ...prev,
      tables: new Set(prev.tables).add(tableId)
    }));

    const currentTable = tables.find(table => table.id === tableId);
    if (!currentTable) {
      console.error('Table not found for status toggle:', { tableId });
      setToggleLoading(prev => {
        const newSet = new Set(prev.tables);
        newSet.delete(tableId);
        return { ...prev, tables: newSet };
      });
      return;
    }

    try {
      const updateData: UpdateMenuTableDto = {
        id: currentTable.id,
        menuTableName: currentTable.menuTableName,
        menuTableCategoryId: currentTable.menuTableCategoryId,
        capacity: currentTable.capacity,
        isActive: newStatus,
        isOccupied: currentTable.isOccupied,
        rowVersion: currentTable.rowVersion || ''
      };

      await tableService.updateTable(tableId, updateData);
      await fetchTables();
      setSuccessMessage(t(`BranchTableManagement.success.table${newStatus ? 'Activated' : 'Deactivated'}`));
    } catch (err: any) {
      console.error('Error updating table status:', err);
      setError(t('BranchTableManagement.error.updateTableStatusFailed'));
    } finally {
      setToggleLoading(prev => {
        const newSet = new Set(prev.tables);
        newSet.delete(tableId);
        return { ...prev, tables: newSet };
      });
    }
  };

  const handleToggleTableOccupation = async (tableId: number, isOccupied: boolean): Promise<void> => {
    setToggleLoading(prev => ({
      ...prev,
      tables: new Set(prev.tables).add(tableId)
    }));

    const previousTables = [...tables];
    setTables(prev => prev.map(table => 
      table.id === tableId ? { ...table, isOccupied } : table
    ));

    try {
      await tableService.toggleTableOccupation(tableId, isOccupied);
      setSuccessMessage(t(`BranchTableManagement.success.table${isOccupied ? 'Occupied' : 'Available'}`));
    } catch (err: any) {
      console.error('Error updating table occupation:', err);
      setTables(previousTables);
      setError(t('BranchTableManagement.error.updateTableOccupationFailed'));
    } finally {
      setToggleLoading(prev => {
        const newSet = new Set(prev.tables);
        newSet.delete(tableId);
        return { ...prev, tables: newSet };
      });
    }
  };

  const handleAddCategory = async (): Promise<void> => {
    if (!newCategory.categoryName.trim()) {
      setError(t('BranchTableManagement.error.categoryNameRequired'));
      return;
    }

    const categoryData: CreateTableCategoryDto = {
      categoryName: newCategory.categoryName,
      colorCode: newCategory.colorCode,
      iconClass: newCategory.iconClass,
      displayOrder: categories.length,
      isActive: newCategory.isActive
    };

    setIsSaving(true);
    try {
      await tableService.createCategory(categoryData);
      await fetchCategories();
      setNewCategory({
        categoryName: '',
        colorCode: '#3b82f6',
        iconClass: 'table',
        isActive: true
      });
      setShowAddCategory(false);
      setSuccessMessage(t('BranchTableManagement.success.categoryAdded'));
    } catch (err: any) {
      console.error('Error adding category:', err);
      setError(t('BranchTableManagement.error.addCategoryFailed'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateCategory = async (categoryId: number, updatedData: Partial<CategoryData>): Promise<void> => {
    try {
      const currentCategory = categories.find(cat => cat.id === categoryId);
      if (!currentCategory) {
        setError(t('BranchTableManagement.error.categoryNotFound'));
        return;
      }

      const updateDto: UpdateTableCategoryDto = {
        id: categoryId,
        categoryName: updatedData.categoryName || currentCategory.categoryName,
        colorCode: updatedData.colorCode || currentCategory.colorCode,
        iconClass: updatedData.iconClass || currentCategory.iconClass,
        isActive: updatedData.isActive !== undefined ? updatedData.isActive : currentCategory.isActive,
        rowVersion: (currentCategory as any).rowVersion || ''
      };

      await tableService.updateCategory(categoryId, updateDto);
      await fetchCategories();
      setEditingCategory(null);
      setSuccessMessage(t('BranchTableManagement.success.categoryUpdated'));
    } catch (err: any) {
      console.error('Error updating category:', err);
      setError(t('BranchTableManagement.error.updateCategoryFailed'));
    }
  };

  const handleDeleteCategory = async (categoryId: number): Promise<void> => {
    const categoryTables = getTablesForCategory(categoryId);
    if (categoryTables.length > 0) {
      setError(t('BranchTableManagement.error.categoryHasTables'));
      return;
    }

    try {
      await tableService.deleteCategory(categoryId);
      await fetchCategories();
      setSuccessMessage(t('BranchTableManagement.success.categoryDeleted'));
    } catch (err: any) {
      console.error('Error deleting category:', err);
      setError(t('BranchTableManagement.error.deleteCategoryFailed'));
    }
  };

  const handleAddTable = async (categoryId: number): Promise<void> => {
    if (!newTable.menuTableName.trim()) {
      setError(t('BranchTableManagement.error.tableNameRequired'));
      return;
    }

    const tableData: CreateMenuTableDto = {
      menuTableName: newTable.menuTableName,
      menuTableCategoryId: categoryId,
      capacity: newTable.capacity,
      displayOrder: getTablesForCategory(categoryId).length,
      isActive: newTable.isActive
    };

    try {
      await tableService.createTable(tableData);
      await fetchTables();
      await fetchCategories();
      setNewTable({
        menuTableName: '',
        capacity: 4,
        isActive: true
      });
      setShowAddTable(null);
      setSuccessMessage(t('BranchTableManagement.success.tableAdded'));
    } catch (err: any) {
      console.error('Error adding table:', err);
      setError(t('BranchTableManagement.error.addTableFailed'));
    }
  };

  const handleUpdateTable = async (tableId: number, updatedData: Partial<TableData>): Promise<void> => {
    try {
      const currentTable = tables.find(t => t.id === tableId);
      if (!currentTable) {
        setError(t('BranchTableManagement.error.tableNotFound'));
        return;
      }

      const updateDto: UpdateMenuTableDto = {
        id: tableId,
        menuTableName: updatedData.menuTableName || currentTable.menuTableName,
        menuTableCategoryId: updatedData.menuTableCategoryId || currentTable.menuTableCategoryId,
        capacity: updatedData.capacity || currentTable.capacity,
        isActive: updatedData.isActive !== undefined ? updatedData.isActive : currentTable.isActive,
        isOccupied: updatedData.isOccupied !== undefined ? updatedData.isOccupied : currentTable.isOccupied,
        rowVersion: currentTable.rowVersion || ''
      };

      await tableService.updateTable(tableId, updateDto);
      await fetchTables();
      setEditingTable(null);
      setSuccessMessage(t('BranchTableManagement.success.tableUpdated'));
    } catch (err: any) {
      console.error('Error updating table:', err);
      setError(t('BranchTableManagement.error.updateTableFailed'));
    }
  };

  const handleDeleteTable = async (tableId: number): Promise<void> => {
    try {
      await tableService.deleteTable(tableId);
      await fetchTables();
      await fetchCategories();
      setSuccessMessage(t('BranchTableManagement.success.tableDeleted'));
    } catch (err: any) {
      console.error('Error deleting table:', err);
      setError(t('BranchTableManagement.error.deleteTableFailed'));
    }
  };

  const handleShowQRCode = (table: TableData): void => {
    setQrModal({
      isOpen: true,
      table
    });
  };

  const handleCloseQRModal = (): void => {
    setQrModal({
      isOpen: false,
      table: null
    });
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('BranchTableManagement.header')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {t('BranchTableManagement.subheader')}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className={`flex items-center `}>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Building className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('BranchTableManagement.totalCategories')}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{categories.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className={`flex items-center `}>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Grid className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('BranchTableManagement.totalTables')}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{tables.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className={`flex items-center `}>
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <UserX className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('BranchTableManagement.occupiedTables')}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {tables.filter(t => t.isOccupied).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className={`flex items-center `}>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <UserCheck className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('BranchTableManagement.availableTables')}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {tables.filter(t => t.isActive && !t.isOccupied).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className={`flex flex-col lg:flex-row gap-4 justify-between ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
            <div className="flex-1">
              <div className="relative">
                <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4`} />
                <input
                  type="text"
                  placeholder={t('BranchTableManagement.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                />
              </div>
            </div>

            <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className={`px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 flex items-center gap-2 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                {t('BranchTableManagement.refresh')}
              </button>
              
              <button
                onClick={() => setShowBatchCreate(true)}
                className={`px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 flex items-center gap-2 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <Copy className="h-4 w-4" />
                {t('BranchTableManagement.batchCreateTables')}
              </button>
              
              <button
                onClick={() => setShowAddCategory(true)}
                className={`px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 flex items-center gap-2 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <Plus className="h-4 w-4" />
                {t('BranchTableManagement.addCategory')}
              </button>
            </div>
          </div>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <AlertCircle className={`h-5 w-5 text-red-600 dark:text-red-400 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                <span className="text-red-700 dark:text-red-300">{error}</span>
              </div>
              <button onClick={() => setError(null)} className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <CheckCircle className={`h-5 w-5 text-green-600 dark:text-green-400 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                <span className="text-green-700 dark:text-green-300">{successMessage}</span>
              </div>
              <button onClick={() => setSuccessMessage(null)} className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {showAddCategory && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('BranchTableManagement.addCategoryTitle')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('BranchTableManagement.categoryNameLabel')}
                </label>
                <input
                  type="text"
                  value={newCategory.categoryName}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, categoryName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={t('BranchTableManagement.categoryNamePlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('BranchTableManagement.colorLabel')}
                </label>
                <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <input
                    type="color"
                    title='colorCode'
                    value={newCategory.colorCode}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, colorCode: e.target.value }))}
                    className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded-lg"
                  />
                  <input
                    type="text"
                    title='colorCode'
                    value={newCategory.colorCode}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, colorCode: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('BranchTableManagement.iconLabel')}
                </label>
                <select
                  title='iconClass'
                  value={newCategory.iconClass}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, iconClass: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {iconOptions.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>

              <div className={`flex items-end gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <button
                  onClick={handleAddCategory}
                  disabled={isSaving}
                  className={`px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {isSaving ? t('BranchTableManagement.saving') : t('BranchTableManagement.save')}
                </button>
                <button
                  onClick={() => setShowAddCategory(false)}
                  disabled={isSaving}
                  className={`px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <XCircle className="h-4 w-4" />
                  {t('BranchTableManagement.cancel')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Batch Create Modal */}
        {showBatchCreate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {t('BranchTableManagement.batchCreateTables')}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Create multiple tables across different categories at once
                    </p>
                  </div>
                  <button
                    onClick={() => setShowBatchCreate(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  {batchItems.map((item, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Category {index + 1}
                        </h4>
                        {batchItems.length > 1 && (
                          <button
                            onClick={() => removeBatchItem(index)}
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Category
                          </label>
                          <select
                            value={item.categoryId}
                            onChange={(e) => updateBatchItem(index, 'categoryId', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                          >
                            <option value={0}>Select Category</option>
                            {categories.filter(cat => cat.isActive).map(category => (
                              <option key={category.id} value={category.id}>
                                {category.categoryName}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Quantity
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="50"
                            value={item.quantity}
                            onChange={(e) => updateBatchItem(index, 'quantity', parseInt(e.target.value) || 1)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Capacity
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={item.capacity}
                            onChange={(e) => updateBatchItem(index, 'capacity', parseInt(e.target.value) || 1)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={addBatchItem}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Category
                  </button>

                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Tables: <span className="font-semibold">{batchItems.reduce((total, item) => total + (item.quantity || 0), 0)}</span>
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowBatchCreate(false)}
                    disabled={isBatchCreating}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBatchCreateTables}
                    disabled={isBatchCreating}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isBatchCreating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Grid className="h-4 w-4" />
                    )}
                    {isBatchCreating ? 'Creating...' : 'Create Tables'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 dark:text-blue-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">{t('BranchTableManagement.loading')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCategories.map((category) => (
              <CategorySection
                key={category.id}
                category={category}
                tables={getTablesForCategory(category.id)}
                isExpanded={expandedCategories.has(category.id)}
                isEditing={editingCategory === category.id}
                isToggling={toggleLoading.categories.has(category.id)}
                editingTable={editingTable}
                showAddTable={showAddTable}
                toggleLoading={toggleLoading}
                onToggleExpansion={toggleCategory}
                onStartEditing={setEditingCategory}
                onCancelEditing={() => setEditingCategory(null)}
                onUpdateCategory={handleUpdateCategory}
                onDeleteCategory={handleDeleteCategory}
                onToggleCategoryStatus={handleToggleCategoryStatus}
                onCategoryChange={(categoryId, updatedData) => {
                  setCategories(prev => prev.map(cat => 
                    cat.id === categoryId ? { ...cat, ...updatedData } : cat
                  ));
                }}
                onShowAddTable={setShowAddTable}
                onHideAddTable={() => setShowAddTable(null)}
                onAddTable={handleAddTable}
                onStartTableEdit={setEditingTable}
                onCancelTableEdit={() => setEditingTable(null)}
                onUpdateTable={handleUpdateTable}
                onDeleteTable={handleDeleteTable}
                onToggleTableStatus={handleToggleTableStatus}
                onToggleTableOccupation={handleToggleTableOccupation}
                onShowQRCode={handleShowQRCode}
                onTableChange={(tableId, updatedData) => {
                  setTables(prev => prev.map(t => 
                    t.id === tableId ? { ...t, ...updatedData } : t
                  ));
                }}
                newTable={newTable}
                onNewTableChange={(updatedData) => setNewTable(prev => ({ ...prev, ...updatedData }))}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <Building className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
              {t('BranchTableManagement.noCategories')}
            </p>
            <button
              onClick={() => setShowAddCategory(true)}
              className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              {t('BranchTableManagement.addFirstCategory')}
            </button>
          </div>
        )}

        {/* QR Code Modal */}
        {qrModal.table && (
          <QRCodeModal
            isOpen={qrModal.isOpen}
            onClose={handleCloseQRModal}
            table={qrModal.table}
            qrCodeImageUrl={generateQRCodeImageUrl(qrModal.table.qrCode || '')}
          />
        )}
      </div>
    </div>
  );
};

export default BranchTableManagement;