import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  MoonStar,
  Sun,
  Palette,
  Eye,
  Zap,
  ChevronDown,
  Building2,
  AlertCircle,
  Globe,
  Search,
  X
} from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { UserSettingsState, BranchDropdownItem } from '../../../../types/BranchManagement/type';
import { branchService } from '../../../../services/branchService';
import RestaurantPreferencesTab from './RestaurantPreferencesTab';
import { BranchPreferences, UpdateBranchPreferencesDto } from '../../../../services/Branch/BranchPreferencesService';

// --- Custom Select Component (Reusable) ---
interface SelectOption {
  value: string | number;
  label: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string | number | null;
  onChange: (value: any) => void;
  placeholder: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, value, onChange, placeholder, disabled, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const { isRTL } = useLanguage();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);
  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full sm:w-64" ref={containerRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-left transition-all duration-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${
          disabled ? 'opacity-60 cursor-not-allowed bg-gray-50 dark:bg-gray-900' : 'hover:border-primary-400 cursor-pointer shadow-sm'
        } ${isOpen ? 'ring-2 ring-primary-500/20 border-primary-500' : ''}`}
      >
        <div className="flex items-center gap-2 truncate">
          {icon && <span className="text-gray-500 dark:text-gray-400 shrink-0">{icon}</span>}
          <span className={`block truncate ${!selectedOption ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white font-medium'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[300px]"
          >
            {/* Search Input */}
            <div className="p-2 border-b border-gray-100 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
              <div className="relative">
                <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400`} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className={`w-full ${isRTL ? 'pr-8 pl-3' : 'pl-8 pr-3'} py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500`}
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>

            <div className="overflow-y-auto flex-1 p-1 custom-scrollbar">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between group transition-colors ${
                      value === option.value
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="font-medium text-sm truncate">{option.label}</span>
                    {value === option.value && (
                      <Check className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400 shrink-0" />
                    )}
                  </button>
                ))
              ) : (
                <div className="p-3 text-center text-xs text-gray-500 dark:text-gray-400">
                  No options found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
// --- End Custom Select ---

const ResturantSettings: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { t, language, setLanguage } = useLanguage();
  const isRTL = language === 'ar';

  // Branch management states
  const [branches, setBranches] = useState<BranchDropdownItem[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<BranchDropdownItem | null>(null);
  // Removed isBranchDropdownOpen as it is handled inside CustomSelect
  const [branchLoading, setBranchLoading] = useState(true);
  const [preferences, setPreferences] = useState<BranchPreferences | null>(null);
  const [formData, setFormData] = useState<UpdateBranchPreferencesDto | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'restaurant' | 'branch' | 'notifications' | 'privacy' | 'appearance' | 'data'>('restaurant');
  const [settings, setSettings] = useState<UserSettingsState>({
    notificationsEnabled: true,
    emailNotificationsEnabled: true,
    pushNotificationsEnabled: false,
    soundEnabled: true,
    autoSaveEnabled: true,
    dataSyncEnabled: true,
    language: 'tr',
    timezone: 'Europe/Istanbul',
    dateFormat: 'DD/MM/YYYY',
    currency: 'TRY'
  });

  // Load branches on component mount
  const loadBranches = async () => {
    try {
      setBranchLoading(true);
      const branchList = await branchService.getBranchesDropdown();
      setBranches(branchList);
      if (branchList.length > 0 && !selectedBranch) {
        setSelectedBranch(branchList[0]);
      }
    } catch (error) {
      console.error('Error loading branches:', error);
      setError(t('branchPreferences.errors.branchLoadFailed'));
    } finally {
      setBranchLoading(false);
    }
  };

  // Load settings from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('userSettings');
    if (stored) {
      try {
        const parsed: UserSettingsState = JSON.parse(stored);
        setSettings(parsed);
      } catch {
        /* ignore */
      }
    }
  }, []);

  // Initialize branches on component mount
  useEffect(() => {
    loadBranches();
  }, []);

  // Handle branch selection (Adapted for CustomSelect)
  const handleBranchSelect = (branchId: number) => {
    const branch = branches.find(b => b.branchId === branchId);
    if (branch) {
      setSelectedBranch(branch);
      setError(null);
      setSuccess(null);
      setHasChanges(false);
    }
  };

  const tabs = [
    { id: 'restaurant', label: t('RestaurantPreferencesTab.title'), icon: Globe },
    { id: 'appearance', label: t('settings.tabs.appearance'), icon: Palette },
  ];

  // Reusable switch component
  const Switch: React.FC<{ 
    checked: boolean; 
    onChange: () => void; 
    label: string; 
    description?: string;
    Icon: any;
    disabled?: boolean;
  }> = ({ checked, onChange, label, description, Icon, disabled = false }) => (
    <motion.div 
      className={`flex items-center justify-between py-4 px-4 rounded-lg border transition-all duration-200 ${
        disabled 
          ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700' 
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
      }`}
      whileHover={!disabled ? { scale: 1.01 } : {}}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} flex-1`}>
        <div className={`p-2 rounded-lg shrink-0 ${
          disabled 
            ? 'bg-gray-100 dark:bg-gray-700' 
            : 'bg-primary-100 dark:bg-primary-900/30'
        }`}>
          <Icon className={`h-5 w-5 ${
            disabled 
              ? 'text-gray-400 dark:text-gray-500' 
              : 'text-primary-600 dark:text-primary-400'
          }`} />
        </div>
        <div>
          <p className={`text-sm font-medium ${
            disabled 
              ? 'text-gray-500 dark:text-gray-400' 
              : 'text-gray-900 dark:text-white'
          }`}>
            {label}
          </p>
          {description && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>
      </div>
      <label className={`relative inline-flex items-center cursor-pointer shrink-0 ml-4 ${disabled ? 'opacity-50' : ''}`}>
        <input
          title='checkbox' 
          type="checkbox" 
          className="sr-only peer" 
          checked={checked} 
          onChange={onChange}
          disabled={disabled}
        />
        <div className={`w-11 h-6 rounded-full peer transition-all duration-200 ${
          disabled
            ? 'bg-gray-200 dark:bg-gray-600'
            : checked
              ? 'bg-primary-600 dark:bg-primary-500'
              : 'bg-gray-200 dark:bg-gray-600'
        }`}>
          <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${
            checked ? (isRTL ? '-translate-x-5' : 'translate-x-5') : (isRTL ? '-translate-x-0.5' : 'translate-x-0.5')
          }`} />
        </div>
      </label>
    </motion.div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 p-4 sm:p-0" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header - Stack on mobile, row on desktop */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('settings.title')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
            {t('settings.description')}
          </p>
        </div>
        
        {/* Branch Selector - Visible on relevant tabs */}
        {activeTab === 'branch' && (
          <div className="w-full sm:w-auto">
            <CustomSelect
              options={branches.map(b => ({ value: b.branchId, label: b.branchName }))}
              value={selectedBranch?.branchId || null}
              onChange={(val) => handleBranchSelect(Number(val))}
              placeholder={t('branchPreferences.selectBranch')}
              disabled={branchLoading}
              icon={<Building2 className="w-4 h-4" />}
            />
          </div>
        )}
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center"
          >
            <Check className={`h-5 w-5 text-green-500 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center"
          >
            <AlertCircle className={`h-5 w-5 text-red-500 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs - Scrollable on mobile */}
      <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto scrollbar-hide">
        <nav className={`flex ${isRTL ? 'space-x-reverse space-x-8' : 'space-x-8'} min-w-max pb-1`}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'restaurant' && (
          <motion.div
            key="restaurant"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <RestaurantPreferencesTab />
          </motion.div>
        )}

        {activeTab === 'appearance' && (
          <motion.div
            key="appearance"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} mb-6`}>
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg shrink-0">
                  <Palette className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t('settings.appearance.title')}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('settings.appearance.description')}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Switch
                  checked={isDark}
                  onChange={toggleTheme}
                  label={isDark ? t('settings.appearance.lightMode') : t('settings.appearance.darkMode')}
                  description={isDark ? t('settings.appearance.lightModeDesc') : t('settings.appearance.darkModeDesc')}
                  Icon={isDark ? Sun : MoonStar}
                />

                <Switch
                  checked={false}
                  onChange={() => {}}
                  label={t('settings.appearance.compact')}
                  description={t('settings.appearance.compactDesc')}
                  Icon={Eye}
                  disabled={true}
                />

                <Switch
                  checked={true}
                  onChange={() => {}}
                  label={t('settings.appearance.animations')}
                  description={t('settings.appearance.animationsDesc')}
                  Icon={Zap}
                  disabled={true}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResturantSettings;