import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Save, X, Clock, Phone, Mail, MapPin, Calendar, AlertTriangle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { BranchData, CreateBranchWithDetailsDto } from '../../../../types/api';
import { branchService } from '../../../../services/Branch/BracnhService';
import { useLanguage } from '../../../../contexts/LanguageContext';

interface EditDataType {
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
      addressLine1: ''
    },
    createContactDto: {
      phone: '',
      mail: ''
    },
    createBranchWorkingHourCoreDto: []
  });

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
        addressLine1: branch.createAddressDto?.addressLine1 || ''
      },
      createContactDto: {
        phone: branch.whatsappOrderNumber || '',
        mail: branch.email || ''
      },
      createBranchWorkingHourCoreDto: branch.workingHours ? branch.workingHours.map(hour => ({
        dayOfWeek: hour.dayOfWeek,
        openTime: hour.openTime,
        closeTime: hour.closeTime,
        isWorkingDay: true
      })) : [
        { dayOfWeek: 1, openTime: '09:00', closeTime: '22:00', isWorkingDay: true },
        { dayOfWeek: 2, openTime: '09:00', closeTime: '22:00', isWorkingDay: true },
        { dayOfWeek: 3, openTime: '09:00', closeTime: '22:00', isWorkingDay: true },
        { dayOfWeek: 4, openTime: '09:00', closeTime: '22:00', isWorkingDay: true },
        { dayOfWeek: 5, openTime: '09:00', closeTime: '22:00', isWorkingDay: true },
        { dayOfWeek: 6, openTime: '09:00', closeTime: '22:00', isWorkingDay: true },
        { dayOfWeek: 0, openTime: '09:00', closeTime: '22:00', isWorkingDay: true }
      ]
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
      await branchService.toggleTemporaryClose(
        selectedBranch.id,
        newStatus,
        selectedBranch.isOpenNow
      );
      
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
    setEditData(prev => {
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
    setEditData(prev => ({
      ...prev,
      createBranchWorkingHourCoreDto: prev.createBranchWorkingHourCoreDto.map(hour =>
        hour.dayOfWeek === dayOfWeek
          ? { ...hour, [field]: value }
          : hour
      )
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
        <div className="text-lg text-gray-500 dark:text-gray-400">
          {t('branchManagementBranch.noBranchFound')}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
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
                
                <div className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  selectedBranch.isTemporarilyClosed 
                    ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' 
                    : selectedBranch.isOpenNow 
                      ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                      : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                }`}>
                  {selectedBranch.isTemporarilyClosed 
                    ? t('branchManagementBranch.status.temporarilyClosed')
                    : selectedBranch.isOpenNow 
                      ? t('branchManagementBranch.status.open')
                      : t('branchManagementBranch.status.closed')
                  }
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleToggleTemporaryClose}
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    selectedBranch.isTemporarilyClosed
                      ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-green-500/25'
                      : 'bg-yellow-600 hover:bg-yellow-700 text-white shadow-lg hover:shadow-yellow-500/25'
                  } disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105`}
                >
                  {selectedBranch.isTemporarilyClosed ? (
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4" />
                      <span>{t('branchManagementBranch.status.reopenBranch')}</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <EyeOff className="w-4 h-4" />
                      <span>{t('branchManagementBranch.status.temporaryClose')}</span>
                    </div>
                  )}
                </button>
                
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105"
                  >
                    <div className="flex items-center space-x-2">
                      <Edit className="w-4 h-4" />
                      <span>{t('branchManagementBranch.actions.edit')}</span>
                    </div>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-green-500/25 transform hover:scale-105"
                    >
                      <div className="flex items-center space-x-2">
                        <Save className="w-4 h-4" />
                        <span>{t('branchManagementBranch.actions.save')}</span>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        initializeEditData(selectedBranch);
                      }}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-all duration-300 shadow-lg transform hover:scale-105"
                    >
                      <div className="flex items-center space-x-2">
                        <X className="w-4 h-4" />
                        <span>{t('branchManagementBranch.actions.cancel')}</span>
                      </div>
                    </button>
                  </div>
                )}
                
             
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Basic Information */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900 mr-3">
                  <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                {t('branchManagementBranch.basicInfo.title')}
              </h2>
              
              <div className="space-y-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {t('branchManagementBranch.basicInfo.branchName')}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.branchName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('branchName', e.target.value)}
                      placeholder={t('branchManagementBranch.placeholders.branchName')}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-400 dark:group-hover:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-gray-100 font-medium text-lg">
                      {selectedBranch.branchName}
                    </p>
                  )}
                </div>
                
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {t('branchManagementBranch.basicInfo.whatsappNumber')}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.whatsappOrderNumber}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('whatsappOrderNumber', e.target.value)}
                      placeholder={t('branchManagementBranch.placeholders.whatsappNumber')}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-400 dark:group-hover:border-blue-500"
                    />
                  ) : (
                    <div className="text-gray-900 dark:text-gray-100 font-medium text-lg flex items-center">
                      <Phone className="w-5 h-5 mr-2 text-green-500 dark:text-green-400" />
                      {selectedBranch.whatsappOrderNumber || t('branchManagementBranch.basicInfo.notSpecified')}
                    </div>
                  )}
                </div>
                
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {t('branchManagementBranch.basicInfo.email')}
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
                      placeholder={t('branchManagementBranch.placeholders.email')}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-400 dark:group-hover:border-blue-500"
                    />
                  ) : (
                    <div className="text-gray-900 dark:text-gray-100 font-medium text-lg flex items-center">
                      <Mail className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" />
                      {selectedBranch.email || t('branchManagementBranch.basicInfo.notSpecified')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900 mr-3">
                  <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                {t('branchManagementBranch.addressInfo.title')}
              </h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {t('branchManagementBranch.addressInfo.country')}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.createAddressDto?.country || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('createAddressDto.country', e.target.value)}
                        placeholder={t('branchManagementBranch.placeholders.country')}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-400 dark:group-hover:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-gray-100 font-medium">
                        {selectedBranch.createAddressDto?.country || t('branchManagementBranch.basicInfo.notSpecified')}
                      </p>
                    )}
                  </div>
                  
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {t('branchManagementBranch.addressInfo.city')}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.createAddressDto?.city || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('createAddressDto.city', e.target.value)}
                        placeholder={t('branchManagementBranch.placeholders.city')}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-400 dark:group-hover:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-gray-100 font-medium">
                        {selectedBranch.createAddressDto?.city || t('branchManagementBranch.basicInfo.notSpecified')}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {t('branchManagementBranch.addressInfo.street')}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.createAddressDto?.street || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('createAddressDto.street', e.target.value)}
                      placeholder={t('branchManagementBranch.placeholders.street')}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-400 dark:group-hover:border-blue-500"
                    />
                  ) : (
                    <div className="text-gray-900 dark:text-gray-100 font-medium flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-purple-500 dark:text-purple-400" />
                      {selectedBranch.createAddressDto?.street || t('branchManagementBranch.basicInfo.notSpecified')}
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {t('branchManagementBranch.addressInfo.postalCode')}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.createAddressDto?.zipCode || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('createAddressDto.zipCode', e.target.value)}
                        placeholder={t('branchManagementBranch.placeholders.postalCode')}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-400 dark:group-hover:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-gray-100 font-medium">
                        {selectedBranch.createAddressDto?.zipCode || '-'}
                      </p>
                    )}
                  </div>
                  
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {t('branchManagementBranch.addressInfo.region')}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.createAddressDto?.addressLine1 || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('createAddressDto.addressLine1', e.target.value)}
                        placeholder={t('branchManagementBranch.placeholders.region')}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-400 dark:group-hover:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-gray-100 font-medium">
                        {selectedBranch.createAddressDto?.addressLine1 || '-'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Working Hours */}
        <div className="rounded-2xl shadow-xl   transition-all duration-300 hover:shadow-2xl">
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
                  <div key={hour.dayOfWeek} className="bg-gray-50 border-gray-200 p-5 rounded-xl border transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-semibold text-lg text-gray-800">
                        {t(`branchManagementBranch.workingHours.days.${hour.dayOfWeek}`)}
                      </span>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={hour.isWorkingDay}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleWorkingHourChange(hour.dayOfWeek, 'isWorkingDay', e.target.checked)}
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
                            title='openTime'
                            type="time"
                            value={hour.openTime}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleWorkingHourChange(hour.dayOfWeek, 'openTime', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            {t('branchManagementBranch.workingHours.closeTime')}
                          </label>
                          <input
                            title='closeTime'
                            type="time"
                            value={hour.closeTime}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleWorkingHourChange(hour.dayOfWeek, 'closeTime', e.target.value)}
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
              selectedBranch.workingHours && selectedBranch.workingHours.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {selectedBranch.workingHours.map((hour) => (
                    <div key={hour.dayOfWeek} className="bg-gray-50 border-gray-200 p-4 rounded-xl border transition-all duration-300 hover:shadow-lg transform hover:scale-105">
                      <div className="font-semibold text-gray-800 mb-3 text-center">
                        {t(`branchManagementBranch.workingHours.days.${hour.dayOfWeek}`)}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center justify-center">
                        <Clock className="w-4 h-4 mr-2 text-green-500" />
                        <span className="font-medium">{hour.openTime} - {hour.closeTime}</span>
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

     
      </div>
    </div>
  );
};

export default BranchManagementBranch;