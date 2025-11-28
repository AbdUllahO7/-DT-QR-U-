'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trash2, Upload, X, Image as ImageIcon, Plus, 
  Search, Edit2, ChevronDown, LayoutGrid, DollarSign,
  AlertTriangle
} from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { CreateExtraCategoryData, CreateExtraData, Extra, ExtraCategory } from '../../../types/Extras/type';
import { extrasService } from '../../../services/Extras/ExtrasService';
import { mediaService } from '../../../services/mediaService';
import { extraCategoriesService } from '../../../services/Extras/ExtraCategoriesService';

// --- Types ---
type ModalType = 'add-category' | 'edit-category' | 'add-extra' | 'edit-extra' | null;

type DeleteConfig = {
  isOpen: boolean;
  type: 'category' | 'extra' | null;
  id: number | null;
  name: string;
};

export default function ExtrasManagement() {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  
  // --- State ---
  const [modalType, setModalType] = useState<ModalType>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data State
  const [categories, setCategories] = useState<ExtraCategory[]>([]);
  const [extras, setExtras] = useState<Extra[]>([]);
  
  // Selection State
  const [selectedCategory, setSelectedCategory] = useState<ExtraCategory | null>(null);
  const [selectedExtra, setSelectedExtra] = useState<Extra | null>(null);
  
  // Delete Modal State
  const [deleteConfig, setDeleteConfig] = useState<DeleteConfig>({
    isOpen: false,
    type: null,
    id: null,
    name: ''
  });
  
  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [previousImageUrl, setPreviousImageUrl] = useState<string>('');
  
  // Forms
  const [categoryForm, setCategoryForm] = useState<CreateExtraCategoryData>({
    categoryName: '',
    status: true,
    isRequired: false,
    defaultMinSelectionCount: 0,
    defaultMaxSelectionCount: 0,
    defaultMinTotalQuantity: 0,
    defaultMaxTotalQuantity: 0,
  });
  
  const [extraForm, setExtraForm] = useState<CreateExtraData>({
    extraCategoryId: 0,
    name: '',
    description: '',
    basePrice: 0,
    isRemoval: false,
    imageUrl: '',
    status: true,
  });
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);

  // --- Effects ---
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (categories.length > 0 && expandedCategories.length === 0) {
        setExpandedCategories(categories.map(c => c.id));
    }
  }, [categories]);

  // --- Data Loading ---
  const loadData = async () => {
    try {
      setLoading(true);
      const [catsData, extrasData] = await Promise.all([
        extraCategoriesService.getExtraCategories(),
        extrasService.getExtras()
      ]);
      setCategories(catsData);
      setExtras(extrasData);
      setError(null);
    } catch (err: any) {
      setError(t('extrasManagement.errors.loadCategories'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers ---
  const handleNavigateToRecycleBin = () => {
    navigate('/dashboard/RecycleBin', { state: { source: 'extras' } });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUploadImage = async (): Promise<string> => {
    if (!selectedFile) return extraForm.imageUrl;
    try {
      setUploading(true);
      return await mediaService.uploadFile(selectedFile, previousImageUrl || undefined);
    } catch (err) {
      setError(t('extrasManagement.errors.uploadImage'));
      throw err;
    } finally {
      setUploading(false);
    }
  };

  // --- Create / Update Handlers ---
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await extraCategoriesService.createExtraCategory(categoryForm);
      await loadData();
      closeModal();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;
    try {
      setLoading(true);
      await extraCategoriesService.updateExtraCategory({ id: selectedCategory.id, ...categoryForm });
      await loadData();
      closeModal();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExtra = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      let imageUrl = extraForm.imageUrl;
      if (selectedFile) imageUrl = await handleUploadImage();

      await extrasService.createExtra({ ...extraForm, imageUrl });
      await loadData();
      closeModal();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateExtra = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExtra) return;
    try {
      setLoading(true);
      let imageUrl = extraForm.imageUrl;
      if (selectedFile) imageUrl = await handleUploadImage();

      await extrasService.updateExtra({ id: selectedExtra.id, ...extraForm, imageUrl });
      await loadData();
      closeModal();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- DELETE HANDLERS ---
  const initiateDeleteCategory = (category: ExtraCategory) => {
    setDeleteConfig({
      isOpen: true,
      type: 'category',
      id: category.id,
      name: category.categoryName
    });
  };

  const initiateDeleteExtra = (extra: Extra) => {
    setDeleteConfig({
      isOpen: true,
      type: 'extra',
      id: extra.id,
      name: extra.name
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfig.id || !deleteConfig.type) return;

    try {
      setLoading(true);
      if (deleteConfig.type === 'category') {
        await extraCategoriesService.deleteExtraCategory(deleteConfig.id);
      } else {
        await extrasService.deleteExtra(deleteConfig.id);
      }
      await loadData();
      closeDeleteModal();
    } catch (err) {
      console.error(err);
      setError(t('extrasManagement.errors.deleteFailed'));
    } finally {
      setLoading(false);
    }
  };

  const closeDeleteModal = () => {
    setDeleteConfig({ isOpen: false, type: null, id: null, name: '' });
  };

  // --- UI Helpers ---
  const toggleCategory = (id: number) => {
    setExpandedCategories(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const closeModal = () => {
    setModalType(null);
    resetForms();
  };

  const resetForms = () => {
    setSelectedCategory(null);
    setSelectedExtra(null);
    setSelectedFile(null);
    setImagePreview('');
    setPreviousImageUrl('');
    setCategoryForm({
        categoryName: '', status: true, isRequired: false,
        defaultMinSelectionCount: 0, defaultMaxSelectionCount: 0,
        defaultMinTotalQuantity: 0, defaultMaxTotalQuantity: 0,
    });
    setExtraForm({
        extraCategoryId: 0, name: '', description: '',
        basePrice: 0, isRemoval: false, imageUrl: '', status: true,
    });
  };

  // --- Filtering ---
  const filteredData = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    return categories.filter(cat => {
      const catMatches = cat.categoryName.toLowerCase().includes(lowerQuery);
      const extrasInCat = extras.filter(e => e.extraCategoryId === cat.id);
      const hasMatchingExtra = extrasInCat.some(e => e.name.toLowerCase().includes(lowerQuery));
      return catMatches || hasMatchingExtra;
    });
  }, [categories, extras, searchQuery]);

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 p-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* --- Top Header --- */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              {t('extrasManagement.title')}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {t('extrasManagement.description')}
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleNavigateToRecycleBin}
              className="p-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border border-gray-200 dark:border-gray-700 dark:text-gray-400"
              title={t('extrasManagement.recycleBin.title')}
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => { resetForms(); setModalType('add-category'); }}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-sm transition-all hover:shadow-md font-medium"
            >
              <Plus className="w-5 h-5" />
              {t('extrasManagement.categories.addNew')}
            </button>
          </div>
        </div>

        {/* --- Search & Filters --- */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={t('extrasManagement.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all`}
          />
        </div>

        {/* --- Content Area --- */}
        <div className="space-y-6">
          {loading && categories.length === 0 ? (
             <div className="text-center py-12">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
               <p className="text-gray-500">{t('extrasManagement.loading')}</p>
             </div>
          ) : filteredData.length === 0 ? (
             <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
               <LayoutGrid className="w-16 h-16 text-gray-300 mx-auto mb-4" />
               <p className="text-xl font-medium text-gray-900 dark:text-white">{t('extrasManagement.categories.noCategories')}</p>
               <p className="text-gray-500 dark:text-gray-400 mt-1">{t('extrasManagement.categories.tryAdjusting')}</p>
             </div>
          ) : (
            filteredData.map((category) => {
              const categoryExtras = extras.filter(e => e.extraCategoryId === category.id);
              const isExpanded = expandedCategories.includes(category.id);

              return (
                <div key={category.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200 hover:shadow-md">
                  {/* Category Header */}
                  <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-4 flex-1 cursor-pointer select-none" onClick={() => toggleCategory(category.id)}>
                      <div className={`p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                        <ChevronDown className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{category.categoryName}</h3>
                          {!category.status && (
                             <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                               {t('extrasManagement.categories.inactive')}
                             </span>
                          )}
                          {category.isRequired && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                              {t('extrasManagement.categories.required')}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex flex-wrap gap-x-4">
                           <span>{t('extrasManagement.categories.select')} {category.defaultMinSelectionCount}-{category.defaultMaxSelectionCount}</span>
                           <span className="hidden sm:inline text-gray-300">|</span>
                           <span>{t('extrasManagement.categories.qtyLimit')} {category.defaultMinTotalQuantity}-{category.defaultMaxTotalQuantity}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-auto">
                        <button
                          onClick={() => {
                            setExtraForm(prev => ({ ...prev, extraCategoryId: category.id }));
                            setModalType('add-extra');
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-md transition-colors"
                        >
                           <Plus className="w-4 h-4" /> {t('extrasManagement.buttons.addItem')}
                        </button>
                        <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
                        <button
                          onClick={() => {
                            setSelectedCategory(category);
                            setCategoryForm({ ...category });
                            setModalType('edit-category');
                          }}
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => initiateDeleteCategory(category)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                  </div>

                  {/* Extras List (Grid) */}
                  {isExpanded && (
                    <div className="p-4 md:p-6 bg-white dark:bg-gray-800">
                      {categoryExtras.length === 0 ? (
                        <div className="text-center py-8 px-4 border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-lg">
                           <p className="text-gray-400 text-sm">{t('extrasManagement.extras.noItems')}</p>
                           <button 
                             onClick={() => {
                                setExtraForm(prev => ({ ...prev, extraCategoryId: category.id }));
                                setModalType('add-extra');
                             }}
                             className="text-blue-500 text-sm font-medium hover:underline mt-1"
                           >
                             {t('extrasManagement.buttons.createFirst')}
                           </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {categoryExtras.map((extra) => (
                            <div key={extra.id} className="group relative flex gap-3 p-3 rounded-lg border border-gray-100 hover:border-blue-200 dark:border-gray-700 dark:hover:border-blue-900 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all">
                               {/* Image */}
                               <div className="w-16 h-16 flex-shrink-0 rounded-md bg-gray-100 dark:bg-gray-700 overflow-hidden">
                                  {extra.imageUrl ? (
                                    <img src={extra.imageUrl} alt={extra.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                      <ImageIcon className="w-6 h-6" />
                                    </div>
                                  )}
                               </div>

                               {/* Content */}
                               <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start">
                                    <h4 className="font-semibold text-gray-900 dark:text-white truncate pr-4" title={extra.name}>{extra.name}</h4>
                                    <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${extra.status ? 'bg-green-500' : 'bg-red-500'}`} />
                                  </div>
                                  <p className="text-xs text-gray-500 truncate mb-1.5">{extra.description || t('extrasManagement.extras.noDescription')}</p>
                                  <div className="flex items-center justify-between mt-auto">
                                     <span className="text-sm font-bold text-gray-900 dark:text-white flex items-center">
                                       <DollarSign className="w-3 h-3 mr-0.5 text-gray-400" />
                                       {extra.basePrice.toFixed(2)}
                                     </span>
                                     <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                          onClick={() => {
                                            setSelectedExtra(extra);
                                            setExtraForm({...extra});
                                            setImagePreview(extra.imageUrl);
                                            setPreviousImageUrl(extra.imageUrl);
                                            setModalType('edit-extra');
                                          }}
                                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-blue-600"
                                        >
                                          <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button 
                                          onClick={() => initiateDeleteExtra(extra)}
                                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-red-600"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                     </div>
                                  </div>
                               </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* --- ADD/EDIT MODAL (Categories & Extras) --- */}
      {modalType && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-900/75 backdrop-blur-sm" onClick={closeModal}></div>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
              
              {/* Modal Header */}
              <div className="bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {modalType === 'add-category' && t('extrasManagement.categories.addCategory')}
                  {modalType === 'edit-category' && t('extrasManagement.categories.editCategory')}
                  {modalType === 'add-extra' && t('extrasManagement.extras.addExtra')}
                  {modalType === 'edit-extra' && t('extrasManagement.extras.editExtra')}
                </h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-500 focus:outline-none">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content - Forms */}
              <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
                {/* CATEGORY FORM */}
                {(modalType === 'add-category' || modalType === 'edit-category') && (
                  <form id="categoryForm" onSubmit={modalType === 'add-category' ? handleCreateCategory : handleUpdateCategory} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('extrasManagement.categories.fields.categoryName')}</label>
                      <input
                        type="text"
                        required
                        value={categoryForm.categoryName}
                        onChange={(e) => setCategoryForm({...categoryForm, categoryName: e.target.value})}
                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2.5 px-3"
                        placeholder={t('extrasManagement.categories.fields.categoryNamePlaceholder')}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={categoryForm.status}
                              onChange={(e) => setCategoryForm({...categoryForm, status: e.target.checked})}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" 
                            />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{t('extrasManagement.categories.fields.statusLabel')}</span>
                          </label>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={categoryForm.isRequired}
                              onChange={(e) => setCategoryForm({...categoryForm, isRequired: e.target.checked})}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" 
                            />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{t('extrasManagement.categories.fields.requiredLabel')}</span>
                          </label>
                        </div>
                    </div>

                    {/* Selection Rules */}
                    <div className="space-y-3">
                       <h4 className="text-xs font-semibold uppercase text-gray-500 tracking-wider">{t('extrasManagement.categories.fields.selectionRules')}</h4>
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('extrasManagement.categories.fields.minSelection')}</label>
                            <input 
                              type="text" 
                              inputMode="numeric"
                              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-2 px-3" 
                              value={categoryForm.defaultMinSelectionCount} 
                              onChange={e => {
                                const val = e.target.value.replace(/[^0-9]/g, '');
                                setCategoryForm({...categoryForm, defaultMinSelectionCount: val === '' ? 0 : parseInt(val)})
                              }} 
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('extrasManagement.categories.fields.maxSelection')}</label>
                            <input 
                              type="text" 
                              inputMode="numeric"
                              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-2 px-3" 
                              value={categoryForm.defaultMaxSelectionCount} 
                              onChange={e => {
                                const val = e.target.value.replace(/[^0-9]/g, '');
                                setCategoryForm({...categoryForm, defaultMaxSelectionCount: val === '' ? 0 : parseInt(val)})
                              }} 
                            />
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('extrasManagement.categories.fields.minQuantity')}</label>
                            <input 
                              type="text" 
                              inputMode="numeric"
                              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-2 px-3" 
                              value={categoryForm.defaultMinTotalQuantity} 
                              onChange={e => {
                                const val = e.target.value.replace(/[^0-9]/g, '');
                                setCategoryForm({...categoryForm, defaultMinTotalQuantity: val === '' ? 0 : parseInt(val)})
                              }} 
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('extrasManagement.categories.fields.maxQuantity')}</label>
                            <input 
                              type="text" 
                              inputMode="numeric"
                              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-2 px-3" 
                              value={categoryForm.defaultMaxTotalQuantity} 
                              onChange={e => {
                                const val = e.target.value.replace(/[^0-9]/g, '');
                                setCategoryForm({...categoryForm, defaultMaxTotalQuantity: val === '' ? 0 : parseInt(val)})
                              }} 
                            />
                          </div>
                       </div>
                    </div>
                  </form>
                )}

                {/* EXTRA FORM */}
                {(modalType === 'add-extra' || modalType === 'edit-extra') && (
                  <form id="extraForm" onSubmit={modalType === 'add-extra' ? handleCreateExtra : handleUpdateExtra} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('extrasManagement.extras.fields.parentCategory')}</label>
                      <select 
                        value={extraForm.extraCategoryId}
                        onChange={(e) => setExtraForm({...extraForm, extraCategoryId: parseInt(e.target.value)})}
                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2.5"
                        disabled={!!selectedCategory}
                      >
                         <option value={0}>{t('extrasManagement.extras.fields.selectCategory')}</option>
                         {categories.map(c => <option key={c.id} value={c.id}>{c.categoryName}</option>)}
                      </select>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('extrasManagement.extras.fields.itemName')}</label>
                           <input type="text" required value={extraForm.name} onChange={e => setExtraForm({...extraForm, name: e.target.value})} className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2.5 px-3" placeholder={t('extrasManagement.extras.fields.itemNamePlaceholder')} />
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('extrasManagement.extras.fields.price')}</label>
                           <div className="relative">
                              <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                              <input 
                                type="text" 
                                inputMode="decimal"
                                required 
                                value={extraForm.basePrice} 
                                onChange={e => {
                                    const val = e.target.value;
                                    if (/^\d*\.?\d*$/.test(val)) {
                                        setExtraForm({...extraForm, basePrice: val === '' ? 0 : parseFloat(val) || 0})
                                    }
                                }} 
                                className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2.5 pl-7 pr-3" 
                              />
                           </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('extrasManagement.extras.fields.description')}</label>
                        <textarea rows={2} value={extraForm.description} onChange={e => setExtraForm({...extraForm, description: e.target.value})} className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2 px-3" placeholder={t('extrasManagement.extras.fields.descriptionPlaceholder')} />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('extrasManagement.extras.fields.imageLabel')}</label>
                        <div className={`relative border-2 border-dashed rounded-lg p-4 transition-colors ${imagePreview ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : 'border-gray-300 hover:border-gray-400 dark:border-gray-600'}`}>
                           {imagePreview ? (
                              <div className="relative h-40 w-full">
                                <img src={imagePreview} alt="Preview" className="h-full w-full object-contain rounded" />
                                <button type="button" onClick={() => { setImagePreview(''); setSelectedFile(null); setExtraForm({...extraForm, imageUrl: ''}); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"><X className="w-4 h-4" /></button>
                              </div>
                           ) : (
                              <label className="flex flex-col items-center justify-center h-32 cursor-pointer">
                                 <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                 <span className="text-sm text-gray-500">{t('extrasManagement.extras.fields.uploadText')}</span>
                                 <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
                              </label>
                           )}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={extraForm.status} onChange={e => setExtraForm({...extraForm, status: e.target.checked})} className="w-4 h-4 text-blue-600 rounded" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{t('extrasManagement.extras.fields.activeLabel')}</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={extraForm.isRemoval} onChange={e => setExtraForm({...extraForm, isRemoval: e.target.checked})} className="w-4 h-4 text-blue-600 rounded" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{t('extrasManagement.extras.fields.removalLabel')}</span>
                        </label>
                    </div>
                  </form>
                )}
              </div>

              {/* Add/Edit Footer Buttons */}
              <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex flex-row-reverse gap-3 border-t border-gray-100 dark:border-gray-700">
                <button
                  type="submit"
                  form={modalType?.includes('category') ? 'categoryForm' : 'extraForm'}
                  disabled={loading || uploading}
                  className="inline-flex justify-center rounded-lg border border-transparent shadow-sm px-5 py-2.5 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading || uploading ? t('extrasManagement.processing') : (modalType?.startsWith('add') ? t('extrasManagement.buttons.create') : t('extrasManagement.buttons.save'))}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex justify-center rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm px-5 py-2.5 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm"
                >
                  {t('extrasManagement.buttons.cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {deleteConfig.isOpen && (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 transition-opacity bg-gray-900/75 backdrop-blur-sm" 
              onClick={closeDeleteModal}
            ></div>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
                  </div>
                  <div className={`mt-3 text-center sm:mt-0 sm:text-left ${isRTL ? 'sm:mr-4' : 'sm:ml-4'}`}>
                    
                    <h3 className="text-lg leading-6 font-bold text-gray-900 dark:text-white" id="modal-title">
                      {deleteConfig.type === 'category' 
                        ? t('extrasManagement.deleteModal.titleCategory') 
                        : t('extrasManagement.deleteModal.titleItem')}
                    </h3>
                    
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('extrasManagement.deleteModal.confirmMessage').replace('{name}', deleteConfig.name)}
                      </p>
                      
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {t('extrasManagement.deleteModal.warningMessage')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
                <button
                  type="button"
                  disabled={loading}
                  className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  onClick={handleConfirmDelete}
                >
                  {loading 
                    ? t('extrasManagement.deleteModal.processingButton') 
                    : t('extrasManagement.deleteModal.confirmButton')}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeDeleteModal}
                >
                  {t('extrasManagement.deleteModal.cancelButton')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}