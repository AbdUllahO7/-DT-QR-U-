import { httpClient } from '../../utils/http';
import { logger } from '../../utils/logger';
import {
  AboutTranslation,
  AllergenTranslation,
  BranchCategoryTranslation,
  BranchProductAddonTranslation,
  BranchTranslation,
  CategoryTranslation,
  ContactTranslation,
  DiscountTranslation,
  ExtraCategoryTranslation,
  ExtraTranslation,
  FeatureTranslation,
  IngredientTranslation,
  MenuTableCategoryTranslation,
  MenuTableTranslation,
  OrderTypeTranslation,
  ProductAddonTranslation,
  ProductTranslation,
  RestaurantTranslation,
  SliderTranslation,
  SocialMediaTranslation,
  TestimonialTranslation,
  UpsertAboutTranslationDto,
  BatchUpsertAboutTranslationsDto,
  UpsertAllergenTranslationDto,
  BatchUpsertAllergenTranslationsDto,
  UpsertBranchCategoryTranslationDto,
  BatchUpsertBranchCategoryTranslationsDto,
  UpsertBranchProductAddonTranslationDto,
  BatchUpsertBranchProductAddonTranslationsDto,
  UpsertBranchTranslationDto,
  BatchUpsertBranchTranslationsDto,
  UpsertCategoryTranslationDto,
  BatchUpsertCategoryTranslationsDto,
  UpsertContactTranslationDto,
  BatchUpsertContactTranslationsDto,
  UpsertDiscountTranslationDto,
  BatchUpsertDiscountTranslationsDto,
  UpsertExtraCategoryTranslationDto,
  BatchUpsertExtraCategoryTranslationsDto,
  UpsertExtraTranslationDto,
  BatchUpsertExtraTranslationsDto,
  UpsertFeatureTranslationDto,
  BatchUpsertFeatureTranslationsDto,
  UpsertIngredientTranslationDto,
  BatchUpsertIngredientTranslationsDto,
  UpsertMenuTableCategoryTranslationDto,
  BatchUpsertMenuTableCategoryTranslationsDto,
  UpsertMenuTableTranslationDto,
  BatchUpsertMenuTableTranslationsDto,
  UpsertOrderTypeTranslationDto,
  BatchUpsertOrderTypeTranslationsDto,
  UpsertProductAddonTranslationDto,
  BatchUpsertProductAddonTranslationsDto,
  UpsertProductTranslationDto,
  BatchUpsertProductTranslationsDto,
  UpsertRestaurantTranslationDto,
  BatchUpsertRestaurantTranslationsDto,
  UpsertSliderTranslationDto,
  BatchUpsertSliderTranslationsDto,
  UpsertSocialMediaTranslationDto,
  BatchUpsertSocialMediaTranslationsDto,
  UpsertTestimonialTranslationDto,
  BatchUpsertTestimonialTranslationsDto,
} from '../../types/Translations/type';

class TranslationsService {
  private baseUrl = '/api';

  // About Translations
  async getAboutTranslations(aboutId: number): Promise<AboutTranslation[]> {
    try {
      logger.info('Fetching about translations', { aboutId }, { prefix: 'TranslationsService' });
      const response = await httpClient.get<AboutTranslation[]>(`${this.baseUrl}/about-translations/${aboutId}`);
      logger.info('About translations fetched successfully', { aboutId, count: response.data.length }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching about translations', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error fetching about translations');
    }
  }

  async getAboutTranslation(aboutId: number, languageCode: string): Promise<AboutTranslation> {
    try {
      logger.info('Fetching about translation', { aboutId, languageCode }, { prefix: 'TranslationsService' });
      const response = await httpClient.get<AboutTranslation>(`${this.baseUrl}/about-translations/${aboutId}/${languageCode}`);
      logger.info('About translation fetched successfully', { aboutId, languageCode }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching about translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error fetching about translation');
    }
  }

  async upsertAboutTranslation(data: UpsertAboutTranslationDto): Promise<AboutTranslation> {
    try {
      logger.info('Upserting about translation', { data }, { prefix: 'TranslationsService' });
      const response = await httpClient.put<AboutTranslation>(`${this.baseUrl}/about-translations`, data);
      logger.info('About translation upserted successfully', { data }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error upserting about translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error upserting about translation');
    }
  }

  async batchUpsertAboutTranslations(data: BatchUpsertAboutTranslationsDto): Promise<AboutTranslation[]> {
    try {
      logger.info('Batch upserting about translations', { count: data.translations.length }, { prefix: 'TranslationsService' });
      const response = await httpClient.put<AboutTranslation[]>(`${this.baseUrl}/about-translations/batch`, data);
      logger.info('About translations batch upserted successfully', { count: data.translations.length }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error batch upserting about translations', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error batch upserting about translations');
    }
  }

  async deleteAboutTranslation(aboutId: number, languageCode: string): Promise<void> {
    try {
      logger.info('Deleting about translation', { aboutId, languageCode }, { prefix: 'TranslationsService' });
      await httpClient.delete(`${this.baseUrl}/about-translations/${aboutId}/${languageCode}`);
      logger.info('About translation deleted successfully', { aboutId, languageCode }, { prefix: 'TranslationsService' });
    } catch (error: any) {
      logger.error('Error deleting about translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error deleting about translation');
    }
  }

  // Allergen Translations
  async getAllergenTranslations(allergenId: number): Promise<AllergenTranslation[]> {
    try {
      logger.info('Fetching allergen translations', { allergenId }, { prefix: 'TranslationsService' });
      const response = await httpClient.get<AllergenTranslation[]>(`${this.baseUrl}/allergen-translations/${allergenId}`);
      logger.info('Allergen translations fetched successfully', { allergenId, count: response.data.length }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching allergen translations', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error fetching allergen translations');
    }
  }

  async getAllergenTranslation(allergenId: number, languageCode: string): Promise<AllergenTranslation> {
    try {
      logger.info('Fetching allergen translation', { allergenId, languageCode }, { prefix: 'TranslationsService' });
      const response = await httpClient.get<AllergenTranslation>(`${this.baseUrl}/allergen-translations/${allergenId}/${languageCode}`);
      logger.info('Allergen translation fetched successfully', { allergenId, languageCode }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching allergen translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error fetching allergen translation');
    }
  }

  // Branch Category Translations
  async getBranchCategoryTranslations(branchCategoryId: number): Promise<BranchCategoryTranslation[]> {
    try {
      logger.info('Fetching branch category translations', { branchCategoryId }, { prefix: 'TranslationsService' });
      const response = await httpClient.get<BranchCategoryTranslation[]>(`${this.baseUrl}/branch-category-translations/${branchCategoryId}`);
      logger.info('Branch category translations fetched successfully', { branchCategoryId, count: response.data.length }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching branch category translations', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error fetching branch category translations');
    }
  }

  async getBranchCategoryTranslation(branchCategoryId: number, languageCode: string): Promise<BranchCategoryTranslation> {
    try {
      logger.info('Fetching branch category translation', { branchCategoryId, languageCode }, { prefix: 'TranslationsService' });
      const response = await httpClient.get<BranchCategoryTranslation>(`${this.baseUrl}/branch-category-translations/${branchCategoryId}/${languageCode}`);
      logger.info('Branch category translation fetched successfully', { branchCategoryId, languageCode }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching branch category translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error fetching branch category translation');
    }
  }

  async upsertBranchCategoryTranslation(data: UpsertBranchCategoryTranslationDto): Promise<BranchCategoryTranslation> {
    try {
      logger.info('Upserting branch category translation', { data }, { prefix: 'TranslationsService' });
      const response = await httpClient.put<BranchCategoryTranslation>(`${this.baseUrl}/branch-category-translations`, data);
      logger.info('Branch category translation upserted successfully', { data }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error upserting branch category translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error upserting branch category translation');
    }
  }

  async batchUpsertBranchCategoryTranslations(data: BatchUpsertBranchCategoryTranslationsDto): Promise<BranchCategoryTranslation[]> {
    try {
      logger.info('Batch upserting branch category translations', { count: data.translations.length }, { prefix: 'TranslationsService' });
      const response = await httpClient.put<BranchCategoryTranslation[]>(`${this.baseUrl}/branch-category-translations/batch`, data);
      logger.info('Branch category translations batch upserted successfully', { count: data.translations.length }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error batch upserting branch category translations', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error batch upserting branch category translations');
    }
  }

  async deleteBranchCategoryTranslation(branchCategoryId: number, languageCode: string): Promise<void> {
    try {
      logger.info('Deleting branch category translation', { branchCategoryId, languageCode }, { prefix: 'TranslationsService' });
      await httpClient.delete(`${this.baseUrl}/branch-category-translations/${branchCategoryId}/${languageCode}`);
      logger.info('Branch category translation deleted successfully', { branchCategoryId, languageCode }, { prefix: 'TranslationsService' });
    } catch (error: any) {
      logger.error('Error deleting branch category translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error deleting branch category translation');
    }
  }

  // Branch Product Addon Translations
  async getBranchProductAddonTranslations(branchProductAddonId: number): Promise<BranchProductAddonTranslation[]> {
    try {
      logger.info('Fetching branch product addon translations', { branchProductAddonId }, { prefix: 'TranslationsService' });
      const response = await httpClient.get<BranchProductAddonTranslation[]>(`${this.baseUrl}/branch-product-addon-translations/${branchProductAddonId}`);
      logger.info('Branch product addon translations fetched successfully', { branchProductAddonId, count: response.data.length }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching branch product addon translations', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error fetching branch product addon translations');
    }
  }

  async getBranchProductAddonTranslation(branchProductAddonId: number, languageCode: string): Promise<BranchProductAddonTranslation> {
    try {
      logger.info('Fetching branch product addon translation', { branchProductAddonId, languageCode }, { prefix: 'TranslationsService' });
      const response = await httpClient.get<BranchProductAddonTranslation>(`${this.baseUrl}/branch-product-addon-translations/${branchProductAddonId}/${languageCode}`);
      logger.info('Branch product addon translation fetched successfully', { branchProductAddonId, languageCode }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching branch product addon translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error fetching branch product addon translation');
    }
  }

  async upsertBranchProductAddonTranslation(data: UpsertBranchProductAddonTranslationDto): Promise<BranchProductAddonTranslation> {
    try {
      logger.info('Upserting branch product addon translation', { data }, { prefix: 'TranslationsService' });
      const response = await httpClient.put<BranchProductAddonTranslation>(`${this.baseUrl}/branch-product-addon-translations`, data);
      logger.info('Branch product addon translation upserted successfully', { data }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error upserting branch product addon translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error upserting branch product addon translation');
    }
  }

  async batchUpsertBranchProductAddonTranslations(data: BatchUpsertBranchProductAddonTranslationsDto): Promise<BranchProductAddonTranslation[]> {
    try {
      logger.info('Batch upserting branch product addon translations', { count: data.translations.length }, { prefix: 'TranslationsService' });
      const response = await httpClient.put<BranchProductAddonTranslation[]>(`${this.baseUrl}/branch-product-addon-translations/batch`, data);
      logger.info('Branch product addon translations batch upserted successfully', { count: data.translations.length }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error batch upserting branch product addon translations', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error batch upserting branch product addon translations');
    }
  }

  async deleteBranchProductAddonTranslation(branchProductAddonId: number, languageCode: string): Promise<void> {
    try {
      logger.info('Deleting branch product addon translation', { branchProductAddonId, languageCode }, { prefix: 'TranslationsService' });
      await httpClient.delete(`${this.baseUrl}/branch-product-addon-translations/${branchProductAddonId}/${languageCode}`);
      logger.info('Branch product addon translation deleted successfully', { branchProductAddonId, languageCode }, { prefix: 'TranslationsService' });
    } catch (error: any) {
      logger.error('Error deleting branch product addon translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error deleting branch product addon translation');
    }
  }

  // Branch Translations
  async getBranchTranslations(branchId: number): Promise<BranchTranslation[]> {
    try {
      logger.info('Fetching branch translations', { branchId }, { prefix: 'TranslationsService' });
      const response = await httpClient.get<BranchTranslation[]>(`${this.baseUrl}/branch-translations/${branchId}`);
      logger.info('Branch translations fetched successfully', { branchId, count: response.data.length }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching branch translations', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error fetching branch translations');
    }
  }

  async getBranchTranslation(branchId: number, languageCode: string): Promise<BranchTranslation> {
    try {
      logger.info('Fetching branch translation', { branchId, languageCode }, { prefix: 'TranslationsService' });
      const response = await httpClient.get<BranchTranslation>(`${this.baseUrl}/branch-translations/${branchId}/${languageCode}`);
      logger.info('Branch translation fetched successfully', { branchId, languageCode }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching branch translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error fetching branch translation');
    }
  }

  async upsertBranchTranslation(data: UpsertBranchTranslationDto): Promise<BranchTranslation> {
    try {
      logger.info('Upserting branch translation', { data }, { prefix: 'TranslationsService' });
      const response = await httpClient.put<BranchTranslation>(`${this.baseUrl}/branch-translations`, data);
      logger.info('Branch translation upserted successfully', { data }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error upserting branch translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error upserting branch translation');
    }
  }

  async batchUpsertBranchTranslations(data: BatchUpsertBranchTranslationsDto): Promise<BranchTranslation[]> {
    try {
      logger.info('Batch upserting branch translations', { count: data.translations.length }, { prefix: 'TranslationsService' });
      const response = await httpClient.put<BranchTranslation[]>(`${this.baseUrl}/branch-translations/batch`, data);
      logger.info('Branch translations batch upserted successfully', { count: data.translations.length }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error batch upserting branch translations', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error batch upserting branch translations');
    }
  }

  async deleteBranchTranslation(branchId: number, languageCode: string): Promise<void> {
    try {
      logger.info('Deleting branch translation', { branchId, languageCode }, { prefix: 'TranslationsService' });
      await httpClient.delete(`${this.baseUrl}/branch-translations/${branchId}/${languageCode}`);
      logger.info('Branch translation deleted successfully', { branchId, languageCode }, { prefix: 'TranslationsService' });
    } catch (error: any) {
      logger.error('Error deleting branch translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error deleting branch translation');
    }
  }

  // Category Translations
  async getCategoryTranslations(categoryId: number): Promise<CategoryTranslation[]> {
    try {
      logger.info('Fetching category translations', { categoryId }, { prefix: 'TranslationsService' });
      const response = await httpClient.get<CategoryTranslation[]>(`${this.baseUrl}/category-translations/${categoryId}`);
      logger.info('Category translations fetched successfully', { categoryId, count: response.data.length }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching category translations', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error fetching category translations');
    }
  }

  async getCategoryTranslation(categoryId: number, languageCode: string): Promise<CategoryTranslation> {
    try {
      logger.info('Fetching category translation', { categoryId, languageCode }, { prefix: 'TranslationsService' });
      const response = await httpClient.get<CategoryTranslation>(`${this.baseUrl}/category-translations/${categoryId}/${languageCode}`);
      logger.info('Category translation fetched successfully', { categoryId, languageCode }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching category translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error fetching category translation');
    }
  }

  async upsertCategoryTranslation(data: UpsertCategoryTranslationDto): Promise<CategoryTranslation> {
    try {
      logger.info('Upserting category translation', { data }, { prefix: 'TranslationsService' });
      const response = await httpClient.put<CategoryTranslation>(`${this.baseUrl}/category-translations`, data);
      logger.info('Category translation upserted successfully', { data }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error upserting category translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error upserting category translation');
    }
  }

  async batchUpsertCategoryTranslations(data: BatchUpsertCategoryTranslationsDto): Promise<CategoryTranslation[]> {
    try {
      logger.info('Batch upserting category translations', { count: data.translations.length }, { prefix: 'TranslationsService' });
      const response = await httpClient.put<CategoryTranslation[]>(`${this.baseUrl}/category-translations/batch`, data);
      logger.info('Category translations batch upserted successfully', { count: data.translations.length }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error batch upserting category translations', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error batch upserting category translations');
    }
  }

  async deleteCategoryTranslation(categoryId: number, languageCode: string): Promise<void> {
    try {
      logger.info('Deleting category translation', { categoryId, languageCode }, { prefix: 'TranslationsService' });
      await httpClient.delete(`${this.baseUrl}/category-translations/${categoryId}/${languageCode}`);
      logger.info('Category translation deleted successfully', { categoryId, languageCode }, { prefix: 'TranslationsService' });
    } catch (error: any) {
      logger.error('Error deleting category translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error deleting category translation');
    }
  }

  // Contact Translations
  async getContactTranslations(contactId: number): Promise<ContactTranslation[]> {
    try {
      logger.info('Fetching contact translations', { contactId }, { prefix: 'TranslationsService' });
      const response = await httpClient.get<ContactTranslation[]>(`${this.baseUrl}/contact-translations/${contactId}`);
      logger.info('Contact translations fetched successfully', { contactId, count: response.data.length }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching contact translations', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error fetching contact translations');
    }
  }

  async getContactTranslation(contactId: number, languageCode: string): Promise<ContactTranslation> {
    try {
      logger.info('Fetching contact translation', { contactId, languageCode }, { prefix: 'TranslationsService' });
      const response = await httpClient.get<ContactTranslation>(`${this.baseUrl}/contact-translations/${contactId}/${languageCode}`);
      logger.info('Contact translation fetched successfully', { contactId, languageCode }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching contact translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error fetching contact translation');
    }
  }

  async upsertContactTranslation(data: UpsertContactTranslationDto): Promise<ContactTranslation> {
    try {
      logger.info('Upserting contact translation', { data }, { prefix: 'TranslationsService' });
      const response = await httpClient.put<ContactTranslation>(`${this.baseUrl}/contact-translations`, data);
      logger.info('Contact translation upserted successfully', { data }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error upserting contact translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error upserting contact translation');
    }
  }

  async batchUpsertContactTranslations(data: BatchUpsertContactTranslationsDto): Promise<ContactTranslation[]> {
    try {
      logger.info('Batch upserting contact translations', { count: data.translations.length }, { prefix: 'TranslationsService' });
      const response = await httpClient.put<ContactTranslation[]>(`${this.baseUrl}/contact-translations/batch`, data);
      logger.info('Contact translations batch upserted successfully', { count: data.translations.length }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error batch upserting contact translations', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error batch upserting contact translations');
    }
  }

  async deleteContactTranslation(contactId: number, languageCode: string): Promise<void> {
    try {
      logger.info('Deleting contact translation', { contactId, languageCode }, { prefix: 'TranslationsService' });
      await httpClient.delete(`${this.baseUrl}/contact-translations/${contactId}/${languageCode}`);
      logger.info('Contact translation deleted successfully', { contactId, languageCode }, { prefix: 'TranslationsService' });
    } catch (error: any) {
      logger.error('Error deleting contact translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error deleting contact translation');
    }
  }

  // Discount Translations
  async getDiscountTranslations(discountId: number): Promise<DiscountTranslation[]> {
    try {
      logger.info('Fetching discount translations', { discountId }, { prefix: 'TranslationsService' });
      const response = await httpClient.get<DiscountTranslation[]>(`${this.baseUrl}/discount-translations/${discountId}`);
      logger.info('Discount translations fetched successfully', { discountId, count: response.data.length }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching discount translations', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error fetching discount translations');
    }
  }

  async getDiscountTranslation(discountId: number, languageCode: string): Promise<DiscountTranslation> {
    try {
      logger.info('Fetching discount translation', { discountId, languageCode }, { prefix: 'TranslationsService' });
      const response = await httpClient.get<DiscountTranslation>(`${this.baseUrl}/discount-translations/${discountId}/${languageCode}`);
      logger.info('Discount translation fetched successfully', { discountId, languageCode }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching discount translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error fetching discount translation');
    }
  }

  async upsertDiscountTranslation(data: UpsertDiscountTranslationDto): Promise<DiscountTranslation> {
    try {
      logger.info('Upserting discount translation', { data }, { prefix: 'TranslationsService' });
      const response = await httpClient.put<DiscountTranslation>(`${this.baseUrl}/discount-translations`, data);
      logger.info('Discount translation upserted successfully', { data }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error upserting discount translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error upserting discount translation');
    }
  }

  async batchUpsertDiscountTranslations(data: BatchUpsertDiscountTranslationsDto): Promise<DiscountTranslation[]> {
    try {
      logger.info('Batch upserting discount translations', { count: data.translations.length }, { prefix: 'TranslationsService' });
      const response = await httpClient.put<DiscountTranslation[]>(`${this.baseUrl}/discount-translations/batch`, data);
      logger.info('Discount translations batch upserted successfully', { count: data.translations.length }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error batch upserting discount translations', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error batch upserting discount translations');
    }
  }

  async deleteDiscountTranslation(discountId: number, languageCode: string): Promise<void> {
    try {
      logger.info('Deleting discount translation', { discountId, languageCode }, { prefix: 'TranslationsService' });
      await httpClient.delete(`${this.baseUrl}/discount-translations/${discountId}/${languageCode}`);
      logger.info('Discount translation deleted successfully', { discountId, languageCode }, { prefix: 'TranslationsService' });
    } catch (error: any) {
      logger.error('Error deleting discount translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error deleting discount translation');
    }
  }

  // Extra Category Translations
  async getExtraCategoryTranslations(extraCategoryId: number): Promise<ExtraCategoryTranslation[]> {
    try {
      logger.info('Fetching extra category translations', { extraCategoryId }, { prefix: 'TranslationsService' });
      const response = await httpClient.get<ExtraCategoryTranslation[]>(`${this.baseUrl}/extra-category-translations/${extraCategoryId}`);
      logger.info('Extra category translations fetched successfully', { extraCategoryId, count: response.data.length }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching extra category translations', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error fetching extra category translations');
    }
  }

  async getExtraCategoryTranslation(extraCategoryId: number, languageCode: string): Promise<ExtraCategoryTranslation> {
    try {
      logger.info('Fetching extra category translation', { extraCategoryId, languageCode }, { prefix: 'TranslationsService' });
      const response = await httpClient.get<ExtraCategoryTranslation>(`${this.baseUrl}/extra-category-translations/${extraCategoryId}/${languageCode}`);
      logger.info('Extra category translation fetched successfully', { extraCategoryId, languageCode }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching extra category translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error fetching extra category translation');
    }
  }

  async upsertExtraCategoryTranslation(data: UpsertExtraCategoryTranslationDto): Promise<ExtraCategoryTranslation> {
    try {
      logger.info('Upserting extra category translation', { data }, { prefix: 'TranslationsService' });
      const response = await httpClient.put<ExtraCategoryTranslation>(`${this.baseUrl}/extra-category-translations`, data);
      logger.info('Extra category translation upserted successfully', { data }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error upserting extra category translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error upserting extra category translation');
    }
  }

  async batchUpsertExtraCategoryTranslations(data: BatchUpsertExtraCategoryTranslationsDto): Promise<ExtraCategoryTranslation[]> {
    try {
      logger.info('Batch upserting extra category translations', { count: data.translations.length }, { prefix: 'TranslationsService' });
      const response = await httpClient.put<ExtraCategoryTranslation[]>(`${this.baseUrl}/extra-category-translations/batch`, data);
      logger.info('Extra category translations batch upserted successfully', { count: data.translations.length }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error batch upserting extra category translations', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error batch upserting extra category translations');
    }
  }

  async deleteExtraCategoryTranslation(extraCategoryId: number, languageCode: string): Promise<void> {
    try {
      logger.info('Deleting extra category translation', { extraCategoryId, languageCode }, { prefix: 'TranslationsService' });
      await httpClient.delete(`${this.baseUrl}/extra-category-translations/${extraCategoryId}/${languageCode}`);
      logger.info('Extra category translation deleted successfully', { extraCategoryId, languageCode }, { prefix: 'TranslationsService' });
    } catch (error: any) {
      logger.error('Error deleting extra category translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error deleting extra category translation');
    }
  }

  // Extra Translations
  async getExtraTranslations(extraId: number): Promise<ExtraTranslation[]> {
    try {
      logger.info('Fetching extra translations', { extraId }, { prefix: 'TranslationsService' });
      const response = await httpClient.get<ExtraTranslation[]>(`${this.baseUrl}/extra-translations/${extraId}`);
      logger.info('Extra translations fetched successfully', { extraId, count: response.data.length }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching extra translations', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error fetching extra translations');
    }
  }

  async getExtraTranslation(extraId: number, languageCode: string): Promise<ExtraTranslation> {
    try {
      logger.info('Fetching extra translation', { extraId, languageCode }, { prefix: 'TranslationsService' });
      const response = await httpClient.get<ExtraTranslation>(`${this.baseUrl}/extra-translations/${extraId}/${languageCode}`);
      logger.info('Extra translation fetched successfully', { extraId, languageCode }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching extra translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error fetching extra translation');
    }
  }

  async upsertExtraTranslation(data: UpsertExtraTranslationDto): Promise<ExtraTranslation> {
    try {
      logger.info('Upserting extra translation', { data }, { prefix: 'TranslationsService' });
      const response = await httpClient.put<ExtraTranslation>(`${this.baseUrl}/extra-translations`, data);
      logger.info('Extra translation upserted successfully', { data }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error upserting extra translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error upserting extra translation');
    }
  }

  async batchUpsertExtraTranslations(data: BatchUpsertExtraTranslationsDto): Promise<ExtraTranslation[]> {
    try {
      logger.info('Batch upserting extra translations', { count: data.translations.length }, { prefix: 'TranslationsService' });
      const response = await httpClient.put<ExtraTranslation[]>(`${this.baseUrl}/extra-translations/batch`, data);
      logger.info('Extra translations batch upserted successfully', { count: data.translations.length }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error batch upserting extra translations', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error batch upserting extra translations');
    }
  }

  async deleteExtraTranslation(extraId: number, languageCode: string): Promise<void> {
    try {
      logger.info('Deleting extra translation', { extraId, languageCode }, { prefix: 'TranslationsService' });
      await httpClient.delete(`${this.baseUrl}/extra-translations/${extraId}/${languageCode}`);
      logger.info('Extra translation deleted successfully', { extraId, languageCode }, { prefix: 'TranslationsService' });
    } catch (error: any) {
      logger.error('Error deleting extra translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error deleting extra translation');
    }
  }

  // Feature Translations
  async getFeatureTranslations(featureId: number): Promise<FeatureTranslation[]> {
    try {
      logger.info('Fetching feature translations', { featureId }, { prefix: 'TranslationsService' });
      const response = await httpClient.get<FeatureTranslation[]>(`${this.baseUrl}/feature-translations/${featureId}`);
      logger.info('Feature translations fetched successfully', { featureId, count: response.data.length }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching feature translations', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error fetching feature translations');
    }
  }

  async getFeatureTranslation(featureId: number, languageCode: string): Promise<FeatureTranslation> {
    try {
      logger.info('Fetching feature translation', { featureId, languageCode }, { prefix: 'TranslationsService' });
      const response = await httpClient.get<FeatureTranslation>(`${this.baseUrl}/feature-translations/${featureId}/${languageCode}`);
      logger.info('Feature translation fetched successfully', { featureId, languageCode }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching feature translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error fetching feature translation');
    }
  }

  async upsertFeatureTranslation(data: UpsertFeatureTranslationDto): Promise<FeatureTranslation> {
    try {
      logger.info('Upserting feature translation', { data }, { prefix: 'TranslationsService' });
      const response = await httpClient.put<FeatureTranslation>(`${this.baseUrl}/feature-translations`, data);
      logger.info('Feature translation upserted successfully', { data }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error upserting feature translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error upserting feature translation');
    }
  }

  async batchUpsertFeatureTranslations(data: BatchUpsertFeatureTranslationsDto): Promise<FeatureTranslation[]> {
    try {
      logger.info('Batch upserting feature translations', { count: data.translations.length }, { prefix: 'TranslationsService' });
      const response = await httpClient.put<FeatureTranslation[]>(`${this.baseUrl}/feature-translations/batch`, data);
      logger.info('Feature translations batch upserted successfully', { count: data.translations.length }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error batch upserting feature translations', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error batch upserting feature translations');
    }
  }

  async deleteFeatureTranslation(featureId: number, languageCode: string): Promise<void> {
    try {
      logger.info('Deleting feature translation', { featureId, languageCode }, { prefix: 'TranslationsService' });
      await httpClient.delete(`${this.baseUrl}/feature-translations/${featureId}/${languageCode}`);
      logger.info('Feature translation deleted successfully', { featureId, languageCode }, { prefix: 'TranslationsService' });
    } catch (error: any) {
      logger.error('Error deleting feature translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error deleting feature translation');
    }
  }

  // Ingredient Translations
  async getIngredientTranslations(ingredientId: number): Promise<IngredientTranslation[]> {
    try {
      logger.info('Fetching ingredient translations', { ingredientId }, { prefix: 'TranslationsService' });
      const response = await httpClient.get<IngredientTranslation[]>(`${this.baseUrl}/ingredient-translations/${ingredientId}`);
      logger.info('Ingredient translations fetched successfully', { ingredientId, count: response.data.length }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching ingredient translations', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error fetching ingredient translations');
    }
  }

  async getIngredientTranslation(ingredientId: number, languageCode: string): Promise<IngredientTranslation> {
    try {
      logger.info('Fetching ingredient translation', { ingredientId, languageCode }, { prefix: 'TranslationsService' });
      const response = await httpClient.get<IngredientTranslation>(`${this.baseUrl}/ingredient-translations/${ingredientId}/${languageCode}`);
      logger.info('Ingredient translation fetched successfully', { ingredientId, languageCode }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching ingredient translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error fetching ingredient translation');
    }
  }

  async upsertIngredientTranslation(data: UpsertIngredientTranslationDto): Promise<IngredientTranslation> {
    try {
      logger.info('Upserting ingredient translation', { data }, { prefix: 'TranslationsService' });
      const response = await httpClient.put<IngredientTranslation>(`${this.baseUrl}/ingredient-translations`, data);
      logger.info('Ingredient translation upserted successfully', { data }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error upserting ingredient translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error upserting ingredient translation');
    }
  }

  async batchUpsertIngredientTranslations(data: BatchUpsertIngredientTranslationsDto): Promise<IngredientTranslation[]> {
    try {
      logger.info('Batch upserting ingredient translations', { count: data.translations.length }, { prefix: 'TranslationsService' });
      const response = await httpClient.put<IngredientTranslation[]>(`${this.baseUrl}/ingredient-translations/batch`, data);
      logger.info('Ingredient translations batch upserted successfully', { count: data.translations.length }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error batch upserting ingredient translations', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error batch upserting ingredient translations');
    }
  }

  async deleteIngredientTranslation(ingredientId: number, languageCode: string): Promise<void> {
    try {
      logger.info('Deleting ingredient translation', { ingredientId, languageCode }, { prefix: 'TranslationsService' });
      await httpClient.delete(`${this.baseUrl}/ingredient-translations/${ingredientId}/${languageCode}`);
      logger.info('Ingredient translation deleted successfully', { ingredientId, languageCode }, { prefix: 'TranslationsService' });
    } catch (error: any) {
      logger.error('Error deleting ingredient translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error deleting ingredient translation');
    }
  }

  // Menu Table Category Translations
  async getMenuTableCategoryTranslations(menuTableCategoryId: number): Promise<MenuTableCategoryTranslation[]> {
    try {
      logger.info('Fetching menu table category translations', { menuTableCategoryId }, { prefix: 'TranslationsService' });
      const response = await httpClient.get<MenuTableCategoryTranslation[]>(`${this.baseUrl}/menu-table-category-translations/${menuTableCategoryId}`);
      logger.info('Menu table category translations fetched successfully', { menuTableCategoryId, count: response.data.length }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching menu table category translations', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error fetching menu table category translations');
    }
  }

  async getMenuTableCategoryTranslation(menuTableCategoryId: number, languageCode: string): Promise<MenuTableCategoryTranslation> {
    try {
      logger.info('Fetching menu table category translation', { menuTableCategoryId, languageCode }, { prefix: 'TranslationsService' });
      const response = await httpClient.get<MenuTableCategoryTranslation>(`${this.baseUrl}/menu-table-category-translations/${menuTableCategoryId}/${languageCode}`);
      logger.info('Menu table category translation fetched successfully', { menuTableCategoryId, languageCode }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching menu table category translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error fetching menu table category translation');
    }
  }

  async upsertMenuTableCategoryTranslation(data: UpsertMenuTableCategoryTranslationDto): Promise<MenuTableCategoryTranslation> {
    try {
      logger.info('Upserting menu table category translation', { data }, { prefix: 'TranslationsService' });
      const response = await httpClient.put<MenuTableCategoryTranslation>(`${this.baseUrl}/menu-table-category-translations`, data);
      logger.info('Menu table category translation upserted successfully', { data }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error upserting menu table category translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error upserting menu table category translation');
    }
  }

  async batchUpsertMenuTableCategoryTranslations(data: BatchUpsertMenuTableCategoryTranslationsDto): Promise<MenuTableCategoryTranslation[]> {
    try {
      logger.info('Batch upserting menu table category translations', { count: data.translations.length }, { prefix: 'TranslationsService' });
      const response = await httpClient.put<MenuTableCategoryTranslation[]>(`${this.baseUrl}/menu-table-category-translations/batch`, data);
      logger.info('Menu table category translations batch upserted successfully', { count: data.translations.length }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error batch upserting menu table category translations', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error batch upserting menu table category translations');
    }
  }

  async deleteMenuTableCategoryTranslation(menuTableCategoryId: number, languageCode: string): Promise<void> {
    try {
      logger.info('Deleting menu table category translation', { menuTableCategoryId, languageCode }, { prefix: 'TranslationsService' });
      await httpClient.delete(`${this.baseUrl}/menu-table-category-translations/${menuTableCategoryId}/${languageCode}`);
      logger.info('Menu table category translation deleted successfully', { menuTableCategoryId, languageCode }, { prefix: 'TranslationsService' });
    } catch (error: any) {
      logger.error('Error deleting menu table category translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error deleting menu table category translation');
    }
  }

  // Menu Table Translations
  async getMenuTableTranslations(menuTableId: number): Promise<MenuTableTranslation[]> {
    try {
      logger.info('Fetching menu table translations', { menuTableId }, { prefix: 'TranslationsService' });
      const response = await httpClient.get<MenuTableTranslation[]>(`${this.baseUrl}/menu-table-translations/${menuTableId}`);
      logger.info('Menu table translations fetched successfully', { menuTableId, count: response.data.length }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching menu table translations', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error fetching menu table translations');
    }
  }

  async getMenuTableTranslation(menuTableId: number, languageCode: string): Promise<MenuTableTranslation> {
    try {
      logger.info('Fetching menu table translation', { menuTableId, languageCode }, { prefix: 'TranslationsService' });
      const response = await httpClient.get<MenuTableTranslation>(`${this.baseUrl}/menu-table-translations/${menuTableId}/${languageCode}`);
      logger.info('Menu table translation fetched successfully', { menuTableId, languageCode }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching menu table translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error fetching menu table translation');
    }
  }

  async upsertMenuTableTranslation(data: UpsertMenuTableTranslationDto): Promise<MenuTableTranslation> {
    try {
      logger.info('Upserting menu table translation', { data }, { prefix: 'TranslationsService' });
      const response = await httpClient.put<MenuTableTranslation>(`${this.baseUrl}/menu-table-translations`, data);
      logger.info('Menu table translation upserted successfully', { data }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error upserting menu table translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error upserting menu table translation');
    }
  }

  async batchUpsertMenuTableTranslations(data: BatchUpsertMenuTableTranslationsDto): Promise<MenuTableTranslation[]> {
    try {
      logger.info('Batch upserting menu table translations', { count: data.translations.length }, { prefix: 'TranslationsService' });
      const response = await httpClient.put<MenuTableTranslation[]>(`${this.baseUrl}/menu-table-translations/batch`, data);
      logger.info('Menu table translations batch upserted successfully', { count: data.translations.length }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error batch upserting menu table translations', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error batch upserting menu table translations');
    }
  }

  async deleteMenuTableTranslation(menuTableId: number, languageCode: string): Promise<void> {
    try {
      logger.info('Deleting menu table translation', { menuTableId, languageCode }, { prefix: 'TranslationsService' });
      await httpClient.delete(`${this.baseUrl}/menu-table-translations/${menuTableId}/${languageCode}`);
      logger.info('Menu table translation deleted successfully', { menuTableId, languageCode }, { prefix: 'TranslationsService' });
    } catch (error: any) {
      logger.error('Error deleting menu table translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error deleting menu table translation');
    }
  }

  // Order Type Translations
  async getOrderTypeTranslations(orderTypeId: number): Promise<OrderTypeTranslation[]> {
    try {
      logger.info('Fetching order type translations', { orderTypeId }, { prefix: 'TranslationsService' });
      const response = await httpClient.get<OrderTypeTranslation[]>(`${this.baseUrl}/order-type-translations/${orderTypeId}`);
      logger.info('Order type translations fetched successfully', { orderTypeId, count: response.data.length }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching order type translations', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error fetching order type translations');
    }
  }

  async getOrderTypeTranslation(orderTypeId: number, languageCode: string): Promise<OrderTypeTranslation> {
    try {
      logger.info('Fetching order type translation', { orderTypeId, languageCode }, { prefix: 'TranslationsService' });
      const response = await httpClient.get<OrderTypeTranslation>(`${this.baseUrl}/order-type-translations/${orderTypeId}/${languageCode}`);
      logger.info('Order type translation fetched successfully', { orderTypeId, languageCode }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching order type translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error fetching order type translation');
    }
  }

  async upsertOrderTypeTranslation(data: UpsertOrderTypeTranslationDto): Promise<OrderTypeTranslation> {
    try {
      logger.info('Upserting order type translation', { data }, { prefix: 'TranslationsService' });
      const response = await httpClient.put<OrderTypeTranslation>(`${this.baseUrl}/order-type-translations`, data);
      logger.info('Order type translation upserted successfully', { data }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error upserting order type translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error upserting order type translation');
    }
  }

  async batchUpsertOrderTypeTranslations(data: BatchUpsertOrderTypeTranslationsDto): Promise<OrderTypeTranslation[]> {
    try {
      logger.info('Batch upserting order type translations', { count: data.translations.length }, { prefix: 'TranslationsService' });
      const response = await httpClient.put<OrderTypeTranslation[]>(`${this.baseUrl}/order-type-translations/batch`, data);
      logger.info('Order type translations batch upserted successfully', { count: data.translations.length }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error batch upserting order type translations', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error batch upserting order type translations');
    }
  }

  async deleteOrderTypeTranslation(orderTypeId: number, languageCode: string): Promise<void> {
    try {
      logger.info('Deleting order type translation', { orderTypeId, languageCode }, { prefix: 'TranslationsService' });
      await httpClient.delete(`${this.baseUrl}/order-type-translations/${orderTypeId}/${languageCode}`);
      logger.info('Order type translation deleted successfully', { orderTypeId, languageCode }, { prefix: 'TranslationsService' });
    } catch (error: any) {
      logger.error('Error deleting order type translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error deleting order type translation');
    }
  }

  // Product Addon Translations
  async getProductAddonTranslations(productAddonId: number): Promise<ProductAddonTranslation[]> {
    try {
      logger.info('Fetching product addon translations', { productAddonId }, { prefix: 'TranslationsService' });
      const response = await httpClient.get<ProductAddonTranslation[]>(`${this.baseUrl}/product-addon-translations/${productAddonId}`);
      logger.info('Product addon translations fetched successfully', { productAddonId, count: response.data.length }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching product addon translations', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error fetching product addon translations');
    }
  }

  async getProductAddonTranslation(productAddonId: number, languageCode: string): Promise<ProductAddonTranslation> {
    try {
      logger.info('Fetching product addon translation', { productAddonId, languageCode }, { prefix: 'TranslationsService' });
      const response = await httpClient.get<ProductAddonTranslation>(`${this.baseUrl}/product-addon-translations/${productAddonId}/${languageCode}`);
      logger.info('Product addon translation fetched successfully', { productAddonId, languageCode }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching product addon translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error fetching product addon translation');
    }
  }

  async upsertProductAddonTranslation(data: UpsertProductAddonTranslationDto): Promise<ProductAddonTranslation> {
    try {
      logger.info('Upserting product addon translation', { data }, { prefix: 'TranslationsService' });
      const response = await httpClient.put<ProductAddonTranslation>(`${this.baseUrl}/product-addon-translations`, data);
      logger.info('Product addon translation upserted successfully', { data }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error upserting product addon translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error upserting product addon translation');
    }
  }

  async batchUpsertProductAddonTranslations(data: BatchUpsertProductAddonTranslationsDto): Promise<ProductAddonTranslation[]> {
    try {
      logger.info('Batch upserting product addon translations', { count: data.translations.length }, { prefix: 'TranslationsService' });
      const response = await httpClient.put<ProductAddonTranslation[]>(`${this.baseUrl}/product-addon-translations/batch`, data);
      logger.info('Product addon translations batch upserted successfully', { count: data.translations.length }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error batch upserting product addon translations', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error batch upserting product addon translations');
    }
  }

  async deleteProductAddonTranslation(productAddonId: number, languageCode: string): Promise<void> {
    try {
      logger.info('Deleting product addon translation', { productAddonId, languageCode }, { prefix: 'TranslationsService' });
      await httpClient.delete(`${this.baseUrl}/product-addon-translations/${productAddonId}/${languageCode}`);
      logger.info('Product addon translation deleted successfully', { productAddonId, languageCode }, { prefix: 'TranslationsService' });
    } catch (error: any) {
      logger.error('Error deleting product addon translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error deleting product addon translation');
    }
  }

  // Product Translations
  async getProductTranslations(productId: number): Promise<ProductTranslation[]> {
    try {
      logger.info('Fetching product translations', { productId }, { prefix: 'TranslationsService' });
      const response = await httpClient.get<ProductTranslation[]>(`${this.baseUrl}/product-translations/${productId}`);
      logger.info('Product translations fetched successfully', { productId, count: response.data.length }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching product translations', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error fetching product translations');
    }
  }

  async getProductTranslation(productId: number, languageCode: string): Promise<ProductTranslation> {
    try {
      logger.info('Fetching product translation', { productId, languageCode }, { prefix: 'TranslationsService' });
      const response = await httpClient.get<ProductTranslation>(`${this.baseUrl}/product-translations/${productId}/${languageCode}`);
      logger.info('Product translation fetched successfully', { productId, languageCode }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching product translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error fetching product translation');
    }
  }

  async upsertProductTranslation(data: UpsertProductTranslationDto): Promise<ProductTranslation> {
    try {
      logger.info('Upserting product translation', { data }, { prefix: 'TranslationsService' });
      const response = await httpClient.put<ProductTranslation>(`${this.baseUrl}/product-translations`, data);
      logger.info('Product translation upserted successfully', { data }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error upserting product translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error upserting product translation');
    }
  }

  async batchUpsertProductTranslations(data: BatchUpsertProductTranslationsDto): Promise<ProductTranslation[]> {
    try {
      logger.info('Batch upserting product translations', { count: data.translations.length }, { prefix: 'TranslationsService' });
      const response = await httpClient.put<ProductTranslation[]>(`${this.baseUrl}/product-translations/batch`, data);
      logger.info('Product translations batch upserted successfully', { count: data.translations.length }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error batch upserting product translations', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error batch upserting product translations');
    }
  }

  async deleteProductTranslation(productId: number, languageCode: string): Promise<void> {
    try {
      logger.info('Deleting product translation', { productId, languageCode }, { prefix: 'TranslationsService' });
      await httpClient.delete(`${this.baseUrl}/product-translations/${productId}/${languageCode}`);
      logger.info('Product translation deleted successfully', { productId, languageCode }, { prefix: 'TranslationsService' });
    } catch (error: any) {
      logger.error('Error deleting product translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error deleting product translation');
    }
  }

  // Restaurant Translations
  async getRestaurantTranslations(): Promise<RestaurantTranslation[]> {
    try {
      logger.info('Fetching restaurant translations', {}, { prefix: 'TranslationsService' });
      const response = await httpClient.get<RestaurantTranslation[]>(`${this.baseUrl}/restaurant-translations`);
      logger.info('Restaurant translations fetched successfully', { count: response.data.length }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching restaurant translations', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error fetching restaurant translations');
    }
  }

  async getRestaurantTranslation(languageCode: string): Promise<RestaurantTranslation> {
    try {
      logger.info('Fetching restaurant translation', { languageCode }, { prefix: 'TranslationsService' });
      const response = await httpClient.get<RestaurantTranslation>(`${this.baseUrl}/restaurant-translations/${languageCode}`);
      logger.info('Restaurant translation fetched successfully', { languageCode }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching restaurant translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error fetching restaurant translation');
    }
  }

  async upsertRestaurantTranslation(data: UpsertRestaurantTranslationDto): Promise<RestaurantTranslation> {
    try {
      logger.info('Upserting restaurant translation', { data }, { prefix: 'TranslationsService' });
      const response = await httpClient.put<RestaurantTranslation>(`${this.baseUrl}/restaurant-translations`, data);
      logger.info('Restaurant translation upserted successfully', { data }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error upserting restaurant translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error upserting restaurant translation');
    }
  }

  async batchUpsertRestaurantTranslations(data: BatchUpsertRestaurantTranslationsDto): Promise<RestaurantTranslation[]> {
    try {
      logger.info('Batch upserting restaurant translations', { count: data.translations.length }, { prefix: 'TranslationsService' });
      const response = await httpClient.put<RestaurantTranslation[]>(`${this.baseUrl}/restaurant-translations/batch`, data);
      logger.info('Restaurant translations batch upserted successfully', { count: data.translations.length }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error batch upserting restaurant translations', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error batch upserting restaurant translations');
    }
  }

  async deleteRestaurantTranslation(languageCode: string): Promise<void> {
    try {
      logger.info('Deleting restaurant translation', { languageCode }, { prefix: 'TranslationsService' });
      await httpClient.delete(`${this.baseUrl}/restaurant-translations/${languageCode}`);
      logger.info('Restaurant translation deleted successfully', { languageCode }, { prefix: 'TranslationsService' });
    } catch (error: any) {
      logger.error('Error deleting restaurant translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error deleting restaurant translation');
    }
  }

  // Slider Translations
  async getSliderTranslations(sliderId: number): Promise<SliderTranslation[]> {
    try {
      logger.info('Fetching slider translations', { sliderId }, { prefix: 'TranslationsService' });
      const response = await httpClient.get<SliderTranslation[]>(`${this.baseUrl}/slider-translations/${sliderId}`);
      logger.info('Slider translations fetched successfully', { sliderId, count: response.data.length }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching slider translations', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error fetching slider translations');
    }
  }

  async getSliderTranslation(sliderId: number, languageCode: string): Promise<SliderTranslation> {
    try {
      logger.info('Fetching slider translation', { sliderId, languageCode }, { prefix: 'TranslationsService' });
      const response = await httpClient.get<SliderTranslation>(`${this.baseUrl}/slider-translations/${sliderId}/${languageCode}`);
      logger.info('Slider translation fetched successfully', { sliderId, languageCode }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching slider translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error fetching slider translation');
    }
  }

  async upsertSliderTranslation(data: UpsertSliderTranslationDto): Promise<SliderTranslation> {
    try {
      logger.info('Upserting slider translation', { data }, { prefix: 'TranslationsService' });
      const response = await httpClient.put<SliderTranslation>(`${this.baseUrl}/slider-translations`, data);
      logger.info('Slider translation upserted successfully', { data }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error upserting slider translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error upserting slider translation');
    }
  }

  async batchUpsertSliderTranslations(data: BatchUpsertSliderTranslationsDto): Promise<SliderTranslation[]> {
    try {
      logger.info('Batch upserting slider translations', { count: data.translations.length }, { prefix: 'TranslationsService' });
      const response = await httpClient.put<SliderTranslation[]>(`${this.baseUrl}/slider-translations/batch`, data);
      logger.info('Slider translations batch upserted successfully', { count: data.translations.length }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error batch upserting slider translations', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error batch upserting slider translations');
    }
  }

  async deleteSliderTranslation(sliderId: number, languageCode: string): Promise<void> {
    try {
      logger.info('Deleting slider translation', { sliderId, languageCode }, { prefix: 'TranslationsService' });
      await httpClient.delete(`${this.baseUrl}/slider-translations/${sliderId}/${languageCode}`);
      logger.info('Slider translation deleted successfully', { sliderId, languageCode }, { prefix: 'TranslationsService' });
    } catch (error: any) {
      logger.error('Error deleting slider translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error deleting slider translation');
    }
  }

  // Social Media Translations
  async getSocialMediaTranslations(socialMediaId: number): Promise<SocialMediaTranslation[]> {
    try {
      logger.info('Fetching social media translations', { socialMediaId }, { prefix: 'TranslationsService' });
      const response = await httpClient.get<SocialMediaTranslation[]>(`${this.baseUrl}/social-media-translations/${socialMediaId}`);
      logger.info('Social media translations fetched successfully', { socialMediaId, count: response.data.length }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching social media translations', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error fetching social media translations');
    }
  }

  async getSocialMediaTranslation(socialMediaId: number, languageCode: string): Promise<SocialMediaTranslation> {
    try {
      logger.info('Fetching social media translation', { socialMediaId, languageCode }, { prefix: 'TranslationsService' });
      const response = await httpClient.get<SocialMediaTranslation>(`${this.baseUrl}/social-media-translations/${socialMediaId}/${languageCode}`);
      logger.info('Social media translation fetched successfully', { socialMediaId, languageCode }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching social media translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error fetching social media translation');
    }
  }

  async upsertSocialMediaTranslation(data: UpsertSocialMediaTranslationDto): Promise<SocialMediaTranslation> {
    try {
      logger.info('Upserting social media translation', { data }, { prefix: 'TranslationsService' });
      const response = await httpClient.put<SocialMediaTranslation>(`${this.baseUrl}/social-media-translations`, data);
      logger.info('Social media translation upserted successfully', { data }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error upserting social media translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error upserting social media translation');
    }
  }

  async batchUpsertSocialMediaTranslations(data: BatchUpsertSocialMediaTranslationsDto): Promise<SocialMediaTranslation[]> {
    try {
      logger.info('Batch upserting social media translations', { count: data.translations.length }, { prefix: 'TranslationsService' });
      const response = await httpClient.put<SocialMediaTranslation[]>(`${this.baseUrl}/social-media-translations/batch`, data);
      logger.info('Social media translations batch upserted successfully', { count: data.translations.length }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error batch upserting social media translations', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error batch upserting social media translations');
    }
  }

  async deleteSocialMediaTranslation(socialMediaId: number, languageCode: string): Promise<void> {
    try {
      logger.info('Deleting social media translation', { socialMediaId, languageCode }, { prefix: 'TranslationsService' });
      await httpClient.delete(`${this.baseUrl}/social-media-translations/${socialMediaId}/${languageCode}`);
      logger.info('Social media translation deleted successfully', { socialMediaId, languageCode }, { prefix: 'TranslationsService' });
    } catch (error: any) {
      logger.error('Error deleting social media translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error deleting social media translation');
    }
  }

  // Testimonial Translations
  async getTestimonialTranslations(testimonialId: number): Promise<TestimonialTranslation[]> {
    try {
      logger.info('Fetching testimonial translations', { testimonialId }, { prefix: 'TranslationsService' });
      const response = await httpClient.get<TestimonialTranslation[]>(`${this.baseUrl}/testimonial-translations/${testimonialId}`);
      logger.info('Testimonial translations fetched successfully', { testimonialId, count: response.data.length }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching testimonial translations', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error fetching testimonial translations');
    }
  }

  async getTestimonialTranslation(testimonialId: number, languageCode: string): Promise<TestimonialTranslation> {
    try {
      logger.info('Fetching testimonial translation', { testimonialId, languageCode }, { prefix: 'TranslationsService' });
      const response = await httpClient.get<TestimonialTranslation>(`${this.baseUrl}/testimonial-translations/${testimonialId}/${languageCode}`);
      logger.info('Testimonial translation fetched successfully', { testimonialId, languageCode }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error fetching testimonial translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error fetching testimonial translation');
    }
  }

  async upsertTestimonialTranslation(data: UpsertTestimonialTranslationDto): Promise<TestimonialTranslation> {
    try {
      logger.info('Upserting testimonial translation', { data }, { prefix: 'TranslationsService' });
      const response = await httpClient.put<TestimonialTranslation>(`${this.baseUrl}/testimonial-translations`, data);
      logger.info('Testimonial translation upserted successfully', { data }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error upserting testimonial translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error upserting testimonial translation');
    }
  }

  async batchUpsertTestimonialTranslations(data: BatchUpsertTestimonialTranslationsDto): Promise<TestimonialTranslation[]> {
    try {
      logger.info('Batch upserting testimonial translations', { count: data.translations.length }, { prefix: 'TranslationsService' });
      const response = await httpClient.put<TestimonialTranslation[]>(`${this.baseUrl}/testimonial-translations/batch`, data);
      logger.info('Testimonial translations batch upserted successfully', { count: data.translations.length }, { prefix: 'TranslationsService' });
      return response.data;
    } catch (error: any) {
      logger.error('Error batch upserting testimonial translations', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error batch upserting testimonial translations');
    }
  }

  async deleteTestimonialTranslation(testimonialId: number, languageCode: string): Promise<void> {
    try {
      logger.info('Deleting testimonial translation', { testimonialId, languageCode }, { prefix: 'TranslationsService' });
      await httpClient.delete(`${this.baseUrl}/testimonial-translations/${testimonialId}/${languageCode}`);
      logger.info('Testimonial translation deleted successfully', { testimonialId, languageCode }, { prefix: 'TranslationsService' });
    } catch (error: any) {
      logger.error('Error deleting testimonial translation', error, { prefix: 'TranslationsService' });
      throw this.handleError(error, 'Error deleting testimonial translation');
    }
  }

  private handleError(error: any, defaultMessage: string): never {
    if (error?.response?.status === 400) {
      const errorData = error?.response?.data;
      if (errorData?.errors) {
        const validationErrors = Object.values(errorData.errors).flat();
        throw new Error(`Validation error: ${validationErrors.join(', ')}`);
      } else {
        throw new Error(error.message || defaultMessage);
      }
    } else if (error?.response?.status === 401) {
      throw new Error('Session expired. Please log in again.');
    } else if (error?.response?.status === 403) {
      throw new Error('You do not have permission for this operation.');
    } else if (error?.response?.status === 404) {
      throw new Error('Translation not found.');
    } else if (error?.response?.status === 0 || !navigator.onLine) {
      throw new Error('Please check your internet connection.');
    } else {
      throw new Error(`${defaultMessage}: ${error?.message || 'Unknown error'}`);
    }
  }
}

export const translationsService = new TranslationsService();
