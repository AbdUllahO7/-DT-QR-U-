// Main translation service with all translation groups
export { translationsService } from './TranslationsService';

// Individual translation services
export { aboutTranslationService } from './AboutTranslationService';
export { branchCategoryTranslationService } from './BranchCategoryTranslationService';
export { branchTranslationService } from './BranchTranslationService';
export { categoryTranslationService } from './CategoryTranslationService';
export { productTranslationService } from './ProductTranslationService';
export { extraTranslationService } from './ExtraTranslationService';
export { extraCategoryTranslationService } from './ExtraCategoryTranslationService';
export { ingredientTranslationService } from './IngredientTranslationService';
export { orderTypeTranslationService } from './OrderTypeTranslationService';
export { restaurantTranslationService } from './RestaurantTranslationService';

// Export all types
export * from '../../types/Translations/type';
