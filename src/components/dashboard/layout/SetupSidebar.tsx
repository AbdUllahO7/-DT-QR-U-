import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { 
  Building2, 
  User, 
  Settings, 
  CreditCard, 
  LogOut, 
  RefreshCw,
  AlertCircle,
  Loader2,
  Store
} from 'lucide-react';

interface SetupSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  error: string | null;
  onLogout: () => void;
  onRetry: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const SetupSidebar: React.FC<SetupSidebarProps> = ({
  isOpen,
  onClose,
  isLoading,
  error,
  onLogout,
  onRetry,
  activeTab,
  setActiveTab
}) => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';

  const handleNavigation = (tab: string) => {
    navigate(`/dashboard/${tab}`);
    setActiveTab(tab);
    onClose();
  };

  const setupMenuItems = [
    {
      id: 'restaurant-management',
      label: t('restaurant.management') || 'Restaurant Management',
      icon: Building2,
      description: t('restaurant.setup.description') || 'Set up your restaurant information'
    },
    {
      id: 'profile',
      label: t('profile') || 'Profile',
      icon: User,
      description: t('profile.description') || 'Manage your profile settings'
    },
    {
      id: 'settings',
      label: t('settings') || 'Settings',
      icon: Settings,
      description: t('settings.description') || 'Configure your preferences'
    },
    {
      id: 'subscription',
      label: t('subscription') || 'Subscription',
      icon: CreditCard,
      description: t('subscription.description') || 'Manage your subscription'
    }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 h-full bg-white dark:bg-gray-800 shadow-lg z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : (isRTL ? 'translate-x-full' : '-translate-x-full')}
        ${isRTL ? 'right-0' : 'left-0'}
        lg:translate-x-0 lg:static lg:inset-0
        w-64 border-r border-gray-200 dark:border-gray-700
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Store className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('restaurant.setup.title') || 'Restaurant Setup'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('restaurant.setup.subtitle') || 'Complete your setup'}
                </p>
              </div>
            </div>
          </div>

          {/* Status Section */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            {isLoading ? (
              <div className="flex items-center space-x-3 text-blue-600 dark:text-blue-400">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm font-medium">
                  {t('restaurant.loading') || 'Loading restaurant info...'}
                </span>
              </div>
            ) : error ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-red-600 dark:text-red-400">
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    {t('restaurant.error') || 'Failed to load restaurant'}
                  </span>
                </div>
                <button
                  onClick={onRetry}
                  className="flex items-center space-x-2 text-sm bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>{t('retry') || 'Retry'}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 text-orange-600 dark:text-orange-400">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm font-medium">
                  {t('restaurant.setup.required') || 'Restaurant setup required'}
                </span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              {t('available.features') || 'Available Features'}
            </div>
            
            {setupMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`
                    w-full flex items-start space-x-3 p-3 rounded-lg transition-colors text-left
                    ${isActive 
                      ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                    isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{item.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {item.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onLogout}
              className="w-full flex items-center space-x-3 p-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">{t('logout') || 'Logout'}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SetupSidebar;