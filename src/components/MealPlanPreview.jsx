import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Star, Copy, ChevronRight, Clock, Utensils, AlertCircle, FileText, Search, Users } from "lucide-react";
import { useMealPlans } from "@/hooks/useMealPlans";
import { formatMacroPercent, buildPlanFromTemplate } from "@/utils/mealPlanUtils";

const RESTRICTION_LABELS = {
  sem_lactose: "Sem Lactose",
  sem_gluten: "Sem Glúten",
  vegano: "Vegano",
  baixo_sodio: "Baixo Sódio",
  baixo_potassio: "Baixo Potássio",
  baixo_fodmap: "FODMAP",
};

const RESTRICTION_COLORS = {
  sem_lactose: "bg-yellow-100 text-yellow-700 border-yellow-200",
  sem_gluten: "bg-orange-100 text-orange-700 border-orange-200",
  vegano: "bg-green-100 text-green-700 border-green-200",
  baixo_sodio: "bg-blue-100 text-blue-700 border-blue-200",
  baixo_potassio: "bg-purple-100 text-purple-700 border-purple-200",
  baixo_fodmap: "bg-teal-100 text-teal-700 border-teal-200",
};

// ── localStorage helpers ───────────────────────────────────────────────────
function readPatients() {
  try { return JSON.parse(localStorage.getItem("nf_patients")) || []; } catch { return []; }
}

function createPlanInStore(template, patientId) {
  const K = "nf_patient_meal_plans";
  const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const getAll = () => { try { return JSON.parse(localStorage.getItem(K)) || []; } catch { return []; } };
  const saveAll = (a) => { try { localStorage.setItem(K, JSON.stringify(a)); } catch {} };
  const arr = getAll();
  const record = { ...buildPlanFromTemplate(template, patientId), id: genId(), created_date: new Date().toISOString() };
  arr.push(record);
  saveAll(arr);
  return record;
}

// ── Toast ──────────────────────────────────────────────────────────────────
function Toast({ message, onDone }) {
  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm px-5 py-3 rounded-xl shadow-xl flex items-center gap-2"
    >
      <span className="text-green-400">✓</span>
      {message}
    </div>
  );
}

// ── Patient Picker Modal ───────────────────────────────────────────────────
function PatientPickerModal({ plan, onConfirm, onClose }) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const patients = readPatients().filter((p) => !p.deletedAt);

  const filtered = patients.filter((p) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      p.full_name?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm flex flex-col max-h-[80vh]">
        <div className="flex items-start justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900 text-base">Selecionar paciente</h2>
            <p className="text-xs text-gray-400 mt-0.5">O plano será vinculado ao paciente escolhido</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 pt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar paciente..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D4F4F]/30"
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
          {filtered.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">
                {patients.length === 0
                  ? "Nenhum paciente cadastrado"
                  : "Nenhum paciente encontrado"}
              </p>
            </div>
          )}
          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl border-2 transition-all flex items-center gap-3 ${
                selectedId === p.id
                  ? "border-[#2D4F4F] bg-[#2D4F4F]/5"
                  : "border-transparent hover:bg-gray-50"
              }`}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{ background: "#E1F5EE", color: "#0F6E56" }}
              >
                {p.full_name?.[0]?.toUpperCase() || "P"}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{p.full_name}</p>
                {p.email && <p className="text-xs text-gray-400 truncate">{p.email}</p>}
              </div>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-gray-100 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => selectedId && onConfirm(selectedId)}
            disabled={!selectedId}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "#2D4F4F" }}
          >
            Usar como base
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
export default function MealPlanPreview({ plan, onClose, onUseAsBase, onDuplicate }) {
  const navigate = useNavigate();
  const { toggleFavoriteTemplate, isFavoriteTemplate } = useMealPlans(null);
  const [toast, setToast] = useState(null);
  const [favState, setFavState] = useState(() => isFavoriteTemplate(plan.id));
  const [showPatientPicker, setShowPatientPicker] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const handleFavorite = () => {
    const next = toggleFavoriteTemplate(plan.id);
    setFavState(next);
    showToast(next ? "Plano adicionado aos favoritos" : "Plano removido dos favoritos");
  };

  const handleDuplicate = () => {
    if (onDuplicate) onDuplicate(plan);
    showToast("Plano duplicado com sucesso");
  };

  const handleUseAsBase = () => {
    if (onUseAsBase) {
      onUseAsBase(plan);
    } else {
      setShowPatientPicker(true);
    }
  };

  const handlePatientConfirm = (patientId) => {
    setShowPatientPicker(false);
    const newPlan = createPlanInStore(plan, patientId);
    if (newPlan?.id) {
      navigate(`/MealPlanEditor?planId=${newPlan.id}`);
    }
  };

  const pct = formatMacroPercent(plan.macros, plan.totalCalories);

  return (
    <>
      <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-gray-100">
          <div className="flex-1 min-w-0 pr-3">
            <h2 className="font-bold text-gray-900 text-lg leading-tight truncate">{plan.name}</h2>
            <p className="text-sm text-gray-500 mt-0.5 capitalize">
              {plan.objective?.replace("_", " ")} · {plan.mealsPerDay} refeições/dia
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400"
            aria-label="Fechar preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Metric cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-green-700">{plan.totalCalories}</p>
              <p className="text-xs text-green-600 mt-0.5">kcal/dia</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-blue-700">{plan.macros?.protein ?? plan.macros?.ptn ?? 0}g</p>
              <p className="text-xs text-blue-600 mt-0.5">Proteína ({pct.ptn}%)</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-amber-700">{plan.macros?.carbs ?? plan.macros?.cho ?? 0}g</p>
              <p className="text-xs text-amber-600 mt-0.5">Carboidratos ({pct.cho}%)</p>
            </div>
          </div>

          {/* Tags + restrições */}
          {(plan.restrictions?.length > 0 || plan.tags?.length > 0) && (
            <div className="flex flex-wrap gap-1.5">
              {plan.restrictions?.map((r) => (
                <span
                  key={r}
                  className={`text-xs px-2.5 py-1 rounded-full border font-medium ${RESTRICTION_COLORS[r] || "bg-gray-100 text-gray-600 border-gray-200"}`}
                >
                  {RESTRICTION_LABELS[r] || r}
                </span>
              ))}
              {plan.tags?.map((tag) => (
                <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Refeições */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5" />
              Refeições
            </h3>
            <div className="space-y-2">
              {plan.meals?.map((meal) => (
                <div key={meal.id} className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <span className="text-xs text-gray-400">{meal.time}</span>
                      <span className="text-sm font-medium text-gray-800">{meal.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                      {meal.calories} kcal
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 pl-5 leading-relaxed">
                    {meal.foods?.slice(0, 4).map((f) => f.name).join(", ")}
                    {meal.foods?.length > 4 && ` +${meal.foods.length - 4} alimentos`}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Notas clínicas */}
          {plan.clinicalNotes && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-xs font-semibold text-amber-700">Notas Clínicas</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">{plan.clinicalNotes}</p>
            </div>
          )}

          {/* Contraindicações */}
          {plan.contraindications && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                <span className="text-xs font-semibold text-red-700">Contraindicações</span>
              </div>
              <p className="text-xs text-red-800 leading-relaxed">{plan.contraindications}</p>
            </div>
          )}

          {/* Instruções ao paciente */}
          {plan.patientInstructions && (
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-xs font-semibold text-blue-700">Instruções ao Paciente</span>
              </div>
              <p className="text-xs text-blue-800 leading-relaxed">{plan.patientInstructions}</p>
            </div>
          )}
        </div>

        {/* Actions footer */}
        <div className="p-4 border-t border-gray-100 space-y-2">
          <button
            onClick={handleUseAsBase}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
            style={{ background: "#2D4F4F" }}
          >
            Usar como base
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleDuplicate}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              Duplicar
            </button>
            <button
              onClick={handleFavorite}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                favState
                  ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${favState ? "fill-yellow-500 text-yellow-500" : ""}`} />
              {favState ? "Favoritado" : "Favoritar"}
            </button>
          </div>
        </div>

        {toast && <Toast message={toast} onDone={() => setToast(null)} />}
      </div>

      {showPatientPicker && (
        <PatientPickerModal
          plan={plan}
          onConfirm={handlePatientConfirm}
          onClose={() => setShowPatientPicker(false)}
        />
      )}
    </>
  );
}
