import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Check, Copy } from 'lucide-react';
import { TranslatableFieldValue } from '../../hooks/useTranslatableFields'; // Adjust path if needed
import { useLanguage } from '../../contexts/LanguageContext';

interface LanguageOption {
  code: string;
  displayName: string;
  nativeName: string;
  isRtl: boolean;
}

interface MultiLanguageInputProps {
  label: string;
  value: TranslatableFieldValue;
  onChange: (value: TranslatableFieldValue) => void;
  languages: LanguageOption[];
  required?: boolean;
  requiredLanguages?: string[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  defaultLanguage?: string; // Add default language prop
}

export const MultiLanguageInput: React.FC<MultiLanguageInputProps> = ({
  label,
  value,
  onChange,
  languages,
  required = false,
  requiredLanguages = [],
  placeholder = '',
  disabled = false,
  className = '',
  defaultLanguage = 'en', // Default to English
}) => {
  const { t } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]?.code || '');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleInputChange = (languageCode: string, inputValue: string) => {
    onChange({
      ...value,
      [languageCode]: inputValue,
    });
  };

  const handleCopyFromDefault = () => {
    const defaultValue = value[defaultLanguage];
    if (defaultValue && selectedLanguage !== defaultLanguage) {
      onChange({
        ...value,
        [selectedLanguage]: defaultValue,
      });
    }
  };

  const isLanguageRequired = (langCode: string) => {
    return requiredLanguages.includes(langCode) || (required && langCode === languages[0]?.code);
  };

  const hasError = (langCode: string) => {
    return isLanguageRequired(langCode) && (!value[langCode] || value[langCode].trim() === '');
  };

  const currentLanguage = languages.find(lang => lang.code === selectedLanguage);
  const defaultLangName = languages.find(lang => lang.code === defaultLanguage)?.displayName || 'Default';

  if (languages.length === 0) {
    return (
      <div className={`mb-4 ${className}`}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
        <div className="text-sm text-red-600 dark:text-red-400">
          {t('multiLanguage.noLanguagesConfigured')}
        </div>
      </div>
    );
  }

  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden transition-all duration-200 ease-in-out">
        
        {/* Language Selector Header (Always Visible) */}
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full px-3 py-2 flex items-center justify-between bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
          disabled={disabled}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {currentLanguage?.displayName} ({currentLanguage?.nativeName})
            </span>
            {hasError(selectedLanguage) && (
              <span className="text-xs text-red-500 dark:text-red-400">⚠</span>
            )}
            {value[selectedLanguage] && !hasError(selectedLanguage) && (
              <span className="text-xs text-green-500 dark:text-green-400">✓</span>
            )}
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* FIX: Changed from 'absolute' to 'relative' (default block behavior).
           This pushes the content down when open, preventing the list from being clipped by the modal.
        */}
        {isDropdownOpen && (
          <div className="w-full bg-white dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 max-h-60 overflow-y-auto">
            {languages.map((lang) => {
              const isActive = selectedLanguage === lang.code;
              const error = hasError(lang.code);
              const hasValue = value[lang.code] && value[lang.code].trim() !== '';

              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setSelectedLanguage(lang.code);
                    setIsDropdownOpen(false);
                  }}
                  className={`
                    w-full px-3 py-2 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-left
                    ${isActive ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                  `}
                >
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${isActive ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>
                      {lang.displayName}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ({lang.nativeName})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {error && <span className="text-xs text-red-500 dark:text-red-400">⚠ Required</span>}
                    {!error && hasValue && <span className="text-xs text-green-500 dark:text-green-400">✓ Filled</span>}
                    {!error && !hasValue && lang.code !== defaultLanguage && <span className="text-xs text-gray-400 dark:text-gray-500">Empty</span>}
                    {isActive && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Input Field Area */}
        <div className="p-3 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between mb-2">
            {isLanguageRequired(selectedLanguage) && (
              <span className="text-xs text-red-500 dark:text-red-400">
                {t('multiLanguage.required')}
              </span>
            )}
            {/* Copy from Default Language Button */}
            {selectedLanguage !== defaultLanguage && value[defaultLanguage] && (
              <button
                type="button"
                onClick={handleCopyFromDefault}
                disabled={disabled}
                className="ml-auto flex items-center gap-1 px-2 py-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Copy className="w-3 h-3" />
                Copy from {defaultLangName}
              </button>
            )}
          </div>
          <input
            type="text"
            value={value[selectedLanguage] || ''}
            onChange={(e) => handleInputChange(selectedLanguage, e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            dir={currentLanguage?.isRtl ? 'rtl' : 'ltr'}
            className={`
              w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2
              bg-white dark:bg-gray-800 text-gray-900 dark:text-white
              placeholder-gray-400 dark:placeholder-gray-500
              ${hasError(selectedLanguage)
                ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400'
              }
              ${disabled ? 'bg-gray-100 dark:bg-gray-900 cursor-not-allowed opacity-50' : ''}
            `}
          />
          {hasError(selectedLanguage) && (
            <p className="mt-1 text-xs text-red-500 dark:text-red-400">
              {t('multiLanguage.fieldRequired')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};