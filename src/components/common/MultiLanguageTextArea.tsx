import React, { useRef, useState, MouseEvent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { TranslatableFieldValue } from '../../hooks/useTranslatableFields';

interface LanguageOption {
  code: string;
  displayName: string;
  nativeName: string;
  isRtl: boolean;
}

interface MultiLanguageTextAreaProps {
  label: string;
  value: TranslatableFieldValue;
  onChange: (value: TranslatableFieldValue) => void;
  languages: LanguageOption[];
  required?: boolean;
  requiredLanguages?: string[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  rows?: number;
  defaultLanguage?: string;
  selectedLanguage?: string;
  showLanguageSelector?: boolean;
}

export const MultiLanguageTextArea: React.FC<MultiLanguageTextAreaProps> = ({
  label,
  value,
  onChange,
  languages,
  required = false,
  requiredLanguages = [],
  placeholder = '',
  disabled = false,
  className = '',
  rows = 3,
  defaultLanguage = 'en',
  selectedLanguage: externalSelectedLanguage,
  showLanguageSelector = true,
}) => {
  const { t } = useTranslation();
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

  const isLanguageRequired = (langCode: string) => {
    return requiredLanguages.includes(langCode) || (required && langCode === languages[0]?.code);
  };

  const hasError = (langCode: string) => {
    return isLanguageRequired(langCode) && (!value[langCode] || value[langCode].trim() === '');
  };

  const currentLanguage = languages.find(lang => lang.code === selectedLanguage);
  
  // --- Mouse Wheel & Drag Handlers ---
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

  // Simplified view if selector is hidden (maintained from original)
  if (!showLanguageSelector) {
    return (
      <div className={`mb-4 ${className}`}>
        <label className="block text-sm font-bold text-white mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="bg-[#1e2330] border border-gray-700 rounded-lg p-4">
           <textarea
            rows={rows}
            value={value[selectedLanguage] || ''}
            onChange={(e) => handleInputChange(selectedLanguage, e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full bg-transparent border-none p-0 text-base text-gray-200 placeholder-gray-600 focus:ring-0 focus:outline-none resize-y"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`mb-6 ${className}`}>
      {/* Utility Style */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <label className="block text-sm font-bold text-white mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Main Card Container */}
      <div className="bg-[#1e2330] border border-gray-700 rounded-lg overflow-hidden w-full shadow-lg">
        
        {/* Header: Scrollable Tabs */}
        <div className="bg-[#161922] border-b border-gray-700 w-full relative group">
          
          {/* Left Scroll Button */}
          <div className={`absolute left-0 top-0 bottom-0 z-20 flex items-center transition-opacity duration-300 ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-[#161922] to-transparent w-12 pointer-events-none" />
            <button
              type="button"
              onClick={() => scrollContainer('left')}
              className="relative z-10 p-1 ml-1 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
          </div>

          {/* Right Scroll Button */}
          <div className={`absolute right-0 top-0 bottom-0 z-20 flex items-center justify-end transition-opacity duration-300 ${canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <div className="absolute inset-0 bg-gradient-to-l from-[#161922] to-transparent w-12 pointer-events-none" />
              <button
              type="button"
              onClick={() => scrollContainer('right')}
              className="relative z-10 p-1 mr-1 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Tabs Container */}
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
                    relative flex items-center gap-2 px-6 py-3.5 text-sm font-medium whitespace-nowrap transition-colors duration-200 flex-shrink-0 select-none
                    ${isActive 
                      ? 'text-blue-400 bg-[#1e2330]' 
                      : 'text-gray-400 hover:text-gray-200 bg-[#14161f] hover:bg-[#1a1d26]'
                    }
                  `}
                >
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] z-10" />
                  )}
                  {isActive && (
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-50" />
                  )}

                  <span>{lang.displayName}</span>
                  {error && <AlertCircle className="w-3.5 h-3.5 text-red-500" />}
                </button>
              );
            })}
            <div className="w-8 flex-shrink-0" />
          </div>
        </div>

        {/* Text Area Body */}
        <div className="p-5 bg-[#1e2330]">
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                 {currentLanguage?.nativeName || currentLanguage?.displayName}
              </span>
              
              {isLanguageRequired(selectedLanguage) && (
                <span className="text-[10px] font-bold text-white bg-red-600 px-2 py-0.5 rounded-sm shadow-sm tracking-wider">
                  REQUIRED
                </span>
              )}
            </div>

            {selectedLanguage !== defaultLanguage && value[defaultLanguage] && (
               <button
                type="button"
                onClick={handleCopyFromDefault}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors opacity-70 hover:opacity-100"
               >
                 <Copy className="w-3 h-3" />
                 <span>Copy Default</span>
               </button>
            )}
          </div>

          <div className="relative">
            <textarea
              rows={rows}
              value={value[selectedLanguage] || ''}
              onChange={(e) => handleInputChange(selectedLanguage, e.target.value)}
              placeholder={placeholder}
              disabled={disabled}
              dir={currentLanguage?.isRtl ? 'rtl' : 'ltr'}
              className={`
                w-full bg-transparent border-none p-0 text-base text-gray-200 
                placeholder-gray-600 focus:ring-0 focus:outline-none resize-y
                ${disabled ? 'cursor-not-allowed opacity-50' : ''}
              `}
            />
            
            <div className={`absolute -bottom-2 left-0 right-0 h-px transition-colors duration-200 ${
              hasError(selectedLanguage) ? 'bg-red-600' : 'bg-gray-700'
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