import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, Search, Loader2, AlertCircle, Check, ChefHat, Save } from 'lucide-react';
import { productService } from '../../../services/productService';
import { logger } from '../../../utils/logger';
import { useLanguage } from '../../../contexts/LanguageContext';
import { ingredientsService } from '../../../services/IngredientsService';
import { ProductIngredient, ProductIngredientUpdateModalProps } from '../../../types/BranchManagement/type';

interface Ingredient {
  id: number;
  name: string;
  unit: string;
  price?: number;
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

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, productId]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [allIngredientsResponse, productIngredientsResponse] = await Promise.all([
        fetchAllIngredients(), 
        productService.getProductIngredients(productId) 
      ]);

      setAllIngredients(allIngredientsResponse);

      const selectedMap = new Map<number, ProductIngredient>();
      productIngredientsResponse.forEach((ingredient: any) => {
        selectedMap.set(ingredient.ingredientId || ingredient.id, {
          ingredientId: ingredient.ingredientId || ingredient.id,
          quantity: ingredient.quantity || 1,
          unit: ingredient.unit || 'piece'
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

  const fetchAllIngredients = async (): Promise<Ingredient[]> => {
    try {
      const response = await ingredientsService.getIngredients();
      return response.map((item: any) => ({
        id: item.ingredientId || item.id,
        name: item.ingredientName || item.name || 'Unknown Ingredient',
        unit: item.unit || 'piece',
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
      newSelected.delete(ingredient.id);
    } else {
      newSelected.set(ingredient.id, {
        ingredientId: ingredient.id,
        quantity: 1,
        unit: ingredient.unit || 'piece'
      });
    }
    
    setSelectedIngredients(newSelected);
  };

  const handleQuantityChange = (ingredientId: number, quantity: number) => {
    const newSelected = new Map(selectedIngredients);
    const existing = newSelected.get(ingredientId);
    
    if (existing && quantity > 0) {
      newSelected.set(ingredientId, { ...existing, quantity: quantity });
      setSelectedIngredients(newSelected);
    }
  };

  const handleUnitChange = (ingredientId: number, unit: string) => {
    const newSelected = new Map(selectedIngredients);
    const existing = newSelected.get(ingredientId);
    
    if (existing) {
      newSelected.set(ingredientId, { ...existing, unit: unit });
      setSelectedIngredients(newSelected);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    for (const [id, ingredient] of selectedIngredients.entries()) {
      if (ingredient.quantity <= 0) {
        setError(t('productIngredientModal.errors.quantityRequired'));
        setSaving(false);
        return;
      }
      if (!ingredient.unit) {
        setError(t('productIngredientModal.errors.unitRequired'));
        setSaving(false);
        return;
      }
    }

    try {
      const currentIngredients = await productService.getProductIngredients(productId);
      const currentIds = new Set(currentIngredients.map((ing: any) => ing.ingredientId || ing.id));
      const selectedIds = new Set(selectedIngredients.keys());

      const toRemove = Array.from(currentIds).filter(id => !selectedIds.has(id));
      const toAdd = Array.from(selectedIngredients.entries())
        .filter(([id]) => !currentIds.has(id))
        .map(([id, ingredient]) => ingredient);

      for (const ingredientId of toRemove) {
        await productService.removeIngredientFromProduct(productId, ingredientId);
      }

      if (toAdd.length > 0) {
        await productService.addIngredientsToProduct(productId, toAdd);
      }

      const toUpdate = Array.from(selectedIngredients.entries())
        .filter(([id]) => currentIds.has(id));

      for (const [id, ingredient] of toUpdate) {
        const current = currentIngredients.find((ing: any) => (ing.ingredientId || ing.id) === id);
        if (current && (current.quantity !== ingredient.quantity || current.unit !== ingredient.unit)) {
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
                          {t('ProductIngredientUpdateModal.title')}
                        </motion.h3>
                        <motion.p 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 }}
                          className="text-white/80 text-sm leading-relaxed"
                        >
                          {productName} (ID: {productId})
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

                  {/* Search & Summary */}
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 ${isRTL ? 'right-4' : 'left-4'}`} />
                      <input
                        type="text"
                        placeholder={t('ProductIngredientUpdateModal.searchPlaceholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full py-3 border-2 border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 ${isRTL ? 'pr-11 pl-4' : 'pl-11 pr-4'}`}
                        disabled={loading}
                      />
                    </div>

                    <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10 rounded-2xl border border-orange-200 dark:border-orange-800">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t('ProductIngredientUpdateModal.selectedCount')}:
                        </span>
                        <span className="px-3 py-1 bg-orange-100 dark:bg-orange-800/50 text-orange-700 dark:text-orange-300 rounded-lg font-bold">
                          {selectedIngredients.size}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Ingredients Grid */}
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-orange-600 mb-3" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {t('ProductIngredientUpdateModal.loadingIngredients')}
                      </span>
                    </div>
                  ) : filteredIngredients.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
                      <div className="relative mb-4">
                        <div className="absolute inset-0 bg-orange-500/10 blur-2xl rounded-full"></div>
                        <Package className="relative w-12 h-12 opacity-50" />
                      </div>
                      <p className="text-center font-medium">
                        {searchQuery 
                          ? t('ProductIngredientUpdateModal.noIngredientsFoundSearch') 
                          : t('ProductIngredientUpdateModal.noIngredientsFound')
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredIngredients.map((ingredient) => {
                        const isSelected = selectedIngredients.has(ingredient.id);
                        const selectedIngredient = selectedIngredients.get(ingredient.id);
                        
                        return (
                          <div
                            key={ingredient.id}
                            className={`group relative p-4 rounded-2xl transition-all duration-300 cursor-pointer ${
                              isSelected
                                ? 'ring-2 ring-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-lg'
                                : 'bg-white dark:bg-gray-700 hover:shadow-md border border-gray-200 dark:border-gray-600'
                            }`}
                            onClick={() => handleIngredientToggle(ingredient)}
                          >
                            {/* Selection Indicator */}
                            <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                              isSelected
                                ? 'bg-orange-600 border-orange-600 text-white scale-110'
                                : 'border-gray-300 dark:border-gray-600 hover:border-orange-400 hover:scale-105'
                            }`}>
                              {isSelected && <Check className="w-4 h-4" />}
                            </div>

                            {/* Ingredient Info */}
                            <div className={isRTL ? 'pl-8' : 'pr-8'}>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                {ingredient.name}
                              </h4>
                              
                              <div className="flex flex-wrap gap-2 mb-3">
                                <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium">
                                  {t('ProductIngredientUpdateModal.unit')} {ingredient.unit}
                                </span>
                                {ingredient.price && (
                                  <span className="text-xs px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg font-medium">
                                    {ingredient.price.toFixed(2)} ₺
                                  </span>
                                )}
                              </div>

                              {/* Quantity and Unit */}
                              {isSelected && (
                                <div className="pt-3 border-t border-orange-200 dark:border-orange-800 space-y-2" onClick={(e) => e.stopPropagation()}>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">
                                        {t('productIngredientModal.form.quantity.label')}
                                      </label>
                                      <input
                                        type="number"
                                        min="0"
                                        step="0.1"
                                        value={selectedIngredient?.quantity || 1}
                                        onChange={(e) => handleQuantityChange(ingredient.id, parseFloat(e.target.value) || 0)}
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
                                        onChange={(e) => handleUnitChange(ingredient.id, e.target.value)}
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
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 px-8 py-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium">
                        {selectedIngredients.size} {t('ProductIngredientUpdateModal.selectedCount')}
                      </span>
                    </div>
                    
                    <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <button
                        onClick={onClose}
                        disabled={saving}
                        className="px-6 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50"
                      >
                        {t('ProductIngredientUpdateModal.cancel')}
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving || loading}
                        className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-semibold hover:from-orange-700 hover:to-amber-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-orange-500/50 flex items-center gap-2 relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        <span className="relative flex items-center gap-2">
                          {saving ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              {t('ProductIngredientUpdateModal.saving')}
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              {t('ProductIngredientUpdateModal.save')}
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

export default ProductIngredientUpdateModal;