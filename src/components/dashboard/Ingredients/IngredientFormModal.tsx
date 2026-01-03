import React, { useState, useEffect } from 'react';
import { Plus, X, AlertCircle, Check, Loader2, Type, Maximize2, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { logger } from '../../../utils/logger';
import { ingredientsService } from '../../../services/IngredientsService';
import { Allergen, AllergenDetail, CreateIngredientData, IngredientFormModalProps, UpdateIngredientData } from '../../../types/BranchManagement/type';
import { MultiLanguageInput } from '../../common/MultiLanguageInput';
import { useTranslatableFields, TranslatableFieldValue, translationsToObject, translationResponseToObject } from '../../../hooks/useTranslatableFields';
import { ingredientTranslationService } from '../../../services/Translations/IngredientTranslationService';

type ViewDensity = 'compact' | 'comfortable' | 'spacious';

interface ExtendedIngredientFormModalProps extends IngredientFormModalProps {
  supportedLanguages: any[];
  defaultLanguage: string;
}

const IngredientFormModal: React.FC<ExtendedIngredientFormModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  ingredient, 
  allergens, 
  isEdit = false,
  supportedLanguages,
  defaultLanguage
}) => {
  const { t, isRTL } = useLanguage();
  const translationHook = useTranslatableFields();
  
  // State for non-translatable fields
  const [formData, setFormData] = useState({
    isAllergenic: false,
    isAvailable: true,
  });

  // State for translations
  const [nameTranslations, setNameTranslations] = useState<TranslatableFieldValue>({});
  
  const [selectedAllergens, setSelectedAllergens] = useState<Allergen[]>([]);
  const [allergenDetails, setAllergenDetails] = useState<Record<number, AllergenDetail>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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

  // Helper function to get translated allergen name
  const getTranslatedAllergen = (allergen: Allergen) => {
    try {
      const nameKey = `allergens.${allergen.code}.name`;
      const descKey = `allergens.${allergen.code}.description`;
      const translatedName = t(nameKey);
      const translatedDesc = t(descKey);
      return {
        name: translatedName === nameKey ? allergen.name : translatedName,
        description: translatedDesc === descKey ? allergen.description : translatedDesc
      };
    } catch (error) {
      return { name: allergen.name, description: allergen.description };
    }
  };

  // Initialize Data
  useEffect(() => {
    const initializeData = async () => {
      if (!isOpen) return;

      const languageCodes = supportedLanguages.map((lang: any) => lang.code);

      if (ingredient) {
        // Edit Mode
        setFormData({
          isAllergenic: ingredient.isAllergenic,
          isAvailable: ingredient.isAvailable,
        });
        setSelectedAllergens(allergens.filter(a => ingredient.allergenIds?.includes(a.id)));
        setAllergenDetails(ingredient?.allergenDetails?.reduce((acc, detail) => {
          acc[detail.allergenId] = detail;
          return acc;
        }, {} as Record<number, AllergenDetail>) || {});

        // Load Translations
        try {
          const translations: any = await ingredientTranslationService.getIngredientTranslations(ingredient.id);

          let nameTranslationsObj: TranslatableFieldValue;

          // Check if response is in new format (with baseValues and translations)
          if (translations.baseValues && translations.translations) {
            nameTranslationsObj = translationResponseToObject(translations, 'name');
          } else if (Array.isArray(translations)) {
            // Fallback to old format (array of translations)
            nameTranslationsObj = translationsToObject(translations as any[], 'name');

            // Add default language from base entity
            nameTranslationsObj[defaultLanguage] = ingredient.name;
          } else {
            // If translations is neither new format nor array, initialize empty
            nameTranslationsObj = translationHook.getEmptyTranslations(languageCodes);
            nameTranslationsObj[defaultLanguage] = ingredient.name;
          }

          setNameTranslations(nameTranslationsObj);
        } catch (error) {
          console.error("Failed to load translations", error);
          // Fallback: just set default language
          const emptyTranslations = translationHook.getEmptyTranslations(languageCodes);
          emptyTranslations[defaultLanguage] = ingredient.name;
          setNameTranslations(emptyTranslations);
        }

      } else {
        // Create Mode
        setFormData({ isAllergenic: false, isAvailable: true });
        setSelectedAllergens([]);
        setAllergenDetails({});
        setNameTranslations(translationHook.getEmptyTranslations(languageCodes));
      }
      setError(null);
    };

    initializeData();
  }, [isOpen, ingredient, allergens, supportedLanguages, defaultLanguage]);

  const handleInputChange = (field: keyof typeof formData, value: boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'isAllergenic' && value === false) {
      setSelectedAllergens([]);
      setAllergenDetails({});
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
        [allergen.id]: { allergenId: allergen.id, containsAllergen: true, note: '' }
      }));
    }
  };

  const handleAllergenDetailChange = (allergenId: number, field: keyof AllergenDetail, value: boolean | string) => {
    setAllergenDetails(prev => ({
      ...prev,
      [allergenId]: { ...prev[allergenId], [field]: value }
    }));
  };

  const handleSubmit = async () => {
    // Basic validation: Check if default language name is present
    if (!nameTranslations[defaultLanguage]?.trim()) {
      // We rely on MultiLanguageInput's internal error display, but we stop here
      return; 
    }

    setLoading(true);
    setError(null);
    
    try {
      // 1. Get default language value
      const defaultName = translationHook.getTranslationWithFallback(nameTranslations, defaultLanguage);

      // 2. Prepare payload
      const ingredientData: CreateIngredientData | UpdateIngredientData = {
        ...(isEdit && ingredient && { id: ingredient.id }),
        name: defaultName, // Base entity uses default language
        isAllergenic: formData.isAllergenic,
        isAvailable: formData.isAvailable,
        allergenIds: formData.isAllergenic ? selectedAllergens?.map(a => a.id) : [],
        allergenDetails: formData.isAllergenic ? Object.values(allergenDetails) : []
      };
      
      let savedIngredient;
      
      // 3. Save Base Entity
      if (isEdit) {
        savedIngredient = await ingredientsService.updateIngredient(ingredientData as UpdateIngredientData);
      } else {
        savedIngredient = await ingredientsService.createIngredient(ingredientData);
      }

      // 4. Save Translations (for non-default languages)
      const ingredientId = isEdit && ingredient ? ingredient.id : savedIngredient.id;
      
      const translationsToSave = supportedLanguages
        .filter((lang: any) => lang.code !== defaultLanguage)
        .map((lang: any) => ({
          ingredientId: ingredientId,
          languageCode: lang.code,
          name: nameTranslations[lang.code] || undefined
        }))
        .filter(t => t.name); // Only save if there is content? Or send undefined to clear? usually backend handles it.

      if (translationsToSave.length > 0) {
        await ingredientTranslationService.batchUpsertIngredientTranslations({ translations: translationsToSave });
      }
      
      logger.info(isEdit ? 'Ingredient updated' : 'Ingredient added', ingredientData);
      onSuccess();
      onClose();
      
    } catch (err: any) {
      logger.error('Error saving ingredient', err);
      if (err.response?.data?.message) {
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
      >
        {/* Header */}
        <div className={`flex items-center justify-between ${densityPadding[viewDensity]} border-b border-gray-200 dark:border-gray-700 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {isEdit ? t('IngredientsContent.editIngredient') : t('IngredientsContent.addNewIngredient')}
          </h2>
          
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Font/Density Controls... (Same as before) */}
            <button onClick={cycleFontSize} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
              <Type className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button onClick={cycleViewDensity} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
              <Maximize2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button onClick={handleClose} disabled={loading} className="text-gray-400 hover:text-gray-600 p-2">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className={`${densityPadding[viewDensity]} ${densitySpacing[viewDensity]}`}>
          {error && (
            <div className={`bg-red-50 dark:bg-red-900/20 border border-red-200 p-4 flex items-center gap-2 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-700 dark:text-red-400">{error}</span>
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <button onClick={() => toggleSection('basicInfo')} className={`w-full flex items-center justify-between ${densityPadding[viewDensity]} hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg transition-colors`}>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{t('IngredientsContent.basicInfo')}</h3>
              {collapsedSections.basicInfo ? <ChevronDown className="w-5 h-5 dark:text-white" /> : <ChevronUp className="w-5 h-5 dark:text-white" />}
            </button>
            
            {!collapsedSections.basicInfo && (
              <div className={`${densityPadding[viewDensity]} pt-0`}>
                <div className={`grid grid-cols-1 md:grid-cols-2 ${densityGap[viewDensity]}`}>
                  
                  {/* Multi Language Input for Name */}
                  <div className="w-full">
                    {/* Using a wrapper div to handle internal spacing of the relative dropdown */}
                    <div className="w-full">
                       <MultiLanguageInput
                          label={t('IngredientsContent.ingredientName')}
                          value={nameTranslations}
                          onChange={setNameTranslations}
                          languages={supportedLanguages}
                          required={true}
                          requiredLanguages={[defaultLanguage]}
                          placeholder={t('IngredientsContent.enterIngredientName')}
                          disabled={loading}
                       />
                    </div>
                  </div>
                  
                  <div className={`${densitySpacing[viewDensity]} pt-6`}>
                    <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <input
                        type="checkbox"
                        id="isAllergenic"
                        checked={formData.isAllergenic}
                        onChange={(e) => handleInputChange('isAllergenic', e.target.checked)}
                        disabled={loading}
                        className="w-4 h-4 mr-2 text-primary-600 rounded"
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
                        className="w-4 h-4 mr-2 text-primary-600 rounded"
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

          {/* Allergen Selection (Same logic as before) */}
          <div className={`bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-opacity ${!formData.isAllergenic ? 'opacity-50' : 'opacity-100'}`}>
            <button onClick={() => toggleSection('allergenInfo')} className={`w-full flex items-center justify-between ${densityPadding[viewDensity]} hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg transition-colors`}>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{t('IngredientsContent.allergenInfo')}</h3>
              {collapsedSections.allergenInfo ? <ChevronDown className="w-5 h-5 dark:text-white" /> : <ChevronUp className="w-5 h-5 dark:text-white" />}
            </button>
            
            {!collapsedSections.allergenInfo && (
              <div className={`${densityPadding[viewDensity]} pt-0`}>
                <div className="mb-4 text-gray-600 dark:text-gray-400">
                    {formData.isAllergenic ? t('IngredientsContent.selectAllergensMessage') : t('IngredientsContent.enableAllergenMessage')}
                </div>
                
                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${viewDensity === 'compact' ? 'gap-3' : 'gap-4'}`}>
                  {allergens.sort((a, b) => a.displayOrder - b.displayOrder).map((allergen) => {
                    const isSelected = selectedAllergens.find(a => a.id === allergen.id);
                    const isDisabled = !formData.isAllergenic || loading;
                    const translatedAllergen = getTranslatedAllergen(allergen);
                    
                    return (
                      <div
                        key={allergen.id}
                        onClick={() => !isDisabled && handleAllergenSelect(allergen)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          isDisabled ? 'opacity-50 cursor-not-allowed border-gray-200' : 
                          isSelected ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30' : 'border-gray-200 dark:border-gray-600 hover:border-primary-300'
                        }`}
                      >
                        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                           <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <span className="text-2xl">{allergen.icon}</span>
                              <div>
                                 <h4 className="font-medium dark:text-white">{translatedAllergen.name}</h4>
                              </div>
                           </div>
                           {isSelected && !isDisabled && <div className="bg-primary-500 rounded-full p-0.5"><Check className="w-3 h-3 text-white" /></div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className={`flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button onClick={handleClose} disabled={loading} className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700">
              {t('IngredientsContent.cancel')}
            </button>
            <button 
              onClick={handleSubmit} 
              disabled={loading || !nameTranslations[defaultLanguage]} 
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
              {isEdit ? t('IngredientsContent.update') : t('IngredientsContent.add')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IngredientFormModal;