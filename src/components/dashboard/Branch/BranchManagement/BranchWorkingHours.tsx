import React from 'react';
import { Calendar, Clock } from 'lucide-react';
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
}) => (
  <div className="rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl">
    <div className="p-6">
      <h2 className="text-xl font-bold mb-6 dark:text-white text-gray-900 flex items-center">
        <div className="p-2 rounded-lg bg-green-100 mr-3">
          <Calendar className="w-5 h-5 text-green-600" />
        </div>
        {t('branchManagementBranch.workingHours.title')}
      </h2>
      {isEditing ? (
        <div className="space-y-4">
          {editData.createBranchWorkingHourCoreDto?.map((hour) => (
            <div
              key={hour.dayOfWeek}
              className="bg-gray-50 border-gray-200 p-5 rounded-xl border transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-lg text-gray-800">
                  {t(`branchManagementBranch.workingHours.days.${hour.dayOfWeek}`)}
                </span>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={hour.isWorkingDay}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleWorkingHourChange(hour.dayOfWeek, 'isWorkingDay', e.target.checked)
                    }
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-gray-600">
                    {t('branchManagementBranch.workingHours.workingDay')}
                  </span>
                </label>
              </div>
              {hour.isWorkingDay && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('branchManagementBranch.workingHours.openTime')}
                    </label>
                    <input
                      title="openTime"
                      type="time"
                      value={hour.openTime}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleWorkingHourChange(hour.dayOfWeek, 'openTime', e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('branchManagementBranch.workingHours.closeTime')}
                    </label>
                    <input
                      title="closeTime"
                      type="time"
                      value={hour.closeTime}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleWorkingHourChange(hour.dayOfWeek, 'closeTime', e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>
              )}
              {!hour.isWorkingDay && (
                <div className="text-center py-4">
                  <span className="text-red-500 text-lg font-semibold">
                    {t('branchManagementBranch.status.closed')}
                  </span>
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
                className="bg-gray-50 border-gray-200 p-4 rounded-xl border transition-all duration-300 hover:shadow-lg transform hover:scale-105"
              >
                <div className="font-semibold text-gray-800 mb-3 text-center">
                  {t(`branchManagementBranch.workingHours.days.${hour.dayOfWeek}`)}
                </div>
                <div className="text-sm text-gray-600 flex items-center justify-center">
                  <Clock className="w-4 h-4 mr-2 text-green-500" />
                  <span className="font-medium">
                    {hour.openTime} - {hour.closeTime}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium">{t('branchManagementBranch.workingHours.noWorkingHours')}</p>
          </div>
        )
      )}
    </div>
  </div>
);

export default BranchWorkingHours;