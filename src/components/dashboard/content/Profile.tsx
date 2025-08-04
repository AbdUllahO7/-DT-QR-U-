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

// Permission çevirileri
const PERMISSION_TRANSLATIONS: Record<string, string> = {
  // Category - Kategori Yönetimi
  'category.create': 'Kategori Oluşturma',
  'category.delete': 'Kategori Silme',
  'category.update': 'Kategori Güncelleme',
  'category.read': 'Kategori Görüntüleme',
  
  // BranchCategory - Şube Kategori Yönetimi
  'branch.category.create': 'Şube Kategorisi Oluşturma',
  'branch.category.delete': 'Şube Kategorisi Silme',
  'branch.category.update': 'Şube Kategorisi Güncelleme',
  'branch.category.read': 'Şube Kategorisi Görüntüleme',
  
  // Product - Ürün Yönetimi
  'product.create': 'Ürün Oluşturma',
  'product.delete': 'Ürün Silme',
  'product.update': 'Ürün Güncelleme',
  'product.read': 'Ürün Görüntüleme',
  'product.edit': 'Ürün Düzenleme',
  
  // BranchProduct - Şube Ürün Yönetimi
  'branch.product.create': 'Şube Ürünü Oluşturma',
  'branch.product.delete': 'Şube Ürünü Silme',
  'branch.product.update': 'Şube Ürünü Güncelleme',
  'branch.product.read': 'Şube Ürünü Görüntüleme',
  
  // BranchQRCode - QR Kod Yönetimi
  'branch.qrcode.create': 'QR Kodu Oluşturma',
  'branch.qrcode.delete': 'QR Kodu Silme',
  'branch.qrcode.update': 'QR Kodu Güncelleme',
  'branch.qrcode.read': 'QR Kodu Görüntüleme',
  
  // Order - Sipariş Yönetimi
  'order.create': 'Sipariş Oluşturma',
  'order.delete': 'Sipariş Silme',
  'order.update': 'Sipariş Güncelleme',
  'order.read': 'Sipariş Görüntüleme',
  'order.view': 'Sipariş Detay Görüntüleme',
  'order.cancel': 'Sipariş İptal Etme',
  
  // Restaurant - Restoran Yönetimi
  'restaurant.create': 'Restoran Oluşturma',
  'restaurant.delete': 'Restoran Silme',
  'restaurant.update': 'Restoran Güncelleme',
  'restaurant.read': 'Restoran Görüntüleme',
  'restaurant.user.create': 'Restoran Kullanıcısı Oluşturma',
  'restaurant.user.delete': 'Restoran Kullanıcısı Silme',
  'restaurant.user.update': 'Restoran Kullanıcısı Güncelleme',
  'restaurant.user.read': 'Restoran Kullanıcısı Görüntüleme',
  
  // Branch - Şube Yönetimi
  'branch.create': 'Şube Oluşturma',
  'branch.delete': 'Şube Silme',
  'branch.update': 'Şube Güncelleme',
  'branch.read': 'Şube Görüntüleme',
  'branch.user.create': 'Şube Kullanıcısı Oluşturma',
  'branch.user.delete': 'Şube Kullanıcısı Silme',
  'branch.user.update': 'Şube Kullanıcısı Güncelleme',
  'branch.user.read': 'Şube Kullanıcısı Görüntüleme',
  
  // Admin - Yönetici İşlemleri
  'admin.api.control': 'API Kontrolü',
};

// Kategori çevirileri ve gruplandırması
const CATEGORY_TRANSLATIONS: Record<string, string> = {
  Category: 'Kategori Yönetimi',
  BranchCategory: 'Şube Kategori Yönetimi',
  Product: 'Ürün Yönetimi',
  BranchProduct: 'Şube Ürün Yönetimi',
  BranchQRCode: 'QR Kod Yönetimi',
  Order: 'Sipariş Yönetimi',
  Restaurant: 'Restoran Yönetimi',
  Branch: 'Şube Yönetimi',
  Admin: 'Yönetici İşlemleri',
};

// Kategori renkleri
const CATEGORY_COLORS: Record<string, string> = {
  Category: 'bg-purple-100 text-purple-900 dark:bg-purple-900/20 dark:text-purple-300',
  BranchCategory: 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/20 dark:text-indigo-300',
  Product: 'bg-green-100 text-green-900 dark:bg-green-900/20 dark:text-green-300',
  BranchProduct: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-300',
  BranchQRCode: 'bg-cyan-100 text-cyan-900 dark:bg-cyan-900/20 dark:text-cyan-300',
  Order: 'bg-amber-100 text-amber-900 dark:bg-amber-900/20 dark:text-amber-300',
  Restaurant: 'bg-orange-100 text-orange-900 dark:bg-orange-900/20 dark:text-orange-300',
  Branch: 'bg-blue-100 text-blue-900 dark:bg-blue-900/20 dark:text-blue-300',
  Admin: 'bg-red-100 text-red-900 dark:bg-red-900/20 dark:text-red-300',
};

const Profile: React.FC = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
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
  }, []);

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
  const totalPermissions = appRoles.reduce((sum, role) => sum + role.permissions.length, 0);

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
                {appUser.isActive ? 'Aktif Hesap' : 'Pasif Hesap'}
              </span>
              
              {appRoles.map((role, index) => (
                <span key={index} className="px-4 py-2 rounded-full text-sm font-medium bg-white/10 text-white border border-white/20 flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  {role.name}
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
              {t('profile.title')}
            </h2>
            <button className="text-primary-600 hover:text-primary-700 p-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
              <Edit3 className="w-5 h-5" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>Ad</label>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <p className={`font-medium text-gray-900 dark:text-white ${isRTL ? 'text-right' : 'text-left'}`}>{appUser.name}</p>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>Soyad</label>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <p className={`font-medium text-gray-900 dark:text-white ${isRTL ? 'text-right' : 'text-left'}`}>{appUser.surname}</p>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>Kullanıcı Adı</label>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <p className={`font-medium text-gray-900 dark:text-white ${isRTL ? 'text-right' : 'text-left'}`}>{appUser.userName}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>E-posta</label>
                <div className={`p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Mail className="w-5 h-5 text-gray-400" />
                  <p className={`font-medium text-gray-900 dark:text-white ${isRTL ? 'text-right' : 'text-left'}`}>{appUser.email}</p>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>Kayıt Tarihi</label>
                <div className={`p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <p className={`font-medium text-gray-900 dark:text-white ${isRTL ? 'text-right' : 'text-left'}`}>{registerDate}</p>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>Hesap Durumu</label>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                    appUser.isActive 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  } ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {appUser.isActive ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    {appUser.isActive ? 'Aktif' : 'Pasif'}
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
                {t('dashboard.profile.restaurantInfo')}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>Restoran Adı</label>
                  <p className={`font-medium text-gray-900 dark:text-white ${isRTL ? 'text-right' : 'text-left'}`}>{appUser.restaurant.restaurantName}</p>
                </div>

                <div>
                  <label className={`block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>Durum</label>
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                    appUser.restaurant.restaurantStatus 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  } ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {appUser.restaurant.restaurantStatus ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    {appUser.restaurant.restaurantStatus ? 'Aktif' : 'Pasif'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h3 className={`text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <ShieldCheck className="w-5 h-5 text-primary-600" />
              Yetki Özeti
            </h3>
            
            <div className="space-y-4">
              <div className={`flex justify-between items-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-sm font-medium text-primary-800 dark:text-primary-200">Toplam Rol</span>
                <span className="text-2xl font-bold text-primary-600">{appRoles.length}</span>
              </div>
              
              <div className={`flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Toplam İzin</span>
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
            Roller ve İzinler
          </h2>

          <div className="space-y-6">
            {appRoles.map((role, roleIndex) => {
              // Permission'ları kategorilere göre grupla
              const categorizedPermissions = role.permissions.reduce<Record<string, typeof role.permissions>>((acc, perm) => {
                const category = perm.category || 'Other';
                (acc[category] = acc[category] || []).push(perm);
                return acc;
              }, {});

              return (
                <div key={roleIndex} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                  <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{role.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{role.description || role.name}</p>
                    </div>
                    {role.isSystemRole && (
                      <span className="px-3 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 rounded-full text-sm font-medium">
                        Sistem Rolü
                      </span>
                    )}
                  </div>

                  {role.permissions.length > 0 && (
                    <div className="space-y-4">
                      {Object.entries(categorizedPermissions).map(([category, permissions]) => (
                        <div key={category}>
                          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide flex items-center gap-2">
                            <span className={`h-2 w-2 rounded-full ${CATEGORY_COLORS[category]?.includes('bg-') ? '' : 'bg-gray-400'}`}></span>
                            {CATEGORY_TRANSLATIONS[category] || category} ({permissions.length})
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {permissions.map((permission, permIndex) => {
                              const translatedName = PERMISSION_TRANSLATIONS[permission.name] || permission.name;
                              const categoryColor = CATEGORY_COLORS[category] || 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-300';
                              
                              return (
                                <span
                                  key={permIndex}
                                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${categoryColor}`}
                                >
                                  {translatedName}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Profile; 