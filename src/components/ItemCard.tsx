import React from 'react';
import { Plus, Edit2, Check, ShoppingBag } from 'lucide-react';
import { StoreItem } from '../types';
import { formatPeso } from '../utils/storage';
import { CategoryIcon } from './CategoryIcon';

interface ItemCardProps {
  item: StoreItem;
  searchQuery: string;
  onAddToCart: (item: StoreItem) => void;
  onEditItem: (item: StoreItem) => void;
  cartQuantity: number;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  searchQuery,
  onAddToCart,
  onEditItem,
  cartQuantity,
}) => {
  // Highlight search term in name
  const renderHighlightedName = (text: string) => {
    if (!searchQuery.trim()) return text;
    const regex = new RegExp(`(${searchQuery.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, index) =>
          regex.test(part) ? (
            <mark key={index} className="bg-amber-200 text-stone-900 rounded-xs px-0.5 font-bold">
              {part}
            </mark>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </>
    );
  };

  return (
    <div
      id={`item-card-${item.id}`}
      className={`group relative flex flex-col justify-between bg-white rounded-2xl p-4 sm:p-5 border transition-all duration-200 hover:shadow-md ${
        cartQuantity > 0
          ? 'border-emerald-500/80 bg-emerald-50/20 ring-1 ring-emerald-500/30'
          : 'border-stone-200 hover:border-amber-400'
      }`}
    >
      {/* Top Meta info */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2.5">
          {/* Category Pill */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700">
            <CategoryIcon category={item.category} className="w-3.5 h-3.5 text-stone-500" />
            <span className="capitalize">{item.category}</span>
          </div>

          {/* Quick Edit Price Button */}
          <button
            type="button"
            onClick={() => onEditItem(item)}
            className="opacity-60 group-hover:opacity-100 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
            title="I-edit ang presyo"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Item Title */}
        <h3 className="text-base sm:text-lg font-bold text-stone-900 leading-snug tracking-tight">
          {renderHighlightedName(item.name)}
        </h3>

        {/* Note / Spec details */}
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-stone-500">
          {item.spec && (
            <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-600 font-medium">
              {item.spec}
            </span>
          )}
          <span className="text-[11px] text-stone-400 italic">
            Listahan: &ldquo;{item.originalName}&rdquo;
          </span>
        </div>
      </div>

      {/* Bottom: Big Price & Add to Kwentador Button */}
      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block">
            Presyo
          </span>
          <span className="text-xl sm:text-2xl font-black text-amber-700 tracking-tight">
            {formatPeso(item.price)}
          </span>
        </div>

        {/* Add to Basket / Stepper */}
        <button
          id={`add-to-cart-${item.id}`}
          type="button"
          onClick={() => onAddToCart(item)}
          className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer shadow-xs ${
            cartQuantity > 0
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-stone-900 hover:bg-amber-600 text-white'
          }`}
          title="Idagdag sa Kwentador"
        >
          {cartQuantity > 0 ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>{cartQuantity} sa Pabili</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>Pabili</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
