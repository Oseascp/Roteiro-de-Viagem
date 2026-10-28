import React from 'react';
import { CURATED_TEMPLATES } from '../data/mockTrips';
import { CuratedTemplate, Trip } from '../types/travel';
import { 
  Sparkles, 
  Lock, 
  MapPin, 
  Calendar, 
  Wallet, 
  CheckCircle, 
  ArrowRight,
  Compass
} from 'lucide-react';

interface CuratedTemplatesViewProps {
  isPro: boolean;
  onOpenUpgrade: (reason: string) => void;
  onImportTemplate: (template: CuratedTemplate) => void;
}

export const CuratedTemplatesView: React.FC<CuratedTemplatesViewProps> = ({
  isPro,
  onOpenUpgrade,
  onImportTemplate
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-neutral-900 text-white rounded-2xl p-6 md:p-8 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>Coleção de Destinos Incríveis</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Roteiros Prontos Curados por Especialistas
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300">
            Itinerários testados e organizados com os melhores horários, pontos turísticos imperdíveis,
            dicas gastronômicas e estimativas financeiras prontas para clonar e personalizar.
          </p>

          {!isPro && (
            <div className="pt-2">
              <button
                onClick={() => onOpenUpgrade('Acesso aos Roteiros Curados VIP')}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-900 text-xs font-bold rounded-lg transition-colors shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>Desbloquear Todos os Roteiros por R$ 19,90</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CURATED_TEMPLATES.map((tpl) => (
          <div
            key={tpl.id}
            className="bg-white rounded-2xl border border-neutral-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Cover Photo */}
              <div className="relative h-44 w-full bg-neutral-900">
                <img
                  src={tpl.coverImage}
                  alt={tpl.destination}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute top-3 right-3">
                  {!isPro ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100/95 border border-amber-300 px-2 py-0.5 rounded-full shadow-xs">
                      <Lock className="w-3 h-3 text-amber-700" />
                      VIP PRO
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/95 border border-emerald-300 px-2 py-0.5 rounded-full shadow-xs">
                      Liberado
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-3 text-white">
                  <div className="flex items-center gap-1 text-xs text-amber-300 font-medium">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{tpl.destination}</span>
                  </div>
                  <h3 className="text-base font-bold text-white leading-tight">
                    {tpl.title}
                  </h3>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between text-xs text-neutral-500 border-b border-neutral-100 pb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{tpl.durationDays} dias planejados</span>
                  </span>
                  <span className="flex items-center gap-1 font-mono tabular-nums text-neutral-700 font-semibold">
                    <Wallet className="w-3.5 h-3.5 text-neutral-400" />
                    <span>R$ {tpl.suggestedBudget.toLocaleString('pt-BR')} est.</span>
                  </span>
                </div>

                <p className="text-xs text-neutral-600 line-clamp-2">
                  {tpl.description}
                </p>

                {/* Highlights */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-neutral-700 uppercase tracking-wide block">
                    Destaques do Roteiro:
                  </span>
                  <ul className="space-y-1 text-xs text-neutral-600">
                    {tpl.highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="truncate">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Action button */}
            <div className="p-5 pt-0">
              {isPro ? (
                <button
                  onClick={() => onImportTemplate(tpl)}
                  className="w-full py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <span>Importar para Minhas Viagens</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => onOpenUpgrade(`Importar o roteiro "${tpl.title}"`)}
                  className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-neutral-900 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Lock className="w-3.5 h-3.5 text-neutral-900" />
                  <span>Desbloquear Roteiro (R$ 19,90)</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
