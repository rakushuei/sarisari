export type CategoryId =
  | 'all'
  | 'chichirya'
  | 'canned'
  | 'condiments'
  | 'beverages'
  | 'laundry'
  | 'personal';

export interface StoreCategory {
  id: CategoryId;
  label: string;
  tagalogLabel: string;
  iconName: string;
  color: string;
}

export interface StoreItem {
  id: string;
  name: string;
  originalName: string; // Exact handwritten name from note
  price: number;
  category: Exclude<CategoryId, 'all'>;
  spec?: string; // e.g. "175g", "350 mL", "250 mL", "Sachet", "Stick", "Bar"
  unit?: string; // "pc", "pack", "can", "bottle", "sachet", "bar"
  sheetSource: 1 | 2 | 3; // 1 = Chichirya/Biscuits, 2 = Condiments/Canned, 3 = Liquor/Cleaning
  keywords: string[]; // For ultra-fast fuzzy Tagalog & English search
  isCustom?: boolean;
}

export interface CartItem {
  item: StoreItem;
  quantity: number;
}
