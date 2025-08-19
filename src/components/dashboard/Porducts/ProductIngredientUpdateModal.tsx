import React, { useState, useEffect } from 'react';
import { X, Package, Search, Loader2, AlertCircle, Check } from 'lucide-react';
import { productService } from '../../../services/productService';
import { logger } from '../../../utils/logger';
import { useLanguage } from '../../../contexts/LanguageContext';
import { ingredientsService } from '../../../services/IngredientsService';

interface Ingredient {
  id: number;
  name: string;
  unit: string;
  price?: number;
}

interface ProductIngredient {
  ingredientId: number;
  quantity: number;
  unit: string;
}

interface ProductIngredientUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  productId: number;
  productName: string;
}

const ProductIngredientUpdateModal: React.FC<ProductIngredientUpdateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  productId,
  productName
}) => {
  const { t, isRTL } = useLanguage();
  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<Map<number, ProductIngredient>>(new Map());
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, productId]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load all available ingredients and current product ingredients in parallel
      const [allIngredientsResponse, productIngredientsResponse] = await Promise.all([
        fetchAllIngredients(), 
        productService.getProductIngredients(productId) 
      ]);

      setAllIngredients(allIngredientsResponse);

      // Create a map of currently selected ingredients
      const selectedMap = new Map<number, ProductIngredient>();
      productIngredientsResponse.forEach((ingredient: any) => {
        selectedMap.set(ingredient.ingredientId || ingredient.id, {
          ingredientId: ingredient.ingredientId || ingredient.id,
          quantity: ingredient.quantity || 1,
          unit: ingredient.unit || 'adet'
        });
      });
      
      setSelectedIngredients(selectedMap);
      
      logger.info('Malzemeler başarıyla yüklendi', { 
        totalIngredients: allIngredientsResponse.length,
        selectedCount: selectedMap.size,
        productId
      });
    } catch (err: any) {
      logger.error('Malzemeler yüklenirken hata:', err);
      setError(t('ProductIngredientUpdateModal.errors.loadingIngredients'));
    } finally {
      setLoading(false);
    }
  };

  // Fetch all available ingredients using your productService
  const fetchAllIngredients = async (): Promise<Ingredient[]> => {
    try {
      const response = await ingredientsService.getIngredients();

      // Transform API response to match Ingredient interface
      return response.map((item: any) => ({
        id: item.ingredientId || item.id,
        name: item.ingredientName || item.name || 'Unknown Ingredient',
        unit: item.unit || 'adet',
        price: item.price || 0
      }));

    } catch (error) {
      logger.error('Tüm malzemeler alınamadı:', error);
      throw error;
    }
  };

  const handleIngredientToggle = (ingredient: Ingredient) => {
    const newSelected = new Map(selectedIngredients);
    
    if (newSelected.has(ingredient.id)) {
      // Remove ingredient
      newSelected.delete(ingredient.id);
    } else {
      // Add ingredient with default quantity
      newSelected.set(ingredient.id, {
        ingredientId: ingredient.id,
        quantity: 1,
        unit: ingredient.unit
      });
    }
    
    setSelectedIngredients(newSelected);
  };

  const handleQuantityChange = (ingredientId: number, quantity: number) => {
    const newSelected = new Map(selectedIngredients);
    const existing = newSelected.get(ingredientId);
    
    if (existing && quantity > 0) {
      newSelected.set(ingredientId, {
        ...existing,
        quantity: quantity
      });
      setSelectedIngredients(newSelected);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      // Get current product ingredients to compare
      const currentIngredients = await productService.getProductIngredients(productId);
      const currentIds = new Set(currentIngredients.map((ing: any) => ing.ingredientId || ing.id));
      const selectedIds = new Set(selectedIngredients.keys());

      // Find ingredients to remove
      const toRemove = Array.from(currentIds).filter(id => !selectedIds.has(id));
      
      // Find ingredients to add
      const toAdd = Array.from(selectedIngredients.entries())
        .filter(([id]) => !currentIds.has(id))
        .map(([id, ingredient]) => ingredient);

      // Remove ingredients that are no longer selected
      for (const ingredientId of toRemove) {
        await productService.removeIngredientFromProduct(productId, ingredientId);
      }

      // Add new ingredients
      if (toAdd.length > 0) {
        await productService.addIngredientsToProduct(productId, toAdd);
      }

      // Update quantities for existing ingredients
      const toUpdate = Array.from(selectedIngredients.entries())
        .filter(([id]) => currentIds.has(id));

      for (const [id, ingredient] of toUpdate) {
        const current = currentIngredients.find((ing: any) => (ing.ingredientId || ing.id) === id);
        if (current && current.quantity !== ingredient.quantity) {
          // If your API supports updating ingredient quantities, call that here
          // For now, we'll remove and re-add with new quantity
          await productService.removeIngredientFromProduct(productId, id);
          await productService.addIngredientsToProduct(productId, [ingredient]);
        }
      }

      logger.info('Product ingredients updated successfully', {
        productId,
        removed: toRemove.length,
        added: toAdd.length,
        updated: toUpdate.length
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      logger.error('Error saving ingredients:', err);
      setError(t('ProductIngredientUpdateModal.errors.savingIngredients'));
    } finally {
      setSaving(false);
    }
  };

  const filteredIngredients = allIngredients.filter(ingredient =>
    ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white dark:bg-gray-800 rounded-lg w-full max-w-3xl mx-4 max-h-[90vh] overflow-hidden flex flex-col ${isRTL ? 'text-right' : 'text-left'}`}>
        {/* Header */}
        <div className={`flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('ProductIngredientUpdateModal.title')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {productName} (ID: {productId})
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label={t('ProductIngredientUpdateModal.accessibility.closeModal')}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Search */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
              <input
                type="text"
                placeholder={t('ProductIngredientUpdateModal.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label={t('ProductIngredientUpdateModal.accessibility.searchInput')}
                className={`w-full py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                disabled={loading}
              />
            </div>
            
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {selectedIngredients.size} {t('ProductIngredientUpdateModal.selectedCount')}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className={`mx-6 mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-2" />
                <p className="text-gray-600 dark:text-gray-400">
                  {t('ProductIngredientUpdateModal.loadingIngredients')}
                </p>
              </div>
            </div>
          ) : (
            /* Ingredients List */
            <div className="flex-1 overflow-y-auto p-6">
              {filteredIngredients.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchQuery ? t('ProductIngredientUpdateModal.noIngredientsFoundSearch') : t('ProductIngredientUpdateModal.noIngredientsFound')}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredIngredients.map((ingredient) => {
                    const isSelected = selectedIngredients.has(ingredient.id);
                    const selectedIngredient = selectedIngredients.get(ingredient.id);
                    
                    return (
                      <div
                        key={ingredient.id}
                        className={`relative border rounded-lg p-4 transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'border-primary-300 dark:border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                        onClick={() => handleIngredientToggle(ingredient)}
                        role="button"
                        tabIndex={0}
                        aria-label={t('ProductIngredientUpdateModal.accessibility.ingredientCard')}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleIngredientToggle(ingredient);
                          }
                        }}
                      >
                        {/* Selection Indicator */}
                        <div className={`absolute top-3 w-5 h-5 rounded-full flex items-center justify-center ${
                          isSelected
                            ? 'bg-primary-600 text-white'
                            : 'border-2 border-gray-300 dark:border-gray-600'
                        } ${isRTL ? 'left-3' : 'right-3'}`}>
                          {isSelected && <Check className="w-3 h-3" />}
                          <span className="sr-only">
                            {isSelected ? t('ProductIngredientUpdateModal.accessibility.selectedIndicator') : t('ProductIngredientUpdateModal.accessibility.unselectedIndicator')}
                          </span>
                        </div>
                        
                        {/* Ingredient Info */}
                        <div className={isRTL ? 'pl-8' : 'pr-8'}>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                            {ingredient.name}
                          </h4>
                          <div className={`flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                            <span>{t('ProductIngredientUpdateModal.unit')} {ingredient.unit}</span>
                            {ingredient.price && (
                              <span>{t('ProductIngredientUpdateModal.price')} {ingredient.price.toFixed(2)} ₺</span>
                            )}
                          </div>
                          
                          {/* Quantity Input */}
                          {isSelected && (
                            <div className="mt-3" onClick={(e) => e.stopPropagation()}>
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t('ProductIngredientUpdateModal.quantity')} ({ingredient.unit})
                              </label>
                              <input
                                type="number"
                                min="1"
                                step="1"
                                value={selectedIngredient?.quantity || 1}
                                onChange={(e) => handleQuantityChange(ingredient.id, parseFloat(e.target.value) || 0)}
                                aria-label={t('ProductIngredientUpdateModal.accessibility.quantityInput')}
                                className="w-24 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`flex justify-between items-center p-6 border-t border-gray-200 dark:border-gray-700 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {selectedIngredients.size} {t('ProductIngredientUpdateModal.selectedCount')}
          </div>
          
          <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button
              onClick={onClose}
              disabled={saving}
              aria-label={t('ProductIngredientUpdateModal.accessibility.cancelButton')}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              {t('ProductIngredientUpdateModal.cancel')}
            </button>
            <button
              onClick={handleSave}
              disabled={saving || loading}
              aria-label={t('ProductIngredientUpdateModal.accessibility.saveButton')}
              className="px-6 py-2 text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('ProductIngredientUpdateModal.saving')}
                </>
              ) : (
                t('ProductIngredientUpdateModal.save')
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductIngredientUpdateModal;