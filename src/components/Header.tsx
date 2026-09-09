import React from 'react';
import {
  Store,
  Calculator,
  Plus,
  Printer,
  BookOpen,
  RotateCcw,
} from 'lucide-react';
import { formatPeso } from '../utils/storage';

interface HeaderProps {
  totalItemsCount: number;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenAddItem: () => void;
  onOpenPrint: () => void;
  onOpenNotes: () => void;
  onResetItems: () => void;
  hasCustomizations: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  totalItemsCount,
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenAddItem,
  onOpenPrint,
  onOpenNotes,
  onResetItems,
  hasCustomizations,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-stone-900 text-stone-100 border-b border-stone-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Store className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  Tindahan Ko
                  <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Sari-Sari Store
                  </span>
                </h1>
              </div>
              <p className="text-xs text-stone-400 hidden sm:block">
                Mabilisang Hanapan ng Presyo &bull; {totalItemsCount} nakalistang paninda
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* View Original Notes Button */}
            <button
              id="view-original-notes-btn"
              type="button"
              onClick={onOpenNotes}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition cursor-pointer"
              title="Tingnan ang Orihinal na Listahan mula sa Notebook"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">Orihinal na Listahan</span>
              <span className="md:hidden">Listahan</span>
            </button>

            {/* Print Price List Button */}
            <button
              id="print-price-list-btn"
              type="button"
              onClick={onOpenPrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition cursor-pointer"
              title="I-print ang Talaan ng Presyo"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span className="hidden lg:inline">I-print ang Presyo</span>
            </button>

            {/* Add New Item Button */}
            <button
              id="add-new-item-btn"
              type="button"
              onClick={onOpenAddItem}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold transition cursor-pointer shadow-sm"
              title="Magdagdag ng Bagong Paninda"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Dagdag Item</span>
            </button>

            {/* Reset if customized */}
            {hasCustomizations && (
              <button
                id="reset-items-btn"
                type="button"
                onClick={onResetItems}
                className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-medium rounded-lg bg-red-900/30 hover:bg-red-900/50 text-red-300 border border-red-800/40 transition cursor-pointer"
                title="Ibalik sa Orihinal na Talaan"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">I-reset</span>
              </button>
            )}

            {/* Kwentador / Cashier Basket Button */}
            <button
              id="open-kwentador-btn"
              type="button"
              onClick={onOpenCart}
              className={`relative inline-flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold text-xs sm:text-sm transition cursor-pointer border shadow-md ${
                cartCount > 0
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 animate-pulse'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-700'
              }`}
              title="Buksan ang Kwentador / Pabili Calculator"
            >
              <Calculator className="w-4 h-4" />
              <span className="font-bold">Kwentador</span>
              {cartCount > 0 && (
                <span className="bg-white text-emerald-800 text-xs px-2 py-0.5 rounded-full font-extrabold ml-0.5 shadow">
                  {cartCount} &bull; {formatPeso(cartTotal)}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
