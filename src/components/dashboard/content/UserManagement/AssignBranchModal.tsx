import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Building, Store, CheckCircle2, X, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { AssignBranchDto, UserData } from '../../../../types/users/users.type';
import { BranchInfo } from '../../../../types/api';
import { CustomSelect } from '../../../common/CustomSelect';

export interface AssignBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, branchData: AssignBranchDto) => Promise<void>;
  user: UserData | null;
  isLoading: boolean;
  branches: BranchInfo[];
}

type AssignmentType = 'branch' | 'restaurant';

// --- Custom Select Component ---
interface SelectOption {
  value: string;
  label: string;
}



const AssignBranchModal: React.FC<AssignBranchModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  user,
  isLoading,
  branches,
}) => {
  const { t, isRTL } = useLanguage();
  
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
      // Default to 'branch' unless there are no branches
      setAssignmentType('branch');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentBranchDisplay = user?.branchName 
    ? `${user.branchName}`
    : t('userManagementPage.assignBranchModal.assignedToRestaurant');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden z-10"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
                  {t('userManagementPage.assignBranchModal.title')}
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                
                {/* User Info Context */}
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {t('userManagementPage.assignBranchModal.assigningTo')}{' '}
                    <strong className="text-gray-900 dark:text-white block sm:inline mt-1 sm:mt-0">{user?.fullName}</strong>
                  </p>
                  <div className="h-px bg-gray-200 dark:bg-gray-600 my-2"></div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
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
                  
                  {/* Grid becomes 1 column on mobile, 2 columns on small screens and up */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Option 1: Branch */}
                    <button
                      type="button"
                      onClick={() => {
                        setAssignmentType('branch');
                        setError('');
                      }}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-200 ${
                        assignmentType === 'branch'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-sm'
                          : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <Store className={`h-6 w-6 mb-2 ${assignmentType === 'branch' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span className="text-sm font-medium text-center">{t('userManagementPage.assignBranchModal.groupBranches')}</span>
                    </button>

                    {/* Option 2: Restaurant (Only show if eligible) */}
                    {isCurrentlyInBranch ? (
                      <button
                        type="button"
                        onClick={() => {
                          setAssignmentType('restaurant');
                          setError('');
                        }}
                        className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-200 ${
                          assignmentType === 'restaurant'
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 shadow-sm'
                            : 'border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        }`}
                      >
                        <Building className={`h-6 w-6 mb-2 ${assignmentType === 'restaurant' ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`} />
                        <span className="text-sm font-medium text-center">{t('userManagementPage.assignBranchModal.assignToRestaurant')}</span>
                      </button>
                    ) : (
                       /* Placeholder if user is already at restaurant and option is disabled */
                       <div className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 opacity-60 cursor-not-allowed">
                          <Building className="h-6 w-6 mb-2 text-gray-400" />
                          <span className="text-sm text-gray-400 text-center">{t('userManagementPage.assignBranchModal.alreadyAtRestaurant')}</span>
                       </div>
                    )}
                  </div>
                </div>

                {/* --- DYNAMIC CONTENT AREA --- */}
                <div className="min-h-[100px]">
                  {/* CONTENT 1: Branch Dropdown (New Custom Select) */}
                  {assignmentType === 'branch' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-2"
                    >
                      <label
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        {t('userManagementPage.assignBranchModal.selectBranch')} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative z-20">
                        <CustomSelect
                          value={newBranchId}
                          onChange={(val) => {
                            setNewBranchId(String(val));
                            setError('');
                          }}
                          options={availableBranches.map(b => ({
                            value: b.branchId.toString(),
                            label: b.branchName
                          }))}
                          placeholder={t('userManagementPage.assignBranchModal.selectBranchPlaceholder')}
                          error={!!error}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* CONTENT 2: Restaurant Static Message */}
                  {assignmentType === 'restaurant' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start gap-3"
                    >
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium text-green-900 dark:text-green-300">
                          {t('userManagementPage.assignBranchModal.confirmRestaurantTitle')}
                        </h4>
                        <p className="text-xs text-green-700 dark:text-green-400 mt-1 leading-relaxed">
                          {t('userManagementPage.assignBranchModal.confirmRestaurantDesc', { name: user?.fullName })}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block"></span>
                      {error}
                    </motion.div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isLoading}
                    className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {t('userManagementPage.createRole.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full sm:w-auto px-6 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex justify-center items-center gap-2"
                  >
                    {isLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                    <span>{isLoading
                      ? t('userManagementPage.assignBranchModal.submitButtonLoading')
                      : t('userManagementPage.assignBranchModal.submitButton')}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AssignBranchModal;