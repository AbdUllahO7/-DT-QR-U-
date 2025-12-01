import React, { useState } from 'react';
import { Edit, MapPin, Save, X, Loader2, Upload, Image, Globe } from 'lucide-react';
import { mediaService } from '../../../../services/mediaService';
import { BranchHeaderProps, DEFAULT_IMAGE_URL, theme } from '../../../../types/BranchManagement/type';
import { useNavigate } from 'react-router-dom';
import { onlineMenuService } from '../../../../services/Branch/Online/OnlineMenuService';


// Modern Toggle Switch with sleek design
const ModernToggleSwitch: React.FC<{
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  t: (key: string) => string;
  isRTL: boolean;
}> = ({ checked, onChange, disabled, t, isRTL }) => (
  <div className="flex flex-col gap-2 justify-center items-center">
  
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      aria-checked={checked}
      role="switch"
      className={`group relative inline-flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''} 
        transition-all duration-200 hover:scale-[1.02] disabled:cursor-not-allowed 
        disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 
        rounded-xl p-3 ${checked ? 'bg-emerald-50 dark:bg-emerald-950/50' : 'bg-red-50 dark:bg-red-950/50'}
        border ${checked ? 'border-emerald-200 dark:border-emerald-800' : 'border-red-200 dark:border-red-800'}`}
    >
      {disabled ? (
        <div className="flex items-center justify-center w-12 h-6 rounded-full bg-slate-200 dark:bg-slate-700">
          <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
        </div>
      ) : (
        <div 
          className={`relative w-12 h-6 rounded-full transition-all duration-300 ease-in-out
            ${checked 
              ? 'bg-gradient-to-r from-emerald-500 to-green-500 shadow-lg shadow-emerald-500/30' 
              : 'bg-gradient-to-r from-red-500 to-rose-500 shadow-lg shadow-red-500/30'}`}
        >
          <div 
            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ease-in-out
              ${checked ? `${isRTL ? 'left-0.5' : 'right-0.5'}` : `${isRTL ? 'right-0.5' : 'left-0.5'}`}`}
          />
        </div>
      )}
      <div className="flex flex-col items-start">
        <span className={`text-sm font-semibold ${checked ? theme.text.success : theme.text.error}`}>
          {checked
            ? t('branchManagementBranch.status.open') || 'Active'
            : t('branchManagementBranch.status.temporarilyClosed') || 'Temporarily Closed'}
        </span>
       
      </div>
    </button>
  </div>
);


// Modern Button Component
const ModernButton: React.FC<{
  onClick: () => void;
  disabled?: boolean;
  variant: 'primary' | 'success' | 'neutral' | 'danger';
  children: React.ReactNode;
  isLoading?: boolean;
}> = ({ onClick, disabled, variant, children, isLoading }) => (
  <button
    onClick={onClick}
    disabled={disabled || isLoading}
    className={`group px-6 py-3 ${theme[variant]} text-white rounded-xl font-semibold 
      transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 
      focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed 
      disabled:hover:translate-y-0 disabled:hover:shadow-lg backdrop-blur-sm
      active:scale-95`}
  >
    <div className="flex items-center gap-2 transition-all duration-200">
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </div>
  </button>
);

const BranchHeader: React.FC<BranchHeaderProps> = ({
  selectedBranch,
  isEditing,
  isLoading,
  t,
  isRTL,
  setIsEditing,
  handleToggleTemporaryClose,
  handleSave,
  initializeEditData,
  setEditData,
}) => {
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [imageError, setImageError] = useState<string>('');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const navigate = useNavigate(); 
  const [isLoadingPublicId, setIsLoadingPublicId] = useState<boolean>(false);

const handleNavigateToOnlineMenu = async () => {
    if (!selectedBranch) return;
    
    try {
      setIsLoadingPublicId(true);
          localStorage.removeItem('token');
      // Fetch the public ID
      const { publicId, branchName } = await onlineMenuService.getPublicBranchId(selectedBranch.id);
      
      // Navigate with public ID as the route parameter
      navigate(`/OnlineMenu/${publicId}`, {
        state: { 
          branchName,
          branchId: selectedBranch.id // Optional, in case you need it later
        }
      });
      
    } catch (error: any) {
      console.error('Failed to get public ID:', error);
      alert(t('branchManagementBranch.errors.failedToGetPublicId') || 'Failed to get online menu link');
    } finally {
      setIsLoadingPublicId(false);
    }
  };

  // Handle image upload
  const uploadImage = async (file: File): Promise<string> => {
    try {
      setIsUploadingImage(true);
      const imageUrl = await mediaService.uploadFile(file);
      setEditData((prev) => ({ ...prev, branchLogoPath: imageUrl }));
      setImageError('');
      return imageUrl;
    } catch (error: any) {
      setImageError(t('branchManagementBranch.errors.imageUploadFailed') || 'Image upload failed');
      return DEFAULT_IMAGE_URL;
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Handle file input change
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadImage(file);
    }
  };

  // Handle drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await uploadImage(e.dataTransfer.files[0]);
    }
  };

 return (
    <div className={`${theme.background.card} ${theme.background.cardHover} backdrop-blur-xl 
      rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 
      transition-all duration-500 mb-8 overflow-hidden relative`}>
      
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-emerald-50/30 dark:from-slate-800/30 dark:to-slate-900/30" />
      
      <div className="relative p-6 sm:p-8">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
          
          {/* Main Header Section */}
          <div className={`flex flex-col gap-6  min-w-0 flex-1`}>
            
            {/* Title and Description */}
            <div className={`flex items-center gap-4 `}>
              <div className="relative group flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                <div className="relative p-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="space-y-2 min-w-0">
                <h1 className={`text-2xl font-bold ${theme.text.primary} leading-tight`}>
                  {t('branchManagementBranch.title') || 'Branch Management'}
                </h1>
                <p className={`text-sm ${theme.text.secondary} leading-relaxed`}>
                  {t('branchManagementBranch.description') || 'Manage your branch information and settings'}
                </p>
              </div>
              {selectedBranch && (
                <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''} flex-wrap`}>
                  {/* Logo */}
                  <div className="relative group flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                    <img
                      src={selectedBranch.branchLogoPath || DEFAULT_IMAGE_URL}
                      alt={t('branchManagementBranch.logoAlt') || 'Branch Logo'}
                      className="relative lg:w-96 lg:h-32 sm:w-20 sm:h-20 object-cover rounded-2xl border-2 border-white dark:border-slate-700 shadow-xl transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Controls Section */}
          <div className={`flex flex-col gap-6 ${isRTL ? 'items-start' : 'items-end'}`}>
            
            {/* Top Row - Toggle and Actions */}
            <div className={`flex flex-col justify-center h-full w-full sm:flex-row gap-4 items-start sm:items-center `}>
              {/* Toggle Switch */}
              {selectedBranch && (
                <ModernToggleSwitch
                  checked={!selectedBranch.isTemporarilyClosed}
                  onChange={handleToggleTemporaryClose}
                  disabled={isLoading}
                  t={t}
                  isRTL={isRTL}
                />
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 flex-wrap">
                {/* Online Menu Button - Always visible */}
                

                {!isEditing ? (
                  <ModernButton
                    onClick={() => setIsEditing(true)}
                    variant="primary"
                  >
                    <Edit className="w-4 h-4" />
                    <span>{t('branchManagementBranch.actions.edit') || 'Edit'}</span>
                  </ModernButton>
                ) : (
                  <div className="flex gap-3">
                    <ModernButton
                      onClick={handleSave}
                      variant="success"
                      disabled={isLoading || isUploadingImage}
                      isLoading={isLoading}
                    >
                      <Save className="w-4 h-4" />
                      <span>{t('branchManagementBranch.actions.save') || 'Save'}</span>
                    </ModernButton>
                    
                    <ModernButton
                      onClick={() => {
                        setIsEditing(false);
                        if (selectedBranch) initializeEditData(selectedBranch);
                        setImageError('');
                      }}
                      variant="neutral"
                    >
                      <X className="w-4 h-4" />
                      <span>{t('branchManagementBranch.actions.cancel') || 'Cancel'}</span>
                    </ModernButton>
                  </div>
                )}
              </div>
            </div>
       {selectedBranch && (
    <ModernButton
          onClick={handleNavigateToOnlineMenu}
          variant="primary"
          disabled={isLoadingPublicId}
          isLoading={isLoadingPublicId}
        >
          <Globe className="w-4 h-4" />
          <span>{t('branchManagementBranch.actions.onlineMenu') || 'Online Menu'}</span>
        </ModernButton>
        )}
            {/* Bottom Row - Image Upload (Editing Mode) */}
            {isEditing && (
              <div className="w-full max-w-sm">
                <label className={`block text-sm font-semibold ${theme.text.primary} mb-3`}>
                  {t('branchManagementBranch.uploadLogo') || 'Upload Logo'}
                </label>
                
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative group cursor-pointer transition-all duration-300 rounded-2xl border-2 border-dashed p-6
                    ${dragActive 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20 scale-105' 
                      : 'border-slate-300 dark:border-slate-600 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:scale-[1.02]'}`}
                >
                  <input
                    title='branch-logo-upload'
                    id="branch-logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isUploadingImage}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  
                  <div className="flex flex-col items-center gap-3 text-center">
                    {isUploadingImage ? (
                      <div className="p-4 bg-blue-100 dark:bg-blue-900/50 rounded-xl">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                      </div>
                    ) : (
                      <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-xl group-hover:from-blue-200 group-hover:to-indigo-200 dark:group-hover:from-blue-800/50 dark:group-hover:to-indigo-800/50 transition-all duration-300">
                        <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                      </div>
                    )}
                    
                    <div className="space-y-1">
                      <p className={`text-sm font-medium ${theme.text.primary}`}>
                        {isUploadingImage ? 'Uploading...' : 'Drop image here or click to browse'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {imageError && (
                  <div className="mt-3 flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl">
                    <X className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <p className={`text-sm ${theme.text.error}`}>{imageError}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchHeader;