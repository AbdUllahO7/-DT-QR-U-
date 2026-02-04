import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { Check, ChevronDown, Search } from "lucide-react";
import { AnimatePresence, motion } from 'framer-motion';

// --- Custom Select Component ---
export type SelectValue = string | number;

interface CustomSelectOption {
  label: string;
  value: SelectValue;
  searchTerms?: string;
  subLabel?: string;
}

interface CustomSelectProps {
  options: CustomSelectOption[];
  value: SelectValue | null;
  onChange: (value: SelectValue) => void;
  placeholder?: string;
  label?: string;
  icon?: React.ReactNode;
  error?: boolean;
  disabled?: boolean;
}




export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder,
  icon,
  error,
  disabled
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isRTL } = useLanguage();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter options
  const filteredOptions = options.filter(option => {
    const searchLower = searchTerm.toLowerCase();
    const valueStr = String(option.value).toLowerCase();
    return (
      option.label.toLowerCase().includes(searchLower) ||
      valueStr.includes(searchLower) ||
      option.searchTerms?.toLowerCase().includes(searchLower) ||
      option.subLabel?.toLowerCase().includes(searchLower)
    );
  });

  const selectedOption = options.find(opt => opt.value === value);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const getBorderClass = () => {
    if (error) return 'border-red-500 dark:border-red-500';
    if (isOpen) return 'border-blue-500 ring-2 ring-blue-500';
    return 'border-gray-300 dark:border-gray-600';
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`w-full flex items-center justify-between px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors focus:ring-2 focus:ring-blue-500 ${getBorderClass()} ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {icon}
          <span className="truncate block text-sm">
            {selectedOption ? selectedOption.label : <span className="text-gray-500">{placeholder}</span>}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-60 overflow-hidden flex flex-col"
          >
            <div className="p-2 border-b border-gray-100 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
              <div className="relative">
                <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400`} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className={`w-full ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-1.5 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 dark:text-white`}
                  autoFocus
                />
              </div>
            </div>
            
            <div className="overflow-y-auto flex-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={String(option.value)}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className={`w-full px-4 py-2 text-sm text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      value === option.value ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span>{option.label}</span>
                      {option.subLabel && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">{option.subLabel}</span>
                      )}
                    </div>
                    {value === option.value && <Check className="w-4 h-4 flex-shrink-0" />}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">No results found</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};