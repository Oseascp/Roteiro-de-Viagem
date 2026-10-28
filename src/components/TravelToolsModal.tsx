import React, { useState } from 'react';
import { Trip } from '../types/travel';
import { CURRENCY_RATES } from '../data/mockTrips';
import { X, Coins, PhoneCall, ShieldAlert, FileDown, Plus, Trash2 } from 'lucide-react';

interface TravelToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip;
  onUpdateTrip: (updated: Trip) => void;
  isPro: boolean;
  onOpenUpgrade: (reason: string) => void;
  onPrintExport: () => void;
}

export const TravelToolsModal: React.FC<TravelToolsModalProps> = ({
  isOpen,
  onClose,
  trip,
  onUpdateTrip,
  isPro,
  onOpenUpgrade,
  onPrintExport
}) => {
  const [activeTab, setActiveTab] = useState<'currency' | 'emergency'>('currency');
  const [amountBRL, setAmountBRL] = useState<number>(100);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  // Emergency contact new form
  const [newContactLabel, setNewContactLabel] = useState('');
  const [newContactNum, setNewContactNum] = useState('');

  if (!isOpen) return null;

  const currentRate = CURRENCY_RATES.find(c => c.code === selectedCurrency) || CURRENCY_RATES[0];
  const convertedForeign = (amountBRL / currentRate.rateBRL).toFixed(2);

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactLabel.trim() || !newContactNum.trim()) return;

    onUpdateTrip({
      ...trip,
      emergencyContacts: [
        ...trip.emergencyContacts,
        { label: newContactLabel.trim(), number: newContactNum.trim() }
      ]
    });
    setNewContactLabel('');
    setNewContactNum('');
  };

  const handleDeleteContact = (index: number) => {
    onUpdateTrip({
      ...trip,
      emergencyContacts: trip.emergencyContacts.filter((_, idx) => idx !== index)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-neutral-900">
              Ferramentas Úteis da Viagem
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-neutral-200 px-5 pt-3 gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('currency')}
            className={`pb-2.5 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'currency'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Conversor de Moedas</span>
          </button>

          <button
            onClick={() => setActiveTab('emergency')}
            className={`pb-2.5 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'emergency'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Contatos de Emergência</span>
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'currency' && (
            <div className="space-y-5">
              <p className="text-xs text-neutral-600">
                Calcule rapidamente quanto custa em Real (BRL) ou na moeda local do seu destino.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
                  <span className="text-[11px] text-neutral-500 block font-medium">Você tem (BRL)</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs font-bold text-neutral-400">R$</span>
                    <input
                      type="number"
                      value={amountBRL}
                      onChange={(e) => setAmountBRL(parseFloat(e.target.value) || 0)}
                      className="w-full text-xl font-bold font-mono text-neutral-900 bg-transparent focus:outline-none"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
                  <span className="text-[11px] text-amber-900 block font-medium">Equivale a ({selectedCurrency})</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs font-bold text-amber-600">{currentRate.symbol}</span>
                    <span className="text-xl font-bold font-mono text-amber-950">
                      {convertedForeign}
                    </span>
                  </div>
                </div>
              </div>

              {/* Currency Selector Chips */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-neutral-700">Selecione a moeda:</span>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {CURRENCY_RATES.map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => setSelectedCurrency(curr.code)}
                      className={`p-2 rounded-xl text-center border transition-all text-xs ${
                        selectedCurrency === curr.code
                          ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs font-bold'
                          : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-800'
                      }`}
                    >
                      <span className="text-base block">{curr.flag}</span>
                      <span className="text-[11px] font-mono">{curr.code}</span>
                      <span className="text-[9px] block opacity-75">1 = R$ {curr.rateBRL.toFixed(2)}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'emergency' && (
            <div className="space-y-5">
              <p className="text-xs text-neutral-600">
                Mantenha telefones de hospitais, polícia local e consulados sempre salvos na mão.
              </p>

              <div className="space-y-2">
                {trip.emergencyContacts.map((contact, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-200"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900">{contact.label}</h4>
                      <p className="text-xs font-mono text-neutral-600 mt-0.5">{contact.number}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteContact(idx)}
                      className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-md"
                      title="Remover"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddContact} className="pt-3 border-t border-neutral-200 space-y-2 text-xs">
                <span className="font-semibold text-neutral-800 block">Adicionar Novo Contato</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Descrição (ex: Hotel ou Seguro)"
                    value={newContactLabel}
                    onChange={(e) => setNewContactLabel(e.target.value)}
                    className="px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                  <input
                    type="text"
                    placeholder="Telefone / Ramal"
                    value={newContactNum}
                    onChange={(e) => setNewContactNum(e.target.value)}
                    className="px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 font-mono focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Salvar Contato</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
