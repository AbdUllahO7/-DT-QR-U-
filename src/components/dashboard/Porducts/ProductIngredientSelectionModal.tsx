import React, { useState, useEffect } from 'react';
import { X, Search, Check, Package, AlertCircle, Loader2, Plus } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { logger } from '../../../utils/logger';
import { ingredientsService } from '../../../services/IngredientsService';
import { productService } from '../../../services/productService';
import { Ingredient, ProductIngredientSelectionModalProps, SelectedIngredient } from '../../../types/BranchManagement/type';

// Types


const ProductIngredientSelectionModal: React.FC<ProductIngredientSelectionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  productId,
  productName
}) => {
  const { t, isRTL } = useLanguage();

  // State
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<SelectedIngredient[]>([]);
  const [currentProductIngredients, setCurrentProductIngredients] = useState<SelectedIngredient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Predefined units for selection - now using translation keys
  const getUnitOptions = () => [
    { value: 'g', label: t('productIngredientModal.units.grams') },
    { value: 'ml', label: t('productIngredientModal.units.milliliters') },
    { value: 'piece', label: t('productIngredientModal.units.pieces') },
    { value: 'tbsp', label: t('productIngredientModal.units.tablespoons') },
    { value: 'tsp', label: t('productIngredientModal.units.teaspoons') },
    { value: 'cup', label: t('productIngredientModal.units.cups') },
    { value: 'kg', label: t('productIngredientModal.units.kilograms') },
    { value: 'l', label: t('productIngredientModal.units.liters') }
  ];

  // Load ingredients and current product ingredients
  const loadData = async () => {
    if (!isOpen) return;

    setLoading(true);
    setError(null);

    try {
      // Load all available ingredients
      const fetchedIngredients = await ingredientsService.getIngredients();
      setIngredients(fetchedIngredients);
      // Load current product ingredients if editing
      try {
        const currentIngredients = await productService.getProductIngredients(productId);
        // Assuming the API returns ingredients with quantity and unit
        const current = currentIngredients.map((ing: any) => ({
          ingredientId: ing.ingredientId || ing.id,
          quantity: ing.quantity || 0,
          unit: ing.unit || 'piece'
        }));
        setCurrentProductIngredients(current);
        setSelectedIngredients([...current]);
        
        logger.info('Mevcut ürün malzemeleri yüklendi', { 
          productId, 
          currentIngredients: current 
        });
      } catch (ingredientError) {
        logger.info('Ürün malzemeleri bulunamadı (yeni ürün olabilir)', { productId });
        setCurrentProductIngredients([]);
        setSelectedIngredients([]);
      }

      logger.info('Malzeme verileri yüklendi', { 
        ingredientCount: fetchedIngredients.length 
      });

    } catch (err: any) {
      logger.error('Malzeme verileri yüklenirken hata:', err);
      setError(t('productIngredientModal.errors.loadingData'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
      setSearchQuery('');
    }
  }, [isOpen, productId]);

  // Handle ingredient selection
  const toggleIngredient = (ingredientId: number) => {
    setSelectedIngredients(prev => {
      if (prev.some(ing => ing.ingredientId === ingredientId)) {
        return prev.filter(ing => ing.ingredientId !== ingredientId);
      } else {
        return [...prev, { ingredientId, quantity: 1, unit: 'piece' }]; // Default values
      }
    });
  };

  // Handle quantity and unit changes
  const updateIngredient = (ingredientId: number, field: 'quantity' | 'unit', value: string | number) => {
    setSelectedIngredients(prev =>
      prev.map(ing =>
        ing.ingredientId === ingredientId
          ? { ...ing, [field]: field === 'quantity' ? parseFloat(value as string) || 0 : value }
          : ing
      )
    );
  };

  // Save ingredient selection using remove approach
  const handleSave = async () => {
    setSaving(true);
    setError(null);

    // Validate inputs for selected ingredients
    for (const ing of selectedIngredients) {
      if (ing.quantity <= 0) {
        setError(t('productIngredientModal.errors.quantityRequired'));
        setSaving(false);
        return;
      }
      if (!ing.unit) {
        setError(t('productIngredientModal.errors.unitRequired'));
        setSaving(false);
        return;
      }
    }

    try {
      // Step 1: Remove ingredients that are no longer selected
      const currentIngredientIds = currentProductIngredients.map(ing => ing.ingredientId);
      const selectedIngredientIds = selectedIngredients.map(ing => ing.ingredientId);
      const ingredientsToRemove = currentIngredientIds.filter(id => !selectedIngredientIds.includes(id));

      logger.info('Silinecek malzemeler', { 
        productId, 
        ingredientsToRemove,
        currentCount: currentIngredientIds.length,
        selectedCount: selectedIngredientIds.length
      });

      // Remove ingredients one by one
      for (const ingredientId of ingredientsToRemove) {
        try {
          await productService.removeIngredientFromProduct(productId, ingredientId);
          logger.info('Malzeme başarıyla silindi', { productId, ingredientId });
        } catch (removeError: any) {
          logger.error('Malzeme silinirken hata:', { productId, ingredientId, error: removeError });
          // Continue with other removals even if one fails
        }
      }

      // Step 2: Add new ingredients that were selected
      const newIngredients = selectedIngredients.filter(selected => 
        !currentIngredientIds.includes(selected.ingredientId)
      );

      logger.info('Eklenecek yeni malzemeler', { 
        productId, 
        newIngredients: newIngredients.map(ing => ing.ingredientId),
        count: newIngredients.length
      });

      if (newIngredients.length > 0) {
        await productService.addIngredientsToProduct(productId, newIngredients);
        logger.info('Yeni malzemeler başarıyla eklendi', { 
          productId, 
          addedCount: newIngredients.length 
        });
      }

      // Step 3: Update existing ingredients that have quantity/unit changes
      const existingIngredients = selectedIngredients.filter(selected => 
        currentIngredientIds.includes(selected.ingredientId)
      );

      for (const updatedIngredient of existingIngredients) {
        const currentIngredient = currentProductIngredients.find(
          curr => curr.ingredientId === updatedIngredient.ingredientId
        );
        
        // Check if quantity or unit changed
        if (currentIngredient && 
            (currentIngredient.quantity !== updatedIngredient.quantity || 
             currentIngredient.unit !== updatedIngredient.unit)) {
          
          try {
            // Remove the old ingredient
            await productService.removeIngredientFromProduct(productId, updatedIngredient.ingredientId);
            // Add it back with new values
            await productService.addIngredientsToProduct(productId, [updatedIngredient]);
            
            logger.info('Malzeme miktarı/birimi güncellendi', { 
              productId, 
              ingredientId: updatedIngredient.ingredientId,
              oldQuantity: currentIngredient.quantity,
              newQuantity: updatedIngredient.quantity,
              oldUnit: currentIngredient.unit,
              newUnit: updatedIngredient.unit
            });
          } catch (updateError: any) {
            logger.error('Malzeme güncellenirken hata:', { 
              productId, 
              ingredientId: updatedIngredient.ingredientId, 
              error: updateError 
            });
          }
        }
      }
      
      logger.info('Ürün malzemeleri başarıyla kaydedildi', { 
        productId, 
        totalSelected: selectedIngredients.length,
        removed: ingredientsToRemove.length,
        added: newIngredients.length,
        updated: existingIngredients.length
      });
      
      onSuccess();
      onClose();
    } catch (err: any) {
      logger.error('Malzemeler kaydedilirken hata:', err);
      setError(t('productIngredientModal.errors.savingIngredients'));
    } finally {
      setSaving(false);
    }
  };

  // Filter ingredients based on search
  const filteredIngredients = ingredients.filter(ingredient =>
    ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get allergen info for display
  const getAllergenInfo = (allergenIds: number[]) => {
    if (!allergenIds?.length) return '';
    return t('productIngredientModal.allergenInfo.count', { count: allergenIds.length });
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ingredient-modal-title"
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 
              id="ingredient-modal-title"
              className="text-xl font-semibold text-gray-800 dark:text-white"
            >
              {t('productIngredientModal.title')}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              <strong>{productName}</strong> {t('productIngredientModal.subtitle')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label={t('productIngredientModal.accessibility.closeModal')}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Error Alert */}
          {error && (
            <div 
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 flex items-center gap-2"
              role="alert"
              aria-live="polite"
            >
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <span className="text-red-700 dark:text-red-400">{error}</span>
            </div>
          )}

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 ${
                isRTL ? 'right-3' : 'left-3'
              }`} />
              <input
                type="text"
                placeholder={t('productIngredientModal.search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                  isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'
                }`}
                aria-label={t('productIngredientModal.accessibility.searchInput')}
              />
            </div>
          </div>

          {/* Selection Summary */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('productIngredientModal.summary.selectedCount')}: <strong>{selectedIngredients.length}</strong>
              </span>
              {JSON.stringify(selectedIngredients) !== JSON.stringify(currentProductIngredients) && (
                <span className="text-xs text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded">
                  {t('productIngredientModal.summary.hasChanges')}
                </span>
              )}
            </div>
          </div>

          {/* Ingredients List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                <span className="ml-2 text-gray-600 dark:text-gray-400">
                  {t('productIngredientModal.loading.ingredients')}
                </span>
              </div>
            ) : filteredIngredients.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
                <Package className="w-8 h-8 mb-2 opacity-50" />
                <p>
                  {searchQuery 
                    ? t('productIngredientModal.emptyState.noSearchResults') 
                    : t('productIngredientModal.emptyState.noIngredients')
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredIngredients.map((ingredient) => {
                  const isSelected = selectedIngredients.some(ing => ing.ingredientId === ingredient.id);
                  const wasOriginallySelected = currentProductIngredients.some(ing => ing.ingredientId === ingredient.id);
                  const selectedIngredient = selectedIngredients.find(ing => ing.ingredientId === ingredient.id);

                  return (
                    <div
                      key={ingredient.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 shadow-sm'
                          : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-primary-300 hover:shadow-sm'
                      } ${!ingredient.isAvailable ? 'opacity-60' : ''}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <input
                            title='isSelected'
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleIngredient(ingredient.id)}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                              aria-describedby={`ingredient-${ingredient.id}-status`}
                            />
                            <h4 className="font-medium text-gray-900 dark:text-white truncate">
                              {ingredient.name}
                            </h4>
                            {wasOriginallySelected && !isSelected && (
                              <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded">
                                {t('productIngredientModal.status.toBeRemoved')}
                              </span>
                            )}
                            {!wasOriginallySelected && isSelected && (
                              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded">
                                {t('productIngredientModal.status.toBeAdded')}
                              </span>
                            )}
                          </div>

                          {/* Quantity and Unit Inputs */}
                          {isSelected && (
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <div>
                                <label 
                                  htmlFor={`quantity-${ingredient.id}`}
                                  className="text-xs text-gray-600 dark:text-gray-400 block mb-1"
                                >
                                  {t('productIngredientModal.form.quantity.label')}
                                </label>
                                <input
                                  id={`quantity-${ingredient.id}`}
                                  type="number"
                                  value={selectedIngredient?.quantity || 1}
                                  onChange={(e) => updateIngredient(ingredient.id, 'quantity', e.target.value)}
                                  min="0"
                                  step="0.1"
                                  className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                  placeholder={t('productIngredientModal.form.quantity.placeholder')}
                                  aria-label={t('productIngredientModal.accessibility.quantityInput')}
                                />
                              </div>
                              <div>
                                <label 
                                  htmlFor={`unit-${ingredient.id}`}
                                  className="text-xs text-gray-600 dark:text-gray-400 block mb-1"
                                >
                                  {t('productIngredientModal.form.unit.label')}
                                </label>
                                <select
                                  id={`unit-${ingredient.id}`}
                                  value={selectedIngredient?.unit || 'piece'}
                                  onChange={(e) => updateIngredient(ingredient.id, 'unit', e.target.value)}
                                  className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                  aria-label={t('productIngredientModal.accessibility.unitSelect')}
                                >
                                  {getUnitOptions().map(option => (
                                    <option key={option.value} value={option.value}>
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          )}

                          {/* Availability Status */}
                          <div 
                            id={`ingredient-${ingredient.id}-status`}
                            className="flex items-center gap-2 mt-2"
                          >
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              ingredient.isAvailable
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                            }`}>
                              {ingredient.isAvailable 
                                ? t('productIngredientModal.status.available') 
                                : t('productIngredientModal.status.unavailable')
                              }
                            </span>

                            {ingredient.isAllergenic && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                                {t('productIngredientModal.status.containsAllergens')}
                              </span>
                            )}
                          </div>

                          {/* Allergen Information */}
                          {ingredient.isAllergenic && ingredient.allergenIds?.length > 0 && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {getAllergenInfo(ingredient.allergenIds)}
                            </div>
                          )}
                        </div>

                        {/* Selection Indicator */}
                        {isSelected && (
                          <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 ml-3">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {t('productIngredientModal.footer.totalCount', { 
              count: filteredIngredients.length 
            })}
          </div>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {t('productIngredientModal.buttons.cancel')}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {t('productIngredientModal.buttons.skip')}
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || loading}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('productIngredientModal.buttons.saving')}
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  {t('productIngredientModal.buttons.saveIngredients')}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductIngredientSelectionModal;