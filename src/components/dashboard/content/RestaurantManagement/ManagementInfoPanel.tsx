import React, { useState, useEffect } from 'react';
import { 
  Edit3, 
  Save, 
  X, 
  Building2, 
  FileText, 
  Hash, 
  Briefcase, 
  Scale, 
  Wine,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { restaurantService } from '../../../../services/restaurantService';
import { purgeService } from '../../../../services/purge/PurgeService';
import { ConfirmDeleteModal } from '../../common/ConfirmDeleteModal';

interface RestaurantManagementInfo {
  restaurantId: string;
  restaurantName: string;
  restaurantLogoPath: string;
  cuisineTypeId: number | null;
  hasAlcoholService: boolean;
  companyTitle: string;
  taxNumber: string;
  taxOffice: string;
  mersisNumber: string;
  tradeRegistryNumber: string;
  legalType: string;
  workPermitFilePath: string;
  foodCertificateFilePath: string;
  restaurantStatus: string;
  about: string;
}

interface ManagementInfoPanelProps {
  info: RestaurantManagementInfo | null;
  onEdit: () => void;
  onSubmit: (formData: RestaurantManagementInfo) => void;
  editing: boolean;
  loading: boolean;
}

export const ManagementInfoPanel: React.FC<ManagementInfoPanelProps> = ({ 
  info, 
  onEdit, 
  onSubmit, 
  editing, 
  loading 
}) => {
  const { t } = useLanguage();

  console.log("info",info)
  
  const [formData, setFormData] = useState<RestaurantManagementInfo>(
    info || {
      restaurantId: '',
      restaurantName: '',
      restaurantLogoPath: '',
      cuisineTypeId: null,
      hasAlcoholService: false,
      companyTitle: '',
      taxNumber: '',
      taxOffice: '',
      mersisNumber: '',
      tradeRegistryNumber: '',
      legalType: '',
      workPermitFilePath: '',
      foodCertificateFilePath: '',
      restaurantStatus: 'active',
      about: ''
    }
  );

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPurgeModal, setShowPurgeModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [purgeLoading, setPurgeLoading] = useState(false);

  useEffect(() => {
    if (info) setFormData(info);
  }, [info]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: keyof RestaurantManagementInfo) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, [field]: file.name }));
    }
  };

  const handleDelete = async () => {
    if (!info?.restaurantId) return;
    
    setDeleteLoading(true);
    try {
      await restaurantService.deleteRestaurant(info.restaurantId);
      alert(t('management.messages.deleteSuccess') || 'Restaurant successfully deleted');
      window.location.reload(); // Or use a callback to refresh
    } catch (error) {
      console.error('Delete error:', error);
      throw error; // Let ConfirmDeleteModal handle the error
    } finally {
      setDeleteLoading(false);
    }
  };

  const handlePurge = async () => {
    if (!info?.restaurantId) return;
    
    setPurgeLoading(true);
    try {
      await purgeService.purgeRestaurant(Number(info.restaurantId));
      alert(t('management.messages.purgeSuccess') || 'Restaurant permanently deleted');
      window.location.reload(); // Or use a callback to refresh
    } catch (error) {
      console.error('Purge error:', error);
      throw error; // Let ConfirmDeleteModal handle the error
    } finally {
      setPurgeLoading(false);
    }
  };

  if (!info) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center mb-4">
          <Building2 className="w-10 h-10 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {t('management.noDataTitle')}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
          {t('management.noDataMessage')}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
        {/* Decorative gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
        
          <img
              src={info.restaurantLogoPath}
              alt={`${info.restaurantName} ${t('branchCard.alt.logo')}`}
              className="w-12 h-12 object-cover rounded-2xl bg-white/10"
            />

        {/* Header */}
        <div className="relative border-b border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <div className="flex justify-between items-center p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t('management.title')}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('management.subtitle')}
                </p>
              </div>
            </div>
            <button
              onClick={onEdit}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg ${
                editing
                  ? 'bg-gray-600 hover:bg-gray-700 text-white'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
              }`}
            >
              {editing ? (
                <>
                  <X className="w-4 h-4" />
                  {t('management.buttons.cancel')}
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4" />
                  {t('management.buttons.edit')}
                </>
              )}
            </button>
          </div>
        </div>

        <div className="relative p-6">
          {editing ? (
            <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-6">
              {/* Restaurant Details Section */}
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-200/50 dark:border-gray-700/50">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  {t('management.sections.restaurantDetails')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('management.fields.restaurantName')}
                    </label>
                    <input
                      type="text"
                      placeholder={t('management.placeholders.restaurantName')}
                      value={formData.restaurantName || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, restaurantName: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('management.fields.restaurantLogo')}
                    </label>
                    <div className="relative">
                      <input
                        title='restaurantLogoPath'
                        type="file"
                        id="restaurantLogo"
                        onChange={(e) => handleFileUpload(e, 'restaurantLogoPath')}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 dark:file:bg-blue-900/30 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/50 transition-all"
                      />
                      {formData.restaurantLogoPath && (
                        <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Information Section */}
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-200/50 dark:border-gray-700/50">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  {t('management.sections.companyInfo')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('management.fields.companyTitle')}
                    </label>
                    <input
                      type="text"
                      placeholder={t('management.placeholders.companyTitle')}
                      value={formData.companyTitle || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, companyTitle: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('management.fields.legalType')}
                    </label>
                    <select
                      title='legalType'
                      value={formData.legalType || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, legalType: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    >
                      <option value="">{t('management.placeholders.selectLegalType')}</option>
                      <option value="LLC">{t('management.legalTypes.llc')}</option>
                      <option value="Corporation">{t('management.legalTypes.corporation')}</option>
                      <option value="Partnership">{t('management.legalTypes.partnership')}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Tax Information Section */}
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-200/50 dark:border-gray-700/50">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Hash className="w-5 h-5 text-green-600 dark:text-green-400" />
                  {t('management.sections.taxInfo')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('management.fields.taxNumber')}
                    </label>
                    <input
                      type="text"
                      placeholder={t('management.placeholders.taxNumber')}
                      value={formData.taxNumber || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, taxNumber: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('management.fields.taxOffice')}
                    </label>
                    <input
                      type="text"
                      placeholder={t('management.placeholders.taxOffice')}
                      value={formData.taxOffice || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, taxOffice: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('management.fields.mersisNumber')}
                    </label>
                    <input
                      type="text"
                      placeholder={t('management.placeholders.mersisNumber')}
                      value={formData.mersisNumber || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, mersisNumber: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('management.fields.tradeRegistry')}
                    </label>
                    <input
                      type="text"
                      placeholder={t('management.placeholders.tradeRegistry')}
                      value={formData.tradeRegistryNumber || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, tradeRegistryNumber: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Certificates Section */}
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-200/50 dark:border-gray-700/50">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  {t('management.sections.certificates')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('management.fields.workPermit')}
                    </label>
                    <div className="relative">
                      <input
                        title='workPermitFilePath'
                        type="file"
                        id="workPermit"
                        onChange={(e) => handleFileUpload(e, 'workPermitFilePath')}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-50 dark:file:bg-orange-900/30 file:text-orange-700 dark:file:text-orange-300 hover:file:bg-orange-100 dark:hover:file:bg-orange-900/50 transition-all"
                      />
                      {formData.workPermitFilePath && (
                        <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('management.fields.foodCertificate')}
                    </label>
                    <div className="relative">
                      <input
                        title='foodCertificateFilePath'
                        type="file"
                        id="foodCertificate"
                        onChange={(e) => handleFileUpload(e, 'foodCertificateFilePath')}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-50 dark:file:bg-orange-900/30 file:text-orange-700 dark:file:text-orange-300 hover:file:bg-orange-100 dark:hover:file:bg-orange-900/50 transition-all"
                      />
                      {formData.foodCertificateFilePath && (
                        <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Settings */}
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-200/50 dark:border-gray-700/50">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  {t('management.sections.additionalSettings')}
                </h4>
               
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  {loading ? t('management.buttons.saving') : t('management.buttons.save')}
                </button>
                <button
                  type="button"
                  onClick={onEdit}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-xl transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                  {t('management.buttons.cancel')}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Restaurant Details */}
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-200/50 dark:border-gray-700/50">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  {t('management.sections.restaurantDetails')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem label={t('management.fields.restaurantName')} value={info.restaurantName} />
                  <InfoItem 
                    label={t('management.fields.logo')} 
                    value={info.restaurantLogoPath ? t('management.status.uploaded') : t('management.status.notUploaded')} 
                  />
                </div>
              </div>

              {/* Company Information */}
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-200/50 dark:border-gray-700/50">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  {t('management.sections.companyInfo')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem label={t('management.fields.companyTitle')} value={info.companyTitle} />
                  <InfoItem label={t('management.fields.legalType')} value={info.legalType} />
                </div>
              </div>

              {/* Tax Information */}
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-200/50 dark:border-gray-700/50">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Hash className="w-5 h-5 text-green-600 dark:text-green-400" />
                  {t('management.sections.taxInfo')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem label={t('management.fields.taxNumber')} value={info.taxNumber} />
                  <InfoItem label={t('management.fields.taxOffice')} value={info.taxOffice} />
                  <InfoItem label={t('management.fields.mersisNumber')} value={info.mersisNumber} />
                  <InfoItem label={t('management.fields.tradeRegistry')} value={info.tradeRegistryNumber} />
                </div>
              </div>

              {/* Certificates */}
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-200/50 dark:border-gray-700/50">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  {t('management.sections.certificates')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem 
                    label={t('management.fields.workPermit')} 
                    value={info.workPermitFilePath ? t('management.status.uploaded') : t('management.status.notUploaded')} 
                  />
                  <InfoItem 
                    label={t('management.fields.foodCertificate')} 
                    value={info.foodCertificateFilePath ? t('management.status.uploaded') : t('management.status.notUploaded')} 
                  />
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-red-50/50 dark:bg-red-900/10 backdrop-blur-sm rounded-xl p-5 border border-red-200/50 dark:border-red-800/50">
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                  <div>
                    <h4 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-1">
                      {t('management.dangerZone.title') || 'Danger Zone'}
                    </h4>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {t('management.dangerZone.description') || 'These actions cannot be undone. Please be careful.'}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                    {t('management.buttons.delete') || 'Delete Restaurant'}
                  </button>
                  <button
                    onClick={() => setShowPurgeModal(true)}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-red-800 hover:bg-red-900 text-white font-medium rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                    {t('management.buttons.purge') || 'Permanently Delete'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title={t('management.dangerZone.title') || 'Delete Restaurant'}
        message={t('management.dangerZone.description') || 'Are you sure you want to delete this restaurant? This action can be restored later.'}
        isSubmitting={deleteLoading}
        itemType="restaurant"
        itemName={info?.restaurantName}
      />

      {/* Purge Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={showPurgeModal}
        onClose={() => setShowPurgeModal(false)}
        onConfirm={handlePurge}
        title={t('management.dangerZone.title') || 'Delete Restaurant'}
                message={t('management.dangerZone.description') || 'Are you sure you want to delete this restaurant? This action can be restored later.'}

        isSubmitting={purgeLoading}
        itemType="restaurant-purge"
        itemName={info?.restaurantName}
      />
    </>
  );
};

// Helper component for displaying information
const InfoItem: React.FC<{ label: string; value: string | undefined }> = ({ label, value }) => {
  const { t } = useLanguage();
  
  return (
    <div className="group">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {value || t('management.common.na')}
      </p>
    </div>
  );
};