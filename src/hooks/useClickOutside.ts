import { useEffect, RefObject } from 'react';

/**
 * useClickOutside
 * Verilen ref dışındaki tıklamaları yakalar ve callback'i tetikler.
 * @param ref İzlenen DOM elementi
 * @param callback Dış tıklamada çalışacak fonksiyon
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  callback: (e: MouseEvent | TouchEvent) => void,
): void {
  useEffect(() => {
    const handler = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback(event);
      }
    };

    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);

    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [ref, callback]);
} 