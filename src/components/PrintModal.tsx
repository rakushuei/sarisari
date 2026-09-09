import React from 'react';
import { X, Printer, Download } from 'lucide-react';
import { StoreItem, CategoryId } from '../types';
import { CATEGORIES } from '../data/storeItems';
import { formatPeso } from '../utils/storage';

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: StoreItem[];
}

export const PrintModal: React.FC<PrintModalProps> = ({
  isOpen,
  onClose,
  items,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const categories = CATEGORIES.filter((c) => c.id !== 'all');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in print:p-0 print:bg-white print:fixed print:inset-0">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-stone-200 flex flex-col max-h-[92vh] overflow-hidden print:max-h-none print:shadow-none print:border-none print:rounded-none">
        {/* Header - Hidden on Print */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50 print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900">
                Talaan ng Presyo (Printable Price List)
              </h2>
              <p className="text-xs text-stone-500">
                Maaaring i-print at idikit sa tindahan para sa mga mamimili
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>I-print Ngayon</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Content */}
        <div className="p-6 sm:p-8 overflow-y-auto print:overflow-visible print:p-4 text-stone-900">
          {/* Printable Header */}
          <div className="text-center pb-4 border-b-2 border-stone-800 mb-6">
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-stone-950">
              Tindahan Ko &bull; Sari-Sari Store
            </h1>
            <p className="text-sm font-semibold text-stone-600 mt-1">
              OPISYAL NA TALAAN NG PRESYO (PRICE LIST)
            </p>
            <p className="text-xs text-stone-500 mt-0.5">
              Kabuuang Nakatalang Paninda: {items.length} items
            </p>
          </div>

          {/* Grouped by Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2">
            {categories.map((cat) => {
              const catItems = items.filter((item) => item.category === cat.id);
              if (catItems.length === 0) return null;

              return (
                <div
                  key={cat.id}
                  className="border border-stone-300 rounded-lg overflow-hidden break-inside-avoid shadow-xs print:shadow-none"
                >
                  <div className="bg-stone-800 text-white px-3 py-1.5 font-bold text-xs sm:text-sm flex items-center justify-between">
                    <span>{cat.label}</span>
                    <span className="text-[11px] font-normal text-stone-300">
                      ({catItems.length})
                    </span>
                  </div>
                  <table className="w-full text-xs">
                    <tbody>
                      {catItems.map((item, idx) => (
                        <tr
                          key={item.id}
                          className={`border-b border-stone-200 ${
                            idx % 2 === 1 ? 'bg-stone-50' : 'bg-white'
                          }`}
                        >
                          <td className="py-1.5 px-3 font-semibold text-stone-900">
                            {item.name}
                            {item.spec && (
                              <span className="text-stone-500 font-normal ml-1">
                                ({item.spec})
                              </span>
                            )}
                          </td>
                          <td className="py-1.5 px-3 text-right font-black text-stone-950 text-sm whitespace-nowrap">
                            {formatPeso(item.price)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-4 border-t border-stone-300 text-center text-xs text-stone-500">
            Salamat po sa inyong pagtangkilik! &bull; Bawal po ang pautang.
          </div>
        </div>
      </div>
    </div>
  );
};
