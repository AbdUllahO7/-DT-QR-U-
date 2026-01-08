import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  MoonStar,
  Sun,
  Settings as SettingsIcon,
  Palette,
  Eye,
  Zap,
  ChevronDown,
  Building2,
  AlertCircle,
  Globe
} from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { UserSettingsState, BranchDropdownItem } from '../../../../types/BranchManagement/type';
import { branchService } from '../../../../services/branchService';
import RestaurantPreferencesTab from './RestaurantPreferencesTab';
import { BranchPreferences, UpdateBranchPreferencesDto } from '../../../../services/Branch/BranchPreferencesService';

const ResturantSettings: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { t, language, setLanguage } = useLanguage();
  const isRTL = language === 'ar';

  // Branch management states
  const [branches, setBranches] = useState<BranchDropdownItem[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<BranchDropdownItem | null>(null);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
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

  // Handle branch selection
  const handleBranchSelect = (branch: BranchDropdownItem) => {
    setSelectedBranch(branch);
    setIsBranchDropdownOpen(false);
    setError(null);
    setSuccess(null);
    setHasChanges(false);
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
      <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
        <div className={`p-2 rounded-lg ${
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
      <label className={`relative inline-flex items-center cursor-pointer ${disabled ? 'opacity-50' : ''}`}>
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

  // Reusable select component
  const Select: React.FC<{
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    Icon: any;
  }> = ({ label, value, onChange, options, Icon }) => (
    <motion.div 
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-200"
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} mb-3`}>
        <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
          <Icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
        </div>
        <label className="text-sm font-medium text-gray-900 dark:text-white">
          {label}
        </label>
      </div>
      <select
        title='value'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400 transition-colors"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </motion.div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('settings.title')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t('settings.description')}
          </p>
        </div>
        <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
          {/* Branch Selector - Only show on branch tab */}
          {activeTab === 'branch' && (
            <div className="relative">
              <button
                onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
                disabled={branchLoading}
                className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors disabled:opacity-50"
              >
                <Building2 className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {selectedBranch ? selectedBranch.branchName : t('branchPreferences.selectBranch')}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isBranchDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isBranchDropdownOpen && branches.length > 0 && (
                <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                  <div className="py-1 max-h-60 overflow-y-auto">
                    {branches.map((branch) => (
                      <button
                        key={branch.branchId}
                        onClick={() => handleBranchSelect(branch)}
                        className={`w-full px-4 py-2 text-left rtl:text-right hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                          selectedBranch?.branchId === branch.branchId
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <Building2 className="w-4 h-4" />
                          <span className="font-medium">{branch.branchName}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

      
        </div>
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center"
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
            className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center"
          >
            <AlertCircle className={`h-5 w-5 text-red-500 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className={`flex ${isRTL ? 'space-x-reverse space-x-8' : 'space-x-8'}`}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
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
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} mb-6`}>
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
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