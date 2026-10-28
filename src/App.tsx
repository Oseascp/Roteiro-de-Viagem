import React, { useState, useEffect } from 'react';
import { Trip, CuratedTemplate } from './types/travel';
import { INITIAL_TRIPS } from './data/mockTrips';
import { Header } from './components/Header';
import { TripBanner } from './components/TripBanner';
import { ItineraryView } from './components/ItineraryView';
import { BudgetView } from './components/BudgetView';
import { PackingView } from './components/PackingView';
import { CuratedTemplatesView } from './components/CuratedTemplatesView';
import { UpgradeModal, STRIPE_CHECKOUT_URL } from './components/UpgradeModal';
import { TripModal } from './components/TripModal';
import { TravelToolsModal } from './components/TravelToolsModal';
import { PrintDocument } from './components/PrintDocument';
import { 
  Sparkles, 
  Crown, 
  Coins, 
  PhoneCall, 
  FileDown, 
  ShieldCheck,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export default function App() {
  // Load initial trips from localStorage or fallback
  const [trips, setTrips] = useState<Trip[]>(() => {
    try {
      const saved = localStorage.getItem('rf_trips');
      return saved ? JSON.parse(saved) : INITIAL_TRIPS;
    } catch {
      return INITIAL_TRIPS;
    }
  });

  const [selectedTripId, setSelectedTripId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('rf_selected_trip_id');
      if (saved && trips.some(t => t.id === saved)) {
        return saved;
      }
    } catch {
      // Fallback
    }
    return trips[0]?.id || 'trip-rio';
  });

  // User VIP PRO status
  const [isPro, setIsPro] = useState<boolean>(() => {
    try {
      return localStorage.getItem('rf_is_pro_user') === 'true';
    } catch {
      return false;
    }
  });

  const [currentTab, setCurrentTab] = useState<'itinerary' | 'budget' | 'packing' | 'templates'>('itinerary');
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [upgradeTriggerReason, setUpgradeTriggerReason] = useState<string>('');
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  const [isEditingTrip, setIsEditingTrip] = useState(false);
  const [isToolsModalOpen, setIsToolsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync trips to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('rf_trips', JSON.stringify(trips));
    } catch {
      // ignore
    }
  }, [trips]);

  // Sync selected trip ID
  useEffect(() => {
    try {
      localStorage.setItem('rf_selected_trip_id', selectedTripId);
    } catch {
      // ignore
    }
  }, [selectedTripId]);

  // Sync Pro status
  useEffect(() => {
    try {
      localStorage.setItem('rf_is_pro_user', isPro ? 'true' : 'false');
    } catch {
      // ignore
    }
  }, [isPro]);

  // Check URL params if returning from Stripe checkout
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      if (
        searchParams.get('success') === 'true' || 
        searchParams.get('upgraded') === 'true' || 
        searchParams.has('session_id') ||
        searchParams.get('status') === 'success'
      ) {
        setIsPro(true);
        showToast('Pagamento confirmado via Stripe! Bem-vindo ao Roteiro VIP PRO.');
        // Clean URL parameters cleanly
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch {
      // ignore
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const currentTrip = trips.find(t => t.id === selectedTripId) || trips[0];

  const handleUpdateTrip = (updated: Trip) => {
    setTrips(prev => prev.map(t => t.id === updated.id ? updated : t));
  };

  const handleOpenUpgrade = (reason: string = '') => {
    setUpgradeTriggerReason(reason);
    setIsUpgradeModalOpen(true);
  };

  const handleUpgradeSuccess = () => {
    setIsPro(true);
    setIsUpgradeModalOpen(false);
    showToast('Parabéns! Upgrade VIP PRO ativado com sucesso por R$ 19,90.');
  };

  const handleDowngrade = () => {
    setIsPro(false);
    showToast('Modo de demonstração Grátis ativado.');
  };

  const handleOpenNewTrip = () => {
    if (!isPro && trips.length >= 1) {
      handleOpenUpgrade('Criar mais de 1 viagem ativa');
      return;
    }
    setIsEditingTrip(false);
    setIsTripModalOpen(true);
  };

  const handleSaveTrip = (trip: Trip) => {
    if (isEditingTrip) {
      setTrips(prev => prev.map(t => t.id === trip.id ? trip : t));
      showToast('Viagem atualizada com sucesso!');
    } else {
      setTrips(prev => [trip, ...prev]);
      setSelectedTripId(trip.id);
      showToast('Nova viagem criada com sucesso!');
    }
  };

  const handleImportTemplate = (tpl: CuratedTemplate) => {
    if (!isPro) {
      handleOpenUpgrade(`Importar roteiro de ${tpl.destination}`);
      return;
    }

    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + tpl.durationDays);

    const clonedTrip: Trip = {
      id: `imported-${Date.now()}`,
      title: tpl.title,
      destination: tpl.destination,
      country: tpl.country,
      startDate: today.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      coverImage: tpl.coverImage,
      tripStyle: 'Cultural',
      totalBudget: tpl.suggestedBudget,
      emergencyContacts: [
        { label: 'Polícia Turística Local', number: '190' },
        { label: 'Serviço de Ambulância', number: '192' }
      ],
      packingList: [
        { id: 'ip1', name: 'Documento original e cópia impressa', category: 'docs', isPacked: false },
        { id: 'ip2', name: 'Dinheiro local / cartões habilitados', category: 'docs', isPacked: false },
        { id: 'ip3', name: 'Protetor solar e óculos de sol', category: 'health', isPacked: false }
      ],
      days: tpl.days
    };

    setTrips(prev => [clonedTrip, ...prev]);
    setSelectedTripId(clonedTrip.id);
    setCurrentTab('itinerary');
    showToast(`Roteiro de ${tpl.destination} importado com sucesso!`);
  };

  const handlePrintExport = () => {
    if (!isPro) {
      handleOpenUpgrade('Exportar o roteiro completo em PDF');
      return;
    }
    window.print();
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs animate-bounce no-print">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Navigation */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isPro={isPro}
        onOpenUpgrade={() => handleOpenUpgrade('Acesso Ilimitado ao Roteiro VIP')}
        onOpenNewTrip={handleOpenNewTrip}
        onPrintExport={handlePrintExport}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 no-print">
        {/* VIP Upgrade Pitch Banner (if free) */}
        {!isPro && (
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-400/15 to-amber-500/10 border border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-neutral-900 flex items-center justify-center font-bold shrink-0 shadow-xs">
                <Sparkles className="w-5 h-5 text-neutral-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                    Upgrade Especial Roteiro PRO
                  </h2>
                  <span className="text-[10px] font-bold bg-amber-400/80 text-amber-950 px-1.5 py-0.5 rounded">
                    R$ 19,90 único
                  </span>
                </div>
                <p className="text-xs text-amber-900 mt-0.5">
                  Desbloqueie roteiros ilimitados, exportação em PDF de alta qualidade para o celular e catálogo com roteiros prontos.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={STRIPE_CHECKOUT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#635BFF] hover:bg-[#5851EA] text-white font-semibold text-xs rounded-lg transition-colors whitespace-nowrap shadow-xs"
              >
                <span>Pagar via Stripe</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => handleOpenUpgrade('Aproveitar oferta de lançamento')}
                className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs rounded-lg transition-colors whitespace-nowrap shadow-xs"
              >
                Ver Benefícios
              </button>
            </div>
          </div>
        )}

        {/* Current Trip Hero & Quick KPIs */}
        {currentTrip && (
          <TripBanner
            trip={currentTrip}
            trips={trips}
            onSelectTrip={setSelectedTripId}
            onOpenNewTrip={handleOpenNewTrip}
            isPro={isPro}
            onOpenUpgrade={handleOpenUpgrade}
            onEditTrip={() => {
              setIsEditingTrip(true);
              setIsTripModalOpen(true);
            }}
          />
        )}

        {/* Floating Quick Tools Bar */}
        <div className="flex items-center justify-between gap-3 mb-6 p-3 bg-white rounded-xl border border-neutral-200/90 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-neutral-600">
            <span className="font-semibold text-neutral-800">Ferramentas de Viagem:</span>
            <span className="hidden sm:inline text-neutral-400">·</span>
            <span className="hidden sm:inline text-[11px] text-neutral-500">
              Câmbio ao vivo, contatos de emergência e impressão
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsToolsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
            >
              <Coins className="w-3.5 h-3.5 text-amber-600" />
              <span>Moedas & Emergência</span>
            </button>

            <button
              onClick={handlePrintExport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
            >
              <FileDown className="w-3.5 h-3.5 text-neutral-700" />
              <span>Salvar PDF</span>
            </button>
          </div>
        </div>

        {/* Main Tab Content */}
        {currentTab === 'itinerary' && currentTrip && (
          <ItineraryView
            trip={currentTrip}
            onUpdateTrip={handleUpdateTrip}
            isPro={isPro}
            onOpenUpgrade={handleOpenUpgrade}
          />
        )}

        {currentTab === 'budget' && currentTrip && (
          <BudgetView
            trip={currentTrip}
            onUpdateTrip={handleUpdateTrip}
            isPro={isPro}
            onOpenUpgrade={handleOpenUpgrade}
          />
        )}

        {currentTab === 'packing' && currentTrip && (
          <PackingView
            trip={currentTrip}
            onUpdateTrip={handleUpdateTrip}
          />
        )}

        {currentTab === 'templates' && (
          <CuratedTemplatesView
            isPro={isPro}
            onOpenUpgrade={handleOpenUpgrade}
            onImportTemplate={handleImportTemplate}
          />
        )}
      </main>

      {/* Print Document Renderer (Visible only on window.print()) */}
      {currentTrip && <PrintDocument trip={currentTrip} />}

      {/* Footer */}
      <footer className="mt-auto border-t border-neutral-200 bg-white py-6 text-xs text-neutral-500 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-800">RoteiroFácil</span>
            <span>·</span>
            <span>Planejador simples e inteligente de viagens</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => handleOpenUpgrade('Detalhes do Upgrade')}
              className="text-neutral-600 hover:text-neutral-900 font-medium"
            >
              Plano VIP (R$ 19,90)
            </button>
            <span>·</span>
            <button
              onClick={() => setIsPro(!isPro)}
              className="text-neutral-400 hover:text-neutral-600 text-[11px]"
            >
              Alternar Modo ({isPro ? 'VIP Ativo' : 'Básico'})
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        isPro={isPro}
        onUpgradeSuccess={handleUpgradeSuccess}
        onDowngrade={handleDowngrade}
        featureTriggered={upgradeTriggerReason}
      />

      <TripModal
        isOpen={isTripModalOpen}
        onClose={() => setIsTripModalOpen(false)}
        onSave={handleSaveTrip}
        tripToEdit={isEditingTrip ? currentTrip : null}
        isPro={isPro}
        onOpenUpgrade={handleOpenUpgrade}
      />

      {currentTrip && (
        <TravelToolsModal
          isOpen={isToolsModalOpen}
          onClose={() => setIsToolsModalOpen(false)}
          trip={currentTrip}
          onUpdateTrip={handleUpdateTrip}
          isPro={isPro}
          onOpenUpgrade={handleOpenUpgrade}
          onPrintExport={handlePrintExport}
        />
      )}
    </div>
  );
}
