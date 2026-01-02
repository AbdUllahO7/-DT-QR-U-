import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { CreateExtraCategoryData, CreateExtraData, Extra, ExtraCategory } from '../../../types/Extras/type';
import { extrasService } from '../../../services/Extras/ExtrasService';
import { mediaService } from '../../../services/mediaService';
import { extraCategoriesService } from '../../../services/Extras/ExtraCategoriesService';
import { extraTranslationService } from '../../../services/Translations/ExtraTranslationService';
import { extraCategoryTranslationService } from '../../../services/Translations/ExtraCategoryTranslationService';
import { languageService } from '../../../services/LanguageService';
import { useTranslatableFields, TranslatableFieldValue, translationsToObject } from '../../../hooks/useTranslatableFields';
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
  const translationHook = useTranslatableFields();

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
    isMaxSelectionUnlimited: false,
    isMaxQuantityUnlimited: false,
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

  // Multi-language state for extras
  const [nameTranslations, setNameTranslations] = useState<TranslatableFieldValue>({});
  const [descriptionTranslations, setDescriptionTranslations] = useState<TranslatableFieldValue>({});

  // Multi-language state for categories
  const [categoryNameTranslations, setCategoryNameTranslations] = useState<TranslatableFieldValue>({});
  const [categoryDescriptionTranslations, setCategoryDescriptionTranslations] = useState<TranslatableFieldValue>({});

  const [supportedLanguages, setSupportedLanguages] = useState<any[]>([]);
  const [defaultLanguage, setDefaultLanguage] = useState<string>('en');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);

  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const languagesData = await languageService.getRestaurantLanguages();
        console.log("languagesData", languagesData);

        // Deduplicate languages by code
        const uniqueLanguages = (languagesData.availableLanguages || []).reduce((acc: any[], lang: any) => {
          if (!acc.find((l: any) => l.code === lang.code)) {
            acc.push(lang);
          }
          return acc;
        }, []);

        console.log("uniqueLanguages", uniqueLanguages);
        setSupportedLanguages(uniqueLanguages);
        setDefaultLanguage(languagesData.defaultLanguage || 'en');

        // Initialize empty translations
        const languageCodes = uniqueLanguages.map((lang: any) => lang.code);
        setNameTranslations(translationHook.getEmptyTranslations(languageCodes));
        setDescriptionTranslations(translationHook.getEmptyTranslations(languageCodes));
      } catch (error) {
        console.error('Failed to load languages:', error);
      }
    };
    loadLanguages();
  }, []);

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

      // Get default language values for name and description
      const defaultName = translationHook.getTranslationWithFallback(categoryNameTranslations, defaultLanguage);
      const defaultDescription = translationHook.getTranslationWithFallback(categoryDescriptionTranslations, defaultLanguage);

      const createData: CreateExtraCategoryData = {
        ...categoryForm,
        categoryName: defaultName,
        description: defaultDescription,
        defaultMaxSelectionCount: categoryForm.isMaxSelectionUnlimited ? null : categoryForm.defaultMaxSelectionCount,
        defaultMaxTotalQuantity: categoryForm.isMaxQuantityUnlimited ? null : categoryForm.defaultMaxTotalQuantity,
      };

      // Create the category with default language values
      const createdCategory = await extraCategoriesService.createExtraCategory(createData);

      // Save translations for non-default languages only
      // Default language is stored in the base entity, not in translations
      const translations = supportedLanguages
        .filter((lang: any) => lang.code !== defaultLanguage)
        .map((lang: any) => ({
          extraCategoryId: createdCategory.id,
          languageCode: lang.code,
          categoryName: categoryNameTranslations[lang.code] || undefined,
          description: categoryDescriptionTranslations[lang.code] || undefined,
        }));

      // Batch upsert translations (only if there are non-default languages)
      if (translations.length > 0) {
        await extraCategoryTranslationService.batchUpsertExtraCategoryTranslations({ translations });
      }

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

      // Get default language values for name and description
      const defaultName = translationHook.getTranslationWithFallback(categoryNameTranslations, defaultLanguage);
      const defaultDescription = translationHook.getTranslationWithFallback(categoryDescriptionTranslations, defaultLanguage);

      const updateData = {
        id: selectedCategory.id,
        categoryName: defaultName,
        description: defaultDescription,
        status: categoryForm.status,
        isRequired: categoryForm.isRequired,
        defaultMinSelectionCount: categoryForm.defaultMinSelectionCount,
        defaultMaxSelectionCount: categoryForm.isMaxSelectionUnlimited ? null : categoryForm.defaultMaxSelectionCount,
        defaultMinTotalQuantity: categoryForm.defaultMinTotalQuantity,
        defaultMaxTotalQuantity: categoryForm.isMaxQuantityUnlimited ? null : categoryForm.defaultMaxTotalQuantity,
        isRemovalCategory: categoryForm.isRemovalCategory || false,
      };

      // Update the category with default language values
      await extraCategoriesService.updateExtraCategory(updateData);

      // Update translations for non-default languages only
      // Default language is stored in the base entity, not in translations
      const translations = supportedLanguages
        .filter((lang: any) => lang.code !== defaultLanguage)
        .map((lang: any) => ({
          extraCategoryId: selectedCategory.id,
          languageCode: lang.code,
          categoryName: categoryNameTranslations[lang.code] || undefined,
          description: categoryDescriptionTranslations[lang.code] || undefined,
        }));

      // Batch upsert translations (only if there are non-default languages)
      if (translations.length > 0) {
        await extraCategoryTranslationService.batchUpsertExtraCategoryTranslations({ translations });
      }

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

      // Get default language values for name and description
      const defaultName = translationHook.getTranslationWithFallback(nameTranslations, defaultLanguage);
      const defaultDescription = translationHook.getTranslationWithFallback(descriptionTranslations, defaultLanguage);

      let imageUrl = extraForm.imageUrl;
      if (selectedFile) imageUrl = await handleUploadImage();

      // Create the extra with default language values
      const createdExtra = await extrasService.createExtra({
        ...extraForm,
        name: defaultName,
        description: defaultDescription,
        imageUrl
      });

      // Save translations for non-default languages only
      // Default language is stored in the base entity, not in translations
      const translations = supportedLanguages
        .filter((lang: any) => lang.code !== defaultLanguage)
        .map((lang: any) => ({
          extraId: createdExtra.id,
          languageCode: lang.code,
          name: nameTranslations[lang.code] || undefined,
          description: descriptionTranslations[lang.code] || undefined,
        }));

      // Batch upsert translations (only if there are non-default languages)
      if (translations.length > 0) {
        await extraTranslationService.batchUpsertExtraTranslations({ translations });
      }

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

      // Get default language values
      const defaultName = translationHook.getTranslationWithFallback(nameTranslations, defaultLanguage);
      const defaultDescription = translationHook.getTranslationWithFallback(descriptionTranslations, defaultLanguage);

      let imageUrl = extraForm.imageUrl;
      if (selectedFile) imageUrl = await handleUploadImage();

      // Update the extra with default language values
      await extrasService.updateExtra({
        id: selectedExtra.id,
        ...extraForm,
        name: defaultName,
        description: defaultDescription,
        imageUrl
      });

      // Update translations for non-default languages only
      // Default language is stored in the base entity, not in translations
      const translations = supportedLanguages
        .filter((lang: any) => lang.code !== defaultLanguage)
        .map((lang: any) => ({
          extraId: selectedExtra.id,
          languageCode: lang.code,
          name: nameTranslations[lang.code] || undefined,
          description: descriptionTranslations[lang.code] || undefined,
        }));

      // Batch upsert translations (only if there are non-default languages)
      if (translations.length > 0) {
        await extraTranslationService.batchUpsertExtraTranslations({ translations });
      }

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

    // Reset category translations
    const languageCodes = supportedLanguages.map((lang: any) => lang.code);
    setCategoryNameTranslations(translationHook.getEmptyTranslations(languageCodes));
    setCategoryDescriptionTranslations(translationHook.getEmptyTranslations(languageCodes));

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
      isMaxSelectionUnlimited: false,
      isMaxQuantityUnlimited: false,
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

                    // Reset translations for new extra
                    const languageCodes = supportedLanguages.map((lang: any) => lang.code);
                    setNameTranslations(translationHook.getEmptyTranslations(languageCodes));
                    setDescriptionTranslations(translationHook.getEmptyTranslations(languageCodes));

                    setModalType('add-extra');
                  }}
                  onEditCategory={async () => {
                    setSelectedCategory(category);
                    setCategoryForm({
                      categoryName: category.categoryName,
                      description: category.description || '',
                      status: category.status,
                      isRequired: category.isRequired,
                      defaultMinSelectionCount: category.defaultMinSelectionCount,
                      defaultMaxSelectionCount: category.defaultMaxSelectionCount || 0,
                      defaultMinTotalQuantity: category.defaultMinTotalQuantity,
                      defaultMaxTotalQuantity: category.defaultMaxTotalQuantity || 0,
                      isRemovalCategory: (category as any).isRemovalCategory || false,
                      isMaxSelectionUnlimited: category.defaultMaxSelectionCount === null || category.defaultMaxSelectionCount === undefined,
                      isMaxQuantityUnlimited: category.defaultMaxTotalQuantity === null || category.defaultMaxTotalQuantity === undefined,
                    });

                    // Load existing translations
                    try {
                      const translations = await extraCategoryTranslationService.getExtraCategoryTranslations(category.id);
                      const nameTranslationsObj = translationsToObject(translations, 'categoryName');
                      const descriptionTranslationsObj = translationsToObject(translations, 'description');

                      // Add base language from the category entity (not from translations table)
                      nameTranslationsObj[defaultLanguage] = category.categoryName;
                      descriptionTranslationsObj[defaultLanguage] = category.description || '';

                      setCategoryNameTranslations(nameTranslationsObj);
                      setCategoryDescriptionTranslations(descriptionTranslationsObj);
                    } catch (error) {
                      console.error('Failed to load category translations:', error);
                      // Initialize with empty translations if load fails
                      const languageCodes = supportedLanguages.map((lang: any) => lang.code);
                      const emptyNameTranslations = translationHook.getEmptyTranslations(languageCodes);
                      const emptyDescTranslations = translationHook.getEmptyTranslations(languageCodes);

                      // Add base language from the category entity
                      emptyNameTranslations[defaultLanguage] = category.categoryName;
                      emptyDescTranslations[defaultLanguage] = category.description || '';

                      setCategoryNameTranslations(emptyNameTranslations);
                      setCategoryDescriptionTranslations(emptyDescTranslations);
                    }

                    setModalType('edit-category');
                  }}
                  onDeleteCategory={() => initiateDeleteCategory(category)}
                  onEditExtra={async (extra) => {
                    setSelectedExtra(extra);
                    setExtraForm({ ...extra });
                    setImagePreview(extra.imageUrl || '');
                    setPreviousImageUrl(extra.imageUrl || '');

                    // Load existing translations
                    try {
                      const translations = await extraTranslationService.getExtraTranslations(extra.id);
                      const nameTranslationsObj = translationsToObject(translations, 'name');
                      const descriptionTranslationsObj = translationsToObject(translations, 'description');

                      // Add base language from the extra entity (not from translations table)
                      nameTranslationsObj[defaultLanguage] = extra.name;
                      descriptionTranslationsObj[defaultLanguage] = extra.description || '';

                      setNameTranslations(nameTranslationsObj);
                      setDescriptionTranslations(descriptionTranslationsObj);
                    } catch (error) {
                      console.error('Failed to load translations:', error);
                      // Initialize with empty translations if load fails
                      const languageCodes = supportedLanguages.map((lang: any) => lang.code);
                      const emptyNameTranslations = translationHook.getEmptyTranslations(languageCodes);
                      const emptyDescTranslations = translationHook.getEmptyTranslations(languageCodes);

                      // Add base language from the extra entity
                      emptyNameTranslations[defaultLanguage] = extra.name;
                      emptyDescTranslations[defaultLanguage] = extra.description || '';

                      setNameTranslations(emptyNameTranslations);
                      setDescriptionTranslations(emptyDescTranslations);
                    }

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
          nameTranslations={categoryNameTranslations}
          descriptionTranslations={categoryDescriptionTranslations}
          onNameTranslationsChange={setCategoryNameTranslations}
          onDescriptionTranslationsChange={setCategoryDescriptionTranslations}
          supportedLanguages={supportedLanguages}
          defaultLanguage={defaultLanguage}
        />
      )}

      {(modalType === 'add-extra' || modalType === 'edit-extra') && (
        <ExtraModal
          isEditMode={modalType === 'edit-extra'}
          formData={extraForm}
          categories={categories}
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
          nameTranslations={nameTranslations}
          descriptionTranslations={descriptionTranslations}
          onNameTranslationsChange={setNameTranslations}
          onDescriptionTranslationsChange={setDescriptionTranslations}
          supportedLanguages={supportedLanguages}
          defaultLanguage={defaultLanguage}
        />
      )}

      <DeleteModal config={deleteConfig} loading={loading} onConfirm={handleConfirmDelete} onClose={closeDeleteModal} />
    </div>
  );
}
