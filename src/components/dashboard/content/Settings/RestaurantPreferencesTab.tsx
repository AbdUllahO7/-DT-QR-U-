import React, { useState, useEffect, useCallback } from 'react';
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
import { useLanguage } from '../../../../contexts/LanguageContext';
import {
  RestaurantPreferences,
  restaurantPreferencesService,
  UpdateRestaurantPreferencesDto,
  CurrencyOption,
} from '../../../../services/RestaurantPreferencesService';
import { useCurrency } from '../../../../hooks/useCurrency';

interface RestaurantPreferencesTabProps {
  className?: string;
}

const RestaurantPreferencesTab: React.FC<RestaurantPreferencesTabProps> = ({ className = '' }) => {
  const { t } = useLanguage();

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
      // Translation: Error loading restaurant preferences
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

      // Reload preferences to get updated data
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
      // Translation: Restaurant preferences updated successfully
      setSuccess(t('RestaurantPreferencesTab.alerts.success'));

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      // Translation: Error saving restaurant preferences
      setError(err.message || t('RestaurantPreferencesTab.errors.save'));
    } finally {
      setIsSaving(false);
    }
  };

  // Refresh preferences
  const handleRefresh = () => {
    loadPreferences();
    setSuccess(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
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
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
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

        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0 ${isLoading ? 'animate-spin' : ''}`} />
            {t('RestaurantPreferencesTab.buttons.refresh')}
          </button>

          <button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
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
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="text-red-800 dark:text-red-300">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-green-800 dark:text-green-300">{success}</span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="space-y-8">
        {/* Language Settings Section */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
          <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
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
            {/* Default Language Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                {t('RestaurantPreferencesTab.form.defaultLanguage.label')}
              </label>
              <select
                title="defaultLanguage"
                value={formData.defaultLanguage}
                onChange={(e) => handleFieldChange('defaultLanguage', e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {preferences?.availableLanguages
                  .filter(lang => formData.supportedLanguages?.includes(lang.code))
                  .map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      ({lang.nativeName})
                    </option>
                  ))}
              </select>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {t('RestaurantPreferencesTab.form.defaultLanguage.helperText')}
              </p>
            </div>

            {/* Supported Languages */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
                {t('RestaurantPreferencesTab.form.supportedLanguages.label')}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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
                <div className="flex items-start space-x-3 rtl:space-x-reverse">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-yellow-800 dark:text-yellow-300">
                    <p className="font-medium mb-1">{t('RestaurantPreferencesTab.alerts.cascadeWarning.title')}</p>
                    <p>
                      {t('RestaurantPreferencesTab.alerts.cascadeWarning.description')}
                    </p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
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
          <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
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
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:border-blue-500 dark:hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all flex items-center justify-between"
              >
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <span className="text-2xl">{getSelectedCurrency()?.symbol || '$'}</span>
                  <div className="text-left rtl:text-right">
                    <div className="font-medium">{getSelectedCurrency()?.displayName || 'Select Currency'}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{getSelectedCurrency()?.code || ''}</div>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isCurrencyDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown */}
              {isCurrencyDropdownOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-96 overflow-hidden">
                  {/* Search Input */}
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
                    <div className="relative">
                      <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search currencies..."
                        value={currencySearchQuery}
                        onChange={(e) => setCurrencySearchQuery(e.target.value)}
                        className="w-full pl-10 rtl:pr-10 rtl:pl-3 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Currency List */}
                  <div className="max-h-80 overflow-y-auto">
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
                          <div className="flex items-center space-x-3 rtl:space-x-reverse">
                            <span className="text-2xl w-8 text-center">{currency.symbol}</span>
                            <div className="text-left rtl:text-right">
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
                </div>
              )}

              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {t('RestaurantPreferencesTab.form.defaultCurrency.helperText')}
              </p>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start space-x-3 rtl:space-x-reverse">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800 dark:text-blue-300">
              <p className="font-medium mb-1">{t('RestaurantPreferencesTab.alerts.validationInfo.title')}</p>
              <ul className="list-disc list-inside space-y-1">
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