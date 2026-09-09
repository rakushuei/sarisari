/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Store,
  Sparkles,
  ShoppingBag,
  RotateCcw,
  Plus,
  HelpCircle,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { StoreItem, CategoryId, CartItem } from './types';
import { INITIAL_ITEMS } from './data/storeItems';
import {
  getStoredItems,
  saveStoredItems,
  resetToDefaultItems,
  formatPeso,
} from './utils/storage';

import { Header } from './components/Header';
import { CategoryFilter } from './components/CategoryFilter';
import {
  SearchBar,
  SortOption,
  PriceRangeOption,
} from './components/SearchBar';
import { ItemCard } from './components/ItemCard';
import { ItemRow } from './components/ItemRow';
import { KwentadorDrawer } from './components/KwentadorDrawer';
import { ItemModal } from './components/ItemModal';
import { NotesReferenceModal } from './components/NotesReferenceModal';
import { PrintModal } from './components/PrintModal';

export default function App() {
  // Store items state
  const [items, setItems] = useState<StoreItem[]>(getStoredItems);
  const [hasCustomizations, setHasCustomizations] = useState<boolean>(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [priceRange, setPriceRange] = useState<PriceRangeOption>('all');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Kwentador (Customer Cart) state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isKwentadorOpen, setIsKwentadorOpen] = useState<boolean>(false);

  // Modals state
  const [isItemModalOpen, setIsItemModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<StoreItem | null>(null);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);

  // Check if items differ from INITIAL_ITEMS
  useEffect(() => {
    const isDifferent =
      items.length !== INITIAL_ITEMS.length ||
      items.some((item) => {
        const orig = INITIAL_ITEMS.find((i) => i.id === item.id);
        return !orig || orig.price !== item.price || orig.name !== item.name;
      });
    setHasCustomizations(isDifferent);
  }, [items]);

  // Handle adding item to cart (Kwentador)
  const handleAddToCart = (item: StoreItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const handleUpdateCartQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart((prev) => prev.filter((c) => c.item.id !== itemId));
    } else {
      setCart((prev) =>
        prev.map((c) =>
          c.item.id === itemId ? { ...c, quantity: newQuantity } : c
        )
      );
    }
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Handle saving an item (Add or Edit)
  const handleSaveItem = (savedItem: StoreItem) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === savedItem.id);
      let updated: StoreItem[];
      if (exists) {
        updated = prev.map((i) => (i.id === savedItem.id ? savedItem : i));
      } else {
        updated = [savedItem, ...prev];
      }
      saveStoredItems(updated);
      return updated;
    });

    // Also update in cart if present
    setCart((prev) =>
      prev.map((c) =>
        c.item.id === savedItem.id ? { ...c, item: savedItem } : c
      )
    );
  };

  // Handle deleting an item
  const handleDeleteItem = (itemId: string) => {
    setItems((prev) => {
      const updated = prev.filter((i) => i.id !== itemId);
      saveStoredItems(updated);
      return updated;
    });
    setCart((prev) => prev.filter((c) => c.item.id !== itemId));
  };

  // Handle reset to default 56 items
  const handleResetItems = () => {
    if (
      window.confirm(
        'Nais mo bang ibalik ang talaan sa orihinal na 56 items mula sa litrato ng inyong notebook?'
      )
    ) {
      const defaults = resetToDefaultItems();
      setItems(defaults);
      setCart([]);
    }
  };

  // Filtered & Sorted items computation
  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const isNumQuery = !isNaN(Number(query)) && query !== '';

    return items
      .filter((item) => {
        // Category filter
        if (selectedCategory !== 'all' && item.category !== selectedCategory) {
          return false;
        }

        // Price range filter
        if (priceRange === 'under-10' && item.price > 10) return false;
        if (priceRange === '11-25' && (item.price < 11 || item.price > 25)) return false;
        if (priceRange === '26-50' && (item.price < 26 || item.price > 50)) return false;
        if (priceRange === 'above-50' && item.price <= 50) return false;

        // Search Query filter
        if (!query) return true;

        // Direct name / original note match
        if (item.name.toLowerCase().includes(query)) return true;
        if (item.originalName.toLowerCase().includes(query)) return true;
        if (item.spec?.toLowerCase().includes(query)) return true;
        if (item.category.toLowerCase().includes(query)) return true;

        // Numeric match (e.g. searching "10" matches ₱10 items)
        if (isNumQuery && Math.round(item.price) === Number(query)) return true;

        // Keywords match (Tagalog terms, aliases, etc.)
        if (item.keywords?.some((k) => k.toLowerCase().includes(query))) return true;

        return false;
      })
      .sort((a, b) => {
        if (sortBy === 'name-asc') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'price-asc') {
          return a.price - b.price;
        }
        if (sortBy === 'price-desc') {
          return b.price - a.price;
        }
        // Default: sort by Sheet (1 -> 2 -> 3) and original order
        if (a.sheetSource !== b.sheetSource) {
          return a.sheetSource - b.sheetSource;
        }
        return 0;
      });
  }, [items, searchQuery, selectedCategory, priceRange, sortBy]);

  // Cart summary calculations
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.item.price * item.quantity,
    0
  );

  const getCartQuantity = (itemId: string) => {
    return cart.find((c) => c.item.id === itemId)?.quantity || 0;
  };

  // Quick select from original notes modal
  const handleSelectFromNotes = (item: StoreItem) => {
    setSearchQuery(item.name);
    setSelectedCategory('all');
    setPriceRange('all');
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col font-sans">
      {/* Top Navigation & App Bar */}
      <Header
        totalItemsCount={items.length}
        cartCount={cartItemCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsKwentadorOpen(true)}
        onOpenAddItem={() => {
          setEditingItem(null);
          setIsItemModalOpen(true);
        }}
        onOpenPrint={() => setIsPrintModalOpen(true)}
        onOpenNotes={() => setIsNotesModalOpen(true)}
        onResetItems={handleResetItems}
        hasCustomizations={hasCustomizations}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-4">
        {/* Quick Helper Banner */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
                Mabilisang Hanapan ng Presyo
              </p>
              <p className="text-sm text-stone-700">
                I-type lamang ang pangalan o presyo para agad makita ang halaga.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-stone-500 font-medium">Subukan hanapin:</span>
            {[
              { label: 'Piattos (₱19)', term: 'Piattos' },
              { label: 'Magic Sarap (₱6)', term: 'Magic Sarap' },
              { label: 'Sardines (₱29)', term: 'Sardines' },
              { label: 'Alak (GSM / Alfonso)', term: 'Alak' },
              { label: 'Panlaba', term: 'Detergent' },
            ].map((shortcut) => (
              <button
                key={shortcut.term}
                type="button"
                onClick={() => {
                  setSearchQuery(shortcut.term);
                  setSelectedCategory('all');
                }}
                className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-amber-100 hover:text-amber-900 text-stone-700 transition cursor-pointer font-medium"
              >
                {shortcut.label}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Bar */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          items={items}
        />

        {/* Search, Filter, Sort & View-Mode Controls */}
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalFiltered={filteredItems.length}
        />

        {/* Item Display Grid / Table */}
        {filteredItems.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
              {filteredItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  searchQuery={searchQuery}
                  onAddToCart={handleAddToCart}
                  onEditItem={(it) => {
                    setEditingItem(it);
                    setIsItemModalOpen(true);
                  }}
                  cartQuantity={getCartQuantity(item.id)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-xs font-bold text-stone-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Paninda & Sulat sa Notebook</th>
                      <th className="py-3 px-4 hidden sm:table-cell">Kategorya</th>
                      <th className="py-3 px-4 hidden md:table-cell">Sukat</th>
                      <th className="py-3 px-4 text-right">Presyo</th>
                      <th className="py-3 px-4 text-right">Aksyon</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => (
                      <ItemRow
                        key={item.id}
                        item={item}
                        searchQuery={searchQuery}
                        onAddToCart={handleAddToCart}
                        onEditItem={(it) => {
                          setEditingItem(it);
                          setIsItemModalOpen(true);
                        }}
                        cartQuantity={getCartQuantity(item.id)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        ) : (
          /* Empty Search State */
          <div className="bg-white rounded-2xl border border-stone-200 p-8 sm:p-12 text-center shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-3">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900">
              Walang nahanap na paninda
            </h3>
            <p className="text-sm text-stone-500 max-w-md mx-auto mt-1">
              Walang tumutugma sa &ldquo;{searchQuery}&rdquo; sa piniling filter.
              Subukang tanggalin ang filter o magdagdag ng bagong paninda.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setPriceRange('all');
                }}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-semibold rounded-xl transition cursor-pointer"
              >
                I-clear ang Lahat ng Filter
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingItem(null);
                  setIsItemModalOpen(true);
                }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs sm:text-sm font-semibold rounded-xl transition cursor-pointer"
              >
                + Idagdag Bilang Bagong Paninda
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Floating Kwentador Quick Bar for Mobile */}
      {cartItemCount > 0 && !isKwentadorOpen && (
        <div className="fixed bottom-4 left-4 right-4 sm:hidden z-20">
          <button
            type="button"
            onClick={() => setIsKwentadorOpen(true)}
            className="w-full bg-emerald-600 text-white p-3.5 rounded-2xl shadow-xl flex items-center justify-between font-bold border border-emerald-500 transition active:scale-98 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-white text-emerald-800 text-xs flex items-center justify-center font-black">
                {cartItemCount}
              </span>
              <span>Buksan ang Kwentador</span>
            </div>
            <div className="flex items-center gap-1.5 text-base">
              <span>{formatPeso(cartTotal)}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Kwentador Drawer */}
      <KwentadorDrawer
        isOpen={isKwentadorOpen}
        onClose={() => setIsKwentadorOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onClearCart={handleClearCart}
      />

      {/* Add / Edit Item Modal */}
      <ItemModal
        isOpen={isItemModalOpen}
        onClose={() => {
          setIsItemModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
        onDelete={handleDeleteItem}
        editingItem={editingItem}
      />

      {/* Original Handwritten Notes Reference Modal */}
      <NotesReferenceModal
        isOpen={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
        items={items}
        onSelectItem={handleSelectFromNotes}
      />

      {/* Printable Price List Modal */}
      <PrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        items={items}
      />
    </div>
  );
}
