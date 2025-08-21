import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { BranchData, CreateBranchWithDetailsDto } from '../../../../types/api';
import { useLanguage } from '../../../../contexts/LanguageContext';
import BranchHeader from './BranchHeader';
import BranchInfo from './BranchInfo';
import { branchService } from '../../../../services/Branch/BracnhService';
import BranchWorkingHours from './BranchWorkingHours';

export interface EditDataType {
  branchName: string;
  whatsappOrderNumber: string;
  email: string;
  createAddressDto: {
    country: string;
    city: string;
    street: string;
    zipCode: string;
    addressLine1: string;
  };
  createContactDto: {
    phone: string;
    mail: string;
  };
  createBranchWorkingHourCoreDto: Array<{
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
    isWorkingDay: boolean;
  }>;
}

const BranchManagementBranch: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [branches, setBranches] = useState<BranchData[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<BranchData | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [editData, setEditData] = useState<EditDataType>({
    branchName: '',
    whatsappOrderNumber: '',
    email: '',
    createAddressDto: {
      country: '',
      city: '',
      street: '',
      zipCode: '',
      addressLine1: '',
    },
    createContactDto: {
      phone: '',
      mail: '',
    },
    createBranchWorkingHourCoreDto: [],
  });
  console.log("selectedBranch",selectedBranch)

  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError('');
      const data: BranchData[] = await branchService.getBranches();
      setBranches(data);
      if (data.length > 0) {
        console.log("data", data)
        setSelectedBranch(data[0]);
        initializeEditData(data[0]);
      }
    } catch (err: any) {
      setError(err.message || t('branchManagementBranch.messages.loadError'));
    } finally {
      setIsLoading(false);
    }
  };

  const initializeEditData = (branch: BranchData): void => {
    setEditData({
      branchName: branch.branchName || '',
      whatsappOrderNumber: branch.whatsappOrderNumber || '',
      email: branch.email || '',
      createAddressDto: {
        country: branch.createAddressDto?.country || '',
        city: branch.createAddressDto?.city || '',
        street: branch.createAddressDto?.street || '',
        zipCode: branch.createAddressDto?.zipCode || '',
        addressLine1: branch.createAddressDto?.addressLine1 || '',
      },
      createContactDto: {
        phone: branch.whatsappOrderNumber || '',
        mail: branch.email || '',
      },
      createBranchWorkingHourCoreDto: branch.workingHours
        ? branch.workingHours.map((hour) => ({
            dayOfWeek: hour.dayOfWeek,
            openTime: hour.openTime,
            closeTime: hour.closeTime,
            isWorkingDay: hour.isWorkingDay,
          }))
        : [
            { dayOfWeek: 1, openTime: '09:00', closeTime: '22:00', isWorkingDay: true },
            { dayOfWeek: 2, openTime: '09:00', closeTime: '22:00', isWorkingDay: true },
            { dayOfWeek: 3, openTime: '09:00', closeTime: '22:00', isWorkingDay: true },
            { dayOfWeek: 4, openTime: '09:00', closeTime: '22:00', isWorkingDay: true },
            { dayOfWeek: 5, openTime: '09:00', closeTime: '22:00', isWorkingDay: true },
            { dayOfWeek: 6, openTime: '09:00', closeTime: '22:00', isWorkingDay: true },
            { dayOfWeek: 0, openTime: '09:00', closeTime: '22:00', isWorkingDay: true },
          ],
    });
  };

  const handleSave = async (): Promise<void> => {
    if (!selectedBranch) return;
    try {
      setIsLoading(true);
      setError('');
      const updateData: Partial<CreateBranchWithDetailsDto> = editData;
      await branchService.updateBranch(selectedBranch.id, updateData);
      setSuccess(t('branchManagementBranch.messages.updateSuccess'));
      setIsEditing(false);
      await loadBranches();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || t('branchManagementBranch.messages.updateError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!selectedBranch) return;
    try {
      setIsLoading(true);
      setError('');
      await branchService.deleteBranch(selectedBranch.id);
      setSuccess(t('branchManagementBranch.messages.deleteSuccess'));
      await loadBranches();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || t('branchManagementBranch.messages.deleteError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTemporaryClose = async (): Promise<void> => {
    if (!selectedBranch) return;
    try {
      setIsLoading(true);
      setError('');
      const newStatus: boolean = !selectedBranch.isTemporarilyClosed;
      await branchService.toggleTemporaryClose(selectedBranch.id, newStatus, selectedBranch.isOpenNow);
      const message = newStatus
        ? t('branchManagementBranch.messages.temporaryCloseSuccess')
        : t('branchManagementBranch.messages.reopenSuccess');
      setSuccess(message);
      await loadBranches();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || t('branchManagementBranch.messages.statusChangeError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (path: string, value: string): void => {
    setEditData((prev) => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current: any = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const handleWorkingHourChange = (dayOfWeek: number, field: string, value: string | boolean): void => {
    setEditData((prev) => ({
      ...prev,
      createBranchWorkingHourCoreDto: prev.createBranchWorkingHourCoreDto.map((hour) =>
        hour.dayOfWeek === dayOfWeek ? { ...hour, [field]: value } : hour
      ),
    }));
  };

  if (isLoading && !selectedBranch) {
    return (
      <div className="flex items-center justify-center min-h-64 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {t('branchManagementBranch.loading')}
          </span>
        </div>
      </div>
    );
  }

  if (!selectedBranch) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-900">
        <div className="text-lg text-gray-500">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 mx-auto mb-3 text-gray-500 dark:text-gray-400">
            <path d="M12 2L2 7h20l-10-5zm0 0v20m-7-7h14"></path>
          </svg>
          <p className="text-lg font-medium">{t('branchManagementBranch.noBranchFound')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 border rounded-xl flex items-center transition-all duration-300">
            <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400 mr-3 flex-shrink-0" />
            <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 border rounded-xl flex items-center transition-all duration-300">
            <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400 mr-3 flex-shrink-0" />
            <p className="text-green-700 dark:text-green-300 font-medium">{success}</p>
          </div>
        )}
        <BranchHeader
          selectedBranch={selectedBranch}
          isEditing={isEditing}
          isLoading={isLoading}
          t={t}
          isRTL={isRTL}
          setIsEditing={setIsEditing}
          handleToggleTemporaryClose={handleToggleTemporaryClose}
          handleSave={handleSave}
          initializeEditData={initializeEditData}
        />
        <BranchInfo
          selectedBranch={selectedBranch}
          isEditing={isEditing}
          editData={editData}
          t={t}
          handleInputChange={handleInputChange}
        />
        <BranchWorkingHours
          selectedBranch={selectedBranch}
          isEditing={isEditing}
          editData={editData}
          t={t}
          handleWorkingHourChange={handleWorkingHourChange}
        />
      </div>
    </div>
  );
};

export default BranchManagementBranch;