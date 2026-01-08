import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useLanguage, Language } from '../contexts/LanguageContext';

interface LanguageSelectorProps {
  variant?: 'header' | 'navbar';
  showLabel?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  variant = 'header',
  showLabel = false 
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isRTL = language === 'ar';

  const languages = [
    { code: 'tr' as Language, name: t('language.turkish'), flag: '🇹🇷' },
    { code: 'en' as Language, name: t('language.english'), flag: '🇺🇸' },
    { code: 'ar' as Language, name: t('language.arabic'), flag: '🇸🇦' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode: Language) => {
    setLanguage(langCode);
    setIsOpen(false);
    // Refresh the page to apply language changes across all components
    window.location.reload();
  };

  const getButtonStyle = () => {
    if (variant === 'navbar') {
      return "p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200";
    }
    return "p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200";
  };

  return (
    <div className="relative flex-shrink-0" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${getButtonStyle()} flex items-center flex-shrink-0 ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}
        aria-label={t('accessibility.language')}
        title={t('language.selectLanguage')}
      >
        <Globe className="h-5 w-5" />
        {showLabel && (
          <span className="text-sm font-medium">
            {currentLanguage?.name}
          </span>
        )}
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute top-full mt-2 ${isRTL ? 'left-0' : 'right-0'} z-[999] min-w-[180px] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1`}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${
                language === lang.code ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : ''
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="font-medium">{lang.name}</span>
              {language === lang.code && (
                <span className={`${isRTL ? 'mr-auto' : 'ml-auto'} text-primary-600 dark:text-primary-400`}>
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;