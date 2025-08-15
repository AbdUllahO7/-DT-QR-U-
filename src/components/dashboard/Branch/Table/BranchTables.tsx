import React, { useState, useEffect } from 'react';
import { 
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Users,
  ToggleLeft,
  ToggleRight,
  Settings,
  AlertCircle,
  CheckCircle,
  Loader2,
  X,
  RefreshCw,
  UserX,
  UserCheck,
  Building,
  ChevronDown,
  ChevronRight,
  Save,
  XCircle,
  Grid,
  QrCode,
  Download,
  Share2,
  Copy
} from 'lucide-react';
import { 
  CreateMenuTableDto, 
  UpdateMenuTableDto, 
  CreateTableCategoryDto,
  UpdateTableCategoryDto,
  tableService 
} from '../../../../services/Branch/branchTableService';
import { useLanguage } from '../../../../contexts/LanguageContext';

// Interfaces for API data - matching the service types
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
  qrCodeUrl?: string;
}

// QR Code Modal Component
const QRCodeModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  table: TableData;
  qrCodeUrl: string;
}> = ({ isOpen, onClose, table, qrCodeUrl }) => {
  const { t } = useLanguage();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  if (!isOpen) return null;

  const handleDownloadQR = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(qrCodeUrl);
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
      await navigator.clipboard.writeText(qrCodeUrl);
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
              src={qrCodeUrl} 
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
              <Download className="h-4 w-4" />
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
                <Copy className="h-4 w-4" />
                {t('BranchTableManagement.copyQRUrl')}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const BranchTableManagement: React.FC = () => {
  const { t, isRTL } = useLanguage();
  
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

  const iconOptions: string[] = ['table', 'users', 'grid', 'building', 'settings'];

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

  const generateQRCodeUrl = (table: TableData): string => {
    const baseUrl = window.location.origin;
    const tableUrl = `${baseUrl}/menu/table/${table.id}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(tableUrl)}`;
  };

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
      const tablesWithQR = tablesData.map(table => ({
        ...table,
        qrCodeUrl: generateQRCodeUrl(table)
      }));
      setTables(tablesWithQR);
    } catch (err: any) {
      console.error('Error fetching tables:', err);
      setError(t('BranchTableManagement.error.fetchTablesFailed'));
    }
  };

  const loadData = (categoriesData: CategoryData[], tablesData: TableData[]): void => {
    setCategories(categoriesData);
    const tablesWithQR = tablesData.map(table => ({
      ...table,
      qrCodeUrl: generateQRCodeUrl(table)
    }));
    setTables(tablesWithQR);
    if (categoriesData.length > 0) {
      setExpandedCategories(new Set([categoriesData[0].id]));
    }
  };

  const handleRefresh = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await Promise.all([fetchCategories(), fetchTables()]);
      setSuccessMessage(t('BranchTableManagement.success.dataRefreshed'));
    } catch (err: any) {
      setError(t('BranchTableManagement.error.refreshFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCategory = (categoryId: number): void => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const getTablesForCategory = (categoryId: number): TableData[] => {
    return tables.filter(table => table.menuTableCategoryId === categoryId);
  };

  const filteredCategories = categories.filter(category => 
    category.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleCategoryStatus = async (categoryId: number, newStatus: boolean): Promise<void> => {
    setToggleLoading(prev => ({
      ...prev,
      categories: new Set(prev.categories).add(categoryId)
    }));

    const previousCategories = [...categories];
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId ? { ...cat, isActive: newStatus } : cat
    ));

    try {
      await tableService.toggleCategoryStatus(categoryId, newStatus);
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

    const previousTables = [...tables];
    setTables(prev => prev.map(table => 
      table.id === tableId ? { ...table, isActive: newStatus } : table
    ));

    try {
      await tableService.toggleTableStatus(tableId, newStatus);
      setSuccessMessage(t(`BranchTableManagement.success.table${newStatus ? 'Activated' : 'Deactivated'}`));
    } catch (err: any) {
      console.error('Error updating table status:', err);
      setTables(previousTables);
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
        menuTableName :  updatedData.menuTableName || currentTable.menuTableName,
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

  const getIconComponent = (iconClass: string): JSX.Element => {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      table: Grid,
      users: Users,
      grid: Building,
      building: Building,
      settings: Settings
    };
    const IconComponent = iconMap[iconClass] || Grid;
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('BranchTableManagement.header')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {t('BranchTableManagement.subheader')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
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
            <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
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
            <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
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
            <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
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
                onClick={() => setShowAddCategory(true)}
                className={`px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 flex items-center gap-2 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <Plus className="h-4 w-4" />
                {t('BranchTableManagement.addCategory')}
              </button>
            </div>
          </div>
        </div>

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
                    title='color'
                    type="color"
                    value={newCategory.colorCode}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, colorCode: e.target.value }))}
                    className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded-lg"
                  />
                  <input
                    title='colorCode'
                    type="text"
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

        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 dark:text-blue-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">{t('BranchTableManagement.loading')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCategories.map((category) => {
              const isExpanded = expandedCategories.has(category.id);
              const categoryTables = getTablesForCategory(category.id);
              const isEditing = editingCategory === category.id;
              const isCategoryToggling = toggleLoading.categories.has(category.id);

              return (
                <div
                  key={category.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <div 
                    className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    onClick={() => !isEditing && toggleCategory(category.id)}
                  >
                    <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          {isExpanded ? (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-gray-500" />
                          )}
                          <div 
                            className="p-2 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${category.colorCode}20`, color: category.colorCode }}
                          >
                            {getIconComponent(category.iconClass)}
                          </div>
                        </div>

                        {isEditing ? (
                          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <input
                              title='text'
                              type="text"
                              value={category.categoryName}
                              onChange={(e) => {
                                setCategories(prev => prev.map(cat => 
                                  cat.id === category.id ? { ...cat, categoryName: e.target.value } : cat
                                ));
                              }}
                              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <input
                              title='colorCode'
                              type="color"
                              value={category.colorCode}
                              onChange={(e) => {
                                setCategories(prev => prev.map(cat => 
                                  cat.id === category.id ? { ...cat, colorCode: e.target.value } : cat
                                ));
                              }}
                              className="w-8 h-8 border border-gray-300 dark:border-gray-600 rounded"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        ) : (
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {category.categoryName}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {categoryTables.length} {t('BranchTableManagement.tablesCount')}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleCategoryStatus(category.id, !category.isActive);
                          }}
                          disabled={isCategoryToggling}
                          className="flex items-center gap-1"
                        >
                          {isCategoryToggling ? (
                            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                          ) : category.isActive ? (
                            <ToggleRight className="h-5 w-5 text-green-500" />
                          ) : (
                            <ToggleLeft className="h-5 w-5 text-gray-400" />
                          )}
                        </button>

                        {isEditing ? (
                          <div className={`flex gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateCategory(category.id, category);
                              }}
                              className="p-1 text-green-600 hover:text-green-800"
                            >
                              <Save className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingCategory(null);
                              }}
                              className="p-1 text-gray-600 hover:text-gray-800"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className={`flex gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingCategory(category.id);
                              }}
                              className="p-1 text-yellow-600 hover:text-yellow-800"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCategory(category.id);
                              }}
                              className="p-1 text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <button
                          onClick={() => setShowAddTable(category.id)}
                          className={`px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}
                        >
                          <Plus className="h-4 w-4" />
                          {t('BranchTableManagement.addTable')}
                        </button>
                      </div>

                      {showAddTable === category.id && (
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <input
                                type="text"
                                value={newTable.menuTableName}
                                onChange={(e) => setNewTable(prev => ({ ...prev, menuTableName: e.target.value }))}
                                placeholder={t('BranchTableManagement.tableNamePlaceholder')}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              />
                            </div>
                            <div>
                              <input
                                type="number"
                                value={newTable.capacity}
                                onChange={(e) => setNewTable(prev => ({ ...prev, capacity: parseInt(e.target.value) || 1 }))}
                                placeholder={t('BranchTableManagement.capacityPlaceholder')}
                                min="1"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              />
                            </div>
                            <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <button
                                onClick={() => handleAddTable(category.id)}
                                className={`px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                              >
                                <Save className="h-4 w-4" />
                                {t('BranchTableManagement.save')}
                              </button>
                              <button
                                onClick={() => setShowAddTable(null)}
                                className={`px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                              >
                                <XCircle className="h-4 w-4" />
                                {t('BranchTableManagement.cancel')}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="p-4">
                        {categoryTables.length === 0 ? (
                          <div className="text-center py-8">
                            <Grid className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500 dark:text-gray-400">{t('BranchTableManagement.noTables')}</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {categoryTables.map((table) => {
                              const isTableEditing = editingTable === table.id;
                              const isTableToggling = toggleLoading.tables.has(table.id);

                              return (
                                <div
                                  key={table.id}
                                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                                >
                                  <div className={`flex items-start justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    {isTableEditing ? (
                                      <div className={`flex-1 ${isRTL ? 'ml-2' : 'mr-2'}`}>
                                        <input
                                          title='menuTableName'
                                          type="text"
                                          value={table.menuTableName}
                                          onChange={(e) => {
                                            setTables(prev => prev.map(t => 
                                              t.id === table.id ? { ...t, menuTableName: e.target.value } : t
                                            ));
                                          }}
                                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                        />
                                        <input
                                          title='number'
                                          type="number"
                                          value={table.capacity}
                                          onChange={(e) => {
                                            setTables(prev => prev.map(t => 
                                              t.id === table.id ? { ...t, capacity: parseInt(e.target.value) || 1 } : t
                                            ));
                                          }}
                                          min="1"
                                          className="w-full mt-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                        />
                                      </div>
                                    ) : (
                                      <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white">
                                          {table.menuTableName}
                                        </h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                          {t('BranchTableManagement.capacityPlaceholder')}: {table.capacity}
                                        </p>
                                      </div>
                                    )}

                                    <div className={`flex gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                      {isTableEditing ? (
                                        <>
                                          <button
                                            onClick={() => handleUpdateTable(table.id, table)}
                                            className="p-1 text-green-600 hover:text-green-800"
                                          >
                                            <Save className="h-3 w-3" />
                                          </button>
                                          <button
                                            onClick={() => setEditingTable(null)}
                                            className="p-1 text-gray-600 hover:text-gray-800"
                                          >
                                            <XCircle className="h-3 w-3" />
                                          </button>
                                        </>
                                      ) : (
                                        <>
                                          <button
                                            onClick={() => handleShowQRCode(table)}
                                            className="p-1 text-blue-600 hover:text-blue-800"
                                            title={t('BranchTableManagement.showQRCode')}
                                          >
                                            <QrCode className="h-3 w-3" />
                                          </button>
                                          <button
                                            onClick={() => setEditingTable(table.id)}
                                            className="p-1 text-yellow-600 hover:text-yellow-800"
                                          >
                                            <Edit className="h-3 w-3" />
                                          </button>
                                          <button
                                            onClick={() => handleDeleteTable(table.id)}
                                            className="p-1 text-red-600 hover:text-red-800"
                                          >
                                            <Trash2 className="h-3 w-3" />
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                                      <span className="text-xs text-gray-500 dark:text-gray-400">{t('BranchTableManagement.status')}</span>
                                      <button
                                        onClick={() => handleToggleTableStatus(table.id, !table.isActive)}
                                        disabled={isTableToggling}
                                        className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}
                                      >
                                        {isTableToggling ? (
                                          <Loader2 className="h-3 w-3 animate-spin text-gray-400" />
                                        ) : table.isActive ? (
                                          <ToggleRight className="h-4 w-4 text-green-500" />
                                        ) : (
                                          <ToggleLeft className="h-4 w-4 text-gray-400" />
                                        )}
                                        <span className={`text-xs ${
                                          table.isActive ? 'text-green-600' : 'text-gray-500'
                                        }`}>
                                          {table.isActive ? t('BranchTableManagement.active') : t('BranchTableManagement.inactive')}
                                        </span>
                                      </button>
                                    </div>

                                    <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                                      <span className="text-xs text-gray-500 dark:text-gray-400">{t('BranchTableManagement.occupation')}</span>
                                      <button
                                        onClick={() => handleToggleTableOccupation(table.id, !table.isOccupied)}
                                        disabled={!table.isActive || isTableToggling}
                                        className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}
                                      >
                                        {table.isOccupied ? (
                                          <UserX className="h-4 w-4 text-red-500" />
                                        ) : (
                                          <UserCheck className="h-4 w-4 text-green-500" />
                                        )}
                                        <span className={`text-xs ${
                                          table.isOccupied ? 'text-red-600' : 'text-green-600'
                                        }`}>
                                          {table.isOccupied ? t('BranchTableManagement.occupied') : t('BranchTableManagement.available')}
                                        </span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

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

        {qrModal.table && (
          <QRCodeModal
            isOpen={qrModal.isOpen}
            onClose={handleCloseQRModal}
            table={qrModal.table}
            qrCodeUrl={qrModal.table.qrCodeUrl || ''}
          />
        )}
      </div>
    </div>
  );
};

export default BranchTableManagement;