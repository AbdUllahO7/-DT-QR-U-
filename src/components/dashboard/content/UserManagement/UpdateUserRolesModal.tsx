import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Loader2 } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { roleService } from '../../../../services/RoleService'; // <-- Import roleService
import { logger } from '../../../../utils/logger';
import { Role, UpdateUserRolesDto, UserData } from '../../../../types/users/users.type';

export interface UpdateUserRolesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, rolesData: UpdateUserRolesDto) => Promise<void>;
  user: UserData | null;
  allRoles: Role[]; // These are the GLOBAL roles, used as a fallback
  isLoading: boolean;
}

const UpdateUserRolesModal: React.FC<UpdateUserRolesModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  user,
  allRoles,
  isLoading,
}) => {
  const { t } = useLanguage();
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  
  // State for roles to show in the modal (either global or branch-specific)
  const [displayRoles, setDisplayRoles] = useState<Role[]>([]);
  
  // State for loading branch-specific roles
  const [isRolesLoading, setIsRolesLoading] = useState(false);

  // Hook 1: Fetch the correct roles when the modal opens or user changes
  useEffect(() => {
    if (!isOpen || !user) {
      setDisplayRoles([]); // Clear roles when modal is closed or user is null
      return;
    }

    const userBranchId = user.branchId;

    if (userBranchId) {
      // User is assigned to a branch, fetch branch-specific roles
      const fetchBranchRoles = async () => {
        setIsRolesLoading(true);
        try {
          const response = await roleService.getRoles({ branchId: userBranchId });
          setDisplayRoles(response.data || []);
          logger.info(`Fetched ${response.data?.length} roles for branch ${userBranchId}`, response.data, { prefix: 'UpdateUserRolesModal' });
        } catch (error) {
          logger.error(`Failed to fetch roles for branch ${userBranchId}`, error, { prefix: 'UpdateUserRolesModal' });
          setDisplayRoles([]);
        } finally {
          setIsRolesLoading(false);
        }
      };
      fetchBranchRoles();
    } else {
      // User is a global/restaurant user, use the provided 'allRoles'
      setDisplayRoles(allRoles);
      setIsRolesLoading(false);
      logger.info(`Using ${allRoles.length} global roles for user ${user.id}`, allRoles, { prefix: 'UpdateUserRolesModal' });
    }
  }, [user, allRoles, isOpen]); // Rerun when modal opens or user/global roles change

  // Hook 2: Set the user's current roles as "selected"
  useEffect(() => {
    if (user && displayRoles) {
      // Map role names (user.roles) to role IDs (displayRoles)
      const activeRoleIds = displayRoles
        .filter(role => user.roles.includes(role.name))
        .map(role => role.roleId);
      setSelectedRoles(activeRoleIds);
    } else {
      setSelectedRoles([]); // Clear selection if no user or roles
    }
  }, [user, displayRoles]); // Rerun when user or the list of displayable roles changes

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    onSubmit(user.id, { roleIds: selectedRoles });
  };

  const handleRoleToggle = (roleId: string) => {
    setSelectedRoles(prev =>
      prev.includes(roleId)
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
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
          className="relative w-full max-w-lg rounded-xl bg-white dark:bg-gray-800 shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              {t('userManagementPage.updateRoles.title', { name: user?.fullName || '' })}
            </h3>
            <button 
              onClick={onClose} 
              disabled={isLoading || isRolesLoading}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="max-h-64 min-h-[10rem] overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/50">
              {isRolesLoading ? (
                <div className="flex items-center justify-center h-full min-h-[8rem]">
                  <div className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400">
                    <Loader2 className="animate-spin h-6 w-6" />
                    <span className="text-sm">
                      {t('userManagementPage.createUser.loadingRoles') || 'Loading roles...'}
                    </span>
                  </div>
                </div>
              ) : displayRoles.length === 0 ? (
                <div className="text-center py-6 flex flex-col items-center justify-center h-full min-h-[8rem]">
                  <Shield className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">
                    {t('userManagementPage.createUser.noRoles') || 'No roles available'}
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-xs text-center">
                    {t('userManagementPage.updateRoles.noRolesDesc') || 'No roles were found for this user\'s location.'}
                  </p>
                </div>
              ) : (
                displayRoles.filter(role => role.isActive).map(role => (
                  <label
                    key={role.roleId}
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600/50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedRoles.includes(role.roleId)}
                      onChange={() => handleRoleToggle(role.roleId)}
                      className="mt-0.5 h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900 dark:text-white">
                        {role.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {role.description}
                      </div>
                    </div>
                  </label>
                ))
              )}
            </div>
            
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button 
                type="button" 
                onClick={onClose} 
                disabled={isLoading || isRolesLoading} 
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-300/50 rounded-lg disabled:opacity-50"
              >
                {t('userManagementPage.createRole.cancel') || 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={isLoading || isRolesLoading || displayRoles.length === 0}
                className="px-6 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 rounded-lg shadow-sm disabled:opacity-50 flex items-center gap-2"
              >
                {(isLoading || isRolesLoading) && <Loader2 className="animate-spin h-4 w-4" />}
                {isLoading 
                  ? t('userManagementPage.updateRoles.saving') || 'Saving...' 
                  : isRolesLoading
                    ? t('userManagementPage.createUser.loadingRoles') || 'Loading...'
                    : t('userManagementPage.updateRoles.update') || 'Update Roles'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default UpdateUserRolesModal;