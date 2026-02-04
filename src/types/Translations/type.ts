// Base translation interfaces
export interface Translation {
  languageCode: string;
  [key: string]: any;
}

// About Translations
export interface AboutTranslation extends Translation {
  aboutId: number;
  title?: string;
  content?: string;
}

export interface UpsertAboutTranslationDto {
  aboutId: number;
  languageCode: string;
  title?: string;
  content?: string;
}

export interface BatchUpsertAboutTranslationsDto {
  translations: UpsertAboutTranslationDto[];
}

// Allergen Translations
export interface AllergenTranslation extends Translation {
  allergenId: number;
  name?: string;
  description?: string;
}

export interface UpsertAllergenTranslationDto {
  allergenId: number;
  languageCode: string;
  name?: string;
  description?: string;
}

export interface BatchUpsertAllergenTranslationsDto {
  translations: UpsertAllergenTranslationDto[];
}

// Branch Category Translations
export interface BranchCategoryTranslation extends Translation {
  branchCategoryId: number;
  name?: string;
  description?: string;
}

export interface UpsertBranchCategoryTranslationDto {
  branchCategoryId: number;
  languageCode: string;
  name?: string;
  description?: string;
}

export interface BatchUpsertBranchCategoryTranslationsDto {
  translations: UpsertBranchCategoryTranslationDto[];
}

// Branch Product Addon Translations
export interface BranchProductAddonTranslation extends Translation {
  branchProductAddonId: number;
  name?: string;
  description?: string;
}

export interface UpsertBranchProductAddonTranslationDto {
  branchProductAddonId: number;
  languageCode: string;
  name?: string;
  description?: string;
}

export interface BatchUpsertBranchProductAddonTranslationsDto {
  translations: UpsertBranchProductAddonTranslationDto[];
}

// Branch Translations
export interface BranchTranslation extends Translation {
  branchId: number;
  branchName?: string;
  description?: string;
  address?: string;
}

export interface UpsertBranchTranslationDto {
  branchId: number;
  languageCode: string;
  branchName?: string;
  description?: string;
  address?: string;
}

export interface BatchUpsertBranchTranslationsDto {
  translations: UpsertBranchTranslationDto[];
}

// Category Translations
export interface CategoryTranslation extends Translation {
  categoryId: number;
  name?: string;
  description?: string;
}

export interface UpsertCategoryTranslationDto {
  categoryId: number;
  languageCode: string;
  name?: string;
  description?: string;
}

export interface BatchUpsertCategoryTranslationsDto {
  translations: UpsertCategoryTranslationDto[];
}

// Contact Translations
export interface ContactTranslation extends Translation {
  contactId: number;
  title?: string;
  content?: string;
  contactHeader?: string;
  footerTitle?: string;
  footerDescription?: string;
  openTitle?: string;
  openDays?: string;
  openHours?: string;
}

export interface UpsertContactTranslationDto {
  contactId: number;
  languageCode: string;
  title?: string;
  content?: string;
  contactHeader?: string;
  footerTitle?: string;
  footerDescription?: string;
  openTitle?: string;
  openDays?: string;
  openHours?: string;
}

export interface BatchUpsertContactTranslationsDto {
  translations: UpsertContactTranslationDto[];
}

// Discount Translations
export interface DiscountTranslation extends Translation {
  discountId: number;
  name?: string;
  description?: string;
}

export interface UpsertDiscountTranslationDto {
  discountId: number;
  languageCode: string;
  name?: string;
  description?: string;
}

export interface BatchUpsertDiscountTranslationsDto {
  translations: UpsertDiscountTranslationDto[];
}

// Extra Category Translations
export interface ExtraCategoryTranslation extends Translation {
  extraCategoryId: number;
  categoryName?: string;
  description?: string;
}

export interface UpsertExtraCategoryTranslationDto {
  extraCategoryId: number;
  languageCode: string;
  categoryName?: string;
  description?: string;
}

export interface BatchUpsertExtraCategoryTranslationsDto {
  translations: UpsertExtraCategoryTranslationDto[];
}

// Extra Translations
export interface ExtraTranslation extends Translation {
  extraId: number;
  name?: string;
  description?: string;
}

export interface UpsertExtraTranslationDto {
  extraId: number;
  languageCode: string;
  name?: string;
  description?: string;
}

export interface BatchUpsertExtraTranslationsDto {
  translations: UpsertExtraTranslationDto[];
}

// Feature Translations
export interface FeatureTranslation extends Translation {
  featureId: number;
  title?: string;
  description?: string;
}

export interface UpsertFeatureTranslationDto {
  featureId: number;
  languageCode: string;
  title?: string;
  description?: string;
}

export interface BatchUpsertFeatureTranslationsDto {
  translations: UpsertFeatureTranslationDto[];
}

// Ingredient Translations
export interface IngredientTranslation extends Translation {
  ingredientId: number;
  name?: string;
  description?: string;
}

export interface UpsertIngredientTranslationDto {
  ingredientId: number;
  languageCode: string;
  name?: string;
  description?: string;
}

export interface BatchUpsertIngredientTranslationsDto {
  translations: UpsertIngredientTranslationDto[];
}

// Menu Table Category Translations
export interface MenuTableCategoryTranslation extends Translation {
  menuTableCategoryId: number;
  name?: string;
  description?: string;
}

export interface UpsertMenuTableCategoryTranslationDto {
  menuTableCategoryId: number;
  languageCode: string;
  name?: string;
  description?: string;
}

export interface BatchUpsertMenuTableCategoryTranslationsDto {
  translations: UpsertMenuTableCategoryTranslationDto[];
}

// Menu Table Translations
export interface MenuTableTranslation extends Translation {
  menuTableId: number;
  name?: string;
  description?: string;
}

export interface UpsertMenuTableTranslationDto {
  menuTableId: number;
  languageCode: string;
  name?: string;
  description?: string;
}

export interface BatchUpsertMenuTableTranslationsDto {
  translations: UpsertMenuTableTranslationDto[];
}

// Order Type Translations
export interface OrderTypeTranslation extends Translation {
  orderTypeId: number;
  name?: string;
  description?: string;
}

export interface UpsertOrderTypeTranslationDto {
  orderTypeId: number;
  languageCode: string;
  name?: string;
  description?: string;
}

export interface BatchUpsertOrderTypeTranslationsDto {
  translations: UpsertOrderTypeTranslationDto[];
}

// Product Addon Translations
export interface ProductAddonTranslation extends Translation {
  productAddonId: number;
  name?: string;
  description?: string;
}

export interface UpsertProductAddonTranslationDto {
  productAddonId: number;
  languageCode: string;
  name?: string;
  description?: string;
}

export interface BatchUpsertProductAddonTranslationsDto {
  translations: UpsertProductAddonTranslationDto[];
}

// Product Translations
export interface ProductTranslation extends Translation {
  productId: number;
  name?: string;
  description?: string;
}

export interface UpsertProductTranslationDto {
  productId: number;
  languageCode: string;
  name?: string;
  description?: string;
}

export interface BatchUpsertProductTranslationsDto {
  translations: UpsertProductTranslationDto[];
}

// Restaurant Translations
export interface RestaurantTranslation extends Translation {
  name?: string;
  description?: string;
  address?: string;
}

export interface UpsertRestaurantTranslationDto {
  languageCode: string;
  name?: string;
  description?: string;
  address?: string;
}

export interface BatchUpsertRestaurantTranslationsDto {
  translations: UpsertRestaurantTranslationDto[];
}

// Slider Translations
export interface SliderTranslation extends Translation {
  sliderId: number;
  title?: string;
  description?: string;
}

export interface UpsertSliderTranslationDto {
  sliderId: number;
  languageCode: string;
  title?: string;
  description?: string;
}

export interface BatchUpsertSliderTranslationsDto {
  translations: UpsertSliderTranslationDto[];
}

// Social Media Translations
export interface SocialMediaTranslation extends Translation {
  socialMediaId: number;
  name?: string;
  description?: string;
}

export interface UpsertSocialMediaTranslationDto {
  socialMediaId: number;
  languageCode: string;
  name?: string;
  description?: string;
}

export interface BatchUpsertSocialMediaTranslationsDto {
  translations: UpsertSocialMediaTranslationDto[];
}

// Testimonial Translations
export interface TestimonialTranslation extends Translation {
  testimonialId: number;
  content?: string;
  author?: string;
}

export interface UpsertTestimonialTranslationDto {
  testimonialId: number;
  languageCode: string;
  content?: string;
  author?: string;
}

export interface BatchUpsertTestimonialTranslationsDto {
  translations: UpsertTestimonialTranslationDto[];
}
