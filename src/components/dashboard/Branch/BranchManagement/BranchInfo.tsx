import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { BranchInfoProps } from '../../../../types/BranchManagement/type';

const BranchInfo: React.FC<BranchInfoProps> = ({
  selectedBranch,
  isEditing,
  editData,
  t,
  handleInputChange,
}) => (
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange('branchName', e.target.value)
                }
                placeholder={t('branchManagementBranch.placeholders.branchName')}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-400 dark:group-hover:border-blue-500"
              />
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
              <input
                type="text"
                value={editData.whatsappOrderNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange('whatsappOrderNumber', e.target.value)
                }
                placeholder={t('branchManagementBranch.placeholders.whatsappNumber')}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-400 dark:group-hover:border-blue-500"
              />
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
                <input
                  type="text"
                  value={editData.createAddressDto?.country || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('createAddressDto.country', e.target.value)
                  }
                  placeholder={t('branchManagementBranch.placeholders.country')}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-400 dark:group-hover:border-blue-500"
                />
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

export default BranchInfo;