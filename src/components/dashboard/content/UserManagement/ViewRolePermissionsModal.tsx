import React from 'react';
import { motion } from 'framer-motion';
import { Key, Shield } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { Role } from '../../../../types/users/users.type';
import { getTranslatedPermissionName } from '../../../../utils/permissionTranslation';

export interface ViewRolePermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: Role;
}

const ViewRolePermissionsModal: React.FC<ViewRolePermissionsModalProps> = ({
  isOpen,
  onClose,
  role,
}) => {
  const { t, isRTL } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Modal Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        ></div>
        
        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg rounded-xl bg-white dark:bg-gray-800 shadow-2xl"
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-500 dark:text-purple-400" />
              {t('userManagementPage.rolePermissionsModal.title')}{' '}
              {role.name}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 p-4">
              {role.permissions && role.permissions.length > 0 ? (
                <div className="space-y-2">
                  {role.permissions.map((permission, index) => {
                    const translatedName = getTranslatedPermissionName(permission, t);

                    return (
                      <div
                        key={permission.permissionId || index} // Use permissionId if available
                        className="flex flex-col rounded-lg bg-gray-100 px-3 py-2 dark:bg-gray-700"
                      >
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {translatedName}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  {t(
                    'userManagementPage.rolePermissionsModal.noPermissions'
                  )}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-4 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              {t('userManagementPage.permissionsModal.close')}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ViewRolePermissionsModal;