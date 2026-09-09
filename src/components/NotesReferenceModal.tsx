import React, { useState } from 'react';
import { X, BookOpen, ExternalLink, Check, FileText } from 'lucide-react';
import { StoreItem } from '../types';
import { formatPeso } from '../utils/storage';

interface NotesReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: StoreItem[];
  onSelectItem: (item: StoreItem) => void;
}

export const NotesReferenceModal: React.FC<NotesReferenceModalProps> = ({
  isOpen,
  onClose,
  items,
  onSelectItem,
}) => {
  const [activeSheet, setActiveSheet] = useState<1 | 2 | 3>(1);

  if (!isOpen) return null;

  const sheetItems = items.filter((item) => item.sheetSource === activeSheet);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="w-full max-w-3xl bg-stone-900 text-stone-100 rounded-2xl shadow-2xl border border-stone-800 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                Orihinal na Talaan sa Notebook
              </h2>
              <p className="text-xs text-stone-400">
                Paghambingin ang digital database at ang sulat-kamay na listahan
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sheet Tabs */}
        <div className="px-4 sm:px-5 pt-3 border-b border-stone-800 bg-stone-900/60 flex gap-2">
          {[
            {
              sheet: 1 as const,
              title: 'Pahina 1: Chichirya & Biscuits',
              desc: '16 paninda',
            },
            {
              sheet: 2 as const,
              title: 'Pahina 2: Delata & Panimpla',
              desc: '29 paninda',
            },
            {
              sheet: 3 as const,
              title: 'Pahina 3: Alak, Noodles & Panlaba',
              desc: '24 paninda',
            },
          ].map((tab) => (
            <button
              key={tab.sheet}
              type="button"
              onClick={() => setActiveSheet(tab.sheet)}
              className={`pb-3 px-3 text-xs sm:text-sm font-semibold transition cursor-pointer border-b-2 ${
                activeSheet === tab.sheet
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              <span>{tab.title}</span>
            </button>
          ))}
        </div>

        {/* List Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-2 flex-1">
          <div className="text-xs text-stone-400 mb-3 flex items-center justify-between">
            <span>
              Lahat ng na-encode mula sa litrato ({sheetItems.length} items):
            </span>
            <span className="italic">Pindutin ang item para hanapin sa app</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {sheetItems.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectItem(item);
                  onClose();
                }}
                className="bg-stone-800/80 hover:bg-stone-800 border border-stone-700/80 hover:border-amber-500/60 rounded-xl p-3 flex items-center justify-between cursor-pointer transition group"
              >
                <div>
                  <div className="text-xs text-amber-400/90 font-mono">
                    Sulat: &ldquo;{item.originalName}&rdquo;
                  </div>
                  <div className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                    {item.name}
                  </div>
                  {item.spec && (
                    <div className="text-[11px] text-stone-400">{item.spec}</div>
                  )}
                </div>

                <div className="text-right">
                  <div className="text-base font-black text-amber-400">
                    {formatPeso(item.price)}
                  </div>
                  <span className="text-[10px] text-stone-400 group-hover:text-white">
                    Pindutin para tingnan &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div className="p-3 bg-stone-950 border-t border-stone-800 text-center text-xs text-stone-400">
          Lahat ng 56 na paninda mula sa tatlong larawan ng inyong sari-sari store ay ganap na nakatala at handang gamitin.
        </div>
      </div>
    </div>
  );
};
