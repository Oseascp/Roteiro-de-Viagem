import React, { useState } from 'react';
import { Trip, DayPlan, Activity, ActivityCategory } from '../types/travel';
import { 
  Plus, 
  Clock, 
  MapPin, 
  Check, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Lock, 
  Sparkles, 
  Utensils, 
  Camera, 
  Building2, 
  Bus, 
  Sun, 
  ShoppingBag,
  CreditCard,
  Edit2
} from 'lucide-react';

interface ItineraryViewProps {
  trip: Trip;
  onUpdateTrip: (updated: Trip) => void;
  isPro: boolean;
  onOpenUpgrade: (reason: string) => void;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  trip,
  onUpdateTrip,
  isPro,
  onOpenUpgrade
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  // New Activity Form State
  const [actForm, setActForm] = useState<{
    time: string;
    title: string;
    category: ActivityCategory;
    location: string;
    cost: string;
    isPaid: boolean;
    notes: string;
  }>({
    time: '10:00',
    title: '',
    category: 'attraction',
    location: '',
    cost: '0',
    isPaid: false,
    notes: ''
  });

  const currentDay = trip.days[selectedDayIndex] || trip.days[0];

  const handleAddDay = () => {
    // Check free plan limit (max 3 days on free plan)
    if (!isPro && trip.days.length >= 3) {
      onOpenUpgrade('Adicionar mais de 3 dias no roteiro');
      return;
    }

    const nextDayNum = trip.days.length + 1;
    // Calculate next date from previous day
    const prevDate = new Date(trip.days[trip.days.length - 1]?.date || trip.startDate);
    prevDate.setDate(prevDate.getDate() + 1);
    const nextDateStr = prevDate.toISOString().split('T')[0];

    const newDay: DayPlan = {
      id: `day-${Date.now()}`,
      dayNumber: nextDayNum,
      date: nextDateStr,
      themeOrTitle: `Dia ${nextDayNum} de Exploração`,
      activities: [],
      notes: ''
    };

    const updatedTrip = {
      ...trip,
      days: [...trip.days, newDay]
    };
    onUpdateTrip(updatedTrip);
    setSelectedDayIndex(trip.days.length);
  };

  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actForm.title.trim()) return;

    const parsedCost = parseFloat(actForm.cost) || 0;

    let updatedActivities: Activity[];
    if (editingActivity) {
      updatedActivities = currentDay.activities.map((a) =>
        a.id === editingActivity.id
          ? {
              ...a,
              time: actForm.time,
              title: actForm.title,
              category: actForm.category,
              location: actForm.location,
              cost: parsedCost,
              isPaid: actForm.isPaid,
              notes: actForm.notes
            }
          : a
      );
    } else {
      const newAct: Activity = {
        id: `act-${Date.now()}`,
        time: actForm.time || '10:00',
        title: actForm.title,
        category: actForm.category,
        location: actForm.location,
        cost: parsedCost,
        isPaid: actForm.isPaid,
        notes: actForm.notes,
        completed: false
      };
      updatedActivities = [...currentDay.activities, newAct];
      // Sort by time
      updatedActivities.sort((a, b) => a.time.localeCompare(b.time));
    }

    const updatedDays = trip.days.map((d, idx) =>
      idx === selectedDayIndex ? { ...d, activities: updatedActivities } : d
    );

    onUpdateTrip({ ...trip, days: updatedDays });
    setIsAddingActivity(false);
    setEditingActivity(null);
    setActForm({
      time: '10:00',
      title: '',
      category: 'attraction',
      location: '',
      cost: '0',
      isPaid: false,
      notes: ''
    });
  };

  const handleStartEdit = (act: Activity) => {
    setEditingActivity(act);
    setActForm({
      time: act.time,
      title: act.title,
      category: act.category,
      location: act.location || '',
      cost: act.cost.toString(),
      isPaid: act.isPaid,
      notes: act.notes || ''
    });
    setIsAddingActivity(true);
  };

  const handleDeleteActivity = (actId: string) => {
    const updatedActivities = currentDay.activities.filter((a) => a.id !== actId);
    const updatedDays = trip.days.map((d, idx) =>
      idx === selectedDayIndex ? { ...d, activities: updatedActivities } : d
    );
    onUpdateTrip({ ...trip, days: updatedDays });
  };

  const handleToggleComplete = (actId: string) => {
    const updatedActivities = currentDay.activities.map((a) =>
      a.id === actId ? { ...a, completed: !a.completed } : a
    );
    const updatedDays = trip.days.map((d, idx) =>
      idx === selectedDayIndex ? { ...d, activities: updatedActivities } : d
    );
    onUpdateTrip({ ...trip, days: updatedDays });
  };

  const handleMoveActivity = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= currentDay.activities.length) return;

    const list = [...currentDay.activities];
    const temp = list[index];
    list[index] = list[newIdx];
    list[newIdx] = temp;

    const updatedDays = trip.days.map((d, idx) =>
      idx === selectedDayIndex ? { ...d, activities: list } : d
    );
    onUpdateTrip({ ...trip, days: updatedDays });
  };

  const handleUpdateDayTitle = (newTitle: string) => {
    const updatedDays = trip.days.map((d, idx) =>
      idx === selectedDayIndex ? { ...d, themeOrTitle: newTitle } : d
    );
    onUpdateTrip({ ...trip, days: updatedDays });
  };

  const handleUpdateDayNotes = (newNotes: string) => {
    const updatedDays = trip.days.map((d, idx) =>
      idx === selectedDayIndex ? { ...d, notes: newNotes } : d
    );
    onUpdateTrip({ ...trip, days: updatedDays });
  };

  // Helper for Category styling & icon
  const getCategoryMeta = (cat: ActivityCategory) => {
    switch (cat) {
      case 'food':
        return { label: 'Gastronomia', icon: Utensils, color: 'text-amber-700 bg-amber-50 border-amber-200' };
      case 'hotel':
        return { label: 'Hospedagem', icon: Building2, color: 'text-blue-700 bg-blue-50 border-blue-200' };
      case 'transport':
        return { label: 'Transporte', icon: Bus, color: 'text-purple-700 bg-purple-50 border-purple-200' };
      case 'leisure':
        return { label: 'Lazer', icon: Sun, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
      case 'shopping':
        return { label: 'Compras', icon: ShoppingBag, color: 'text-rose-700 bg-rose-50 border-rose-200' };
      case 'cultural':
        return { label: 'Cultura & Museu', icon: Camera, color: 'text-teal-700 bg-teal-50 border-teal-200' };
      case 'attraction':
      default:
        return { label: 'Ponto Turístico', icon: Camera, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' };
    }
  };

  const dayTotalCost = currentDay.activities.reduce((sum, a) => sum + (a.cost || 0), 0);

  return (
    <div className="space-y-6">
      {/* Day Selector Segmented Tabs */}
      <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2 border-b border-neutral-200">
        <div className="flex items-center gap-1.5 min-w-max">
          {trip.days.map((day, idx) => {
            const isSelected = idx === selectedDayIndex;
            return (
              <button
                key={day.id}
                onClick={() => {
                  setSelectedDayIndex(idx);
                  setIsAddingActivity(false);
                  setEditingActivity(null);
                }}
                className={`px-4 py-2 text-xs font-medium rounded-lg transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-neutral-900 text-white shadow-sm font-semibold'
                    : 'bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200'
                }`}
              >
                <span>Dia {day.dayNumber}</span>
                <span className={`text-[10px] ${isSelected ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  {day.activities.length}
                </span>
              </button>
            );
          })}

          {/* Add Day Button */}
          <button
            onClick={handleAddDay}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 border border-dashed ${
              !isPro && trip.days.length >= 3
                ? 'bg-amber-50/70 border-amber-300 text-amber-900 hover:bg-amber-100'
                : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            {!isPro && trip.days.length >= 3 ? (
              <>
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>+ Dia (PRO R$ 19,90)</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 text-neutral-500" />
                <span>+ Novo Dia</span>
              </>
            )}
          </button>
        </div>

        {/* Day cost indicator */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-500 shrink-0">
          <span>Gasto previsto do dia:</span>
          <span className="font-semibold text-neutral-900 font-mono tabular-nums">
            R$ {dayTotalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Current Day Header Card */}
      <div className="bg-white rounded-xl p-5 border border-neutral-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 block">
              Dia {currentDay.dayNumber} · {new Date(currentDay.date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
            </span>
            <input
              type="text"
              value={currentDay.themeOrTitle}
              onChange={(e) => handleUpdateDayTitle(e.target.value)}
              placeholder="Tema ou foco do dia (ex: Centro Histórico e Museus)"
              className="text-lg sm:text-xl font-bold text-neutral-900 w-full bg-transparent border-b border-transparent hover:border-neutral-300 focus:border-neutral-900 focus:outline-none py-0.5 transition-colors"
            />
          </div>

          <button
            onClick={() => {
              setEditingActivity(null);
              setActForm({
                time: '10:00',
                title: '',
                category: 'attraction',
                location: '',
                cost: '0',
                isPaid: false,
                notes: ''
              });
              setIsAddingActivity(!isAddingActivity);
            }}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shrink-0 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Atividade</span>
          </button>
        </div>

        {/* Day tips / practical notes */}
        <div className="pt-2 border-t border-neutral-100 flex items-start gap-2">
          <span className="text-xs text-neutral-500 shrink-0 font-medium">Dica do dia:</span>
          <input
            type="text"
            value={currentDay.notes || ''}
            onChange={(e) => handleUpdateDayNotes(e.target.value)}
            placeholder="Ex: Levar calçado confortável, comprar ingressos pela manhã, levar garrafinha d'água..."
            className="text-xs text-neutral-600 w-full bg-transparent border-b border-transparent hover:border-neutral-200 focus:border-neutral-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Add / Edit Activity Inline Form */}
      {isAddingActivity && (
        <form
          onSubmit={handleSaveActivity}
          className="bg-neutral-50 rounded-xl p-5 border border-neutral-300 space-y-4 animate-fade-in shadow-xs"
        >
          <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
            <h4 className="text-sm font-bold text-neutral-900">
              {editingActivity ? 'Editar Atividade' : 'Nova Atividade no Roteiro'}
            </h4>
            <button
              type="button"
              onClick={() => {
                setIsAddingActivity(false);
                setEditingActivity(null);
              }}
              className="text-xs text-neutral-500 hover:text-neutral-700"
            >
              Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="space-y-1">
              <label className="font-medium text-neutral-700">Horário</label>
              <input
                type="time"
                value={actForm.time}
                onChange={(e) => setActForm({ ...actForm, time: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-medium text-neutral-700">O que fazer? (Título da Atração)</label>
              <input
                type="text"
                required
                placeholder="Ex: Visita ao Museu do Amanhã"
                value={actForm.title}
                onChange={(e) => setActForm({ ...actForm, title: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-neutral-700">Categoria</label>
              <select
                value={actForm.category}
                onChange={(e) => setActForm({ ...actForm, category: e.target.value as ActivityCategory })}
                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
              >
                <option value="attraction">Ponto Turístico</option>
                <option value="food">Gastronomia / Restaurante</option>
                <option value="hotel">Hospedagem / Check-in</option>
                <option value="transport">Transporte / Deslocamento</option>
                <option value="leisure">Lazer / Praia / Parque</option>
                <option value="shopping">Compras / Feiras</option>
                <option value="cultural">Cultura & Museu</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-medium text-neutral-700">Local ou Endereço</label>
              <input
                type="text"
                placeholder="Ex: Praça Mauá, 1 - Centro"
                value={actForm.location}
                onChange={(e) => setActForm({ ...actForm, location: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-neutral-700">Custo Estimado (R$)</label>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="0.00"
                value={actForm.cost}
                onChange={(e) => setActForm({ ...actForm, cost: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            <div className="sm:col-span-3 space-y-1">
              <label className="font-medium text-neutral-700">Notas ou Dicas Práticas</label>
              <input
                type="text"
                placeholder="Ex: Comprar ingresso online com 2 dias de antecedência para evitar fila..."
                value={actForm.notes}
                onChange={(e) => setActForm({ ...actForm, notes: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
              <input
                type="checkbox"
                checked={actForm.isPaid}
                onChange={(e) => setActForm({ ...actForm, isPaid: e.target.checked })}
                className="rounded text-neutral-900 focus:ring-neutral-900"
              />
              <span>Este valor já foi pago antecipadamente</span>
            </label>

            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-xs"
            >
              {editingActivity ? 'Salvar Alterações' : 'Adicionar ao Roteiro'}
            </button>
          </div>
        </form>
      )}

      {/* Activities Timeline List */}
      <div className="space-y-3">
        {currentDay.activities.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-neutral-200">
            <div className="w-12 h-12 bg-neutral-100 text-neutral-400 rounded-full flex items-center justify-center mx-auto mb-3">
              <Sun className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-neutral-800">Nenhuma atividade neste dia ainda</h4>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              Comece adicionando passeios, paradas para almoço ou pontos turísticos que deseja visitar.
            </p>
            <button
              onClick={() => setIsAddingActivity(true)}
              className="mt-4 px-4 py-2 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
            >
              + Adicionar Primeira Atividade
            </button>
          </div>
        ) : (
          currentDay.activities.map((activity, idx) => {
            const catMeta = getCategoryMeta(activity.category);
            const Icon = catMeta.icon;

            return (
              <div
                key={activity.id}
                className={`group bg-white rounded-xl p-4 border transition-all ${
                  activity.completed
                    ? 'border-neutral-200 bg-neutral-50/70 opacity-75'
                    : 'border-neutral-200/90 hover:border-neutral-300 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left: Completed checkbox & Time & Content */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    {/* Status Checkbox */}
                    <button
                      type="button"
                      onClick={() => handleToggleComplete(activity.id)}
                      title={activity.completed ? 'Marcar como não feito' : 'Marcar como concluído'}
                      className={`mt-1 w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                        activity.completed
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-neutral-300 hover:border-neutral-400 bg-white'
                      }`}
                    >
                      {activity.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    {/* Time pill */}
                    <div className="shrink-0 mt-0.5">
                      <span className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded">
                        <Clock className="w-3 h-3 text-neutral-500" />
                        {activity.time}
                      </span>
                    </div>

                    {/* Main description */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4
                          className={`text-sm font-semibold text-neutral-900 ${
                            activity.completed ? 'line-through text-neutral-500' : ''
                          }`}
                        >
                          {activity.title}
                        </h4>

                        {/* Quiet category metadata */}
                        <span className={`text-[11px] font-medium px-2 py-0.2 rounded border ${catMeta.color} inline-flex items-center gap-1`}>
                          <Icon className="w-3 h-3" />
                          {catMeta.label}
                        </span>
                      </div>

                      {/* Location and Notes */}
                      <div className="mt-1 space-y-0.5 text-xs text-neutral-500">
                        {activity.location && (
                          <div className="flex items-center gap-1 text-neutral-600">
                            <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                            <span className="truncate">{activity.location}</span>
                          </div>
                        )}
                        {activity.notes && (
                          <p className="text-neutral-500 italic text-[11px]">
                            {activity.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Cost & Actions */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-xs font-semibold text-neutral-900 font-mono tabular-nums block">
                        {activity.cost > 0
                          ? `R$ ${activity.cost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                          : 'Grátis'}
                      </span>
                      {activity.cost > 0 && (
                        <span
                          className={`text-[10px] font-medium ${
                            activity.isPaid ? 'text-emerald-600' : 'text-amber-700'
                          }`}
                        >
                          {activity.isPaid ? 'Pago' : 'A pagar'}
                        </span>
                      )}
                    </div>

                    {/* Actions dropdown/buttons */}
                    <div className="flex items-center gap-1">
                      <div className="flex flex-col">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveActivity(idx, 'up')}
                          className="p-0.5 text-neutral-400 hover:text-neutral-700 disabled:opacity-20"
                          title="Mover para cima"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === currentDay.activities.length - 1}
                          onClick={() => handleMoveActivity(idx, 'down')}
                          className="p-0.5 text-neutral-400 hover:text-neutral-700 disabled:opacity-20"
                          title="Mover para baixo"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleStartEdit(activity)}
                        className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-md hover:bg-neutral-100 transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteActivity(activity.id)}
                        className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Free Plan Upgrade Banner if on day 3 */}
      {!isPro && trip.days.length >= 3 && (
        <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-amber-950">Precisa planejar viagens com mais de 3 dias?</h5>
              <p className="text-[11px] text-amber-800 mt-0.5">
                Com o upgrade de apenas R$ 19,90 você desbloqueia dias ilimitados e exportação em PDF.
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenUpgrade('Dias Ilimitados no Roteiro')}
            className="px-4 py-2 text-xs font-bold text-neutral-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shrink-0 shadow-xs"
          >
            Fazer Upgrade (R$ 19,90)
          </button>
        </div>
      )}
    </div>
  );
};
