import React from 'react';
import { Phone, Mail, MapPin, Globe } from 'lucide-react';
import { BranchInfoProps } from '../../../../types/BranchManagement/type';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { countryKeys } from '../../../../data/mockData';

// Extend the props interface to accept the new phone handling props
interface ExtendedBranchInfoProps extends BranchInfoProps {
  countries: { name: string; code: string }[];
  getPhoneParts: (fullNumber: string | null) => { code: string; number: string };
  handlePhoneCompositeChange: (
    fullFieldName: string,
    currentFullValue: string,
    partType: 'code' | 'number',
    newValue: string
  ) => void;
  onEditBranchName?: () => void;
}

const BranchInfo: React.FC<ExtendedBranchInfoProps> = ({
  selectedBranch,
  isEditing,
  editData,
  t,
  handleInputChange,
  countries,
  getPhoneParts,
  handlePhoneCompositeChange,
  onEditBranchName,
}) => {
  const { isRTL } = useLanguage();

  return (
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
                <div className="flex items-center gap-2">
                  <p className="flex-1 text-gray-900 dark:text-gray-100 font-medium text-lg">
                    {editData.branchName || selectedBranch?.branchName || t('branchManagementBranch.basicInfo.notSpecified')}
                  </p>
                  {onEditBranchName && (
                    <button
                      type="button"
                      onClick={onEditBranchName}
                      className="px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm font-medium flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      {t('common.edit') || 'Edit'}
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-gray-900 dark:text-gray-100 font-medium text-lg">
                  {selectedBranch?.branchName || t('branchManagementBranch.basicInfo.notSpecified')}
                </p>
              )}
            </div>
            
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {t('branchManagementBranch.basicInfo.whatsappNumber')}
              </label>
              {isEditing ? (
                <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <select
                    title='Country Code'
                    value={getPhoneParts(editData.whatsappOrderNumber).code}
                    onChange={(e) => handlePhoneCompositeChange(
                      'whatsappOrderNumber',
                      editData.whatsappOrderNumber,
                      'code',
                      e.target.value
                    )}
                    className="w-1/3 md:w-1/4 px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400 dark:hover:border-blue-500"
                  >
                    {countries.map((country) => (
                      <option key={country.code + country.name} value={country.code}>
                        {country.name} ({country.code})
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    value={getPhoneParts(editData.whatsappOrderNumber).number}
                    onChange={(e) => handlePhoneCompositeChange(
                      'whatsappOrderNumber',
                      editData.whatsappOrderNumber,
                      'number',
                      e.target.value
                    )}
                    placeholder={t('branchManagementBranch.placeholders.whatsappNumber')}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400 dark:hover:border-blue-500"
                  />
                </div>
              ) : (
                <div className="text-gray-900 dark:text-gray-100 font-medium text-lg flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-green-500 dark:text-green-400" />
                  {selectedBranch?.whatsappOrderNumber || t('branchManagementBranch.basicInfo.notSpecified')}
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('email', e.target.value)
                  }
                  placeholder={t('branchManagementBranch.placeholders.email')}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-400 dark:group-hover:border-blue-500"
                />
              ) : (
                <div className="text-gray-900 dark:text-gray-100 font-medium text-lg flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" />
                  {selectedBranch?.email || t('branchManagementBranch.basicInfo.notSpecified')}
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
                  <div className="relative">
                    <Globe className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10`} />
                    <select
                      title='Country'
                      value={editData.createAddressDto?.country || ''}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        handleInputChange('createAddressDto.country', e.target.value)
                      }
                      className={`w-full ${isRTL ? 'pr-10 pl-8' : 'pl-10 pr-8'} py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-400 dark:group-hover:border-blue-500 appearance-none ${isRTL ? 'text-right' : 'text-left'}`}
                      dir={isRTL ? 'rtl' : 'ltr'}
                    >
                      <option value="" disabled>
                        {t('branchManagementBranch.placeholders.country')}
                      </option>
                      {countryKeys.map((countryKey) => (
                        <option key={countryKey} value={t(countryKey)}>
                          {t(countryKey)}
                        </option>
                      ))}
                    </select>
                    {/* Custom dropdown arrow */}
                    <div className={`absolute inset-y-0 ${isRTL ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center pointer-events-none`}>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-900 dark:text-gray-100 font-medium">
                    {selectedBranch?.createAddressDto?.country || t('branchManagementBranch.basicInfo.notSpecified')}
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange('createAddressDto.city', e.target.value)
                    }
                    placeholder={t('branchManagementBranch.placeholders.city')}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-400 dark:group-hover:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-gray-100 font-medium">
                    {selectedBranch?.createAddressDto?.city || t('branchManagementBranch.basicInfo.notSpecified')}
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('createAddressDto.street', e.target.value)
                  }
                  placeholder={t('branchManagementBranch.placeholders.street')}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-400 dark:group-hover:border-blue-500"
                />
              ) : (
                <div className="text-gray-900 dark:text-gray-100 font-medium flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-purple-500 dark:text-purple-400" />
                  {selectedBranch?.createAddressDto?.street || t('branchManagementBranch.basicInfo.notSpecified')}
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange('createAddressDto.zipCode', e.target.value)
                    }
                    placeholder={t('branchManagementBranch.placeholders.postalCode')}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-400 dark:group-hover:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-gray-100 font-medium">
                    {selectedBranch?.createAddressDto?.zipCode || '-'}
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange('createAddressDto.addressLine1', e.target.value)
                    }
                    placeholder={t('branchManagementBranch.placeholders.region')}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-400 dark:group-hover:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-gray-100 font-medium">
                    {selectedBranch?.createAddressDto?.addressLine1 || '-'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchInfo;