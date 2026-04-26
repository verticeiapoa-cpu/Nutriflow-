import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Save, ArrowLeft, Plus, Trash2, RefreshCw, Clock,
  Utensils, ChevronDown, ChevronUp, AlertCircle, History,
  Edit2, Check, X as XIcon
} from "lucide-react";
import { calcPlanCalories, calcPlanMacros, formatMacroPercent } from "@/utils/mealPlanUtils";
import SubstitutionModal from "@/components/SubstitutionModal";
import RestrictionModal from "@/components/RestrictionModal";
import SubstitutionHistory from "@/components/SubstitutionHistory";

// ── Paleta ─────────────────────────────────────────────────────────────────
const PRIMARY = "#2D4F4F";

// ── localStorage helpers ───────────────────────────────────────────────────
function makeStore(key) {
  const K = "nf_" + key;
  const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const getAll = () => { try { return JSON.parse(localStorage.getItem(K)) || []; } catch { return []; } };
  const saveAll = (a) => { try { localStorage.setItem(K, JSON.stringify(a)); } catch {} };
  return {
    get: (id) => getAll().find((r) => r.id === id) || null,
    update: (id, data) => {
      const arr = getAll();
      const idx = arr.findIndex((r) => r.id === id);
      if (idx === -1) return null;
      arr[idx] = { ...arr[idx], ...data };
      saveAll(arr);
      return arr[idx];
    },
    create: (data) => {
      const arr = getAll();
      const record = { ...data, id: genId(), created_date: new Date().toISOString() };
      arr.push(record);
      saveAll(arr);
      return record;
    },
  };
}

const plansStore = makeStore("patient_meal_plans");
const historyStore = makeStore("substitution_history");

// ── Inline editable text ───────────────────────────────────────────────────
function InlineEdit({ value, onChange, className = "", placeholder = "—", tag: Tag = "span" }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);

  const commit = () => {
    setEditing(false);
    if (draft.trim() !== value) onChange(draft.trim() || value);
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEditing(false); }}
        className={`border-b-2 border-[#2D4F4F] bg-transparent outline-none ${className}`}
      />
    );
  }

  return (
    <Tag
      className={`cursor-pointer group relative inline-flex items-center gap-1 ${className}`}
      onClick={() => { setDraft(value); setEditing(true); }}
    >
      {value || <span className="text-gray-400">{placeholder}</span>}
      <Edit2 className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
    </Tag>
  );
}

// ── Empty food ─────────────────────────────────────────────────────────────
const emptyFood = (mealId) => ({
  id: "f-" + Date.now() + Math.random().toString(36).slice(2, 5),
  name: "",
  quantity: "",
  unit: "g",
  grams: 0,
  calories: 0,
  macros: { cho: 0, ptn: 0, lip: 0 },
  substitutions: [],
  _new: true,
  mealId,
});

const emptyMeal = () => ({
  id: "m-" + Date.now() + Math.random().toString(36).slice(2, 5),
  name: "Nova refeição",
  time: "",
  calories: 0,
  observations: "",
  foods: [],
});

// ── Toast inline ────────────────────────────────────────────────────────────
function Toast({ msg, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm px-5 py-3 rounded-xl shadow-xl flex items-center gap-2">
      <span className="text-green-400">✓</span>{msg}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
export default function MealPlanEditor() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const planId = searchParams.get("planId");

  const [plan, setPlan] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState("plano"); // "plano" | "historico"
  const [collapsedMeals, setCollapsedMeals] = useState({});
  const [subModal, setSubModal] = useState(null);   // { food, mealId }
  const [showRestriction, setShowRestriction] = useState(false);
  const [addFoodMeal, setAddFoodMeal] = useState(null); // mealId | null
  const [newFoodDraft, setNewFoodDraft] = useState(null);
  const [toast, setToast] = useState(null);
  const [saved, setSaved] = useState(false);
  const debounceRef = useRef(null);

  // ── Load ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!planId) { setNotFound(true); return; }
    const p = plansStore.get(planId);
    if (!p) { setNotFound(true); return; }
    setPlan(p);
  }, [planId]);

  // ── Auto-save with 1s debounce ────────────────────────────────────────────
  const autoSave = useCallback(
    (updatedPlan) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        plansStore.update(updatedPlan.id, updatedPlan);
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
      }, 1000);
    },
    []
  );

  const update = useCallback(
    (changes) => {
      setPlan((p) => {
        const next = { ...p, ...changes };
        autoSave(next);
        return next;
      });
    },
    [autoSave]
  );

  // ── Recalculate totals ────────────────────────────────────────────────────
  const activeMeals = plan?.meals?.map((m) => ({
    ...m,
    foods: m.foods.filter((f) => !f.removed),
  })) || [];

  const totalCals = calcPlanCalories(activeMeals);
  const totalMacros = calcPlanMacros(activeMeals);
  const macroPct = formatMacroPercent(totalMacros, totalCals);

  // ── Meal helpers ──────────────────────────────────────────────────────────
  const updateMeal = (mealId, changes) => {
    update({
      meals: plan.meals.map((m) => (m.id === mealId ? { ...m, ...changes } : m)),
    });
  };

  const addMeal = () => {
    update({ meals: [...(plan.meals || []), emptyMeal()] });
  };

  const removeMeal = (mealId) => {
    update({
      meals: plan.meals.map((m) => (m.id === mealId ? { ...m, removed: true } : m)),
    });
  };

  const toggleCollapse = (mealId) =>
    setCollapsedMeals((c) => ({ ...c, [mealId]: !c[mealId] }));

  // ── Food helpers ──────────────────────────────────────────────────────────
  const updateFood = (mealId, foodId, changes) => {
    update({
      meals: plan.meals.map((m) => {
        if (m.id !== mealId) return m;
        return {
          ...m,
          foods: m.foods.map((f) => (f.id === foodId ? { ...f, ...changes } : f)),
        };
      }),
    });
  };

  const removeFood = (mealId, foodId) => {
    update({
      meals: plan.meals.map((m) => {
        if (m.id !== mealId) return m;
        return {
          ...m,
          foods: m.foods.map((f) => (f.id === foodId ? { ...f, removed: true } : f)),
        };
      }),
    });
  };

  const commitNewFood = (mealId) => {
    if (!newFoodDraft || !newFoodDraft.name.trim()) {
      setAddFoodMeal(null);
      setNewFoodDraft(null);
      return;
    }
    const food = {
      ...emptyFood(mealId),
      ...newFoodDraft,
      calories: parseFloat(newFoodDraft.calories) || 0,
      grams: parseFloat(newFoodDraft.grams) || 0,
      macros: {
        cho: parseFloat(newFoodDraft.cho) || 0,
        ptn: parseFloat(newFoodDraft.ptn) || 0,
        lip: parseFloat(newFoodDraft.lip) || 0,
      },
      _new: false,
    };
    update({
      meals: plan.meals.map((m) =>
        m.id === mealId ? { ...m, foods: [...m.foods, food] } : m
      ),
    });
    setAddFoodMeal(null);
    setNewFoodDraft(null);
  };

  // ── Apply substitution ────────────────────────────────────────────────────
  const handleApplySubstitution = (mealId, foodId, sub) => {
    const meal = plan.meals.find((m) => m.id === mealId);
    const food = meal?.foods.find((f) => f.id === foodId);
    if (!food) return;

    const histEntry = {
      planId,
      mealId,
      foodId,
      mealName: meal.name,
      originalFoodName: food.name,
      newFoodName: sub.name,
      substitutionId: sub.id,
      calDiff: (sub.calories || 0) - (food.calories || 0),
      note: sub.note || "",
      recordedAt: new Date().toISOString(),
    };
    historyStore.create(histEntry);

    update({
      meals: plan.meals.map((m) => {
        if (m.id !== mealId) return m;
        return {
          ...m,
          foods: m.foods.map((f) => {
            if (f.id !== foodId) return f;
            return {
              ...f,
              name: sub.name,
              quantity: sub.quantity,
              unit: sub.unit,
              grams: sub.grams,
              calories: sub.calories,
              macros: sub.macros,
              _substitutedFrom: food.name,
              _originalCalories: food.calories,
              _originalMacros: food.macros,
              _appliedSubstitutionId: sub.id,
            };
          }),
        };
      }),
    });
    setSubModal(null);
    showToast("Substituição aplicada");
  };

  // ── Undo substitution ─────────────────────────────────────────────────────
  const handleUndo = (entry) => {
    update({
      meals: plan.meals.map((m) => {
        if (m.id !== entry.mealId) return m;
        return {
          ...m,
          foods: m.foods.map((f) => {
            if (f.id !== entry.foodId) return f;
            if (!f._substitutedFrom) return f;
            return {
              ...f,
              name: f._substitutedFrom,
              calories: f._originalCalories ?? f.calories,
              macros: f._originalMacros ?? f.macros,
              _substitutedFrom: undefined,
              _originalCalories: undefined,
              _originalMacros: undefined,
              _appliedSubstitutionId: undefined,
            };
          }),
        };
      }),
    });
    showToast("Substituição desfeita");
  };

  // ── Apply restriction ─────────────────────────────────────────────────────
  const handleApplyRestriction = (restriction, result) => {
    update({
      meals: result.updatedPlan.meals,
      restrictions: result.updatedPlan.restrictions,
    });
    showToast(`Restrição "${restriction}" aplicada — ${result.substituted} substituição(ões)`);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  // ── Render guards ─────────────────────────────────────────────────────────
  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <AlertCircle className="w-12 h-12 text-gray-300" />
        <p className="text-gray-500 font-medium">Plano não encontrado</p>
        <button onClick={() => navigate(-1)} className="text-sm underline text-gray-400 hover:text-gray-600">
          Voltar
        </button>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-10 h-10 border-4 border-[#2D4F4F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const visibleMeals = plan.meals?.filter((m) => !m.removed) || [];

  return (
    <div className="space-y-5">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 mt-0.5 flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <InlineEdit
              value={plan.name}
              onChange={(v) => update({ name: v })}
              className="text-xl font-bold text-gray-900"
              placeholder="Nome do plano"
              tag="h1"
            />
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium capitalize">
                {plan.status}
              </span>
              <span className="text-xs text-gray-400">v{plan.version || 1}</span>
              {saved && (
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Salvo
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2 ml-9 sm:ml-0">
          <button
            onClick={() => setShowRestriction(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Aplicar restrição
          </button>
        </div>
      </div>

      {/* Totais do plano */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total kcal/dia", value: totalCals, unit: "kcal", color: "text-green-700", bg: "bg-green-50" },
          { label: `Proteína (${macroPct.ptn}%)`, value: totalMacros.ptn, unit: "g", color: "text-blue-700", bg: "bg-blue-50" },
          { label: `Carboidrato (${macroPct.cho}%)`, value: totalMacros.cho, unit: "g", color: "text-amber-700", bg: "bg-amber-50" },
          { label: `Gordura (${macroPct.lip}%)`, value: totalMacros.lip, unit: "g", color: "text-orange-700", bg: "bg-orange-50" },
        ].map((m) => (
          <div key={m.label} className={`${m.bg} rounded-xl p-3 text-center`}>
            <p className={`text-xl font-bold ${m.color}`}>{m.value}<span className="text-sm ml-0.5">{m.unit}</span></p>
            <p className={`text-xs mt-0.5 ${m.color} opacity-80`}>{m.label}</p>
          </div>
        ))}
      </div>

      {/* Meta campos */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Data início</label>
          <input
            type="date"
            value={plan.startDate || ""}
            onChange={(e) => update({ startDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D4F4F]/30"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Data fim</label>
          <input
            type="date"
            value={plan.endDate || ""}
            onChange={(e) => update({ endDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D4F4F]/30"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Notas clínicas</label>
          <textarea
            rows={3}
            value={plan.clinicalNotes || ""}
            onChange={(e) => update({ clinicalNotes: e.target.value })}
            placeholder="Observações clínicas para este paciente..."
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D4F4F]/30 resize-none"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Instruções ao paciente</label>
          <textarea
            rows={3}
            value={plan.patientInstructions || ""}
            onChange={(e) => update({ patientInstructions: e.target.value })}
            placeholder="Instruções que o paciente deve seguir..."
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D4F4F]/30 resize-none"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1">
        {[
          { key: "plano", label: "Plano Alimentar", icon: Utensils },
          { key: "historico", label: "Histórico", icon: History },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeTab === key ? "text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
            style={activeTab === key ? { background: PRIMARY } : {}}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* ── TAB: Plano ── */}
      {activeTab === "plano" && (
        <div className="space-y-4">
          {visibleMeals.map((meal) => {
            const collapsed = collapsedMeals[meal.id];
            const mealFoods = meal.foods.filter((f) => !f.removed);
            const mealCals = mealFoods.reduce((s, f) => s + (f.calories || 0), 0);

            return (
              <div key={meal.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Meal header */}
                <div className="flex items-center gap-3 p-4 border-b border-gray-50">
                  <button onClick={() => toggleCollapse(meal.id)} className="text-gray-400 hover:text-gray-600">
                    {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                  </button>
                  <div className="flex items-center gap-2 flex-1 min-w-0 flex-wrap">
                    <input
                      type="time"
                      value={meal.time || ""}
                      onChange={(e) => updateMeal(meal.id, { time: e.target.value })}
                      className="text-xs text-gray-400 bg-transparent border-0 outline-none w-[70px] cursor-pointer"
                    />
                    <InlineEdit
                      value={meal.name}
                      onChange={(v) => updateMeal(meal.id, { name: v })}
                      className="font-semibold text-gray-800 text-sm"
                      placeholder="Nome da refeição"
                    />
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                      {mealCals} kcal
                    </span>
                    <button
                      onClick={() => removeMeal(meal.id)}
                      className="p-1 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                      title="Remover refeição"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Meal body */}
                {!collapsed && (
                  <div className="p-4 space-y-2">
                    {mealFoods.length === 0 && (
                      <p className="text-xs text-gray-400 text-center py-2">Nenhum alimento nesta refeição</p>
                    )}

                    {mealFoods.map((food) => (
                      <div
                        key={food.id}
                        className={`flex items-center gap-2 group py-2 px-3 rounded-xl hover:bg-gray-50 transition-colors ${
                          food._substitutedFrom ? "border-l-2 border-[#1D9E75]" : ""
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-sm text-gray-800 font-medium">{food.name}</span>
                            {food._substitutedFrom && (
                              <span className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded-full border border-green-200">
                                substituído
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-400">
                            {food.quantity} {food.unit} · {food.grams}g ·
                            <span className="ml-1 text-gray-500">
                              CHO {food.macros?.cho ?? 0}g · PTN {food.macros?.ptn ?? 0}g · LIP {food.macros?.lip ?? 0}g
                            </span>
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-gray-600 flex-shrink-0">{food.calories} kcal</span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <button
                            onClick={() => setSubModal({ food, mealId: meal.id })}
                            className="text-[10px] px-2 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium transition-colors"
                          >
                            Substituir
                          </button>
                          <button
                            onClick={() => removeFood(meal.id, food.id)}
                            className="p-1 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                            title="Remover alimento"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* New food inline row */}
                    {addFoodMeal === meal.id && newFoodDraft !== null && (
                      <div className="border border-dashed border-[#2D4F4F]/30 rounded-xl p-3 bg-[#2D4F4F]/5 space-y-2">
                        <input
                          type="text"
                          placeholder="Nome do alimento *"
                          value={newFoodDraft.name || ""}
                          onChange={(e) => setNewFoodDraft((p) => ({ ...p, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D4F4F]/30"
                          autoFocus
                        />
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                          {[
                            ["grams", "Gramas"], ["calories", "Kcal"],
                            ["cho", "CHO (g)"], ["ptn", "PTN (g)"], ["lip", "LIP (g)"],
                          ].map(([k, lbl]) => (
                            <input
                              key={k}
                              type="number"
                              min="0"
                              placeholder={lbl}
                              value={newFoodDraft[k] || ""}
                              onChange={(e) => setNewFoodDraft((p) => ({ ...p, [k]: e.target.value }))}
                              className="px-2 py-1.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2D4F4F]/30"
                            />
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => commitNewFood(meal.id)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium text-white transition-colors"
                            style={{ background: PRIMARY }}
                          >
                            <Check className="w-3 h-3" /> Adicionar
                          </button>
                          <button
                            onClick={() => { setAddFoodMeal(null); setNewFoodDraft(null); }}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200"
                          >
                            <XIcon className="w-3 h-3" /> Cancelar
                          </button>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        setAddFoodMeal(meal.id);
                        setNewFoodDraft({});
                      }}
                      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#2D4F4F] transition-colors py-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Adicionar alimento
                    </button>

                    {meal.observations && (
                      <p className="text-xs text-amber-600 italic pl-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        {meal.observations}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Adicionar refeição */}
          <button
            onClick={addMeal}
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm text-gray-500 hover:border-[#2D4F4F]/40 hover:text-[#2D4F4F] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Adicionar refeição
          </button>
        </div>
      )}

      {/* ── TAB: Histórico ── */}
      {activeTab === "historico" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <SubstitutionHistory planId={planId} onUndo={handleUndo} />
        </div>
      )}

      {/* Modais */}
      {subModal && (
        <SubstitutionModal
          food={subModal.food}
          mealId={subModal.mealId}
          planId={planId}
          onApply={handleApplySubstitution}
          onClose={() => setSubModal(null)}
        />
      )}

      {showRestriction && (
        <RestrictionModal
          plan={plan}
          onConfirm={handleApplyRestriction}
          onClose={() => setShowRestriction(false)}
        />
      )}

      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
