import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Shield, Building, ChevronDown, Loader2 } from 'lucide-react'; // Added Loader2
import { useLanguage } from '../../../../contexts/LanguageContext';
import { useClickOutside } from '../../../../hooks';
import type {  BranchInfo } from '../../../../types/api';
import { CreateUserDto, Role } from '../../../../types/users/users.type';

export interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: CreateUserDto) => Promise<void>;
  roles: Role[];
  branches: BranchInfo[];
  isLoading: boolean;
  isRolesLoading: boolean; // <-- NEW: Prop to show role loading state
  onBranchChange: (branchId: number | null) => void; // <-- NEW: Callback for branch change
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  roles,
  branches,
  isLoading,
  isRolesLoading, // <-- Destructured
  onBranchChange, // <-- Destructured
}) => {
  const { t, isRTL } = useLanguage();
  const [formData, setFormData] = useState<CreateUserDto>({
    surName: '',
    name: '',
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
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  console.log("roles",roles)
  const branchDropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(branchDropdownRef, () => setIsBranchDropdownOpen(false));

  // Get selected branch name
  const selectedBranchName = formData.branchId 
    ? branches.find(b => Number(b.branchId) === Number(formData.branchId))?.branchName 
    : null;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.name || formData.name.length === 0) {
      newErrors.name = 'First name is required';
    } else if (formData.name.length > 50) {
      newErrors.name = 'First name must be less than 50 characters';
    }

    // Surname validation
    if (!formData.surName || formData.surName.length === 0) {
      newErrors.surName = 'Last name is required';
    } else if (formData.surName.length > 50) {
      newErrors.surName = 'Last name must be less than 50 characters';
    }

    // Email validation
    if (!formData.email || formData.email.length === 0) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Password validation
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (formData.password.length > 100) {
      newErrors.password = 'Password must be less than 100 characters';
    }

    // Password confirmation validation
    if (!formData.passwordConfirm || formData.passwordConfirm.length === 0) {
      newErrors.passwordConfirm = 'Password confirmation is required';
    } else if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = 'Passwords do not match';
    }

    // Phone number validation
    if (!formData.phoneNumber || formData.phoneNumber.length === 0) {
      newErrors.phoneNumber = 'Phone number is required';
    }

    // Location validation
    if (locationType === 'branch') {
      if (!formData.branchId) {
        newErrors.branchId = 'Branch is required';
      }
    }

    // Role validation
    if (selectedRoles.length === 0) {
      newErrors.roles = 'At least one role must be selected';
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
      name: formData.name || `${formData.name.toLowerCase()}.${formData.surName.toLowerCase()}`.replace(/[^a-z.]/g, ''),
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

  const handleLocationTypeChange = (type: 'restaurant' | 'branch') => {
    setLocationType(type);
    
    if (type === 'restaurant') {
      setFormData(prev => ({ ...prev, branchId: null }));
    } else { // type === 'branch'
      setFormData(prev => ({ ...prev, restaurantId: null, branchId: null }));
    }
    
    // **MODIFIED**: Tell the parent component to reset the roles to default
    onBranchChange(null);
    
    // Clear any location-based errors
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
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4 sticky top-0 bg-white dark:bg-gray-800 z-10">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              {t('userManagementPage.createUser.title') || 'Create New User'}
            </h3>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>

          {/* Modal Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Personal Info */}
            <div>
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                {t('userManagementPage.createUser.personalInfo') || 'Personal Information'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('userManagementPage.createUser.firstName') || 'First Name'} <span className="text-red-500">*</span>
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
                    placeholder="Enter first name"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="surName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('userManagementPage.createUser.lastName') || 'Last Name'} <span className="text-red-500">*</span>
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
                    placeholder="Enter last name"
                  />
                  {errors.surName && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.surName}</p>}
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                {t('userManagementPage.createUser.contactInfo') || 'Contact Information'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('userManagementPage.createUser.email') || 'Email'} <span className="text-red-500">*</span>
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
                    placeholder="user@example.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('userManagementPage.createUser.phoneNumber') || 'Phone Number'} <span className="text-red-500">*</span>
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
                    placeholder="+1 234 567 8900"
                  />
                  {errors.phoneNumber && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phoneNumber}</p>}
                </div>
              </div>
            </div>

            {/* Password Info */}
            <div>
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                {t('userManagementPage.createUser.password') || 'Password'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('userManagementPage.createUser.password') || 'Password'} <span className="text-red-500">*</span>
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
                      placeholder="Enter password (min 6 characters)"
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
                    {t('userManagementPage.createUser.confirmPassword') || 'Confirm Password'} <span className="text-red-500">*</span>
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
                      placeholder="Confirm password"
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
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                {t('userManagementPage.createUser.location') || 'Location'}
              </h4>
              
              {/* Location Type Selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('userManagementPage.createUser.locationType') || 'Location Type'} <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="locationType"
                      value="restaurant"
                      checked={locationType === 'restaurant'}
                      onChange={() => handleLocationTypeChange('restaurant')}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className={`${isRTL ? 'mr-2' : 'ml-2'} text-sm text-gray-700 dark:text-gray-300`}>
                      {t('userManagementPage.createUser.restaurant') || 'Restaurant'}
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="locationType"
                      value="branch"
                      checked={locationType === 'branch'}
                      onChange={() => handleLocationTypeChange('branch')}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className={`${isRTL ? 'mr-2' : 'ml-2'} text-sm text-gray-700 dark:text-gray-300`}>
                      {t('userManagementPage.createUser.branch') || 'Branch'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Conditional Input Based on Location Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {locationType === 'restaurant' ? (
                 ""
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('userManagementPage.createUser.branch') || 'Branch'} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative" ref={branchDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
                        disabled={isLoading || branches.length === 0}
                        className={`flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${
                          errors.branchId 
                            ? 'border-red-500 dark:border-red-400' 
                            : 'border-gray-300 dark:border-gray-600'
                        } ${isRTL ? 'flex-row-reverse' : ''}`}
                      >
                        <span className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <Building className={`h-4 w-4 text-gray-500 dark:text-gray-400 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                          {selectedBranchName || t('userManagementPage.createUser.selectBranch') || 'Select Branch'}
                        </span>
                        <ChevronDown 
                          className={`h-4 w-4 transition-transform duration-200 ${
                            isBranchDropdownOpen ? 'transform rotate-180' : ''
                          } ${isRTL ? 'mr-2' : 'ml-2'}`} 
                        />
                      </button>

                      {isBranchDropdownOpen && (
                        <div className={`absolute z-20 mt-1 w-full bg-white dark:bg-gray-700 rounded-md shadow-lg border border-gray-200 dark:border-gray-600 py-1 max-h-60 overflow-auto ${
                          isRTL ? 'right-0' : 'left-0'
                        }`}>
                          {branches.length === 0 ? (
                            <div className="px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
                              {t('userManagementPage.createUser.noBranches') || 'No branches available'}
                            </div>
                          ) : (
                            branches.map((branch) => (
                              <button
                                key={branch.branchId}
                                type="button"
                                onClick={() => {
                                  setFormData(prev => ({ ...prev, branchId: branch.branchId }));
                                  setIsBranchDropdownOpen(false);
                                  setErrors(prev => {
                                    const newErrors = { ...prev };
                                    delete newErrors.branchId;
                                    return newErrors;
                                  });
                                  // **MODIFIED**: Tell parent component branch has changed
                                  onBranchChange(branch.branchId);
                                }}
                                className={`w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 ${
                                  formData.branchId === branch.branchId
                                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                    : 'text-gray-700 dark:text-gray-200'
                                } ${isRTL ? 'text-right' : 'text-left'}`}
                              >
                                {branch.branchName}
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                    {errors.branchId && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.branchId}</p>}
                  </div>
                )}

           
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                {t('userManagementPage.createUser.roleAssignment') || 'Role Assignment'}
              </h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {t('userManagementPage.createUser.roles') || 'Roles'} ({selectedRoles.length} selected) <span className="text-red-500">*</span>
                </label>
                <div className="max-h-48 min-h-[10rem] overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/50">
                  
                  {/* **MODIFIED**: Added loading state for roles */}
                  {isRolesLoading ? (
                    <div className="flex items-center justify-center h-full min-h-[8rem]">
                      <div className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400">
                        <Loader2 className="animate-spin h-6 w-6" />
                        <span className="text-sm">
                          {t('userManagementPage.createUser.loadingRoles') || 'Loading roles...'}
                        </span>
                      </div>
                    </div>
                  ) : roles.length === 0 ? (
                    <div className="text-center py-6 flex flex-col items-center justify-center h-full min-h-[8rem]">
                      <Shield className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">
                        {locationType === 'branch' && !formData.branchId
                          ? t('userManagementPage.createUser.selectBranchForRoles') || 'Select a branch'
                          : t('userManagementPage.createUser.noRoles') || 'No roles available'}
                      </p>
                      <p className="text-gray-400 dark:text-gray-500 text-xs text-center">
                        {locationType === 'branch' && !formData.branchId
                          ? t('userManagementPage.createUser.selectBranchForRolesDesc') || 'Select a branch to see available roles.'
                          : t('userManagementPage.createUser.createRolesFirst') || 'No roles found for this location.'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {roles.filter(role => role.isActive).map((role) => (
                        <label
                          key={role.roleId}
                          className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600/50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedRoles.includes(role.roleId)}
                            onChange={() => handleRoleToggle(role.roleId)}
                            className="mt-0.5 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-gray-900 dark:text-white">
                              {role.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {role.description}
                            </div>
                            {role.category && (
                              <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                {role.category}
                              </div>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                {errors.roles && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.roles}</p>}
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
                {t('userManagementPage.createUser.userIsActive') || 'User is Active'}
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
                {t('userManagementPage.createUser.cancel') || 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={isLoading || isRolesLoading || roles.length === 0} // **MODIFIED**: Also disable while roles are loading
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                {isLoading 
                  ? t('userManagementPage.createUser.creating') || 'Creating...' 
                  : isRolesLoading
                    ? t('userManagementPage.createUser.loadingRoles') || 'Loading Roles...'
                  : roles.length === 0 
                    ? t('userManagementPage.createUser.noRoles') || 'No Roles Available' 
                    : t('userManagementPage.createUser.create') || 'Create User'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateUserModal;