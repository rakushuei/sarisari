import React from 'react';
import { Plus, Edit2, Check } from 'lucide-react';
import { StoreItem } from '../types';
import { formatPeso } from '../utils/storage';
import { CategoryIcon } from './CategoryIcon';

interface ItemRowProps {
  item: StoreItem;
  searchQuery: string;
  onAddToCart: (item: StoreItem) => void;
  onEditItem: (item: StoreItem) => void;
  cartQuantity: number;
}

export const ItemRow: React.FC<ItemRowProps> = ({
  item,
  searchQuery,
  onAddToCart,
  onEditItem,
  cartQuantity,
}) => {
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
    <tr
      id={`item-row-${item.id}`}
      className={`border-b border-stone-200/80 hover:bg-stone-50/80 transition ${
        cartQuantity > 0 ? 'bg-emerald-50/30' : ''
      }`}
    >
      {/* Name and handwritten tag */}
      <td className="py-3 px-4">
        <div className="font-bold text-stone-900 text-sm sm:text-base">
          {renderHighlightedName(item.name)}
        </div>
        <div className="text-xs text-stone-400 italic">
          Notebook: &ldquo;{item.originalName}&rdquo;
        </div>
      </td>

      {/* Category */}
      <td className="py-3 px-4 hidden sm:table-cell">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-700">
          <CategoryIcon category={item.category} className="w-3 h-3 text-stone-500" />
          <span className="capitalize">{item.category}</span>
        </div>
      </td>

      {/* Spec */}
      <td className="py-3 px-4 hidden md:table-cell text-xs text-stone-500">
        {item.spec || '-'}
      </td>

      {/* Price */}
      <td className="py-3 px-4 text-right">
        <span className="text-base sm:text-lg font-extrabold text-amber-700">
          {formatPeso(item.price)}
        </span>
      </td>

      {/* Actions */}
      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => onEditItem(item)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
            title="I-edit ang presyo"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onAddToCart(item)}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              cartQuantity > 0
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-stone-900 hover:bg-amber-600 text-white'
            }`}
          >
            {cartQuantity > 0 ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{cartQuantity}</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Pabili</span>
              </>
            )}
          </button>
        </div>
      </td>
    </tr>
  );
};
