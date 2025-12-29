import React, { useState, useEffect } from 'react';
import { Plus, X, AlertCircle, Check, Loader2, Type, Maximize2, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { logger } from '../../../utils/logger';
import { ingredientsService } from '../../../services/IngredientsService';
import { Allergen, AllergenDetail, CreateIngredientData, IngredientFormModalProps, UpdateIngredientData } from '../../../types/BranchManagement/type';

type ViewDensity = 'compact' | 'comfortable' | 'spacious';

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

  // UI Controls State
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [viewDensity, setViewDensity] = useState<ViewDensity>('comfortable');
  const [collapsedSections, setCollapsedSections] = useState({
    basicInfo: false,
    allergenInfo: false
  });

  // Font size classes
  const fontSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  // Density classes
  const densitySpacing = {
    compact: 'space-y-3',
    comfortable: 'space-y-6',
    spacious: 'space-y-8'
  };

  const densityPadding = {
    compact: 'p-4',
    comfortable: 'p-6',
    spacious: 'p-8'
  };

  const densityGap = {
    compact: 'gap-3',
    comfortable: 'gap-6',
    spacious: 'gap-8'
  };

  const cycleFontSize = () => {
    setFontSize(prev => {
      if (prev === 'small') return 'medium';
      if (prev === 'medium') return 'large';
      return 'small';
    });
  };

  const cycleViewDensity = () => {
    setViewDensity(prev => {
      if (prev === 'compact') return 'comfortable';
      if (prev === 'comfortable') return 'spacious';
      return 'compact';
    });
  };

  const toggleSection = (section: keyof typeof collapsedSections) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Helper function to get translated allergen name and description
  const getTranslatedAllergen = (allergen: Allergen) => {
    try {
      const nameKey = `allergens.${allergen.code}.name`;
      const descKey = `allergens.${allergen.code}.description`;
      
      // Try to get translation, if it returns the key itself, use original value
      const translatedName = t(nameKey);
      const translatedDesc = t(descKey);
      
      return {
        name: translatedName === nameKey ? allergen.name : translatedName,
        description: translatedDesc === descKey ? allergen.description : translatedDesc
      };
    } catch (error) {
      // Fallback to original values if translation fails
      return {
        name: allergen.name,
        description: allergen.description
      };
    }
  };

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
        className={`bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto ${isRTL ? 'text-right' : 'text-left'} ${fontSizeClasses[fontSize]}`}
        role="dialog"
        aria-labelledby="ingredient-form-title"
        aria-label={t('IngredientsContent.accessibility.formModal')}
      >
        {/* Header */}
        <div className={`flex items-center justify-between ${densityPadding[viewDensity]} border-b border-gray-200 dark:border-gray-700 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <h2 id="ingredient-form-title" className="text-xl font-semibold text-gray-800 dark:text-white">
            {isEdit ? t('IngredientsContent.editIngredient') : t('IngredientsContent.addNewIngredient')}
          </h2>
          
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Font Size Control */}
            <button
              onClick={cycleFontSize}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors flex items-center gap-1"
              title={`Font Size: ${fontSize}`}
              disabled={loading}
            >
              <Type className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-[10px] font-semibold uppercase text-gray-600 dark:text-gray-400">
                {fontSize[0]}
              </span>
            </button>

            {/* View Density Control */}
            <button
              onClick={cycleViewDensity}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors flex items-center gap-1"
              title={`Density: ${viewDensity}`}
              disabled={loading}
            >
              <Maximize2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-[10px] font-semibold uppercase text-gray-600 dark:text-gray-400">
                {viewDensity[0]}
              </span>
            </button>

            {/* Close Button */}
            <button
              onClick={handleClose}
              disabled={loading}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed p-2"
              aria-label={t('IngredientsContent.accessibility.closeModal')}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className={`${densityPadding[viewDensity]} ${densitySpacing[viewDensity]}`}>
          {/* General Error */}
          {error && (
            <div className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <span className="text-red-700 dark:text-red-400">{error}</span>
            </div>
          )}

          {/* Basic Information - Collapsible */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <button
              onClick={() => toggleSection('basicInfo')}
              className={`w-full flex items-center justify-between ${densityPadding[viewDensity]} hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-t-lg ${
                collapsedSections.basicInfo ? 'rounded-b-lg' : ''
              }`}
              type="button"
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {t('IngredientsContent.basicInfo')}
              </h3>
              {collapsedSections.basicInfo ? (
                <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
            
            {!collapsedSections.basicInfo && (
              <div className={`${densityPadding[viewDensity]} pt-0`}>
                <div className={`grid grid-cols-1 md:grid-cols-2 ${densityGap[viewDensity]}`}>
                  <div>
                    <label htmlFor="name" className="block font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                      <p id="name-error" className="mt-1 text-red-600 dark:text-red-400">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  
                  <div className={`${densitySpacing[viewDensity]} ${viewDensity === 'spacious' ? 'space-y-6' : 'space-y-4'}`}>
                    <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <input
                        type="checkbox"
                        id="isAllergenic"
                        checked={formData.isAllergenic}
                        onChange={(e) => handleInputChange('isAllergenic', e.target.checked)}
                        disabled={loading}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded disabled:opacity-50"
                      />
                      <label htmlFor="isAllergenic" className={`font-medium text-gray-700 dark:text-gray-300 ${isRTL ? 'mr-2' : 'ml-2'}`}>
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
                      <label htmlFor="isAvailable" className={`font-medium text-gray-700 dark:text-gray-300 ${isRTL ? 'mr-2' : 'ml-2'}`}>
                        {t('IngredientsContent.availableForUse')}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Allergen Selection - Collapsible */}
          <div className={`bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-opacity ${
            !formData.isAllergenic ? 'opacity-50' : 'opacity-100'
          }`}>
            <button
              onClick={() => toggleSection('allergenInfo')}
              className={`w-full flex items-center justify-between ${densityPadding[viewDensity]} hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-t-lg ${
                collapsedSections.allergenInfo ? 'rounded-b-lg' : ''
              }`}
              type="button"
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {t('IngredientsContent.allergenInfo')}
              </h3>
              {collapsedSections.allergenInfo ? (
                <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
            
            {!collapsedSections.allergenInfo && (
              <div className={`${densityPadding[viewDensity]} pt-0`}>
                <div className={`mb-${viewDensity === 'compact' ? '3' : viewDensity === 'comfortable' ? '4' : '6'}`}>
                  <p className="text-gray-600 dark:text-gray-400">
                    {formData.isAllergenic 
                      ? t('IngredientsContent.selectAllergensMessage')
                      : t('IngredientsContent.enableAllergenMessage')
                    }
                  </p>
                </div>
                
                <div 
                  className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${
                    viewDensity === 'compact' ? 'gap-3' : viewDensity === 'comfortable' ? 'gap-4' : 'gap-6'
                  } mb-${viewDensity === 'compact' ? '4' : '6'}`}
                  role="group"
                  aria-label={t('IngredientsContent.accessibility.allergenSelection')}
                >
                  {allergens
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map((allergen) => {
                    const isSelected = selectedAllergens.find(a => a.id === allergen.id);
                    const isDisabled = !formData.isAllergenic || loading;
                    const translatedAllergen = getTranslatedAllergen(allergen);
                    
                    return (
                      <div
                        key={allergen.id}
                        onClick={() => !isDisabled && handleAllergenSelect(allergen)}
                        className={`${
                          viewDensity === 'compact' ? 'p-3' : viewDensity === 'comfortable' ? 'p-4' : 'p-5'
                        } rounded-lg border-2 transition-all ${
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
                          <div className={`flex items-center ${
                            viewDensity === 'compact' ? 'gap-2' : 'gap-3'
                          } ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <span className={viewDensity === 'spacious' ? 'text-3xl' : 'text-2xl'}>{allergen.icon}</span>
                            <div>
                              <h4 className={`font-medium ${
                                isDisabled 
                                  ? 'text-gray-400 dark:text-gray-500' 
                                  : 'text-gray-800 dark:text-white'
                              }`}>
                                {translatedAllergen.name}
                              </h4>
                              <p className={`${
                                isDisabled 
                                  ? 'text-gray-400 dark:text-gray-500' 
                                  : 'text-gray-500 dark:text-gray-400'
                              }`}>
                                {translatedAllergen.description}
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
                  <div className={`border-t border-gray-200 dark:border-gray-600 pt-${viewDensity === 'compact' ? '4' : '6'}`}>
                    <h4 className={`text-lg font-semibold text-gray-800 dark:text-white mb-${viewDensity === 'compact' ? '3' : '4'}`}>
                      {t('IngredientsContent.allergenDetails')}
                    </h4>
                    <div className={viewDensity === 'compact' ? 'space-y-3' : 'space-y-4'}>
                      {selectedAllergens
                        .sort((a, b) => a.displayOrder - b.displayOrder)
                        .map((allergen) => {
                          const translatedAllergen = getTranslatedAllergen(allergen);
                          
                          return (
                            <div key={allergen.id} className={`bg-white dark:bg-gray-800 ${
                              viewDensity === 'compact' ? 'p-3' : 'p-4'
                            } rounded-lg border border-gray-200 dark:border-gray-600`}>
                              <div className={`flex items-center justify-between ${
                                viewDensity === 'compact' ? 'mb-2' : 'mb-3'
                              } ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                  <span className="text-xl">{allergen.icon}</span>
                                  <h5 className="font-medium text-gray-800 dark:text-white">{translatedAllergen.name}</h5>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleAllergenSelect(allergen)}
                                  disabled={loading}
                                  className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  aria-label={`Remove ${translatedAllergen.name}`}
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              </div>
                              
                              <div className={`grid grid-cols-1 md:grid-cols-2 ${
                                viewDensity === 'compact' ? 'gap-3' : 'gap-4'
                              }`}>
                                <div>
                                  <label className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <input
                                      type="checkbox"
                                      checked={allergenDetails[allergen.id]?.containsAllergen || false}
                                      onChange={(e) => handleAllergenDetailChange(allergen.id, 'containsAllergen', e.target.checked)}
                                      disabled={loading}
                                      className="w-4 h-4 text-primary-600 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 disabled:opacity-50"
                                    />
                                    <span className={`text-gray-700 dark:text-gray-300 ${isRTL ? 'mr-2' : 'ml-2'}`}>
                                      {t('IngredientsContent.containsThisAllergen')}
                                    </span>
                                  </label>
                                </div>
                                
                               
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className={`flex justify-end ${
            viewDensity === 'compact' ? 'space-x-3' : 'space-x-4'
          } pt-${viewDensity === 'compact' ? '4' : '6'} border-t border-gray-200 dark:border-gray-700 ${isRTL ? 'space-x-reverse flex-row-reverse' : ''}`}>
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className={`${
                viewDensity === 'compact' ? 'px-4 py-2' : viewDensity === 'comfortable' ? 'px-6 py-3' : 'px-8 py-4'
              } border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label={t('IngredientsContent.cancel')}
            >
              {t('IngredientsContent.cancel')}
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !formData.name.trim()}
              className={`${
                viewDensity === 'compact' ? 'px-4 py-2' : viewDensity === 'comfortable' ? 'px-6 py-3' : 'px-8 py-4'
              } bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2`}
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