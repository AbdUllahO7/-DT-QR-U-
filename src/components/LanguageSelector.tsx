import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useLanguage, Language } from '../contexts/LanguageContext';
import { languageService } from '../services/LanguageService';
import { LanguageOptionDto } from '../types/Language/type';

interface LanguageSelectorProps {
  variant?: 'header' | 'navbar';
  showLabel?: boolean;
  branchId?: number;
  useMenuLanguages?: boolean;
}


const allLanguages = [
  { code: 'tr' as Language, name: 'Türkçe', countryCode: 'tr' },
  { code: 'en' as Language, name: 'English', countryCode: 'us' },
  { code: 'ar' as Language, name: 'العربية', countryCode: 'sa' },
  { code: 'az' as Language, name: 'Azərbaycanca', countryCode: 'az' },
  { code: 'sq' as Language, name: 'Shqip', countryCode: 'al' },
  { code: 'bs' as Language, name: 'Bosanski', countryCode: 'ba' },
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'header',
  showLabel = false,
  branchId,
  useMenuLanguages = false
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [menuLanguages, setMenuLanguages] = useState<LanguageOptionDto[] | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isRTL = language === 'ar';

  useEffect(() => {
    if (useMenuLanguages && branchId) {
      const fetchMenuLanguages = async () => {
        try {
          const data = await languageService.getMenuLanguages(branchId);
          setMenuLanguages(data.availableLanguages || []);
        } catch (error) {
          console.error('Failed to fetch menu languages:', error);
          setMenuLanguages(null);
        }
      };
      fetchMenuLanguages();
    }
  }, [branchId, useMenuLanguages]);

  const getDisplayLanguages = () => {
    if (useMenuLanguages && menuLanguages && menuLanguages.length > 0) {
      return menuLanguages.map(ml => {
        const langInfo = allLanguages.find(l => l.code === ml.code);
        return {
          code: ml.code as Language,
          name: langInfo?.name || ml.displayName || ml.code,
          countryCode: langInfo?.countryCode || ml.code
        };
      });
    }
    return allLanguages.map(lang => ({
      ...lang,
      name: t(`language.${lang.code === 'tr' ? 'turkish' : lang.code === 'en' ? 'english' : lang.code === 'ar' ? 'arabic' : lang.code === 'az' ? 'azerbaijani' : lang.code === 'sq' ? 'albanian' : 'bosnian'}`)
    }));
  };

  const languages = getDisplayLanguages();
  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

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
              className={`w-full flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${language === lang.code ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-400 dark:text-primary-400' : ''
                }`}
            >
              {/* 2. Replaced Emoji <span> with <img> tag */}
              <img
                src={`https://flagcdn.com/w40/${lang.countryCode}.png`}
                srcSet={`https://flagcdn.com/w80/${lang.countryCode}.png 2x`}
                width="24"
                height="16" // Aspect ratio is usually 3:2 for flags, but 24x16 works well for icons
                alt={lang.name}
                className="object-contain rounded-sm"
              />

              <span className="font-medium">{lang.name}</span>
              {language === lang.code && (
                <span className={`${isRTL ? 'mr-auto' : 'ml-auto'} text-primary-400 dark:text-primary-400`}>
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