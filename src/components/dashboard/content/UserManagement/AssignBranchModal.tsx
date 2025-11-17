import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Building } from 'lucide-react'; // Import Building icon
import { useLanguage } from '../../../../contexts/LanguageContext';
import { AssignBranchDto, UserData } from '../../../../types/users/users.type';
import { BranchInfo } from '../../../../types/api';

// Define a simple Branch type for the prop
interface Branch {
  id: string | number;
  name: string;
}

export interface AssignBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, branchData: AssignBranchDto) => Promise<void>;
  user: UserData | null;
  isLoading: boolean;
  branches: BranchInfo[]; // <-- NEW PROP: Pass the list of all branches here
}

const AssignBranchModal: React.FC<AssignBranchModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  user,
  isLoading,
  branches,
}) => {
  const { t } = useLanguage();
  const [newBranchId, setNewBranchId] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Updated validation for the select dropdown
    // Check if newBranchId is '' (placeholder) or null/undefined
    if (!newBranchId) {
      setError(
        t(
          'userManagementPage.assignBranchModal.validation.branchRequired'
        )
      );
      return;
    }
    if (!user) return;

    // Parse the ID (from select value) before submitting
    const branchIdNum = parseInt(newBranchId, 10);
    
    // newBranchId could be "0", which parses to 0. isNaN(0) is false.
    // This check is to catch any unexpected non-numeric values
    if (isNaN(branchIdNum)) {
      setError(
        t(
          'userManagementPage.assignBranchModal.validation.branchRequired'
        )
      );
      return;
    }

    setError('');
    // This will send { newBranchId: 0 } if "Assign to Restaurant" is selected
    onSubmit(user.id, { targetBranchId: branchIdNum });
  };

  // Reset state when modal opens or user changes
  useEffect(() => {
    if (isOpen) {
      setNewBranchId('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentBranchDisplay = user?.branchName 
    ? `${user.branchName} (ID: ${user.branchId})`
    : t('userManagementPage.assignBranchModal.assignedToRestaurant');

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
          className="relative w-full max-w-md rounded-xl bg-white dark:bg-gray-800 shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
              {t('userManagementPage.assignBranchModal.title')}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t('userManagementPage.assignBranchModal.assigningTo')}{' '}
              <strong className="text-gray-900 dark:text-white">
                {user?.fullName}
              </strong>{' '}
              {t('userManagementPage.assignBranchModal.toNewBranch')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('userManagementPage.assignBranchModal.currentBranch')}:{' '}
              <span className='font-medium'>{currentBranchDisplay}</span>
            </p>
            <div>
              <label
                htmlFor="branchId"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                {t('userManagementPage.assignBranchModal.newBranchLabel')}{' '}
                <span className="text-red-500">*</span>
              </label>

              {/* --- REPLACED INPUT WITH SELECT --- */}
              <select
                id="branchId"
                value={newBranchId}
                onChange={(e) => setNewBranchId(e.target.value)}
                className={`w-full rounded-lg dark:text-white border px-4 py-2 dark:bg-gray-700 ${
                  error
                    ? 'border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <option className="dark:text-white" value="" disabled>
                  {t(
                    'userManagementPage.assignBranchModal.selectBranchPlaceholder'
                  )}
                </option>

                {/* --- ADDED RESTAURANT OPTION --- */}
                {/* Show this option only if the user is currently assigned to a branch (branchId is not 0 or null) */}
                {!!user?.branchId && (
                  <option className="dark:text-white font-medium" value="0">
                    <Building className="h-4 w-4 inline-block mr-2" />
                    {t(
                      'userManagementPage.assignBranchModal.assignToRestaurant'
                    )}
                  </option>
                )}
                {/* --- END OF ADDED OPTION --- */}

                {branches
                  // Filter out the user's current branch from the list
                  .filter((branch) => branch.branchId !== user?.branchId)
                  .map((branch) => (
                    <option
                      className="dark:text-white"
                      key={branch.branchId}
                      value={branch.branchId}
                    >
                      {branch.branchName}
                    </option>
                  ))}
              </select>
              {/* --- END OF REPLACEMENT --- */}

              {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t('userManagementPage.createRole.cancel')}
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm disabled:opacity-50"
              >
                {isLoading
                  ? t(
                      'userManagementPage.assignBranchModal.submitButtonLoading'
                    )
                  : t(
                      'userManagementPage.assignBranchModal.submitButton'
                    )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AssignBranchModal;