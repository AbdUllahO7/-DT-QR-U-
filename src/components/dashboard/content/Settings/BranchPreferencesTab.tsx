import React, { useEffect, useCallback } from 'react';
import { 
  Settings, 
  Save, 
  RefreshCw, 
  ShoppingCart, 
  Eye, 
  CreditCard, 
  Globe, 
  Clock,
  AlertCircle,
  CheckCircle,
  Loader2,
  Building2,
} from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { BranchPreferences, branchPreferencesService, UpdateBranchPreferencesDto } from '../../../../services/Branch/BranchPreferencesService';
import { BranchDropdownItem } from '../../../../types/BranchManagement/type';

interface BranchPreferencesComponentProps {
  className?: string;
  selectedBranch: BranchDropdownItem | null;
  preferences: BranchPreferences | null;
  setPreferences: (prefs: BranchPreferences | null) => void;
  formData: UpdateBranchPreferencesDto | null;
  setFormData: (data: UpdateBranchPreferencesDto | null) => void;
  isSaving: boolean;
  setIsSaving: (isSaving: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  success: string | null;
  setSuccess: (success: string | null) => void;
  hasChanges: boolean;
  setHasChanges: (hasChanges: boolean) => void;
}

const BranchPreferencesComponent: React.FC<BranchPreferencesComponentProps> = ({
  className = '',
  selectedBranch,
  preferences,
  setPreferences,
  formData,
  setFormData,
  isSaving,
  setIsSaving,
  error,
  setError,
  success,
  setSuccess,
  hasChanges,
  setHasChanges,
}) => {
  const { t } = useLanguage();

  // Currency options
  const currencies = [
    { value: 'TRY', label: t('branchPreferences.currencies.TRY') },
    { value: 'USD', label: t('branchPreferences.currencies.USD') },
    { value: 'EUR', label: t('branchPreferences.currencies.EUR') },
  ];

  // Timezone options
  const timezones = [
    { value: 'Europe/Istanbul', label: t('branchPreferences.timezones.Europe/Istanbul') },
    { value: 'Europe/London', label: t('branchPreferences.timezones.Europe/London') },
    { value: 'America/New_York', label: t('branchPreferences.timezones.America/New_York') },
  ];

  const cleanupModes = [
    { value: 0, label: t('branchPreferences.cleanupModes.afterTimeout') },
    { value: 1, label: t('branchPreferences.cleanupModes.afterClosing') },
    { value: 2, label: t('branchPreferences.cleanupModes.disabled') },
  ];

  // Load preferences for current branch
  const loadPreferences = useCallback(async (branchId?: number) => {
    if (!branchId) return;
    try {
      setError(null);
      const data = await branchPreferencesService.getBranchPreferences(branchId);
      setPreferences(data);
      const initialFormData: UpdateBranchPreferencesDto = {
        autoConfirmOrders: data.autoConfirmOrders,
        useWhatsappForOrders: data.useWhatsappForOrders,
        showProductDescriptions: data.showProductDescriptions,
        enableAllergenDisplay: data.enableAllergenDisplay,
        enableIngredientDisplay: data.enableIngredientDisplay,
        acceptCash: data.acceptCash,
        acceptCreditCard: data.acceptCreditCard,
        acceptOnlinePayment: data.acceptOnlinePayment,
        defaultCurrency: data.defaultCurrency,
        supportedLanguages: data.supportedLanguages,
        defaultLanguage: data.defaultLanguage,
        timeZoneId: data.timeZoneId,
        sessionTimeoutMinutes: data.sessionTimeoutMinutes,
        cleanupMode: data.cleanupMode,
        cleanupDelayAfterCloseMinutes: data.cleanupDelayAfterCloseMinutes,
        rowVersion: data.rowVersion,
      };
      setFormData(initialFormData);
      setHasChanges(false);
    } catch (err: any) {
      setError(err.message || t('branchPreferences.errors.loadFailed'));
    }
  }, [setPreferences, setFormData, setError, setHasChanges, t]);

  // Load preferences when branch changes
  useEffect(() => {
    if (selectedBranch) {
      loadPreferences(selectedBranch.branchId);
    } else {
      setPreferences(null);
      setFormData(null);
    }
  }, [selectedBranch, loadPreferences]);

  // Handle form field changes
  const handleFieldChange = (field: keyof UpdateBranchPreferencesDto, value: any) => {
    if (!formData) return;
    const updatedFormData = { ...formData, [field]: value };
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

  // Save preferences
  const handleSave = async () => {
    if (!formData || !hasChanges || !selectedBranch) return;
    try {
      setIsSaving(true);
      setError(null);

      await branchPreferencesService.updateBranchPreferences(formData, selectedBranch.branchId);

      // Reload preferences to get complete data including availableLanguages
      await loadPreferences(selectedBranch.branchId);

      setHasChanges(false);
      setSuccess(t('branchPreferences.saveSuccess'));
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || t('branchPreferences.errors.saveFailed'));
    } finally {
      setIsSaving(false);
    }
  };

  // Refresh preferences
  const handleRefresh = () => {
    if (selectedBranch) {
      loadPreferences(selectedBranch.branchId);
      setSuccess(null);
    }
  };

  if (!selectedBranch) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
          <span className="text-red-800 dark:text-red-300">
            {t('branchPreferences.errors.noBranchSelected')}
          </span>
        </div>
      </div>
    );
  }

  if (!formData || !preferences) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600 dark:text-blue-400" />
          <span className="text-gray-600 dark:text-gray-300">
            {t('branchPreferences.loading')}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <Settings className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('branchPreferences.title')}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {t('branchPreferences.description')}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <button
              onClick={handleRefresh}
              disabled={isSaving}
              className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0 ${isSaving ? 'animate-spin' : ''}`} />
              {t('branchPreferences.refresh')}
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
              {isSaving ? t('branchPreferences.saving') : t('branchPreferences.saveChanges')}
            </button>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
               {selectedBranch.branchName}
            </span>
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="mx-6 mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="text-red-800 dark:text-red-300">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="mx-6 mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-green-800 dark:text-green-300">{success}</span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6 space-y-8">
        {/* Order Management Section */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
          <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
            <ShoppingCart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('branchPreferences.sections.orderManagement.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {t('branchPreferences.sections.orderManagement.description')}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
              <div>
                <label className="text-sm font-medium text-gray-900 dark:text-white">
                  {t('branchPreferences.sections.orderManagement.autoConfirmOrders')}
                </label>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {t('branchPreferences.sections.orderManagement.autoConfirmOrdersDesc')}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  title='autoConfirmOrders'
                  type="checkbox"
                  checked={formData.autoConfirmOrders}
                  onChange={(e) => handleFieldChange('autoConfirmOrders', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
              <div>
                <label className="text-sm font-medium text-gray-900 dark:text-white">
                  {t('branchPreferences.sections.orderManagement.useWhatsappForOrders')}
                </label>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {t('branchPreferences.sections.orderManagement.useWhatsappForOrdersDesc')}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  title='useWhatsappForOrders'
                  type="checkbox"
                  checked={formData.useWhatsappForOrders}
                  onChange={(e) => handleFieldChange('useWhatsappForOrders', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Display Settings Section */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
          <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
            <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('branchPreferences.sections.displaySettings.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {t('branchPreferences.sections.displaySettings.description')}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
              <div>
                <label className="text-sm font-medium text-gray-900 dark:text-white">
                  {t('branchPreferences.sections.displaySettings.showProductDescriptions')}
                </label>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {t('branchPreferences.sections.displaySettings.showProductDescriptionsDesc')}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  title='showProductDescriptions'
                  type="checkbox"
                  checked={formData.showProductDescriptions}
                  onChange={(e) => handleFieldChange('showProductDescriptions', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
              <div>
                <label className="text-sm font-medium text-gray-900 dark:text-white">
                  {t('branchPreferences.sections.displaySettings.enableAllergenDisplay')}
                </label>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {t('branchPreferences.sections.displaySettings.enableAllergenDisplayDesc')}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  title='enableAllergenDisplay'
                  type="checkbox"
                  checked={formData.enableAllergenDisplay}
                  onChange={(e) => handleFieldChange('enableAllergenDisplay', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
              <div>
                <label className="text-sm font-medium text-gray-900 dark:text-white">
                  {t('branchPreferences.sections.displaySettings.enableIngredientDisplay')}
                </label>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {t('branchPreferences.sections.displaySettings.enableIngredientDisplayDesc')}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  title='enableIngredientDisplay'
                  type="checkbox"
                  checked={formData.enableIngredientDisplay}
                  onChange={(e) => handleFieldChange('enableIngredientDisplay', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Payment Methods Section */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
          <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
            <CreditCard className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('branchPreferences.sections.paymentMethods.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {t('branchPreferences.sections.paymentMethods.description')}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
              <div>
                <label className="text-sm font-medium text-gray-900 dark:text-white">
                  {t('branchPreferences.sections.paymentMethods.acceptCash')}
                </label>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {t('branchPreferences.sections.paymentMethods.acceptCashDesc')}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  title='acceptCash'
                  type="checkbox"
                  checked={formData.acceptCash}
                  onChange={(e) => handleFieldChange('acceptCash', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
              <div>
                <label className="text-sm font-medium text-gray-900 dark:text-white">
                  {t('branchPreferences.sections.paymentMethods.acceptCreditCard')}
                </label>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {t('branchPreferences.sections.paymentMethods.acceptCreditCardDesc')}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  title='acceptCreditCard'
                  type="checkbox"
                  checked={formData.acceptCreditCard}
                  onChange={(e) => handleFieldChange('acceptCreditCard', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
              <div>
                <label className="text-sm font-medium text-gray-900 dark:text-white">
                  {t('branchPreferences.sections.paymentMethods.acceptOnlinePayment')}
                </label>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {t('branchPreferences.sections.paymentMethods.acceptOnlinePaymentDesc')}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  title='acceptOnlinePayment'
                  type="checkbox"
                  checked={formData.acceptOnlinePayment}
                  onChange={(e) => handleFieldChange('acceptOnlinePayment', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Localization Section */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
          <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
            <Globe className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('branchPreferences.sections.localization.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {t('branchPreferences.sections.localization.description')}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                {t('branchPreferences.sections.localization.defaultLanguage')}
              </label>
              <select
                title='defaultLanguage'
                value={formData.defaultLanguage}
                onChange={(e) => handleFieldChange('defaultLanguage', e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {(preferences?.availableLanguages || [])
                  .filter(lang => formData.supportedLanguages?.includes(lang.code))
                  .map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.displayName} ({lang.nativeName})
                    </option>
                  ))}
              </select>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {t('branchPreferences.sections.localization.defaultLanguageDesc')}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                {t('branchPreferences.sections.localization.defaultCurrency')}
              </label>
              <select
                title='defaultCurrency'
                value={formData.defaultCurrency}
                onChange={(e) => handleFieldChange('defaultCurrency', e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {currencies.map((currency) => (
                  <option key={currency.value} value={currency.value}>
                    {currency.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                {t('branchPreferences.sections.localization.timeZone')}
              </label>
              <select
                title='timeZoneId'
                value={formData.timeZoneId}
                onChange={(e) => handleFieldChange('timeZoneId', e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {timezones.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
                {t('branchPreferences.sections.localization.supportedLanguages')}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {(preferences?.availableLanguages || []).map((lang) => {
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
                          <span>{lang.displayName}</span>
                          <span className="text-xs opacity-75">{lang.nativeName}</span>
                        </div>
                      </label>
                    </div>
                  );
                })}
              </div>
            

              {/* Warning about available languages */}
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-start space-x-3 rtl:space-x-reverse">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800 dark:text-blue-300">
                    <p>
                      {t('branchPreferences.sections.localization.languageRestaurantNote')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Session Management Section */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
          <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
            <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('branchPreferences.sections.sessionManagement.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {t('branchPreferences.sections.sessionManagement.description')}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                {t('branchPreferences.sections.sessionManagement.cleanupMode')}
              </label>
              <select
                title='cleanupMode'
                value={formData.cleanupMode}
                onChange={(e) => handleFieldChange('cleanupMode', parseInt(e.target.value))}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                {cleanupModes.map((mode) => (
                  <option key={mode.value} value={mode.value}>
                    {mode.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {t('branchPreferences.sections.sessionManagement.cleanupModeDesc')}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.cleanupMode === 0 && (
                <div className="transition-all duration-300 ease-in-out">
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    {t('branchPreferences.sections.sessionManagement.sessionTimeout')}
                  </label>
                  <input
                    title='sessionTimeoutMinutes'
                    type="number"
                    min="5"
                    max="1440"
                    value={formData.sessionTimeoutMinutes}
                    onChange={(e) => handleFieldChange('sessionTimeoutMinutes', parseInt(e.target.value) || 30)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {t('branchPreferences.sections.sessionManagement.sessionTimeoutDesc')}
                  </p>
                </div>
              )}
              {formData.cleanupMode === 1 && (
                <div className="transition-all duration-300 ease-in-out">
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    {t('branchPreferences.sections.sessionManagement.cleanupDelay')}
                  </label>
                  <input
                    title='cleanupDelayAfterCloseMinutes'
                    type="number"
                    min="0"
                    max="60"
                    value={formData.cleanupDelayAfterCloseMinutes}
                    onChange={(e) => handleFieldChange('cleanupDelayAfterCloseMinutes', parseInt(e.target.value) || 5)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {t('branchPreferences.sections.sessionManagement.cleanupDelayDesc')}
                  </p>
                </div>
              )}
              {formData.cleanupMode === 2 && (
                <div className="transition-all duration-300 ease-in-out p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    <span className="text-yellow-800 dark:text-yellow-300 text-sm">
                      {t('branchPreferences.sections.sessionManagement.cleanupDisabledMessage')}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchPreferencesComponent;