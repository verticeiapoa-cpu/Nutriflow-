import { useState } from "react";
import { X, ShieldCheck, Plus, Check, ChevronDown } from "lucide-react";

const CATEGORIA_LABEL = {
  fruta: "Fruta", vegetal: "Vegetal/Legume", proteina: "Proteína/Carne",
  grao: "Grão/Pão", laticinios: "Laticínio", ultraprocessado: "Ultraprocessado", outro: "Outro"
};

function NutrientRow({ label, value, unit, highlight }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className={`flex items-center justify-between py-2 border-b border-gray-50 last:border-0 ${highlight ? "bg-green-50 rounded-lg px-2 -mx-2" : ""}`}>
      <span className="text-sm text-gray-600">{label}</span>
      <span className={`text-sm font-semibold ${highlight ? "text-green-700" : "text-gray-800"}`}>
        {typeof value === "number" ? value.toFixed(1) : value} {unit}
      </span>
    </div>
  );
}

export default function AlimentoModal({ alimento, onClose }) {
  const [addMode, setAddMode] = useState(false);
  const [quantidade, setQuantidade] = useState(100);
  const [added, setAdded] = useState(false);

  const factor = quantidade / (alimento.porcao_gramas || 100);
  const calc = (val) => val ? (val * factor).toFixed(1) : "—";

  const handleAdd = () => {
    // Aqui seria integrado com o diário alimentar futuramente
    setAdded(true);
    setTimeout(() => { setAdded(false); setAddMode(false); setQuantidade(100); }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-5 pt-5 pb-3 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-3">
              <h2 className="font-bold text-gray-900 text-lg leading-tight">{alimento.nome}</h2>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                {alimento.marca && <span className="text-xs text-gray-400">{alimento.marca}</span>}
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {CATEGORIA_LABEL[alimento.categoria] || alimento.categoria}
                </span>
                {alimento.fonte === "verificado" && (
                  <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Verificado
                  </span>
                )}
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl flex-shrink-0">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Calorie highlight */}
          <div className="flex gap-3 mt-3">
            {[
              { label: "Calorias", val: calc(alimento.calorias), unit: "kcal", color: "text-orange-600" },
              { label: "Proteínas", val: calc(alimento.proteinas_g), unit: "g", color: "text-green-600" },
              { label: "Carboidratos", val: calc(alimento.carboidratos_g), unit: "g", color: "text-yellow-600" },
              { label: "Gorduras", val: calc(alimento.gorduras_g), unit: "g", color: "text-red-500" },
            ].map((m, i) => (
              <div key={i} className="flex-1 text-center bg-gray-50 rounded-xl py-2">
                <p className={`text-base font-bold ${m.color}`}>{m.val}</p>
                <p className="text-xs text-gray-400">{m.unit}</p>
                <p className="text-xs text-gray-400 leading-tight">{m.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-5">
          {/* Porção referência */}
          <p className="text-xs text-gray-400 text-center">Valores por {alimento.porcao_gramas || 100}g (porção padrão)</p>

          {/* Macros */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Macronutrientes</p>
            <div className="space-y-0.5">
              <NutrientRow label="Proteínas" value={alimento.proteinas_g} unit="g" highlight />
              <NutrientRow label="Carboidratos" value={alimento.carboidratos_g} unit="g" highlight />
              <NutrientRow label="Gorduras totais" value={alimento.gorduras_g} unit="g" highlight />
              <NutrientRow label="Fibras alimentares" value={alimento.fibras_g} unit="g" />
            </div>
          </div>

          {/* Micronutrients */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Micronutrientes</p>
            <div className="space-y-0.5">
              <NutrientRow label="Sódio" value={alimento.sodio_mg} unit="mg" />
              <NutrientRow label="Cálcio" value={alimento.calcio_mg} unit="mg" />
              <NutrientRow label="Ferro" value={alimento.ferro_mg} unit="mg" />
              <NutrientRow label="Vitamina C" value={alimento.vitamina_c_mg} unit="mg" />
              <NutrientRow label="Vitamina D" value={alimento.vitamina_d_mcg} unit="mcg" />
            </div>
          </div>

          {/* Add to diary */}
          <div className="border-t border-gray-100 pt-4">
            {!addMode ? (
              <button
                onClick={() => setAddMode(true)}
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" /> Adicionar ao diário
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">Quantidade consumida</p>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={quantidade}
                    onChange={e => setQuantidade(Number(e.target.value))}
                    min={1}
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-center font-bold text-lg"
                  />
                  <span className="text-gray-500 font-medium">gramas</span>
                </div>
                {/* Adjusted macros preview */}
                <div className="bg-gray-50 rounded-xl p-3 grid grid-cols-4 gap-2 text-center text-xs">
                  <div><p className="font-bold text-orange-600">{calc(alimento.calorias)}</p><p className="text-gray-400">kcal</p></div>
                  <div><p className="font-bold text-green-600">{calc(alimento.proteinas_g)}g</p><p className="text-gray-400">prot</p></div>
                  <div><p className="font-bold text-yellow-600">{calc(alimento.carboidratos_g)}g</p><p className="text-gray-400">carb</p></div>
                  <div><p className="font-bold text-red-500">{calc(alimento.gorduras_g)}g</p><p className="text-gray-400">gord</p></div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setAddMode(false)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-50">
                    Cancelar
                  </button>
                  <button
                    onClick={handleAdd}
                    disabled={added}
                    className="flex-1 bg-green-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 disabled:bg-green-400 flex items-center justify-center gap-2 transition-colors"
                  >
                    {added ? <><Check className="w-4 h-4" /> Adicionado!</> : "Confirmar"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}