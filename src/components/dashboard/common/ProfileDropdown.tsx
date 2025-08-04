import React, { useState, useRef, useEffect } from 'react';
import { User, FileText, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useClickOutside } from '../../../hooks';
import { useLanguage } from '../../../contexts/LanguageContext';
import { authService } from '../../../services/authService';
import { UserProfileResponse } from '../../../types/api';

interface ProfileDropdownProps {
  branchName: string | null;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  isBranchOnly: boolean;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  branchName,
  onTabChange,
  onLogout,
  isBranchOnly
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t, isRTL } = useLanguage();

  useClickOutside(dropdownRef, () => setIsOpen(false));

  // Kullanıcı bilgilerini al
  useEffect(() => {
    let isMounted = true;
    
    const fetchUserProfile = async () => {
      try {
        const res = await authService.getUserProfile();
        if (isMounted) {
          setUserProfile(res.data as UserProfileResponse);
        }
      } catch (err) {
        if (isMounted) {
          const { logger } = await import('../../../utils/logger');
          logger.error('ProfileDropdown: Kullanıcı bilgileri alınamadı', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    fetchUserProfile();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Kullanıcı bilgilerinden display name ve initials al
  const getUserDisplayInfo = () => {
    if (!userProfile) {
      return {
        displayName: t('profile.defaultName'),
        initials: 'K'
      };
    }

    const { appUser } = userProfile;
    const displayName = `${appUser.name} ${appUser.surname}`.trim();
    const initials = `${appUser.name?.charAt(0) || ''}${appUser.surname?.charAt(0) || ''}`.toUpperCase();

    return {
      displayName: displayName || t('profile.defaultName'),
      initials: initials || 'K'
    };
  };

  const { displayName, initials } = getUserDisplayInfo();

  if (loading) {
    return (
      <div className="relative">
        <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} p-2 rounded-lg`}>
          <div className="hidden md:block">
            <div className={`h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1 ${isRTL ? 'text-right' : 'text-left'}`}></div>
          </div>
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef} dir={isRTL ? 'rtl' : 'ltr'}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200`}
      >
        <div className={`hidden md:block ${isRTL ? 'text-right' : 'text-left'}`}>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {displayName}
          </p>
          {branchName && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {branchName}
            </p>
          )}
        </div>
        <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-white">
            {initials}
          </span>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </button>

      {/* Profile Dropdown Menu */}
      {isOpen && (
        <div className={`absolute mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 ${
          isRTL ? 'left-0' : 'right-0'
        }`}>
          <div className="py-2">
            <button
              onClick={() => {
                onTabChange('profile');
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center ${
                isRTL ? 'text-right space-x-reverse space-x-3' : 'text-left space-x-3'
              }`}
            >
              <User className="h-4 w-4" />
              <span>{t('profile.title')}</span>
            </button>
            <button
              onClick={() => {
                onTabChange('subscription');
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center ${
                isRTL ? 'text-right space-x-reverse space-x-3' : 'text-left space-x-3'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>{t('subscription.title')}</span>
            </button>
            {!isBranchOnly && (
              <button
                onClick={() => {
                  onTabChange('settings');
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center ${
                  isRTL ? 'text-right space-x-reverse space-x-3' : 'text-left space-x-3'
                }`}
              >
                <Settings className="h-4 w-4" />
                <span>{t('settings.title')}</span>
              </button>
            )}
            <hr className="my-2 border-gray-200 dark:border-gray-700" />
            <button
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center ${
                isRTL ? 'text-right space-x-reverse space-x-3' : 'text-left space-x-3'
              }`}
            >
              <LogOut className="h-4 w-4" />
              <span>{t('auth.logout')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown; 