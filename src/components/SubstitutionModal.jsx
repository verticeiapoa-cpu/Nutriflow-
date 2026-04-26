import { useState } from "react";
import { X, Search, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

const RESTRICTION_LABELS = {
  sem_lactose: "Sem Lactose",
  sem_gluten: "Sem Glúten",
  vegano: "Vegano",
  baixo_sodio: "Baixo Sódio",
  baixo_potassio: "Baixo Potássio",
  baixo_fodmap: "FODMAP",
};

const RESTRICTION_COLORS = {
  sem_lactose: "bg-yellow-100 text-yellow-700",
  sem_gluten: "bg-orange-100 text-orange-700",
  vegano: "bg-green-100 text-green-700",
  baixo_sodio: "bg-blue-100 text-blue-700",
  baixo_potassio: "bg-purple-100 text-purple-700",
  baixo_fodmap: "bg-teal-100 text-teal-700",
};

function MacroBadge({ label, value, color }) {
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${color}`}>
      {label}: {value}g
    </span>
  );
}

function CalDiff({ current, next }) {
  const diff = next - current;
  if (diff === 0) return null;
  return (
    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${diff > 0 ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"}`}>
      {diff > 0 ? "+" : ""}{diff} kcal
    </span>
  );
}

const emptyCustom = { name: "", grams: "", calories: "", cho: "", ptn: "", lip: "" };

export default function SubstitutionModal({ food, mealId, planId, onApply, onClose }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [custom, setCustom] = useState(emptyCustom);
  const [tab, setTab] = useState("lista"); // "lista" | "personalizada"

  const filteredSubs = (food.substitutions || []).filter((s) => {
    if (!query.trim()) return true;
    return s.name.toLowerCase().includes(query.toLowerCase());
  });

  const handleApply = () => {
    if (!selected) return;
    onApply(mealId, food.id, selected);
    onClose();
  };

  const handleApplyCustom = () => {
    const name = custom.name.trim();
    if (!name) return;
    const sub = {
      id: "custom-" + Date.now(),
      name,
      quantity: parseFloat(custom.grams) || 0,
      unit: "g",
      grams: parseFloat(custom.grams) || 0,
      calories: parseFloat(custom.calories) || 0,
      macros: {
        cho: parseFloat(custom.cho) || 0,
        ptn: parseFloat(custom.ptn) || 0,
        lip: parseFloat(custom.lip) || 0,
      },
      note: "Personalizado",
      restriction: null,
      _custom: true,
    };
    onApply(mealId, food.id, sub);
    onClose();
  };

  const setC = (key, val) => setCustom((p) => ({ ...p, [key]: val }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900 text-base">Substituir Alimento</h2>
            <p className="text-sm text-gray-500 mt-0.5">Escolha um substituto para <strong>{food.name}</strong></p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alimento atual */}
        <div className="mx-5 mt-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">Alimento atual</p>
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-gray-800 flex-1">{food.name}</p>
            <span className="text-sm font-bold text-gray-700">{food.calories} kcal</span>
          </div>
          <div className="flex gap-1 mt-1.5 flex-wrap">
            <MacroBadge label="CHO" value={food.macros?.cho ?? 0} color="bg-amber-50 text-amber-700" />
            <MacroBadge label="PTN" value={food.macros?.ptn ?? 0} color="bg-blue-50 text-blue-700" />
            <MacroBadge label="LIP" value={food.macros?.lip ?? 0} color="bg-orange-50 text-orange-700" />
            <span className="text-[10px] text-gray-400 self-center">{food.quantity} {food.unit} · {food.grams}g</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-5 pt-4">
          {["lista", "personalizada"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-xl text-xs font-medium transition-colors ${
                tab === t ? "bg-[#2D4F4F] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t === "lista" ? `Substitutos pré-cadastrados (${food.substitutions?.length ?? 0})` : "Personalizado"}
            </button>
          ))}
        </div>

        {tab === "lista" ? (
          <>
            {/* Busca */}
            <div className="px-5 pt-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filtrar substitutos..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D4F4F]/30 bg-white"
                />
              </div>
            </div>

            {/* Lista */}
            <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2">
              {filteredSubs.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Nenhum substituto encontrado</p>
                </div>
              ) : (
                filteredSubs.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setSelected(sub)}
                    className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                      selected?.id === sub.id
                        ? "border-[#2D4F4F] bg-[#2D4F4F]/5"
                        : "border-gray-100 hover:border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="text-sm font-medium text-gray-800">{sub.name}</p>
                          {sub.restriction && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${RESTRICTION_COLORS[sub.restriction] || "bg-gray-100 text-gray-600"}`}>
                              {RESTRICTION_LABELS[sub.restriction] || sub.restriction}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {sub.quantity} {sub.unit} · {sub.grams}g
                        </p>
                        {sub.note && (
                          <p className="text-[11px] text-amber-600 mt-0.5 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 flex-shrink-0" />{sub.note}
                          </p>
                        )}
                        <div className="flex gap-1 mt-1.5 flex-wrap">
                          <MacroBadge label="CHO" value={sub.macros?.cho ?? 0} color="bg-amber-50 text-amber-700" />
                          <MacroBadge label="PTN" value={sub.macros?.ptn ?? 0} color="bg-blue-50 text-blue-700" />
                          <MacroBadge label="LIP" value={sub.macros?.lip ?? 0} color="bg-orange-50 text-orange-700" />
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className="text-sm font-bold text-gray-700">{sub.calories} kcal</span>
                        <CalDiff current={food.calories} next={sub.calories} />
                        {selected?.id === sub.id && <CheckCircle2 className="w-4 h-4 text-[#2D4F4F]" />}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={handleApply}
                disabled={!selected}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: "#2D4F4F" }}
              >
                <ArrowRight className="w-4 h-4" />
                Aplicar substituição
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Substituição personalizada */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Nome do alimento</label>
                <input
                  type="text"
                  placeholder="Ex: Leite de amêndoas"
                  value={custom.name}
                  onChange={(e) => setC("name", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D4F4F]/30"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Gramas</label>
                  <input type="number" min="0" placeholder="100" value={custom.grams} onChange={(e) => setC("grams", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D4F4F]/30" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Calorias (kcal)</label>
                  <input type="number" min="0" placeholder="0" value={custom.calories} onChange={(e) => setC("calories", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D4F4F]/30" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[["cho", "CHO (g)", "bg-amber-50"], ["ptn", "PTN (g)", "bg-blue-50"], ["lip", "LIP (g)", "bg-orange-50"]].map(([key, label]) => (
                  <div key={key}>
                    <label className="text-xs font-medium text-gray-600 block mb-1">{label}</label>
                    <input type="number" min="0" placeholder="0" value={custom[key]} onChange={(e) => setC(key, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D4F4F]/30" />
                  </div>
                ))}
              </div>
              {custom.calories && (
                <div className="p-3 bg-gray-50 rounded-xl">
                  <CalDiff current={food.calories} next={parseFloat(custom.calories) || 0} />
                  {!custom.calories && <span className="text-xs text-gray-400">Preencha as calorias para ver a diferença</span>}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100">
              <button
                onClick={handleApplyCustom}
                disabled={!custom.name.trim()}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: "#2D4F4F" }}
              >
                <ArrowRight className="w-4 h-4" />
                Aplicar personalizada
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
