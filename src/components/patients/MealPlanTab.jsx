import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Utensils, MessageCircle } from "lucide-react";
import MealPlanBuilder from "../mealplans/MealPlanBuilder";
import MealPlanPDF from "../mealplans/MealPlanPDF";
import ShoppingList from "../mealplans/ShoppingList";

export default function MealPlanTab({ patientId, patientName, patientPhone, patient }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const load = async () => {
    const data = await base44.entities.MealPlan.filter({ patient_id: patientId });
    setPlans(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [patientId]);

  const handleWhatsApp = (plan) => {
    const phone = patientPhone?.replace(/\D/g, "");
    if (!phone) { alert("Paciente sem telefone cadastrado."); return; }
    const msg = encodeURIComponent(
      `Olá ${patientName}! 🥗 Seu plano alimentar "${plan.title}" está pronto!\n\n` +
      `📊 *Resumo nutricional diário:*\n` +
      `• Calorias: ${plan.total_calories || 0} kcal\n` +
      `• Proteínas: ${plan.total_protein || 0}g\n` +
      `• Carboidratos: ${plan.total_carbs || 0}g\n` +
      `• Gorduras: ${plan.total_fat || 0}g\n\n` +
      (plan.supplements ? `💊 *Suplementação:*\n${plan.supplements}\n\n` : "") +
      (plan.observations ? `📝 *Observações:*\n${plan.observations}\n\n` : "") +
      `Qualquer dúvida, me chame! 💪`
    );
    window.open(`https://wa.me/55${phone}?text=${msg}`, "_blank");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Planos Alimentares</h3>
        <button
          onClick={() => { setEditingPlan(null); setShowBuilder(true); }}
          className="flex items-center gap-1.5 text-sm bg-green-600 text-white px-3 py-2 rounded-xl hover:bg-green-700 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Novo Plano
        </button>
      </div>

      {loading ? (
        <div className="h-24 bg-gray-50 rounded-xl animate-pulse" />
      ) : plans.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <Utensils className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">Nenhum plano alimentar criado</p>
        </div>
      ) : (
        <div className="space-y-3">
          {plans.map(plan => (
            <div key={plan.id} className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{plan.title}</h4>
                  {plan.start_date && <p className="text-xs text-gray-400 mt-0.5">{plan.start_date} → {plan.end_date || "contínuo"}</p>}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  plan.status === "ativo" ? "bg-green-100 text-green-700" :
                  plan.status === "rascunho" ? "bg-gray-100 text-gray-500" : "bg-red-100 text-red-500"
                }`}>{plan.status}</span>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-3">
                {[
                  { label: "Kcal", val: plan.total_calories || 0 },
                  { label: "Prot", val: `${plan.total_protein || 0}g` },
                  { label: "Carbs", val: `${plan.total_carbs || 0}g` },
                  { label: "Gord", val: `${plan.total_fat || 0}g` },
                ].map((n, i) => (
                  <div key={i} className="text-center bg-white border border-gray-100 rounded-lg py-1.5">
                    <p className="text-xs text-gray-400">{n.label}</p>
                    <p className="text-sm font-semibold text-gray-800">{n.val}</p>
                  </div>
                ))}
              </div>

              {plan.meals?.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-400 mb-2 font-medium">{plan.meals.length} refeição(ões) planejadas</p>
                  <div className="space-y-2">
                    {plan.meals.map((meal, mi) => (
                      <div key={mi} className="bg-gray-50 rounded-lg p-2">
                        <p className="text-xs font-semibold text-gray-700">{meal.name} {meal.time && `· ${meal.time}`}</p>
                        {meal.foods?.map((food, fi) => (
                          <p key={fi} className="text-xs text-gray-500 ml-2">• {food.name} — {food.quantity}{food.unit}</p>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => { setEditingPlan(plan); setShowBuilder(true); }}
                  className="flex-1 text-sm bg-green-50 text-green-700 py-2 rounded-xl font-medium hover:bg-green-100 transition-colors"
                >
                  Editar plano
                </button>
                <MealPlanPDF plan={plan} patientName={patientName} patient={patient} />
                <ShoppingList plan={plan} patientName={patientName} />
                <button
                  onClick={() => handleWhatsApp(plan)}
                  className="flex items-center gap-2 text-sm bg-green-500 text-white px-3 py-2 rounded-xl font-medium hover:bg-green-600 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> Enviar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showBuilder && (
        <MealPlanBuilder
          patients={[{ id: patientId, full_name: patientName }]}
          plan={editingPlan ? { ...editingPlan } : { patient_id: patientId, patient_name: patientName }}
          onClose={() => setShowBuilder(false)}
          onSave={() => { load(); setShowBuilder(false); }}
        />
      )}
    </div>
  );
}