import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Globe,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Loader2,
  Languages,
  ChevronDown,
  Search,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../../../contexts/LanguageContext';
import {
  RestaurantPreferences,
  restaurantPreferencesService,
  UpdateRestaurantPreferencesDto,
  CurrencyOption,
} from '../../../../services/RestaurantPreferencesService';
import { useCurrency } from '../../../../hooks/useCurrency';

// --- Reusable Custom Select Component ---
interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, value, onChange, placeholder, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
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

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
          disabled ? 'opacity-60 cursor-not-allowed bg-gray-50 dark:bg-gray-900' : 'hover:border-blue-400 cursor-pointer shadow-sm'
        } ${isOpen ? 'ring-2 ring-blue-500/20 border-blue-500' : ''}`}
      >
        <span className={`block truncate ${!selectedOption ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white font-medium'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl overflow-hidden max-h-60 overflow-y-auto custom-scrollbar"
          >
            <div className="p-1">
              {options.length > 0 ? (
                options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-md flex items-center justify-between group transition-colors ${
                      value === option.value
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="font-medium text-sm truncate">{option.label}</span>
                    {value === option.value && (
                      <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 ml-2" />
                    )}
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  No options available
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface RestaurantPreferencesTabProps {
  className?: string;
}

const RestaurantPreferencesTab: React.FC<RestaurantPreferencesTabProps> = ({ className = '' }) => {
  const { t, isRTL } = useLanguage();

  // State management
  const [preferences, setPreferences] = useState<RestaurantPreferences | null>(null);
  const [formData, setFormData] = useState<UpdateRestaurantPreferencesDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const currency = useCurrency();

  // Currency selector state
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [currencySearchQuery, setCurrencySearchQuery] = useState('');

  // Load preferences on component mount
  const loadPreferences = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await restaurantPreferencesService.getRestaurantPreferences();
      setPreferences(data);

      // Initialize form data
      const initialFormData: UpdateRestaurantPreferencesDto = {
        supportedLanguages: data.supportedLanguages,
        defaultLanguage: data.defaultLanguage,
        defaultCurrency: data.defaultCurrency,
        rowVersion: data.rowVersion
      };

      setFormData(initialFormData);
      setHasChanges(false);
    } catch (err: any) {
      setError(err.message || t('RestaurantPreferencesTab.errors.load'));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  // Handle form field changes
  const handleFieldChange = (field: keyof UpdateRestaurantPreferencesDto, value: any) => {
    if (!formData) return;

    const updatedFormData = {
      ...formData,
      [field]: value
    };

    setFormData(updatedFormData);
    setHasChanges(true);
    setError(null);
    setSuccess(null);
  };

  // Toggle language support
  const toggleLanguage = (languageCode: string) => {
    if (!formData || !formData.supportedLanguages) return;

    const currentLanguages = [...formData.supportedLanguages];
    const index = currentLanguages.indexOf(languageCode);

    if (index > -1) {
      // Remove language
      currentLanguages.splice(index, 1);
    } else {
      // Add language
      currentLanguages.push(languageCode);
    }

    handleFieldChange('supportedLanguages', currentLanguages);
  };

  // Handle currency selection
  const handleCurrencySelect = (currency: CurrencyOption) => {
    handleFieldChange('defaultCurrency', currency.code);
    setIsCurrencyDropdownOpen(false);
    setCurrencySearchQuery('');
  };

  // Get filtered currencies based on search query
  const getFilteredCurrencies = () => {
    if (!preferences?.availableCurrencies) return [];
    if (!currencySearchQuery) return preferences.availableCurrencies;

    const query = currencySearchQuery.toLowerCase();
    return preferences.availableCurrencies.filter(
      currency =>
        currency.displayName.toLowerCase().includes(query) ||
        currency.code.toLowerCase().includes(query) ||
        currency.symbol.includes(query)
    );
  };

  // Get selected currency object
  const getSelectedCurrency = () => {
    if (!formData?.defaultCurrency || !preferences?.availableCurrencies) return null;
    return preferences.availableCurrencies.find(c => c.code === formData.defaultCurrency) || null;
  };

  // Save preferences
  const handleSave = async () => {
    if (!formData || !hasChanges) return;

    try {
      setIsSaving(true);
      setError(null);

      await restaurantPreferencesService.updateRestaurantPreferences(formData);
      await loadPreferences();

      // Save currency to localStorage after successful API call
      const selectedCurrency = preferences?.availableCurrencies.find(c => c.code === formData.defaultCurrency);
      if (selectedCurrency) {
        localStorage.setItem('selectedCurrency', JSON.stringify({
          code: selectedCurrency.code,
          symbol: selectedCurrency.symbol,
          displayName: selectedCurrency.displayName
        }));
      }

      setHasChanges(false);
      setSuccess(t('RestaurantPreferencesTab.alerts.success'));
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || t('RestaurantPreferencesTab.errors.save'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleRefresh = () => {
    loadPreferences();
    setSuccess(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
          <Loader2 className="w-6 h-6 animate-spin text-blue-600 dark:text-blue-400" />
          <span className="text-gray-600 dark:text-gray-300">
            {t('RestaurantPreferencesTab.loading')}
          </span>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
          <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
          <span className="text-red-800 dark:text-red-300">
            {error || t('RestaurantPreferencesTab.errors.loadGeneral')}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
          <Globe className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {t('RestaurantPreferencesTab.title')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {t('RestaurantPreferencesTab.subtitle')}
            </p>
          </div>
        </div>

        <div className={`flex flex-wrap justify-center  gap-3 items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'} ${isLoading ? 'animate-spin' : ''}`} />
            {t('RestaurantPreferencesTab.buttons.refresh')}
          </button>

          <button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'} animate-spin`} />
            ) : (
              <Save className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            )}
            {isSaving 
              ? t('RestaurantPreferencesTab.buttons.saving') 
              : t('RestaurantPreferencesTab.buttons.save')}
          </button>
        </div>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="text-red-800 dark:text-red-300">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-green-800 dark:text-green-300">{success}</span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="space-y-8">
        {/* Language Settings Section */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} mb-4`}>
            <Languages className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('RestaurantPreferencesTab.sections.languageSettings.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {t('RestaurantPreferencesTab.sections.languageSettings.subtitle')}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Default Language Selection - Using Custom Select */}
            <div className="relative z-10">
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                {t('RestaurantPreferencesTab.form.defaultLanguage.label')}
              </label>
              
              <CustomSelect
                value={formData.defaultLanguage}
                onChange={(val) => handleFieldChange('defaultLanguage', val)}
                options={preferences?.availableLanguages
                  .filter(lang => formData.supportedLanguages?.includes(lang.code))
                  .map(lang => ({
                    value: lang.code,
                    label: `${lang.nativeName} (${lang.displayName})`
                  })) || []
                }
                placeholder="Select Default Language"
              />

              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {t('RestaurantPreferencesTab.form.defaultLanguage.helperText')}
              </p>
            </div>

            {/* Supported Languages */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
                {t('RestaurantPreferencesTab.form.supportedLanguages.label')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {preferences?.availableLanguages.map((lang) => {
                  const isSupported = formData.supportedLanguages?.includes(lang.code) || false;
                  const isDefaultLang = formData.defaultLanguage === lang.code;

                  return (
                    <div
                      key={lang.code}
                      className={`flex items-center p-3 rounded-lg border transition-all ${
                        isSupported
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      <input
                        id={`lang-${lang.code}`}
                        type="checkbox"
                        checked={isSupported}
                        disabled={isDefaultLang}
                        onChange={() => toggleLanguage(lang.code)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50"
                      />
                      <label
                        htmlFor={`lang-${lang.code}`}
                        className={`ml-2 rtl:mr-2 rtl:ml-0 text-sm font-medium cursor-pointer ${
                          isDefaultLang ? 'opacity-50' : ''
                        } ${
                          isSupported
                            ? 'text-blue-900 dark:text-blue-300'
                            : 'text-gray-900 dark:text-gray-300'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span>{lang.nativeName}</span>
                        </div>
                      </label>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                {t('RestaurantPreferencesTab.form.supportedLanguages.helperText')}
              </p>

              {/* Warning about cascade */}
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className={`flex items-start ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-yellow-800 dark:text-yellow-300">
                    <p className="font-medium mb-1">{t('RestaurantPreferencesTab.alerts.cascadeWarning.title')}</p>
                    <p>
                      {t('RestaurantPreferencesTab.alerts.cascadeWarning.description')}
                    </p>
                    <ul className={`list-disc list-inside mt-1 space-y-1 ${isRTL ? 'mr-1' : 'ml-1'}`}>
                      <li>{t('RestaurantPreferencesTab.alerts.cascadeWarning.point1')}</li>
                      <li>{t('RestaurantPreferencesTab.alerts.cascadeWarning.point2')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Currency Settings Section */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} mb-4`}>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('RestaurantPreferencesTab.sections.currencySettings.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {t('RestaurantPreferencesTab.sections.currencySettings.subtitle')}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Custom Currency Selector */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                {t('RestaurantPreferencesTab.form.defaultCurrency.label')}
              </label>

              {/* Currency Display Button */}
              <button
                type="button"
                onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:border-blue-500 dark:hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all flex items-center justify-between shadow-sm"
              >
                <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                  <span className="text-2xl font-bold text-gray-700 dark:text-gray-300">{getSelectedCurrency()?.symbol || '$'}</span>
                  <div className={`text-left ${isRTL ? 'text-right' : ''}`}>
                    <div className="font-medium">{getSelectedCurrency()?.displayName || 'Select Currency'}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{getSelectedCurrency()?.code || ''}</div>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isCurrencyDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown */}
              <AnimatePresence>
                {isCurrencyDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-96 overflow-hidden flex flex-col"
                  >
                    {/* Search Input */}
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
                      <div className="relative">
                        <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400`} />
                        <input
                          type="text"
                          placeholder="Search currencies..."
                          value={currencySearchQuery}
                          onChange={(e) => setCurrencySearchQuery(e.target.value)}
                          className={`w-full ${isRTL ? 'pr-10 pl-3' : 'pl-10 pr-3'} py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                          autoFocus
                        />
                      </div>
                    </div>

                    {/* Currency List */}
                    <div className="max-h-80 overflow-y-auto custom-scrollbar">
                      {getFilteredCurrencies().map((currency) => {
                        const isSelected = formData?.defaultCurrency === currency.code;
                        return (
                          <button
                            key={currency.code}
                            type="button"
                            onClick={() => handleCurrencySelect(currency)}
                            className={`w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                              isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                            }`}
                          >
                            <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                              <span className="text-xl font-bold text-gray-600 dark:text-gray-400 w-8 text-center">{currency.symbol}</span>
                              <div className={`text-left ${isRTL ? 'text-right' : ''}`}>
                                <div className={`font-medium ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                                  {currency.displayName}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{currency.code}</div>
                              </div>
                            </div>
                            {isSelected && <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                          </button>
                        );
                      })}

                      {getFilteredCurrencies().length === 0 && (
                        <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                          No currencies found
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {t('RestaurantPreferencesTab.form.defaultCurrency.helperText')}
              </p>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className={`flex items-start ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800 dark:text-blue-300">
              <p className="font-medium mb-1">{t('RestaurantPreferencesTab.alerts.validationInfo.title')}</p>
              <ul className={`list-disc list-inside space-y-1 ${isRTL ? 'mr-1' : 'ml-1'}`}>
                <li>{t('RestaurantPreferencesTab.alerts.validationInfo.point1')}</li>
                <li>{t('RestaurantPreferencesTab.alerts.validationInfo.point2')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantPreferencesTab;