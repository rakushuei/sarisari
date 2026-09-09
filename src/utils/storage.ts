import { StoreItem } from '../types';
import { INITIAL_ITEMS } from '../data/storeItems';

const STORAGE_KEY = 'sari_sari_store_items_v1';

export function getStoredItems(): StoreItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return INITIAL_ITEMS;
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_ITEMS;
  } catch (error) {
    console.error('Failed to load items from storage:', error);
    return INITIAL_ITEMS;
  }
}

export function saveStoredItems(items: StoreItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save items to storage:', error);
  }
}

export function resetToDefaultItems(): StoreItem[] {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to reset items:', error);
  }
  return INITIAL_ITEMS;
}

export function formatPeso(amount: number): string {
  return `₱${amount.toLocaleString('en-PH', {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}
