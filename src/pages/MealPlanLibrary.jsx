import { useState, useMemo } from "react";
import { Search, Plus, Utensils, Flame, X } from "lucide-react";
import { MEAL_PLAN_TEMPLATES } from "@/data/mealPlanTemplates";
import { searchTemplates } from "@/utils/mealPlanUtils";
import MealPlanPreview from "@/components/MealPlanPreview";
import { useMealPlans } from "@/hooks/useMealPlans";

// ── Paleta ────────────────────────────────────────────────────────────────
const PRIMARY = "#2D4F4F";
const SUCCESS = "#1D9E75";

// ── Badge de categoria ────────────────────────────────────────────────────
const BADGE_STYLES = {
  green:  "bg-green-100 text-green-700 border-green-200",
  blue:   "bg-blue-100 text-blue-700 border-blue-200",
  yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
  orange: "bg-orange-100 text-orange-700 border-orange-200",
  purple: "bg-purple-100 text-purple-700 border-purple-200",
  red:    "bg-red-100 text-red-700 border-red-200",
  gray:   "bg-gray-100 text-gray-600 border-gray-200",
  teal:   "bg-teal-100 text-teal-700 border-teal-200",
};

// ── Pill de filtro ────────────────────────────────────────────────────────
function Pill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border whitespace-nowrap ${
        active
          ? "text-white border-transparent"
          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
      }`}
      style={active ? { background: PRIMARY, borderColor: PRIMARY } : {}}
    >
      {children}
    </button>
  );
}

// ── Filtros de objetivo ───────────────────────────────────────────────────
const OBJECTIVES = [
  { value: "todos",      label: "Todos" },
  { value: "emagrecimento", label: "Emagrecimento" },
  { value: "hipertrofia",   label: "Hipertrofia" },
  { value: "manutencao",    label: "Manutenção" },
  { value: "terapeutico",   label: "Terapêutico" },
  { value: "pediatrico",    label: "Pediátrico" },
  { value: "terceira_idade",label: "3ª Idade" },
  { value: "vegetariano",   label: "Vegetariano" },
];

// ── Filtros de calorias ───────────────────────────────────────────────────
const CALORIE_RANGES = [
  { value: "todos",  label: "Todos",      min: 0,    max: Infinity },
  { value: "ate1200",label: "Até 1200",   min: 0,    max: 1200 },
  { value: "1200_1800", label: "1200–1800", min: 1201, max: 1800 },
  { value: "1800plus",  label: "1800+",   min: 1801, max: Infinity },
];

// ── Filtros de restrição ──────────────────────────────────────────────────
const RESTRICTIONS = [
  { value: "sem_lactose", label: "Sem Lactose" },
  { value: "sem_gluten",  label: "Sem Glúten" },
  { value: "vegano",      label: "Vegano" },
];

// ── Card de plano ─────────────────────────────────────────────────────────
function PlanCard({ plan, selected, onClick }) {
  const badgeClass = BADGE_STYLES[plan.badgeColor] || BADGE_STYLES.gray;
  return (
    <button
      onClick={onClick}
      className={`w-full text-left bg-white rounded-2xl border-2 p-4 shadow-sm hover:shadow-md transition-all flex flex-col gap-3 ${
        selected
          ? "border-[#2D4F4F] ring-2 ring-[#2D4F4F]/20"
          : "border-gray-100 hover:border-gray-200"
      }`}
    >
      {/* Badge + nome */}
      <div>
        <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border mb-2 ${badgeClass}`}>
          {plan.badgeLabel}
        </span>
        <h3 className="font-semibold text-gray-900 text-sm leading-tight">{plan.name}</h3>
      </div>

      {/* Métricas */}
      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Flame className="w-3 h-3 text-orange-400" />
          <strong className="text-gray-800">{plan.totalCalories}</strong> kcal
        </span>
        <span className="flex items-center gap-1">
          <Utensils className="w-3 h-3 text-gray-400" />
          {plan.mealsPerDay} refeições
        </span>
      </div>

      {/* Tags */}
      {plan.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {plan.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
              {tag}
            </span>
          ))}
          {plan.tags.length > 3 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
              +{plan.tags.length - 3}
            </span>
          )}
        </div>
      )}
    </button>
  );
}

// ── Página principal ──────────────────────────────────────────────────────
export default function MealPlanLibrary({ patientId, onPlanCreated } = {}) {
  const [query, setQuery]           = useState("");
  const [objective, setObjective]   = useState("todos");
  const [calRange, setCalRange]     = useState("todos");
  const [activeRestrictions, setActiveRestrictions] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const { createFromTemplate } = useMealPlans(patientId || null);

  const toggleRestriction = (value) => {
    setActiveRestrictions((prev) =>
      prev.includes(value) ? prev.filter((r) => r !== value) : [...prev, value]
    );
  };

  const filtered = useMemo(() => {
    let list = query.trim() ? searchTemplates(query) : MEAL_PLAN_TEMPLATES;

    if (objective !== "todos") {
      list = list.filter((p) => p.objective === objective);
    }

    if (calRange !== "todos") {
      const range = CALORIE_RANGES.find((r) => r.value === calRange);
      if (range) {
        list = list.filter((p) => p.totalCalories >= range.min && p.totalCalories <= range.max);
      }
    }

    if (activeRestrictions.length > 0) {
      list = list.filter((p) =>
        activeRestrictions.every((r) => p.restrictions.includes(r))
      );
    }

    return list;
  }, [query, objective, calRange, activeRestrictions]);

  const hasActiveFilters =
    objective !== "todos" || calRange !== "todos" || activeRestrictions.length > 0 || query.trim();

  const clearFilters = () => {
    setQuery("");
    setObjective("todos");
    setCalRange("todos");
    setActiveRestrictions([]);
  };

  return (
    <div className="space-y-5">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Planos Alimentares Pré-Prontos</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Selecione um template para usar com seu paciente
          </p>
        </div>
        <button
          className="flex items-center gap-2 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
          style={{ background: PRIMARY }}
        >
          <Plus className="w-4 h-4" />
          Criar plano do zero
        </button>
      </div>

      {/* Layout principal: filtros + grid + preview */}
      <div className={`flex gap-5 ${selectedPlan ? "items-start" : ""}`}>
        {/* Coluna esquerda: busca, filtros, grid */}
        <div className={`flex flex-col gap-4 min-w-0 ${selectedPlan ? "flex-1" : "w-full"}`}>
          {/* Barra de busca */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome, objetivo ou restrição..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 bg-white"
              style={{ "--tw-ring-color": PRIMARY + "33" }}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filtros */}
          <div className="space-y-2">
            {/* Por objetivo */}
            <div className="flex flex-wrap gap-1.5">
              {OBJECTIVES.map((o) => (
                <Pill
                  key={o.value}
                  active={objective === o.value}
                  onClick={() => setObjective(o.value)}
                >
                  {o.label}
                </Pill>
              ))}
            </div>

            {/* Por calorias */}
            <div className="flex flex-wrap gap-1.5">
              <span className="text-xs text-gray-400 flex items-center mr-1">Kcal:</span>
              {CALORIE_RANGES.map((r) => (
                <Pill
                  key={r.value}
                  active={calRange === r.value}
                  onClick={() => setCalRange(r.value)}
                >
                  {r.label}
                </Pill>
              ))}
            </div>

            {/* Por restrição */}
            <div className="flex flex-wrap gap-1.5">
              <span className="text-xs text-gray-400 flex items-center mr-1">Restrição:</span>
              {RESTRICTIONS.map((r) => (
                <Pill
                  key={r.value}
                  active={activeRestrictions.includes(r.value)}
                  onClick={() => toggleRestriction(r.value)}
                >
                  {r.label}
                </Pill>
              ))}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-gray-400 hover:text-gray-700 underline ml-1"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          </div>

          {/* Contador */}
          <p className="text-xs text-gray-400">
            Exibindo <strong className="text-gray-700">{filtered.length}</strong> plano{filtered.length !== 1 ? "s" : ""}
          </p>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Utensils className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium text-gray-500">Nenhum plano encontrado</p>
              <p className="text-sm mt-1">Tente ajustar os filtros ou a busca</p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-3 text-sm underline"
                  style={{ color: SUCCESS }}
                >
                  Limpar filtros
                </button>
              )}
            </div>
          ) : (
            <div className={`grid gap-4 ${
              selectedPlan
                ? "grid-cols-1 sm:grid-cols-2"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            }`}>
              {filtered.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  selected={selectedPlan?.id === plan.id}
                  onClick={() =>
                    setSelectedPlan((prev) => (prev?.id === plan.id ? null : plan))
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* Coluna direita: preview (desktop lado-a-lado, mobile empilhado) */}
        {selectedPlan && (
          <div className="w-full sm:w-[360px] lg:w-[400px] flex-shrink-0">
            <MealPlanPreview
              plan={selectedPlan}
              onClose={() => setSelectedPlan(null)}
              onUseAsBase={(plan) => {
                if (patientId) {
                  const newPlan = createFromTemplate(plan);
                  if (newPlan && onPlanCreated) onPlanCreated(newPlan);
                  setSelectedPlan(null);
                }
              }}
              onDuplicate={(plan) => {
                console.log("Duplicar:", plan.slug);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
