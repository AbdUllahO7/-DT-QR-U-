import { useEffect, useState } from 'react';

/**
 * useDebounce
 * Belirtilen gecikme süresi boyunca değerde değişiklik olmazsa güncellenen bir state döndürür.
 * Özellikle arama inputları gibi yoğun güncellenen verilerde API çağrılarını azaltmak için kullanılır.
 *
 * @param value İzlenecek değer
 * @param delay Gecikme süresi (ms)
 * @returns Debounce edilmiş değer
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
} 