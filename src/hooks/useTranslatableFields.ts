import { useState, useCallback, useMemo } from 'react';

/**
 * Type for translatable field value
 * Maps language code to field value
 */
export type TranslatableFieldValue = {
  [languageCode: string]: string;
};

/**
 * Convert array of translations to object format for easier manipulation
 * @param translations - Array of translations from API
 * @param fieldName - Name of the field to extract (e.g., 'name', 'description')
 * @returns Object mapping language codes to values
 */
export const translationsToObject = <T extends { languageCode: string }>(
  translations: T[],
  fieldName: keyof Omit<T, 'languageCode'>
): TranslatableFieldValue => {
  const result: TranslatableFieldValue = {};

  translations.forEach((translation) => {
    const value = translation[fieldName];
    if (value !== undefined && value !== null) {
      result[translation.languageCode] = String(value);
    }
  });

  return result;
};

/**
 * Convert object format back to array of translations for API
 * @param values - Object mapping language codes to values
 * @param entityId - ID of the entity (productId, categoryId, etc.)
 * @param fieldName - Name of the field (e.g., 'name', 'description')
 * @param idFieldName - Name of the ID field (e.g., 'productId', 'categoryId')
 * @returns Array of translation objects for API
 */
export const objectToTranslations = <T extends { languageCode: string }>(
  values: TranslatableFieldValue,
  entityId: number,
  fieldName: string,
  idFieldName: string
): any[] => {
  return Object.entries(values).map(([languageCode, value]) => ({
    [idFieldName]: entityId,
    languageCode,
    [fieldName]: value || undefined,
  }));
};

/**
 * Custom hook for managing translatable fields
 * Provides state management and helper functions for multi-language inputs
 */
export const useTranslatableFields = () => {
  /**
   * Get empty translations object for given languages
   */
  const getEmptyTranslations = useCallback((supportedLanguages: string[]): TranslatableFieldValue => {
    const result: TranslatableFieldValue = {};
    supportedLanguages.forEach(lang => {
      result[lang] = '';
    });
    return result;
  }, []);

  /**
   * Validate translations - ensure required languages have values
   */
  const validateTranslations = useCallback((
    translations: TranslatableFieldValue,
    requiredLanguages: string[]
  ): { isValid: boolean; missingLanguages: string[] } => {
    const missingLanguages = requiredLanguages.filter(
      lang => !translations[lang] || translations[lang].trim() === ''
    );

    return {
      isValid: missingLanguages.length === 0,
      missingLanguages,
    };
  }, []);

  /**
   * Get translation value with fallback
   */
  const getTranslationWithFallback = useCallback((
    translations: TranslatableFieldValue,
    preferredLanguage: string,
    fallbackLanguages: string[] = ['en', 'tr']
  ): string => {
    // Try preferred language first
    if (translations[preferredLanguage]) {
      return translations[preferredLanguage];
    }

    // Try fallback languages
    for (const lang of fallbackLanguages) {
      if (translations[lang]) {
        return translations[lang];
      }
    }

    // Return first available translation
    const values = Object.values(translations);
    return values.find(v => v && v.trim() !== '') || '';
  }, []);

  /**
   * Merge new translations with existing ones
   */
  const mergeTranslations = useCallback((
    existing: TranslatableFieldValue,
    updates: Partial<TranslatableFieldValue>
  ): TranslatableFieldValue => {
    return { ...existing, ...updates };
  }, []);

  /**
   * Check if any translations have been modified
   */
  const hasTranslationChanges = useCallback((
    original: TranslatableFieldValue,
    current: TranslatableFieldValue
  ): boolean => {
    const originalKeys = Object.keys(original);
    const currentKeys = Object.keys(current);

    if (originalKeys.length !== currentKeys.length) {
      return true;
    }

    return originalKeys.some(key => original[key] !== current[key]);
  }, []);

  return {
    getEmptyTranslations,
    validateTranslations,
    getTranslationWithFallback,
    mergeTranslations,
    hasTranslationChanges,
    translationsToObject,
    objectToTranslations,
  };
};
