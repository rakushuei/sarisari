import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Tag, Layers, DollarSign } from 'lucide-react';
import { CategoryId, StoreItem } from '../types';
import { CATEGORIES } from '../data/storeItems';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: StoreItem) => void;
  onDelete?: (itemId: string) => void;
  editingItem: StoreItem | null;
}

export const ItemModal: React.FC<ItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  editingItem,
}) => {
  const [name, setName] = useState('');
  const [originalName, setOriginalName] = useState('');
  const [price, setPrice] = useState<string>('');
  const [category, setCategory] = useState<Exclude<CategoryId, 'all'>>('chichirya');
  const [spec, setSpec] = useState('');
  const [unit, setUnit] = useState('pack');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setOriginalName(editingItem.originalName || editingItem.name);
      setPrice(editingItem.price.toString());
      setCategory(editingItem.category);
      setSpec(editingItem.spec || '');
      setUnit(editingItem.unit || 'pack');
    } else {
      setName('');
      setOriginalName('');
      setPrice('');
      setCategory('chichirya');
      setSpec('');
      setUnit('pack');
    }
    setError('');
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Pakilagay ang pangalan ng paninda.');
      return;
    }
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice < 0) {
      setError('Pakilagay ang wastong presyo.');
      return;
    }

    const newItem: StoreItem = {
      id: editingItem ? editingItem.id : `item-custom-${Date.now()}`,
      name: name.trim(),
      originalName: originalName.trim() || name.trim(),
      price: numPrice,
      category,
      spec: spec.trim() || undefined,
      unit: unit.trim() || undefined,
      sheetSource: editingItem ? editingItem.sheetSource : 1,
      keywords: [
        name.toLowerCase(),
        originalName.toLowerCase(),
        category.toLowerCase(),
        ...name.toLowerCase().split(' '),
      ],
      isCustom: true,
    };

    onSave(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-stone-900">
              {editingItem ? 'I-edit ang Paninda' : 'Magdagdag ng Paninda'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Name Field */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Pangalan ng Paninda *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Hal. Piattos Cheese, Alaska Evap, Coke Mismo..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Original handwritten note text */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Pangalan sa Notebook (Opsyonal)
            </label>
            <input
              type="text"
              value={originalName}
              onChange={(e) => setOriginalName(e.target.value)}
              placeholder="Hal. PIATOS, CATSUP, 4X4..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Price and Category Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Presyo (₱) *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500 font-bold">
                  ₱
                </span>
                <input
                  type="number"
                  step="any"
                  min="0"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 font-bold text-base focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Kategorya
              </label>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as Exclude<CategoryId, 'all'>)
                }
                className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Specification and Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Sukat / Deskripsyon
              </label>
              <input
                type="text"
                value={spec}
                onChange={(e) => setSpec(e.target.value)}
                placeholder="Hal. 175g, 250 mL, Sachet"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Yunit
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                <option value="pack">Pack</option>
                <option value="pc">Pirasong isa (pc)</option>
                <option value="can">Lata (Can)</option>
                <option value="bottle">Bote (Bottle)</option>
                <option value="sachet">Sachet</option>
                <option value="bar">Bar (Sabon)</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
            {editingItem && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Sigurado ka bang nais mong burahin ang "${editingItem.name}"?`)) {
                    onDelete(editingItem.id);
                    onClose();
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl text-red-600 hover:bg-red-50 border border-red-200 transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Burahin</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition cursor-pointer"
              >
                Kanselahin
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold bg-amber-600 hover:bg-amber-500 text-white rounded-xl shadow-xs transition cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{editingItem ? 'I-save ang Pagbabago' : 'Idagdag'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
