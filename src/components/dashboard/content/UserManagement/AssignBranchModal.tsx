import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { AssignBranchDto, UserData } from '../../../../types/api';
import { useLanguage } from '../../../../contexts/LanguageContext';


export interface AssignBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, branchData: AssignBranchDto) => Promise<void>;
  user: UserData | null;
  isLoading: boolean;
}

const AssignBranchModal: React.FC<AssignBranchModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  user,
  isLoading,
}) => {
  const { t } = useLanguage();
  const [newBranchId, setNewBranchId] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const branchIdNum = parseInt(newBranchId, 10);
    if (!branchIdNum || branchIdNum <= 0) {
      setError('Please enter a valid Branch ID.');
      return;
    }
    if (!user) return;
    
    setError('');
    onSubmit(user.id, { newBranchId: branchIdNum });
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
          className="relative w-full max-w-md rounded-xl bg-white dark:bg-gray-800 shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
              Assign New Branch
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Assigning <strong className="text-gray-900 dark:text-white">{user?.fullName}</strong> to a new branch.
            </p>
             <p className="text-sm text-gray-500 dark:text-gray-400">
              Current Branch: {user?.branchName} (ID: {user?.branchId})
            </p>
            <div>
              <label htmlFor="branchId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                New Branch ID <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="branchId"
                min="1"
                value={newBranchId}
                onChange={(e) => setNewBranchId(e.target.value)}
                className={`w-full rounded-lg border px-4 py-2 dark:bg-gray-700 ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                placeholder="Enter new Branch ID"
              />
               {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
            </div>
            
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('userManagementPage.createRole.cancel')}
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm disabled:opacity-50"
              >
                {isLoading ? 'Assigning...' : 'Assign Branch'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AssignBranchModal;