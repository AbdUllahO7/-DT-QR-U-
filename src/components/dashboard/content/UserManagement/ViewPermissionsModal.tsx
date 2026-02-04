import React from 'react';
import { motion } from 'framer-motion';
import { Key, Shield } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { UserData } from '../../../../types/users/users.type';
import { getTranslatedPermissionName, getTranslatedRoleName } from '../../../../utils/permissionTranslation';

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
          className="relative w-full max-w-lg rounded-xl bg-white dark:bg-gray-800 shadow-2xl"
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
            {/* Roles Section (Kept as context, but styled compactly) */}
            {user.roles && user.roles.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {t('userManagementPage.permissionsModal.userRoles')}
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {user.roles.map((role, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                    >
                      {getTranslatedRoleName(role, t)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Permissions Section - Refactored to match ViewRolePermissionsModal */}
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t('userManagementPage.permissionsModal.permissions')}
              </h4>
              {hasPermissions && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {user.permissions?.length}{' '}
                  {t('userManagementPage.permissionsModal.permissionsCount')}
                </span>
              )}
            </div>

            <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 p-4">
              {hasPermissions ? (
                <div className="space-y-2">
                  {user.permissions?.map((permission, index) => {
                    const translatedName = getTranslatedPermissionName(permission, t);

                    return (
                      <div
                        key={permission.permissionId || index}
                        className="flex flex-col rounded-lg bg-gray-100 px-3 py-2 dark:bg-gray-700"
                      >
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                          {translatedName}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  {t('userManagementPage.permissionsModal.noPermissions')}
                </p>
              )}
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