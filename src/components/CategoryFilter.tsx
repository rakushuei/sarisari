import React from 'react';
import { CategoryId, StoreCategory, StoreItem } from '../types';
import { CATEGORIES } from '../data/storeItems';
import { CategoryIcon } from './CategoryIcon';

interface CategoryFilterProps {
  selectedCategory: CategoryId;
  onSelectCategory: (category: CategoryId) => void;
  items: StoreItem[];
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  items,
}) => {
  // Count items per category
  const getCategoryCount = (catId: CategoryId) => {
    if (catId === 'all') return items.length;
    return items.filter((item) => item.category === catId).length;
  };

  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-thin">
      <div className="flex items-center gap-2 min-w-max">
        {CATEGORIES.map((cat: StoreCategory) => {
          const isSelected = selectedCategory === cat.id;
          const count = getCategoryCount(cat.id);

          return (
            <button
              key={cat.id}
              id={`cat-btn-${cat.id}`}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer border ${
                isSelected
                  ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                  : 'bg-white text-stone-700 hover:bg-stone-50 border-stone-200'
              }`}
            >
              <CategoryIcon
                category={cat.id}
                className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-stone-500'}`}
              />
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <span>{cat.label}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.5 rounded-full font-semibold ${
                    isSelected
                      ? 'bg-amber-700 text-amber-100'
                      : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {count}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
