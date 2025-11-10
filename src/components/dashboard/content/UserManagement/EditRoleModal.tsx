import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Building, ChevronDown, Loader2 } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { useClickOutside } from '../../../../hooks';
import { roleService } from '../../../../services/RoleService';
import { logger } from '../../../../utils/logger';
import type {
  BranchInfo,
} from '../../../../types/api';
import { PermissionCatalog, Role, UpdateRoleDto } from '../../../../types/users/users.type';

export interface EditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    roleId: string,
    roleData: UpdateRoleDto,
    permissionIds: number[]
  ) => Promise<void>;
  role: Role | null;
  branches: BranchInfo[];
  isLoading: boolean; // Submit loading state
}

const EditRoleModal: React.FC<EditRoleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  role,
  branches,
  isLoading,
}) => {
  const { t, isRTL } = useLanguage();

  console.log("role",)

  // Form state
  const [formData, setFormData] = useState<UpdateRoleDto>({
    name: '',
    description: '',
    branchId: "",
    category: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);

  // State for fetching permissions
  const [permissionCatalog, setPermissionCatalog] = useState<PermissionCatalog[]>(
    []
  );
  const [isFetchingPermissions, setIsFetchingPermissions] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => setIsBranchDropdownOpen(false));

  // Combined loading state
  const isBusy = isLoading || isFetchingPermissions;

  // Effect to populate form when modal opens or role changes
  useEffect(() => {
    if (isOpen && role) {
      // 1. Fetch the full permission catalog
      const fetchPermissions = async () => {
        setIsFetchingPermissions(true);
        try {
          const response = await roleService.getPermissionCatalog();
          if (response.success && response.data) {
            setPermissionCatalog(response.data);

            // 2. Once catalog is fetched, populate the form
            setFormData({
              name: role.name,
              description: role.description || '',
              branchId: role.branchId || "",
              category: role.category || '',
            });

            // 3. Pre-select permissions
            // Create a lookup map of all permissions from the catalog: { "branch.create": 5, ... }
            const allPermissionsMap = new Map<string, number>();
            for (const category of response.data) {
              for (const perm of category.permissions) {
                if (perm.permissionName) {
                  allPermissionsMap.set(perm.permissionName, perm.permissionId);
                }
              }
            }

            // Get the names of the permissions this role already has
          const rolePermissionNames = new Set(
          role.permissions.map((p) => p.name)
        );

            // Find the corresponding IDs from the catalog
            const initialSelectedIds: number[] = [];
              for (const name of rolePermissionNames) {
                if (allPermissionsMap.has(name)) {
                  initialSelectedIds.push(allPermissionsMap.get(name)!);
                }
              }
              setSelectedPermissions(initialSelectedIds);
          } else {
            logger.error('Failed to fetch permission catalog', response, {
              prefix: 'EditRoleModal',
            });
          }
        } catch (error) {
          logger.error('Error fetching permission catalog', error, {
            prefix: 'EditRoleModal',
          });
        } finally {
          setIsFetchingPermissions(false);
        }
      };

      fetchPermissions();
    } else {
      // Reset form when modal closes
      setFormData({ name: '', description: '', branchId: "", category: '' });
      setSelectedPermissions([]);
      setErrors({});
      setPermissionCatalog([]);
    }
  }, [isOpen, role]);

  // Get selected branch name
  const selectedBranchName = formData.branchId
    ? branches.find((b) => b.branchId === formData.branchId)?.branchName
    : null;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name || formData.name.length < 3) {
      newErrors.name = t('userManagementPage.createRole.errors.nameRequired');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !role) return;

    const submitData: UpdateRoleDto = {
      name: formData.name,
      description: formData.description || null,
      branchId: formData.branchId,
      category: formData.category || null,
    };

    try {
      await onSubmit(role.appRoleId, submitData, selectedPermissions);
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const handlePermissionToggle = (permissionId: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSelectAllInCategory = (categoryName: string) => {
    const category = permissionCatalog.find(
      (c) => c.category === categoryName
    );
    if (!category) return;

    const categoryIds = category.permissions.map((p) => p.permissionId);
    const allSelected = categoryIds.every((id) =>
      selectedPermissions.includes(id)
    );

    if (allSelected) {
      setSelectedPermissions((prev) =>
        prev.filter((id) => !categoryIds.includes(id))
      );
    } else {
      setSelectedPermissions((prev) => [...new Set([...prev, ...categoryIds])]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        ></div>
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
              {t('userManagementPage.editRole.title')}: {role?.name}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              disabled={isBusy}
            >
              ✕
            </button>
          </div>

          {/* Modal Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t('userManagementPage.createRole.basicInfo')}
              </h4>

              {/* Role Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('userManagementPage.createRole.roleName')}{' '}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={`w-full px-3 py-2 border ${
                    errors.name
                      ? 'border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  } rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  placeholder={t(
                    'userManagementPage.createRole.roleNamePlaceholder'
                  )}
                  disabled={isBusy}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('userManagementPage.createRole.description')}
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder={t(
                    'userManagementPage.createRole.descriptionPlaceholder'
                  )}
                  disabled={isBusy}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('userManagementPage.createRole.category')}
                </label>
                <input
                  type="text"
                  value={formData.category || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder={t(
                    'userManagementPage.createRole.categoryPlaceholder'
                  )}
                  disabled={isBusy}
                />
              </div>

              {/* Branch Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('userManagementPage.createRole.branch')}
                </label>
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
                    disabled={isBusy || branches.length === 0}
                    className={`flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${
                      isRTL ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <span
                      className={`flex items-center ${
                        isRTL ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <Building
                        className={`h-4 w-4 text-gray-500 dark:text-gray-400 ${
                          isRTL ? 'ml-2' : 'mr-2'
                        }`}
                      />
                      {selectedBranchName ||
                        t('userManagementPage.createRole.selectBranch')}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isBranchDropdownOpen ? 'transform rotate-180' : ''
                      } ${isRTL ? 'mr-2' : 'ml-2'}`}
                    />
                  </button>

                  {isBranchDropdownOpen && (
                    <div
                      className={`absolute z-20 mt-1 w-full bg-white dark:bg-gray-700 rounded-md shadow-lg border border-gray-200 dark:border-gray-600 py-1 max-h-60 overflow-auto ${
                        isRTL ? 'right-0' : 'left-0'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, branchId: "" });
                          setIsBranchDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 ${
                          !formData.branchId
                            ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                            : 'text-gray-700 dark:text-gray-200'
                        } ${isRTL ? 'text-right' : 'text-left'}`}
                      >
                        {t('userManagementPage.createRole.noBranch')}
                      </button>
                      
                      {branches.map((branch) => (
                        <button
                          key={branch.branchId}
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              branchId: branch.branchId,
                            });
                            setIsBranchDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 ${
                            formData.branchId === branch.branchId
                              ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                              : 'text-gray-700 dark:text-gray-200'
                          } ${isRTL ? 'text-right' : 'text-left'}`}
                        >
                          {branch.branchName}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {t('userManagementPage.createRole.branchHint')}
                </p>
              </div>
            </div>

            {/* Permissions */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t('userManagementPage.createRole.permissions')}
              </h4>

              <div className="max-h-80 min-h-[10rem] overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                {isFetchingPermissions ? (
                  <div className="flex items-center justify-center h-full min-h-[10rem]">
                    <div className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400">
                      <Loader2 className="animate-spin h-6 w-6" />
                      <span className="text-sm">
                        {t(
                          'userManagementPage.createRole.loadingPermissions'
                        )}
                      </span>
                    </div>
                  </div>
                ) : (
                  permissionCatalog.map((catalog) => {
                    const categoryIds = catalog.permissions.map(
                      (p) => p.permissionId
                    );
                    const allSelected = categoryIds.every((id) =>
                      selectedPermissions.includes(id)
                    );
                    const someSelected =
                      categoryIds.some((id) =>
                        selectedPermissions.includes(id)
                      ) && !allSelected;

                    return (
                      <div
                        key={catalog.category}
                        className="border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                      >
                        {/* Category Header */}
                        <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 flex items-center justify-between sticky top-0 z-10">
                          <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
                            {catalog.category}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleSelectAllInCategory(catalog.category)
                            }
                            className={`text-xs px-2 py-1 rounded ${
                              allSelected
                                ? 'bg-purple-600 text-white'
                                : someSelected
                                ? 'bg-purple-300 dark:bg-purple-700 text-gray-700 dark:text-gray-200'
                                : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                            } hover:opacity-80 transition-opacity`}
                            disabled={isBusy}
                          >
                            {allSelected
                              ? t('userManagementPage.createRole.deselectAll')
                              : t('userManagementPage.createRole.selectAll')}
                          </button>
                        </div>

                        {/* Permissions List */}
                        <div className="p-2">
                          {catalog.permissions.map((permission) => (
                            <label
                              key={permission.permissionId}
                              className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600/50 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={selectedPermissions.includes(
                                  permission.permissionId
                                )}
                                onChange={() =>
                                  handlePermissionToggle(permission.permissionId)
                                }
                                disabled={isBusy}
                                className="mt-0.5 h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm text-gray-900 dark:text-white">
                                  {permission.description}
                                </div>
                            
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Shield className="h-4 w-4" />
                <span>
                  {selectedPermissions.length}{' '}
                  {t('userManagementPage.createRole.permissionsSelected')}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                disabled={isBusy}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none disabled:opacity-50"
              >
                {t('userManagementPage.createRole.cancel')}
              </button>
              <button
                type="submit"
                disabled={isBusy}
                className="px-6 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                {isLoading
                  ? t('userManagementPage.editRole.saving')
                  : t('userManagementPage.editRole.save')}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EditRoleModal;