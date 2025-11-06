import React from 'react';
import { motion } from 'framer-motion';
import { Key, Shield } from 'lucide-react';
import { UserData } from '../../../../types/api';
import { useLanguage } from '../../../../contexts/LanguageContext';

export interface ViewPermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserData;
}

const ViewPermissionsModal: React.FC<ViewPermissionsModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const { t, isRTL } = useLanguage();

  if (!isOpen) return null;

  // Group permissions by category (if they have a dot notation like "user.create")
  const groupedPermissions = React.useMemo(() => {
    if (!user.permissions || user.permissions.length === 0) return {};

    const groups: Record<string, string[]> = {};
    
    user.permissions.forEach((permission) => {
      // Try to extract category from permission name (e.g., "user.create" -> "user")
      const parts = permission.split('.');
      const category = parts.length > 1 ? parts[0] : 'other';
      
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(permission);
    });

    return groups;
  }, [user.permissions]);

  const hasPermissions = user.permissions && user.permissions.length > 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Modal Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl rounded-xl bg-white dark:bg-gray-800 shadow-2xl"
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('userManagementPage.permissionsModal.title')}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.fullName}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {/* Roles Section */}
            {user.roles && user.roles.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {t('userManagementPage.permissionsModal.userRoles')}
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {user.roles.map((role, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Permissions Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t('userManagementPage.permissionsModal.permissions')}
                </h4>
                {hasPermissions && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {user.permissions.length}{' '}
                    {t('userManagementPage.permissionsModal.permissionsCount')}
                  </span>
                )}
              </div>

              <div className="max-h-96 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                {hasPermissions ? (
                  <div className="divide-y divide-gray-200 dark:divide-gray-600">
                    {Object.entries(groupedPermissions).map(([category, permissions]) => (
                      <div key={category} className="p-4">
                        <h5 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">
                          {category}
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {permissions.map((permission, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                            >
                              {permission}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Key className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                      {t('userManagementPage.permissionsModal.noPermissions')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end border-t border-gray-200 dark:border-gray-700 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {t('userManagementPage.permissionsModal.close')}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ViewPermissionsModal;