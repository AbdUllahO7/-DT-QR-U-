import React, { useState, useEffect } from 'react';
import { X, Loader2, Save } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { MultiLanguageInput } from '../../../common/MultiLanguageInput';
import { useTranslatableFields, TranslatableFieldValue } from '../../../../hooks/useTranslatableFields';
import { languageService } from '../../../../services/LanguageService';
import { branchCategoryTranslationService } from '../../../../services/Translations/BranchCategoryTranslationService';
import { logger } from '../../../../utils/logger';

interface LanguageOption {
  code: string;
  displayName: string;
  nativeName: string;
  isRtl: boolean;
}

interface BranchCategoryNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newName: string) => void;
  categoryId: number;
  branchCategoryId: number;
  currentName: string;
  originalName: string;
}

export const BranchCategoryNameModal: React.FC<BranchCategoryNameModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  categoryId,
  branchCategoryId,
  currentName,
  originalName
}) => {
  const { t, isRTL } = useLanguage();
  const translationHook = useTranslatableFields();

  const [supportedLanguages, setSupportedLanguages] = useState<LanguageOption[]>([]);
  const [defaultLanguage, setDefaultLanguage] = useState<string>('en');
  const [categoryNameTranslations, setCategoryNameTranslations] = useState<TranslatableFieldValue>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load supported languages
  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const languagesData = await languageService.getRestaurantLanguages();

        // Deduplicate languages by code
        const uniqueLanguages = (languagesData.availableLanguages || []).reduce((acc: any[], lang: any) => {
          if (!acc.find((l: any) => l.code === lang.code)) {
            acc.push(lang);
          }
          return acc;
        }, []);

        setSupportedLanguages(uniqueLanguages);
        setDefaultLanguage(languagesData.defaultLanguage || 'en');

        // Initialize empty translations
        const languageCodes = uniqueLanguages.map((lang: any) => lang.code);
        setCategoryNameTranslations(translationHook.getEmptyTranslations(languageCodes));
      } catch (error) {
        console.error('Failed to load languages:', error);
      }
    };
    loadLanguages();
  }, []);

  // Load existing translations when modal opens
  useEffect(() => {
    if (!isOpen || !branchCategoryId) return;

    const loadTranslations = async () => {
      try {
        const response = await branchCategoryTranslationService.getBranchCategoryTranslations(branchCategoryId);

        const nameTrans: TranslatableFieldValue = {
          [defaultLanguage]: currentName
        };

        // Handle API response structure - could be array or object with translations property
        const translationsArray = Array.isArray(response) ? response : (response as any)?.translations || [];

        translationsArray.forEach((translation: any) => {
          if (translation.name) {
            nameTrans[translation.languageCode] = translation.name;
          }
        });

        console.log('Loaded branch category translations:', nameTrans);
        setCategoryNameTranslations(nameTrans);
      } catch (error) {
        logger.error('Failed to load branch category translations', error, { prefix: 'BranchCategoryNameModal' });
        // Initialize with default language value on error
        const nameTrans: TranslatableFieldValue = {
          [defaultLanguage]: currentName
        };
        setCategoryNameTranslations(nameTrans);
      }
    };

    if (supportedLanguages.length > 0) {
      loadTranslations();
    }
  }, [isOpen, branchCategoryId, currentName, defaultLanguage, supportedLanguages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const defaultLanguageName = categoryNameTranslations[defaultLanguage];
    if (!defaultLanguageName || defaultLanguageName.trim() === '') {
      setError(t('branchCategories.errors.nameRequired') || 'Category name is required');
      return;
    }

    setLoading(true);

    try {
      // Save translations
      const translationData = Object.keys(categoryNameTranslations)
        .filter(lang => lang !== defaultLanguage)
        .filter(lang => categoryNameTranslations[lang])
        .map(languageCode => ({
          branchCategoryId,
          languageCode,
          name: categoryNameTranslations[languageCode],
        }));

      console.log('Translation data to be saved:', translationData);

      if (translationData.length > 0) {
        await branchCategoryTranslationService.batchUpsertBranchCategoryTranslations({
          translations: translationData
        });
        logger.info('Branch category translations saved', null, { prefix: 'BranchCategoryNameModal' });
      }

      // Call success with the default language name
      onSuccess(defaultLanguageName.trim());
      onClose();
    } catch (error) {
      console.error('Failed to save translations:', error);
      setError(t('branchCategories.errors.saveFailed') || 'Failed to save category name');
      logger.error('Failed to save branch category translations', error, { prefix: 'BranchCategoryNameModal' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-900/75 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">
              {t('branchCategories.editCategoryName') || 'Edit Category Name'}
            </h3>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white focus:outline-none transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="px-6 py-6">
            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-700 rounded-lg">
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}

            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">{t('branchCategories.originalName') || 'Original Name'}:</span> {originalName}
              </p>
            </div>

            <MultiLanguageInput
              label={t('branchCategories.categoryName') || 'Category Name'}
              value={categoryNameTranslations}
              onChange={(newTranslations) => {
                setCategoryNameTranslations(newTranslations);
              }}
              languages={supportedLanguages}
              placeholder={t('branchCategories.enterCategoryName') || 'Enter category name'}
              defaultLanguage={defaultLanguage}
              required={true}
            />

            {/* Footer */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                {t('common.cancel') || 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('common.saving') || 'Saving...'}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {t('common.save') || 'Save'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
