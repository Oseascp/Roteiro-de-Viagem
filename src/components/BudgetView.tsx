import React, { useState } from 'react';
import { Trip, ActivityCategory } from '../types/travel';
import { 
  PieChart, 
  Wallet, 
  ArrowUpRight, 
  Users, 
  Lock, 
  Sparkles, 
  CheckCircle, 
  Clock,
  Plus
} from 'lucide-react';

interface BudgetViewProps {
  trip: Trip;
  onUpdateTrip: (updated: Trip) => void;
  isPro: boolean;
  onOpenUpgrade: (reason: string) => void;
}

export const BudgetView: React.FC<BudgetViewProps> = ({
  trip,
  onUpdateTrip,
  isPro,
  onOpenUpgrade
}) => {
  const [filterPaid, setFilterPaid] = useState<'all' | 'paid' | 'pending'>('all');
  const [splitPeopleCount, setSplitPeopleCount] = useState<number>(2);

  // Collect all expenses from all days' activities
  const allActivities = trip.days.flatMap((day) => 
    day.activities.map(act => ({ ...act, dayNumber: day.dayNumber }))
  );

  const totalPlannedCost = allActivities.reduce((sum, a) => sum + (a.cost || 0), 0);
  const totalPaid = allActivities.filter(a => a.isPaid).reduce((sum, a) => sum + (a.cost || 0), 0);
  const totalPending = totalPlannedCost - totalPaid;
  const remainingBudget = trip.totalBudget - totalPlannedCost;
  const budgetUsagePercent = trip.totalBudget > 0 
    ? Math.min(Math.round((totalPlannedCost / trip.totalBudget) * 100), 100)
    : 0;

  // Group by category
  const categories: { cat: ActivityCategory; label: string; color: string; bg: string }[] = [
    { cat: 'attraction', label: 'Pontos Turísticos', color: 'bg-indigo-500', bg: 'text-indigo-700' },
    { cat: 'food', label: 'Gastronomia & Bebidas', color: 'bg-amber-500', bg: 'text-amber-700' },
    { cat: 'hotel', label: 'Hospedagem', color: 'bg-blue-500', bg: 'text-blue-700' },
    { cat: 'transport', label: 'Transporte', color: 'bg-purple-500', bg: 'text-purple-700' },
    { cat: 'leisure', label: 'Lazer & Praias', color: 'bg-emerald-500', bg: 'text-emerald-700' },
    { cat: 'shopping', label: 'Compras & Feirinhas', color: 'bg-rose-500', bg: 'text-rose-700' },
    { cat: 'cultural', label: 'Cultura & Museus', color: 'bg-teal-500', bg: 'text-teal-700' },
  ];

  const categoryTotals = categories.map(c => {
    const total = allActivities
      .filter(a => a.category === c.cat)
      .reduce((sum, a) => sum + (a.cost || 0), 0);
    const percentage = totalPlannedCost > 0 ? (total / totalPlannedCost) * 100 : 0;
    return { ...c, total, percentage };
  });

  const filteredActivities = allActivities.filter(a => {
    if (filterPaid === 'paid') return a.isPaid;
    if (filterPaid === 'pending') return !a.isPaid;
    return true;
  });

  const handleUpdateBudget = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 0;
    onUpdateTrip({ ...trip, totalBudget: val });
  };

  const handleToggleActivityPaid = (actId: string) => {
    const updatedDays = trip.days.map(d => ({
      ...d,
      activities: d.activities.map(a => a.id === actId ? { ...a, isPaid: !a.isPaid } : a)
    }));
    onUpdateTrip({ ...trip, days: updatedDays });
  };

  return (
    <div className="space-y-8">
      {/* Top Cards: Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Total Budget */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span>Orçamento Estipulado</span>
            <Wallet className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-semibold text-neutral-400">R$</span>
            <input
              type="number"
              value={trip.totalBudget}
              onChange={handleUpdateBudget}
              className="text-2xl font-bold font-mono tabular-nums text-neutral-900 bg-transparent w-full focus:outline-none focus:ring-1 focus:ring-neutral-400 rounded px-1"
            />
          </div>
          <p className="text-[11px] text-neutral-500">
            Clique no valor para reajustar seu teto de gastos.
          </p>
        </div>

        {/* Card 2: Total Spent / Planned */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span>Total Comprometido</span>
            <span className="text-[11px] font-mono text-neutral-600">{budgetUsagePercent}% do teto</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-semibold text-neutral-400">R$</span>
            <span className="text-2xl font-bold font-mono tabular-nums text-neutral-900">
              {totalPlannedCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                budgetUsagePercent > 90 ? 'bg-rose-500' : 'bg-neutral-900'
              }`}
              style={{ width: `${budgetUsagePercent}%` }}
            />
          </div>
        </div>

        {/* Card 3: Remaining Balance */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span>Saldo Disponível</span>
            <ArrowUpRight className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-semibold text-neutral-400">R$</span>
            <span
              className={`text-2xl font-bold font-mono tabular-nums ${
                remainingBudget >= 0 ? 'text-emerald-700' : 'text-rose-600'
              }`}
            >
              {remainingBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-neutral-500">
            <span>Já pago: R$ {totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</span>
            <span>A pagar: R$ {totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</span>
          </div>
        </div>
      </div>

      {/* Category Breakdown & Splitter in 2-Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Category breakdown */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-neutral-200/90 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900">Gastos por Categoria</h3>
            <span className="text-xs text-neutral-500">{allActivities.length} itens orçados</span>
          </div>

          <div className="space-y-3.5">
            {categoryTotals.map(item => (
              <div key={item.cat} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-neutral-800">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-500 font-mono text-[11px]">
                      {item.percentage.toFixed(0)}%
                    </span>
                    <span className="font-bold text-neutral-900 font-mono tabular-nums">
                      R$ {item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: VIP Expense Splitter Feature */}
        <div className="bg-white rounded-xl p-6 border border-neutral-200/90 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-neutral-900">Divisão de Gastos</h3>
              </div>
              {!isPro && (
                <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  VIP PRO
                </span>
              )}
            </div>

            <p className="text-xs text-neutral-600">
              Rache o custo total da viagem igualmente entre o casal, família ou amigos.
            </p>

            {isPro ? (
              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-700">Quantidade de viajantes:</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={splitPeopleCount}
                      onChange={(e) => setSplitPeopleCount(parseInt(e.target.value) || 2)}
                      className="flex-1 accent-amber-500"
                    />
                    <span className="font-mono font-bold text-sm text-neutral-900 w-8 text-center bg-neutral-100 py-1 rounded">
                      {splitPeopleCount}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 text-center space-y-1">
                  <span className="text-xs text-amber-900">Valor individual por pessoa:</span>
                  <div className="text-2xl font-bold font-mono tabular-nums text-amber-950">
                    R$ {(totalPlannedCost / splitPeopleCount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <span className="text-[11px] text-amber-800">
                    Baseado no custo total de R$ {totalPlannedCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-5 bg-neutral-50 rounded-xl border border-neutral-200 text-center space-y-3 mt-4">
                <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
                  <Lock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">Calculadora VIP Bloqueada</h4>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Divida custos por pessoa e rache contas facilmente no plano PRO de R$ 19,90.
                  </p>
                </div>
                <button
                  onClick={() => onOpenUpgrade('Divisão de Gastos entre Viajantes')}
                  className="w-full py-2 px-3 text-xs font-semibold text-neutral-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-xs"
                >
                  Desbloquear por R$ 19,90
                </button>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-neutral-100 text-[11px] text-neutral-500">
            Dica: Altere os status de "Pago" na tabela abaixo para acompanhar o fluxo de caixa.
          </div>
        </div>
      </div>

      {/* Expenses Table with Filters */}
      <div className="bg-white rounded-xl border border-neutral-200/90 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-neutral-900">Lista Completa de Gastos</h3>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg self-start sm:self-auto">
            <button
              onClick={() => setFilterPaid('all')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                filterPaid === 'all'
                  ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Todos ({allActivities.length})
            </button>
            <button
              onClick={() => setFilterPaid('paid')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                filterPaid === 'paid'
                  ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Pagos
            </button>
            <button
              onClick={() => setFilterPaid('pending')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                filterPaid === 'pending'
                  ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              A Pagar
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider font-semibold border-b border-neutral-200">
              <tr>
                <th className="px-5 py-3">Dia</th>
                <th className="px-5 py-3">Atividade / Item</th>
                <th className="px-5 py-3">Categoria</th>
                <th className="px-5 py-3 text-right">Valor Estimado</th>
                <th className="px-5 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-neutral-500">
                    Nenhum gasto encontrado para o filtro selecionado.
                  </td>
                </tr>
              ) : (
                filteredActivities.map((act) => (
                  <tr key={act.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="px-5 py-3 font-medium text-neutral-600">Dia {act.dayNumber}</td>
                    <td className="px-5 py-3 font-semibold text-neutral-900">{act.title}</td>
                    <td className="px-5 py-3 text-neutral-600 capitalize">{act.category}</td>
                    <td className="px-5 py-3 text-right font-mono font-semibold tabular-nums text-neutral-900">
                      R$ {act.cost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button
                        onClick={() => handleToggleActivityPaid(act.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                          act.isPaid
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                        }`}
                      >
                        {act.isPaid ? (
                          <>
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            <span>Pago</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Pendente</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
