import React from 'react';
import { Trip } from '../types/travel';
import { MapPin, Calendar, Clock, PhoneCall, CheckSquare } from 'lucide-react';

interface PrintDocumentProps {
  trip: Trip;
}

export const PrintDocument: React.FC<PrintDocumentProps> = ({ trip }) => {
  const totalActivities = trip.days.reduce((acc, d) => acc + d.activities.length, 0);
  const totalCost = trip.days.reduce(
    (acc, d) => acc + d.activities.reduce((sum, a) => sum + (a.cost || 0), 0),
    0
  );

  return (
    <div className="print-only p-8 max-w-4xl mx-auto bg-white text-neutral-900 font-sans">
      {/* Document Header */}
      <div className="border-b-2 border-neutral-900 pb-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs uppercase tracking-widest text-neutral-500 font-bold block mb-1">
              Guia & Roteiro de Viagem · RoteiroFácil VIP
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900">
              {trip.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-neutral-600 mt-2">
              <span className="font-semibold text-neutral-800">{trip.destination}, {trip.country}</span>
              <span>·</span>
              <span>
                {new Date(trip.startDate + 'T00:00:00').toLocaleDateString('pt-BR')} até{' '}
                {new Date(trip.endDate + 'T00:00:00').toLocaleDateString('pt-BR')}
              </span>
              <span>·</span>
              <span>Estilo: {trip.tripStyle}</span>
            </div>
          </div>

          <div className="text-right border border-neutral-300 p-3 rounded-lg text-xs">
            <span className="text-neutral-500 block">Orçamento Total</span>
            <span className="text-base font-bold font-mono">
              R$ {trip.totalBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] text-neutral-500 block mt-1">
              Gasto Planejado: R$ {totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Accommodation and Flights Notes */}
        {(trip.hotelNotes || trip.flightOrBusNotes) && (
          <div className="mt-4 pt-3 border-t border-neutral-200 grid grid-cols-2 gap-4 text-xs">
            {trip.hotelNotes && (
              <div>
                <strong className="block text-neutral-700">Hospedagem:</strong>
                <p className="text-neutral-600">{trip.hotelNotes}</p>
              </div>
            )}
            {trip.flightOrBusNotes && (
              <div>
                <strong className="block text-neutral-700">Passagens / Voos:</strong>
                <p className="text-neutral-600">{trip.flightOrBusNotes}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Days Itinerary */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1">
          Itinerário Completo Dia a Dia
        </h2>

        {trip.days.map((day) => {
          const dayCost = day.activities.reduce((sum, a) => sum + (a.cost || 0), 0);
          return (
            <div key={day.id} className="print-card border border-neutral-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                <div>
                  <h3 className="font-bold text-base text-neutral-900">
                    Dia {day.dayNumber}: {day.themeOrTitle}
                  </h3>
                  <span className="text-xs text-neutral-500">
                    {new Date(day.date + 'T00:00:00').toLocaleDateString('pt-BR', {
                      weekday: 'long',
                      day: '2-digit',
                      month: 'long'
                    })}
                  </span>
                </div>
                <div className="text-xs font-mono font-semibold text-neutral-800">
                  R$ {dayCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>

              {day.notes && (
                <div className="text-xs italic text-neutral-600 bg-neutral-50 p-2 rounded">
                  <strong>Dica:</strong> {day.notes}
                </div>
              )}

              {/* Day Activities */}
              <div className="space-y-2">
                {day.activities.map((act) => (
                  <div
                    key={act.id}
                    className="flex items-start justify-between text-xs py-1.5 border-b border-neutral-100 last:border-none"
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-mono font-bold text-neutral-800 shrink-0 w-12">
                        {act.time}
                      </span>
                      <div>
                        <span className="font-semibold text-neutral-900">{act.title}</span>
                        {act.location && (
                          <span className="text-neutral-500 block text-[11px]">
                            {act.location}
                          </span>
                        )}
                        {act.notes && (
                          <span className="text-neutral-600 italic block text-[11px]">
                            Obs: {act.notes}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono font-semibold text-neutral-900">
                        {act.cost > 0
                          ? `R$ ${act.cost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                          : 'Grátis'}
                      </span>
                      <span className="text-[10px] block text-neutral-500">
                        {act.isPaid ? 'Pago' : 'A Pagar no Local'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Emergency Contacts & Packing Checklist in print footer */}
      <div className="mt-8 pt-4 border-t-2 border-neutral-900 grid grid-cols-2 gap-6 text-xs">
        <div>
          <h4 className="font-bold uppercase tracking-wider text-neutral-900 mb-2">
            Contatos de Emergência
          </h4>
          <ul className="space-y-1 text-neutral-700">
            {trip.emergencyContacts.map((c, i) => (
              <li key={i}>
                <strong>{c.label}:</strong> <span className="font-mono">{c.number}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold uppercase tracking-wider text-neutral-900 mb-2">
            Checklist de Bagagem
          </h4>
          <p className="text-neutral-600">
            {trip.packingList.filter(p => p.isPacked).length} de {trip.packingList.length} itens marcados como prontos para a viagem.
          </p>
        </div>
      </div>

      <div className="mt-6 text-center text-[10px] text-neutral-400">
        Gerado pelo RoteiroFácil · Tenha uma excelente e inesquecível viagem!
      </div>
    </div>
  );
};
