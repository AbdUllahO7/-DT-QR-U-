import React from 'react';
import { Calendar, Clock, X, Plus, Trash2 } from 'lucide-react';
import { BranchData, EditDataType } from '../../../../types/BranchManagement/type';

interface BranchWorkingHoursProps {
  selectedBranch: BranchData | null;
  isEditing: boolean;
  editData: EditDataType;
  t: (key: string) => string;
  handleWorkingHourChange: (dayOfWeek: number, field: string, value: string | boolean) => void;
  handleTimeSlotChange?: (dayOfWeek: number, slotIndex: number, field: 'openTime' | 'closeTime', value: string) => void;
  handleAddTimeSlot?: (dayOfWeek: number) => void;
  handleRemoveTimeSlot?: (dayOfWeek: number, slotIndex: number) => void;
}

const BranchWorkingHours: React.FC<BranchWorkingHoursProps> = ({
  selectedBranch,
  isEditing,
  editData,
  t,
  handleWorkingHourChange,
  handleTimeSlotChange,
  handleAddTimeSlot,
  handleRemoveTimeSlot,
}) => {
  // Format time for display (remove seconds if present)
  const formatTime = (time: string) => {
    if (!time) return '';
    return time.substring(0, 5); // Takes only HH:MM part
  };

  // Format time slots for display
  const formatTimeSlots = (timeSlots: { openTime: string; closeTime: string }[] | undefined) => {
    if (!timeSlots || timeSlots.length === 0) return '';
    return timeSlots.map(slot => `${formatTime(slot.openTime)} - ${formatTime(slot.closeTime)}`).join(', ');
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
                    ? hour.isOpen24Hours
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700'
                      : 'bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-700'
                    : 'bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/20 dark:to-slate-800/20 border-slate-200 dark:border-slate-700 opacity-75'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-xl text-slate-800 dark:text-slate-100">
                    {t(`branchManagementBranch.workingHours.days.${hour.dayOfWeek}`)}
                  </span>
                  <div className="flex items-center space-x-4">
                    {hour.isWorkingDay && (
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hour.isOpen24Hours}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleWorkingHourChange(hour.dayOfWeek, 'isOpen24Hours', e.target.checked)
                          }
                          className="w-5 h-5 text-blue-600 border-slate-300 dark:border-slate-600 rounded focus:ring-blue-500 focus:ring-2 bg-white dark:bg-slate-700 transition-colors duration-200"
                        />
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {t('branchManagementBranch.workingHours.open24Hours') || '24 Hours'}
                        </span>
                      </label>
                    )}
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
                </div>

                {/* Show 24 hours message when enabled */}
                {hour.isWorkingDay && hour.isOpen24Hours && (
                  <div className="text-center py-4">
                    <div className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-lg">
                      <Clock className="w-5 h-5" />
                      <span className="font-semibold">
                        {t('branchManagementBranch.workingHours.open24HoursMessage') || 'Open 24 hours'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Show time slots when working day and not 24 hours */}
                {hour.isWorkingDay && !hour.isOpen24Hours && (
                  <div className="space-y-4">
                    {hour.timeSlots?.map((slot, slotIndex) => (
                      <div key={slotIndex} className="flex items-center gap-4">
                        <div className="grid grid-cols-2 gap-6 flex-1">
                          <div>
                            <label className="block text-sm font-bold mb-3 text-slate-700 dark:text-slate-300">
                              {t('branchManagementBranch.workingHours.openTime')}
                            </label>
                            <input
                              title="openTime"
                              type="time"
                              value={formatTime(slot.openTime)}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleTimeSlotChange?.(hour.dayOfWeek, slotIndex, 'openTime', e.target.value + ':00')
                              }
                              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 shadow-sm hover:shadow-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-emerald-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold mb-3 text-slate-700 dark:text-slate-300">
                              {t('branchManagementBranch.workingHours.closeTime')}
                            </label>
                            <input
                              title="closeTime"
                              type="time"
                              value={formatTime(slot.closeTime)}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleTimeSlotChange?.(hour.dayOfWeek, slotIndex, 'closeTime', e.target.value + ':00')
                              }
                              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 shadow-sm hover:shadow-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-emerald-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        {(hour.timeSlots?.length || 0) > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveTimeSlot?.(hour.dayOfWeek, slotIndex)}
                            className="mt-8 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title={t('common.remove') || 'Remove'}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => handleAddTimeSlot?.(hour.dayOfWeek)}
                      className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold text-sm transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{t('branchManagementBranch.workingHours.addTimeSlot') || 'Add Time Slot'}</span>
                    </button>
                  </div>
                )}

                {/* Show status indicator when not a working day */}
                {!hour.isWorkingDay && (
                  <div className="mt-4 text-center">
                    <div className="flex items-center justify-center space-x-2 text-slate-500 dark:text-slate-500">
                      <X className="w-4 h-4" />
                      <span className="text-sm font-semibold">
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
                      ? hour.isOpen24Hours
                        ? 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700'
                        : 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-700'
                      : 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-700'
                  }`}
                >
                  <div className="font-bold text-slate-800 dark:text-slate-100 mb-3 text-center text-lg">
                    {t(`branchManagementBranch.workingHours.days.${hour.dayOfWeek}`)}
                  </div>

                  {hour.isWorkingDay ? (
                    hour.isOpen24Hours ? (
                      <div className="text-center">
                        <div className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                          <Clock className="w-4 h-4" />
                          <span className="font-semibold text-sm">
                            {t('branchManagementBranch.workingHours.open24HoursMessage') || '24 Hours'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-slate-700 dark:text-slate-300">
                        {hour.timeSlots && hour.timeSlots.length > 0 ? (
                          <div className="space-y-1">
                            {hour.timeSlots.map((slot, idx) => (
                              <div key={idx} className="flex items-center justify-center">
                                <Clock className="w-4 h-4 mr-2 text-emerald-500" />
                                <span className="font-semibold">
                                  {formatTime(slot.openTime)} - {formatTime(slot.closeTime)}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <Clock className="w-4 h-4 mr-2 text-emerald-500" />
                            <span className="font-semibold">
                              {formatTime((hour as any).openTime || '')} - {formatTime((hour as any).closeTime || '')}
                            </span>
                          </div>
                        )}
                      </div>
                    )
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
