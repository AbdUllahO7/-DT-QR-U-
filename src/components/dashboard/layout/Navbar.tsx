import React from 'react';
import {
  Menu,
  Sun,
  Moon,
  Bell,
  ChevronDown,
  Building2
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
      <nav className="w-full px-3 md:px-4 lg:px-8 py-3 md:py-4">
        <div className="flex items-center justify-between gap-2">
          {/* Left - Menu and Title */}
          <div className={`flex items-center flex-1 min-w-0 ${isRTL ? 'space-x-reverse space-x-2 md:space-x-3' : 'space-x-2 md:space-x-3'}`}>
            <button
              onClick={toggleSidebar}
              className="lg:hidden min-w-[44px] min-h-[44px] p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
              aria-label={t('accessibility.menu')}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base md:text-lg lg:text-xl font-semibold text-gray-900 dark:text-white truncate">
                  {title}
                </h1>
                {/* Branch Mode Indicator */}
                {branchName && (
                  <span className="inline-flex items-center px-2 md:px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 whitespace-nowrap">
                    <Building2 className="h-3 w-3 mr-1" />
                    <span className="hidden sm:inline">{branchName}</span>
                  </span>
                )}
              </div>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 truncate hidden sm:block">
                {description}
              </p>
            </div>
          </div>

          {/* Right - Controls (Responsive) */}
          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2 md:space-x-3' : 'space-x-2 md:space-x-3'}`}>
            {/* SearchBox - Hidden on mobile, shown on md+ */}
            <div className="hidden md:block ml-2">
              <SearchBox onSearch={onSearch} onResultClick={onSearchResultClick} />
            </div>

            {/* Language Selector - Hidden on mobile, shown on sm+ */}
            <div className="sm:block">
              <LanguageSelector variant="navbar" />
            </div>

            {/* Theme Toggle - Always visible with 44px touch target */}
            <button
              onClick={toggleTheme}
              className="min-w-[44px] min-h-[44px] p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center"
              title={isDark ? t('theme.toggleToLight') : t('theme.toggleToDark')}
              aria-label={t('accessibility.theme')}
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Profile Dropdown - Always visible */}
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