import React, { createContext, useContext, useEffect, useState } from 'react';
import { languageService } from '../services/LanguageService';
import { restaurantPreferencesService } from '../services/RestaurantPreferencesService';
import { LanguageOptionDto } from '../types/Language/type';
import { availableLanguages as allLanguages } from '../constants/availableLanguages';

interface RestaurantLanguagesContextType {
  enabledLanguages: LanguageOptionDto[];
  defaultLanguage: string;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const RestaurantLanguagesContext = createContext<RestaurantLanguagesContextType | undefined>(undefined);

export const useRestaurantLanguages = (): RestaurantLanguagesContextType => {
  const context = useContext(RestaurantLanguagesContext);
  if (!context) {
    throw new Error('useRestaurantLanguages must be used within a RestaurantLanguagesProvider');
  }
  return context;
};

interface RestaurantLanguagesProviderProps {
  children: React.ReactNode;
}

export const RestaurantLanguagesProvider: React.FC<RestaurantLanguagesProviderProps> = ({ children }) => {
  const [enabledLanguages, setEnabledLanguages] = useState<LanguageOptionDto[]>([]);
  const [defaultLanguage, setDefaultLanguage] = useState<string>('en');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurantLanguages = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch restaurant preferences first
      try {
        const preferences = await restaurantPreferencesService.getRestaurantPreferences();

        if (preferences.availableLanguages && preferences.availableLanguages.length > 0) {
          setEnabledLanguages(preferences.availableLanguages);
          setDefaultLanguage(preferences.defaultLanguage || 'en');
          return;
        }
      } catch (prefError) {
        console.warn('Could not fetch restaurant preferences, trying restaurant languages:', prefError);
      }

      // Fallback to languageService
      try {
        const restaurantLanguages = await languageService.getRestaurantLanguages();

        if (restaurantLanguages.availableLanguages && restaurantLanguages.availableLanguages.length > 0) {
          setEnabledLanguages(restaurantLanguages.availableLanguages);
          setDefaultLanguage(restaurantLanguages.defaultLanguage || 'en');
          return;
        }
      } catch (langError) {
        console.warn('Could not fetch restaurant languages:', langError);
      }

      // Final fallback: Use default languages (en, tr, ar)
      const defaultLanguageCodes = ['en', 'tr', 'ar'];
      const defaultEnabledLanguages = allLanguages.filter(lang =>
        defaultLanguageCodes.includes(lang.code)
      );

      setEnabledLanguages(defaultEnabledLanguages);
      setDefaultLanguage('en');

    } catch (err) {
      console.error('Error fetching restaurant languages:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch languages');

      // Even on error, provide default languages
      const defaultLanguageCodes = ['en', 'tr', 'ar'];
      const defaultEnabledLanguages = allLanguages.filter(lang =>
        defaultLanguageCodes.includes(lang.code)
      );
      setEnabledLanguages(defaultEnabledLanguages);
      setDefaultLanguage('en');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurantLanguages();
  }, []);

  const value: RestaurantLanguagesContextType = {
    enabledLanguages,
    defaultLanguage,
    loading,
    error,
    refetch: fetchRestaurantLanguages,
  };

  return (
    <RestaurantLanguagesContext.Provider value={value}>
      {children}
    </RestaurantLanguagesContext.Provider>
  );
};
