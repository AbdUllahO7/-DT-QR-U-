import React, { useState, useEffect } from 'react';
import { Trash2, RotateCcw, Search, Filter, Calendar, Package, FolderOpen, AlertCircle, CheckCircle, RefreshCw, X } from 'lucide-react';
import { productService } from '../../../services/productService';
import Sidebar from '../layout/Sidebar';

interface DeletedEntity {
  id: number;
  displayName: string;
  description: string | null;
  code: string | null;
  entityType: 'Category' | 'Product';
  deletedAt: string;
  deletedBy: string;
  branchId: number | null;
  branchName: string | null;
  restaurantId: number;
  restaurantName: string | null;
  categoryId: number | null;
  categoryName: string | null;
}

const RecycleBin: React.FC = () => {
  const [deletedItems, setDeletedItems] = useState<DeletedEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'Category' | 'Product'>('all');
  const [restoringIds, setRestoringIds] = useState<Set<number>>(new Set());
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Load deleted items
  const loadDeletedItems = async () => {
    setLoading(true);
    try {
      const [deletedCategories, deletedProducts] = await Promise.all([
        productService.getDeletedCategories(),
        productService.getDeletedProducts()
      ]);
      
      const allDeletedItems = [...deletedCategories, ...deletedProducts];
      setDeletedItems(allDeletedItems);
    } catch (error) {
      console.error('Error loading deleted items:', error);
      showNotification('error', 'Silinmiş öğeler yüklenirken hata oluştu');
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
        showNotification('success', `"${item.displayName}" kategorisi başarıyla geri yüklendi`);
      } else {
        await productService.restoreProduct(item.id);
        showNotification('success', `"${item.displayName}" ürünü başarıyla geri yüklendi`);
      }
      
      // Remove from list after successful restore
      setDeletedItems(prev => prev.filter(i => i.id !== item.id));
    } catch (error) {
      console.error('Error restoring item:', error);
      showNotification('error', 'Geri yükleme işlemi başarısız oldu');
    } finally {
      setRestoringIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }
  };

  // Filter items
  const filteredItems = deletedItems.filter(item => {
    const matchesSearch = item.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterType === 'all' || item.entityType === filterType;
    return matchesSearch && matchesFilter;
  });

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

  // Load data on component mount
  useEffect(() => {
    loadDeletedItems();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
            <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Geri Dönüşüm Kutusu
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Silinmiş kategoriler ve ürünleri yönetin
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
              placeholder="Öğe ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <select
            title='filter'
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as typeof filterType)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tümü</option>
              <option value="Category">Kategoriler</option>
              <option value="Product">Ürünler</option>
            </select>
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
            Yenile
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {deletedItems.filter(item => item.entityType === 'Product').length}
              </p>
              <p className="text-gray-600 dark:text-gray-400">Silinmiş Ürün</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <FolderOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {deletedItems.filter(item => item.entityType === 'Category').length}
              </p>
              <p className="text-gray-600 dark:text-gray-400">Silinmiş Kategori</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Trash2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {deletedItems.length}
              </p>
              <p className="text-gray-600 dark:text-gray-400">Toplam Silinmiş</p>
            </div>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center">
            <Trash2 className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm || filterType !== 'all' ? 'Sonuç bulunamadı' : 'Geri dönüşüm kutusu boş'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || filterType !== 'all' 
                ? 'Arama kriterlerinize uygun silinmiş öğe bulunmadı'
                : 'Henüz silinmiş kategori veya ürün bulunmuyor'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredItems.map((item) => (
              <div key={`${item.entityType}-${item.id}`} 
                   className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Icon */}
                    <div className={`p-2 rounded-lg ${
                      item.entityType === 'Category' 
                        ? 'bg-green-100 dark:bg-green-900/20' 
                        : 'bg-blue-100 dark:bg-blue-900/20'
                    }`}>
                      {item.entityType === 'Category' ? (
                        <FolderOpen className={`w-5 h-5 ${
                          item.entityType === 'Category' 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-blue-600 dark:text-blue-400'
                        }`} />
                      ) : (
                        <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {item.displayName}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          item.entityType === 'Category'
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                            : 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        }`}>
                          {item.entityType === 'Category' ? 'Kategori' : 'Ürün'}
                        </span>
                      </div>
                      
                      {item.description && (
                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                          {item.description}
                        </p>
                      )}
                      
                      {item.entityType === 'Product' && item.categoryName && (
                        <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">
                          Kategori: {item.categoryName}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>Silinme: {formatDate(item.deletedAt)}</span>
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
                      {restoringIds.has(item.id) ? 'Geri yükleniyor...' : 'Geri Yükle'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border max-w-md ${
          notification.type === 'success'
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
        }`}>
          <div className="flex items-center gap-3">
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            )}
            <p className={`font-medium ${
              notification.type === 'success'
                ? 'text-green-800 dark:text-green-200'
                : 'text-red-800 dark:text-red-200'
            }`}>
              {notification.message}
            </p>
            <button
              onClick={() => setNotification(null)}
              className={`ml-auto p-1 rounded-full hover:bg-opacity-20 ${
                notification.type === 'success'
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