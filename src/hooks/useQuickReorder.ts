/**
 * Quick Reorder Hook - Frontend Only
 * Stores order history in localStorage and allows quick reorder
 * Supports context isolation between Menu and OnlineMenu
 */

import { useState, useCallback, useEffect } from 'react';
import { MenuProduct } from '../types/menu/type';

export type MenuContext = 'menu' | 'onlineMenu' | 'tableQR';

export interface OrderHistoryItem {
  orderId: string;
  orderTag?: string;
  orderDate: string;
  items: OrderedProduct[];
  totalPrice: number;
  orderTypeName?: string;
}

export interface OrderedProduct {
  branchProductId: number;
  productName: string;
  productImageUrl?: string;
  price: number;
  quantity: number;
  addons?: {
    branchProductAddonId: number;
    addonName: string;
    price: number;
    quantity: number;
  }[];
  extras?: {
    branchProductExtraId: number;
    extraName: string;
    isRemoval: boolean;
    quantity: number;
    unitPrice: number;
  }[];
}

interface QuickReorderSettings {
  maxHistoryItems: number;
  enabled: boolean;
}

// Context-specific storage keys to prevent session confusion
const getStorageKey = (context: MenuContext) => `qrmenu_order_history_${context}`;
const getSettingsKey = (context: MenuContext) => `qrmenu_quick_reorder_settings_${context}`;
const MAX_HISTORY_DEFAULT = 10;

const DEFAULT_SETTINGS: QuickReorderSettings = {
  maxHistoryItems: MAX_HISTORY_DEFAULT,
  enabled: true,
};

export const useQuickReorder = (context: MenuContext = 'menu') => {
  const [orderHistory, setOrderHistory] = useState<OrderHistoryItem[]>([]);
  const [settings, setSettings] = useState<QuickReorderSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Get context-specific storage keys
  const storageKey = getStorageKey(context);
  const settingsKey = getSettingsKey(context);

  // Load from localStorage
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(storageKey);
      const storedSettings = localStorage.getItem(settingsKey);

      if (storedHistory) {
        const parsed = JSON.parse(storedHistory) as OrderHistoryItem[];
        setOrderHistory(parsed);
      }

      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
    } catch (error) {
      console.error('Error loading order history:', error);
    }
    setIsLoaded(true);
  }, [storageKey, settingsKey]);

  // Save to localStorage when history changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(storageKey, JSON.stringify(orderHistory));
    }
  }, [orderHistory, isLoaded, storageKey]);

  // Save settings
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(settingsKey, JSON.stringify(settings));
    }
  }, [settings, isLoaded, settingsKey]);

  // Add order to history
  const addToHistory = useCallback((order: OrderHistoryItem) => {
    if (!settings.enabled) return;

    setOrderHistory((prev) => {
      // Check if order already exists (by orderTag or orderId)
      const exists = prev.some(
        (o) => (order.orderTag && o.orderTag === order.orderTag) || o.orderId === order.orderId
      );

      if (exists) {
        return prev;
      }

      // Add new order at the beginning, limit to maxHistoryItems
      const newHistory = [order, ...prev].slice(0, settings.maxHistoryItems);
      return newHistory;
    });
  }, [settings]);

  // Clear history
  const clearHistory = useCallback(() => {
    setOrderHistory([]);
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  // Remove specific order from history
  const removeFromHistory = useCallback((orderId: string) => {
    setOrderHistory((prev) => prev.filter((o) => o.orderId !== orderId));
  }, []);

  // Get last order
  const getLastOrder = useCallback((): OrderHistoryItem | null => {
    return orderHistory.length > 0 ? orderHistory[0] : null;
  }, [orderHistory]);

  // Get reorderable items (transform history items to cart-ready format)
  const getReorderItems = useCallback(
    (order: OrderHistoryItem, availableProducts: MenuProduct[]) => {
      return order.items
        .map((item) => {
          // Find the current product in available products
          const currentProduct = availableProducts.find(
            (p) => p.branchProductId === item.branchProductId
          );

          if (!currentProduct || currentProduct.isOutOfStock) {
            return null;
          }

          return {
            product: currentProduct,
            quantity: item.quantity,
            addons: item.addons || [],
            extras: item.extras || [],
          };
        })
        .filter(Boolean);
    },
    []
  );

  // Check if order can be fully reordered
  const canReorder = useCallback(
    (order: OrderHistoryItem, availableProducts: MenuProduct[]) => {
      const reorderItems = getReorderItems(order, availableProducts);
      return reorderItems.length === order.items.length;
    },
    [getReorderItems]
  );

  // Get unavailable items from an order
  const getUnavailableItems = useCallback(
    (order: OrderHistoryItem, availableProducts: MenuProduct[]) => {
      return order.items.filter((item) => {
        const product = availableProducts.find(
          (p) => p.branchProductId === item.branchProductId
        );
        return !product || product.isOutOfStock;
      });
    },
    []
  );

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<QuickReorderSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  // Toggle quick reorder feature
  const toggleEnabled = useCallback(() => {
    setSettings((prev) => ({ ...prev, enabled: !prev.enabled }));
  }, []);

  return {
    orderHistory,
    isLoaded,
    settings,
    addToHistory,
    clearHistory,
    removeFromHistory,
    getLastOrder,
    getReorderItems,
    canReorder,
    getUnavailableItems,
    updateSettings,
    toggleEnabled,
  };
};

export default useQuickReorder;
