import { ShieldCheck } from "lucide-react";

const CATEGORIA_EMOJI = {
  fruta: "🍍", vegetal: "🥦", proteina: "🥩", grao: "🫘",
  laticinios: "🧀", ultraprocessado: "🍟", outro: "🥡"
};

function MacroBar({ label, value, total, color }) {
  const pct = total > 0 ? Math.min((value / total) * 100, 100) : 0;
  return (
    <div className="space-y-0.5">
      <div className="flex justify-between text-xs text-gray-500">
        <span>{label}</span>
        <span className="font-medium text-gray-700">{value?.toFixed(1) ?? "—"}g</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-1.5">
        <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function AlimentoCard({ alimento, onClick }) {
  const totalMacros = (alimento.proteinas_g || 0) + (alimento.carboidratos_g || 0) + (alimento.gorduras_g || 0);

  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-left hover:shadow-md hover:border-green-200 transition-all group w-full"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{CATEGORIA_EMOJI[alimento.categoria] || "🍽️"}</span>
          <div>
            <p className="font-semibold text-gray-900 text-sm leading-tight group-hover:text-green-700 transition-colors line-clamp-1">
              {alimento.nome}
            </p>
            {alimento.marca && <p className="text-xs text-gray-400">{alimento.marca}</p>}
          </div>
        </div>
        {alimento.fonte === "verificado" && (
          <ShieldCheck className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" title="Verificado" />
        )}
      </div>

      <div className="flex items-center gap-1.5 mb-3">
        <span className="text-2xl font-bold text-gray-900">{alimento.calorias ?? "—"}</span>
        <div>
          <p className="text-xs text-gray-400 leading-tight">kcal</p>
          <p className="text-xs text-gray-400 leading-tight">por {alimento.porcao_gramas || 100}g</p>
        </div>
      </div>

      <div className="space-y-1.5">
        <MacroBar label="Proteína" value={alimento.proteinas_g} total={totalMacros} color="bg-green-500" />
        <MacroBar label="Carboidrato" value={alimento.carboidratos_g} total={totalMacros} color="bg-yellow-400" />
        <MacroBar label="Gordura" value={alimento.gorduras_g} total={totalMacros} color="bg-red-400" />
      </div>
    </button>
  );
}