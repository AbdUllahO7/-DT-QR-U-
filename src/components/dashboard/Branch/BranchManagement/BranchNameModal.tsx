import React, { useState, useEffect } from 'react';
import { X, Loader2, Save } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { MultiLanguageInput } from '../../../common/MultiLanguageInput';
import { useTranslatableFields, TranslatableFieldValue } from '../../../../hooks/useTranslatableFields';
import { languageService } from '../../../../services/LanguageService';
import { branchTranslationService } from '../../../../services/Translations/BranchTranslationService';
import { logger } from '../../../../utils/logger';

interface LanguageOption {
  code: string;
  displayName: string;
  nativeName: string;
  isRtl: boolean;
}

interface BranchNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newName: string) => void;
  branchId: number;
  currentName: string;
}

export const BranchNameModal: React.FC<BranchNameModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  branchId,
  currentName
}) => {
  const { t, isRTL } = useLanguage();
  const translationHook = useTranslatableFields();

  const [supportedLanguages, setSupportedLanguages] = useState<LanguageOption[]>([]);
  const [defaultLanguage, setDefaultLanguage] = useState<string>('en');
  const [branchNameTranslations, setBranchNameTranslations] = useState<TranslatableFieldValue>({});
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
        setBranchNameTranslations(translationHook.getEmptyTranslations(languageCodes));
      } catch (error) {
        console.error('Failed to load languages:', error);
      }
    };
    loadLanguages();
  }, []);

  // Load existing translations when modal opens
  useEffect(() => {
    if (!isOpen || !branchId) return;

    const loadTranslations = async () => {
      try {
        const response = await branchTranslationService.getBranchTranslations(branchId);

        const nameTrans: TranslatableFieldValue = {
          [defaultLanguage]: currentName
        };

        // Handle API response structure - could be array or object with translations property
        const translationsArray = Array.isArray(response) ? response : (response as any)?.translations || [];

        translationsArray.forEach((translation: any) => {
          if (translation.branchName) {
            nameTrans[translation.languageCode] = translation.branchName;
          }
        });

        setBranchNameTranslations(nameTrans);
      } catch (error) {
        logger.error('Failed to load branch translations', error, { prefix: 'BranchNameModal' });
        // Initialize with default language value on error
        const nameTrans: TranslatableFieldValue = {
          [defaultLanguage]: currentName
        };
        setBranchNameTranslations(nameTrans);
      }
    };

    if (supportedLanguages.length > 0) {
      loadTranslations();
    }
  }, [isOpen, branchId, currentName, defaultLanguage, supportedLanguages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const defaultLanguageName = branchNameTranslations[defaultLanguage];
    if (!defaultLanguageName || defaultLanguageName.trim() === '') {
      setError(t('branchManagementBranch.errors.nameRequired') || 'Branch name is required');
      return;
    }

    setLoading(true);

    try {
      // Save translations
      const translationData = Object.keys(branchNameTranslations)
        .filter(lang => lang !== defaultLanguage)
        .filter(lang => branchNameTranslations[lang])
        .map(languageCode => ({
          branchId,
          languageCode,
          branchName: branchNameTranslations[languageCode],
        }));


      if (translationData.length > 0) {
        await branchTranslationService.batchUpsertBranchTranslations({
          translations: translationData
        });
        logger.info('Branch translations saved', null, { prefix: 'BranchNameModal' });
      }

      // Call success with the default language name
      onSuccess(defaultLanguageName.trim());
      onClose();
    } catch (error) {
      console.error('Failed to save translations:', error);
      setError(t('branchManagementBranch.errors.saveFailed') || 'Failed to save branch name');
      logger.error('Failed to save branch translations', error, { prefix: 'BranchNameModal' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      dir={isRTL ? 'rtl' : 'ltr'}
      role="dialog"
      aria-modal="true"
      aria-labelledby="branch-name-modal-title"
    >
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop with enhanced dark mode */}
        <div
          className="fixed inset-0 transition-opacity bg-gradient-to-br from-gray-900/80 via-gray-900/85 to-gray-900/90 dark:from-gray-950/90 dark:via-black/85 dark:to-gray-950/95 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal with enhanced styling */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-2xl dark:shadow-gray-900/50 transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full border border-gray-200 dark:border-gray-700">
          {/* Header with enhanced gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 px-6 py-5 flex justify-between items-center shadow-lg">
            <h3
              id="branch-name-modal-title"
              className="text-xl font-bold text-white drop-shadow-sm"
            >
              {t('branchManagementBranch.editBranchName') || 'Edit Branch Name'}
            </h3>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/10 dark:hover:bg-white/5 focus:outline-none transition-all duration-200 rounded-lg p-2"
              aria-label={t('common.close') || 'Close'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content with enhanced dark mode */}
          <form onSubmit={handleSubmit} className="px-6 py-6 bg-white dark:bg-gray-800">
            {error && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-600 rounded-lg shadow-sm">
                <p className="text-sm text-red-700 dark:text-red-300 font-medium">{error}</p>
              </div>
            )}

            <MultiLanguageInput
              label={t('branchManagementBranch.basicInfo.branchName') || 'Branch Name'}
              value={branchNameTranslations}
              onChange={(newTranslations) => {
                setBranchNameTranslations(newTranslations);
              }}
              languages={supportedLanguages}
              placeholder={t('branchManagementBranch.placeholders.branchName') || 'Enter branch name'}
              defaultLanguage={defaultLanguage}
              required={true}
            />

            {/* Footer with enhanced buttons */}
            <div className={`mt-6 flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
              >
                {t('common.cancel') || 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-600 dark:to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-700 dark:hover:to-blue-800 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl focus:ring-4 focus:ring-blue-500/50 dark:focus:ring-blue-400/50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t('common.saving') || 'Saving...'}</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{t('common.save') || 'Save'}</span>
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
