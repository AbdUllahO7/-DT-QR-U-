import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TranslatableFieldValue } from '../../hooks/useTranslatableFields';

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
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(languages[0]?.code || '');

  const handleInputChange = (languageCode: string, inputValue: string) => {
    onChange({
      ...value,
      [languageCode]: inputValue,
    });
  };

  const isLanguageRequired = (langCode: string) => {
    return requiredLanguages.includes(langCode) || (required && langCode === languages[0]?.code);
  };

  const hasError = (langCode: string) => {
    return isLanguageRequired(langCode) && (!value[langCode] || value[langCode].trim() === '');
  };

  if (languages.length === 0) {
    return (
      <div className={`mb-4 ${className}`}>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <div className="text-sm text-red-600">
          {t('multiLanguage.noLanguagesConfigured', 'No languages configured. Please configure languages in preferences.')}
        </div>
      </div>
    );
  }

  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Language Tabs */}
      <div className="flex flex-wrap gap-1 mb-2 border-b border-gray-200">
        {languages.map((lang) => {
          const isActive = activeTab === lang.code;
          const error = hasError(lang.code);

          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => setActiveTab(lang.code)}
              className={`
                px-3 py-2 text-sm font-medium rounded-t-lg transition-colors
                ${isActive
                  ? 'bg-white text-blue-600 border-t border-l border-r border-gray-200'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }
                ${error ? 'border-red-300' : ''}
              `}
            >
              {lang.displayName}
              {error && <span className="ml-1 text-red-500">!</span>}
              {value[lang.code] && !error && <span className="ml-1 text-green-500">✓</span>}
            </button>
          );
        })}
      </div>

      {/* Input Fields */}
      <div className="bg-white border border-gray-200 rounded-b-lg rounded-tr-lg p-3">
        {languages.map((lang) => (
          <div
            key={lang.code}
            className={activeTab === lang.code ? 'block' : 'hidden'}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">
                {lang.displayName} ({lang.nativeName})
              </span>
              {isLanguageRequired(lang.code) && (
                <span className="text-xs text-red-500">
                  {t('multiLanguage.required', 'Required')}
                </span>
              )}
            </div>
            <input
              type="text"
              value={value[lang.code] || ''}
              onChange={(e) => handleInputChange(lang.code, e.target.value)}
              placeholder={placeholder}
              disabled={disabled}
              dir={lang.isRtl ? 'rtl' : 'ltr'}
              className={`
                w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2
                ${hasError(lang.code)
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
                }
                ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
              `}
            />
            {hasError(lang.code) && (
              <p className="mt-1 text-xs text-red-500">
                {t('multiLanguage.fieldRequired', 'This field is required')}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
