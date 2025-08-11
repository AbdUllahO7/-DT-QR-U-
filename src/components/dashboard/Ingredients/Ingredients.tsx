import React, { useState, useEffect } from 'react';
import { Plus, X, AlertCircle, Check, Search, Edit2, Trash2, Package, Loader2, Filter, ArrowUp } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { logger } from '../../../utils/logger';
import { AllergenService } from '../../../services/allergen';
import { ingredientsService } from '../../../services/IngredientsService';

interface Allergen {
  id: number;
  code: string;
  name: string;
  icon: string;
  displayOrder: number;
  description: string;
}

interface AllergenDetail {
  allergenId: number;
  containsAllergen: boolean;
  note: string;
}

interface Ingredient {
  id: number;
  name: string;
  isAllergenic: boolean;
  isAvailable: boolean;
  allergenIds: number[];
  allergenDetails: AllergenDetail[];
}

interface CreateIngredientData {
  name: string;
  isAllergenic: boolean;
  isAvailable: boolean;
  allergenIds: number[];
  allergenDetails: AllergenDetail[];
}

interface UpdateIngredientData extends CreateIngredientData {
  id: number;
}

// ConfirmDeleteModal Component
const ConfirmDeleteModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  message: string;
  isSubmitting?: boolean;
}> = ({ isOpen, onClose, onConfirm, title, message, isSubmitting = false }) => {
  const { t, isRTL } = useLanguage();
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setError(null);
    try {
      await onConfirm();
      onClose();
    } catch (err: any) {
      logger.error('Silme hatası:', err);
      setError(t('IngredientsContent.deleteError'));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 ${isRTL ? 'text-right' : 'text-left'}`}>
        <div className={`flex justify-between items-center mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label={t('IngredientsContent.accessibility.closeModal')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">{message}</p>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <div className={`flex justify-end gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg"
              aria-label={t('IngredientsContent.cancel')}
            >
              {t('IngredientsContent.cancel')}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={t('IngredientsContent.delete')}
            >
              {isSubmitting ? t('IngredientsContent.deleting') : t('IngredientsContent.delete')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Ingredient Form Modal Component
const IngredientFormModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  ingredient?: Ingredient | null;
  allergens: Allergen[];
  isEdit?: boolean;
}> = ({ isOpen, onClose, onSuccess, ingredient, allergens, isEdit = false }) => {
  const { t, isRTL } = useLanguage();
  
  const [formData, setFormData] = useState({
    name: '',
    isAllergenic: false,
    isAvailable: true,
  });
  
  const [selectedAllergens, setSelectedAllergens] = useState<Allergen[]>([]);
  const [allergenDetails, setAllergenDetails] = useState<Record<number, AllergenDetail>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (ingredient) {
        setFormData({
          name: ingredient.name,
          isAllergenic: ingredient.isAllergenic,
          isAvailable: ingredient.isAvailable,
        });
        setSelectedAllergens(allergens.filter(a => ingredient.allergenIds?.includes(a.id)));
        setAllergenDetails(ingredient?.allergenDetails?.reduce((acc, detail) => {
          acc[detail.allergenId] = detail;
          return acc;
        }, {} as Record<number, AllergenDetail>));
      } else {
        setFormData({ name: '', isAllergenic: false, isAvailable: true });
        setSelectedAllergens([]);
        setAllergenDetails({});
      }
      setError(null);
      setErrors({});
    }
  }, [isOpen, ingredient, allergens]);

  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (field === 'isAllergenic' && value === false) {
      setSelectedAllergens([]);
      setAllergenDetails({});
    }
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleAllergenSelect = (allergen: Allergen) => {
    if (!formData.isAllergenic) return;
    
    const isSelected = selectedAllergens.find(a => a.id === allergen.id);
    
    if (isSelected) {
      setSelectedAllergens(prev => prev.filter(a => a.id !== allergen.id));
      setAllergenDetails(prev => {
        const newDetails = { ...prev };
        delete newDetails[allergen.id];
        return newDetails;
      });
    } else {
      setSelectedAllergens(prev => [...prev, allergen]);
      setAllergenDetails(prev => ({
        ...prev,
        [allergen.id]: {
          allergenId: allergen.id,
          containsAllergen: true,
          note: ''
        }
      }));
    }
  };

  const handleAllergenDetailChange = (allergenId: number, field: keyof AllergenDetail, value: boolean | string) => {
    setAllergenDetails(prev => ({
      ...prev,
      [allergenId]: {
        ...prev[allergenId],
        [field]: value
      }
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setErrors({ name: t('IngredientsContent.ingredientNameRequired') });
      return;
    }

    setLoading(true);
    setError(null);
    setErrors({});
    
    try {
      const ingredientData: CreateIngredientData | UpdateIngredientData = {
        ...(isEdit && ingredient && { id: ingredient.id }),
        name: formData.name,
        isAllergenic: formData.isAllergenic,
        isAvailable: formData.isAvailable,
        allergenIds: formData.isAllergenic ? selectedAllergens?.map(a => a.id) : [],
        allergenDetails: formData.isAllergenic ? Object.values(allergenDetails) : []
      };
      
       if (isEdit) {
         await ingredientsService.updateIngredient(ingredientData as UpdateIngredientData);
       } else {
         await ingredientsService.createIngredient(ingredientData);
       }
      
      logger.info(isEdit ? 'Malzeme güncellendi' : 'Malzeme eklendi', ingredientData);
      onSuccess();
      onClose();
      
    } catch (err: any) {
      logger.error(isEdit ? 'Malzeme güncelleme hatası' : 'Malzeme ekleme hatası', err);
      
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(isEdit ? t('IngredientsContent.updateError') : t('IngredientsContent.createError'));
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className={`bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto ${isRTL ? 'text-right' : 'text-left'}`}
        role="dialog"
        aria-labelledby="ingredient-form-title"
        aria-label={t('IngredientsContent.accessibility.formModal')}
      >
        <div className={`flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <h2 id="ingredient-form-title" className="text-xl font-semibold text-gray-800 dark:text-white">
            {isEdit ? t('IngredientsContent.editIngredient') : t('IngredientsContent.addNewIngredient')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label={t('IngredientsContent.accessibility.closeModal')}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* General Error */}
          {error && (
            <div className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span className="text-red-700 dark:text-red-400">{error}</span>
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">{t('IngredientsContent.basicInfo')}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('IngredientsContent.ingredientName')} *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                    errors.name
                      ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                  } text-gray-900 dark:text-white`}
                  placeholder={t('IngredientsContent.enterIngredientName')}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                )}
              </div>
              
              <div className="space-y-4">
                <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <input
                    type="checkbox"
                    id="isAllergenic"
                    checked={formData.isAllergenic}
                    onChange={(e) => handleInputChange('isAllergenic', e.target.checked)}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                  />
                  <label htmlFor="isAllergenic" className={`text-sm font-medium text-gray-700 dark:text-gray-300 ${isRTL ? 'mr-2' : 'ml-2'}`}>
                    {t('IngredientsContent.containsAllergensCheckbox')}
                  </label>
                </div>
                
                <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <input
                    type="checkbox"
                    id="isAvailable"
                    checked={formData.isAvailable}
                    onChange={(e) => handleInputChange('isAvailable', e.target.checked)}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                  />
                  <label htmlFor="isAvailable" className={`text-sm font-medium text-gray-700 dark:text-gray-300 ${isRTL ? 'mr-2' : 'ml-2'}`}>
                    {t('IngredientsContent.availableForUse')}
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Allergen Selection */}
          <div className={`bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 transition-opacity ${
            !formData.isAllergenic ? 'opacity-50' : 'opacity-100'
          }`}>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">{t('IngredientsContent.allergenInfo')}</h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formData.isAllergenic 
                  ? t('IngredientsContent.selectAllergensMessage')
                  : t('IngredientsContent.enableAllergenMessage')
                }
              </p>
            </div>
            
            <div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
              role="group"
              aria-label={t('IngredientsContent.accessibility.allergenSelection')}
            >
              {allergens
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map((allergen) => {
                const isSelected = selectedAllergens.find(a => a.id === allergen.id);
                const isDisabled = !formData.isAllergenic;
                
                return (
                  <div
                    key={allergen.id}
                    onClick={() => handleAllergenSelect(allergen)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isDisabled 
                        ? 'cursor-not-allowed opacity-50 border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700'
                        : isSelected
                        ? 'cursor-pointer border-primary-500 bg-primary-50 dark:bg-primary-900/30 shadow-md'
                        : 'cursor-pointer border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-primary-300 hover:shadow-sm'
                    }`}
                    role="button"
                    tabIndex={isDisabled ? -1 : 0}
                    aria-pressed={isSelected ? 'true' : 'false'}
                    aria-disabled={isDisabled}
                    onKeyDown={(e) => {
                      if (!isDisabled && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        handleAllergenSelect(allergen);
                      }
                    }}
                  >
                    <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-2xl">{allergen.icon}</span>
                        <div>
                          <h4 className={`font-medium ${
                            isDisabled 
                              ? 'text-gray-400 dark:text-gray-500' 
                              : 'text-gray-800 dark:text-white'
                          }`}>
                            {allergen.name}
                          </h4>
                          <p className={`text-sm ${
                            isDisabled 
                              ? 'text-gray-400 dark:text-gray-500' 
                              : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {allergen.description}
                          </p>
                        </div>
                      </div>
                      {isSelected && !isDisabled && (
                        <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Allergen Details */}
            {selectedAllergens.length > 0 && formData.isAllergenic && (
              <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">{t('IngredientsContent.allergenDetails')}</h4>
                <div className="space-y-4">
                  {selectedAllergens
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map((allergen) => (
                    <div key={allergen.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                      <div className={`flex items-center justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-xl">{allergen.icon}</span>
                          <h5 className="font-medium text-gray-800 dark:text-white">{allergen.name}</h5>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAllergenSelect(allergen)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          aria-label={`Remove ${allergen.name}`}
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <input
                              type="checkbox"
                              checked={allergenDetails[allergen.id]?.containsAllergen || false}
                              onChange={(e) => handleAllergenDetailChange(allergen.id, 'containsAllergen', e.target.checked)}
                              className="w-4 h-4 text-primary-600 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500"
                            />
                            <span className={`text-sm text-gray-700 dark:text-gray-300 ${isRTL ? 'mr-2' : 'ml-2'}`}>
                              {t('IngredientsContent.containsThisAllergen')}
                            </span>
                          </label>
                        </div>
                        
                        <div>
                          <input
                            type="text"
                            placeholder={t('IngredientsContent.additionalNotes')}
                            value={allergenDetails[allergen.id]?.note || ''}
                            onChange={(e) => handleAllergenDetailChange(allergen.id, 'note', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-1 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className={`flex justify-end space-x-4 ${isRTL ? 'space-x-reverse flex-row-reverse' : ''}`}>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              aria-label={t('IngredientsContent.cancel')}
            >
              {t('IngredientsContent.cancel')}
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !formData.name.trim()}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              aria-label={isEdit ? t('IngredientsContent.update') : t('IngredientsContent.add')}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isEdit ? t('IngredientsContent.updating') : t('IngredientsContent.adding')}
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  {isEdit ? t('IngredientsContent.update') : t('IngredientsContent.add')}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Ingredient Management Component
const IngredientsContent: React.FC = () => {
const { isDark } = useTheme();
  const { t, isRTL } = useLanguage();
  
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [filteredIngredients, setFilteredIngredients] = useState<Ingredient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const allergenService = new AllergenService();
      
      const fetchedAllergens = await allergenService.getAllergens();
      setAllergens(fetchedAllergens);
      
      const transformedIngredients = await ingredientsService.getIngredients();
      
      setIngredients(transformedIngredients);
      setFilteredIngredients(transformedIngredients);
     
      logger.info('Data loaded successfully', { 
        allergenCount: fetchedAllergens.length,
        ingredientCount: transformedIngredients.length
      });
    } catch (err) {
      logger.error('Data loading error:', err);
      setAllergens([]);
      setIngredients([]);
      setFilteredIngredients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter ingredients
  useEffect(() => {
    const filtered = ingredients.filter(ingredient =>
      ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredIngredients(filtered);
  }, [searchQuery, ingredients]);

  const handleEdit = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setShowEditModal(true);
  };

  const handleDelete = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedIngredient) return;
    
    setIsDeleting(true);
    try {
      await ingredientsService.deleteIngredient(selectedIngredient.id);
      
      setIngredients(prev => prev.filter(ing => ing.id !== selectedIngredient.id));
      logger.info('Ingredient deleted', { id: selectedIngredient.id });
    } catch (err) {
      logger.error('Ingredient deletion error:', err);
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  const getAllergenNames = (allergenIds: number[]) => {
    return allergens
      .filter(a => allergenIds?.includes(a.id))
      .map(a => `${a.icon || '🚨'} ${a.name}`)
      .join(', ');
  };

  if (loading) {
    return (
      <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
          <div className="relative flex-1 max-w-md">
            <Search className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
            <input
              type="text"
              placeholder={t('IngredientsContent.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'
              }`}
              aria-label={t('IngredientsContent.accessibility.searchInput')}
            />
          </div>
          
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button 
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 ${isRTL ? 'flex-row-reverse' : ''}`}
              aria-label={t('IngredientsContent.accessibility.filterButton')}
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">{t('IngredientsContent.filter')}</span>
            </button>

            <button 
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 ${isRTL ? 'flex-row-reverse' : ''}`}
              aria-label={t('IngredientsContent.accessibility.sortButton')}
            >
              <ArrowUp className="h-4 w-4" />
              <span className="hidden sm:inline">{t('IngredientsContent.sort')}</span>
            </button>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className={`flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
              aria-label={t('IngredientsContent.accessibility.addButton')}
            >
              <Plus className="w-5 h-5" />
              {t('IngredientsContent.newIngredient')}
            </button>
          </div>
        </div>
      </div>

      {/* Ingredients Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table 
            className="w-full"
            role="table"
            aria-label={t('IngredientsContent.accessibility.ingredientsTable')}
          >
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className={`px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('IngredientsContent.ingredientName')}
                </th>
                <th className={`px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('IngredientsContent.status')}
                </th>
                <th className={`px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('IngredientsContent.allergenInfo')}
                </th>
                <th className={`px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('IngredientsContent.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredIngredients.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center">
                      <Package className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        {searchQuery ? t('IngredientsContent.noIngredientsFound') : t('IngredientsContent.noIngredientsYet')}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredIngredients.map((ingredient) => (
                  <tr key={ingredient.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 dark:text-white">{ingredient.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          ingredient.isAvailable
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                        }`}
                        aria-label={t('IngredientsContent.accessibility.statusBadge')}
                      >
                        {ingredient.isAvailable ? t('IngredientsContent.available') : t('IngredientsContent.unavailable')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {ingredient?.isAllergenic ? (
                          <div>
                            <span 
                              className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 mb-1"
                              aria-label={t('IngredientsContent.accessibility.allergenBadge')}
                            >
                              {t('IngredientsContent.containsAllergens')}
                            </span>
                            {ingredient?.allergenIds?.length > 0 && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {getAllergenNames(ingredient.allergenIds)}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span 
                            className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                            aria-label={t('IngredientsContent.accessibility.allergenBadge')}
                          >
                            {t('IngredientsContent.noAllergens')}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isRTL ? 'text-left' : 'text-right'}`}>
                      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                        <button
                          onClick={() => handleEdit(ingredient)}
                          className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                          title={t('IngredientsContent.edit')}
                          aria-label={t('IngredientsContent.accessibility.editButton')}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(ingredient)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                          title={t('IngredientsContent.delete')}
                          aria-label={t('IngredientsContent.accessibility.deleteButton')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      <IngredientFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadData}
        allergens={allergens}
        isEdit={false}
      />

      {/* Edit Modal */}
      <IngredientFormModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedIngredient(null);
        }}
        onSuccess={loadData}
        ingredient={selectedIngredient}
        allergens={allergens}
        isEdit={true}
      />

      {/* Delete Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedIngredient(null);
        }}
        onConfirm={handleDeleteConfirm}
        title={t('IngredientsContent.deleteIngredient')}
        message={selectedIngredient ? t('IngredientsContent.deleteConfirmMessage').replace('{name}', selectedIngredient.name) : ''}
        isSubmitting={isDeleting}
      />
    </div>
  );
};

export default IngredientsContent;