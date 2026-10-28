import React from 'react';
import { Trip } from '../types/travel';
import { 
  Calendar, 
  MapPin, 
  Wallet, 
  Sparkles, 
  Luggage, 
  ChevronDown
} from 'lucide-react';

interface TripBannerProps {
  trip: Trip;
  trips: Trip[];
  onSelectTrip: (id: string) => void;
  onOpenNewTrip: () => void;
  isPro: boolean;
  onOpenUpgrade: (reason: string) => void;
  onEditTrip: () => void;
}

export const TripBanner: React.FC<TripBannerProps> = ({
  trip,
  trips,
  onSelectTrip,
  onOpenNewTrip,
  isPro,
  onOpenUpgrade,
  onEditTrip
}) => {
  // Calculate days count
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  // Calculate totals
  const totalActivities = trip.days.reduce((acc, d) => acc + d.activities.length, 0);
  const totalCost = trip.days.reduce(
    (acc, d) => acc + d.activities.reduce((sum, a) => sum + (a.cost || 0), 0),
    0
  );
  const packedItems = trip.packingList.filter(p => p.isPacked).length;

  const handleTripSwitch = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === '__new__') {
      if (!isPro && trips.length >= 1) {
        onOpenUpgrade('Criar múltiplas viagens ativas');
      } else {
        onOpenNewTrip();
      }
    } else {
      onSelectTrip(value);
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-lg border border-neutral-200/80 bg-neutral-900 text-white mb-8">
      {/* Background Image with Measured Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={trip.coverImage}
          alt={trip.destination}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-[0.75] contrast-[1.05]"
          onError={(e) => {
            // Fallback gradient if image fails to load
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-900/60 to-neutral-900/40" />
      </div>

      {/* Banner Content */}
      <div className="relative z-10 p-6 md:p-8 flex flex-col justify-between min-h-[220px]">
        {/* Top Controls: Selector & Edit */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {trip.destination} · {trip.country}
            </span>
            <span className="text-neutral-400 text-xs">/</span>
            <span className="text-xs text-neutral-300">{trip.tripStyle}</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Trip switcher */}
            <div className="relative inline-block">
              <select
                aria-label="Selecionar Viagem Ativa"
                value={trip.id}
                onChange={handleTripSwitch}
                className="appearance-none bg-neutral-800/90 hover:bg-neutral-800 text-white text-xs font-medium py-1.5 pl-3 pr-8 rounded-lg border border-neutral-700/80 focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
              >
                {trips.map((t) => (
                  <option key={t.id} value={t.id} className="bg-neutral-900 text-white">
                    {t.title} ({t.destination})
                  </option>
                ))}
                <option value="__new__" className="bg-neutral-900 text-amber-400 font-semibold">
                  + Nova Viagem {(!isPro && trips.length >= 1) ? '(PRO)' : ''}
                </option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              onClick={onEditTrip}
              className="px-3 py-1.5 text-xs text-neutral-300 hover:text-white bg-neutral-800/60 hover:bg-neutral-800 border border-neutral-700 rounded-lg transition-colors"
            >
              Editar Detalhes
            </button>
          </div>
        </div>

        {/* Middle: Title & Dates */}
        <div className="my-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white text-balance">
            {trip.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-neutral-300 mt-2 font-normal">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>
                {new Date(trip.startDate + 'T00:00:00').toLocaleDateString('pt-BR')} até{' '}
                {new Date(trip.endDate + 'T00:00:00').toLocaleDateString('pt-BR')}
              </span>
            </span>
            <span className="text-neutral-500">·</span>
            <span>{diffDays} dias de aventura</span>
          </div>
        </div>

        {/* Bottom Strip: Quick KPIs with Tabular Figures */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10 text-xs">
          <div>
            <span className="text-neutral-400 block text-[11px]">Orçamento Total</span>
            <span className="font-semibold text-white font-mono tabular-nums text-sm">
              R$ {trip.totalBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div>
            <span className="text-neutral-400 block text-[11px]">Gastos Planejados</span>
            <span className="font-semibold text-amber-300 font-mono tabular-nums text-sm">
              R$ {totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div>
            <span className="text-neutral-400 block text-[11px]">Atividades no Roteiro</span>
            <span className="font-semibold text-white font-mono tabular-nums text-sm">
              {totalActivities} paradas ({trip.days.length} dias)
            </span>
          </div>

          <div>
            <span className="text-neutral-400 block text-[11px]">Checklist de Bagagem</span>
            <span className="font-semibold text-emerald-400 font-mono tabular-nums text-sm flex items-center gap-1">
              <Luggage className="w-3.5 h-3.5" />
              {packedItems} de {trip.packingList.length} prontos
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
