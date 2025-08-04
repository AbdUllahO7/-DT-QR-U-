import React from 'react';
import {
  Menu,
  Sun,
  Moon,
  Bell,
  ChevronDown
} from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import SearchBox from '../common/SearchBox';
import ProfileDropdown from '../common/ProfileDropdown';
import LanguageSelector from '../../LanguageSelector';

interface NavbarProps {
  toggleSidebar: () => void;
  activeTab: string;
  branchName: string | null;
  onLogout: () => void;
  onSearch: (query: string) => void;
  onSearchResultClick: (result: any) => void;
  isBranchOnly: boolean;
  onTabChange: (tab: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  toggleSidebar,
  activeTab,
  branchName,
  onLogout,
  onSearch,
  onSearchResultClick,
  isBranchOnly,
  onTabChange
}) => {
  const { isDark, toggleTheme } = useTheme();
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  const getTabTitle = () => {
    switch (activeTab) {
      case 'overview':
        return {
          title: t('dashboard.overview.title'),
          description: t('dashboard.overview.description')
        };
      case 'branches':
        return {
          title: t('dashboard.branches.title'),
          description: t('dashboard.branches.description')
        };
      case 'orders':
        return {
          title: t('dashboard.orders.title'),
          description: t('dashboard.orders.description')
        };
      case 'products':
        return {
          title: t('dashboard.products.title'),
          description: t('dashboard.products.description')
        };
      case 'tables':
        return {
          title: t('dashboard.tables.title'),
          description: t('dashboard.tables.description')
        };
      case 'users':
        return {
          title: t('dashboard.users.title'),
          description: t('dashboard.users.description')
        };
      case 'settings':
        return {
          title: t('dashboard.settings.title'),
          description: t('dashboard.settings.description')
        };
      case 'profile':
        return {
          title: t('dashboard.profile.title'),
          description: t('dashboard.profile.description')
        };
      default:
        return {
          title: '',
          description: ''
        };
    }
  };

  const { title, description } = getTabTitle();

  return (
    <div className={`fixed top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm ${
      isRTL 
        ? 'left-0 right-0 lg:left-0 lg:right-64' 
        : 'left-0 right-0 lg:left-64 lg:right-0'
    }`}>
      <nav className="w-full px-4 lg:px-8 py-4" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex items-center justify-between">
          {/* Sol - Menü ve başlık */}
          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {title}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {description}
              </p>
            </div>
          </div>

          {/* Sağ - Arama, Dil, Tema, Bildirim, Profil */}
          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
            <SearchBox onSearch={onSearch} onResultClick={onSearchResultClick} />
            <LanguageSelector variant="navbar" />
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              title={isDark ? t('theme.toggleToLight') : t('theme.toggleToDark')}
              aria-label={t('accessibility.theme')}
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            <button 
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 relative"
              aria-label={t('accessibility.notifications')}
              title={t('notifications.title')}
            >
              <Bell className="h-5 w-5" />
              <span className={`absolute -top-1 ${isRTL ? '-left-1' : '-right-1'} h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center`}>
                3
              </span>
            </button>
            <ProfileDropdown
              branchName={branchName}
              onTabChange={onTabChange}
              onLogout={onLogout}
              isBranchOnly={isBranchOnly}
            />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar; 