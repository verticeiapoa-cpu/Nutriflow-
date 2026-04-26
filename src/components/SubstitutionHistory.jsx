import { useState, useCallback } from "react";
import { Clock, ArrowRight, RotateCcw, History } from "lucide-react";
import { useMealPlans } from "@/hooks/useMealPlans";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

function makeHistoryStore() {
  const K = "nf_substitution_history";
  const getAll = () => { try { return JSON.parse(localStorage.getItem(K)) || []; } catch { return []; } };
  const saveAll = (arr) => { try { localStorage.setItem(K, JSON.stringify(arr)); } catch {} };
  return {
    filter: (fn) => getAll().filter(fn),
    update: (id, data) => {
      const arr = getAll();
      const idx = arr.findIndex((r) => r.id === id);
      if (idx === -1) return null;
      arr[idx] = { ...arr[idx], ...data };
      saveAll(arr);
      return arr[idx];
    },
  };
}

const historyStore = makeHistoryStore();

function formatDate(iso) {
  try {
    return format(parseISO(iso), "dd/MM · HH:mm", { locale: ptBR });
  } catch {
    return iso?.slice(0, 10) || "—";
  }
}

function CalDiff({ diff }) {
  if (!diff && diff !== 0) return null;
  const v = Math.round(diff);
  if (v === 0) return <span className="text-xs text-gray-400">sem alteração calórica</span>;
  return (
    <span className={`text-xs font-semibold ${v > 0 ? "text-red-600" : "text-green-700"}`}>
      {v > 0 ? "+" : ""}{v} kcal
    </span>
  );
}

export default function SubstitutionHistory({ planId, onUndo }) {
  const { getSubstitutionHistory } = useMealPlans(null);
  const [undoneIds, setUndoneIds] = useState([]);
  const [refresh, setRefresh] = useState(0);

  const entries = getSubstitutionHistory(planId)
    .slice()
    .sort((a, b) => (b.recordedAt > a.recordedAt ? 1 : -1));

  const handleUndo = useCallback(
    (entry) => {
      historyStore.update(entry.id, { undone: true });
      setUndoneIds((prev) => [...prev, entry.id]);
      setRefresh((r) => r + 1);
      if (onUndo) onUndo(entry);
    },
    [onUndo]
  );

  if (entries.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        <History className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p className="text-sm font-medium text-gray-500">Nenhuma alteração registrada</p>
        <p className="text-xs mt-1">As substituições de alimentos aparecerão aqui</p>
      </div>
    );
  }

  const visibleEntries = entries.filter((e) => !e.undone && !undoneIds.includes(e.id));
  const undoneEntries = entries.filter((e) => e.undone || undoneIds.includes(e.id));

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <History className="w-4 h-4 text-gray-400" />
        <h3 className="text-sm font-semibold text-gray-700">Histórico de alterações</h3>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{visibleEntries.length}</span>
      </div>

      {visibleEntries.length === 0 && (
        <p className="text-xs text-gray-400 text-center py-4">Todas as substituições foram desfeitas</p>
      )}

      <div className="space-y-2">
        {visibleEntries.map((entry, idx) => {
          const isLast = idx === 0;
          const calDiff = entry.calDiff;
          return (
            <div
              key={entry.id}
              className="flex items-start gap-3 bg-white border border-gray-100 rounded-xl p-3 hover:border-gray-200 transition-colors"
            >
              <div className="flex-shrink-0 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] text-gray-400">{formatDate(entry.recordedAt)}</span>
                  {entry.mealName && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-medium">
                      {entry.mealName}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  <span className="text-xs text-gray-600 font-medium truncate max-w-[120px]">
                    {entry.originalFoodName || entry.foodId}
                  </span>
                  <ArrowRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  <span className="text-xs text-[#2D4F4F] font-semibold truncate max-w-[120px]">
                    {entry.newFoodName || entry.substitutionId}
                  </span>
                  {calDiff !== undefined && <CalDiff diff={calDiff} />}
                </div>
                {entry.note && (
                  <p className="text-[10px] text-gray-400 mt-0.5">{entry.note}</p>
                )}
              </div>
              {isLast && (
                <button
                  onClick={() => handleUndo(entry)}
                  className="flex-shrink-0 flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 transition-colors py-1 px-2 rounded-lg hover:bg-red-50"
                  title="Desfazer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Desfazer
                </button>
              )}
            </div>
          );
        })}
      </div>

      {undoneEntries.length > 0 && (
        <div className="pt-2 border-t border-gray-100">
          <p className="text-[10px] text-gray-400 mb-2 uppercase tracking-wide">Desfeitas ({undoneEntries.length})</p>
          {undoneEntries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-start gap-3 bg-gray-50 border border-gray-100 rounded-xl p-3 opacity-50 mb-2"
            >
              <Clock className="w-3.5 h-3.5 text-gray-300 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] text-gray-400">{formatDate(entry.recordedAt)}</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-xs text-gray-400 line-through truncate max-w-[120px]">
                    {entry.originalFoodName || entry.foodId}
                  </span>
                  <ArrowRight className="w-3 h-3 text-gray-300 flex-shrink-0" />
                  <span className="text-xs text-gray-400 line-through truncate max-w-[120px]">
                    {entry.newFoodName || entry.substitutionId}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
