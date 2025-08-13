import React, { useState, useEffect } from 'react';
import { 
  Check, 
  X, 
  Search, 
  Filter, 
  ShoppingCart, 
  Store, 
  Plus, 
  Minus,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Loader2,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { productService } from '../../../../services/productService';
import { logger } from '../../../../utils/logger';
import { branchCategoryService } from '../../../../services/Branch/BranchCategoryService';
import { branchProductService } from '../../../../services/Branch/BranchProductService';

interface Product {
  id: number;
  categoryId: number;
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
  imageUrl: string;
  status: boolean;
  displayOrder: number;
}

interface Category {
  categoryId: number;
  categoryName: string;
  description: string;
  isExpanded: boolean;
  products: Product[];
  status: boolean;
  displayOrder: number;
  restaurantId: number;
}

interface SelectedCategory {
  categoryId: number;
  displayName: string;
  isActive: boolean;
  displayOrder: number;
}

interface SelectedProduct {
  productId: number;
  branchCategoryId: number;
  price: number;
  isActive: boolean;
}

const BranchProducts: React.FC = () => {
  const { t } = useLanguage();
  
  // State management
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Map<number, SelectedCategory>>(new Map());
  const [selectedProducts, setSelectedProducts] = useState<Map<number, SelectedProduct>>(new Map());
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch restaurant categories and products
  useEffect(() => {
    fetchRestaurantData();
  }, []);

  const fetchRestaurantData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      logger.info('Fetching restaurant categories and products');
      const restaurantCategories = await productService.getCategories();
      
      setCategories(restaurantCategories);
      
      // Auto-expand all categories initially
      const categoryIds = new Set(restaurantCategories.map(cat => cat.categoryId));
      setExpandedCategories(categoryIds);
      
      logger.info('Restaurant data fetched successfully', { 
        categoriesCount: restaurantCategories.length,
        productsCount: restaurantCategories.reduce((total, cat) => total + cat.products.length, 0)
      });
    } catch (err: any) {
      logger.error('Error fetching restaurant data:', err);
      setError('Failed to load restaurant categories and products');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle category selection
  const handleCategorySelect = (category: Category) => {
    const newSelectedCategories = new Map(selectedCategories);
    
    if (newSelectedCategories.has(category.categoryId)) {
      // Deselect category and all its products
      newSelectedCategories.delete(category.categoryId);
      
      const newSelectedProducts = new Map(selectedProducts);
      category.products.forEach(product => {
        newSelectedProducts.delete(product.id);
      });
      setSelectedProducts(newSelectedProducts);
    } else {
      // Select category
      newSelectedCategories.set(category.categoryId, {
        categoryId: category.categoryId,
        displayName: category.categoryName,
        isActive: true,
        displayOrder: category.displayOrder
      });
    }
    
    setSelectedCategories(newSelectedCategories);
  };

  // Toggle product selection
  const handleProductSelect = (product: Product, category: Category) => {
    const newSelectedProducts = new Map(selectedProducts);
    const newSelectedCategories = new Map(selectedCategories);
    
    // Ensure category is selected when selecting a product
    if (!newSelectedCategories.has(category.categoryId)) {
      newSelectedCategories.set(category.categoryId, {
        categoryId: category.categoryId,
        displayName: category.categoryName,
        isActive: true,
        displayOrder: category.displayOrder
      });
      setSelectedCategories(newSelectedCategories);
    }
    
    if (newSelectedProducts.has(product.id)) {
      newSelectedProducts.delete(product.id);
    } else {
      newSelectedProducts.set(product.id, {
        productId: product.id,
        branchCategoryId: category.categoryId, // Will be updated after category creation
        price: product.price,
        isActive: true
      });
    }
    
    setSelectedProducts(newSelectedProducts);
  };

  // Update product price
  const handlePriceChange = (productId: number, newPrice: number) => {
    const newSelectedProducts = new Map(selectedProducts);
    const product = newSelectedProducts.get(productId);
    
    if (product) {
      product.price = newPrice;
      newSelectedProducts.set(productId, product);
      setSelectedProducts(newSelectedProducts);
    }
  };

  // Toggle category expansion
  const toggleCategoryExpansion = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // Save selected categories and products to branch
  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      logger.info('Starting branch categories and products creation', {
        selectedCategoriesCount: selectedCategories.size,
        selectedProductsCount: selectedProducts.size
      });
      
      // Step 1: Create branch categories
      const branchCategoryMap = new Map<number, number>(); // restaurantCategoryId -> branchCategoryId
      
      for (const [categoryId, categoryData] of selectedCategories) {
        try {
          const branchCategory = await branchCategoryService.createBranchCategory(1, { // Assuming branchId = 1
            categoryId: categoryData.categoryId,
            displayName: categoryData.displayName,
            isActive: categoryData.isActive,
            displayOrder: categoryData.displayOrder
          });
          
          // Store the mapping for products
          branchCategoryMap.set(categoryId, branchCategory.categoryId);
          
          logger.info('Branch category created', { 
            originalId: categoryId, 
            branchCategoryId: branchCategory.categoryId 
          });
        } catch (err: any) {
          logger.error('Error creating branch category:', err);
          throw new Error(`Failed to create category: ${categoryData.displayName}`);
        }
      }
      
      // Step 2: Create branch products
      let createdProductsCount = 0;
      
      for (const [productId, productData] of selectedProducts) {
        try {
          const branchCategoryId = branchCategoryMap.get(productData.branchCategoryId);
          
          if (!branchCategoryId) {
            logger.error('Branch category ID not found for product', { 
              productId, 
              originalCategoryId: productData.branchCategoryId 
            });
            continue;
          }
          
          await branchProductService.createBranchProduct({
            productId: productData.productId,
            branchCategoryId: branchCategoryId,
            price: productData.price,
            isActive: productData.isActive
          });
          
          createdProductsCount++;
          
          logger.info('Branch product created', { 
            productId, 
            branchCategoryId 
          });
        } catch (err: any) {
          logger.error('Error creating branch product:', err);
          throw new Error(`Failed to create product with ID: ${productId}`);
        }
      }
      
      setSuccessMessage(
        `Successfully created ${selectedCategories.size} categories and ${createdProductsCount} products for the branch!`
      );
      
      // Clear selections after successful save
      setSelectedCategories(new Map());
      setSelectedProducts(new Map());
      
      logger.info('Branch categories and products creation completed successfully');
      
    } catch (err: any) {
      logger.error('Error saving branch data:', err);
      setError(err.message || 'Failed to save categories and products to branch');
    } finally {
      setIsSaving(false);
    }
  };

  // Filter categories and products based on search term
  const filteredCategories = categories.filter(category => {
    const categoryMatch = category.categoryName.toLowerCase().includes(searchTerm.toLowerCase());
    const productMatch = category.products.some(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return categoryMatch || productMatch;
  });

  // Calculate statistics
  const totalProducts = categories.reduce((total, cat) => total + cat.products.length, 0);
  const selectedCategoriesCount = selectedCategories.size;
  const selectedProductsCount = selectedProducts.size;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('branch.products.title') || 'Branch Products Management'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('branch.products.subtitle') || 'Select categories and products from your restaurant to add to this branch'}
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <Store className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Categories</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{categories.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <ShoppingCart className="h-8 w-8 text-green-600 dark:text-green-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Products</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <Check className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Selected Categories</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedCategoriesCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <Plus className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Selected Products</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedProductsCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder={t('search.placeholder') || 'Search categories and products...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <button
          onClick={fetchRestaurantData}
          disabled={isLoading}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {t('refresh') || 'Refresh'}
        </button>

        <button
          onClick={handleSave}
          disabled={isSaving || selectedCategoriesCount === 0}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isSaving ? (t('saving') || 'Saving...') : (t('save.to.branch') || 'Save to Branch')}
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
            <span className="text-red-700 dark:text-red-300">{error}</span>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
            <span className="text-green-700 dark:text-green-300">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {isLoading ? (
          <div className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 dark:text-blue-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {t('loading.restaurant.data') || 'Loading restaurant data...'}
            </p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="p-8 text-center">
            <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm ? (t('no.results') || 'No categories or products found') : (t('no.data') || 'No data available')}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredCategories.map((category) => {
              const isExpanded = expandedCategories.has(category.categoryId);
              const isCategorySelected = selectedCategories.has(category.categoryId);
              const selectedProductsInCategory = category.products.filter(p => selectedProducts.has(p.id)).length;
              
              return (
                <div key={category.categoryId} className="p-4">
                  {/* Category Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center flex-1">
                      <button
                        onClick={() => toggleCategoryExpansion(category.categoryId)}
                        className="mr-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-500" />
                        )}
                      </button>
                      
                      <label className="flex items-center cursor-pointer flex-1">
                        <input
                          type="checkbox"
                          checked={isCategorySelected}
                          onChange={() => handleCategorySelect(category)}
                          className="mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {category.categoryName}
                          </h3>
                          {category.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {category.description}
                            </p>
                          )}
                        </div>
                      </label>
                    </div>
                    
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedProductsInCategory > 0 && (
                        <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full mr-2">
                          {selectedProductsInCategory} selected
                        </span>
                      )}
                      {category.products.length} products
                    </div>
                  </div>

                  {/* Products List */}
                  {isExpanded && (
                    <div className="ml-6 space-y-3">
                      {category.products.map((product) => {
                        const isProductSelected = selectedProducts.has(product.id);
                        const selectedProduct = selectedProducts.get(product.id);
                        
                        return (
                          <div
                            key={product.id}
                            className={`p-3 rounded-lg border ${
                              isProductSelected
                                ? 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/20'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <label className="flex items-center cursor-pointer flex-1">
                                <input
                                  type="checkbox"
                                  checked={isProductSelected}
                                  onChange={() => handleProductSelect(product, category)}
                                  className="mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-3">
                                    {product.imageUrl && (
                                      <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-10 h-10 rounded-lg object-cover"
                                      />
                                    )}
                                    <div>
                                      <h4 className="font-medium text-gray-900 dark:text-white">
                                        {product.name}
                                      </h4>
                                      {product.description && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                          {product.description}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </label>
                              
                              <div className="flex items-center gap-3">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  Original: ${product.price.toFixed(2)}
                                </div>
                                
                                {isProductSelected && (
                                  <div className="flex items-center gap-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                      Branch Price:
                                    </label>
                                    <input
                                      title='number'
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      value={selectedProduct?.price || product.price}
                                      onChange={(e) => handlePriceChange(product.id, parseFloat(e.target.value) || 0)}
                                      className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BranchProducts;