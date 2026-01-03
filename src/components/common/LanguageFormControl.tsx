import React, { useState } from 'react';
import { Languages, ChevronDown, Check, Copy } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { TranslatableFieldValue } from '../../hooks/useTranslatableFields';

interface LanguageOption {
  code: string;
  displayName: string;
  nativeName: string;
  isRtl: boolean;
}

interface LanguageFormControlProps {
  languages: LanguageOption[];
  selectedLanguage: string;
  onLanguageChange: (languageCode: string) => void;
  defaultLanguage?: string;
  showBulkFill?: boolean;
  onBulkFill?: (targetLanguage: string) => void;
  fieldValues?: Record<string, TranslatableFieldValue>; // For completion indicators
  className?: string;
}

export const LanguageFormControl: React.FC<LanguageFormControlProps> = ({
  languages,
  selectedLanguage,
  onLanguageChange,
  defaultLanguage = 'en',
  showBulkFill = false,
  onBulkFill,
  fieldValues = {},
  className = '',
}) => {
  const { t } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [bulkFillTarget, setBulkFillTarget] = useState<string>('');

  // Calculate completion status for a language
  const getLanguageCompletion = (langCode: string) => {
    const fieldKeys = Object.keys(fieldValues);
    if (fieldKeys.length === 0) return { filled: 0, total: 0, percentage: 0 };

    const filled = fieldKeys.filter(key => {
      const value = fieldValues[key][langCode];
      return value && value.trim() !== '';
    }).length;

    return {
      filled,
      total: fieldKeys.length,
      percentage: Math.round((filled / fieldKeys.length) * 100)
    };
  };

  const currentLanguage = languages.find(lang => lang.code === selectedLanguage);
  const completion = getLanguageCompletion(selectedLanguage);

  const handleBulkFill = (targetLang: string) => {
    if (targetLang && onBulkFill) {
      onBulkFill(targetLang);
      setBulkFillTarget('');
    }
  };

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-750 border border-blue-200 dark:border-gray-600 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between gap-4">
        {/* Language Selector */}
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <Languages className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                {t('multiLanguage.currentLanguage') || 'Current Language'}
              </label>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full sm:w-auto min-w-[250px] px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {currentLanguage?.displayName}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ({currentLanguage?.nativeName})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {completion.total > 0 && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        completion.percentage === 100
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : completion.percentage > 0
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }`}>
                        {completion.filled}/{completion.total}
                      </span>
                    )}
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {/* Language Dropdown */}
                {isDropdownOpen && (
                  <div className="absolute z-50 mt-2 w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl max-h-80 overflow-y-auto">
                    {languages.map((lang) => {
                      const isActive = selectedLanguage === lang.code;
                      const langCompletion = getLanguageCompletion(lang.code);
                      const hasContent = langCompletion.filled > 0;

                      return (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => {
                            onLanguageChange(lang.code);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-left border-b border-gray-100 dark:border-gray-600 last:border-0 ${
                            isActive ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div>
                              <div className={`text-sm font-medium ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                                {lang.displayName}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {lang.nativeName}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {langCompletion.total > 0 && (
                              <div className="text-right">
                                <div className={`text-xs font-medium ${
                                  langCompletion.percentage === 100 ? 'text-green-600 dark:text-green-400' :
                                  langCompletion.percentage > 0 ? 'text-yellow-600 dark:text-yellow-400' :
                                  'text-gray-400 dark:text-gray-500'
                                }`}>
                                  {langCompletion.filled}/{langCompletion.total}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {langCompletion.percentage}%
                                </div>
                              </div>
                            )}
                            {langCompletion.percentage === 100 && (
                              <span className="text-green-500 dark:text-green-400">✓</span>
                            )}
                            {isActive && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Fill */}
        {showBulkFill && onBulkFill && (
          <div className="flex items-center gap-2 border-l border-blue-200 dark:border-gray-600 pl-4">
            <Copy className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                {t('multiLanguage.quickFill') || 'Quick Fill'}
              </label>
              <select
                title="Quick Fill Language Selector"
                value={bulkFillTarget}
                onChange={(e) => {
                  const target = e.target.value;
                  setBulkFillTarget(target);
                  if (target) {
                    handleBulkFill(target);
                  }
                }}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="">Select language...</option>
                {languages
                  .filter(lang => lang.code !== defaultLanguage)
                  .map(lang => (
                    <option key={lang.code} value={lang.code}>
                      Fill {lang.displayName} from {languages.find(l => l.code === defaultLanguage)?.displayName}
                    </option>
                  ))
                }
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Copy from Default Button (when not on default language) */}
      {selectedLanguage !== defaultLanguage && (
        <div className="mt-3 pt-3 border-t border-blue-200 dark:border-gray-600">
          <button
            type="button"
            onClick={() => onBulkFill && onBulkFill(selectedLanguage)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            <Copy className="w-4 h-4" />
            Copy all fields from {languages.find(l => l.code === defaultLanguage)?.displayName} to {currentLanguage?.displayName}
          </button>
        </div>
      )}
    </div>
  );
};
