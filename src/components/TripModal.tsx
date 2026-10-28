import React, { useState, useEffect } from 'react';
import { Trip } from '../types/travel';
import { X, MapPin, Calendar, Wallet, Image as ImageIcon } from 'lucide-react';

interface TripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (trip: Trip) => void;
  tripToEdit?: Trip | null;
  isPro: boolean;
  onOpenUpgrade: (reason: string) => void;
}

export const TripModal: React.FC<TripModalProps> = ({
  isOpen,
  onClose,
  onSave,
  tripToEdit,
  isPro,
  onOpenUpgrade
}) => {
  const [form, setForm] = useState({
    title: '',
    destination: '',
    country: 'Brasil',
    startDate: '',
    endDate: '',
    coverImage: '/src/assets/images/travel_dest_rio_1793143466827.jpg',
    tripStyle: 'Casal' as Trip['tripStyle'],
    totalBudget: 3500,
    flightOrBusNotes: '',
    hotelNotes: ''
  });

  useEffect(() => {
    if (tripToEdit) {
      setForm({
        title: tripToEdit.title,
        destination: tripToEdit.destination,
        country: tripToEdit.country,
        startDate: tripToEdit.startDate,
        endDate: tripToEdit.endDate,
        coverImage: tripToEdit.coverImage,
        tripStyle: tripToEdit.tripStyle,
        totalBudget: tripToEdit.totalBudget,
        flightOrBusNotes: tripToEdit.flightOrBusNotes || '',
        hotelNotes: tripToEdit.hotelNotes || ''
      });
    } else {
      // Default dates: tomorrow until 3 days later
      const start = new Date();
      start.setDate(start.getDate() + 14);
      const end = new Date(start);
      end.setDate(end.getDate() + 3);

      setForm({
        title: 'Nova Viagem dos Sonhos',
        destination: 'Salvador, BA',
        country: 'Brasil',
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0],
        coverImage: '/src/assets/images/travel_dest_rio_1793143466827.jpg',
        tripStyle: 'Casal',
        totalBudget: 3500,
        flightOrBusNotes: '',
        hotelNotes: ''
      });
    }
  }, [tripToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (tripToEdit) {
      const updated: Trip = {
        ...tripToEdit,
        title: form.title,
        destination: form.destination,
        country: form.country,
        startDate: form.startDate,
        endDate: form.endDate,
        coverImage: form.coverImage,
        tripStyle: form.tripStyle,
        totalBudget: Number(form.totalBudget),
        flightOrBusNotes: form.flightOrBusNotes,
        hotelNotes: form.hotelNotes
      };
      onSave(updated);
    } else {
      const newTrip: Trip = {
        id: `trip-${Date.now()}`,
        title: form.title,
        destination: form.destination,
        country: form.country,
        startDate: form.startDate,
        endDate: form.endDate,
        coverImage: form.coverImage,
        tripStyle: form.tripStyle,
        totalBudget: Number(form.totalBudget),
        flightOrBusNotes: form.flightOrBusNotes,
        hotelNotes: form.hotelNotes,
        emergencyContacts: [
          { label: 'Polícia Local', number: '190' },
          { label: 'SAMU / Ambulância', number: '192' }
        ],
        packingList: [
          { id: 'dp1', name: 'Documentos e cartões', category: 'docs', isPacked: false },
          { id: 'dp2', name: 'Carregador e celular', category: 'electronics', isPacked: false },
          { id: 'dp3', name: 'Protetor solar e kit higiene', category: 'health', isPacked: false }
        ],
        days: [
          {
            id: `d1-${Date.now()}`,
            dayNumber: 1,
            date: form.startDate,
            themeOrTitle: 'Chegada e Primeiras Impressões',
            activities: [
              {
                id: `a1-${Date.now()}`,
                time: '12:00',
                title: 'Check-in na Hospedagem',
                category: 'hotel',
                cost: 0,
                isPaid: true,
                completed: false
              }
            ]
          }
        ]
      };
      onSave(newTrip);
    }
    onClose();
  };

  const sampleImages = [
    { label: 'Praia & Costa', url: '/src/assets/images/travel_dest_rio_1793143466827.jpg' },
    { label: 'Europa & Cidade', url: '/src/assets/images/travel_dest_paris_1793143467802.jpg' },
    { label: 'Serra & Montanha', url: '/src/assets/images/travel_dest_gramado_1793143467014.jpg' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden my-6">
        <div className="flex items-center justify-between p-5 border-b border-neutral-200">
          <h3 className="text-base font-bold text-neutral-900">
            {tripToEdit ? 'Editar Detalhes da Viagem' : 'Criar Nova Viagem'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-neutral-800">Nome da Viagem</label>
            <input
              type="text"
              required
              placeholder="Ex: Férias de Verão em Salvador"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-neutral-800">Destino (Cidade / Região)</label>
              <input
                type="text"
                required
                placeholder="Ex: Salvador, BA"
                value={form.destination}
                onChange={(e) => setForm({ ...form, destination: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-neutral-800">País</label>
              <input
                type="text"
                required
                placeholder="Ex: Brasil"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-neutral-800">Data de Início</label>
              <input
                type="date"
                required
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-neutral-800">Data de Término</label>
              <input
                type="date"
                required
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-neutral-800">Estilo de Viagem</label>
              <select
                value={form.tripStyle}
                onChange={(e) => setForm({ ...form, tripStyle: e.target.value as Trip['tripStyle'] })}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              >
                <option value="Casal">Casal</option>
                <option value="Família">Família</option>
                <option value="Econômica">Econômica / Mochilão</option>
                <option value="Aventura">Aventura</option>
                <option value="Gastronômica">Gastronômica</option>
                <option value="Cultural">Cultural</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-neutral-800">Orçamento Planejado (R$)</label>
              <input
                type="number"
                min="0"
                step="50"
                value={form.totalBudget}
                onChange={(e) => setForm({ ...form, totalBudget: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>
          </div>

          {/* Cover Photo Picker */}
          <div className="space-y-2">
            <label className="font-semibold text-neutral-800 block">Foto de Capa</label>
            <div className="grid grid-cols-3 gap-2">
              {sampleImages.map((img) => (
                <button
                  type="button"
                  key={img.url}
                  onClick={() => setForm({ ...form, coverImage: img.url })}
                  className={`relative rounded-lg overflow-hidden border-2 h-16 transition-all ${
                    form.coverImage === img.url
                      ? 'border-neutral-900 ring-2 ring-neutral-900/20'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                  <span className="absolute inset-0 bg-black/30 flex items-center justify-center text-[10px] text-white font-medium">
                    {img.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-neutral-100">
            <div className="space-y-1">
              <label className="font-semibold text-neutral-700">Notas de Voos / Passagens</label>
              <input
                type="text"
                placeholder="Ex: Voo LA 3400 saindo de Guarulhos terminal 2"
                value={form.flightOrBusNotes}
                onChange={(e) => setForm({ ...form, flightOrBusNotes: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-neutral-700">Notas de Hospedagem / Hotel</label>
              <input
                type="text"
                placeholder="Ex: Pousada do Sol, Check-in às 14h, código de reserva #9982"
                value={form.hotelNotes}
                onChange={(e) => setForm({ ...form, hotelNotes: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-neutral-600 hover:text-neutral-900 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-xl shadow-xs transition-colors"
            >
              {tripToEdit ? 'Salvar Alterações' : 'Criar Viagem'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
