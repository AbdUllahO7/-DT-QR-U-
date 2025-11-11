import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Building, ChevronDown, Loader2, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { useClickOutside } from '../../../../hooks';
import { roleService } from '../../../../services/RoleService';
import { logger } from '../../../../utils/logger';
import type { BranchInfo } from '../../../../types/api';
import { CreateRoleDto, PermissionCatalog } from '../../../../types/users/users.type';

export interface CreateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; 
  branches: BranchInfo[];
}

const CreateRoleModal: React.FC<CreateRoleModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  branches,
}) => {
  const { t, isRTL } = useLanguage();
  // Step state
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  const [formData, setFormData] = useState<CreateRoleDto>({
    name: '',
    description: '',
    branchId: 0,
    category: '',
  });



  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);

  // Permissions state
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [permissionCatalog, setPermissionCatalog] = useState<PermissionCatalog[]>([]);
  const [isFetchingPermissions, setIsFetchingPermissions] = useState(false);
    const [chooseBranchId, setChooseBranchId] = useState(0);

  // Loading states
  const [isCreatingRole, setIsCreatingRole] = useState(false);
  const [isAssigningPermissions, setIsAssigningPermissions] = useState(false);
  
  // Store created role ID
  const [createdRoleId, setCreatedRoleId] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => setIsBranchDropdownOpen(false));

  // Combined loading state
  const isBusy = isCreatingRole || isAssigningPermissions || isFetchingPermissions;

  // Fetch permissions when moving to step 2 or if branchId changes
  useEffect(() => {
    if (currentStep === 2) {
      fetchPermissions();
    }
  }, [currentStep, formData.branchId]); 

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setFormData({
        name: '',
        description: '',
        branchId: undefined,
        category: '',
      });
      setErrors({});
      setSelectedPermissions([]);
      setPermissionCatalog([]);
      setCreatedRoleId(null);
    }
  }, [isOpen]);

  const fetchPermissions = async () => {
    setIsFetchingPermissions(true);
    
    // Create params object
    const params: { branchId?: number } = {};
    // Only add branchId if it's a valid number (not 0, null, or undefined)
    if (formData.branchId && Number(formData.branchId) > 0) {
      params.branchId = Number(formData.branchId);
    }

    try {
      // Pass params to the service call
      const response = await roleService.getPermissionCatalog(params);
      if (response.success && response.data) {
        setPermissionCatalog(response.data);
      } else {
        logger.error('Failed to fetch permission catalog', response, {
          prefix: 'CreateRoleModal',
        });
        setPermissionCatalog([]); // Clear old data on failure
      }
    } catch (error) {
      logger.error('Error fetching permission catalog', error, {
        prefix: 'CreateRoleModal',
      });
      setPermissionCatalog([]); // Clear old data on error
    } finally {
      setIsFetchingPermissions(false);
    }
  };

  // Get selected branch name
  const selectedBranchName = formData.branchId
    ? branches.find((b) => Number(b.branchId) === Number(formData.branchId))?.branchName
    : null;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name || formData.name.length < 3) {
      newErrors.name = t('userManagementPage.createRole.errors.nameRequired');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 1: Create the role
  const handleStep1Continue = async () => {
    if (!validateForm()) return;

    try {
      setIsCreatingRole(true);
      
      // Prepare payload - only include branchId if it's a valid number
      const payload: CreateRoleDto = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
      };

      // Only add branchId if it's defined and greater than 0
      if (formData.branchId && Number(formData.branchId) > 0) {
        payload.branchId = Number(formData.branchId);
      }

      console.log("form data payload", payload);

      const response = await roleService.createRole(payload); 
      
      if (!response.success || !response.data) {
        throw new Error(t('userManagementPage.error.createRoleFailed'));
      }

      logger.info('Rol başarıyla oluşturuldu', response.data, {
        prefix: 'CreateRoleModal',
      });
      setCreatedRoleId(response.data.roleId ?? null);

      setCurrentStep(2);
      
    } catch (error: any) {
      logger.error('Rol oluşturulurken hata', error, {
        prefix: 'CreateRoleModal',
      });
      setErrors({ 
        name: error.message || t('userManagementPage.error.createRoleFailed') 
      });
    } finally {
      setIsCreatingRole(false);
    }
  };

  // Step 2: Assign permissions to the created role (FIXED)
  const handleStep2Submit = async () => {
    if (!createdRoleId) {
      logger.error('No role ID available', {}, { prefix: 'CreateRoleModal' });
      return;
    }

    setIsAssigningPermissions(true);
    try {
      // If no permissions are selected, we are done.
      // This is considered a success (creating a role with no permissions).
      if (selectedPermissions.length === 0) {
        logger.info('No permissions selected, skipping assignment.', {}, { prefix: 'CreateRoleModal' });
        onSuccess();
        onClose();
        return; // Exit the function
      }

      // If permissions ARE selected, try to update them
      const response = await roleService.updateRolePermissions(
        createdRoleId,
        { permissionIds: selectedPermissions }
      );

      if (response.success) {
        logger.info(
          'Rol izinleri başarıyla eklendi',
          response.data,
          { prefix: 'CreateRoleModal' }
        );
        // THIS is the only place it should close on success
        onSuccess();
        onClose();
      } else {
        // API returned success: false
        logger.warn(
          'Rol izinleri güncellenirken uyarı',
          response,
          { prefix: 'CreateRoleModal' }
        );
        // Do not close the modal, show an error (or just log)
        // You could add a new state here to show an error message to the user
      }
      
    } catch (error: any) {
      logger.error('Rol izinleri atanırken hata', error, {
        prefix: 'CreateRoleModal',
      });
      // API call threw an error
      // Do not close the modal, show an error (or just log)
      // You could add a new state here to show an error message to the user
    } finally {
      setIsAssigningPermissions(false);
    }
  };

  // Skip permissions and finish
  const handleSkipPermissions = async () => {
    // Just close and notify success since role is already created
    onSuccess();
    onClose();
  };

  const handlePermissionToggle = (permissionId: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSelectAllInCategory = (categoryName: string) => {
    const category = permissionCatalog.find((c) => c.category === categoryName);
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
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('userManagementPage.createRole.title')}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {currentStep === 1
                    ? t('userManagementPage.createRole.step1Title')
                    : t('userManagementPage.createRole.step2Title')}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              disabled={isBusy}
            >
              ✕
            </button>
          </div>

          {/* Step Indicator */}
          <div className="px-6 pt-4">
            <div className="flex items-center">
              {/* Step 1 */}
              <div className="flex items-center flex-1">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    currentStep === 1
                      ? 'bg-purple-600 text-white'
                      : 'bg-green-600 text-white'
                  }`}
                >
                  {currentStep === 2 ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">1</span>
                  )}
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    currentStep === 1
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {t('userManagementPage.createRole.stepBasicInfo')}
                </span>
              </div>

              {/* Connector */}
              <div className="flex-1 h-0.5 mx-4 bg-gray-200 dark:bg-gray-600">
                <div
                  className={`h-full transition-all duration-300 ${
                    currentStep === 2 ? 'bg-purple-600 w-full' : 'bg-transparent w-0'
                  }`}
                ></div>
              </div>

              {/* Step 2 */}
              <div className="flex items-center flex-1 justify-end">
                <span
                  className={`mr-2 text-sm font-medium ${
                    currentStep === 2
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {t('userManagementPage.createRole.stepPermissions')}
                </span>
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    currentStep === 2
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <span className="text-sm font-semibold">2</span>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {currentStep === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* Info Banner */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h5 className="font-medium text-blue-900 dark:text-blue-200 mb-1">
                          {t('userManagementPage.createRole.step1Info')}
                        </h5>
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                          {t('userManagementPage.createRole.step1Description')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Basic Info Form */}
                  <div className="space-y-4">
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
                        placeholder={t('userManagementPage.createRole.roleNamePlaceholder')}
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
                        placeholder={t('userManagementPage.createRole.descriptionPlaceholder')}
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
                        placeholder={t('userManagementPage.createRole.categoryPlaceholder')}
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
                                setFormData({ ...formData, branchId: undefined });
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
                                    branchId: Number(branch.branchId), 
                                  });
                                                                  setChooseBranchId(Number(branch.branchId))
                                  setIsBranchDropdownOpen(false);
                                }}
                                className={`w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 ${
                                  formData.branchId === Number(branch.branchId) // Compare numbers
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

                  {/* Step 1 Footer */}
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
                      type="button"
                      onClick={handleStep1Continue}
                      disabled={isBusy}
                      className="px-6 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isCreatingRole ? (
                        <>
                          <Loader2 className="animate-spin h-4 w-4" />
                          {t('userManagementPage.createRole.creating')}
                        </>
                      ) : (
                        <>
                          {t('userManagementPage.createRole.continue')}
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* Info Message */}
                  <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h5 className="font-medium text-purple-900 dark:text-purple-200 mb-1">
                          {t('userManagementPage.createRole.step2Info')}
                        </h5>
                        <p className="text-sm text-purple-800 dark:text-purple-300">
                          {t('userManagementPage.createRole.step2Description')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Permissions Selection */}
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
                              {t('userManagementPage.createRole.loadingPermissions')}
                            </span>
                          </div>
                        </div>
                      ) : (
                        permissionCatalog.map((catalog) => {
                          const categoryIds = catalog.permissions.map((p) => p.permissionId);
                          const allSelected = categoryIds.every((id) =>
                            selectedPermissions.includes(id)
                          );
                          const someSelected =
                            categoryIds.some((id) => selectedPermissions.includes(id)) &&
                            !allSelected;

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
                                  onClick={() => handleSelectAllInCategory(catalog.category)}
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
                                      checked={selectedPermissions.includes(permission.permissionId)}
                                      onChange={() => handlePermissionToggle(permission.permissionId)}
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

                  {/* Step 2 Footer */}
                  <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                      type="button"
                      onClick={handleSkipPermissions}
                      disabled={isBusy}
                      className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none disabled:opacity-50"
                    >
                      {t('userManagementPage.createRole.skipPermissions')}
                    </button>
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        disabled={isBusy}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none disabled:opacity-50 flex items-center gap-2"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        {t('userManagementPage.createRole.back')}
                      </button>
                      <button
                        type="button"
                        onClick={handleStep2Submit}
                        disabled={isBusy}
                        className="px-6 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isAssigningPermissions ? (
                          <>
                            <Loader2 className="animate-spin h-4 w-4" />
                            {t('userManagementPage.createRole.assigningPermissions')}
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4" />
                            {t('userManagementPage.createRole.finish')}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateRoleModal;