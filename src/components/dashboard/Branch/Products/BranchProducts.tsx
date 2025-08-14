import React, { useState, useEffect } from 'react';
import { 
  Check, 
  X, 
  Search, 
  Store, 
  Plus,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Loader2,
  Eye,
  Trash2,
  ArrowLeft,
  AlertTriangle
} from 'lucide-react';
import { branchCategoryService } from '../../../../services/Branch/BranchCategoryService';
import { ConfirmDeleteModal } from '../../../ConfirmDeleteModal';






interface Category {
  categoryId: number;
  categoryName: string;
  description: string;
  status: boolean;
  displayOrder: number;
  restaurantId: number;
  products: any[];
}

interface BranchCategory {
  branchCategoryId: number;
  branchId: number;
  categoryId: number;
  category: {
    categoryId: number;
    categoryName: string;
    status: boolean;
    displayOrder: number;
    restaurantId: number;
  };
  isActive: boolean;
  displayName: string;
  displayOrder: number;
}

interface BranchCategoriesProps {
  branchId?: number;
}

const BranchCategories: React.FC<BranchCategoriesProps> = ({ branchId = 1 }) => {
  // State management
  const [categories, setCategories] = useState<Category[]>([]);
  const [branchCategories, setBranchCategories] = useState<BranchCategory[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'available' | 'existing'>('available');
  
  // Modal states
  const [selectedCategoryForView, setSelectedCategoryForView] = useState<Category | null>(null);
  const [isViewingCategory, setIsViewingCategory] = useState(false);
  
  // Delete confirmation modal states
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    branchCategoryId: number | null;
    categoryName: string;
  }>({
    isOpen: false,
    branchCategoryId: null,
    categoryName: ''
  });
  
  // Loading and status states
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    fetchAvailableCategories();
    fetchBranchCategories();
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

  const fetchAvailableCategories = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const availableCategories = await branchCategoryService.getAvailableCategoriesForBranch();
      setCategories(availableCategories);
    } catch (err: any) {
      console.error('Error fetching available categories:', err);
      setError('Failed to load available categories');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBranchCategories = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await branchCategoryService.getBranchCategories();
      // Handle your API response structure
      const existingCategories = Array.isArray(response) ? response : response.count || [];
      setBranchCategories(existingCategories);
    } catch (err: any) {
      console.error('Error fetching existing branch categories:', err);
      setError('Failed to load branch categories');
    } finally {
      setIsLoading(false);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (branchCategoryId: number, categoryName: string) => {
    setDeleteModal({
      isOpen: true,
      branchCategoryId,
      categoryName
    });
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      branchCategoryId: null,
      categoryName: ''
    });
  };

  // Perform the actual delete operation
  const performDelete = async () => {
    if (!deleteModal.branchCategoryId) return;

    setIsDeleting(true);
    setError(null);
    
    try {
      // Call delete with just the id parameter (as shown in your API documentation)
      await branchCategoryService.deleteBranchCategory(deleteModal.branchCategoryId);
      
      // Remove from local state
      setBranchCategories(prev => 
        prev.filter(cat => cat.branchCategoryId !== deleteModal.branchCategoryId)
      );
      
      setSuccessMessage(`"${deleteModal.categoryName}" removed successfully!`);
      
    } catch (err: any) {
      console.error('Error deleting branch category:', err);
      
      // Provide specific error messages based on the error
      if (err.status === 404) {
        setError(`Category "${deleteModal.categoryName}" not found. It may have already been deleted.`);
        // Refresh the list in case it was deleted elsewhere
        await fetchBranchCategories();
      } else if (err.status === 403) {
        setError(`You don't have permission to delete "${deleteModal.categoryName}".`);
      } else if (err.status === 409) {
        setError(`Cannot delete "${deleteModal.categoryName}" because it's currently in use.`);
      } else {
        setError(`Failed to remove "${deleteModal.categoryName}". Please try again.`);
      }
      
      throw err; // Re-throw so the modal handles it
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewCategory = async (categoryId: number) => {
    setError(null);
    
    try {
      const category = await branchCategoryService.getBranchCategory(categoryId);
      if (category) {
        setSelectedCategoryForView(category);
        setIsViewingCategory(true);
      } else {
        setError(`Category with ID ${categoryId} not found`);
      }
    } catch (err: any) {
      console.error('Error fetching category details:', err);
      setError('Failed to load category details');
    }
  };

  const handleCategorySelect = (categoryId: number) => {
    const newSelectedCategories = new Set(selectedCategories);
    
    if (newSelectedCategories.has(categoryId)) {
      newSelectedCategories.delete(categoryId);
    } else {
      newSelectedCategories.add(categoryId);
    }
    
    setSelectedCategories(newSelectedCategories);
  };

  const handleSelectAll = () => {
    const allCategoryIds = new Set(availableCategoriesNotInBranch.map(cat => cat.categoryId));
    setSelectedCategories(allCategoryIds);
  };

  const handleClearAll = () => {
    setSelectedCategories(new Set());
  };

  const handleSave = async () => {
    if (!branchId) {
      setError('Branch ID is required to save categories');
      return;
    }

    if (selectedCategories.size === 0) {
      setError('Please select at least one category');
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      let createdCount = 0;
      
      for (const categoryId of selectedCategories) {
        const category = categories.find(cat => cat.categoryId === categoryId);
        
        if (!category) {
          console.warn('Category not found:', categoryId);
          continue;
        }

        try {
          const categoryData = {
            categoryId: category.categoryId,
            displayName: category.categoryName,
            isActive: true,
            displayOrder: category.displayOrder
          };

          await branchCategoryService.createBranchCategory(categoryData);
          createdCount++;
          
        } catch (err: any) {
          console.error('Error creating branch category:', categoryId, err);
          throw new Error(`Failed to create category: ${category.categoryName}`);
        }
      }
      
      setSuccessMessage(
        `Successfully added ${createdCount} categories to branch ${branchId}!`
      );
      
      // Clear selections after successful save
      setSelectedCategories(new Set());
      
      // Refresh branch categories list
      await fetchBranchCategories();
      
    } catch (err: any) {
      console.error('Error saving branch categories:', err);
      setError(err.message || 'Failed to add categories to branch');
    } finally {
      setIsSaving(false);
    }
  };

  // Filter functions
  const filteredCategories = categories.filter(category => 
    category?.categoryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category?.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBranchCategories = branchCategories.filter(branchCategory => 
    branchCategory?.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branchCategory?.category?.categoryName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get categories that are not already in branch
  const availableCategoriesNotInBranch = filteredCategories.filter(category => 
    !branchCategories.some(bc => bc.categoryId === category.categoryId)
  );

  // Category Details Modal
  const CategoryDetailsModal = ({ category }: { category: Category }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setIsViewingCategory(false)}
                className="mr-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h2 className="text-2xl font-bold">{category.categoryName}</h2>
                <p className="text-blue-100 mt-1">Category Details</p>
              </div>
            </div>
            <button
              onClick={() => setIsViewingCategory(false)}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Basic Info */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                <div className="mt-1">
                  <span className={`inline-flex px-3 py-1 text-sm rounded-full ${
                    category.status 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                      : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                  }`}>
                    {category.status ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Display Order</label>
                <p className="mt-1 text-gray-900 dark:text-white">{category.displayOrder}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Category ID</label>
                <p className="mt-1 text-gray-900 dark:text-white">{category.categoryId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Restaurant ID</label>
                <p className="mt-1 text-gray-900 dark:text-white">{category.restaurantId}</p>
              </div>
            </div>
            {category.description && (
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</label>
                <p className="mt-1 text-gray-900 dark:text-white">{category.description}</p>
              </div>
            )}
          </div>

          {/* Products */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Products ({category.products?.length || 0})
            </h3>
            {category.products && category.products.length > 0 ? (
              <div className="space-y-3">
                {category.products.map((product, index) => (
                  <div key={product.id || index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{product.name}</h4>
                        {product.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{product.description}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">${product.price?.toFixed(2) || '0.00'}</p>
                        <span className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${
                          product.status || product.isAvailable
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                        }`}>
                          {(product.status || product.isAvailable) ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Store className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No products in this category</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 flex justify-end space-x-3">
          <button
            onClick={() => setIsViewingCategory(false)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
          {activeTab === 'available' && !selectedCategories.has(category.categoryId) && (
            <button
              onClick={() => {
                handleCategorySelect(category.categoryId);
                setIsViewingCategory(false);
              }}
              className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              Add to Selection
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Render main component
  if (isViewingCategory && selectedCategoryForView) {
    return <CategoryDetailsModal category={selectedCategoryForView} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Branch Categories
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage categories for Branch {branchId}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Store className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Available Categories</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{categories.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Branch Categories</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{branchCategories.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Plus className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Selected to Add</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedCategories.size}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('available')}
                className={`flex-1 py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'available'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                Add Categories ({availableCategoriesNotInBranch.length} available)
              </button>
              <button
                onClick={() => setActiveTab('existing')}
                className={`flex-1 py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'existing'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                Manage Existing ({branchCategories.length})
              </button>
            </nav>
          </div>

          {/* Controls */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={activeTab === 'available' ? fetchAvailableCategories : fetchBranchCategories}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 flex items-center gap-2 transition-colors"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>

                {activeTab === 'available' && (
                  <>
                    <button
                      onClick={handleSelectAll}
                      disabled={isLoading || availableCategoriesNotInBranch.length === 0}
                      className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 disabled:opacity-50 transition-colors"
                    >
                      Select All
                    </button>

                    <button
                      onClick={handleClearAll}
                      disabled={selectedCategories.size === 0}
                      className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 disabled:opacity-50 transition-colors"
                    >
                      Clear
                    </button>

                    <button
                      onClick={handleSave}
                      disabled={isSaving || selectedCategories.size === 0}
                      className="px-6 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2 transition-colors"
                    >
                      {isSaving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      {isSaving ? 'Adding...' : `Add ${selectedCategories.size} Categories`}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Selected Categories Preview */}
            {activeTab === 'available' && selectedCategories.size > 0 && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                  Selected Categories ({selectedCategories.size}):
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Array.from(selectedCategories).map(categoryId => {
                    const category = categories.find(cat => cat.categoryId === categoryId);
                    return category ? (
                      <span
                        key={categoryId}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-800/50 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                      >
                        {category.categoryName}
                        <button
                          onClick={() => handleCategorySelect(categoryId)}
                          className="ml-2 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Messages */}
          {error && (
            <div className="mx-6 mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                  <span className="text-red-700 dark:text-red-300">{error}</span>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="mx-6 mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                  <span className="text-green-700 dark:text-green-300">{successMessage}</span>
                </div>
                <button
                  onClick={() => setSuccessMessage(null)}
                  className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 dark:text-blue-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Loading categories...</p>
              </div>
            ) : activeTab === 'available' ? (
              // Available Categories
              availableCategoriesNotInBranch.length === 0 ? (
                <div className="text-center py-12">
                  <Store className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                    {searchTerm ? 'No categories found matching your search' : 'All categories are already added to this branch'}
                  </p>
                  {!searchTerm && (
                    <button
                      onClick={() => setActiveTab('existing')}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                    >
                      View existing categories →
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid gap-4">
                  {availableCategoriesNotInBranch.map((category) => {
                    const isSelected = selectedCategories.has(category.categoryId);
                    
                    return (
                      <div
                        key={category.categoryId}
                        className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                          isSelected 
                            ? 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20' 
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <label className="flex items-center cursor-pointer flex-1">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleCategorySelect(category.categoryId)}
                              className="mr-4 h-5 w-5 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 bg-white dark:bg-gray-700"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {category.categoryName}
                                  </h3>
                                  {category.description && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                      {category.description}
                                    </p>
                                  )}
                                  <div className="flex items-center mt-2 space-x-4">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                      {category.products?.length || 0} products
                                    </span>
                                    <span className={`text-sm px-2 py-1 rounded-full ${
                                      category.status 
                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                                        : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                                    }`}>
                                      {category.status ? 'Active' : 'Inactive'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </label>
                          
                          <button
                            onClick={() => handleViewCategory(category.categoryId)}
                            className="ml-4 p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              // Existing Branch Categories
              filteredBranchCategories.length === 0 ? (
                <div className="text-center py-12">
                  <Store className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                    {searchTerm ? 'No branch categories found matching your search' : 'No categories added to this branch yet'}
                  </p>
                  {!searchTerm && (
                    <button
                      onClick={() => setActiveTab('available')}
                      className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                    >
                      Add Categories
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredBranchCategories.map((branchCategory) => {
                    return (
                      <div
                        key={branchCategory.branchCategoryId}
                        className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-4 transition-all hover:shadow-md"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {branchCategory.displayName}
                                </h3>
                                <div className="flex items-center mt-1 space-x-4">
                                  <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Original: {branchCategory.category.categoryName}
                                  </span>
                                  <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Order: {branchCategory.displayOrder}
                                  </span>
                                  <span className={`text-sm px-2 py-1 rounded-full ${
                                    branchCategory.isActive 
                                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                                      : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                                  }`}>
                                    {branchCategory.isActive ? 'Active' : 'Inactive'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => openDeleteModal(branchCategory.branchCategoryId, branchCategory.displayName)}
                            className="ml-4 p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                            title="Remove Category"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <ConfirmDeleteModal
          isOpen={deleteModal.isOpen}
          onClose={closeDeleteModal}
          onConfirm={performDelete}
          title="Delete Category"
          message={`Are you sure you want to remove "${deleteModal.categoryName}" from this branch?`}
          isSubmitting={isDeleting}
          itemType="category"
          itemName={deleteModal.categoryName}
        />
      </div>
    </div>
  );
};

export default BranchCategories;