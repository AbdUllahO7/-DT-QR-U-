import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Trash2, RotateCcw, Search, Calendar, Package, FolderOpen, AlertCircle, CheckCircle, RefreshCw, X, Building2, Table } from 'lucide-react';
import { productService } from '../../../services/productService';
import { branchService } from '../../../services/branchService';
import { useLanguage } from '../../../contexts/LanguageContext';
import { branchProductService } from '../../../services/Branch/BranchProductService';
import { branchCategoryService } from '../../../services/Branch/BranchCategoryService';
import { tableService } from '../../../services/Branch/branchTableService';

interface DeletedEntity {
  id: number;
  displayName: string;
  description: string | null;
  code: string | null;
  entityType: 'Category' | 'Product' | 'Branch' | 'MenuTable' | 'BranchProduct' | 'BranchCategory' | 'MenuTableCategory';
  deletedAt: string;
  deletedBy: string;
  branchId: number | null;
  branchName: string | null;
  restaurantId: number | null;
  restaurantName: string | null;
  categoryId: number | null;
  categoryName: string | null;
}

const RecycleBin: React.FC = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const [deletedItems, setDeletedItems] = useState<DeletedEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [restoringIds, setRestoringIds] = useState<Set<number>>(new Set());
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Get the source parameter and branchId from location state
  const source = location.state?.source || 'all';
  const branchId = location.state?.branchId;

  console.log("branchId",branchId)

  // Load deleted items based on source parameter
  const loadDeletedItems = async () => {
    setLoading(true);
    try {
      let allDeletedItems: DeletedEntity[] = [];

      switch (source) {
        case 'products':
          // eslint-disable-next-line no-case-declarations
          const [deletedCategories, deletedProducts] = await Promise.all([
            productService.getDeletedCategories(),
            productService.getDeletedProducts(),
          ]);
          allDeletedItems = [...deletedCategories, ...deletedProducts];
          break;

        case 'branches':
          // eslint-disable-next-line no-case-declarations
          const [deletedBranches] = await Promise.all([
            branchService.getDeletedBranches(),
          ]);
          allDeletedItems = [...deletedBranches];
          break;

        case 'tables':
          // eslint-disable-next-line no-case-declarations
          const [deletedTables] = await Promise.all([
            tableService.getDeletedTables(branchId),
          ]);
          allDeletedItems = [...deletedTables] as DeletedEntity[];
          break;

        case 'branchProducts':
          // eslint-disable-next-line no-case-declarations
          const [deletedBranchProducts, deletedBranchCategories] = await Promise.all([
            branchProductService.getDeletedBranchProducts(),
            branchCategoryService.getDeletedBranchCategories(),
          ]);
          allDeletedItems = [...deletedBranchProducts, ...deletedBranchCategories] as DeletedEntity[];
          break;

        case 'tableCategories':
          // eslint-disable-next-line no-case-declarations
          const [deletedTableCategories, deletedTableItems] = await Promise.all([
            tableService.getDeletedTableCategories(),
            tableService.getDeletedTables(branchId),
          ]);
          allDeletedItems = [...deletedTableCategories, ...deletedTableItems] as DeletedEntity[];
          break;

        case 'all':
        default:
          // eslint-disable-next-line no-case-declarations
          const [allCategories, allProducts, allBranches, allTables, allBranchProducts, allBranchCategories, allTableCategories] = await Promise.all([
            productService.getDeletedCategories(),
            productService.getDeletedProducts(),
            branchService.getDeletedBranches(),
            tableService.getDeletedTables(),
            branchProductService.getDeletedBranchProducts(),
            branchCategoryService.getDeletedBranchCategories(),
            tableService.getDeletedTableCategories()
          ]);
          allDeletedItems = [...allCategories, ...allProducts, ...allBranches, ...allTables, ...allBranchProducts, ...allBranchCategories, ...allTableCategories];
          break;
      }

      setDeletedItems(allDeletedItems);
    } catch (error) {
      console.error('Error loading deleted items:', error);
      showNotification('error', t('recycleBin.errors.loadingError'));
    } finally {
      setLoading(false);
    }
  };

  // Show notification
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Restore item
  const handleRestore = async (item: DeletedEntity) => {
    setRestoringIds(prev => new Set([...prev, item.id]));

    try {
      if (item.entityType === 'Category') {
        await productService.restoreCategory(item.id);
        showNotification('success', t('recycleBin.restore.successCategory').replace('{name}', item.displayName));
      } else if (item.entityType === 'Product') {
        await productService.restoreProduct(item.id);
        showNotification('success', t('recycleBin.restore.successProduct').replace('{name}', item.displayName));
      } else if (item.entityType === 'Branch') {
        await branchService.restoreBranch(item.id);
        showNotification('success', t('recycleBin.restore.successBranch').replace('{name}', item.displayName));
      } else if (item.entityType === 'MenuTable') {
        await tableService.restoreTable(item.id, branchId);
        showNotification('success', t('recycleBin.restore.successTable').replace('{name}', item.displayName));
      } else if (item.entityType === 'BranchProduct') {
        await branchProductService.restoreBranchProduct(item.id);
        showNotification('success', t('recycleBin.restore.successProduct').replace('{name}', item.displayName));
      } else if (item.entityType === 'BranchCategory') {
        await branchCategoryService.restoreBranchCategory(item.id);
        showNotification('success', t('recycleBin.restore.successBranchCategory').replace('{name}', item.displayName));
      } else if (item.entityType === 'MenuTableCategory') {
        await tableService.restoreTableCategory(item.id);
        showNotification('success', t('recycleBin.restore.successTableCategory').replace('{name}', item.displayName));
      }

      // Remove from list after successful restore
      setDeletedItems(prev => prev.filter(i => i.id !== item.id));
    } catch (error) {
      console.error('Error restoring item:', error);
      showNotification('error', t('recycleBin.restore.error'));
    } finally {
      setRestoringIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }
  };

  // Filter items - only by search term now
  const filteredItems = deletedItems.filter(item => {
    const matchesSearch = item.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  // Calculate group statistics
  const group1Count = deletedItems.filter(item => 
    ['Branch', 'Category', 'Product', 'MenuTable'].includes(item.entityType)
  ).length;

  const group2Count = deletedItems.filter(item => 
    ['BranchProduct', 'BranchCategory', 'MenuTableCategory'].includes(item.entityType)
  ).length;

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get icon and color based on entity type
  const getEntityConfig = (entityType: string) => {
    switch (entityType) {
      case 'Category':
        return {
          icon: FolderOpen,
          color: 'green',
          bgClass: 'bg-green-100 dark:bg-green-900/20',
          textClass: 'text-green-600 dark:text-green-400',
          badgeClass: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300',
          label: t('recycleBin.entityTypes.category')
        };
      case 'Product':
        return {
          icon: Package,
          color: 'blue',
          bgClass: 'bg-blue-100 dark:bg-blue-900/20',
          textClass: 'text-blue-600 dark:text-blue-400',
          badgeClass: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300',
          label: t('recycleBin.entityTypes.product')
        };
      case 'Branch':
        return {
          icon: Building2,
          color: 'purple',
          bgClass: 'bg-purple-100 dark:bg-purple-900/20',
          textClass: 'text-purple-600 dark:text-purple-400',
          badgeClass: 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300',
          label: t('recycleBin.entityTypes.branch')
        };
      case 'MenuTable':
        return {
          icon: Table,
          color: 'orange',
          bgClass: 'bg-orange-100 dark:bg-orange-900/20',
          textClass: 'text-orange-600 dark:text-orange-400',
          badgeClass: 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300',
          label: t('recycleBin.entityTypes.table')
        };
      case 'BranchProduct':
        return {
          icon: Package,
          color: 'indigo',
          bgClass: 'bg-indigo-100 dark:bg-indigo-900/20',
          textClass: 'text-indigo-600 dark:text-indigo-400',
          badgeClass: 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300',
          label: t('recycleBin.entityTypes.branchProduct')
        };
      case 'BranchCategory':
        return {
          icon: FolderOpen,
          color: 'teal',
          bgClass: 'bg-teal-100 dark:bg-teal-900/20',
          textClass: 'text-teal-600 dark:text-teal-400',
          badgeClass: 'bg-teal-100 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300',
          label: t('recycleBin.entityTypes.branchCategory')
        };
      case 'MenuTableCategory':
        return {
          icon: FolderOpen,
          color: 'amber',
          bgClass: 'bg-amber-100 dark:bg-amber-900/20',
          textClass: 'text-amber-600 dark:text-amber-400',
          badgeClass: 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300',
          label: t('recycleBin.entityTypes.tableCategory')
        };
      default:
        return {
          icon: Package,
          color: 'gray',
          bgClass: 'bg-gray-100 dark:bg-gray-900/20',
          textClass: 'text-gray-600 dark:text-gray-400',
          badgeClass: 'bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300',
          label: t('recycleBin.entityTypes.other')
        };
    }
  };

  // Get header title based on source
  const getHeaderTitle = () => {
    switch (source) {
      case 'products':
        return t('recycleBin.titleProducts');
      case 'branches':
        return t('recycleBin.titleBranches');
      case 'tables':
        return t('recycleBin.titleTables');
      case 'branchProducts':
        return t('recycleBin.titleBranchProducts');
      case 'tableCategories':
        return t('recycleBin.titleTableCategories');
      default:
        return t('recycleBin.title');
    }
  };

  // Get header description based on source
  const getHeaderDescription = () => {
    switch (source) {
      case 'products':
        return t('recycleBin.descriptionProducts');
      case 'branches':
        return t('recycleBin.descriptionBranches');
      case 'tables':
        return t('recycleBin.descriptionTables');
      case 'branchProducts':
        return t('recycleBin.descriptionBranchProducts');
      case 'tableCategories':
        return t('recycleBin.descriptionTableCategories');
      default:
        return t('recycleBin.description');
    }
  };

  // Load data on component mount or when source/branchId changes
  useEffect(() => {
    loadDeletedItems();
  }, [source, branchId]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
            <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {getHeaderTitle()}
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          {getHeaderDescription()}
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder={t('recycleBin.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          {/* Refresh Button */}
          <button
            onClick={loadDeletedItems}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 
                     disabled:bg-gray-400 dark:disabled:bg-gray-600
                     text-white rounded-lg transition-colors duration-200"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            {t('recycleBin.refresh')}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Group 1 */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl shadow-sm border border-blue-200 dark:border-blue-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-200 dark:bg-blue-800/50 rounded-lg">
              <Building2 className="w-5 h-5 text-blue-700 dark:text-blue-300" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {group1Count}
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">{t('recycleBin.stats.group1')}</p>
              <p className="text-xs text-blue-600 dark:text-blue-400">{t('recycleBin.stats.group1Desc')}</p>
            </div>
          </div>
        </div>

        {/* Group 2 */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl shadow-sm border border-purple-200 dark:border-purple-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-200 dark:bg-purple-800/50 rounded-lg">
              <Package className="w-5 h-5 text-purple-700 dark:text-purple-300" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {group2Count}
              </p>
              <p className="text-sm text-purple-700 dark:text-purple-300">{t('recycleBin.stats.group2')}</p>
              <p className="text-xs text-purple-600 dark:text-purple-400">{t('recycleBin.stats.group2Desc')}</p>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl shadow-sm border border-red-200 dark:border-red-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-200 dark:bg-red-800/50 rounded-lg">
              <Trash2 className="w-5 h-5 text-red-700 dark:text-red-300" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                {deletedItems.length}
              </p>
              <p className="text-sm text-red-700 dark:text-red-300">{t('recycleBin.stats.totalDeleted')}</p>
              <p className="text-xs text-red-600 dark:text-red-400">{t('recycleBin.stats.totalDesc')}</p>
            </div>
          </div>
        </div>

       
      </div>

      {/* Items List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600 dark:text-gray-400">{t('recycleBin.loading')}</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center">
            <Trash2 className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm ? t('recycleBin.empty.titleFiltered') : t('recycleBin.empty.title')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm 
                ? t('recycleBin.empty.descriptionFiltered')
                : t('recycleBin.empty.description')
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredItems.map((item) => {
              const config = getEntityConfig(item.entityType);
              const IconComponent = config.icon;

              return (
                <div key={`${item.entityType}-${item.id}`}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Icon */}
                      <div className={`p-2 rounded-lg ${config.bgClass}`}>
                        <IconComponent className={`w-5 h-5 ${config.textClass}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {item.displayName}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.badgeClass}`}>
                            {config.label}
                          </span>
                        </div>

                        {item.description && (
                          <p className="text-gray-600 dark:text-gray-400 mb-2">
                            {item.description}
                          </p>
                        )}

                        {/* Additional context information */}
                        <div className="flex flex-col gap-1 mb-2">
                          {(item.entityType === 'Product' || item.entityType === 'BranchProduct' || item.entityType === 'MenuTable') && item.categoryName && (
                            <p className="text-sm text-gray-500 dark:text-gray-500">
                              {t('recycleBin.contextInfo.category')} {item.categoryName}
                            </p>
                          )}

                          {(item.entityType === 'BranchProduct' || item.entityType === 'BranchCategory' || item.entityType === 'MenuTable' || item.entityType === 'MenuTableCategory') && item.branchName && (
                            <p className="text-sm text-gray-500 dark:text-gray-500">
                              {t('recycleBin.contextInfo.branch')} {item.branchName}
                            </p>
                          )}

                          {item.entityType === 'Branch' && item.restaurantName && (
                            <p className="text-sm text-gray-500 dark:text-gray-500">
                              {t('recycleBin.contextInfo.restaurant')} {item.restaurantName}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>{t('recycleBin.deletedAt')} {formatDate(item.deletedAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRestore(item)}
                        disabled={restoringIds.has(item.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 
                                 disabled:bg-gray-400 dark:disabled:bg-gray-600
                                 text-white rounded-lg transition-colors duration-200
                                 disabled:cursor-not-allowed"
                      >
                        {restoringIds.has(item.id) ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <RotateCcw className="w-4 h-4" />
                        )}
                        {restoringIds.has(item.id) ? t('recycleBin.restore.restoring') : t('recycleBin.restore.button')}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border max-w-md ${notification.type === 'success'
            ? 'bg-green-900 dark:bg-green-900 border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
          }`}>
          <div className="flex items-center gap-3">
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            )}
            <p className={`font-medium ${notification.type === 'success'
                ? 'text-green-200 dark:text-green-200'
                : 'text-red-800 dark:text-red-200'
              }`}>
              {notification.message}
            </p>
            <button
              onClick={() => setNotification(null)}
              className={`ml-auto p-1 rounded-full hover:bg-opacity-20 ${notification.type === 'success'
                  ? 'hover:bg-green-600 text-green-600 dark:text-green-400'
                  : 'hover:bg-red-600 text-red-600 dark:text-red-400'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecycleBin;