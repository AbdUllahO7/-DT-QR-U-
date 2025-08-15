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
  Grid
} from 'lucide-react';
import { 
  CreateMenuTableDto, 
  UpdateMenuTableDto, 
  CreateTableCategoryDto,
  UpdateTableCategoryDto,
  tableService 
} from '../../../../services/Branch/branchTableService';

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
}

const BranchTableManagement: React.FC = () => {
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

  // New category form state
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

  // New table form state
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

  // Load initial data
  useEffect(() => {
    fetchCategories();
    fetchTables();
  }, []);

  // Auto-clear messages
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  // Data loading functions using services
  const fetchCategories = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const categoriesData = await tableService.getCategories(true, true);
      setCategories(categoriesData as CategoryData[]);
      
      // Expand first category if available
      if (categoriesData.length > 0) {
        setExpandedCategories(new Set([categoriesData[0].id]));
      }
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      setError('Failed to fetch categories');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTables = async (): Promise<void> => {
    setError(null);
    
    try {
      const tablesData = await tableService.getTables(undefined, false, true);
      setTables(tablesData);
    } catch (err: any) {
      console.error('Error fetching tables:', err);
      setError('Failed to fetch tables');
    }
  };

  // Function to load data - call this with your data
  const loadData = (categoriesData: CategoryData[], tablesData: TableData[]): void => {
    setCategories(categoriesData);
    setTables(tablesData);
    
    // Expand first category if available
    if (categoriesData.length > 0) {
      setExpandedCategories(new Set([categoriesData[0].id]));
    }
  };

  // Refresh all data
  const handleRefresh = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await Promise.all([fetchCategories(), fetchTables()]);
      setSuccessMessage('Data refreshed successfully');
    } catch (err: any) {
      setError('Failed to refresh data');
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

  // Category CRUD operations
  const handleAddCategory = async (): Promise<void> => {
    if (!newCategory.categoryName.trim()) {
      setError('Category name is required');
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
      
      // Refresh data after successful creation
      await fetchCategories();
      
      setNewCategory({
        categoryName: '',
        colorCode: '#3b82f6',
        iconClass: 'table',
        isActive: true
      });
      setShowAddCategory(false);
      setSuccessMessage('Category added successfully');
    } catch (err: any) {
      console.error('Error adding category:', err);
      setError(err.message || 'Failed to add category');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateCategory = async (categoryId: number, updatedData: Partial<CategoryData>): Promise<void> => {
    try {
      const currentCategory = categories.find(cat => cat.id === categoryId);
      if (!currentCategory) {
        setError('Category not found');
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
      
      // Refresh data after successful update
      await fetchCategories();
      
      setEditingCategory(null);
      setSuccessMessage('Category updated successfully');
    } catch (err: any) {
      console.error('Error updating category:', err);
      setError(err.message || 'Failed to update category');
    }
  };

  const handleDeleteCategory = async (categoryId: number): Promise<void> => {
    const categoryTables = getTablesForCategory(categoryId);
    if (categoryTables.length > 0) {
      setError('Cannot delete category with existing tables');
      return;
    }

    try {
      await tableService.deleteCategory(categoryId);
      
      // Refresh data after successful deletion
      await fetchCategories();
      
      setSuccessMessage('Category deleted successfully');
    } catch (err: any) {
      console.error('Error deleting category:', err);
      setError(err.message || 'Failed to delete category');
    }
  };

  const handleToggleCategoryStatus = async (categoryId: number, isActive: boolean): Promise<void> => {
    try {
      await tableService.toggleCategoryStatus(categoryId, isActive);
      
      // Update local state immediately for better UX
      setCategories(prev => prev.map(cat => 
        cat.id === categoryId ? { ...cat, isActive } : cat
      ));
      
      setSuccessMessage('Category status updated');
    } catch (err: any) {
      console.error('Error updating category status:', err);
      setError(err.message || 'Failed to update category status');
      
      // Refresh data on error to ensure consistency
      await fetchCategories();
    }
  };

  // Table CRUD operations using table service
  const handleAddTable = async (categoryId: number): Promise<void> => {
    if (!newTable.menuTableName.trim()) {
      setError('Table name is required');
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
      
      // Refresh data after successful creation
      await fetchTables();
      await fetchCategories(); // Refresh to update table counts

      setNewTable({
        menuTableName: '',
        capacity: 4,
        isActive: true
      });
      setShowAddTable(null);
      setSuccessMessage('Table added successfully');
    } catch (err: any) {
      console.error('Error adding table:', err);
      setError(err.message || 'Failed to add table');
    }
  };

  const handleUpdateTable = async (tableId: number, updatedData: Partial<TableData>): Promise<void> => {
    try {
      const currentTable = tables.find(t => t.id === tableId);
      if (!currentTable) {
        setError('Table not found');
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
      
      // Refresh data after successful update
      await fetchTables();
      
      setEditingTable(null);
      setSuccessMessage('Table updated successfully');
    } catch (err: any) {
      console.error('Error updating table:', err);
      setError(err.message || 'Failed to update table');
    }
  };

  const handleDeleteTable = async (tableId: number): Promise<void> => {
    try {
      await tableService.deleteTable(tableId);
      
      // Refresh data after successful deletion
      await fetchTables();
      await fetchCategories(); // Refresh to update table counts

      setSuccessMessage('Table deleted successfully');
    } catch (err: any) {
      console.error('Error deleting table:', err);
      setError(err.message || 'Failed to delete table');
    }
  };

  const handleToggleTableStatus = async (tableId: number, isActive: boolean): Promise<void> => {
    try {
      await tableService.toggleTableStatus(tableId, isActive);
      
      // Update local state immediately for better UX
      setTables(prev => prev.map(table => 
        table.id === tableId ? { ...table, isActive } : table
      ));
      
      setSuccessMessage('Table status updated');
    } catch (err: any) {
      console.error('Error updating table status:', err);
      setError(err.message || 'Failed to update table status');
      
      // Refresh data on error to ensure consistency
      await fetchTables();
    }
  };

  const handleToggleTableOccupation = async (tableId: number, isOccupied: boolean): Promise<void> => {
    try {
      await tableService.toggleTableOccupation(tableId, isOccupied);
      
      // Update local state immediately for better UX
      setTables(prev => prev.map(table => 
        table.id === tableId ? { ...table, isOccupied } : table
      ));
      
      setSuccessMessage('Table occupation updated');
    } catch (err: any) {
      console.error('Error updating table occupation:', err);
      setError(err.message || 'Failed to update table occupation');
      
      // Refresh data on error to ensure consistency
      await fetchTables();
    }
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Category & Table Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage restaurant categories and tables with accordion view
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Building className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Categories
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{categories.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Grid className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Tables
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{tables.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <UserX className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Occupied Tables
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {tables.filter(t => t.isOccupied).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <UserCheck className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Available Tables
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {tables.filter(t => t.isActive && !t.isOccupied).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 justify-between">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 flex items-center gap-2 transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              
              <button
                onClick={() => setShowAddCategory(true)}
                className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 flex items-center gap-2 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Category
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
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
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                <span className="text-green-700 dark:text-green-300">{successMessage}</span>
              </div>
              <button onClick={() => setSuccessMessage(null)} className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Add Category Form */}
        {showAddCategory && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New Category</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={newCategory.categoryName}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, categoryName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter category name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color
                </label>
                <div className="flex gap-2">
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
                  Icon
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

              <div className="flex items-end gap-2">
                <button
                  onClick={handleAddCategory}
                  disabled={isSaving}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => setShowAddCategory(false)}
                  disabled={isSaving}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <XCircle className="h-4 w-4" />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Categories Accordion */}
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 dark:text-blue-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Loading categories and tables...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCategories.map((category) => {
              const isExpanded = expandedCategories.has(category.id);
              const categoryTables = getTablesForCategory(category.id);
              const isEditing = editingCategory === category.id;

              return (
                <div
                  key={category.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  {/* Category Header */}
                  <div 
                    className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    onClick={() => !isEditing && toggleCategory(category.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
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
                          <div className="flex items-center gap-3">
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
                              {categoryTables.length} tables
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleCategoryStatus(category.id, !category.isActive);
                          }}
                          className="flex items-center gap-1"
                        >
                          {category.isActive ? (
                            <ToggleRight className="h-5 w-5 text-green-500" />
                          ) : (
                            <ToggleLeft className="h-5 w-5 text-gray-400" />
                          )}
                        </button>

                        {isEditing ? (
                          <div className="flex gap-1">
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
                          <div className="flex gap-1">
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

                  {/* Category Content */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                      {/* Add Table Button */}
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <button
                          onClick={() => setShowAddTable(category.id)}
                          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm"
                        >
                          <Plus className="h-4 w-4" />
                          Add Table
                        </button>
                      </div>

                      {/* Add Table Form */}
                      {showAddTable === category.id && (
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <input
                                type="text"
                                value={newTable.menuTableName}
                                onChange={(e) => setNewTable(prev => ({ ...prev, menuTableName: e.target.value }))}
                                placeholder="Table name"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              />
                            </div>
                            <div>
                              <input
                                type="number"
                                value={newTable.capacity}
                                onChange={(e) => setNewTable(prev => ({ ...prev, capacity: parseInt(e.target.value) || 1 }))}
                                placeholder="Capacity"
                                min="1"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleAddTable(category.id)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                              >
                                <Save className="h-4 w-4" />
                                Save
                              </button>
                              <button
                                onClick={() => setShowAddTable(null)}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2"
                              >
                                <XCircle className="h-4 w-4" />
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Tables Grid */}
                      <div className="p-4">
                        {categoryTables.length === 0 ? (
                          <div className="text-center py-8">
                            <Grid className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500 dark:text-gray-400">No tables in this category</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {categoryTables.map((table) => {
                              const isTableEditing = editingTable === table.id;

                              return (
                                <div
                                  key={table.id}
                                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                                >
                                  <div className="flex items-start justify-between mb-3">
                                    {isTableEditing ? (
                                      <div className="flex-1 mr-2">
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
                                          Capacity: {table.capacity}
                                        </p>
                                      </div>
                                    )}

                                    <div className="flex gap-1">
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
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-gray-500 dark:text-gray-400">Status</span>
                                      <button
                                        onClick={() => handleToggleTableStatus(table.id, !table.isActive)}
                                        className="flex items-center gap-1"
                                      >
                                        {table.isActive ? (
                                          <ToggleRight className="h-4 w-4 text-green-500" />
                                        ) : (
                                          <ToggleLeft className="h-4 w-4 text-gray-400" />
                                        )}
                                        <span className={`text-xs ${
                                          table.isActive ? 'text-green-600' : 'text-gray-500'
                                        }`}>
                                          {table.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                      </button>
                                    </div>

                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-gray-500 dark:text-gray-400">Occupation</span>
                                      <button
                                        onClick={() => handleToggleTableOccupation(table.id, !table.isOccupied)}
                                        disabled={!table.isActive}
                                        className="flex items-center gap-1"
                                      >
                                        {table.isOccupied ? (
                                          <UserX className="h-4 w-4 text-red-500" />
                                        ) : (
                                          <UserCheck className="h-4 w-4 text-green-500" />
                                        )}
                                        <span className={`text-xs ${
                                          table.isOccupied ? 'text-red-600' : 'text-green-600'
                                        }`}>
                                          {table.isOccupied ? 'Occupied' : 'Available'}
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
              No categories found
            </p>
            <button
              onClick={() => setShowAddCategory(true)}
              className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              Add Your First Category
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BranchTableManagement;