import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { X, Zap, Loader2 } from "lucide-react";

export default function AIGeneratePlan({ patients, onClose, onSave }) {
  const [form, setForm] = useState({
    patient_id: "", weight: "", height: "", age: "", gender: "feminino",
    objective: "emagrecimento", activity_level: "moderado",
    restrictions: "", preferences: "", meals_count: "5"
  });
  const [loading, setLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handlePatientChange = (id) => {
    const p = patients.find(p => p.id === id);
    set("patient_id", id);
    set("patient_name", p?.full_name || "");
  };

  const handleGenerate = async () => {
    if (!form.patient_id) return alert("Selecione um paciente");
    setLoading(true);
    const patient = patients.find(p => p.id === form.patient_id);

    const prompt = `Você é um nutricionista especializado. Crie um plano alimentar completo e detalhado em português brasileiro para:

Paciente: ${patient?.full_name}
Objetivo: ${form.objective}
Peso: ${form.weight || "não informado"} kg
Altura: ${form.height || "não informado"} cm
Idade: ${form.age || "não informado"} anos
Sexo: ${form.gender}
Nível de atividade física: ${form.activity_level}
Restrições alimentares: ${form.restrictions || "nenhuma"}
Preferências: ${form.preferences || "nenhuma"}
Número de refeições: ${form.meals_count}

Retorne um plano alimentar com:
- título do plano
- objetivo calórico diário estimado
- distribuição de macros (proteína g, carboidratos g, gordura g)
- lista de refeições com horário sugerido e alimentos específicos com quantidade em gramas/unidades
- sugestão de suplementação se necessário
- observações importantes para o paciente`;

    const result = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: "object",
        properties: {
          title: { type: "string" },
          total_calories: { type: "number" },
          total_protein: { type: "number" },
          total_carbs: { type: "number" },
          total_fat: { type: "number" },
          meals: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                time: { type: "string" },
                foods: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      quantity: { type: "number" },
                      unit: { type: "string" },
                      calories: { type: "number" },
                      protein: { type: "number" },
                      carbs: { type: "number" },
                      fat: { type: "number" }
                    }
                  }
                }
              }
            }
          },
          supplements: { type: "string" },
          observations: { type: "string" }
        }
      }
    });

    setGeneratedPlan(result);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!generatedPlan) return;
    setLoading(true);
    const patient = patients.find(p => p.id === form.patient_id);
    await base44.entities.MealPlan.create({
      ...generatedPlan,
      patient_id: form.patient_id,
      patient_name: patient?.full_name,
      objective: form.objective,
      status: "ativo",
      start_date: new Date().toISOString().split("T")[0]
    });
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center">
              <Zap className="w-4 h-4 text-purple-600" />
            </div>
            <h2 className="font-bold text-gray-900">Gerar Plano com IA</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Paciente *</label>
              <select value={form.patient_id} onChange={e => handlePatientChange(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="">Selecionar paciente</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Objetivo</label>
              <select value={form.objective} onChange={e => set("objective", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="emagrecimento">Emagrecimento</option>
                <option value="hipertrofia">Hipertrofia</option>
                <option value="manutenção">Manutenção de peso</option>
                <option value="saúde">Saúde geral</option>
                <option value="diabético">Diabetes</option>
                <option value="vegetariano">Vegetariano/Vegano</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Sexo</label>
              <select value={form.gender} onChange={e => set("gender", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="feminino">Feminino</option>
                <option value="masculino">Masculino</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Peso (kg)</label>
              <input type="number" value={form.weight} onChange={e => set("weight", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Altura (cm)</label>
              <input type="number" value={form.height} onChange={e => set("height", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Idade</label>
              <input type="number" value={form.age} onChange={e => set("age", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Nível de atividade</label>
              <select value={form.activity_level} onChange={e => set("activity_level", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="sedentário">Sedentário</option>
                <option value="leve">Leve (1-2x/semana)</option>
                <option value="moderado">Moderado (3-4x/semana)</option>
                <option value="intenso">Intenso (5-6x/semana)</option>
                <option value="muito intenso">Muito intenso (diário)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Nº de refeições</label>
              <select value={form.meals_count} onChange={e => set("meals_count", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="3">3 refeições</option>
                <option value="4">4 refeições</option>
                <option value="5">5 refeições</option>
                <option value="6">6 refeições</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Restrições alimentares</label>
              <input value={form.restrictions} onChange={e => set("restrictions", e.target.value)} placeholder="Ex: intolerância à lactose, sem glúten..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Preferências alimentares</label>
              <input value={form.preferences} onChange={e => set("preferences", e.target.value)} placeholder="Ex: gosta de frango, não come peixe..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
          </div>

          {/* Generated Plan Preview */}
          {generatedPlan && (
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
              <h3 className="font-semibold text-purple-900 mb-2">✅ Plano gerado: {generatedPlan.title}</h3>
              <div className="grid grid-cols-4 gap-2 mb-3">
                <div className="text-center bg-white rounded-lg py-2">
                  <p className="text-xs text-gray-400">Kcal</p>
                  <p className="font-bold text-green-700">{generatedPlan.total_calories}</p>
                </div>
                <div className="text-center bg-white rounded-lg py-2">
                  <p className="text-xs text-gray-400">Prot</p>
                  <p className="font-bold text-blue-700">{generatedPlan.total_protein}g</p>
                </div>
                <div className="text-center bg-white rounded-lg py-2">
                  <p className="text-xs text-gray-400">Carbs</p>
                  <p className="font-bold text-amber-700">{generatedPlan.total_carbs}g</p>
                </div>
                <div className="text-center bg-white rounded-lg py-2">
                  <p className="text-xs text-gray-400">Gord</p>
                  <p className="font-bold text-red-700">{generatedPlan.total_fat}g</p>
                </div>
              </div>
              <p className="text-xs text-purple-700">{generatedPlan.meals?.length} refeições planejadas</p>
              {generatedPlan.observations && <p className="text-xs text-purple-600 mt-1">{generatedPlan.observations}</p>}
            </div>
          )}
        </div>

        <div className="flex gap-3 p-5 border-t sticky bottom-0 bg-white">
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">Cancelar</button>
          {!generatedPlan ? (
            <button onClick={handleGenerate} disabled={loading}
              className="flex-1 bg-purple-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Gerando plano...</> : <><Zap className="w-4 h-4" /> Gerar com IA</>}
            </button>
          ) : (
            <button onClick={handleSave} disabled={loading}
              className="flex-1 bg-green-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-50">
              {loading ? "Salvando..." : "Salvar Plano"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}