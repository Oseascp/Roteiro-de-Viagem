import React, { useState } from 'react';
import { Trip, PackingCategory, PackingItem } from '../types/travel';
import { 
  Check, 
  Plus, 
  Trash2, 
  Luggage, 
  FileText, 
  Shirt, 
  Smartphone, 
  HeartPulse, 
  Sparkles 
} from 'lucide-react';

interface PackingViewProps {
  trip: Trip;
  onUpdateTrip: (updated: Trip) => void;
}

export const PackingView: React.FC<PackingViewProps> = ({ trip, onUpdateTrip }) => {
  const [selectedCategory, setSelectedCategory] = useState<PackingCategory | 'all'>('all');
  const [newItemName, setNewItemName] = useState('');
  const [newItemCat, setNewItemCat] = useState<PackingCategory>('clothes');

  const totalItems = trip.packingList.length;
  const packedItems = trip.packingList.filter(i => i.isPacked).length;
  const progressPercent = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;

  const categoryMeta: Record<PackingCategory, { label: string; icon: React.FC<{ className?: string }> }> = {
    docs: { label: 'Documentos', icon: FileText },
    clothes: { label: 'Roupas & Calçados', icon: Shirt },
    electronics: { label: 'Eletrônicos', icon: Smartphone },
    health: { label: 'Farmácia & Higiene', icon: HeartPulse },
    other: { label: 'Diversos', icon: Luggage },
  };

  const handleToggleItem = (itemId: string) => {
    const updatedList = trip.packingList.map(item =>
      item.id === itemId ? { ...item, isPacked: !item.isPacked } : item
    );
    onUpdateTrip({ ...trip, packingList: updatedList });
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: PackingItem = {
      id: `p-${Date.now()}`,
      name: newItemName.trim(),
      category: newItemCat,
      isPacked: false
    };

    onUpdateTrip({
      ...trip,
      packingList: [...trip.packingList, newItem]
    });
    setNewItemName('');
  };

  const handleDeleteItem = (itemId: string) => {
    onUpdateTrip({
      ...trip,
      packingList: trip.packingList.filter(i => i.id !== itemId)
    });
  };

  const handleAddSuggestedEssentials = () => {
    const suggestions: { name: string; category: PackingCategory }[] = [
      { name: 'Carregador de celular portátil (Powerbank)', category: 'electronics' },
      { name: 'Cadeado TSA para mala', category: 'other' },
      { name: 'Kit primeiros socorros e antialérgico', category: 'health' },
      { name: 'Comprovante de reserva de hospedagem', category: 'docs' },
      { name: 'Guarda-chuva compacto ou capa', category: 'clothes' }
    ];

    const currentNames = new Set(trip.packingList.map(i => i.name.toLowerCase()));
    const toAdd = suggestions
      .filter(s => !currentNames.has(s.name.toLowerCase()))
      .map(s => ({
        id: `p-${Date.now()}-${Math.random()}`,
        name: s.name,
        category: s.category,
        isPacked: false
      }));

    if (toAdd.length > 0) {
      onUpdateTrip({
        ...trip,
        packingList: [...trip.packingList, ...toAdd]
      });
    }
  };

  const filteredItems = selectedCategory === 'all'
    ? trip.packingList
    : trip.packingList.filter(i => i.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Top Banner: Progress */}
      <div className="bg-white rounded-xl p-5 border border-neutral-200/90 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <Luggage className="w-5 h-5 text-neutral-700" />
              <span>Checklist de Bagagem</span>
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Certifique-se de que nada essencial ficou para trás antes do embarque.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleAddSuggestedEssentials}
              className="px-3 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
            >
              + Adicionar Essenciais Sugeridos
            </button>
            <div className="text-right">
              <span className="text-xs font-semibold text-neutral-900 font-mono tabular-nums">
                {packedItems}/{totalItems} ({progressPercent}%)
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-neutral-100 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              progressPercent === 100 ? 'bg-emerald-600' : 'bg-neutral-900'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Add New Item Form */}
      <form
        onSubmit={handleAddItem}
        className="bg-white rounded-xl p-4 border border-neutral-200/90 shadow-xs flex flex-col sm:flex-row items-center gap-3"
      >
        <input
          type="text"
          placeholder="Adicionar item à mala (ex: Adaptador universal, chinelo...)"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          className="flex-1 w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
        />

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={newItemCat}
            onChange={(e) => setNewItemCat(e.target.value as PackingCategory)}
            className="px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 text-neutral-700"
          >
            <option value="clothes">Roupas</option>
            <option value="docs">Documentos</option>
            <option value="electronics">Eletrônicos</option>
            <option value="health">Farmácia / Higiene</option>
            <option value="other">Diversos</option>
          </select>

          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shrink-0 shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar</span>
          </button>
        </div>
      </form>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            selectedCategory === 'all'
              ? 'bg-neutral-900 text-white shadow-xs font-semibold'
              : 'bg-white hover:bg-neutral-100 text-neutral-600 border border-neutral-200'
          }`}
        >
          Todos ({trip.packingList.length})
        </button>
        {(['docs', 'clothes', 'electronics', 'health', 'other'] as PackingCategory[]).map(cat => {
          const meta = categoryMeta[cat];
          const Icon = meta.icon;
          const count = trip.packingList.filter(i => i.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                selectedCategory === cat
                  ? 'bg-neutral-900 text-white shadow-xs font-semibold'
                  : 'bg-white hover:bg-neutral-100 text-neutral-600 border border-neutral-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{meta.label}</span>
              <span className="text-[10px] opacity-75">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Checklist Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {filteredItems.length === 0 ? (
          <div className="col-span-full py-8 text-center bg-white rounded-xl border border-neutral-200 text-neutral-500 text-xs">
            Nenhum item nesta categoria. Digite acima para adicionar!
          </div>
        ) : (
          filteredItems.map(item => {
            const meta = categoryMeta[item.category];
            const Icon = meta.icon;

            return (
              <div
                key={item.id}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  item.isPacked
                    ? 'bg-neutral-50/70 border-neutral-200 opacity-60'
                    : 'bg-white border-neutral-200/90 hover:border-neutral-300 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => handleToggleItem(item.id)}
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                      item.isPacked
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-neutral-300 hover:border-neutral-400 bg-white'
                    }`}
                  >
                    {item.isPacked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  <div className="flex items-center gap-2 min-w-0">
                    <Icon className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span
                      className={`text-xs font-medium text-neutral-800 truncate ${
                        item.isPacked ? 'line-through text-neutral-400' : ''
                      }`}
                    >
                      {item.name}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteItem(item.id)}
                  className="p-1 text-neutral-400 hover:text-rose-600 rounded-md transition-colors"
                  title="Excluir item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
