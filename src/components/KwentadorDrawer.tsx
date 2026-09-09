import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Receipt,
  Coins,
  CheckCircle,
  AlertCircle,
  ShoppingBag,
} from 'lucide-react';
import { CartItem } from '../types';
import { formatPeso } from '../utils/storage';

interface KwentadorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onClearCart: () => void;
}

export const KwentadorDrawer: React.FC<KwentadorDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onClearCart,
}) => {
  const [cashTendered, setCashTendered] = useState<string>('');

  if (!isOpen) return null;

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.item.price * item.quantity,
    0
  );
  const cashNum = parseFloat(cashTendered) || 0;
  const changeAmount = cashNum - totalAmount;

  const quickBills = [20, 50, 100, 200, 500, 1000];

  const handleQuickBill = (amount: number) => {
    setCashTendered(amount.toString());
  };

  const handleExactCash = () => {
    setCashTendered(totalAmount.toString());
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div
        className="w-full max-w-md bg-stone-900 text-stone-100 flex flex-col h-full shadow-2xl border-l border-stone-800"
        role="dialog"
        aria-modal="true"
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                Kwentador ng Tindahan
              </h2>
              <p className="text-xs text-stone-400">
                Kalkulador ng Pabili at Sukli
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-12 px-4 text-stone-500">
              <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30 text-stone-400" />
              <p className="text-sm font-semibold text-stone-300">Walang laman ang pabili</p>
              <p className="text-xs mt-1 text-stone-400">
                Pindutin ang &ldquo;+ Pabili&rdquo; sa kahit anong paninda para idagdag dito.
              </p>
            </div>
          ) : (
            cart.map(({ item, quantity }) => {
              const lineTotal = item.price * quantity;
              return (
                <div
                  key={item.id}
                  className="bg-stone-800/80 rounded-xl p-3.5 border border-stone-700/60 flex items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-stone-100 truncate">
                      {item.name}
                    </div>
                    <div className="text-xs text-stone-400">
                      {formatPeso(item.price)} bawat isa
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-stone-900 border border-stone-700 rounded-lg">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, quantity - 1)}
                        className="p-1.5 text-stone-400 hover:text-white transition cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-7 text-center font-bold text-sm text-amber-400">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, quantity + 1)}
                        className="p-1.5 text-stone-400 hover:text-white transition cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[70px]">
                      <span className="font-extrabold text-sm text-white block">
                        {formatPeso(lineTotal)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, 0)}
                      className="p-1.5 text-stone-500 hover:text-red-400 transition cursor-pointer"
                      title="Alisin"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer: Totals, Cash input, and Sukli calculation */}
        {cart.length > 0 && (
          <div className="border-t border-stone-800 bg-stone-950 p-4 sm:p-5 space-y-4">
            {/* Total Row */}
            <div className="flex items-center justify-between bg-stone-900/90 px-4 py-3 rounded-xl border border-stone-800">
              <span className="text-sm font-semibold text-stone-300">
                Kabuuang Halaga (Total)
              </span>
              <span className="text-2xl font-black text-amber-400">
                {formatPeso(totalAmount)}
              </span>
            </div>

            {/* Bayad ng Customer Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span className="font-semibold flex items-center gap-1 text-stone-300">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  Bayad ng Customer:
                </span>
                <button
                  type="button"
                  onClick={handleExactCash}
                  className="text-amber-400 hover:underline cursor-pointer font-medium text-xs"
                >
                  Sakto ({formatPeso(totalAmount)})
                </button>
              </div>

              {/* Cash Input */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400 font-bold">
                  ₱
                </span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={cashTendered}
                  onChange={(e) => setCashTendered(e.target.value)}
                  placeholder="Ilagay ang halaga ng pera..."
                  className="w-full pl-8 pr-4 py-2.5 bg-stone-900 border border-stone-700 rounded-xl text-white font-bold text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Quick Bill Presets */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {quickBills.map((bill) => (
                  <button
                    key={bill}
                    type="button"
                    onClick={() => handleQuickBill(bill)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer border ${
                      cashNum === bill
                        ? 'bg-amber-500 text-stone-950 border-amber-400'
                        : 'bg-stone-800 hover:bg-stone-700 text-stone-300 border-stone-700'
                    }`}
                  >
                    ₱{bill}
                  </button>
                ))}
              </div>
            </div>

            {/* Sukli Display */}
            {cashNum > 0 && (
              <div
                className={`p-3.5 rounded-xl border flex items-center justify-between ${
                  changeAmount >= 0
                    ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
                    : 'bg-amber-950/70 border-amber-500/50 text-amber-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  {changeAmount >= 0 ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                  )}
                  <span className="text-xs sm:text-sm font-semibold">
                    {changeAmount >= 0 ? 'Sukli ng Customer:' : 'Kulang pa:'}
                  </span>
                </div>
                <span
                  className={`text-xl sm:text-2xl font-black ${
                    changeAmount >= 0 ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {formatPeso(Math.abs(changeAmount))}
                </span>
              </div>
            )}

            {/* Drawer Actions */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  onClearCart();
                  setCashTendered('');
                }}
                className="flex-1 py-2.5 px-4 bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold rounded-xl text-xs sm:text-sm transition cursor-pointer border border-stone-700 text-center"
              >
                Bagong Customer / I-clear
              </button>
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs sm:text-sm transition cursor-pointer"
              >
                Tapos na
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
