import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { UpdateUserDto, UserData } from '../../../../types/api';
import { useLanguage } from '../../../../contexts/LanguageContext';

export interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, userData: UpdateUserDto) => Promise<void>;
  user: UserData | null;
  isLoading: boolean;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  user,
  isLoading,
}) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<UpdateUserDto | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      const [name, ...surnameParts] = user.fullName.split(' ');
      const surname = surnameParts.join(' ');

      setFormData({
        appUserId: user.id,
        name: name || '',
        surname: surname || '',
        userName: user.userName,
        email: user.email,
        restaurantId: user.restaurantId,
        branchId: user.branchId,
        profileImage: user.profileImage || '',
        isActive: user.isActive,
      });
    }
  }, [user]);

  const validateForm = (): boolean => {
    if (!formData) return false;
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'First name is required';
    if (!formData.surname) newErrors.surname = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.userName) newErrors.userName = 'Username is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !formData || !user) return;
    
    // Construct the final DTO
    const submitData: UpdateUserDto = {
        ...formData,
        restaurantId: formData.restaurantId || null,
        branchId: formData.branchId || null,
        profileImage: formData.profileImage || null,
    };
    
    onSubmit(user.id, submitData);
  };

  if (!isOpen || !formData) return null;

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
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Edit User: {user?.fullName}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev!, name: e.target.value }))}
                  className={`w-full rounded-lg border px-4 py-2 dark:bg-gray-700 ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                />
              </div>
              <div>
                <label htmlFor="surname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="surname"
                  value={formData.surname}
                  onChange={(e) => setFormData(prev => ({ ...prev!, surname: e.target.value }))}
                  className={`w-full rounded-lg border px-4 py-2 dark:bg-gray-700 ${errors.surname ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev!, email: e.target.value }))}
                  className={`w-full rounded-lg border px-4 py-2 dark:bg-gray-700 ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                />
              </div>
              <div>
                <label htmlFor="userName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="userName"
                  value={formData.userName}
                  onChange={(e) => setFormData(prev => ({ ...prev!, userName: e.target.value }))}
                  className={`w-full rounded-lg border px-4 py-2 dark:bg-gray-700 ${errors.userName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                />
              </div>
            </div>
             <div className="flex items-center">
                <input
                    type="checkbox"
                    id="isActiveEdit"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev!, isActive: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActiveEdit" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    User is Active
                </label>
             </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('userManagementPage.createRole.cancel')}
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EditUserModal;