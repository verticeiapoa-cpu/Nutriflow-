import { useState, useEffect } from "react";
import { db as base44 } from "@/api/localDB";
import { Camera, Plus, Calendar, Flame, ChevronDown, ChevronUp, Trash2, Loader2 } from "lucide-react";
import AnaliseFotoModal from "../components/diario/AnaliseFotoModal";

const REFEICAO_LABEL = {
  cafe_manha: "☕ Café da manhã",
  lanche_manha: "🍎 Lanche manhã",
  almoco: "🍽️ Almoço",
  lanche_tarde: "🥪 Lanche tarde",
  jantar: "🌙 Jantar",
  ceia: "🌛 Ceia"
};

export default function DiarioAlimentar() {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFotoModal, setShowFotoModal] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.DiarioAlimentar.filter({ data: selectedDate }, "-hora", 50);
    setRegistros(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [selectedDate]);

  const handleDelete = async (id) => {
    await base44.entities.DiarioAlimentar.delete(id);
    load();
  };

  const totaisDia = registros.reduce((acc, r) => ({
    calorias: acc.calorias + (r.total_calorias || 0),
    proteinas: acc.proteinas + (r.total_proteinas_g || 0),
    carboidratos: acc.carboidratos + (r.total_carboidratos_g || 0),
    gorduras: acc.gorduras + (r.total_gorduras_g || 0),
  }), { calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0 });

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Diário Alimentar</h1>
          <p className="text-sm text-gray-500">{registros.length} registros hoje</p>
        </div>
        <div className="flex gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={() => setShowFotoModal(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
          >
            <Camera className="w-4 h-4" /> Analisar Foto
          </button>
        </div>
      </div>

      {/* Resumo do dia */}
      {registros.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Resumo do dia</p>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Calorias", val: totaisDia.calorias.toFixed(0), unit: "kcal", color: "text-orange-600" },
              { label: "Proteínas", val: totaisDia.proteinas.toFixed(1), unit: "g", color: "text-green-600" },
              { label: "Carboidratos", val: totaisDia.carboidratos.toFixed(1), unit: "g", color: "text-yellow-600" },
              { label: "Gorduras", val: totaisDia.gorduras.toFixed(1), unit: "g", color: "text-red-500" },
            ].map((m, i) => (
              <div key={i} className="text-center bg-gray-50 rounded-xl py-3">
                <p className={`text-xl font-bold ${m.color}`}>{m.val}</p>
                <p className="text-xs text-gray-400">{m.unit}</p>
                <p className="text-xs text-gray-400">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lista de registros */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-20 bg-white rounded-2xl animate-pulse border border-gray-100" />)}
        </div>
      ) : registros.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Camera className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">Nenhum registro neste dia</p>
          <p className="text-sm mt-1">Tire uma foto da sua refeição para analisar</p>
        </div>
      ) : (
        <div className="space-y-3">
          {registros.map(r => (
            <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
              >
                <div className="flex items-center gap-3">
                  {r.tipo_registro === "foto" && r.foto_url && (
                    <img src={r.foto_url} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900 text-sm">
                        {r.refeicao ? REFEICAO_LABEL[r.refeicao] : `Registro ${r.hora || ""}`}
                      </p>
                      {r.tipo_registro === "foto" && (
                        <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Camera className="w-2.5 h-2.5" /> foto
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {r.itens?.length || 0} itens · {r.hora}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-bold text-orange-600">{r.total_calorias?.toFixed(0)} <span className="text-xs font-normal text-gray-400">kcal</span></p>
                    <p className="text-xs text-gray-400">P:{r.total_proteinas_g?.toFixed(1)}g C:{r.total_carboidratos_g?.toFixed(1)}g G:{r.total_gorduras_g?.toFixed(1)}g</p>
                  </div>
                  {expandedId === r.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
              </div>

              {expandedId === r.id && r.itens?.length > 0 && (
                <div className="border-t border-gray-100 px-4 pb-4">
                  <div className="mt-3 space-y-2">
                    {r.itens.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm py-1.5 border-b border-gray-50 last:border-0">
                        <div>
                          <span className="font-medium text-gray-800">{item.nome}</span>
                          <span className="text-gray-400 ml-2 text-xs">{item.quantidade_g}g</span>
                        </div>
                        <div className="text-right text-xs text-gray-500">
                          <span className="text-orange-600 font-semibold">{item.calorias} kcal</span>
                          <span className="ml-2">P:{item.proteinas_g}g C:{item.carboidratos_g}g G:{item.gorduras_g}g</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="mt-3 flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remover registro
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showFotoModal && (
        <AnaliseFotoModal
          onClose={() => setShowFotoModal(false)}
          onSave={() => { load(); setShowFotoModal(false); }}
        />
      )}
    </div>
  );
}