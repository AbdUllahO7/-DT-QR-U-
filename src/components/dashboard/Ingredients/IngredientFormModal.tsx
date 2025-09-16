import React, { useState, useEffect } from 'react';
import { Plus, X, AlertCircle, Check, Loader2 } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { logger } from '../../../utils/logger';
import { ingredientsService } from '../../../services/IngredientsService';
import { Allergen, AllergenDetail, CreateIngredientData, IngredientFormModalProps, UpdateIngredientData } from '../../../types/BranchManagement/type';

// Types and Interfaces


const IngredientFormModal: React.FC<IngredientFormModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  ingredient, 
  allergens, 
  isEdit = false 
}) => {
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

  // Reset form when modal opens/closes or ingredient changes
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
        }, {} as Record<number, AllergenDetail>) || {});
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
    
    // Clear allergen selection when isAllergenic is set to false
    if (field === 'isAllergenic' && value === false) {
      setSelectedAllergens([]);
      setAllergenDetails({});
    }
    
    // Clear field-specific errors
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t('IngredientsContent.ingredientNameRequired');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    
    try {
      const ingredientData: CreateIngredientData | UpdateIngredientData = {
        ...(isEdit && ingredient && { id: ingredient.id }),
        name: formData.name.trim(),
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

  const handleClose = () => {
    if (!loading) {
      onClose();
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
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <h2 id="ingredient-form-title" className="text-xl font-semibold text-gray-800 dark:text-white">
            {isEdit ? t('IngredientsContent.editIngredient') : t('IngredientsContent.addNewIngredient')}
          </h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={t('IngredientsContent.accessibility.closeModal')}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* General Error */}
          {error && (
            <div className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <span className="text-red-700 dark:text-red-400">{error}</span>
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              {t('IngredientsContent.basicInfo')}
            </h3>
            
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
                  } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                  placeholder={t('IngredientsContent.enterIngredientName')}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  disabled={loading}
                />
                {errors.name && (
                  <p id="name-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.name}
                  </p>
                )}
              </div>
              
              <div className="space-y-4">
                <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <input
                    type="checkbox"
                    id="isAllergenic"
                    checked={formData.isAllergenic}
                    onChange={(e) => handleInputChange('isAllergenic', e.target.checked)}
                    disabled={loading}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded disabled:opacity-50"
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
                    disabled={loading}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded disabled:opacity-50"
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
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              {t('IngredientsContent.allergenInfo')}
            </h3>
            
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
                const isDisabled = !formData.isAllergenic || loading;
                
                return (
                  <div
                    key={allergen.id}
                    onClick={() => !isDisabled && handleAllergenSelect(allergen)}
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
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  {t('IngredientsContent.allergenDetails')}
                </h4>
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
                          disabled={loading}
                          className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                              disabled={loading}
                              className="w-4 h-4 text-primary-600 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 disabled:opacity-50"
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
                            disabled={loading}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-1 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className={`flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700 ${isRTL ? 'space-x-reverse flex-row-reverse' : ''}`}>
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

export default IngredientFormModal;