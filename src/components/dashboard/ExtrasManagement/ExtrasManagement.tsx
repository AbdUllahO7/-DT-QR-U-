import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { CreateExtraCategoryData, CreateExtraData, Extra, ExtraCategory } from '../../../types/Extras/type';
import { extrasService } from '../../../services/Extras/ExtrasService';
import { mediaService } from '../../../services/mediaService';
import { extraCategoriesService } from '../../../services/Extras/ExtraCategoriesService';
import { ModalType, DeleteConfig } from './types';
import { Header } from './Header';
import { CategoryCard } from './CategoryCard';
import { CategoryModal } from './CategoryModal';
import { ExtraModal } from './ExtraModal';
import { DeleteModal } from './DeleteModal';
import { EmptyState } from './EmptyState';

export default function ExtrasManagement() {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  // --- State ---
  const [modalType, setModalType] = useState<ModalType>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<ExtraCategory[]>([]);
  const [extras, setExtras] = useState<Extra[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ExtraCategory | null>(null);
  const [selectedExtra, setSelectedExtra] = useState<Extra | null>(null);
  const [deleteConfig, setDeleteConfig] = useState<DeleteConfig>({
    isOpen: false,
    type: null,
    id: null,
    name: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [previousImageUrl, setPreviousImageUrl] = useState<string>('');
  const [categoryForm, setCategoryForm] = useState<CreateExtraCategoryData>({
    categoryName: '',
    description: '',
    status: true,
    isRequired: false,
    defaultMinSelectionCount: 0,
    defaultMaxSelectionCount: 0,
    defaultMinTotalQuantity: 0,
    isRemovalCategory: false,
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);

  // --- Effects ---
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (categories.length > 0 && expandedCategories.length === 0) {
      setExpandedCategories(categories.map((c) => c.id));
    }
  }, [categories]);

  // --- Data Loading ---
  const loadData = async () => {
    try {
      setLoading(true);
      const [catsData, extrasData] = await Promise.all([
        extraCategoriesService.getExtraCategories(),
        extrasService.getExtras(),
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
    if (!selectedFile) return extraForm.imageUrl || '';
    try {
      setUploading(true);
      return await mediaService.uploadFile(selectedFile, previousImageUrl);
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
    setError(null);
    try {
      setLoading(true);
      await extraCategoriesService.createExtraCategory(categoryForm);
      await loadData();
      closeModal();
    } catch (err: any) {
      console.error(err);
      if (err.response) {
        if (err.response.status === 409) {
          setError(err.response.data.message || t('extrasManagement.errors.duplicateCategory'));
        } else if (err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError(t('extrasManagement.errors.createFailed') || 'An error occurred while creating.');
        }
      } else {
        setError(err.message || 'Network Error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;
    try {
      setLoading(true);
      const updateData = {
        id: selectedCategory.id,
        categoryName: categoryForm.categoryName,
        description: categoryForm.description,
        status: categoryForm.status,
        isRequired: categoryForm.isRequired,
        defaultMinSelectionCount: categoryForm.defaultMinSelectionCount,
        defaultMaxSelectionCount: categoryForm.defaultMaxSelectionCount,
        defaultMinTotalQuantity: categoryForm.defaultMinTotalQuantity,
        defaultMaxTotalQuantity: categoryForm.defaultMaxTotalQuantity,
        isRemovalCategory: categoryForm.isRemovalCategory || false,
      };
      await extraCategoriesService.updateExtraCategory(updateData);
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
      name: category.categoryName,
    });
  };

  const initiateDeleteExtra = (extra: Extra) => {
    setDeleteConfig({
      isOpen: true,
      type: 'extra',
      id: extra.id,
      name: extra.name,
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
    setExpandedCategories((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  };

  const closeModal = () => {
    setModalType(null);
    resetForms();
  };

  const resetForms = () => {
    setError(null);
    setSelectedCategory(null);
    setSelectedExtra(null);
    setSelectedFile(null);
    setImagePreview('');
    setCategoryForm({
      categoryName: '',
      description: '',
      status: true,
      isRequired: false,
      defaultMinSelectionCount: 0,
      defaultMaxSelectionCount: 0,
      defaultMinTotalQuantity: 0,
      defaultMaxTotalQuantity: 0,
      isRemovalCategory: false,
    });
    setExtraForm({
      extraCategoryId: 0,
      name: '',
      description: '',
      basePrice: 0,
      isRemoval: false,
      imageUrl: '',
      status: true,
    });
  };

  // --- Filtering ---
  const filteredData = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    return categories.filter((cat) => {
      const catMatches = cat.categoryName.toLowerCase().includes(lowerQuery);
      const extrasInCat = extras.filter((e) => e.extraCategoryId === cat.id);
      const hasMatchingExtra = extrasInCat.some((e) => e.name.toLowerCase().includes(lowerQuery));
      return catMatches || hasMatchingExtra;
    });
  }, [categories, extras, searchQuery]);

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 p-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto mb-8">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddCategory={() => {
            resetForms();
            setModalType('add-category');
          }}
          onNavigateToRecycleBin={handleNavigateToRecycleBin}
        />

        {/* Content Area */}
        <div className="space-y-6">
          <EmptyState isLoading={loading && categories.length === 0} isEmpty={filteredData.length === 0 && !loading} />

          {!loading && filteredData.length > 0 &&
            filteredData.map((category) => {
              const categoryExtras = extras.filter((e) => e.extraCategoryId === category.id);
              const isExpanded = expandedCategories.includes(category.id);

              return (
                <CategoryCard
                  key={category.id}
                  category={category}
                  extras={categoryExtras}
                  isExpanded={isExpanded}
                  onToggle={() => toggleCategory(category.id)}
                  onAddExtra={() => {
                    setExtraForm((prev) => ({ ...prev, extraCategoryId: category.id }));
                    setModalType('add-extra');
                  }}
                  onEditCategory={() => {
                    setSelectedCategory(category);
                    setCategoryForm({
                      categoryName: category.categoryName,
                      description: category.description || '',
                      status: category.status,
                      isRequired: category.isRequired,
                      defaultMinSelectionCount: category.defaultMinSelectionCount,
                      defaultMaxSelectionCount: category.defaultMaxSelectionCount,
                      defaultMinTotalQuantity: category.defaultMinTotalQuantity,
                      defaultMaxTotalQuantity: category.defaultMaxTotalQuantity,
                      isRemovalCategory: (category as any).isRemovalCategory || false,
                    });
                    setModalType('edit-category');
                  }}
                  onDeleteCategory={() => initiateDeleteCategory(category)}
                  onEditExtra={(extra) => {
                    setSelectedExtra(extra);
                    setExtraForm({ ...extra });
                    setImagePreview(extra.imageUrl || '');
                    setPreviousImageUrl(extra.imageUrl || '');
                    setModalType('edit-extra');
                  }}
                  onDeleteExtra={initiateDeleteExtra}
                />
              );
            })}
        </div>
      </div>

      {/* Modals */}
      {(modalType === 'add-category' || modalType === 'edit-category') && (
        <CategoryModal
          isEditMode={modalType === 'edit-category'}
          formData={categoryForm}
          loading={loading}
          error={error}
          onChange={setCategoryForm}
          onSubmit={modalType === 'add-category' ? handleCreateCategory : handleUpdateCategory}
          onClose={closeModal}
        />
      )}

      {(modalType === 'add-extra' || modalType === 'edit-extra') && (
        <ExtraModal
          isEditMode={modalType === 'edit-extra'}
          formData={extraForm}
          categories={categories}
          allExtras={extras}
          imagePreview={imagePreview}
          loading={loading}
          uploading={uploading}
          selectedCategoryId={selectedCategory?.id}
          onChange={setExtraForm}
          onFileSelect={handleFileSelect}
          onImageClear={() => {
            setImagePreview('');
            setSelectedFile(null);
            setExtraForm({ ...extraForm, imageUrl: '' });
          }}
          onSubmit={modalType === 'add-extra' ? handleCreateExtra : handleUpdateExtra}
          onClose={closeModal}
        />
      )}

      <DeleteModal config={deleteConfig} loading={loading} onConfirm={handleConfirmDelete} onClose={closeDeleteModal} />
    </div>
  );
}
