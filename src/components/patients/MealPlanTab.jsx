import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db as base44 } from "@/api/localDB";
import { Plus, Utensils, MessageCircle, BookOpen, Download, X, ChevronDown, ChevronUp, BookMarked, Edit2, Flame } from "lucide-react";
import MealPlanBuilder from "../mealplans/MealPlanBuilder";
import MealPlanPDF from "../mealplans/MealPlanPDF";
import ShoppingList from "../mealplans/ShoppingList";
import { BIBLIOTECA_PLANOS } from "@/data/seed/index.js";
import { useMealPlans } from "@/hooks/useMealPlans";
import MealPlanLibrary from "@/pages/MealPlanLibrary";
import { createPageUrl } from "@/utils";

// ── Modal inline para importar da biblioteca ──────────────────────────────
function BibliotecaModal({ patientId, patientName, onImport, onClose }) {
  const [selected, setSelected]   = useState(null);
  const [importing, setImporting] = useState(false);
  const [expanded, setExpanded]   = useState(null);

  const handleImport = async () => {
    if (!selected) return;
    setImporting(true);
    try {
      await onImport(selected);
      onClose();
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" style={{ color: "#1D9E75" }} />
            <h3 className="font-bold text-gray-900 text-sm">Adicionar da Biblioteca</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Destino */}
        <div className="px-4 py-2 bg-[#E1F5EE] border-b border-[#c6f0de] flex-shrink-0">
          <p className="text-xs font-medium" style={{ color: "#0F6E56" }}>
            Importar para: <span className="font-bold">{patientName}</span>
          </p>
        </div>

        {/* Lista de planos */}
        <div className="overflow-y-auto flex-1 p-4 space-y-2">
          {BIBLIOTECA_PLANOS.map(plan => (
            <div key={plan.id}>
              <button
                onClick={() => setSelected(s => s?.id === plan.id ? null : plan)}
                className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                  selected?.id === plan.id
                    ? "border-[#1D9E75] bg-[#E1F5EE]"
                    : "border-gray-100 hover:border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900">{plan.title}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">{plan.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-bold" style={{ color: "#1D9E75" }}>{plan.total_calories} kcal</p>
                    <p className="text-[10px] text-gray-400">{plan.meals?.length} refeições</p>
                  </div>
                </div>
                {/* Macros */}
                <div className="flex gap-1.5 mt-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-gray-100 text-blue-600 font-semibold">
                    P: {plan.total_protein}g
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-gray-100 text-amber-600 font-semibold">
                    C: {plan.total_carbs}g
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-gray-100 text-red-500 font-semibold">
                    G: {plan.total_fat}g
                  </span>
                </div>
              </button>

              {/* Expandir refeições */}
              {selected?.id === plan.id && plan.meals?.length > 0 && (
                <div className="mt-1 ml-2 border-l-2 pl-3 space-y-0.5" style={{ borderColor: "#1D9E75" }}>
                  <button
                    onClick={() => setExpanded(e => e === plan.id ? null : plan.id)}
                    className="flex items-center gap-1 text-xs font-medium mt-1"
                    style={{ color: "#1D9E75" }}
                  >
                    {expanded === plan.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    Ver {plan.meals.length} refeições
                  </button>
                  {expanded === plan.id && plan.meals.map((meal, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-500 py-0.5">
                      <span className="text-[8px]">●</span>
                      <span className="font-medium text-gray-700">{meal.time}</span>
                      <span>·</span>
                      <span>{meal.name}</span>
                      <span className="ml-auto text-gray-400">{meal.calories} kcal</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 pt-0 flex gap-2 flex-shrink-0">
          <button onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-xl text-sm hover:bg-gray-50">
            Cancelar
          </button>
          <button
            onClick={handleImport}
            disabled={!selected || importing}
            className="flex-1 text-white py-2 rounded-xl text-sm font-semibold disabled:opacity-40 flex items-center justify-center gap-2"
            style={{ background: "#1D9E75" }}
          >
            <Download className="w-4 h-4" />
            {importing ? "Importando..." : "Importar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Tab principal ─────────────────────────────────────────────────────────
export default function MealPlanTab({ patientId, patientName, patientPhone, patient }) {
  const navigate = useNavigate();
  const [plans,       setPlans]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [showBuilder, setShowBuilder] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  // ── Planos de templates (novo sistema nf_patient_meal_plans) ──────────────
  const { getPatientPlans } = useMealPlans(patientId);
  const [templatePlans,         setTemplatePlans]         = useState([]);
  const [showTemplateLibrary,   setShowTemplateLibrary]   = useState(false);

  const loadTemplatePlans = () => setTemplatePlans(getPatientPlans());

  const handleTemplatePlanCreated = () => {
    setShowTemplateLibrary(false);
    loadTemplatePlans();
  };

  const load = async () => {
    const data = await base44.entities.MealPlan.filter({ patient_id: patientId });
    setPlans(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
    loadTemplatePlans();
  }, [patientId]);

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

  const handleImportFromLibrary = async (seedPlan) => {
    await base44.entities.MealPlan.create({
      title:          `${seedPlan.title} — ${patientName}`,
      description:    seedPlan.description,
      patient_id:     patientId,
      patient_name:   patientName,
      total_calories: seedPlan.total_calories,
      total_protein:  seedPlan.total_protein,
      total_carbs:    seedPlan.total_carbs,
      total_fat:      seedPlan.total_fat,
      status:         "rascunho",
      meals:          seedPlan.meals || [],
      supplements:    seedPlan.supplements || "",
      observations:   seedPlan.observations || "",
    });
    await load();
  };

  return (
    <div className="space-y-4">
      {/* Ações */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h3 className="font-semibold text-gray-800">Planos Alimentares</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowLibrary(true)}
            className="flex items-center gap-1.5 text-sm border border-gray-200 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            style={{ color: "#0F6E56" }}
          >
            <BookOpen className="w-3.5 h-3.5" /> Da Biblioteca
          </button>
          <button
            onClick={() => { setEditingPlan(null); setShowBuilder(true); }}
            className="flex items-center gap-1.5 text-sm text-white px-3 py-2 rounded-xl hover:opacity-90 transition-colors font-medium"
            style={{ background: "#1D9E75" }}
          >
            <Plus className="w-3.5 h-3.5" /> Novo Plano
          </button>
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="h-24 bg-gray-50 rounded-xl animate-pulse" />
      ) : plans.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <Utensils className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm font-medium">Nenhum plano criado</p>
          <div className="flex justify-center gap-2 mt-3">
            <button onClick={() => setShowLibrary(true)}
              className="text-xs px-3 py-1.5 rounded-xl font-semibold"
              style={{ background: "#E1F5EE", color: "#0F6E56" }}>
              Importar da biblioteca
            </button>
            <button onClick={() => setShowBuilder(true)}
              className="text-xs px-3 py-1.5 rounded-xl font-semibold text-white"
              style={{ background: "#1D9E75" }}>
              Criar do zero
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {plans.map(plan => (
            <div key={plan.id} className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{plan.title}</h4>
                  {plan.start_date && (
                    <p className="text-xs text-gray-400 mt-0.5">{plan.start_date} → {plan.end_date || "contínuo"}</p>
                  )}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${
                  plan.status === "ativo"    ? "bg-green-100 text-green-700" :
                  plan.status === "rascunho" ? "bg-gray-100 text-gray-500"  :
                  "bg-red-100 text-red-500"
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
                  <p className="text-xs text-gray-400 mb-1.5 font-medium">{plan.meals.length} refeição(ões)</p>
                  <div className="space-y-1.5">
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
                  className="flex-1 text-sm py-2 rounded-xl font-medium transition-colors"
                  style={{ background: "#E1F5EE", color: "#0F6E56" }}
                >
                  Editar plano
                </button>
                <MealPlanPDF plan={plan} patientName={patientName} patient={patient} />
                <ShoppingList plan={plan} patientName={patientName} />
                <button
                  onClick={() => handleWhatsApp(plan)}
                  className="flex items-center gap-2 text-sm text-white px-3 py-2 rounded-xl font-medium transition-colors"
                  style={{ background: "#25D366" }}
                >
                  <MessageCircle className="w-3.5 h-3.5" /> Enviar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Seção: Planos da Biblioteca de Templates ─────────────────────── */}
      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <BookMarked className="w-4 h-4" style={{ color: "#2D4F4F" }} />
            <h3 className="font-semibold text-gray-800 text-sm">Planos da Biblioteca de Templates</h3>
            {templatePlans.length > 0 && (
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{templatePlans.length}</span>
            )}
          </div>
          <button
            onClick={() => setShowTemplateLibrary(true)}
            className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl font-medium transition-colors"
            style={{ background: "#2D4F4F", color: "#fff" }}
          >
            <Plus className="w-3.5 h-3.5" />
            Adicionar plano alimentar
          </button>
        </div>

        {templatePlans.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <BookMarked className="w-8 h-8 mx-auto mb-2 opacity-20" style={{ color: "#2D4F4F" }} />
            <p className="text-sm font-medium text-gray-500">Nenhum plano de template vinculado</p>
            <p className="text-xs text-gray-400 mt-1">Escolha um dos 27 templates clínicos da biblioteca</p>
            <button
              onClick={() => setShowTemplateLibrary(true)}
              className="mt-3 text-xs px-4 py-1.5 rounded-xl font-semibold"
              style={{ background: "#E8F0EF", color: "#2D4F4F" }}
            >
              Abrir biblioteca
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {templatePlans.map((plan) => (
              <div
                key={plan.id}
                className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3 hover:border-gray-200 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-900 truncate">{plan.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-medium flex-shrink-0">
                      v{plan.version || 1}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${
                      plan.status === "ativo" ? "bg-green-100 text-green-700" :
                      plan.status === "arquivado" ? "bg-gray-100 text-gray-500" :
                      "bg-amber-100 text-amber-700"
                    }`}>{plan.status || "ativo"}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Flame className="w-3 h-3 text-orange-400" />
                      <strong className="text-gray-700">{plan.totalCalories}</strong> kcal/dia
                    </span>
                    {plan.mealsPerDay && (
                      <span className="flex items-center gap-1">
                        <Utensils className="w-3 h-3 text-gray-400" />
                        {plan.mealsPerDay} refeições
                      </span>
                    )}
                    {plan.created_date && (
                      <span className="text-gray-400">
                        Início {new Date(plan.created_date).toLocaleDateString("pt-BR")}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => navigate(createPageUrl("MealPlanEditor") + "?planId=" + plan.id)}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold flex-shrink-0 transition-colors hover:opacity-80"
                  style={{ background: "#E8F0EF", color: "#2D4F4F" }}
                >
                  <Edit2 className="w-3 h-3" />
                  Editar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Biblioteca de Templates */}
      {showTemplateLibrary && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/60">
          <div className="flex-1 bg-white flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0" style={{ background: "#2D4F4F" }}>
              <div>
                <h2 className="font-bold text-white text-base">Biblioteca de Planos Alimentares</h2>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.7)" }}>
                  Paciente: <strong>{patientName}</strong>
                </p>
              </div>
              <button
                onClick={() => setShowTemplateLibrary(false)}
                className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <MealPlanLibrary
                patientId={patientId}
                onPlanCreated={handleTemplatePlanCreated}
              />
            </div>
          </div>
        </div>
      )}

      {/* Builder */}
      {showBuilder && (
        <MealPlanBuilder
          patients={[{ id: patientId, full_name: patientName }]}
          plan={editingPlan ? { ...editingPlan } : { patient_id: patientId, patient_name: patientName }}
          onClose={() => setShowBuilder(false)}
          onSave={() => { load(); setShowBuilder(false); }}
        />
      )}

      {/* Biblioteca */}
      {showLibrary && (
        <BibliotecaModal
          patientId={patientId}
          patientName={patientName}
          onImport={handleImportFromLibrary}
          onClose={() => setShowLibrary(false)}
        />
      )}
    </div>
  );
}
