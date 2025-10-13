import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Check, Package, AlertCircle, Loader2, Plus, ChefHat, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { logger } from '../../../utils/logger';
import { ingredientsService } from '../../../services/IngredientsService';
import { productService } from '../../../services/productService';
import { Ingredient, ProductIngredientSelectionModalProps, SelectedIngredient } from '../../../types/BranchManagement/type';

const ProductIngredientSelectionModal: React.FC<ProductIngredientSelectionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  productId,
  productName
}) => {
  const { t, isRTL } = useLanguage();

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<SelectedIngredient[]>([]);
  const [currentProductIngredients, setCurrentProductIngredients] = useState<SelectedIngredient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const loadData = async () => {
    if (!isOpen) return;

    setLoading(true);
    setError(null);

    try {
      const fetchedIngredients = await ingredientsService.getIngredients();
      setIngredients(fetchedIngredients);
      
      try {
        const currentIngredients = await productService.getProductIngredients(productId);
        const current = currentIngredients.map((ing: any) => ({
          ingredientId: ing.ingredientId || ing.id,
          quantity: ing.quantity || 0,
          unit: ing.unit || 'piece'
        }));
        setCurrentProductIngredients(current);
        setSelectedIngredients([...current]);
        
        logger.info('Mevcut ürün malzemeleri yüklendi', { productId, currentIngredients: current });
      } catch (ingredientError) {
        logger.info('Ürün malzemeleri bulunamadı (yeni ürün olabilir)', { productId });
        setCurrentProductIngredients([]);
        setSelectedIngredients([]);
      }

      logger.info('Malzeme verileri yüklendi', { ingredientCount: fetchedIngredients.length });

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

  const toggleIngredient = (ingredientId: number) => {
    setSelectedIngredients(prev => {
      if (prev.some(ing => ing.ingredientId === ingredientId)) {
        return prev.filter(ing => ing.ingredientId !== ingredientId);
      } else {
        return [...prev, { ingredientId, quantity: 1, unit: 'piece' }];
      }
    });
  };

  const updateIngredient = (ingredientId: number, field: 'quantity' | 'unit', value: string | number) => {
    setSelectedIngredients(prev =>
      prev.map(ing =>
        ing.ingredientId === ingredientId
          ? { ...ing, [field]: field === 'quantity' ? parseFloat(value as string) || 0 : value }
          : ing
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

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
      const currentIngredientIds = currentProductIngredients.map(ing => ing.ingredientId);
      const selectedIngredientIds = selectedIngredients.map(ing => ing.ingredientId);
      const ingredientsToRemove = currentIngredientIds.filter(id => !selectedIngredientIds.includes(id));

      for (const ingredientId of ingredientsToRemove) {
        try {
          await productService.removeIngredientFromProduct(productId, ingredientId);
          logger.info('Malzeme başarıyla silindi', { productId, ingredientId });
        } catch (removeError: any) {
          logger.error('Malzeme silinirken hata:', { productId, ingredientId, error: removeError });
        }
      }

      const newIngredients = selectedIngredients.filter(selected => 
        !currentIngredientIds.includes(selected.ingredientId)
      );

      if (newIngredients.length > 0) {
        await productService.addIngredientsToProduct(productId, newIngredients);
        logger.info('Yeni malzemeler başarıyla eklendi', { productId, addedCount: newIngredients.length });
      }

      const existingIngredients = selectedIngredients.filter(selected => 
        currentIngredientIds.includes(selected.ingredientId)
      );

      for (const updatedIngredient of existingIngredients) {
        const currentIngredient = currentProductIngredients.find(
          curr => curr.ingredientId === updatedIngredient.ingredientId
        );
        
        if (currentIngredient && 
            (currentIngredient.quantity !== updatedIngredient.quantity || 
             currentIngredient.unit !== updatedIngredient.unit)) {
          
          try {
            await productService.removeIngredientFromProduct(productId, updatedIngredient.ingredientId);
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

  const filteredIngredients = ingredients.filter(ingredient =>
    ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAllergenInfo = (allergenIds: number[]) => {
    if (!allergenIds?.length) return '';
    return t('productIngredientModal.allergenInfo.count', { count: allergenIds.length });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-md"
            onClick={onClose}
          />
          
          <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="relative w-full max-w-6xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-yellow-500/20 blur-3xl rounded-3xl"></div>
              
              <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="relative overflow-hidden flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-600"></div>
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                  </div>
                  
                  <div className="relative px-8 py-6">
                    <button
                      onClick={onClose}
                      className={`absolute top-6 ${isRTL ? 'left-6' : 'right-6'} p-2.5 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-110 text-white z-10`}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  
                    <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <motion.div 
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", delay: 0.2, duration: 0.6 }}
                        className="relative"
                      >
                        <div className="absolute inset-0 bg-white/30 blur-xl rounded-2xl"></div>
                        <div className="relative p-4 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg">
                          <ChefHat className="w-8 h-8 text-white" />
                        </div>
                      </motion.div>
                      
                      <div className="flex-1 pt-1">
                        <motion.h3 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="text-2xl font-bold text-white mb-2"
                        >
                          {t('productIngredientModal.title')}
                        </motion.h3>
                        <motion.p 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 }}
                          className="text-white/80 text-sm leading-relaxed"
                        >
                          <strong>{productName}</strong> {t('productIngredientModal.subtitle')}
                        </motion.p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="relative overflow-hidden rounded-2xl"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/10"></div>
                        <div className="relative p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl">
                          <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className="p-1.5 bg-red-100 dark:bg-red-800/30 rounded-lg">
                              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </div>
                            <span className="text-sm text-red-700 dark:text-red-400">{error}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Search */}
                  <div className="relative">
                    <Search className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 ${isRTL ? 'right-4' : 'left-4'}`} />
                    <input
                      type="text"
                      placeholder={t('productIngredientModal.search.placeholder')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full py-3 border-2 border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 ${isRTL ? 'pr-11 pl-4' : 'pl-11 pr-4'}`}
                    />
                  </div>

                  {/* Summary */}
                  <div className="p-5 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10 rounded-2xl border border-orange-200 dark:border-orange-800">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('productIngredientModal.summary.selectedCount')}: 
                        <span className="ml-2 px-3 py-1 bg-orange-100 dark:bg-orange-800/50 text-orange-700 dark:text-orange-300 rounded-lg font-bold">
                          {selectedIngredients.length}
                        </span>
                      </span>
                      {JSON.stringify(selectedIngredients) !== JSON.stringify(currentProductIngredients) && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg">
                          <AlertTriangle className="w-3 h-3" />
                          {t('productIngredientModal.summary.hasChanges')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Ingredients Grid */}
                  <div>
                    {loading ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-orange-600 mb-3" />
                        <span className="text-gray-600 dark:text-gray-400">{t('productIngredientModal.loading.ingredients')}</span>
                      </div>
                    ) : filteredIngredients.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
                        <div className="relative mb-4">
                          <div className="absolute inset-0 bg-orange-500/10 blur-2xl rounded-full"></div>
                          <Package className="relative w-12 h-12 opacity-50" />
                        </div>
                        <p className="text-center font-medium">
                          {searchQuery 
                            ? t('productIngredientModal.emptyState.noSearchResults') 
                            : t('productIngredientModal.emptyState.noIngredients')
                          }
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredIngredients.map((ingredient) => {
                          const isSelected = selectedIngredients.some(ing => ing.ingredientId === ingredient.id);
                          const wasOriginallySelected = currentProductIngredients.some(ing => ing.ingredientId === ingredient.id);
                          const selectedIngredient = selectedIngredients.find(ing => ing.ingredientId === ingredient.id);

                          return (
                            <div
                              key={ingredient.id}
                              className={`group relative p-4 rounded-2xl transition-all duration-300 ${
                                isSelected
                                  ? 'ring-2 ring-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-lg'
                                  : 'bg-white dark:bg-gray-700 hover:shadow-md border border-gray-200 dark:border-gray-600'
                              } ${!ingredient.isAvailable ? 'opacity-60' : ''}`}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-start gap-3 flex-1">
                                  <button
                                    onClick={() => toggleIngredient(ingredient.id)}
                                    className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                                      isSelected
                                        ? 'bg-orange-600 border-orange-600 text-white scale-110'
                                        : 'border-gray-300 dark:border-gray-600 hover:border-orange-400 hover:scale-105'
                                    }`}
                                  >
                                    {isSelected && <Check className="w-4 h-4" />}
                                  </button>
                                  
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 truncate">
                                      {ingredient.name}
                                    </h4>
                                    
                                    <div className="flex flex-wrap gap-1.5">
                                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-lg ${
                                        ingredient.isAvailable
                                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                      }`}>
                                        {ingredient.isAvailable 
                                          ? t('productIngredientModal.status.available') 
                                          : t('productIngredientModal.status.unavailable')
                                        }
                                      </span>

                                      {ingredient.isAllergenic && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">
                                          <AlertTriangle className="w-3 h-3" />
                                          {t('productIngredientModal.status.containsAllergens')}
                                        </span>
                                      )}

                                      {wasOriginallySelected && !isSelected && (
                                        <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded-lg font-medium">
                                          {t('productIngredientModal.status.toBeRemoved')}
                                        </span>
                                      )}
                                      
                                      {!wasOriginallySelected && isSelected && (
                                        <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded-lg font-medium">
                                          {t('productIngredientModal.status.toBeAdded')}
                                        </span>
                                      )}
                                    </div>

                                    {ingredient.isAllergenic && ingredient.allergenIds?.length > 0 && (
                                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                        {getAllergenInfo(ingredient.allergenIds)}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Quantity and Unit */}
                              {isSelected && (
                                <div className="mt-3 pt-3 border-t border-orange-200 dark:border-orange-800 space-y-2">
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">
                                        {t('productIngredientModal.form.quantity.label')}
                                      </label>
                                      <input
                                        type="number"
                                        value={selectedIngredient?.quantity || 1}
                                        onChange={(e) => updateIngredient(ingredient.id, 'quantity', e.target.value)}
                                        min="0"
                                        step="0.1"
                                        className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                                        placeholder="0"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">
                                        {t('productIngredientModal.form.unit.label')}
                                      </label>
                                      <select
                                      title='Unit'
                                        value={selectedIngredient?.unit || 'piece'}
                                        onChange={(e) => updateIngredient(ingredient.id, 'unit', e.target.value)}
                                        className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                                      >
                                        {getUnitOptions().map(option => (
                                          <option key={option.value} value={option.value}>
                                            {option.label}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 px-8 py-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium">
                        {t('productIngredientModal.footer.totalCount', { count: filteredIngredients.length })}
                      </span>
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="px-6 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50"
                      >
                        {t('productIngredientModal.buttons.skip')}
                      </button>
                      <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving || loading}
                        className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-semibold hover:from-orange-700 hover:to-amber-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-orange-500/50 flex items-center gap-2 relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        <span className="relative flex items-center gap-2">
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
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProductIngredientSelectionModal;