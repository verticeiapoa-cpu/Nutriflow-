import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, Search, Utensils, User, Calendar, MessageCircle, Zap } from "lucide-react";
import MealPlanBuilder from "../components/mealplans/MealPlanBuilder";
import AIGeneratePlan from "../components/mealplans/AIGeneratePlan";

export default function MealPlans() {
  const [plans, setPlans] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showBuilder, setShowBuilder] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const load = async () => {
    const [p, pts] = await Promise.all([
      base44.entities.MealPlan.list("-created_date", 100),
      base44.entities.Patient.list("-created_date", 100)
    ]);
    setPlans(p);
    setPatients(pts);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = plans.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.patient_name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleWhatsApp = (plan) => {
    const patient = patients.find(p => p.id === plan.patient_id);
    const phone = patient?.phone?.replace(/\D/g, "");
    if (!phone) { alert("Paciente sem telefone cadastrado."); return; }
    const msg = encodeURIComponent(
      `Olá ${plan.patient_name}! 🥗 Seu plano alimentar "${plan.title}" está pronto!\n\n` +
      `📊 *Resumo nutricional:*\n` +
      `• Calorias: ${plan.total_calories || 0} kcal/dia\n` +
      `• Proteínas: ${plan.total_protein || 0}g\n` +
      `• Carboidratos: ${plan.total_carbs || 0}g\n` +
      `• Gorduras: ${plan.total_fat || 0}g\n\n` +
      `Qualquer dúvida, pode me chamar! 💪`
    );
    window.open(`https://wa.me/55${phone}?text=${msg}`, "_blank");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Planos Alimentares</h1>
          <p className="text-gray-500 text-sm">{plans.length} planos criados</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAI(true)}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors"
          >
            <Zap className="w-4 h-4" /> Gerar com IA
          </button>
          <button
            onClick={() => { setEditingPlan(null); setShowBuilder(true); }}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Novo Plano
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por paciente ou título..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
        />
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-48 bg-white rounded-2xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Utensils className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">Nenhum plano alimentar</p>
          <p className="text-sm mt-1">Crie um novo plano ou use a IA</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(plan => (
            <div key={plan.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Utensils className="w-5 h-5 text-green-600" />
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  plan.status === "ativo" ? "bg-green-100 text-green-700" :
                  plan.status === "rascunho" ? "bg-gray-100 text-gray-500" :
                  "bg-red-100 text-red-500"
                }`}>{plan.status}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{plan.title}</h3>
              <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-1">
                <User className="w-3.5 h-3.5" />
                <Link to={createPageUrl(`PatientDetail?id=${plan.patient_id}`)} className="hover:text-green-600 hover:underline">
                  {plan.patient_name}
                </Link>
              </div>
              {plan.start_date && (
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
                  <Calendar className="w-3.5 h-3.5" />
                  {plan.start_date} → {plan.end_date || "sem fim"}
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                  { label: "Kcal", value: plan.total_calories },
                  { label: "Proteína", value: `${plan.total_protein || 0}g` },
                  { label: "Carbs", value: `${plan.total_carbs || 0}g` },
                  { label: "Gordura", value: `${plan.total_fat || 0}g` },
                ].map((n, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-400">{n.label}</p>
                    <p className="text-sm font-semibold text-gray-800">{n.value || 0}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditingPlan(plan); setShowBuilder(true); }}
                  className="flex-1 text-sm bg-green-50 text-green-700 py-2 rounded-xl font-medium hover:bg-green-100 transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleWhatsApp(plan)}
                  className="p-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                  title="Enviar via WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showBuilder && (
        <MealPlanBuilder
          patients={patients}
          plan={editingPlan}
          onClose={() => setShowBuilder(false)}
          onSave={() => { load(); setShowBuilder(false); }}
        />
      )}

      {showAI && (
        <AIGeneratePlan
          patients={patients}
          onClose={() => setShowAI(false)}
          onSave={() => { load(); setShowAI(false); }}
        />
      )}
    </div>
  );
}