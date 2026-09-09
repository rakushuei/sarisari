import React, { useRef, useEffect } from 'react';
import {
  Search,
  X,
  SlidersHorizontal,
  ArrowDownAZ,
  ArrowUp10,
  ArrowDown10,
  LayoutGrid,
  List,
} from 'lucide-react';

export type SortOption = 'default' | 'name-asc' | 'price-asc' | 'price-desc';
export type PriceRangeOption = 'all' | 'under-10' | '11-25' | '26-50' | 'above-50';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  priceRange: PriceRangeOption;
  onPriceRangeChange: (range: PriceRangeOption) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
  totalFiltered: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  priceRange,
  onPriceRangeChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalFiltered,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global hotkey '/' to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="space-y-3 bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
      {/* Primary Search Input Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            ref={searchInputRef}
            id="item-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Maghanap ng paninda (hal. Piattos, Toyo, Asin, Knorr, 10...)"
            className="w-full pl-10 pr-20 py-3 text-sm sm:text-base rounded-xl border border-stone-300 bg-stone-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 transition cursor-pointer"
              title="Linisin ang search"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold text-stone-400 bg-stone-100 border border-stone-300 rounded-md">
                /
              </kbd>
            </div>
          )}
        </div>

        {/* View Mode & Sort Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Sort selector */}
          <div className="relative">
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="appearance-none bg-stone-50 border border-stone-300 text-stone-700 text-xs sm:text-sm rounded-xl pl-3 pr-8 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer font-medium"
            >
              <option value="default">Listahan sa Notebook</option>
              <option value="name-asc">Pangalan (A-Z)</option>
              <option value="price-asc">Presyo (Pinakamura)</option>
              <option value="price-desc">Presyo (Pinakamahal)</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-stone-400">
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Grid vs Table Toggle */}
          <div className="flex items-center border border-stone-300 rounded-xl p-0.5 bg-stone-100">
            <button
              id="view-mode-grid-btn"
              type="button"
              onClick={() => onViewModeChange('grid')}
              className={`p-2 rounded-lg transition cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Grid View (Malalaking Cards)"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              id="view-mode-table-btn"
              type="button"
              onClick={() => onViewModeChange('table')}
              className={`p-2 rounded-lg transition cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Table View (Mabilisang Listahan)"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Price Range Chips & Result Count */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-100">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-stone-500 font-medium mr-1">Presyo:</span>
          {(
            [
              { id: 'all', label: 'Lahat' },
              { id: 'under-10', label: '≤ ₱10' },
              { id: '11-25', label: '₱11 - ₱25' },
              { id: '26-50', label: '₱26 - ₱50' },
              { id: 'above-50', label: '₱50+' },
            ] as const
          ).map((range) => (
            <button
              key={range.id}
              id={`price-filter-${range.id}`}
              type="button"
              onClick={() => onPriceRangeChange(range.id)}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                priceRange === range.id
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-stone-500 font-medium">
          Nahanap: <span className="text-stone-900 font-bold">{totalFiltered}</span> paninda
        </div>
      </div>
    </div>
  );
};
