import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, 
  MoreVertical, 
  Shield, 
  User, 
  Search,
  Filter,
  Grid,
  List,
  Users,
  Crown,
  Star,
  UserCheck,
  UserX,
  Phone,
  Mail,
  Calendar,
  Building,
  MapPin,
  ChevronDown
} from 'lucide-react';
import { useClickOutside } from '../../../hooks';
import { useLanguage } from '../../../contexts/LanguageContext';
import { userService } from '../../../services/userService';
import { logger } from '../../../utils/logger';
import type { UserData, CreateRoleDto, PermissionOption, Role, CreateUserDto } from '../../../types/api';
import { CreateRoleModalProps, CreateUserModalProps } from '../../../types/BranchManagement/type';

type ViewMode = 'grid' | 'list';
type FilterMode = 'all' | 'RestaurantOwner' | 'BranchManager' | 'Staff' | 'active' | 'inactive';
type TabMode = 'users' | 'roles';

// Mock permissions data - Gerçek ortamda API'den gelecek
const mockPermissions: PermissionOption[] = [
  { id: 1, name: 'user.read', description: 'Kullanıcıları Görüntüleme', category: 'User Management' },
  { id: 2, name: 'user.write', description: 'Kullanıcı Ekleme/Düzenleme', category: 'User Management' },
  { id: 3, name: 'user.delete', description: 'Kullanıcı Silme', category: 'User Management' },
  { id: 4, name: 'restaurant.read', description: 'Restoran Bilgilerini Görüntüleme', category: 'Restaurant Management' },
  { id: 5, name: 'restaurant.write', description: 'Restoran Bilgilerini Düzenleme', category: 'Restaurant Management' },
  { id: 6, name: 'branch.read', description: 'Şube Bilgilerini Görüntüleme', category: 'Branch Management' },
  { id: 7, name: 'branch.write', description: 'Şube Bilgilerini Düzenleme', category: 'Branch Management' },
  { id: 8, name: 'order.read', description: 'Siparişleri Görüntüleme', category: 'Order Management' },
  { id: 9, name: 'order.write', description: 'Sipariş İşlemleri', category: 'Order Management' },
  { id: 10, name: 'product.read', description: 'Ürünleri Görüntüleme', category: 'Product Management' },
  { id: 11, name: 'product.write', description: 'Ürün Ekleme/Düzenleme', category: 'Product Management' },
  { id: 12, name: 'analytics.read', description: 'Raporları Görüntüleme', category: 'Analytics' }
];

const UserManagement: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [users, setUsers] = useState<UserData[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeTab, setActiveTab] = useState<TabMode>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isCreatingRole, setIsCreatingRole] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  // Menü dışında tıklamaları yakalamak için referans ve hook kullanımı
  const dropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => {
    setActiveDropdown(null);
  });

  // Kullanıcıları ve rolleri API'den getir
  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  // Kullanıcı filtreleme ve arama - useMemo ile optimize edildi
  const filteredUsers = useMemo(() => {
    // users'ın array olduğundan emin ol
    if (!Array.isArray(users)) {
      return [];
    }
    
    let filtered = users;

    // Kategori filtresi
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(user => {
        if (selectedCategory === 'active' || selectedCategory === 'inactive') {
          return selectedCategory === 'active' ? user.isActive : !user.isActive;
        }
        return user.roles.includes(selectedCategory);
      });
    }

    // Arama filtresi
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.fullName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.phoneNumber.includes(searchTerm) ||
        user.restaurantName.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [users, selectedCategory, searchTerm]);

  // Rol filtreleme ve arama - useMemo ile optimize edildi
  const filteredRoles = useMemo(() => {
    // roles'ın array olduğundan emin ol
    if (!Array.isArray(roles)) {
      return [];
    }
    
    let filtered = roles;

    // Kategori filtresi
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'active' || selectedCategory === 'inactive') {
        filtered = filtered.filter(role => 
          selectedCategory === 'active' ? role.isActive : !role.isActive
        );
      } else {
        filtered = filtered.filter(role => 
          role.category.toLowerCase().includes(selectedCategory.toLowerCase())
        );
      }
    }

    // Arama filtresi
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(role =>
        role.name.toLowerCase().includes(searchLower) ||
        (role.description?.toLowerCase().includes(searchLower)) ||
        role.category.toLowerCase().includes(searchLower) ||
        role.restaurantName.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [roles, selectedCategory, searchTerm]);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await userService.getAllUsers();
      
      if (response.success && response.data) {
        // API'den dönen verinin array olduğundan emin ol
        const usersData = Array.isArray(response.data) ? response.data : [];
        setUsers(usersData);
        logger.info('Kullanıcılar başarıyla yüklendi', usersData, { prefix: 'UserManagement' });
      } else {
        throw new Error(t('userManagementPage.error.loadFailed'));
      }
    } catch (err: any) {
      logger.error('Kullanıcılar yüklenirken hata', err, { prefix: 'UserManagement' });
      setError(err.message || t('userManagementPage.error.loadFailed'));
      // Hata durumunda boş array set et
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  const fetchRoles = useCallback(async () => {
    try {
      const response = await userService.getRoles();
      
      if (response.success && response.data) {
        // API'den dönen verinin array olduğundan emin ol
        const rolesData = Array.isArray(response.data) ? response.data : [];
        setRoles(rolesData);
        logger.info('Roller başarıyla yüklendi', rolesData, { prefix: 'UserManagement' });
      } else {
        throw new Error(t('userManagementPage.error.rolesLoadFailed'));
      }
    } catch (err: any) {
      logger.error('Roller yüklenirken hata', err, { prefix: 'UserManagement' });
      // Rol yüklenememesi users sayfasını etkilemez, sadece log atıyoruz
      // Hata durumunda boş array set et
      setRoles([]);
    }
  }, [t]);

  const handleCreateRole = useCallback(async (roleData: CreateRoleDto) => {
    try {
      setIsCreatingRole(true);
      
      const response = await userService.createRole(roleData);
      
      if (response.success) {
        logger.info('Rol başarıyla oluşturuldu', response.data, { prefix: 'UserManagement' });
        setIsRoleModalOpen(false);
        // Rolleri yeniden yükle
        await fetchRoles();
      } else {
        throw new Error(t('userManagementPage.error.createRoleFailed'));
      }
    } catch (err: any) {
      logger.error('Rol oluşturulurken hata', err, { prefix: 'UserManagement' });
      // Hata mesajı gösterebiliriz
    } finally {
      setIsCreatingRole(false);
    }
  }, [fetchRoles, t]);

  const handleCreateUser = useCallback(async (userData: CreateUserDto) => {
    try {
      setIsCreatingUser(true);
      
      const response = await userService.createUser(userData);
      
      if (response.success) {
        logger.info('Kullanıcı başarıyla oluşturuldu', response.data, { prefix: 'UserManagement' });
        setIsUserModalOpen(false);
        // Kullanıcıları yeniden yükle
        await fetchUsers();
      } else {
        throw new Error(t('userManagementPage.error.createUserFailed'));
      }
    } catch (err: any) {
      logger.error('Kullanıcı oluşturulurken hata', err, { prefix: 'UserManagement' });
      // Hata mesajı gösterebiliriz
    } finally {
      setIsCreatingUser(false);
    }
  }, [fetchUsers, t]);

  // Utility functions with useCallback for performance
  const getStatusColor = useCallback((isActive: boolean) => {
    return isActive
      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
  }, []);

  const getRoleColor = useCallback((role: string) => {
    switch (role) {
      case 'RestaurantOwner':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'BranchManager':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Staff':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  }, []);

  const getRoleIcon = useCallback((role: string) => {
    switch (role) {
      case 'RestaurantOwner':
        return <Crown className="h-3 w-3" />;
      case 'BranchManager':
        return <Star className="h-3 w-3" />;
      case 'Staff':
        return <User className="h-3 w-3" />;
      default:
        return <User className="h-3 w-3" />;
    }
  }, []);

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(isRTL ? 'ar-SA' : 'tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }, [isRTL]);

  // User statistics with memoization for performance
  const userStats = useMemo(() => {
    // users'ın array olduğundan emin ol
    if (!Array.isArray(users)) {
      return { total: 0, active: 0, owners: 0, managers: 0, staff: 0 };
    }
    
    const total = users.length;
    const active = users.filter(u => u.isActive).length;
    const owners = users.filter(u => u.roles.includes('RestaurantOwner')).length;
    const managers = users.filter(u => u.roles.includes('BranchManager')).length;
    const staff = users.filter(u => u.roles.includes('Staff')).length;

    return { total, active, owners, managers, staff };
  }, [users]);

  // Role statistics with memoization for performance
  const roleStats = useMemo(() => {
    // roles'ın array olduğundan emin ol
    if (!Array.isArray(roles)) {
      return { total: 0, active: 0, system: 0, custom: 0, totalUsers: 0 };
    }
    
    const total = roles.length;
    const active = roles.filter(r => r.isActive).length;
    const system = roles.filter(r => r.isSystemRole).length;
    const custom = roles.filter(r => !r.isSystemRole).length;
    const totalUsers = roles.reduce((sum, role) => sum + role.userCount, 0);

    return { total, active, system, custom, totalUsers };
  }, [roles]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 dark:text-gray-400">{t('userManagementPage.loading')}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="bg-red-100 dark:bg-red-900/30 rounded-lg p-6">
            <h3 className="text-red-800 dark:text-red-400 font-semibold mb-2">{t('userManagementPage.error.title')}</h3>
            <p className="text-red-600 dark:text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchUsers}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              {t('userManagementPage.error.retry')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header with Stats */}
      <div className={`flex flex-col lg:flex-row lg:items-center ${isRTL ? 'lg:justify-between' : 'lg:justify-between'} gap-4`}>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('userManagementPage.title')}</h2>
          <div className={`flex items-center ${isRTL ? 'gap-4' : 'gap-4'} mt-2 text-sm text-gray-500 dark:text-gray-400`}>
            <span className={`flex items-center ${isRTL ? 'gap-1' : 'gap-1'}`}>
              <Users className="h-4 w-4" />
              {t('userManagementPage.stats.total')} {activeTab === 'users' ? userStats.total : roleStats.total} {activeTab === 'users' ? t('userManagementPage.stats.users') : t('userManagementPage.stats.roles')}
            </span>
            <span className={`flex items-center ${isRTL ? 'gap-1' : 'gap-1'}`}>
              <UserCheck className="h-4 w-4" />
              {activeTab === 'users' ? userStats.active : roleStats.active} {t('userManagementPage.stats.active')}
            </span>
          </div>
        </div>
        
        {/* Stats Cards */}
        {activeTab === 'users' ? (
          <div className={`flex ${isRTL ? 'gap-3' : 'gap-3'}`}>
            <div className="bg-purple-100 dark:bg-purple-900/30 rounded-lg p-3 min-w-0">
              <div className={`flex items-center ${isRTL ? 'gap-2' : 'gap-2'}`}>
                <Crown className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <div>
                  <p className="text-xs text-purple-600 dark:text-purple-400">{t('userManagementPage.stats.owner')}</p>
                  <p className="font-semibold text-purple-800 dark:text-purple-300">{userStats.owners}</p>
                </div>
              </div>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3 min-w-0">
              <div className={`flex items-center ${isRTL ? 'gap-2' : 'gap-2'}`}>
                <Star className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-xs text-blue-600 dark:text-blue-400">{t('userManagementPage.stats.manager')}</p>
                  <p className="font-semibold text-blue-800 dark:text-blue-300">{userStats.managers}</p>
                </div>
              </div>
            </div>
            <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-lg p-3 min-w-0">
              <div className={`flex items-center ${isRTL ? 'gap-2' : 'gap-2'}`}>
                <User className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400">{t('userManagementPage.stats.staff')}</p>
                  <p className="font-semibold text-indigo-800 dark:text-indigo-300">{userStats.staff}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={`flex ${isRTL ? 'gap-3' : 'gap-3'}`}>
            <div className="bg-emerald-100 dark:bg-emerald-900/30 rounded-lg p-3 min-w-0">
              <div className={`flex items-center ${isRTL ? 'gap-2' : 'gap-2'}`}>
                <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">{t('userManagementPage.stats.system')}</p>
                  <p className="font-semibold text-emerald-800 dark:text-emerald-300">{roleStats.system}</p>
                </div>
              </div>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3 min-w-0">
              <div className={`flex items-center ${isRTL ? 'gap-2' : 'gap-2'}`}>
                <Star className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-xs text-blue-600 dark:text-blue-400">{t('userManagementPage.stats.custom')}</p>
                  <p className="font-semibold text-blue-800 dark:text-blue-300">{roleStats.custom}</p>
                </div>
              </div>
            </div>
            <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-lg p-3 min-w-0">
              <div className={`flex items-center ${isRTL ? 'gap-2' : 'gap-2'}`}>
                <Users className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400">{t('userManagementPage.stats.totalUsers')}</p>
                  <p className="font-semibold text-indigo-800 dark:text-indigo-300">{roleStats.totalUsers}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className={`-mb-px flex ${isRTL ? 'space-x-reverse space-x-8' : 'space-x-8'}`}>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className={`flex items-center ${isRTL ? 'gap-2' : 'gap-2'}`}>
              <Users className="h-4 w-4" />
              {t('userManagementPage.tabs.users')}
              <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs">
                {userStats.total}
              </span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'roles'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className={`flex items-center ${isRTL ? 'gap-2' : 'gap-2'}`}>
              <Shield className="h-4 w-4" />
              {t('userManagementPage.tabs.roles')}
              <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs">
                {roleStats.total}
              </span>
            </div>
          </button>
        </nav>
      </div>

      {/* Controls */}
      <div className={`flex flex-col sm:flex-row gap-4 items-center ${isRTL ? 'justify-between' : 'justify-between'}`}>
        <div className={`flex flex-1 ${isRTL ? 'gap-4' : 'gap-4'} w-full sm:w-auto`}>
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400`} />
            <input
              type="text"
              placeholder={activeTab === 'users' ? t('userManagementPage.controls.search') : t('userManagementPage.controls.searchRoles')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
            title='selectedCategory'
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 ${isRTL ? 'pl-8 pr-4' : 'pr-8'} text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            >
              <option value="all">{t('userManagementPage.controls.filterAll')}</option>
              <option value="RestaurantOwner">{t('userManagementPage.controls.filterOwner')}</option>
              <option value="BranchManager">{t('userManagementPage.controls.filterManager')}</option>
              <option value="Staff">{t('userManagementPage.controls.filterStaff')}</option>
              <option value="active">{t('userManagementPage.controls.filterActive')}</option>
              <option value="inactive">{t('userManagementPage.controls.filterInactive')}</option>
            </select>
            <ChevronDown className={`absolute ${isRTL ? 'left-2' : 'right-2'} top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none`} />
          </div>
        </div>

        <div className={`flex items-center ${isRTL ? 'gap-2' : 'gap-2'}`}>
          {/* Add User Button - only show on users tab */}
          {activeTab === 'users' && (
            <button
              onClick={() => setIsUserModalOpen(true)}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              <UserPlus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('userManagementPage.controls.addUser')}
            </button>
          )}

          {/* Add Role Button - only show on roles tab */}
          {activeTab === 'roles' && (
            <button
              onClick={() => setIsRoleModalOpen(true)}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              <Shield className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('userManagementPage.controls.addRole')}
            </button>
          )}

          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'users' ? (
        <>
          {/* No Results - Users */}
          {filteredUsers.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {t('userManagementPage.noResults.usersNotFound')}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm || selectedCategory !== 'all' 
                  ? t('userManagementPage.noResults.searchEmpty')
                  : t('userManagementPage.noResults.usersEmpty')}
              </p>
            </div>
          )}

          {/* Grid View - Users */}
          {viewMode === 'grid' && filteredUsers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredUsers.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
              >
                {/* User Avatar & Name */}
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                    {user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className={`${isRTL ? 'mr-3' : 'ml-3'} flex-1 min-w-0`}>
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {user.fullName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === user.id ? null : user.id)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>
                    {activeDropdown === user.id && (
                      <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-10`}>
                        <div className="py-1">
                          <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                            {t('userManagementPage.actions.viewDetails')}
                          </button>
                          <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                            {t('userManagementPage.actions.edit')}
                          </button>
                          <button className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600">
                            {user.isActive ? t('userManagementPage.actions.deactivate') : t('userManagementPage.actions.activate')}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* User Info */}
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Phone className={`h-4 w-4 text-gray-400 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    <span className="text-gray-600 dark:text-gray-300">{user.phoneNumber}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Building className={`h-4 w-4 text-gray-400 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    <span className="text-gray-600 dark:text-gray-300 truncate">{user.restaurantName}</span>
                  </div>
                  {user.branchName && (
                    <div className="flex items-center text-sm">
                      <MapPin className={`h-4 w-4 text-gray-400 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      <span className="text-gray-600 dark:text-gray-300 truncate">{user.branchName}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm">
                    <Calendar className={`h-4 w-4 text-gray-400 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    <span className="text-gray-600 dark:text-gray-300">{formatDate(user.createdDate)}</span>
                  </div>
                </div>

                {/* Roles & Status */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {user.roles.map((role, index) => (
                      <span
                        key={index}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(role)}`}
                      >
                        {getRoleIcon(role)}
                        {t(`userManagementPage.roleTypes.${role}`)}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.isActive)}`}>
                      {user.isActive ? <UserCheck className="h-3 w-3" /> : <UserX className="h-3 w-3" />}
                      {user.isActive ? t('userManagementPage.status.active') : t('userManagementPage.status.inactive')}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* List View - Users */}
      {viewMode === 'list' && filteredUsers.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th scope="col" className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider`}>
                    {t('userManagementPage.table.user')}
                  </th>
                  <th scope="col" className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider`}>
                    {t('userManagementPage.table.contact')}
                  </th>
                  <th scope="col" className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider`}>
                    {t('userManagementPage.table.roles')}
                  </th>
                  <th scope="col" className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider`}>
                    {t('userManagementPage.table.location')}
                  </th>
                  <th scope="col" className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider`}>
                    {t('userManagementPage.table.status')}
                  </th>
                  <th scope="col" className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider`}>
                    {t('userManagementPage.table.registrationDate')}
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">{t('userManagementPage.table.actions')}</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <AnimatePresence>
                  {filteredUsers.map((user) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                            {user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.fullName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {user.userName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{user.email}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{user.phoneNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map((role, index) => (
                            <span
                              key={index}
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(role)}`}
                            >
                              {getRoleIcon(role)}
                              {t(`userManagementPage.roleTypes.${role}`)}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{user.restaurantName}</div>
                        {user.branchName && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">{user.branchName}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.isActive)}`}>
                          {user.isActive ? <UserCheck className="h-3 w-3" /> : <UserX className="h-3 w-3" />}
                          {user.isActive ? t('userManagementPage.status.active') : t('userManagementPage.status.inactive')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(user.createdDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="relative" ref={dropdownRef}>
                          <button
                            onClick={() => setActiveDropdown(activeDropdown === user.id ? null : user.id)}
                            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            <MoreVertical className="h-5 w-5" />
                          </button>
                          {activeDropdown === user.id && (
                            <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-10`}>
                              <div className="py-1">
                                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                                  {t('userManagementPage.actions.viewDetails')}
                                </button>
                                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                                  {t('userManagementPage.actions.edit')}
                                </button>
                                <button className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600">
                                  {user.isActive ? t('userManagementPage.actions.deactivate') : t('userManagementPage.actions.activate')}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}
        </>
      ) : (
        /* Roles Tab Content */
        <>
          {/* No Results - Roles */}
          {filteredRoles.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {t('userManagementPage.noResults.rolesNotFound')}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm || selectedCategory !== 'all' 
                  ? t('userManagementPage.noResults.searchEmptyRoles')
                  : t('userManagementPage.noResults.rolesEmpty')}
              </p>
            </div>
          )}

          {/* Roles Grid View */}
          {viewMode === 'grid' && filteredRoles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {filteredRoles.map((role) => (
                  <motion.div
                    key={role.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                  >
                    {/* Role Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                          <Shield className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                            {role.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {role.category}
                          </p>
                        </div>
                      </div>
                      <div className="relative" ref={dropdownRef}>
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === role.id ? null : role.id)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>
                        {activeDropdown === role.id && (
                          <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-10`}>
                            <div className="py-1">
                              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                                {t('userManagementPage.actions.viewDetails')}
                              </button>
                              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                                {t('userManagementPage.actions.edit')}
                              </button>
                              <button className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600">
                                {role.isActive ? t('userManagementPage.actions.deactivate') : t('userManagementPage.actions.activate')}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Role Description */}
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                      {role.description || t('userManagementPage.roleDetails.noDescription')}
                    </p>

                    {/* Role Stats */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">{t('userManagementPage.roleDetails.userCount')}</span>
                        <span className="font-medium text-gray-900 dark:text-white">{role.userCount}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">{t('userManagementPage.roleDetails.permissionCount')}</span>
                        <span className="font-medium text-gray-900 dark:text-white">{role.permissionCount}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">{t('userManagementPage.roleDetails.restaurant')}</span>
                        <span className="font-medium text-gray-900 dark:text-white truncate max-w-32" title={role.restaurantName}>
                          {role.restaurantName}
                        </span>
                      </div>
                      {role.branchName && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500 dark:text-gray-400">{t('userManagementPage.roleDetails.branch')}</span>
                          <span className="font-medium text-gray-900 dark:text-white truncate max-w-32" title={role.branchName}>
                            {role.branchName}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Role Badges */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        role.isActive 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {role.isActive ? <UserCheck className="h-3 w-3" /> : <UserX className="h-3 w-3" />}
                        {role.isActive ? t('userManagementPage.status.active') : t('userManagementPage.status.inactive')}
                      </span>
                      {role.isSystemRole && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                          <Star className="h-3 w-3" />
                          {t('userManagementPage.status.systemRole')}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Roles List View */}
          {viewMode === 'list' && filteredRoles.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th scope="col" className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider`}>
                        {t('userManagementPage.table.role')}
                      </th>
                      <th scope="col" className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider`}>
                        {t('userManagementPage.table.description')}
                      </th>
                      <th scope="col" className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider`}>
                        {t('userManagementPage.table.statistics')}
                      </th>
                      <th scope="col" className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider`}>
                        {t('userManagementPage.table.position')}
                      </th>
                      <th scope="col" className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider`}>
                        {t('userManagementPage.table.status')}
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">{t('userManagementPage.table.actions')}</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    <AnimatePresence>
                      {filteredRoles.map((role) => (
                        <motion.tr
                          key={role.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                                <Shield className="h-5 w-5 text-white" />
                              </div>
                              <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {role.name}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {role.category}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                              {role.description || t('userManagementPage.roleDetails.noDescription')}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {role.userCount} {t('userManagementPage.roleDetails.users')}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {role.permissionCount} {t('userManagementPage.roleDetails.permissions')}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {role.restaurantName}
                            </div>
                            {role.branchName && (
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {role.branchName}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-wrap gap-1">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                role.isActive 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                              }`}>
                                {role.isActive ? <UserCheck className="h-3 w-3" /> : <UserX className="h-3 w-3" />}
                                {role.isActive ? t('userManagementPage.status.active') : t('userManagementPage.status.inactive')}
                              </span>
                              {role.isSystemRole && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                  <Star className="h-3 w-3" />
                                  {t('userManagementPage.status.systemRole')}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="relative" ref={dropdownRef}>
                              <button
                                onClick={() => setActiveDropdown(activeDropdown === role.id ? null : role.id)}
                                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                              >
                                <MoreVertical className="h-5 w-5" />
                              </button>
                              {activeDropdown === role.id && (
                                <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-10`}>
                                  <div className="py-1">
                                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                                      {t('userManagementPage.actions.viewDetails')}
                                    </button>
                                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                                      {t('userManagementPage.actions.edit')}
                                    </button>
                                    <button className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600">
                                      {role.isActive ? t('userManagementPage.actions.deactivate') : t('userManagementPage.actions.activate')}
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

        {/* Create Role Modal */}
        {isRoleModalOpen && (
          <CreateRoleModal
            isOpen={isRoleModalOpen}
            onClose={() => setIsRoleModalOpen(false)}
            onSubmit={handleCreateRole}
            permissions={mockPermissions}
            isLoading={isCreatingRole}
          />
        )}

        {/* Create User Modal */}
        {isUserModalOpen && (
          <CreateUserModal
            isOpen={isUserModalOpen}
            onClose={() => setIsUserModalOpen(false)}
            onSubmit={handleCreateUser}
            roles={roles}
            isLoading={isCreatingUser}
          />
        )}
      </div>
    );
  };



  const CreateRoleModal: React.FC<CreateRoleModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    permissions,
    isLoading
  }) => {
    const { t, isRTL } = useLanguage();
    const [formData, setFormData] = useState<CreateRoleDto>({
      name: '',
      description: '',
      restaurantId: null,
      branchId: null,
      category: '',
      isActive: true,
      permissionIds: []
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

    const validateForm = (): boolean => {
      const newErrors: Record<string, string> = {};

      if (!formData.name || formData.name.length < 3) {
        newErrors.name = t('userManagementPage.createRole.validation.nameRequired');
      } else if (formData.name.length > 50) {
        newErrors.name = t('userManagementPage.createRole.validation.nameMaxLength');
      }

      if (formData.description && formData.description.length > 200) {
        newErrors.description = t('userManagementPage.createRole.validation.descriptionMaxLength');
      }

      if (formData.category && formData.category.length > 50) {
        newErrors.category = t('userManagementPage.createRole.validation.categoryMaxLength');
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!validateForm()) return;

      const submitData: CreateRoleDto = {
        ...formData,
        permissionIds: selectedPermissions.length > 0 ? selectedPermissions : null,
        description: formData.description || null,
        restaurantId: formData.restaurantId || null,
        branchId: formData.branchId || null,
        category: formData.category || null
      };

      onSubmit(submitData);
    };

    const handlePermissionToggle = (permissionId: number) => {
      setSelectedPermissions(prev => 
        prev.includes(permissionId)
          ? prev.filter(id => id !== permissionId)
          : [...prev, permissionId]
      );
    };

    const groupedPermissions = permissions.reduce((acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = [];
      }
      acc[permission.category].push(permission);
      return acc;
    }, {} as Record<string, PermissionOption[]>);

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose}></div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl rounded-xl bg-white dark:bg-gray-800 shadow-2xl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                {t('userManagementPage.createRole.title')}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('userManagementPage.createRole.roleName')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    maxLength={50}
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      errors.name 
                        ? 'border-red-500 dark:border-red-400' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder={t('userManagementPage.createRole.roleNamePlaceholder')}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('userManagementPage.createRole.category')}
                  </label>
                  <input
                    type="text"
                    id="category"
                    maxLength={50}
                    value={formData.category || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className={`w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      errors.category 
                        ? 'border-red-500 dark:border-red-400' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder={t('userManagementPage.createRole.categoryPlaceholder')}
                  />
                  {errors.category && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('userManagementPage.createRole.description')}
                </label>
                <textarea
                  id="description"
                  rows={3}
                  maxLength={200}
                  value={formData.description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className={`w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.description 
                      ? 'border-red-500 dark:border-red-400' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder={t('userManagementPage.createRole.descriptionPlaceholder')}
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.description && <p className="text-sm text-red-600 dark:text-red-400">{errors.description}</p>}
                  <p className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                    {(formData.description || '').length}/200
                  </p>
                </div>
              </div>

              {/* Numeric IDs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="restaurantId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('userManagementPage.createRole.restaurantId')}
                  </label>
                  <input
                    type="number"
                    id="restaurantId"
                    min="0"
                    value={formData.restaurantId || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      restaurantId: e.target.value ? parseInt(e.target.value) : null 
                    }))}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder={t('userManagementPage.createRole.restaurantIdPlaceholder')}
                  />
                </div>

                <div>
                  <label htmlFor="branchId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('userManagementPage.createRole.branchId')}
                  </label>
                  <input
                    type="number"
                    id="branchId"
                    min="0"
                    value={formData.branchId || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      branchId: e.target.value ? parseInt(e.target.value) : null 
                    }))}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder={t('userManagementPage.createRole.branchIdPlaceholder')}
                  />
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="isActive" className={`${isRTL ? 'mr-2' : 'ml-2'} text-sm text-gray-700 dark:text-gray-300`}>
                  {t('userManagementPage.createRole.isActive')}
                </label>
              </div>

              {/* Permissions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {t('userManagementPage.createRole.permissions')} ({selectedPermissions.length} {t('userManagementPage.createRole.permissionsSelected')})
                </label>
                <div className="max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/50">
                  {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                    <div key={category} className="mb-4 last:mb-0">
                      <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2 text-sm">
                        {t(`userManagementPage.permissionCategories.${category}`) || category}
                      </h4>
                      <div className="space-y-2">
                        {categoryPermissions.map((permission) => (
                          <label
                            key={permission.id}
                            className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600/50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedPermissions.includes(permission.id)}
                              onChange={() => handlePermissionToggle(permission.id)}
                              className="mt-0.5 h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm text-gray-900 dark:text-white">
                                {permission.name}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {permission.description}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none disabled:opacity-50"
                >
                  {t('userManagementPage.createRole.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                  {isLoading ? t('userManagementPage.createRole.creating') : t('userManagementPage.createRole.create')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    );
  };

  // Create User Modal Component


  const CreateUserModal: React.FC<CreateUserModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    roles,
    isLoading
  }) => {
    const { t, isRTL } = useLanguage();
    const [formData, setFormData] = useState<CreateUserDto>({
      name: '',
      surName: '',
      userName: '',
      email: '',
      password: '',
      passwordConfirm: '',
      phoneNumber: '',
      restaurantId: null,
      branchId: null,
      profileImage: '',
      userCreatorId: '',
      roleIdsList: [],
      isActive: true
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [locationType, setLocationType] = useState<'restaurant' | 'branch'>('restaurant');

    const validateForm = (): boolean => {
      const newErrors: Record<string, string> = {};

      // Name validation
      if (!formData.name || formData.name.length === 0) {
        newErrors.name = t('userManagementPage.createUser.validation.nameRequired');
      } else if (formData.name.length > 50) {
        newErrors.name = t('userManagementPage.createUser.validation.nameMaxLength');
      }

      // Surname validation
      if (!formData.surName || formData.surName.length === 0) {
        newErrors.surName = t('userManagementPage.createUser.validation.surnameRequired');
      } else if (formData.surName.length > 50) {
        newErrors.surName = t('userManagementPage.createUser.validation.surnameMaxLength');
      }

      // Username validation - auto generate if empty
      if (!formData.userName) {
        const autoUsername = `${formData.name.toLowerCase()}.${formData.surName.toLowerCase()}`.replace(/[^a-z.]/g, '');
        setFormData(prev => ({ ...prev, userName: autoUsername }));
      }

      // Email validation
      if (!formData.email || formData.email.length === 0) {
        newErrors.email = t('userManagementPage.createUser.validation.emailRequired');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = t('userManagementPage.createUser.validation.emailInvalid');
      }

      // Password validation
      if (!formData.password || formData.password.length < 6) {
        newErrors.password = t('userManagementPage.createUser.validation.passwordRequired');
      } else if (formData.password.length > 100) {
        newErrors.password = t('userManagementPage.createUser.validation.passwordMaxLength');
      }

      // Password confirmation validation
      if (!formData.passwordConfirm || formData.passwordConfirm.length === 0) {
        newErrors.passwordConfirm = t('userManagementPage.createUser.validation.passwordConfirmRequired');
      } else if (formData.password !== formData.passwordConfirm) {
        newErrors.passwordConfirm = t('userManagementPage.createUser.validation.passwordMismatch');
      }

      // Phone number validation
      if (!formData.phoneNumber || formData.phoneNumber.length === 0) {
        newErrors.phoneNumber = t('userManagementPage.createUser.validation.phoneRequired');
      }

      // Location validation
      if (locationType === 'restaurant') {
        if (!formData.restaurantId || formData.restaurantId <= 0) {
          newErrors.restaurantId = t('userManagementPage.createUser.validation.restaurantIdRequired');
        }
      } else {
        if (!formData.branchId || formData.branchId <= 0) {
          newErrors.branchId = t('userManagementPage.createUser.validation.branchIdRequired');
        }
      }

      // Role validation
      if (selectedRoles.length === 0) {
        newErrors.roles = t('userManagementPage.createUser.validation.rolesRequired');
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!validateForm()) return;

      // Get current user ID from JWT token if available
      const getCurrentUserId = () => {
        try {
          const token = localStorage.getItem('token') || sessionStorage.getItem('token');
          if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.user_id || payload.sub || '';
          }
          return '';
        } catch (error) {
          return '';
        }
      };

      const submitData: CreateUserDto = {
        ...formData,
        userName: formData.userName || `${formData.name.toLowerCase()}.${formData.surName.toLowerCase()}`.replace(/[^a-z.]/g, ''),
        restaurantId: locationType === 'restaurant' ? formData.restaurantId : null,
        branchId: locationType === 'branch' ? formData.branchId : null,
        profileImage: formData.profileImage || '',
        userCreatorId: formData.userCreatorId || getCurrentUserId(),
        roleIdsList: selectedRoles,
      };

      onSubmit(submitData);
    };

    const handleRoleToggle = (roleId: string) => {
      setSelectedRoles(prev => 
        prev.includes(roleId)
          ? prev.filter(id => id !== roleId)
          : [...prev, roleId]
      );
    };

    // Handle location type change
    const handleLocationTypeChange = (type: 'restaurant' | 'branch') => {
      setLocationType(type);
      // Reset the other field when switching
      if (type === 'restaurant') {
        setFormData(prev => ({ ...prev, branchId: null }));
      } else {
        setFormData(prev => ({ ...prev, restaurantId: null }));
      }
      // Clear related errors
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.restaurantId;
        delete newErrors.branchId;
        return newErrors;
      });
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose}></div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-4xl rounded-xl bg-white dark:bg-gray-800 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4 sticky top-0 bg-white dark:bg-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                {t('userManagementPage.createUser.title')}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Personal Info */}
              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">{t('userManagementPage.createUser.personalInfo')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('userManagementPage.createUser.firstName')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      maxLength={50}
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className={`w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.name 
                          ? 'border-red-500 dark:border-red-400' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder={t('userManagementPage.createUser.firstNamePlaceholder')}
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="surName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('userManagementPage.createUser.lastName')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="surName"
                      required
                      maxLength={50}
                      value={formData.surName}
                      onChange={(e) => setFormData(prev => ({ ...prev, surName: e.target.value }))}
                      className={`w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.surName 
                          ? 'border-red-500 dark:border-red-400' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder={t('userManagementPage.createUser.lastNamePlaceholder')}
                    />
                    {errors.surName && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.surName}</p>}
                  </div>
                </div>

                {/* Username field - auto-generated but editable */}
                <div className="mt-4">
                  <label htmlFor="userName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('userManagementPage.createUser.userName')}
                  </label>
                  <input
                    type="text"
                    id="userName"
                    value={formData.userName}
                    onChange={(e) => setFormData(prev => ({ ...prev, userName: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t('userManagementPage.createUser.userNamePlaceholder')}
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {t('userManagementPage.createUser.userNameHint')}
                  </p>
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">{t('userManagementPage.createUser.contactInfo')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('userManagementPage.createUser.email')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className={`w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.email 
                          ? 'border-red-500 dark:border-red-400' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder={t('userManagementPage.createUser.emailPlaceholder')}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('userManagementPage.createUser.phone')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      required
                      value={formData.phoneNumber ?? ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      className={`w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.phoneNumber 
                          ? 'border-red-500 dark:border-red-400' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder={t('userManagementPage.createUser.phonePlaceholder')}
                    />
                    {errors.phoneNumber && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phoneNumber}</p>}
                  </div>
                </div>
              </div>

              {/* Password Info */}
              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">{t('userManagementPage.createUser.passwordInfo')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('userManagementPage.createUser.password')} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        required
                        maxLength={100}
                        minLength={6}
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        className={`w-full rounded-lg border px-4 py-2 ${isRTL ? 'pl-10' : 'pr-10'} text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.password 
                            ? 'border-red-500 dark:border-red-400' 
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder={t('userManagementPage.createUser.passwordPlaceholder')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute inset-y-0 ${isRTL ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300`}
                      >
                        {showPassword ? '👁️' : '🔒'}
                      </button>
                    </div>
                    {errors.password && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>}
                  </div>

                  <div>
                    <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('userManagementPage.createUser.passwordConfirm')} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswordConfirm ? "text" : "password"}
                        id="passwordConfirm"
                        required
                        maxLength={100}
                        minLength={6}
                        value={formData.passwordConfirm}
                        onChange={(e) => setFormData(prev => ({ ...prev, passwordConfirm: e.target.value }))}
                        className={`w-full rounded-lg border px-4 py-2 ${isRTL ? 'pl-10' : 'pr-10'} text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.passwordConfirm 
                            ? 'border-red-500 dark:border-red-400' 
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder={t('userManagementPage.createUser.passwordConfirmPlaceholder')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                        className={`absolute inset-y-0 ${isRTL ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300`}
                      >
                        {showPasswordConfirm ? '👁️' : '🔒'}
                      </button>
                    </div>
                    {errors.passwordConfirm && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.passwordConfirm}</p>}
                  </div>
                </div>
              </div>

              {/* Location Selection */}
              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">{t('userManagementPage.createUser.locationInfo')}</h4>
                
                {/* Location Type Selector */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('userManagementPage.createUser.locationType')} <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="locationType"
                        value="restaurant"
                        checked={locationType === 'restaurant'}
                        onChange={(e) => handleLocationTypeChange('restaurant')}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className={`${isRTL ? 'mr-2' : 'ml-2'} text-sm text-gray-700 dark:text-gray-300`}>{t('userManagementPage.createUser.restaurant')}</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="locationType"
                        value="branch"
                        checked={locationType === 'branch'}
                        onChange={(e) => handleLocationTypeChange('branch')}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className={`${isRTL ? 'mr-2' : 'ml-2'} text-sm text-gray-700 dark:text-gray-300`}>{t('userManagementPage.createUser.branch')}</span>
                    </label>
                  </div>
                </div>

                {/* Conditional Input Based on Location Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {locationType === 'restaurant' ? (
                    <div>
                      <label htmlFor="restaurantId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('userManagementPage.createUser.restaurantId')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        id="restaurantId"
                        min="1"
                        required
                        value={formData.restaurantId || ''}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          restaurantId: e.target.value ? parseInt(e.target.value) : null 
                        }))}
                        className={`w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.restaurantId 
                            ? 'border-red-500 dark:border-red-400' 
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder={t('userManagementPage.createUser.restaurantIdPlaceholder')}
                      />
                      {errors.restaurantId && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.restaurantId}</p>}
                    </div>
                  ) : (
                    <div>
                      <label htmlFor="branchId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('userManagementPage.createUser.branchId')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        id="branchId"
                        min="1"
                        required
                        value={formData.branchId || ''}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          branchId: e.target.value ? parseInt(e.target.value) : null 
                        }))}
                        className={`w-full rounded-lg border px-4 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.branchId 
                            ? 'border-red-500 dark:border-red-400' 
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder={t('userManagementPage.createUser.branchIdPlaceholder')}
                      />
                      {errors.branchId && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.branchId}</p>}
                    </div>
                  )}

                  <div>
                    <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('userManagementPage.createUser.profileImage')}
                    </label>
                    <input
                      type="url"
                      id="profileImage"
                      value={formData.profileImage ?? ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, profileImage: e.target.value }))}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={t('userManagementPage.createUser.profileImagePlaceholder')}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="userCreatorId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('userManagementPage.createUser.userCreatorId')}
                  </label>
                  <input
                    type="text"
                    id="userCreatorId"
                    value={formData.userCreatorId}
                    onChange={(e) => setFormData(prev => ({ ...prev, userCreatorId: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t('userManagementPage.createUser.userCreatorIdPlaceholder')}
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">{t('userManagementPage.createUser.roleAssignment')}</h4>
                
                <div className="mb-4">
                  <p className="text-xs text-amber-600 dark:text-amber-400 mb-3">
                    {t('userManagementPage.createUser.apiWarning')}
                  </p>
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    {t('userManagementPage.createUser.rolesLabel')} ({selectedRoles.length} {t('userManagementPage.createUser.rolesSelected')}) <span className="text-red-500">*</span>
                  </label>
                  <div className="max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/50">
                    {roles.length === 0 ? (
                      <div className="text-center py-6">
                        <Shield className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{t('userManagementPage.createUser.noRoles.title')}</p>
                        <p className="text-gray-400 dark:text-gray-500 text-xs">
                          {t('userManagementPage.createUser.noRoles.description')}
                        </p>
                        <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <p className="text-xs text-blue-600 dark:text-blue-400">
                            {t('userManagementPage.createUser.noRoles.tip')}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {roles.filter(role => role.isActive).map((role) => (
                          <label
                            key={role.id}
                            className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600/50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedRoles.includes(role.id)}
                              onChange={() => handleRoleToggle(role.id)}
                              className="mt-0.5 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm text-gray-900 dark:text-white">
                                {role.name}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {role.description} • {role.userCount} {t('userManagementPage.roleDetails.users')} • {role.permissionCount} {t('userManagementPage.roleDetails.permissions')}
                              </div>
                              <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                {role.restaurantName}{role.branchName ? ` - ${role.branchName}` : ''}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.roles && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.roles}</p>}
                  
                  {/* Quick Role Creation Suggestion */}
                  {roles.length === 0 && (
                    <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                      <div className="flex items-start gap-2">
                        <div className="text-yellow-600 dark:text-yellow-400">⚠️</div>
                        <div>
                          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                            {t('userManagementPage.createUser.noRoles.warning')}
                          </p>
                          <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                            {t('userManagementPage.createUser.noRoles.warningDescription')}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className={`${isRTL ? 'mr-2' : 'ml-2'} text-sm text-gray-700 dark:text-gray-300`}>
                  {t('userManagementPage.createUser.isActive')}
                </label>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none disabled:opacity-50"
                >
                  {t('userManagementPage.createUser.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isLoading || roles.length === 0}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                  {isLoading ? t('userManagementPage.createUser.creating') : 
                   roles.length === 0 ? t('userManagementPage.createUser.createRoleFirst') : t('userManagementPage.createUser.create')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    );
  };
  
  export default UserManagement;