import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  BarChart3,
  FileText,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  X,

  FolderPlus
} from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { RestaurantBranchDropdownItem } from '../../../types/api';

interface SetupSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  restaurantName: string;
  branchName: string | null;
  isBranchOnly: boolean;
  onLogout: () => void;
  onSelectBranch: (item: RestaurantBranchDropdownItem) => void;
  onBackToMain: () => void;
}

const SetupSidebar: React.FC<SetupSidebarProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  restaurantName,
  branchName,
  isBranchOnly,
  onLogout,

}) => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  // Helper: Navigate to tab and update state
  const handleNavigate = (path: string, tab: string) => {
    navigate(`/dashboard/${path}`);
    setActiveTab(tab);
    // Close menu on mobile view
    if (isOpen) {
      onClose();
    }
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 ${isRTL ? 'right-0' : 'left-0'} z-30 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className={`px-6 py-5 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button
              onClick={handleHomeClick}
              className="flex items-center hover:opacity-80 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded-lg p-1"
            >
              <Building2 className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              <span className={`${isRTL ? 'mr-3' : 'ml-3'} text-xl font-bold text-gray-900 dark:text-white`}>{t('dashboard.sidebar.title')}</span>
            </button>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Restaurant & Branch Info */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 truncate">
              {restaurantName}
            </h2>
            {branchName && (
              <div className={`mt-1 flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2`}>
                <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                  {branchName}
                </span>
                <span className={`px-2 py-0.5 text-xs rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-300`}>
                  {t('dashboard.sidebar.branch')}
                </span>
              </div>
            )}

          
          </div>

          {/* Navigation */}
          <nav className="mt-5 flex-1 px-3 space-y-1">
         

          

            <button
              onClick={() => handleNavigate('orders', 'orders')}
              className={`w-full flex items-center px-3 py-2 rounded-md transition-colors duration-200 ${
                activeTab === 'orders'
                  ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              } ${isRTL ? 'text-right' : 'text-left'}`}
            >
              <FileText className={`h-5 w-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
              <span>{t('dashboard.orders.title')}</span>
            </button>

            <button
              onClick={() => handleNavigate('branchProducts', 'branchProducts')}
              className={`w-full flex items-center px-3 py-2 rounded-md transition-colors duration-200 ${
                activeTab === 'branchProducts'
                  ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              } ${isRTL ? 'text-right' : 'text-left'}`}
            >
              <ShoppingCart className={`h-5 w-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
              <span>{t('dashboard.products.title')}</span>
            </button>

        

            <button
              onClick={() => handleNavigate('TableManagement', 'TableManagement')}
              className={`w-full flex items-center px-3 py-2 rounded-md transition-colors duration-200 ${
                activeTab === 'TableManagement'
                  ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              } ${isRTL ? 'text-right' : 'text-left'}`}
            >
              <BarChart3 className={`h-5 w-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
              <span>{t('dashboard.tables.title')}</span>
            </button>

            <button
              onClick={() => handleNavigate('BranchManagement', 'BranchManagement')}
              className={`w-full flex items-center px-3 py-2 rounded-md transition-colors duration-200 ${
                activeTab === 'BranchManagement'
                  ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              } ${isRTL ? 'text-right' : 'text-left'}`}
            >
              <BarChart3 className={`h-5 w-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
              <span>{t('dashboard.branchManagementTitle')}</span>
            </button>
                 <button
                          onClick={() => handleNavigate('ingredients', 'ingredients')}
                          className={`w-full flex items-center px-3 py-2 rounded-md transition-colors duration-200 ${
                            activeTab === 'ingredients'
                              ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          } ${isRTL ? 'text-right' : 'text-left'}`}
                        >
                          <FolderPlus className={`h-5 w-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                          <span>{t('dashboard.ingredients.title')}</span>
                        </button>

            {/* User Management - Only for non-branch-only users */}
            {!isBranchOnly && (
              <button
                onClick={() => handleNavigate('users', 'users')}
                className={`w-full flex items-center px-3 py-2 rounded-md transition-colors duration-200 ${
                  activeTab === 'users'
                    ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                } ${isRTL ? 'text-right' : 'text-left'}`}
              >
                <Users className={`h-5 w-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                <span>{t('dashboard.users.title')}</span>
              </button>
            )}

            {/* Settings - Only for non-branch-only users */}
            {!isBranchOnly && (
              <button
                onClick={() => handleNavigate('settings', 'settings')}
                className={`w-full flex items-center px-4 py-3 rounded-lg ${
                  activeTab === 'settings'
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                } ${isRTL ? 'text-right' : 'text-left'}`}
              >
                <Settings className={`h-5 w-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                <span>{t('dashboard.settings.title')}</span>
              </button>
            )}

         
          </nav>

          {/* Logout */}
          <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onLogout}
              className={`w-full flex items-center px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg ${isRTL ? 'text-right' : 'text-left'}`}
            >
              <LogOut className={`h-5 w-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
              <span>{t('dashboard.sidebar.logout')}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SetupSidebar;