import { useState, useEffect } from "react";
import { db as base44 } from "@/api/localDB";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Plus, Search, Utensils, User, Calendar, MessageCircle, Zap,
  BookOpen, Download, Tag, ChevronDown, ChevronUp
} from "lucide-react";
import MealPlanBuilder from "../components/mealplans/MealPlanBuilder";
import AIGeneratePlan from "../components/mealplans/AIGeneratePlan";
import { BIBLIOTECA_PLANOS } from "@/data/seed/index.js";

// ── Modal de importação da biblioteca ─────────────────────────────────────
function LibraryImportModal({ patients, onImport, onClose }) {
  const [step, setStep]             = useState("pick_plan"); // pick_plan | pick_patient
  const [selectedPlan, setSelected] = useState(null);
  const [patientId, setPatientId]   = useState("");
  const [importing, setImporting]   = useState(false);

  const handleImport = async () => {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return;
    setImporting(true);
    try {
      await onImport(selectedPlan, patient);
      onClose();
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" style={{ color: "#1D9E75" }} />
            <h3 className="font-bold text-gray-900">Importar da Biblioteca</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>

        <div className="p-5 space-y-4">
          {/* Passo 1: escolher plano */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">1. Escolha o modelo</p>
            <div className="space-y-2">
              {BIBLIOTECA_PLANOS.map(plan => (
                <button
                  key={plan.id}
                  onClick={() => setSelected(plan)}
                  className={`w-full text-left p-3.5 rounded-xl border-2 transition-all ${
                    selectedPlan?.id === plan.id
                      ? "border-[#1D9E75] bg-[#E1F5EE]"
                      : "border-gray-100 hover:border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{plan.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{plan.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-bold" style={{ color: "#1D9E75" }}>{plan.total_calories} kcal</p>
                      <p className="text-[10px] text-gray-400">{plan.meals?.length || 0} refeições</p>
                    </div>
                  </div>
                  {/* Macros mini */}
                  <div className="flex gap-2 mt-2">
                    {[
                      { l: "Prot", v: `${plan.total_protein}g`, c: "#3B82F6" },
                      { l: "Carbs", v: `${plan.total_carbs}g`, c: "#F59E0B" },
                      { l: "Gord", v: `${plan.total_fat}g`, c: "#EF4444" },
                    ].map((m, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-gray-100 font-semibold"
                        style={{ color: m.c }}>
                        {m.l}: {m.v}
                      </span>
                    ))}
                  </div>
                  {/* Tags */}
                  {plan.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {plan.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-[9px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{tag}</span>
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Passo 2: escolher paciente */}
          {selectedPlan && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">2. Atribuir ao paciente</p>
              <select
                value={patientId}
                onChange={e => setPatientId(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
                style={{ "--tw-ring-color": "#1D9E7540" }}
              >
                <option value="">Selecione um paciente...</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.full_name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="p-5 pt-0 flex gap-2">
          <button onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-50">
            Cancelar
          </button>
          <button
            onClick={handleImport}
            disabled={!selectedPlan || !patientId || importing}
            className="flex-1 text-white py-2.5 rounded-xl text-sm font-semibold disabled:opacity-40 flex items-center justify-center gap-2"
            style={{ background: "#1D9E75" }}
          >
            <Download className="w-4 h-4" />
            {importing ? "Importando..." : "Importar Plano"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Card de plano da biblioteca ───────────────────────────────────────────
function BibliotecaCard({ plan, onImport }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3 gap-2">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "#E1F5EE" }}>
          <BookOpen className="w-5 h-5" style={{ color: "#1D9E75" }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug">{plan.title}</h3>
          <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2">{plan.description}</p>
        </div>
        <span className="text-[10px] px-2 py-1 rounded-full font-semibold flex-shrink-0"
          style={{ background: "#E1F5EE", color: "#0F6E56" }}>
          Modelo
        </span>
      </div>

      {/* Macros */}
      <div className="grid grid-cols-4 gap-1.5 mb-3">
        {[
          { label: "Kcal", value: plan.total_calories },
          { label: "Prot", value: `${plan.total_protein}g` },
          { label: "Carbs", value: `${plan.total_carbs}g` },
          { label: "Gord", value: `${plan.total_fat}g` },
        ].map((n, i) => (
          <div key={i} className="bg-gray-50 rounded-lg p-1.5 text-center">
            <p className="text-[9px] text-gray-400">{n.label}</p>
            <p className="text-xs font-semibold text-gray-800">{n.value}</p>
          </div>
        ))}
      </div>

      {/* Tags */}
      {plan.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {plan.tags.slice(0, 4).map((tag, i) => (
            <span key={i}
              className="inline-flex items-center gap-0.5 text-[9px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
              <Tag className="w-2.5 h-2.5" />{tag}
            </span>
          ))}
        </div>
      )}

      {/* Expandir refeições */}
      {plan.meals?.length > 0 && (
        <div className="mb-3">
          <button
            onClick={() => setExpanded(v => !v)}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 font-medium"
          >
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {plan.meals.length} refeições
          </button>
          {expanded && (
            <div className="mt-2 space-y-1">
              {plan.meals.map((meal, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-gray-600 py-0.5">
                  <span className="text-gray-300">●</span>
                  <span className="font-medium">{meal.time}</span>
                  <span className="text-gray-400">·</span>
                  <span>{meal.name}</span>
                  <span className="ml-auto text-gray-400">{meal.calories} kcal</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => onImport(plan)}
        className="w-full flex items-center justify-center gap-2 text-sm font-semibold py-2 rounded-xl transition-colors"
        style={{ background: "#E1F5EE", color: "#0F6E56" }}
        onMouseEnter={e => { e.target.style.background = "#1D9E75"; e.target.style.color = "white"; }}
        onMouseLeave={e => { e.target.style.background = "#E1F5EE"; e.target.style.color = "#0F6E56"; }}
      >
        <Download className="w-3.5 h-3.5" /> Importar para paciente
      </button>
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────────────────
export default function MealPlans() {
  const [plans,       setPlans]       = useState([]);
  const [patients,    setPatients]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState("");
  const [showBuilder, setShowBuilder] = useState(false);
  const [showAI,      setShowAI]      = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [importTarget, setImportTarget] = useState(null); // plano pré-selecionado
  const [editingPlan, setEditingPlan] = useState(null);
  const [activeTab,   setActiveTab]   = useState("meus"); // meus | biblioteca

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

  // Importar da biblioteca para um paciente
  const handleImportFromLibrary = async (seedPlan, patient) => {
    const now = new Date().toISOString().split("T")[0];
    await base44.entities.MealPlan.create({
      title:          `${seedPlan.title} — ${patient.full_name}`,
      description:    seedPlan.description,
      patient_id:     patient.id,
      patient_name:   patient.full_name,
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

  // Abrir modal de biblioteca pré-selecionando um plano
  const openLibraryFor = (plan) => {
    setImportTarget(plan);
    setShowLibrary(true);
  };

  return (
    <div className="space-y-6">
      {/* ── Cabeçalho ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-gray-900">Planos Alimentares</h1>
          <p className="text-gray-500 text-sm">{plans.length} planos criados · {BIBLIOTECA_PLANOS.length} modelos na biblioteca</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setShowAI(true)}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors">
            <Zap className="w-4 h-4" /> Gerar com IA
          </button>
          <button onClick={() => openLibraryFor(null)}
            className="flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
            <BookOpen className="w-4 h-4" style={{ color: "#1D9E75" }} /> Importar modelo
          </button>
          <button onClick={() => { setEditingPlan(null); setShowBuilder(true); }}
            className="flex items-center gap-2 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
            style={{ background: "#1D9E75" }}>
            <Plus className="w-4 h-4" /> Novo Plano
          </button>
        </div>
      </div>

      {/* ── Abas ── */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {[
          { key: "meus",      label: `Meus Planos (${plans.length})` },
          { key: "biblioteca", label: `Biblioteca (${BIBLIOTECA_PLANOS.length})` },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className="px-4 py-1.5 rounded-lg text-sm font-semibold transition-all"
            style={activeTab === tab.key
              ? { background: "#1D9E75", color: "white" }
              : { color: "#6B7280" }
            }>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── ABA: Meus Planos ── */}
      {activeTab === "meus" && (
        <>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Buscar por paciente ou título..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 bg-white"
              style={{ "--tw-ring-color": "#1D9E7540" }} />
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3].map(i => <div key={i} className="h-48 bg-white rounded-2xl animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Utensils className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Nenhum plano alimentar</p>
              <p className="text-sm mt-1">Crie um novo plano, use a IA ou importe da biblioteca</p>
              <button onClick={() => setActiveTab("biblioteca")}
                className="mt-4 text-sm font-semibold px-4 py-2 rounded-xl text-white"
                style={{ background: "#1D9E75" }}>
                Ver biblioteca de modelos
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(plan => (
                <div key={plan.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: "#E1F5EE" }}>
                      <Utensils className="w-5 h-5" style={{ color: "#1D9E75" }} />
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      plan.status === "ativo"    ? "bg-green-100 text-green-700" :
                      plan.status === "rascunho" ? "bg-gray-100 text-gray-500"  :
                      "bg-red-100 text-red-500"
                    }`}>{plan.status}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 leading-snug">{plan.title}</h3>
                  <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-1">
                    <User className="w-3.5 h-3.5" />
                    <Link to={createPageUrl(`PatientDetail?id=${plan.patient_id}`)}
                      className="hover:underline" style={{ color: "#1D9E75" }}>
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
                      { label: "Kcal",     value: plan.total_calories },
                      { label: "Proteína", value: `${plan.total_protein || 0}g` },
                      { label: "Carbs",    value: `${plan.total_carbs || 0}g` },
                      { label: "Gordura",  value: `${plan.total_fat || 0}g` },
                    ].map((n, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-2 text-center">
                        <p className="text-xs text-gray-400">{n.label}</p>
                        <p className="text-sm font-semibold text-gray-800">{n.value || 0}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingPlan(plan); setShowBuilder(true); }}
                      className="flex-1 text-sm py-2 rounded-xl font-medium transition-colors"
                      style={{ background: "#E1F5EE", color: "#0F6E56" }}>
                      Editar
                    </button>
                    <button onClick={() => handleWhatsApp(plan)}
                      className="p-2 text-white rounded-xl transition-colors"
                      style={{ background: "#25D366" }} title="Enviar via WhatsApp">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── ABA: Biblioteca de Modelos ── */}
      {activeTab === "biblioteca" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-700">
            <p className="font-semibold">📚 Biblioteca de Modelos</p>
            <p className="text-xs mt-0.5">
              Planos-template prontos para importar. Ao importar, uma cópia editável é criada para o paciente selecionado.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BIBLIOTECA_PLANOS.map(plan => (
              <BibliotecaCard key={plan.id} plan={plan} onImport={openLibraryFor} />
            ))}
          </div>
        </div>
      )}

      {/* ── Modais ── */}
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

      {showLibrary && (
        <LibraryImportModal
          patients={patients}
          preSelected={importTarget}
          onImport={handleImportFromLibrary}
          onClose={() => { setShowLibrary(false); setImportTarget(null); }}
        />
      )}
    </div>
  );
}
