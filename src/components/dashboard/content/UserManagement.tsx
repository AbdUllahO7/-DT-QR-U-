import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserPlus,
  MoreVertical,
  Shield,
  User,
  Search,
  Grid,
  List,
  Users,
  Crown,
  Star,
  UserCheck,
  UserX,
  Phone,
  Calendar,
  Building,
  MapPin,
  ChevronDown,
  Edit,
  Trash2,
  Key,
} from 'lucide-react';
import { useClickOutside } from '../../../hooks';
import { useLanguage } from '../../../contexts/LanguageContext';
import { userService } from '../../../services/userService';
import { roleService } from '../../../services/RoleService';
import { logger } from '../../../utils/logger';
import type {
  BranchInfo,
} from '../../../types/api';
import EditUserModal from './UserManagement/EditUserModal';
import UpdateUserRolesModal from './UserManagement/UpdateUserRolesModal';
import ConfirmationModal from './UserManagement/ConfirmationModal';
import CreateUserModal from './UserManagement/CreateUserModal';
import CreateRoleModal from './UserManagement/CreateRoleModal';
import EditRoleModal from './UserManagement/EditRoleModal';
import { branchService } from '../../../services/branchService';
import ViewPermissionsModal from './UserManagement/ViewPermissionsModal';
import ViewRolePermissionsModal from './UserManagement/ViewRolePermissionsModal';
import {  AssignBranchDto, CreateUserDto, PermissionCatalog, Role, UpdateRoleDto, UpdateUserDto, UpdateUserRolesDto, UserData } from '../../../types/users/users.type';
import ChangePasswordModal from './UserManagement/ChangePasswordModal';
import AssignBranchModal from './UserManagement/AssignBranchModal';
import { ChangePasswordDto } from '../../../types/users/users.type';
type ViewMode = 'grid' ;

type TabMode = 'users' | 'roles';
type ActionType = 'delete' | 'lock' | 'unlock' | 'generic';

const UserManagement: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [users, setUsers] = useState<UserData[]>([]);
  const [roles, setRoles] = useState<Role[]>([]); // Master list of GLOBAL roles
  const [branches, setBranches] = useState<BranchInfo[]>([]);
  const [permissionCatalog, setPermissionCatalog] = useState<PermissionCatalog[]>([]);


  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeTab, setActiveTab] = useState<TabMode>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Create Role Modal States
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  // Create User Modal States
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [rolesForModal, setRolesForModal] = useState<Role[]>([]);
  const [isFetchingModalRoles, setIsFetchingModalRoles] = useState(false);

  // Edit User Modal States
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<UserData | null>(null);
  const [isEditingUser, setIsEditingUser] = useState(false);

  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [selectedUserForPassword, setSelectedUserForPassword] = useState<UserData | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Assign Branch Modal States
  const [isAssignBranchModalOpen, setIsAssignBranchModalOpen] = useState(false);
  const [selectedUserForBranch, setSelectedUserForBranch] = useState<UserData | null>(null);
  const [isAssigningBranch, setIsAssigningBranch] = useState(false);


  // Update Roles Modal States
  const [isUpdateRolesModalOpen, setIsUpdateRolesModalOpen] = useState(false);
  const [selectedUserForRoles, setSelectedUserForRoles] = useState<UserData | null>(null);
  const [isUpdatingRoles, setIsUpdatingRoles] = useState(false);


  // Confirmation Modal States
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [confirmationConfig, setConfirmationConfig] = useState<{
    title: string;
    message: string;
    confirmText: string;
    actionType: ActionType;
    onConfirm: () => void;
  } | null>(null);
  const [isConfirmationLoading, setIsConfirmationLoading] = useState(false);

  // View User Permissions Modal State
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [selectedUserForPermissions, setSelectedUserForPermissions] = useState<UserData | null>(null);

  // View Role Permissions Modal State
  const [isRolePermissionsModalOpen, setIsRolePermissionsModalOpen] = useState(false);
  const [selectedRoleForPermissions, setSelectedRoleForPermissions] = useState<Role | null>(null);

  // Edit Role Modal States
  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
  const [selectedRoleForEdit, setSelectedRoleForEdit] = useState<Role | null>(null);
  const [isEditingRole, setIsEditingRole] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => {
    setActiveDropdown(null);
  });
const containerRef = useRef<HTMLDivElement>(null);
useClickOutside(containerRef, () => setActiveDropdown(null));
  // Fetch Users
  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await userService.getAllUsers({
        Includes: 'roles,permissions',
      });

      if (response.success && response.data) {
        const usersData = Array.isArray(response.data) ? response.data : [];
        setUsers(usersData);
        logger.info('Kullanıcılar başarıyla yüklendi', usersData, {
          prefix: 'UserManagement',
        });
      } else {
        throw new Error(t('userManagementPage.error.loadFailed'));
      }
    } catch (err: any) {
      logger.error('Kullanıcılar yüklenirken hata', err, {
        prefix: 'UserManagement',
      });
      setError(err.message || t('userManagementPage.error.loadFailed'));
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  // Change Password Handlers
  const handleOpenChangePassword = useCallback((user: UserData) => {
    setSelectedUserForPassword(user);
    setIsChangePasswordModalOpen(true);
    setActiveDropdown(null);
  }, []);

  const handleChangePassword = useCallback(
    async (id: string, passwordData: ChangePasswordDto) => {
      try {
        setIsChangingPassword(true);
        const response = await userService.changeUserPassword(id, passwordData);
        if (response.success) {
          logger.info('Kullanıcı şifresi başarıyla değiştirildi', response.data, {
            prefix: 'UserManagement',
          });
          setIsChangePasswordModalOpen(false);
          setSelectedUserForPassword(null);
          // Optionally show a success toast/notification here
        } else {
          throw new Error(t('userManagementPage.error.changePasswordFailed'));
        }
      } catch (err: any) {
        logger.error('Kullanıcı şifresi değiştirilirken hata', err, {
          prefix: 'UserManagement',
        });
        // Error is logged, you can show an error toast here
        throw err;
      } finally {
        setIsChangingPassword(false);
      }
    },
    [t]
  );

  // Assign Branch Handlers
  const handleOpenAssignBranch = useCallback((user: UserData) => {
    setSelectedUserForBranch(user);
    setIsAssignBranchModalOpen(true);
    setActiveDropdown(null);
  }, []);

  const handleAssignBranch = useCallback(
    async (id: string, branchData: AssignBranchDto) => {
      try {
        setIsAssigningBranch(true);
        const response = await userService.assignBranchToUser(id, branchData);
        if (response.success) {
          logger.info('Kullanıcı şubesi başarıyla değiştirildi', response.data, {
            prefix: 'UserManagement',
          });
          setIsAssignBranchModalOpen(false);
          setSelectedUserForBranch(null);
          await fetchUsers(); // Refresh the users list
        } else {
          throw new Error(t('userManagementPage.error.assignBranchFailed'));
        }
      } catch (err: any) {
        logger.error('Kullanıcı şubesi değiştirilirken hata', err, {
          prefix: 'UserManagement',
        });
        throw err;
      } finally {
        setIsAssigningBranch(false);
      }
    },
    [fetchUsers, t]
  );

  // Fetch Roles
// Fetch Roles
const fetchRoles = useCallback(async () => {
  try {
    // Explicitly include permissions
    const response = await roleService.getRoles({
    });
    if (response.success && response.data) {
      const rolesData = Array.isArray(response.data) ? response.data : [];
      setRoles(rolesData);
      setRolesForModal(rolesData);
      logger.info('Roller başarıyla yüklendi', rolesData, {
        prefix: 'UserManagement',
      });
    } else {
      throw new Error(t('userManagementPage.error.rolesLoadFailed'));
    }
  } catch (err: any) {
    logger.error('Roller yüklenirken hata', err, { prefix: 'UserManagement' });
    setRoles([]);
  }
}, [t]);

  // Fetch Branches
  const fetchBranches = useCallback(async () => {
    try {
      const branchesData = await branchService.getBranches();
      setBranches(branchesData);
      logger.info('Şubeler başarıyla yüklendi', branchesData, {
        prefix: 'UserManagement',
      });
    } catch (err: any) {
      logger.error('Şubeler yüklenirken hata', err, { prefix: 'UserManagement' });
      setBranches([]);
    }
  }, []);

  // Fetch Permission Catalog
  const fetchPermissionCatalog = useCallback(async () => {
    try {
      const response = await roleService.getPermissionCatalog();
      if (response.success && response.data) {
        setPermissionCatalog(response.data);
      } else {
        logger.warn('Failed to fetch permission catalog', response, { prefix: 'UserManagement' });
      }
    } catch (error) {
      logger.error('Error fetching permission catalog', error, { prefix: 'UserManagement' });
    }
  }, []);

  // Fetch data on mount
  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchBranches();
    fetchPermissionCatalog();
  }, [fetchUsers, fetchRoles, fetchBranches, fetchPermissionCatalog]);

  // Filter users
  const filteredUsers = useMemo(() => {
    if (!Array.isArray(users)) {
      return [];
    }
    let filtered = users;
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((user) => {
        if (selectedCategory === 'active' || selectedCategory === 'inactive') {
          return selectedCategory === 'active' ? user.isActive : !user.isActive;
        }
        return user.roles.includes(selectedCategory);
      });
    }
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.fullName.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          (user.phoneNumber && user.phoneNumber.includes(searchTerm)) ||
          (user.restaurantName &&
            user.restaurantName.toLowerCase().includes(searchLower))
      );
    }
    return filtered;
  }, [users, selectedCategory, searchTerm]);

  // Filter roles
  const filteredRoles = useMemo(() => {
    if (!Array.isArray(roles)) {
      return [];
    }
    let filtered = roles;
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'active' || selectedCategory === 'inactive') {
        filtered = filtered.filter(
          (role) =>
            selectedCategory === 'active' ? role.isActive : !role.isActive
        );
      } else {
        filtered = filtered.filter((role) =>
          role.category?.toLowerCase().includes(selectedCategory.toLowerCase())
        );
      }
    }
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (role) =>
          role.name.toLowerCase().includes(searchLower) ||
          (role.description &&
            role.description.toLowerCase().includes(searchLower)) ||
          (role.category &&
            role.category.toLowerCase().includes(searchLower))
      );
    }
    return filtered;
  }, [roles, selectedCategory, searchTerm]);



// Create Role Handler - Creates role then opens edit modal for permissions
// Create Role Handler - Creates role with permissions in one call
const handleRoleCreated = useCallback(async () => {
  // Just refresh the roles list
  await fetchRoles();
}, [fetchRoles]);


  // Edit Role Handlers
// Edit Role Handlers
const handleOpenEditRole = useCallback(async (role: Role) => {
  setActiveDropdown(null);
  
  // Fetch the complete role data with permissions
  try {
    const response = await roleService.getRoleById( {
    },role.appRoleId,);
    
    if (response.success && response.data) {
      setSelectedRoleForEdit(response.data);
      setIsEditRoleModalOpen(true);
    } else {
      logger.error('Failed to fetch role details', response, {
        prefix: 'UserManagement',
      });
      // Fallback to the role we have (might not have permissions)
      setSelectedRoleForEdit(role);
      setIsEditRoleModalOpen(true);
    }
  } catch (error) {
    logger.error('Error fetching role details', error, {
      prefix: 'UserManagement',
    });
    // Fallback to the role we have
    setSelectedRoleForEdit(role);
    setIsEditRoleModalOpen(true);
  }
}, []);

  const handleEditRole = useCallback(
    async (roleId: string, roleData: UpdateRoleDto, permissionIds: number[]) => {
      try {
        setIsEditingRole(true);
        
        // Update basic role information
        const updateResponse = await roleService.updateRole(roleId, roleData);
        if (!updateResponse.success) {
          throw new Error(t('userManagementPage.error.updateRoleFailed'));
        }
        
        logger.info('Rol başarıyla güncellendi', updateResponse.data, {
          prefix: 'UserManagement',
        });

        // Update role permissions
        const permissionsResponse = await roleService.updateRolePermissions(
          roleId,
          { permissionIds: permissionIds }
        );
        
        if (!permissionsResponse.success) {
          logger.warn(
            'Rol izinleri güncellenirken uyarı',
            permissionsResponse,
            { prefix: 'UserManagement' }
          );
        } else {
          logger.info(
            'Rol izinleri başarıyla güncellendi',
            permissionsResponse.data,
            { prefix: 'UserManagement' }
          );
        }

        setIsEditRoleModalOpen(false);
        setSelectedRoleForEdit(null);
        await fetchRoles(); // Refetch all roles
      } catch (err: any) {
        logger.error('Rol güncellenirken hata', err, {
          prefix: 'UserManagement',
        });
        throw err;
      } finally {
        setIsEditingRole(false);
      }
    },
    [fetchRoles, t]
  );

  // Create User Handler
  const handleCreateUser = useCallback(
    async (userData: CreateUserDto) => {
      try {
        setIsCreatingUser(true);
        const response = await userService.createUser(userData);
        if (response.success) {
          logger.info('Kullanıcı başarıyla oluşturuldu', response.data, {
            prefix: 'UserManagement',
          });
          setIsUserModalOpen(false);
          await fetchUsers();
        } else {
          throw new Error(t('userManagementPage.error.createUserFailed'));
        }
      } catch (err: any) {
        logger.error('Kullanıcı oluşturulurken hata', err, {
          prefix: 'UserManagement',
        });
      } finally {
        setIsCreatingUser(false);
      }
    },
    [fetchUsers, t]
  );

  // Edit User Handlers
  const handleOpenEditUser = useCallback((user: UserData) => {
    setSelectedUserForEdit(user);
    setIsEditUserModalOpen(true);
    setActiveDropdown(null);
  }, []);

  const handleEditUser = useCallback(
    async (id: string, userData: UpdateUserDto) => {
      try {
        setIsEditingUser(true);
        const response = await userService.updateUser(id, userData);
        if (response.success) {
          logger.info('Kullanıcı başarıyla güncellendi', response.data, {
            prefix: 'UserManagement',
          });
          setIsEditUserModalOpen(false);
          setSelectedUserForEdit(null);
          await fetchUsers();
        } else {
          throw new Error(t('userManagementPage.error.updateUserFailed'));
        }
      } catch (err: any) {
        logger.error('Kullanıcı güncellenirken hata', err, {
          prefix: 'UserManagement',
        });
      } finally {
        setIsEditingUser(false);
      }
    },
    [fetchUsers, t]
  );

  // Update Roles Handlers
  const handleOpenUpdateRoles = useCallback((user: UserData) => {
    setSelectedUserForRoles(user);
    setIsUpdateRolesModalOpen(true);
    setActiveDropdown(null);
  }, []);

  const handleUpdateRoles = useCallback(
    async (id: string, rolesData: UpdateUserRolesDto) => {
      try {
        setIsUpdatingRoles(true);
        const response = await userService.updateUserRoles(id, rolesData);
        if (response.success) {
          logger.info('Kullanıcı rolleri başarıyla güncellendi', response.data, {
            prefix: 'UserManagement',
          });
          setIsUpdateRolesModalOpen(false);
          setSelectedUserForRoles(null);
          await fetchUsers();
        } else {
          throw new Error(t('userManagementPage.error.updateRolesFailed'));
        }
      } catch (err: any) {
        logger.error('Kullanıcı rolleri güncellenirken hata', err, {
          prefix: 'UserManagement',
        });
      } finally {
        setIsUpdatingRoles(false);
      }
    },
    [fetchUsers, t]
  );




  // View User Permissions Handlers
  const handleOpenPermissions = useCallback((user: UserData) => {
    setSelectedUserForPermissions(user);
    setIsPermissionsModalOpen(true);
    setActiveDropdown(null);
  }, []);

  const handleClosePermissions = () => {
    setIsPermissionsModalOpen(false);
    setSelectedUserForPermissions(null);
  };

  // View Role Permissions Handlers
  const handleOpenRolePermissions = useCallback((role: Role) => {
    setSelectedRoleForPermissions(role);
    setIsRolePermissionsModalOpen(true);
    setActiveDropdown(null);
  }, []);

  const handleCloseRolePermissions = () => {
    setIsRolePermissionsModalOpen(false);
    setSelectedRoleForPermissions(null);
  };

  // Create User Modal Branch Change Handler
  const handleModalBranchChange = useCallback(
    async (branchId: number | null | undefined) => {
      if (branchId === null) {
        setRolesForModal(roles);
        return;
      }
      if (branchId === undefined) {
        setRolesForModal([]);
        return;
      }
      setIsFetchingModalRoles(true);
      try {
        const response = await roleService.getRoles({ branchId: branchId });
        setRolesForModal(response.data || []);
      } catch (err) {
        logger.error('Modal rolleri yüklenirken hata', err, {
          prefix: 'UserManagement',
        });
        setRolesForModal([]);
      } finally {
        setIsFetchingModalRoles(false);
      }
    },
    [roles]
  );

  // Toggle User Active Status
// Toggle User Active Status (REFACTORED)
  const handleToggleUserStatus = useCallback(
    (user: UserData) => {
      setActiveDropdown(null);
      const newIsActive = !user.isActive; // The new status we want to set
      
      setConfirmationConfig({
        title: newIsActive
          ? t('userManagementPage.confirmation.activateTitle')
          : t('userManagementPage.confirmation.deactivateTitle'),
        message: newIsActive
          ? t('userManagementPage.confirmation.activateMessage', { name: user.fullName })
          : t('userManagementPage.confirmation.deactivateMessage', { name: user.fullName }),
        confirmText: newIsActive
          ? t('userManagementPage.actions.activate')
          : t('userManagementPage.actions.deactivate'),
        actionType: newIsActive ? 'unlock' : 'lock',
        onConfirm: async () => {
          try {
            setIsConfirmationLoading(true);

            // 1. We must construct the full UpdateUserDto, as the 'updateUser' 
            // endpoint likely expects the whole object.
            // We'll mimic the logic from your EditUserModal's useEffect.
            const [name, ...surnameParts] = user.fullName.split(' ');
            const surname = surnameParts.join(' ');

            const updateData: UpdateUserDto = {
              appUserId: user.id,
              name: name || '',
              surname: surname || '',
              userName: user.userName,
              email: user.email,
              restaurantId: user.restaurantId,
              branchId: user.branchId,
              profileImage: user.profileImage || null,
              isActive: newIsActive, // <-- Here is the only change
            };

            // 2. Call 'updateUser' instead of 'lockUser' or 'unlockUser'
            const response = await userService.updateUser(user.id, updateData);

            if (response.success) {
              logger.info(
                `Kullanıcı durumu güncellendi: ${newIsActive}`,
                response.data,
                { prefix: 'UserManagement' }
              );
              setIsConfirmationModalOpen(false);
              setConfirmationConfig(null);
              await fetchUsers(); // This will now fetch the updated data
            } else {
              throw new Error(t('userManagementPage.error.toggleStatusFailed'));
            }
          } catch (err: any) {
            logger.error('Kullanıcı durumu değiştirilirken hata', err, {
              prefix: 'UserManagement',
            });
          } finally {
            setIsConfirmationLoading(false);
          }
        },
      });
      setIsConfirmationModalOpen(true);
    },
    [fetchUsers, t]
  );

  // Delete User
  const handleDeleteUser = useCallback(
    (user: UserData) => {
      setActiveDropdown(null);
      setConfirmationConfig({
        title: t('userManagementPage.confirmation.deleteTitle'),
        message: t('userManagementPage.confirmation.deleteMessage', { name: user.fullName }),
        confirmText: t('userManagementPage.actions.delete'),
        actionType: 'delete',
        onConfirm: async () => {
          try {
            setIsConfirmationLoading(true);
            const response = await userService.deleteUser(user.id);
            if (response.success) {
              logger.info('Kullanıcı silindi', response.data, {
                prefix: 'UserManagement',
              });
              setIsConfirmationModalOpen(false);
              setConfirmationConfig(null);
              await fetchUsers();
            } else {
              throw new Error(t('userManagementPage.error.deleteFailed'));
            }
          } catch (err: any) {
            logger.error('Kullanıcı silinirken hata', err, {
              prefix: 'UserManagement',
            });
          } finally {
            setIsConfirmationLoading(false);
          }
        },
      });
      setIsConfirmationModalOpen(true);
    },
    [fetchUsers, t]
  );

  // Delete Role Handler
  const handleDeleteRole = useCallback(
    (role: Role) => {
      setActiveDropdown(null);
      setConfirmationConfig({
        title: t('userManagementPage.confirmation.deleteRoleTitle'),
        message: t('userManagementPage.confirmation.deleteRoleMessage', { name: role.name }),
        confirmText: t('userManagementPage.actions.delete'),
        actionType: 'delete',
        onConfirm: async () => {
          try {
            setIsConfirmationLoading(true);
            const response = await roleService.deleteRole(role.appRoleId);
            if (response.success) {
              logger.info('Rol silindi', response.data, {
                prefix: 'UserManagement',
              });
              setIsConfirmationModalOpen(false);
              setConfirmationConfig(null);
              await fetchRoles();
            } else {
              throw new Error(t('userManagementPage.error.deleteRoleFailed'));
            }
          } catch (err: any) {
            logger.error('Rol silinirken hata', err, {
              prefix: 'UserManagement',
            });
          } finally {
            setIsConfirmationLoading(false);
          }
        },
      });
      setIsConfirmationModalOpen(true);
    },
    [fetchRoles, t]
  );

  // Utility functions
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
      case 'BranchStaff':
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
      case 'BranchStaff':
        return <User className="h-3 w-3" />;
      default:
        return <Shield className="h-3 w-3" />;
    }
  }, []);

  const formatDate = useCallback(
    (dateString: string) => {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat(isRTL ? 'ar-SA' : 'tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(date);
    },
    [isRTL]
  );

  // User statistics
  const userStats = useMemo(() => {
    if (!Array.isArray(users)) {
      return { total: 0, active: 0, owners: 0, managers: 0, staff: 0 };
    }
    const total = users.length;
    const active = users.filter((u) => u.isActive).length;
    const owners = users.filter((u) =>
      u.roles.includes('RestaurantOwner')
    ).length;
    const managers = users.filter((u) =>
      u.roles.includes('BranchManager')
    ).length;
    const staff = users.filter((u) => u.roles.includes('Staff')).length;
    return { total, active, owners, managers, staff };
  }, [users]);

  // Role statistics
  const roleStats = useMemo(() => {
    if (!Array.isArray(roles)) {
      return { total: 0, active: 0, system: 0, custom: 0, totalUsers: 0 };
    }
    const total = roles.length;
    const active = roles.filter((r) => r.isActive).length;
    const system = roles.filter((r) => r.isSystemRole).length;
    const custom = roles.filter((r) => !r.isSystemRole).length;
    return { total, active, system, custom };
  }, [roles]);

  // Render User Actions Dropdown
  const renderUserActionsDropdown = (user: UserData) => (
      <div
        className={`absolute ${
          isRTL ? 'left-0' : 'right-0'
        } mt-2 w-52 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-50`}  // Added z-50
      >
      <div className="py-1">
        <button
          onClick={() => handleOpenEditUser(user)}
          className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          <Edit className="h-4 w-4" />
          {t('userManagementPage.actions.edit')}
        </button>
        <button
          onClick={() => handleOpenUpdateRoles(user)}
          className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          <Shield className="h-4 w-4" />
          {t('userManagementPage.actions.updateRoles')}
        </button>
        <button
          onClick={() => handleOpenPermissions(user)}
          className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          <Key className="h-4 w-4" />
          {t('userManagementPage.actions.viewPermissions')}
        </button>
        <button
          onClick={() => handleOpenChangePassword(user)}
          className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          <Key className="h-4 w-4" />
          {t('userManagementPage.actions.changePassword')}
        </button>
        <button
          onClick={() => handleOpenAssignBranch(user)}
          className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          <MapPin className="h-4 w-4" />
          {t('userManagementPage.actions.assignBranch')}
        </button>
     
        <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
        <button
          onClick={() => handleToggleUserStatus(user)}
          className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-yellow-600 dark:text-yellow-400 hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          {user.isActive ? (
            <UserX className="h-4 w-4" />
          ) : (
            <UserCheck className="h-4 w-4" />
          )}
          {user.isActive
            ? t('userManagementPage.actions.deactivate')
            : t('userManagementPage.actions.activate')}
        </button>
        <button
          onClick={() => handleDeleteUser(user)}
          className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          <Trash2 className="h-4 w-4" />
          {t('userManagementPage.actions.delete')}
        </button>
      </div>
    </div>
  );

  // Render Role Actions Dropdown
  const renderRoleActionsDropdown = (role: Role) => (
    <div
      className={`absolute ${
        isRTL ? 'left-0' : 'right-0'
      } mt-2 w-52 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-10`}
    >
      <div className="py-1">
        {/* View Permissions Button for Roles */}
        <button
          onClick={() => handleOpenRolePermissions(role)}
          className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          <Key className="h-4 w-4" />
          {t('userManagementPage.actions.viewPermissions')}
        </button>

        {!role.isSystemRole && (
          <>
            <button
              onClick={() => handleOpenEditRole(role)}
              className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <Edit className="h-4 w-4" />
              {t('userManagementPage.actions.edit')}
            </button>

            <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
            <button
              onClick={() => handleDeleteRole(role)}
              className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <Trash2 className="h-4 w-4" />
              {t('userManagementPage.actions.delete')}
            </button>
          </>
        )}
        {role.isSystemRole && (
          <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
            {t('userManagementPage.systemRoleInfo')}
          </div>
        )}
      </div>
    </div>
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 dark:text-gray-400">
            {t('userManagementPage.loading')}
          </p>
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
            <h3 className="text-red-800 dark:text-red-400 font-semibold mb-2">
              {t('userManagementPage.error.title')}
            </h3>
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
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'} ref={containerRef}>
      {/* Header with Stats */}
      <div
        className={`flex flex-col lg:flex-row lg:items-center ${
          isRTL ? 'lg:justify-between' : 'lg:justify-between'
        } gap-4`}
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('userManagementPage.title')}
          </h2>
          <div
            className={`flex items-center ${
              isRTL ? 'gap-4' : 'gap-4'
            } mt-2 text-sm text-gray-500 dark:text-gray-400`}
          >
            <span
              className={`flex items-center ${isRTL ? 'gap-1' : 'gap-1'}`}
            >
              <Users className="h-4 w-4" />
              {t('userManagementPage.stats.total')}{' '}
              {activeTab === 'users' ? userStats.total : roleStats.total}{' '}
              {activeTab === 'users'
                ? t('userManagementPage.stats.users')
                : t('userManagementPage.stats.roles')}
            </span>
            <span
              className={`flex items-center ${isRTL ? 'gap-1' : 'gap-1'}`}
            >
              <UserCheck className="h-4 w-4" />
              {activeTab === 'users' ? userStats.active : roleStats.active}{' '}
              {t('userManagementPage.stats.active')}
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        {activeTab === 'users' ? (
          <div className={`flex ${isRTL ? 'gap-3' : 'gap-3'}`}>
            <div className="bg-purple-100 dark:bg-purple-900/30 rounded-lg p-3 min-w-0">
              <div
                className={`flex items-center ${isRTL ? 'gap-2' : 'gap-2'}`}
              >
                <Crown className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <div>
                  <p className="text-xs text-purple-600 dark:text-purple-400">
                    {t('userManagementPage.stats.owner')}
                  </p>
                  <p className="font-semibold text-purple-800 dark:text-purple-300">
                    {userStats.owners}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3 min-w-0">
              <div
                className={`flex items-center ${isRTL ? 'gap-2' : 'gap-2'}`}
              >
                <Star className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    {t('userManagementPage.stats.manager')}
                  </p>
                  <p className="font-semibold text-blue-800 dark:text-blue-300">
                    {userStats.managers}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-lg p-3 min-w-0">
              <div
                className={`flex items-center ${isRTL ? 'gap-2' : 'gap-2'}`}
              >
                <User className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400">
                    {t('userManagementPage.stats.staff')}
                  </p>
                  <p className="font-semibold text-indigo-800 dark:text-indigo-300">
                    {userStats.staff}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={`flex ${isRTL ? 'gap-3' : 'gap-3'}`}>
            <div className="bg-emerald-100 dark:bg-emerald-900/30 rounded-lg p-3 min-w-0">
              <div
                className={`flex items-center ${isRTL ? 'gap-2' : 'gap-2'}`}
              >
                <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">
                    {t('userManagementPage.stats.system')}
                  </p>
                  <p className="font-semibold text-emerald-800 dark:text-emerald-300">
                    {roleStats.system}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3 min-w-0">
              <div
                className={`flex items-center ${isRTL ? 'gap-2' : 'gap-2'}`}
              >
                <Star className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    {t('userManagementPage.stats.custom')}
                  </p>
                  <p className="font-semibold text-blue-800 dark:text-blue-300">
                    {roleStats.custom}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-lg p-3 min-w-0">
              <div
                className={`flex items-center ${isRTL ? 'gap-2' : 'gap-2'}`}
              >
                <Users className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400">
                    {t('userManagementPage.stats.totalUsers')}
                  </p>
                  <p className="font-semibold text-indigo-800 dark:text-indigo-300">
                    {roleStats.totalUsers}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav
          className={`-mb-px flex ${
            isRTL ? 'space-x-reverse space-x-8' : 'space-x-8'
          }`}
        >
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
      <div
        className={`flex flex-col sm:flex-row gap-4 items-center ${
          isRTL ? 'justify-between' : 'justify-between'
        }`}
      >
        <div
          className={`flex flex-1 ${
            isRTL ? 'gap-4' : 'gap-4'
          } w-full sm:w-auto`}
        >
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search
              className={`absolute ${
                isRTL ? 'right-3' : 'left-3'
              } top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400`}
            />
            <input
              type="text"
              placeholder={
                activeTab === 'users'
                  ? t('userManagementPage.controls.search')
                  : t('userManagementPage.controls.searchRoles')
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full ${
                isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'
              } py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              title="selectedCategory"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 ${
                isRTL ? 'pl-8 pr-4' : 'pr-8'
              } text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            >
              <option value="all">
                {t('userManagementPage.controls.filterAll')}
              </option>
              <option value="RestaurantOwner">
                {t('userManagementPage.controls.filterOwner')}
              </option>
              <option value="BranchManager">
                {t('userManagementPage.controls.filterManager')}
              </option>
              <option value="Staff">
                {t('userManagementPage.controls.filterStaff')}
              </option>
              <option value="active">
                {t('userManagementPage.controls.filterActive')}
              </option>
              <option value="inactive">
                {t('userManagementPage.controls.filterInactive')}
              </option>
            </select>
            <ChevronDown
              className={`absolute ${
                isRTL ? 'left-2' : 'right-2'
              } top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none`}
            />
          </div>
        </div>

        <div className={`flex items-center ${isRTL ? 'gap-2' : 'gap-2'}`}>
          {/* Add User Button */}
          {activeTab === 'users' && (
            <button
              onClick={() => {
                setRolesForModal(roles); // Reset roles list to global roles on open
                setIsUserModalOpen(true);
              }}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              <UserPlus
                className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`}
              />
              {t('userManagementPage.controls.addUser')}
            </button>
          )}

          {/* Add Role Button */}
          {activeTab === 'roles' && (
            <button
              onClick={() => setIsRoleModalOpen(true)}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              <Shield
                className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`}
              />
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
                        {user.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className={`${isRTL ? 'mr-3' : 'ml-3'} flex-1 min-w-0`}>
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {user.fullName}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                      <div className="relative" >
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === user.id ? null : user.id)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>
                        {activeDropdown === user.id && renderUserActionsDropdown(user)}
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
                            {role}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.isActive)}`}
                        >
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

          {/* Grid View - Roles */}
          {viewMode === 'grid' && filteredRoles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {filteredRoles.map((role, index) => (
                  <motion.div
                   key={role.appRoleId}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                  >
                    {/* Role Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${getRoleColor(role.name)}`}>
                          {getRoleIcon(role.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                            {role.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {role.category || 'No Category'}
                          </p>
                        </div>
                      </div>
                      <div className="relative" >
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === role.appRoleId ? null : role.appRoleId)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>
                        {activeDropdown === role.appRoleId && renderRoleActionsDropdown(role)}
                      </div>
                    </div>

                    {/* Role Description */}
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                      {role.description || 'No description'}
                    </p>

                    {/* Role Info */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">
                          {t('userManagementPage.roleDetails.permissions')}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {role.permissions?.length || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">
                          {t('userManagementPage.roleDetails.created')}
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          {formatDate(role.createdDate)}
                        </span>
                      </div>
                    </div>

                    {/* Role Badges */}
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-2">
                      {role.isSystemRole && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                          <Shield className="h-3 w-3" />
                          {t('userManagementPage.roleDetails.system')}
                        </span>
                      )}
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(role.isActive)}`}>
                        {role.isActive ? <UserCheck className="h-3 w-3" /> : <UserX className="h-3 w-3" />}
                        {role.isActive ? t('userManagementPage.status.active') : t('userManagementPage.status.inactive')}
                      </span>
                      {role.branchId && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                          <Building className="h-3 w-3" />
                          {t('userManagementPage.roleDetails.branchSpecific')}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

    
        </>
      )}

      {/* Modals */}
      {isRoleModalOpen && (
        <CreateRoleModal
          isOpen={isRoleModalOpen}
          onClose={() => setIsRoleModalOpen(false)}
          onSuccess={handleRoleCreated}
          branches={branches}
        />
      )}
      {isUserModalOpen && (
        <CreateUserModal
          branches={branches}
          isOpen={isUserModalOpen}
          onClose={() => setIsUserModalOpen(false)}
          onSubmit={handleCreateUser}
          roles={rolesForModal}
          isLoading={isCreatingUser}
          isRolesLoading={isFetchingModalRoles}
          onBranchChange={handleModalBranchChange}
        />
      )}
      {isEditUserModalOpen && selectedUserForEdit && (
        <EditUserModal
          isOpen={isEditUserModalOpen}
          onClose={() => {
            setIsEditUserModalOpen(false);
            setSelectedUserForEdit(null);
          }}
          onSubmit={handleEditUser}
          user={selectedUserForEdit}
          isLoading={isEditingUser}
        />
      )}
      {isUpdateRolesModalOpen && selectedUserForRoles && (
        <UpdateUserRolesModal
          isOpen={isUpdateRolesModalOpen}
          onClose={() => {
            setIsUpdateRolesModalOpen(false);
            setSelectedUserForRoles(null);
          }}
          onSubmit={handleUpdateRoles}
          user={selectedUserForRoles}
          allRoles={roles}
          isLoading={isUpdatingRoles}
        />
      )}
   
      {isConfirmationModalOpen && confirmationConfig && (
        <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          onClose={() => {
            setIsConfirmationModalOpen(false);
            setConfirmationConfig(null);
          }}
          onConfirm={confirmationConfig.onConfirm}
          title={confirmationConfig.title}
          message={confirmationConfig.message}
          confirmText={confirmationConfig.confirmText}
          actionType={confirmationConfig.actionType}
          isLoading={isConfirmationLoading}
        />
      )}

      {/* View User Permissions Modal */}
      {isPermissionsModalOpen && selectedUserForPermissions && (
        <ViewPermissionsModal
          isOpen={isPermissionsModalOpen}
          onClose={handleClosePermissions}
          user={selectedUserForPermissions}
        />
      )}

      {/* View Role Permissions Modal */}
      {isRolePermissionsModalOpen && selectedRoleForPermissions && (
        <ViewRolePermissionsModal
          isOpen={isRolePermissionsModalOpen}
          onClose={handleCloseRolePermissions}
          role={selectedRoleForPermissions}
        />
      )}

      {/* Edit Role Modal */}
      {isEditRoleModalOpen && selectedRoleForEdit && (
        <EditRoleModal
          isOpen={isEditRoleModalOpen}
          onClose={() => {
            setIsEditRoleModalOpen(false);
            setSelectedRoleForEdit(null);
          }}
          onSubmit={handleEditRole}
          role={selectedRoleForEdit}
          branches={branches}
          isLoading={isEditingRole}
        />
      )}
      {/* Change Password Modal */}
      {isChangePasswordModalOpen && selectedUserForPassword && (
        <ChangePasswordModal
          isOpen={isChangePasswordModalOpen}
          onClose={() => {
            setIsChangePasswordModalOpen(false);
            setSelectedUserForPassword(null);
          }}
          onSubmit={handleChangePassword}
          user={selectedUserForPassword}
          isLoading={isChangingPassword}
        />
      )}

      {/* Assign Branch Modal */}
      {isAssignBranchModalOpen && selectedUserForBranch && (
        <AssignBranchModal
          isOpen={isAssignBranchModalOpen}
          onClose={() => {
            setIsAssignBranchModalOpen(false);
            setSelectedUserForBranch(null);
          }}
          onSubmit={handleAssignBranch}
          user={selectedUserForBranch}
          branches={branches}
          isLoading={isAssigningBranch}
        />
      )}
    </div>
  );
};

export default UserManagement;
