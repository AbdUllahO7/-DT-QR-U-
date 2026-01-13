import React, { useState, useRef, useEffect } from 'react';
import { Phone, Mail, MapPin, Globe, ChevronDown, Search, Check, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BranchInfoProps } from '../../../../types/BranchManagement/type';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { countryKeys } from '../../../../data/mockData';

// --- Custom Select Component ---
interface SelectOption {
  value: string;
  label: string;
  searchTerms?: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  searchable?: boolean;
  className?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ 
  options, 
  value, 
  onChange, 
  placeholder, 
  disabled, 
  searchable = false,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const { isRTL } = useLanguage();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);
  
  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opt.searchTerms?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
          disabled ? 'opacity-60 cursor-not-allowed' : 'hover:border-blue-400 cursor-pointer'
        } ${isOpen ? 'ring-2 ring-blue-500/20 border-blue-500' : ''}`}
      >
        <span className={`block truncate ${!selectedOption ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[300px]"
          >
            {searchable && (
              <div className="p-2 border-b border-gray-100 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
                <div className="relative">
                  <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400`} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className={`w-full ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            )}

            <div className="overflow-y-auto flex-1 p-1 custom-scrollbar">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between group transition-colors ${
                      value === option.value
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="font-medium text-sm truncate">{option.label}</span>
                    {value === option.value && (
                      <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 ml-2" />
                    )}
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  No options found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- End Custom Select ---

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

  // Prepare options for custom selects
  const countryCodeOptions = countries.map(c => ({
    label: `${c.name} (${c.code})`,
    value: c.code,
    searchTerms: `${c.name} ${c.code}`
  }));

  const countryNameOptions = countryKeys.map(key => ({
    label: t(key),
    value: t(key),
    searchTerms: key
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
      
      {/* Basic Information Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl">
        <div className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900 mr-3 shrink-0">
              <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            {t('branchManagementBranch.basicInfo.title')}
          </h2>
          
          <div className="space-y-5">
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {t('branchManagementBranch.basicInfo.branchName')}
              </label>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <p className="flex-1 text-gray-900 dark:text-gray-100 font-medium text-base sm:text-lg truncate">
                    {editData.branchName || selectedBranch?.branchName || t('branchManagementBranch.basicInfo.notSpecified')}
                  </p>
                  {onEditBranchName && (
                    <button
                      type="button"
                      onClick={onEditBranchName}
                      className="px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm font-medium flex items-center gap-1 shrink-0"
                    >
                      <Settings className="w-4 h-4" />
                      {t('common.edit') || 'Edit'}
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-gray-900 dark:text-gray-100 font-medium text-base sm:text-lg">
                  {selectedBranch?.branchName || t('branchManagementBranch.basicInfo.notSpecified')}
                </p>
              )}
            </div>
            
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {t('branchManagementBranch.basicInfo.whatsappNumber')}
              </label>
              {isEditing ? (
                <div className={`flex flex-col sm:flex-row gap-2 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                  <div className="w-full sm:w-[140px] shrink-0">
                    <CustomSelect
                      options={countryCodeOptions}
                      value={getPhoneParts(editData.whatsappOrderNumber).code}
                      onChange={(newCode) => handlePhoneCompositeChange(
                        'whatsappOrderNumber',
                        editData.whatsappOrderNumber,
                        'code',
                        newCode
                      )}
                      placeholder="Code"
                      searchable={true}
                    />
                  </div>
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
                    className={`w-full flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400 dark:hover:border-blue-500 ${isRTL ? 'text-right' : 'text-left'}`}
                  />
                </div>
              ) : (
                <div className="text-gray-900 dark:text-gray-100 font-medium text-base sm:text-lg flex items-center">
                  <Phone className={`w-5 h-5 text-green-500 dark:text-green-400 shrink-0 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  <span dir="ltr">{selectedBranch?.whatsappOrderNumber || t('branchManagementBranch.basicInfo.notSpecified')}</span>
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
                  className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-400 dark:group-hover:border-blue-500 ${isRTL ? 'text-right' : 'text-left'}`}
                />
              ) : (
                <div className="text-gray-900 dark:text-gray-100 font-medium text-base sm:text-lg flex items-center break-all">
                  <Mail className={`w-5 h-5 text-blue-500 dark:text-blue-400 shrink-0 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {selectedBranch?.email || t('branchManagementBranch.basicInfo.notSpecified')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Address Information Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl">
        <div className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900 mr-3 shrink-0">
              <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            {t('branchManagementBranch.addressInfo.title')}
          </h2>
          
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t('branchManagementBranch.addressInfo.country')}
                </label>
                {isEditing ? (
                  <CustomSelect
                    options={countryNameOptions}
                    value={editData.createAddressDto?.country || ''}
                    onChange={(val) => handleInputChange('createAddressDto.country', val)}
                    placeholder={t('branchManagementBranch.placeholders.country')}
                    searchable={true}
                  />
                ) : (
                  <p className="text-gray-900 dark:text-gray-100 font-medium flex items-center">
                     <Globe className={`w-4 h-4 text-gray-400 mr-2 ${isRTL ? 'ml-2' : 'mr-2'}`} />
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
                    className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-400 dark:group-hover:border-blue-500 ${isRTL ? 'text-right' : 'text-left'}`}
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
                  className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-400 dark:group-hover:border-blue-500 ${isRTL ? 'text-right' : 'text-left'}`}
                />
              ) : (
                <div className="text-gray-900 dark:text-gray-100 font-medium flex items-center">
                  <MapPin className={`w-5 h-5 text-purple-500 dark:text-purple-400 shrink-0 ${isRTL ? 'ml-2' : 'mr-2'}`} />
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
                    className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-400 dark:group-hover:border-blue-500 ${isRTL ? 'text-right' : 'text-left'}`}
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
                    className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-400 dark:group-hover:border-blue-500 ${isRTL ? 'text-right' : 'text-left'}`}
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