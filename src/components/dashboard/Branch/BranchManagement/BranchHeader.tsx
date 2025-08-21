import React from 'react';
import { Edit, Eye, EyeOff, MapPin, Save, X, ToggleRight, ToggleLeft, Loader2 } from 'lucide-react';
import { BranchData } from '../../../../types/api';

interface BranchHeaderProps {
  selectedBranch: BranchData | null;
  isEditing: boolean;
  isLoading: boolean;
  t: (key: string) => string;
  isRTL: boolean;
  setIsEditing: (editing: boolean) => void;
  handleToggleTemporaryClose: () => Promise<void>;
  handleSave: () => Promise<void>;
  initializeEditData: (branch: BranchData) => void;
}

const BranchHeader: React.FC<BranchHeaderProps> = ({
  selectedBranch,
  isEditing,
  isLoading,
  t,
  isRTL,
  setIsEditing,
  handleToggleTemporaryClose,
  handleSave,
  initializeEditData,
}) => {
  // Toggle Switch Component
  const ToggleSwitch = ({ 
    checked, 
    onChange, 
    disabled 
  }: { 
    checked: boolean; 
    onChange: () => void; 
    disabled?: boolean; 
  }) => (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''} transition-all duration-200 hover:opacity-80 disabled:cursor-not-allowed`}
    >
      {disabled ? (
        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
      ) : checked ? (
        <ToggleRight className="h-10 w-10 text-green-500" />
      ) : (
        <ToggleLeft className="h-10 w-10 text-red-500" />
      )}
      <span className={`text-xs font-medium ${checked ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
        {checked 
          ? t('branchManagementBranch.status.open') || 'نشط'
          : t('branchManagementBranch.status.temporarilyClosed') || 'مغلق مؤقتاً'
        }
      </span>
    </button>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 mb-6">
      <div className="p-6">
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          {/* Title Section */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900">
                <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t('branchManagementBranch.title')}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t('branchManagementBranch.description')}
                </p>
              </div>
            </div>
            
            {/* Status Badge */}
            {selectedBranch && (
              <div
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  selectedBranch.isTemporarilyClosed
                    ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                    : selectedBranch.isOpenNow
                    ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                    : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                }`}
              >
                {selectedBranch.isTemporarilyClosed
                  ? t('branchManagementBranch.status.temporarilyClosed')
                  : selectedBranch.isOpenNow
                  ? t('branchManagementBranch.status.open')
                  : t('branchManagementBranch.status.open')}
              </div>
            )}
          </div>
          
          {/* Controls Section */}
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4 rtl:space-x-reverse">
            {/* Temporary Close Toggle */}
            {selectedBranch && (
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                 
                </span>
                <ToggleSwitch
                  checked={!selectedBranch.isTemporarilyClosed}
                  onChange={handleToggleTemporaryClose}
                  disabled={isLoading}
                />
              </div>
            )}

            {/* Edit/Save/Cancel Buttons */}
            <div className="flex space-x-2 rtl:space-x-reverse">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105"
                >
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Edit className="w-4 h-4" />
                    <span>{t('branchManagementBranch.actions.edit')}</span>
                  </div>
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-green-500/25 transform hover:scale-105"
                  >
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Save className="w-4 h-4" />
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      if (selectedBranch) initializeEditData(selectedBranch);
                    }}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-all duration-300 shadow-lg transform hover:scale-105"
                  >
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <X className="w-4 h-4" />
                      <span>{t('branchManagementBranch.actions.cancel')}</span>
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchHeader;