import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Check, 
  Mail, 
  MoonStar, 
  Sun, 
  Settings as SettingsIcon,
  User,
  Shield,
  Palette,
  Globe,
  Smartphone,
  Volume2,
  Eye,
  Lock,
  Download,
  Upload,
  Trash2,
  Save,
  AlertCircle,
  Info,
  ChevronRight,
  EyeOff,
  Languages,
  Clock,
  Calendar,
  Zap,
  Database,
  HardDrive,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';
import { useLanguage } from '../../../../contexts/LanguageContext';
import BranchPreferencesTab from './BranchPreferencesTab';

interface UserSettingsState {
  notificationsEnabled: boolean;
  emailNotificationsEnabled: boolean;
  pushNotificationsEnabled: boolean;
  soundEnabled: boolean;
  autoSaveEnabled: boolean;
  dataSyncEnabled: boolean;
  language: string;
  timezone: string;
  dateFormat: string;
  currency: string;
}

const Settings: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { t, language, setLanguage } = useLanguage();
  const isRTL = language === 'ar';

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

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'branch' | 'notifications' | 'privacy' | 'appearance' | 'data'>('branch');

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

  const handleToggle = (key: keyof UserSettingsState) => {
    setSettings(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem('userSettings', JSON.stringify(updated));
      return updated;
    });
  };

  const handleLanguageChange = (value: string) => {
    setSettings(prev => {
      const updated = { ...prev, language: value };
      localStorage.setItem('userSettings', JSON.stringify(updated));
      return updated;
    });
    // Update language context
    setLanguage(value as 'tr' | 'en' | 'ar');
  };

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const tabs = [
/*     { id: 'general', label: t('settings.tabs.general'), icon: SettingsIcon },
 */    { id: 'branch', label: t('branchPreferences.title'), icon: SettingsIcon },
/*     { id: 'notifications', label: t('settings.tabs.notifications'), icon: Bell },
 *//*     { id: 'privacy', label: t('settings.tabs.privacy'), icon: Shield },
 */    { id: 'appearance', label: t('settings.tabs.appearance'), icon: Palette },
/*     { id: 'data', label: t('settings.tabs.data'), icon: Database }
 */  
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
    <div className="max-w-3xl mx-auto space-y-8" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('settings.title')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t('settings.description')}
          </p>
        </div>
        <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
          <motion.button
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Save className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('settings.save')}
          </motion.button>
        </div>
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center"
          >
            <Check className={`h-5 w-5 text-green-500 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            <p className="text-sm text-green-600 dark:text-green-400">{t('settings.saveSuccess')}</p>
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
        {activeTab === 'general' && (
          <motion.div
            key="general"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* General Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} mb-6`}>
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <SettingsIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t('settings.general.title')}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('settings.general.description')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label={t('settings.general.language')}
                  value={settings.language}
                  onChange={handleLanguageChange}
                  options={[
                    { value: 'tr', label: t('language.turkish') },
                    { value: 'en', label: t('language.english') },
                    { value: 'ar', label: t('language.arabic') }
                  ]}
                  Icon={Languages}
                />

                <Select
                  label={t('settings.general.timezone')}
                  value={settings.timezone}
                  onChange={(value) => setSettings(prev => ({ ...prev, timezone: value }))}
                  options={[
                    { value: 'Europe/Istanbul', label: 'İstanbul (UTC+3)' },
                    { value: 'Europe/London', label: 'Londra (UTC+0)' },
                    { value: 'America/New_York', label: 'New York (UTC-5)' }
                  ]}
                  Icon={Clock}
                />

                <Select
                  label={t('settings.general.dateFormat')}
                  value={settings.dateFormat}
                  onChange={(value) => setSettings(prev => ({ ...prev, dateFormat: value }))}
                  options={[
                    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
                  ]}
                  Icon={Calendar}
                />

                <Select
                  label={t('settings.general.currency')}
                  value={settings.currency}
                  onChange={(value) => setSettings(prev => ({ ...prev, currency: value }))}
                  options={[
                    { value: 'TRY', label: 'Türk Lirası (₺)' },
                    { value: 'USD', label: 'US Dollar ($)' },
                    { value: 'EUR', label: 'Euro (€)' }
                  ]}
                  Icon={Zap}
                />
              </div>
            </div>

            {/* Auto Save Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} mb-6`}>
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Save className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t('settings.general.autoSave.title')}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('settings.general.autoSave.description')}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Switch
                  checked={settings.autoSaveEnabled}
                  onChange={() => handleToggle('autoSaveEnabled')}
                  label={t('settings.general.autoSave.enabled')}
                  description={t('settings.general.autoSave.enabledDesc')}
                  Icon={Save}
                />

                <Switch
                  checked={settings.dataSyncEnabled}
                  onChange={() => handleToggle('dataSyncEnabled')}
                  label={t('settings.general.autoSave.dataSync')}
                  description={t('settings.general.autoSave.dataSyncDesc')}
                  Icon={Wifi}
                />
              </div>
            </div>
          </motion.div>
        )}
        {activeTab === 'branch' && (
          <BranchPreferencesTab 
          
          />
        )}
        {activeTab === 'notifications' && (
          <motion.div
            key="notifications"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} mb-6`}>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t('settings.notifications.title')}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('settings.notifications.description')}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Switch
                  checked={settings.notificationsEnabled}
                  onChange={() => handleToggle('notificationsEnabled')}
                  label={t('settings.notifications.enabled')}
                  description={t('settings.notifications.enabledDesc')}
                  Icon={Bell}
                />

                <Switch
                  checked={settings.emailNotificationsEnabled}
                  onChange={() => handleToggle('emailNotificationsEnabled')}
                  label={t('settings.notifications.email')}
                  description={t('settings.notifications.emailDesc')}
                  Icon={Mail}
                />

                <Switch
                  checked={settings.pushNotificationsEnabled}
                  onChange={() => handleToggle('pushNotificationsEnabled')}
                  label={t('settings.notifications.push')}
                  description={t('settings.notifications.pushDesc')}
                  Icon={Smartphone}
                />

                <Switch
                  checked={settings.soundEnabled}
                  onChange={() => handleToggle('soundEnabled')}
                  label={t('settings.notifications.sound')}
                  description={t('settings.notifications.soundDesc')}
                  Icon={Volume2}
                />
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'privacy' && (
          <motion.div
            key="privacy"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} mb-6`}>
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t('settings.privacy.title')}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('settings.privacy.description')}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Switch
                  checked={true}
                  onChange={() => {}}
                  label={t('settings.privacy.twoFactor')}
                  description={t('settings.privacy.twoFactorDesc')}
                  Icon={Lock}
                  disabled={true}
                />

                <Switch
                  checked={true}
                  onChange={() => {}}
                  label={t('settings.privacy.autoLogout')}
                  description={t('settings.privacy.autoLogoutDesc')}
                  Icon={Clock}
                  disabled={true}
                />

                <Switch
                  checked={false}
                  onChange={() => {}}
                  label={t('settings.privacy.analytics')}
                  description={t('settings.privacy.analyticsDesc')}
                  Icon={Info}
                  disabled={true}
                />
              </div>
            </div>
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

        {activeTab === 'data' && (
          <motion.div
            key="data"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} mb-6`}>
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <Database className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t('settings.data.title')}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('settings.data.description')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.button
                  className={`flex items-center justify-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-200`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{t('settings.data.download')}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('settings.data.downloadDesc')}</p>
                  </div>
                </motion.button>

                <motion.button
                  className={`flex items-center justify-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-200`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Upload className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{t('settings.data.upload')}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('settings.data.uploadDesc')}</p>
                  </div>
                </motion.button>

                <motion.button
                  className={`flex items-center justify-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} p-4 border border-red-200 dark:border-red-700 rounded-lg hover:border-red-300 dark:hover:border-red-600 transition-all duration-200`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">{t('settings.data.delete')}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('settings.data.deleteDesc')}</p>
                  </div>
                </motion.button>

                <motion.button
                  className={`flex items-center justify-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-200`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <HardDrive className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{t('settings.data.storage')}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('settings.data.storageDesc')}</p>
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings;