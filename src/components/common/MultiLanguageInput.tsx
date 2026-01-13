import React, { useRef, useState, MouseEvent, useEffect } from 'react';
import { Copy, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { TranslatableFieldValue } from '../../hooks/useTranslatableFields';
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
  defaultLanguage?: string;
  selectedLanguage?: string;
  showLanguageSelector?: boolean;
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
  defaultLanguage = '',
  selectedLanguage: externalSelectedLanguage,
  showLanguageSelector = true,
}) => {
  const { t } = useLanguage();
  const [internalSelectedLanguage, setInternalSelectedLanguage] = useState(defaultLanguage || languages[0]?.code || '');
  
  // Refs for Scrolling Logic
  const tabsRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  
  // State for Arrow Visibility
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const selectedLanguage = externalSelectedLanguage || internalSelectedLanguage;

  // --- Check Scroll Capability (For Arrow Visibility) ---
  const checkScrollButtons = () => {
    if (tabsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    return () => window.removeEventListener('resize', checkScrollButtons);
  }, [languages]);

  // --- Button Scroll Handler ---
  const scrollContainer = (direction: 'left' | 'right') => {
    if (tabsRef.current) {
      const scrollAmount = 200;
      const currentScroll = tabsRef.current.scrollLeft;
      
      tabsRef.current.scrollTo({
        left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
        behavior: 'smooth'
      });
      
      setTimeout(checkScrollButtons, 100); 
    }
  };

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

  // --- MODIFIED LOGIC HERE ---
  const isLanguageRequired = (langCode: string) => {
    // Check if specifically required in requiredLanguages array
    // OR if the component is required globally AND this is the default language
    return requiredLanguages.includes(langCode) || (required && langCode === defaultLanguage);
  };

  const hasError = (langCode: string) => {
    return isLanguageRequired(langCode) && (!value[langCode] || value[langCode].trim() === '');
  };

  const currentLanguage = languages.find(lang => lang.code === selectedLanguage);

  const handleWheel = (e: React.WheelEvent) => {
    if (tabsRef.current) {
      if (tabsRef.current.scrollWidth > tabsRef.current.clientWidth) {
        tabsRef.current.scrollLeft += e.deltaY;
        checkScrollButtons();
      }
    }
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (!tabsRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - tabsRef.current.offsetLeft);
    setScrollLeft(tabsRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !tabsRef.current) return;
    e.preventDefault();
    const x = e.pageX - tabsRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    tabsRef.current.scrollLeft = scrollLeft - walk;
    checkScrollButtons();
  };

  if (languages.length === 0) return null;

  return (
    <div className={`mb-6 ${className}`}>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      
      <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">
        {label}
        {/* Show asterisk if required globally (implies default language is required) */}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Main Card Container */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden w-full shadow-sm">
        
        {/* Header: Scrollable Tabs */}
        {showLanguageSelector && (
          <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 w-full relative group">
            
            {/* --- Left Scroll Button --- */}
            <div className={`absolute left-0 top-0 bottom-0 z-20 flex items-center transition-opacity duration-300 ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-gray-50/90 to-transparent dark:from-gray-900 dark:via-gray-900/90 w-12 pointer-events-none" />
              <button
                type="button"
                onClick={() => scrollContainer('left')}
                className="relative z-10 p-1 ml-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
            </div>

            {/* --- Right Scroll Button --- */}
            <div className={`absolute right-0 top-0 bottom-0 z-20 flex items-center justify-end transition-opacity duration-300 ${canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
               <div className="absolute inset-0 bg-gradient-to-l from-gray-50 via-gray-50/90 to-transparent dark:from-gray-900 dark:via-gray-900/90 w-12 pointer-events-none" />
               <button
                type="button"
                onClick={() => scrollContainer('right')}
                className="relative z-10 p-1 mr-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* --- Scrollable Container --- */}
            <div 
              ref={tabsRef}
              className={`flex overflow-x-auto hide-scrollbar w-full flex-nowrap ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              onScroll={checkScrollButtons}
            >
              {languages.map((lang) => {
                const isActive = selectedLanguage === lang.code;
                const error = hasError(lang.code);
                
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => !isDragging && setInternalSelectedLanguage(lang.code)}
                    disabled={disabled}
                    className={`
                      relative flex items-center gap-2 px-6 py-3.5 text-sm font-medium whitespace-nowrap transition-colors duration-200 flex-shrink-0 select-none border-r border-gray-100 dark:border-gray-800/50
                      ${isActive 
                        ? 'text-primary-600 dark:text-blue-400 bg-white dark:bg-gray-800' 
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800/50'
                      }
                    `}
                  >
                    {/* Active Indicator Line */}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary-500 dark:bg-blue-500 z-10" />
                    )}

                    {/* Active Indicator Top Gradient (Dark mode only) */}
                    {isActive && (
                      <div className="hidden dark:block absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-50" />
                    )}

                    <span>{lang.nativeName}</span>
                    
                    {error && (
                      <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                    )}
                  </button>
                );
              })}
              
              <div className="w-8 flex-shrink-0" />
            </div>
          </div>
        )}

        {/* Input Body */}
        <div className="p-5 bg-white dark:bg-gray-800">
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                 {currentLanguage?.nativeName || currentLanguage?.displayName}
              </span>
              
              {isLanguageRequired(selectedLanguage) && (
                <span className="text-[10px] font-bold text-white bg-red-500 dark:bg-red-600 px-2 py-0.5 rounded-sm shadow-sm tracking-wider">
                  REQUIRED
                </span>
              )}
            </div>

            {selectedLanguage !== defaultLanguage && value[defaultLanguage] && (
               <button
                type="button"
                onClick={handleCopyFromDefault}
                className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-400 hover:text-primary-600 dark:hover:text-white transition-colors opacity-70 hover:opacity-100"
               >
                 <Copy className="w-3 h-3" />
                 <span>Copy Default</span>
               </button>
            )}
          </div>

          <div className="relative group/input">
            <input
              type="text"
              value={value[selectedLanguage] || ''}
              onChange={(e) => handleInputChange(selectedLanguage, e.target.value)}
              placeholder={placeholder || "Enter text here"}
              disabled={disabled}
              dir={currentLanguage?.isRtl ? 'rtl' : 'ltr'}
              className={`
                w-full bg-transparent border-none p-2 text-base 
                text-gray-900 dark:text-gray-100 
                placeholder-gray-400 dark:placeholder-gray-500 
                focus:ring-0 focus:outline-none transition-colors
                ${disabled ? 'cursor-not-allowed opacity-50' : ''}
              `}
            />
            
            <div className={`absolute -bottom-2 left-0 right-0 h-px transition-all duration-300 ${
              hasError(selectedLanguage) 
                ? 'bg-red-500 h-0.5' 
                : 'bg-gray-200 dark:bg-gray-700 group-focus-within/input:bg-primary-500 dark:group-focus-within/input:bg-blue-500 group-focus-within/input:h-0.5'
            }`} />
          </div>

          {hasError(selectedLanguage) && (
            <div className="mt-4 flex items-center gap-1.5 animate-in slide-in-from-top-1 fade-in">
              <AlertCircle className="w-3.5 h-3.5 text-red-500" />
              <p className="text-xs text-red-500 font-medium">
                {t('multiLanguage.fieldRequired') || 'This field is required'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};