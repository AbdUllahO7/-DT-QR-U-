import { useState, useEffect } from 'react';
import { currencyService } from '../services/CurrencyService';

interface CurrencyData {
  code: string;
  symbol: string;
  displayName: string;
}

/**
 * Custom hook to access the selected currency
 * Fetches from API first, then falls back to localStorage
 * Returns the currency symbol, code, and display name
 */
export const useCurrency = () => {
  const [currency, setCurrency] = useState<CurrencyData>({
    code: 'TRY',
    symbol: '₺',
    displayName: 'Turkish Lira'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load currency from API or localStorage
    const loadCurrency = async () => {
      // First, try to load from localStorage immediately (faster UX)
      try {
        const stored = localStorage.getItem('selectedCurrency');
        if (stored) {
          const parsed: CurrencyData = JSON.parse(stored);
          setCurrency(parsed);
        }
      } catch (storageError) {
        console.error('Error loading currency from localStorage:', storageError);
      }

      // Then try to fetch fresh data from API in the background
      try {
        const sessionCurrency = await currencyService.getSessionCurrency();
        const currencyData: CurrencyData = {
          code: sessionCurrency.code,
          symbol: sessionCurrency.symbol,
          displayName: sessionCurrency.displayName
        };

        setCurrency(currencyData);

        // Save to localStorage for next time
        localStorage.setItem('selectedCurrency', JSON.stringify(currencyData));
      } catch (error: any) {
        // Silently fail on currency API errors - don't let them trigger logout
        // Currency is not critical enough to interrupt the user's session
        console.warn('Currency API call failed, using cached currency:', error?.message || error);
      } finally {
        setIsLoading(false);
      }
    };

    // Load on mount
    loadCurrency();

    // Listen for storage changes (when currency is updated in another tab or component)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'selectedCurrency' && e.newValue) {
        try {
          const parsed: CurrencyData = JSON.parse(e.newValue);
          setCurrency(parsed);
        } catch (error) {
          console.error('Error parsing currency from storage event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return { ...currency, isLoading };
};

/**
 * Format a number with the current currency symbol
 * @param amount - The amount to format
 * @param showCode - Whether to show the currency code alongside the symbol
 */
export const formatCurrency = (amount: number, symbol: string = '₺', showCode: boolean = false, code?: string): string => {
  const formattedAmount = amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  if (showCode && code) {
    return `${symbol}${formattedAmount} ${code}`;
  }

  return `${symbol}${formattedAmount}`;
};
