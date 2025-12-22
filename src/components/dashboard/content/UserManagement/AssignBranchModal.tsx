import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Building, Store, CheckCircle2 } from 'lucide-react'; 
import { useLanguage } from '../../../../contexts/LanguageContext';
import { AssignBranchDto, UserData } from '../../../../types/users/users.type';
import { BranchInfo } from '../../../../types/api';

export interface AssignBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, branchData: AssignBranchDto) => Promise<void>;
  user: UserData | null;
  isLoading: boolean;
  branches: BranchInfo[];
}

type AssignmentType = 'branch' | 'restaurant';

const AssignBranchModal: React.FC<AssignBranchModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  user,
  isLoading,
  branches,
}) => {
  const { t } = useLanguage();
  
  // State for the type of assignment (Mode 1 or Mode 2)
  const [assignmentType, setAssignmentType] = useState<AssignmentType>('branch');
  
  // State for the specific branch selection
  const [newBranchId, setNewBranchId] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Check if user is currently in a branch (so they can be moved to Restaurant)
  const isCurrentlyInBranch = user?.branchId !== 0 && user?.branchId !== null;

  // Filter available branches (exclude current one)
  const availableBranches = branches.filter((branch) => branch.branchId !== user?.branchId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let targetId = 0;

    // LOGIC 1: Assign to specific Branch
    if (assignmentType === 'branch') {
      if (!newBranchId) {
        setError(t('userManagementPage.assignBranchModal.validation.branchRequired'));
        return;
      }
      const parsedId = parseInt(newBranchId, 10);
      if (isNaN(parsedId)) {
        setError(t('userManagementPage.assignBranchModal.validation.branchRequired'));
        return;
      }
      targetId = parsedId;
    } 
    // LOGIC 2: Assign to Restaurant (HQ)
    else {
      targetId = 0; // 0 represents HQ
    }

    setError('');
    if (user) {
      onSubmit(user.id, { targetBranchId: targetId });
    }
  };

  useEffect(() => {
    if (isOpen) {
      setNewBranchId('');
      setError('');
      // Default to 'branch' unless there are no branches, then maybe handle differently
      setAssignmentType('branch');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentBranchDisplay = user?.branchName 
    ? `${user.branchName}`
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
          {/* Header */}
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

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* User Info Context */}
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {t('userManagementPage.assignBranchModal.assigningTo')}{' '}
                <strong className="text-gray-900 dark:text-white">{user?.fullName}</strong>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t('userManagementPage.assignBranchModal.currentBranch')}:{' '}
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  {currentBranchDisplay}
                </span>
              </p>
            </div>

            {/* --- ASSIGNMENT TYPE SELECTION --- */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('userManagementPage.assignBranchModal.selectDestinationType')}
              </label>
              
              <div className="grid grid-cols-2 gap-3">
                {/* Option 1: Branch */}
                <button
                  type="button"
                  onClick={() => {
                    setAssignmentType('branch');
                    setError('');
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
                    assignmentType === 'branch'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700'
                  }`}
                >
                  <Store className="h-6 w-6 mb-2" />
                  <span className="text-sm font-medium">{t('userManagementPage.assignBranchModal.groupBranches')}</span>
                </button>

                {/* Option 2: Restaurant (Only show if eligible) */}
                {isCurrentlyInBranch ? (
                  <button
                    type="button"
                    onClick={() => {
                      setAssignmentType('restaurant');
                      setError('');
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
                      assignmentType === 'restaurant'
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                        : 'border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-700'
                    }`}
                  >
                    <Building className="h-6 w-6 mb-2" />
                    <span className="text-sm font-medium">{t('userManagementPage.assignBranchModal.assignToRestaurant')}</span>
                  </button>
                ) : (
                   /* Placeholder if user is already at restaurant and option is disabled */
                   <div className="flex flex-col items-center justify-center p-3 rounded-lg border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 opacity-50 cursor-not-allowed">
                      <Building className="h-6 w-6 mb-2 text-gray-400" />
                      <span className="text-sm text-gray-400 text-center">{t('userManagementPage.assignBranchModal.alreadyAtRestaurant')}</span>
                   </div>
                )}
              </div>
            </div>

            {/* --- DYNAMIC CONTENT AREA --- */}
            <div>
              {/* CONTENT 1: Branch Dropdown */}
              {assignmentType === 'branch' && (
                <div className="animate-fadeIn">
                  <label
                    htmlFor="branchId"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    {t('userManagementPage.assignBranchModal.selectBranch')} <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="branchId"
                    value={newBranchId}
                    onChange={(e) => setNewBranchId(e.target.value)}
                    className={`w-full rounded-lg dark:text-white border px-4 py-2 dark:bg-gray-700 bg-white ${
                      error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <option value="" disabled>
                      {t('userManagementPage.assignBranchModal.selectBranchPlaceholder')}
                    </option>
                    {availableBranches.map((branch) => (
                      <option key={branch.branchId} value={branch.branchId}>
                        {branch.branchName}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* CONTENT 2: Restaurant Static Message */}
              {assignmentType === 'restaurant' && (
                <div className="animate-fadeIn bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-green-900 dark:text-green-300">
                      {t('userManagementPage.assignBranchModal.confirmRestaurantTitle')}
                    </h4>
                    <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                      {t('userManagementPage.assignBranchModal.confirmRestaurantDesc', { name: user?.fullName })}
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end space-x-4 pt-2 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                {t('userManagementPage.createRole.cancel')}
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm disabled:opacity-50 transition-colors"
              >
                {isLoading
                  ? t('userManagementPage.assignBranchModal.submitButtonLoading')
                  : t('userManagementPage.assignBranchModal.submitButton')}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AssignBranchModal;