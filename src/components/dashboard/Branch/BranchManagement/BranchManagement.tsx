import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { CreateBranchWithDetailsDto } from '../../../../types/api';
import { useLanguage } from '../../../../contexts/LanguageContext';
import BranchHeader from './BranchHeader';
import BranchInfo from './BranchInfo';
import { branchService } from '../../../../services/Branch/BranchService';
import BranchWorkingHours from './BranchWorkingHours';
import { BranchData, EditDataType } from '../../../../types/BranchManagement/type';

// --- ADDED: Countries Data ---
export const countries = [
  { name: 'TR', code: '+90' },
  { name: 'US', code: '+1' },
  { name: 'GB', code: '+44' },
  { name: 'DE', code: '+49' },
  { name: 'FR', code: '+33' },
  { name: 'ES', code: '+34' },
  { name: 'IT', code: '+39' },
  { name: 'NL', code: '+31' },
  { name: 'GR', code: '+30' },
  { name: 'JP', code: '+81' },
  { name: 'KR', code: '+82' },
  { name: 'CN', code: '+86' },
  { name: 'IN', code: '+91' },
  { name: 'BR', code: '+55' },
  { name: 'RU', code: '+7' },
  { name: 'AU', code: '+61' },
  { name: 'CA', code: '+1' },
  { name: 'MX', code: '+52' },
  { name: 'AR', code: '+54' },
  { name: 'ZA', code: '+27' },
  { name: 'EG', code: '+20' },
  { name: 'SA', code: '+966' },
  { name: 'AE', code: '+971' },
  { name: 'AT', code: '+43' },
  { name: 'BE', code: '+32' },
  { name: 'SE', code: '+46' },
  { name: 'NO', code: '+47' },
  { name: 'DK', code: '+45' },
  { name: 'PL', code: '+48' },
  { name: 'PT', code: '+351' },
  { name: 'IE', code: '+353' },
  { name: 'UA', code: '+380' },
  { name: 'CZ', code: '+420' },
  { name: 'HU', code: '+36' },
  { name: 'RO', code: '+40' },
];

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
    branchLogoPath: '',
    createAddressDto: {
      country: '',
      city: '',
      street: '',
      zipCode: '',
      addressLine1: '',
      addressLine2: '',
    },
    createContactDto: {
      phone: '',
      mail: '',
      location: '',
      contactHeader: '',
      footerTitle: '',
      footerDescription: '',
      openTitle: '',
      openDays: '',
      openHours: '',
    },
    createBranchWorkingHourCoreDto: [],
  });

  useEffect(() => {
    loadBranches();
  }, []);

  // --- ADDED: Helper to parse full phone number into code and local number ---
  const getPhoneParts = (fullNumber: string | null) => {
    if (!fullNumber) return { code: '+90', number: '' }; // Default to TR if empty
    
    // Sort countries by code length desc to match longest prefix first
    const sortedCountries = [...countries].sort((a, b) => b.code.length - a.code.length);
    const country = sortedCountries.find(c => fullNumber.startsWith(c.code));
    
    if (country) {
      return {
        code: country.code,
        number: fullNumber.slice(country.code.length)
      };
    }
    
    return { code: '+90', number: fullNumber };
  };

  const loadBranches = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError('');
      const data: BranchData[] = await branchService.getBranches();
      setBranches(data);
      if (data.length > 0) {
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
      branchLogoPath: branch.branchLogoPath || '',
      createAddressDto: {
        country: branch.createAddressDto?.country || '',
        city: branch.createAddressDto?.city || '',
        street: branch.createAddressDto?.street || '',
        zipCode: branch.createAddressDto?.zipCode || '',
        addressLine1: branch.createAddressDto?.addressLine1 || '',
        addressLine2: branch.createAddressDto?.addressLine2 || '',
      },
      createContactDto: {
        phone: branch.createContactDto?.phone || '', // Fixed: was reading from whatsappOrderNumber in your original code, standardized to contact phone
        mail: branch.email || '',
        location: branch?.createContactDto?.location || '',
        contactHeader: branch?.createContactDto?.contactHeader || '',
        footerTitle: branch?.createContactDto?.footerTitle || '',
        footerDescription: branch?.createContactDto?.footerDescription || '',
        openTitle: branch?.createContactDto?.openTitle || '',
        openDays: branch?.createContactDto?.openDays || '',
        openHours: branch?.createContactDto?.openHours || '',
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
      const updateData: Partial<CreateBranchWithDetailsDto> = {
        ...editData,
        branchLogoPath: editData.branchLogoPath,
      };
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

  // --- ADDED: Handler for Country Code + Phone Number updates ---
  const handlePhoneCompositeChange = (
    fullFieldName: string, 
    currentFullValue: string, 
    partType: 'code' | 'number', 
    newValue: string
  ) => {
    const { code, number } = getPhoneParts(currentFullValue);
    
    let newFullNumber = '';
    
    if (partType === 'code') {
      newFullNumber = newValue + number;
    } else {
      newFullNumber = code + newValue;
    }

    handleInputChange(fullFieldName, newFullNumber);
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
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-12 h-12 mx-auto mb-3 text-gray-500 dark:text-gray-400"
          >
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
          setEditData={setEditData} 
        />
        
        {/* --- MODIFIED: Passing new phone handling props to BranchInfo --- */}
        <BranchInfo
          selectedBranch={selectedBranch}
          isEditing={isEditing}
          editData={editData}
          t={t}
          handleInputChange={handleInputChange}
          // Pass these new props:
          countries={countries}
          getPhoneParts={getPhoneParts}
          handlePhoneCompositeChange={handlePhoneCompositeChange}
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