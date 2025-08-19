import React from 'react';
import { Calendar, Clock, X } from 'lucide-react';
import { BranchData } from '../../../../types/api';
import { EditDataType } from './BranchManagement';

interface BranchWorkingHoursProps {
  selectedBranch: BranchData | null;
  isEditing: boolean;
  editData: EditDataType;
  t: (key: string) => string;
  handleWorkingHourChange: (dayOfWeek: number, field: string, value: string | boolean) => void;
}

const BranchWorkingHours: React.FC<BranchWorkingHoursProps> = ({
  selectedBranch,
  isEditing,
  editData,
  t,
  handleWorkingHourChange,
}) => {
  // Format time for display (remove seconds if present)
  const formatTime = (time: string) => {
    return time.substring(0, 5); // Takes only HH:MM part
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-2xl">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100 flex items-center">
          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 mr-4 shadow-lg">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          {t('branchManagementBranch.workingHours.title')}
        </h2>
        
        {isEditing ? (
          <div className="space-y-4">
            {editData.createBranchWorkingHourCoreDto?.map((hour) => (
              <div
                key={hour.dayOfWeek}
                className={`p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                  hour.isWorkingDay
                    ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-700'
                    : 'bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-700'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-xl text-slate-800 dark:text-slate-100">
                    {t(`branchManagementBranch.workingHours.days.${hour.dayOfWeek}`)}
                  </span>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hour.isWorkingDay}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleWorkingHourChange(hour.dayOfWeek, 'isWorkingDay', e.target.checked)
                      }
                      className="w-5 h-5 text-emerald-600 border-slate-300 dark:border-slate-600 rounded focus:ring-emerald-500 focus:ring-2 bg-white dark:bg-slate-700 transition-colors duration-200"
                    />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {t('branchManagementBranch.workingHours.workingDay')}
                    </span>
                  </label>
                </div>
                
                {hour.isWorkingDay ? (
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                        {t('branchManagementBranch.workingHours.openTime')}
                      </label>
                      <input
                        title="openTime"
                        type="time"
                        value={hour.openTime}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleWorkingHourChange(hour.dayOfWeek, 'openTime', e.target.value)
                        }
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                        {t('branchManagementBranch.workingHours.closeTime')}
                      </label>
                      <input
                        title="closeTime"
                        type="time"
                        value={hour.closeTime}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleWorkingHourChange(hour.dayOfWeek, 'closeTime', e.target.value)
                        }
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="flex items-center justify-center space-x-2 text-red-600 dark:text-red-400">
                      <X className="w-6 h-6" />
                      <span className="text-lg font-bold">
                        {t('branchManagementBranch.status.closed')}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          selectedBranch?.workingHours && selectedBranch.workingHours.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {selectedBranch.workingHours.map((hour) => (
                <div
                  key={hour.dayOfWeek}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg transform hover:scale-105 ${
                    hour.isWorkingDay
                      ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-700'
                      : 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-700'
                  }`}
                >
                  <div className="font-bold text-slate-800 dark:text-slate-100 mb-3 text-center text-lg">
                    {t(`branchManagementBranch.workingHours.days.${hour.dayOfWeek}`)}
                  </div>
                  
                  {hour.isWorkingDay ? (
                    <div className="text-sm text-slate-700 dark:text-slate-300 flex items-center justify-center">
                      <Clock className="w-4 h-4 mr-2 text-emerald-500" />
                      <span className="font-semibold">
                        {formatTime(hour.openTime)} - {formatTime(hour.closeTime)}
                      </span>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2 text-red-600 dark:text-red-400">
                        <X className="w-4 h-4" />
                        <span className="text-sm font-bold">
                          {t('branchManagementBranch.status.closed')}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-700 rounded-xl">
              <Clock className="w-16 h-16 mx-auto mb-4 text-slate-400 dark:text-slate-500" />
              <p className="text-xl font-semibold text-slate-600 dark:text-slate-400">
                {t('branchManagementBranch.workingHours.noWorkingHours')}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default BranchWorkingHours;