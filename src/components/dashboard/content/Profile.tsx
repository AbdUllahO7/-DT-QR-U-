import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Calendar, 
  Building2, 
  ShieldCheck, 
  Edit3,
  Camera,
  CheckCircle,
  XCircle,
  Crown
} from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { UserProfileResponse } from '../../../types/api';
import { authService } from '../../../services/authService';
import { CATEGORY_COLORS } from '../../../types/BranchManagement/type';

// Kategori renkleri


const Profile: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [userProfile, setUserProfile] = useState<UserProfileResponse | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchProfile = async () => {
      try {
        const res = await authService.getUserProfile();
        if (isMounted) {
          setUserProfile(res.data as UserProfileResponse);
        }
      } catch (err) {
        if (isMounted) {
          const { logger } = await import('../../../utils/logger');
          logger.error('Profil verisi alınamadı', err);
          setProfileError(t('profile.error.loadFailed'));
        }
      } finally {
        if (isMounted) {
          setProfileLoading(false);
        }
      }
    };
    
    fetchProfile();
    
    return () => {
      isMounted = false;
    };
  }, [t]);

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (profileError || !userProfile) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">{profileError || t('profile.error.loadFailed')}</p>
        </div>
      </div>
    );
  }

  const { appUser, appRoles } = userProfile;
  const displayName = `${appUser.name} ${appUser.surname}`.trim();
  const initials = `${appUser.name?.charAt(0) || ''}${appUser.surname?.charAt(0) || ''}`;
  const registerDate = new Date(appUser.createdDate).toLocaleDateString('tr-TR');
  const totalPermissions = appRoles.length; // appRoles is directly an array of permissions

  return (
    <div className="max-w-6xl mx-auto space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-2xl p-8 text-white shadow-xl"
      >
        <div className={`flex flex-col md:flex-row items-center space-y-6 md:space-y-0 ${isRTL ? 'md:space-x-reverse md:space-x-8' : 'md:space-x-8'}`}>
          {/* Profile Picture */}
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold ring-4 ring-white/30">
              {appUser.profileImage ? (
                <img
                  src={appUser.profileImage}
                  alt={displayName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <button className={`absolute -bottom-2 ${isRTL ? '-left-2' : '-right-2'} bg-white text-primary-600 p-2 rounded-full shadow-lg group-hover:scale-110 transition-transform`}>
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Profile Info */}
          <div className={`flex-1 ${isRTL ? 'text-center md:text-right' : 'text-center md:text-left'}`}>
            <h1 className="text-3xl font-bold mb-2">{displayName}</h1>
            <p className="text-primary-100 text-lg mb-4">{appUser.email}</p>
            
            <div className={`flex flex-wrap gap-3 ${isRTL ? 'justify-center md:justify-end' : 'justify-center md:justify-start'}`}>
              <span className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${
                appUser.isActive 
                  ? 'bg-green-500/20 text-green-100 border border-green-400/30' 
                  : 'bg-red-500/20 text-red-100 border border-red-400/30'
              }`}>
                {appUser.isActive ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                {appUser.isActive ? t('profile.accountStatus.active') : t('profile.accountStatus.inactive')}
              </span>
              
              {/* Display unique categories as role badges */}
              {[...new Set(appRoles.map(permission => permission.category))].map((category, index) => (
                <span key={index} className="px-4 py-2 rounded-full text-sm font-medium bg-white/10 text-white border border-white/20 flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  {t(`profile.categories.${category}`) || category}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <h2 className={`text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <User className="w-6 h-6 text-primary-600" />
              {t('profile.personalInfo')}
            </h2>
            <button className="text-primary-600 hover:text-primary-700 p-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
              <Edit3 className="w-5 h-5" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('profile.fields.firstName')}
                </label>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <p className={`font-medium text-gray-900 dark:text-white ${isRTL ? 'text-right' : 'text-left'}`}>{appUser.name}</p>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('profile.fields.lastName')}
                </label>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <p className={`font-medium text-gray-900 dark:text-white ${isRTL ? 'text-right' : 'text-left'}`}>{appUser.surname}</p>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('profile.fields.username')}
                </label>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <p className={`font-medium text-gray-900 dark:text-white ${isRTL ? 'text-right' : 'text-left'}`}>{appUser.userName}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('profile.fields.email')}
                </label>
                <div className={`p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Mail className="w-5 h-5 text-gray-400" />
                  <p className={`font-medium text-gray-900 dark:text-white ${isRTL ? 'text-right' : 'text-left'}`}>{appUser.email}</p>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('profile.fields.registrationDate')}
                </label>
                <div className={`p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <p className={`font-medium text-gray-900 dark:text-white ${isRTL ? 'text-right' : 'text-left'}`}>{registerDate}</p>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('profile.accountStatus.status')}
                </label>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                    appUser.isActive 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  } ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {appUser.isActive ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    {appUser.isActive ? t('profile.restaurant.status.active') : t('profile.restaurant.status.inactive')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Restaurant & Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Restaurant Info */}
          {appUser.restaurant && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className={`text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Building2 className="w-5 h-5 text-primary-600" />
                {t('profile.restaurant.info')}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('profile.restaurant.name')}
                  </label>
                  <p className={`font-medium text-gray-900 dark:text-white ${isRTL ? 'text-right' : 'text-left'}`}>{appUser.restaurant.restaurantName}</p>
                </div>

                <div>
                  <label className={`block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('profile.fields.status')}
                  </label>
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                    appUser.restaurant.restaurantStatus 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  } ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {appUser.restaurant.restaurantStatus ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    {appUser.restaurant.restaurantStatus ? t('profile.restaurant.status.active') : t('profile.restaurant.status.inactive')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h3 className={`text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <ShieldCheck className="w-5 h-5 text-primary-600" />
              {t('profile.permissions.summary')}
            </h3>
            
            <div className="space-y-4">
              <div className={`flex justify-between items-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-sm font-medium text-primary-800 dark:text-primary-200">{t('profile.permissions.totalCategories')}</span>
                <span className="text-2xl font-bold text-primary-600">{[...new Set(appRoles.map(permission => permission.category))].length}</span>
              </div>
              
              <div className={`flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">{t('profile.permissions.totalPermissions')}</span>
                <span className="text-2xl font-bold text-blue-600">{totalPermissions}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Roles & Permissions */}
      {appRoles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h2 className={`text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <ShieldCheck className="w-6 h-6 text-primary-600" />
            {t('profile.permissions.rolesAndPermissions')}
          </h2>

          <div className="space-y-6">
            {(() => {
              // Group permissions by category
              const categorizedPermissions = appRoles.reduce<Record<string, typeof appRoles>>((acc, permission) => {
                const category = permission.category || 'Other';
                (acc[category] = acc[category] || []).push(permission);
                return acc;
              }, {});

              return Object.entries(categorizedPermissions).map(([category, permissions]) => (
                <div key={category} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                  <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {t(`profile.categories.${category}`) || category}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {permissions.length} {t('profile.permissions.totalPermissions').toLowerCase()}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full text-sm font-medium">
                      {permissions.length}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${CATEGORY_COLORS[category]?.includes('bg-purple-100') ? 'bg-purple-500' : 
                        CATEGORY_COLORS[category]?.includes('bg-indigo-100') ? 'bg-indigo-500' :
                        CATEGORY_COLORS[category]?.includes('bg-green-100') ? 'bg-green-500' :
                        CATEGORY_COLORS[category]?.includes('bg-emerald-100') ? 'bg-emerald-500' :
                        CATEGORY_COLORS[category]?.includes('bg-cyan-100') ? 'bg-cyan-500' :
                        CATEGORY_COLORS[category]?.includes('bg-amber-100') ? 'bg-amber-500' :
                        CATEGORY_COLORS[category]?.includes('bg-orange-100') ? 'bg-orange-500' :
                        CATEGORY_COLORS[category]?.includes('bg-blue-100') ? 'bg-blue-500' :
                        CATEGORY_COLORS[category]?.includes('bg-red-100') ? 'bg-red-500' :
                        'bg-gray-400'}`}></span>
                      {t(`profile.categories.${category}`) || category} ({permissions.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {permissions.map((permission, permIndex) => {
                        const translatedName = t(`profile.permissionNames.${permission.name}`) || permission.description || permission.name;
                        const categoryColor = CATEGORY_COLORS[category] || 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-300';
                        
                        return (
                          <span
                            key={permIndex}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${categoryColor}`}
                            title={permission.description}
                          >
                            {translatedName}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ));
            })()}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Profile;