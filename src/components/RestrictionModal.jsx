import { useState, useMemo } from "react";
import { X, AlertTriangle, CheckCircle2, ChevronRight } from "lucide-react";
import { calcPlanCalories } from "@/utils/mealPlanUtils";

const RESTRICTIONS = [
  { value: "sem_lactose",    label: "Sem Lactose",      color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  { value: "sem_gluten",     label: "Sem Glúten",       color: "bg-orange-100 text-orange-700 border-orange-200" },
  { value: "vegano",         label: "Vegano",           color: "bg-green-100 text-green-700 border-green-200" },
  { value: "baixo_sodio",    label: "Baixo Sódio",      color: "bg-blue-100 text-blue-700 border-blue-200" },
  { value: "baixo_potassio", label: "Baixo Potássio",   color: "bg-purple-100 text-purple-700 border-purple-200" },
  { value: "baixo_fodmap",   label: "Baixo FODMAP",     color: "bg-teal-100 text-teal-700 border-teal-200" },
];

function applyRestrictionPreview(planData, restriction) {
  let substituted = 0;
  const noSubstitute = [];
  const originalCals = calcPlanCalories(
    (planData.meals || []).map((m) => ({ ...m, foods: m.foods.filter((f) => !f.removed) }))
  );

  const updatedMeals = (planData.meals || []).map((meal) => ({
    ...meal,
    foods: meal.foods.map((food) => {
      if (food.removed) return food;
      const matchSub = (food.substitutions || []).find(
        (s) => s.restriction === restriction
      );
      if (matchSub) {
        substituted++;
        return {
          ...food,
          name: matchSub.name,
          quantity: matchSub.quantity,
          unit: matchSub.unit,
          grams: matchSub.grams,
          calories: matchSub.calories,
          macros: matchSub.macros,
          _substitutedFrom: food.name,
          _originalCalories: food.calories,
          _originalMacros: food.macros,
          _restrictionApplied: restriction,
          _appliedSubstitutionId: matchSub.id,
        };
      }
      noSubstitute.push({ mealName: meal.name, foodName: food.name });
      return food;
    }),
  }));

  const newCals = calcPlanCalories(
    updatedMeals.map((m) => ({ ...m, foods: m.foods.filter((f) => !f.removed) }))
  );

  return {
    updatedPlan: {
      ...planData,
      meals: updatedMeals,
      restrictions: [...new Set([...(planData.restrictions || []), restriction])],
    },
    substituted,
    noSubstitute,
    calDiff: newCals - originalCals,
  };
}

export default function RestrictionModal({ plan, onConfirm, onClose }) {
  const [selected, setSelected] = useState(null);

  const preview = useMemo(() => {
    if (!selected) return null;
    return applyRestrictionPreview(plan, selected);
  }, [plan, selected]);

  const handleConfirm = () => {
    if (!selected || !preview) return;
    onConfirm(selected, preview);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900 text-base">Aplicar restrição ao plano</h2>
            <p className="text-sm text-gray-500 mt-0.5">Os alimentos serão substituídos automaticamente</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Seletor de restrição */}
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Selecionar restrição</p>
            <div className="flex flex-wrap gap-2">
              {RESTRICTIONS.map((r) => (
                <button
                  key={r.value}
                  onClick={() => setSelected(r.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    selected === r.value
                      ? r.color + " ring-2 ring-offset-1 ring-current"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          {preview && (
            <div className="space-y-3">
              {/* Resumo */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-green-700">{preview.substituted}</p>
                  <p className="text-xs text-green-600">alimento{preview.substituted !== 1 ? "s" : ""} substituído{preview.substituted !== 1 ? "s" : ""}</p>
                </div>
                <div className={`rounded-xl p-3 text-center ${preview.calDiff === 0 ? "bg-gray-50" : preview.calDiff > 0 ? "bg-red-50" : "bg-green-50"}`}>
                  <p className={`text-2xl font-bold ${preview.calDiff === 0 ? "text-gray-600" : preview.calDiff > 0 ? "text-red-600" : "text-green-700"}`}>
                    {preview.calDiff > 0 ? "+" : ""}{preview.calDiff}
                  </p>
                  <p className={`text-xs ${preview.calDiff === 0 ? "text-gray-500" : preview.calDiff > 0 ? "text-red-500" : "text-green-600"}`}>
                    kcal de diferença
                  </p>
                </div>
              </div>

              {/* Sem substituto */}
              {preview.noSubstitute.length > 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                    <span className="text-xs font-semibold text-amber-700">
                      {preview.noSubstitute.length} alimento{preview.noSubstitute.length !== 1 ? "s" : ""} sem substituto — revisar
                    </span>
                  </div>
                  <div className="space-y-1">
                    {preview.noSubstitute.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-200 text-amber-800 font-medium">
                          {item.mealName}
                        </span>
                        <span className="text-xs text-amber-700">{item.foodName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {preview.substituted === 0 && (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-center">
                  <p className="text-sm text-gray-500">Nenhum alimento neste plano possui substituto pré-cadastrado para esta restrição.</p>
                </div>
              )}

              {preview.substituted > 0 && preview.noSubstitute.length === 0 && (
                <div className="rounded-xl border border-green-200 bg-green-50 p-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <p className="text-xs text-green-700">Todos os alimentos possuem substituto. O plano ficará 100% compatível.</p>
                </div>
              )}
            </div>
          )}

          {!selected && (
            <p className="text-sm text-gray-400 text-center py-4">
              Selecione uma restrição para visualizar as substituições
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selected || !preview || preview.substituted === 0}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "#2D4F4F" }}
          >
            Confirmar
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
