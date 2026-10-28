import React from 'react';
import { Sparkles, Crown, FileDown, PlusCircle } from 'lucide-react';

interface HeaderProps {
  currentTab: 'itinerary' | 'budget' | 'packing' | 'templates';
  onSelectTab: (tab: 'itinerary' | 'budget' | 'packing' | 'templates') => void;
  isPro: boolean;
  onOpenUpgrade: () => void;
  onOpenNewTrip: () => void;
  onPrintExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  isPro,
  onOpenUpgrade,
  onOpenNewTrip,
  onPrintExport
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => onSelectTab('itinerary')}
              className="text-left group flex items-center gap-2 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold text-base shadow-sm">
                RF
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-neutral-900 group-hover:text-neutral-700 transition-colors whitespace-nowrap">
                  RoteiroFácil
                </span>
                {isPro ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100/90 border border-amber-300 px-1.5 py-0.5 rounded tracking-wide uppercase font-mono">
                    <Crown className="w-3 h-3 text-amber-600 fill-amber-500" />
                    PRO
                  </span>
                ) : (
                  <span className="text-[11px] text-neutral-400 font-medium whitespace-nowrap">
                    Básico
                  </span>
                )}
              </div>
            </button>
          </div>

          {/* Zone 2: 4 Nav Links, 1-2 words each, single-line */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-600">
            <button
              onClick={() => onSelectTab('itinerary')}
              className={`whitespace-nowrap transition-colors py-1 border-b-2 ${
                currentTab === 'itinerary'
                  ? 'border-neutral-900 text-neutral-900 font-semibold'
                  : 'border-transparent hover:text-neutral-900'
              }`}
            >
              Roteiro
            </button>
            <button
              onClick={() => onSelectTab('budget')}
              className={`whitespace-nowrap transition-colors py-1 border-b-2 ${
                currentTab === 'budget'
                  ? 'border-neutral-900 text-neutral-900 font-semibold'
                  : 'border-transparent hover:text-neutral-900'
              }`}
            >
              Orçamento
            </button>
            <button
              onClick={() => onSelectTab('packing')}
              className={`whitespace-nowrap transition-colors py-1 border-b-2 ${
                currentTab === 'packing'
                  ? 'border-neutral-900 text-neutral-900 font-semibold'
                  : 'border-transparent hover:text-neutral-900'
              }`}
            >
              Bagagem
            </button>
            <button
              onClick={() => onSelectTab('templates')}
              className={`whitespace-nowrap transition-colors py-1 border-b-2 flex items-center gap-1.5 ${
                currentTab === 'templates'
                  ? 'border-neutral-900 text-neutral-900 font-semibold'
                  : 'border-transparent hover:text-neutral-900'
              }`}
            >
              <span>Roteiros VIP</span>
              {!isPro && (
                <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-1 rounded">
                  ★
                </span>
              )}
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-2.5 shrink-0">
            {isPro ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onPrintExport}
                  title="Salvar ou Imprimir Roteiro em PDF"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors whitespace-nowrap"
                >
                  <FileDown className="w-3.5 h-3.5 text-neutral-700" />
                  <span>Exportar PDF</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenNewTrip}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors whitespace-nowrap shadow-sm"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Nova Viagem</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onOpenUpgrade}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-neutral-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all shadow-sm hover:shadow whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
                  <span>Upgrade VIP · R$ 19,90</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenNewTrip}
                  className="hidden sm:inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-neutral-700 hover:text-neutral-900 border border-neutral-300 rounded-lg transition-colors whitespace-nowrap"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Nova Viagem</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex md:hidden items-center justify-around border-t border-neutral-100 py-2 text-xs font-medium text-neutral-600">
          <button
            onClick={() => onSelectTab('itinerary')}
            className={`py-1 ${currentTab === 'itinerary' ? 'text-neutral-900 font-bold' : ''}`}
          >
            Roteiro
          </button>
          <button
            onClick={() => onSelectTab('budget')}
            className={`py-1 ${currentTab === 'budget' ? 'text-neutral-900 font-bold' : ''}`}
          >
            Orçamento
          </button>
          <button
            onClick={() => onSelectTab('packing')}
            className={`py-1 ${currentTab === 'packing' ? 'text-neutral-900 font-bold' : ''}`}
          >
            Bagagem
          </button>
          <button
            onClick={() => onSelectTab('templates')}
            className={`py-1 ${currentTab === 'templates' ? 'text-neutral-900 font-bold' : ''}`}
          >
            Roteiros VIP
          </button>
        </div>
      </div>
    </header>
  );
};
