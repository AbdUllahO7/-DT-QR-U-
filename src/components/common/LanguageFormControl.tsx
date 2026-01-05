import React, { useState, useRef, useEffect, MouseEvent } from 'react';
import { Languages, ChevronLeft, ChevronRight, Copy, Check } from 'lucide-react';
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
  fieldValues?: Record<string, TranslatableFieldValue>;
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
  const [bulkFillTarget, setBulkFillTarget] = useState<string>('');

  // --- Scroll & Drag Logic Refs/State ---
  const tabsRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // --- Logic: Calculate Completion ---
  const getLanguageCompletion = (langCode: string) => {
    const fieldKeys = Object.keys(fieldValues);
    if (fieldKeys.length === 0) return { filled: 0, total: 0, percentage: 0 };

    const filled = fieldKeys.filter(key => {
      const value = fieldValues[key]?.[langCode];
      return value && value.trim() !== '';
    }).length;

    return {
      filled,
      total: fieldKeys.length,
      percentage: Math.round((filled / fieldKeys.length) * 100)
    };
  };

  const currentLanguage = languages.find(lang => lang.code === selectedLanguage);
  
  // --- Logic: Scroll Buttons ---
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

  // --- Logic: Drag Handlers ---
  const handleWheel = (e: React.WheelEvent) => {
    if (tabsRef.current && tabsRef.current.scrollWidth > tabsRef.current.clientWidth) {
      tabsRef.current.scrollLeft += e.deltaY;
      checkScrollButtons();
    }
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (!tabsRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - tabsRef.current.offsetLeft);
    setScrollLeft(tabsRef.current.scrollLeft);
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !tabsRef.current) return;
    e.preventDefault();
    const x = e.pageX - tabsRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    tabsRef.current.scrollLeft = scrollLeft - walk;
    checkScrollButtons();
  };

  const handleBulkFill = (targetLang: string) => {
    if (targetLang && onBulkFill) {
      onBulkFill(targetLang);
      setBulkFillTarget('');
    }
  };

  return (
    <div className={`mb-6 ${className}`}>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Main Container */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden w-full shadow-lg">

        {/* --- Header: Scrollable Tabs --- */}
        <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 w-full relative group">

          {/* Left Scroll Button */}
          <div className={`absolute left-0 top-0 bottom-0 z-20 flex items-center transition-opacity duration-300 ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-50 dark:from-gray-900 to-transparent w-12 pointer-events-none" />
            <button
              type="button"
              onClick={() => scrollContainer('left')}
              className="relative z-10 p-1 ml-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              aria-label={t('languageControl.scrollLeft') || 'Scroll left'}
            >
              <ChevronLeft size={20} />
            </button>
          </div>

          {/* Right Scroll Button */}
          <div className={`absolute right-0 top-0 bottom-0 z-20 flex items-center justify-end transition-opacity duration-300 ${canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 bg-gradient-to-l from-gray-50 dark:from-gray-900 to-transparent w-12 pointer-events-none" />
            <button
              type="button"
              onClick={() => scrollContainer('right')}
              className="relative z-10 p-1 mr-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              aria-label={t('languageControl.scrollRight') || 'Scroll right'}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Tabs Track */}
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
              const completion = getLanguageCompletion(lang.code);
              const isComplete = completion.percentage === 100 && completion.total > 0;
              
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => !isDragging && onLanguageChange(lang.code)}
                  className={`
                    relative flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap transition-colors duration-200 flex-shrink-0 select-none
                    ${isActive
                      ? 'text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  {/* Active Indicators */}
                  {isActive && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-600 dark:bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] z-10" />}
                  {isActive && <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-50" />}

                  <span>{lang.displayName}</span>

                  {/* Completion Pill */}
                  {completion.total > 0 && (
                    <span className={`
                      text-[10px] px-1.5 py-0.5 rounded font-bold ml-1
                      ${isComplete
                        ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-500/30'
                        : isActive
                          ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-500/30'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600'
                      }
                    `}>
                      {isComplete ? <Check className="w-3 h-3" /> : `${completion.filled}/${completion.total}`}
                    </span>
                  )}
                </button>
              );
            })}
            <div className="w-8 flex-shrink-0" />
          </div>
        </div>

        {/* --- Control Body --- */}
        <div className="p-4 bg-white dark:bg-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

          {/* Left: Info Text */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Languages className="w-4 h-4 text-gray-500 dark:text-gray-500" />
            <span>{t('languageControl.editing') || 'Editing'} <span className="text-gray-900 dark:text-gray-200 font-semibold">{currentLanguage?.displayName}</span></span>
          </div>

          {/* Right: Actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">

            {/* Action 1: Copy Default -> Current (Only if not default) */}
            {selectedLanguage !== defaultLanguage && onBulkFill && (
               <button
                 type="button"
                 onClick={() => onBulkFill(selectedLanguage)}
                 className="flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 border border-blue-200 dark:border-blue-500/20 rounded-md transition-colors whitespace-nowrap"
               >
                 <Copy className="w-3.5 h-3.5" />
                 {t('languageControl.copyFrom') || 'Copy all from'} {languages.find(l => l.code === defaultLanguage)?.displayName}
               </button>
            )}

            {/* Action 2: Bulk Fill Other Languages (Dropdown replacement) */}
            {showBulkFill && onBulkFill && (
              <div className="relative group">
                 <select
                 title={t('languageControl.bulkFillTitle') || 'Bulk Fill Target Language'}
                  value={bulkFillTarget}
                  onChange={(e) => {
                    const target = e.target.value;
                    setBulkFillTarget(target);
                    if (target) handleBulkFill(target);
                  }}
                  className="w-full sm:w-auto appearance-none bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs py-1.5 pl-3 pr-8 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
                >
                  <option value="">{t('languageControl.quickFill') || 'Quick Fill Other Languages...'}</option>
                  {languages
                    .filter(lang => lang.code !== defaultLanguage)
                    .map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {t('languageControl.fill') || 'Fill'} {lang.displayName}
                      </option>
                    ))
                  }
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-500">
                  <ChevronLeft className="w-3 h-3 -rotate-90" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};