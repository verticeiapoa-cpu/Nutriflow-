import { useState } from "react";
import { db as base44 } from "@/api/localDB";
import { X, Plus, Trash2, ChevronDown, ChevronUp, Layers } from "lucide-react";

const MEAL_TEMPLATES = ["Café da manhã", "Lanche manhã", "Almoço", "Lanche tarde", "Jantar", "Ceia"];

const emptyMeal = (name) => ({ name, time: "", notas: "", foods: [], subgroups: [] });
const emptyFood = () => ({
  name: "", quantity: "", unit: "g", calories: "", protein: "", carbs: "", fat: "",
  alternatives: []
});
const emptySubgroup = (title) => ({ title, foods: [] });

export default function MealPlanBuilder({ patients, plan, onClose, onSave }) {
  const [form, setForm] = useState(plan || {
    patient_id: "", patient_name: "", title: "", start_date: "", end_date: "",
    objective: "", status: "ativo", meals: [], supplements: "", observations: ""
  });
  const [loading, setLoading] = useState(false);
  const [collapsedMeals, setCollapsedMeals] = useState({});

  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handlePatientChange = (id) => {
    const p = patients.find(p => p.id === id);
    setForm(f => ({ ...f, patient_id: id, patient_name: p?.full_name || "" }));
  };

  const toggleMeal = (mi) => setCollapsedMeals(c => ({ ...c, [mi]: !c[mi] }));

  // ── Meal actions ──────────────────────────────────────────────────────────
  const addMeal = (name) => setForm(f => ({ ...f, meals: [...(f.meals || []), emptyMeal(name)] }));
  const removeMeal = (mi) => setForm(f => ({ ...f, meals: f.meals.filter((_, i) => i !== mi) }));
  const setMeal = (mi, key, val) => setForm(f => {
    const meals = [...f.meals];
    meals[mi] = { ...meals[mi], [key]: val };
    return { ...f, meals };
  });

  // ── Food actions (main foods in meal) ─────────────────────────────────────
  const addFood = (mi) => setForm(f => {
    const meals = [...f.meals];
    meals[mi] = { ...meals[mi], foods: [...(meals[mi].foods || []), emptyFood()] };
    return { ...f, meals };
  });
  const removeFood = (mi, fi) => setForm(f => {
    const meals = [...f.meals];
    meals[mi] = { ...meals[mi], foods: meals[mi].foods.filter((_, i) => i !== fi) };
    return { ...f, meals };
  });
  const setFood = (mi, fi, key, val) => setForm(f => {
    const meals = [...f.meals];
    const foods = [...(meals[mi].foods || [])];
    foods[fi] = { ...foods[fi], [key]: val };
    meals[mi] = { ...meals[mi], foods };
    return { ...f, meals };
  });

  // ── Alternative actions ───────────────────────────────────────────────────
  const addAlt = (mi, fi) => setForm(f => {
    const meals = [...f.meals];
    const foods = [...(meals[mi].foods || [])];
    foods[fi] = { ...foods[fi], alternatives: [...(foods[fi].alternatives || []), { name: "", quantity: "", unit: "g" }] };
    meals[mi] = { ...meals[mi], foods };
    return { ...f, meals };
  });
  const removeAlt = (mi, fi, ai) => setForm(f => {
    const meals = [...f.meals];
    const foods = [...meals[mi].foods];
    foods[fi] = { ...foods[fi], alternatives: foods[fi].alternatives.filter((_, i) => i !== ai) };
    meals[mi] = { ...meals[mi], foods };
    return { ...f, meals };
  });
  const setAlt = (mi, fi, ai, key, val) => setForm(f => {
    const meals = [...f.meals];
    const foods = [...meals[mi].foods];
    const alts = [...(foods[fi].alternatives || [])];
    alts[ai] = { ...alts[ai], [key]: val };
    foods[fi] = { ...foods[fi], alternatives: alts };
    meals[mi] = { ...meals[mi], foods };
    return { ...f, meals };
  });

  // ── Subgroup actions ──────────────────────────────────────────────────────
  const addSubgroup = (mi) => setForm(f => {
    const meals = [...f.meals];
    meals[mi] = { ...meals[mi], subgroups: [...(meals[mi].subgroups || []), emptySubgroup("SUBGRUPO")] };
    return { ...f, meals };
  });
  const removeSubgroup = (mi, si) => setForm(f => {
    const meals = [...f.meals];
    meals[mi] = { ...meals[mi], subgroups: meals[mi].subgroups.filter((_, i) => i !== si) };
    return { ...f, meals };
  });
  const setSubgroupTitle = (mi, si, val) => setForm(f => {
    const meals = [...f.meals];
    const sgs = [...(meals[mi].subgroups || [])];
    sgs[si] = { ...sgs[si], title: val };
    meals[mi] = { ...meals[mi], subgroups: sgs };
    return { ...f, meals };
  });
  const addSubgroupFood = (mi, si) => setForm(f => {
    const meals = [...f.meals];
    const sgs = [...meals[mi].subgroups];
    sgs[si] = { ...sgs[si], foods: [...(sgs[si].foods || []), emptyFood()] };
    meals[mi] = { ...meals[mi], subgroups: sgs };
    return { ...f, meals };
  });
  const removeSubgroupFood = (mi, si, fi) => setForm(f => {
    const meals = [...f.meals];
    const sgs = [...meals[mi].subgroups];
    sgs[si] = { ...sgs[si], foods: sgs[si].foods.filter((_, i) => i !== fi) };
    meals[mi] = { ...meals[mi], subgroups: sgs };
    return { ...f, meals };
  });
  const setSubgroupFood = (mi, si, fi, key, val) => setForm(f => {
    const meals = [...f.meals];
    const sgs = [...meals[mi].subgroups];
    const foods = [...sgs[si].foods];
    foods[fi] = { ...foods[fi], [key]: val };
    sgs[si] = { ...sgs[si], foods };
    meals[mi] = { ...meals[mi], subgroups: sgs };
    return { ...f, meals };
  });
  const addSubgroupAlt = (mi, si, fi) => setForm(f => {
    const meals = [...f.meals];
    const sgs = [...meals[mi].subgroups];
    const foods = [...sgs[si].foods];
    foods[fi] = { ...foods[fi], alternatives: [...(foods[fi].alternatives || []), { name: "", quantity: "", unit: "g" }] };
    sgs[si] = { ...sgs[si], foods };
    meals[mi] = { ...meals[mi], subgroups: sgs };
    return { ...f, meals };
  });
  const removeSubgroupAlt = (mi, si, fi, ai) => setForm(f => {
    const meals = [...f.meals];
    const sgs = [...meals[mi].subgroups];
    const foods = [...sgs[si].foods];
    foods[fi] = { ...foods[fi], alternatives: foods[fi].alternatives.filter((_, i) => i !== ai) };
    sgs[si] = { ...sgs[si], foods };
    meals[mi] = { ...meals[mi], subgroups: sgs };
    return { ...f, meals };
  });
  const setSubgroupAlt = (mi, si, fi, ai, key, val) => setForm(f => {
    const meals = [...f.meals];
    const sgs = [...meals[mi].subgroups];
    const foods = [...sgs[si].foods];
    const alts = [...(foods[fi].alternatives || [])];
    alts[ai] = { ...alts[ai], [key]: val };
    foods[fi] = { ...foods[fi], alternatives: alts };
    sgs[si] = { ...sgs[si], foods };
    meals[mi] = { ...meals[mi], subgroups: sgs };
    return { ...f, meals };
  });

  const calcTotals = () => {
    let cal = 0, prot = 0, carbs = 0, fat = 0;
    (form.meals || []).forEach(m => {
      (m.foods || []).forEach(f => {
        cal += parseFloat(f.calories || 0);
        prot += parseFloat(f.protein || 0);
        carbs += parseFloat(f.carbs || 0);
        fat += parseFloat(f.fat || 0);
      });
      (m.subgroups || []).forEach(sg => (sg.foods || []).forEach(f => {
        cal += parseFloat(f.calories || 0);
        prot += parseFloat(f.protein || 0);
        carbs += parseFloat(f.carbs || 0);
        fat += parseFloat(f.fat || 0);
      }));
    });
    return { cal: Math.round(cal), prot: Math.round(prot), carbs: Math.round(carbs), fat: Math.round(fat) };
  };

  const handleSave = async () => {
    if (!form.patient_id || !form.title) return alert("Paciente e título são obrigatórios");
    setLoading(true);
    const totals = calcTotals();
    const data = { ...form, total_calories: totals.cal, total_protein: totals.prot, total_carbs: totals.carbs, total_fat: totals.fat };
    try {
      if (plan?.id) {
        await base44.entities.MealPlan.update(plan.id, data);
      } else {
        await base44.entities.MealPlan.create(data);
      }
      onSave();
    } catch (e) {
      alert("Erro ao salvar: " + e.message);
      setLoading(false);
    }
  };

  const totals = calcTotals();

  const FoodRow = ({ food, onSetFood, onRemove, onAddAlt, onRemoveAlt, onSetAlt, alts }) => (
    <div className="space-y-1">
      <div className="grid grid-cols-12 gap-1.5 items-center">
        <input value={food.name} onChange={e => onSetFood("name", e.target.value)}
          placeholder="Alimento" className="col-span-4 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-500" />
        <input type="number" value={food.quantity} onChange={e => onSetFood("quantity", e.target.value)}
          placeholder="Qtd" className="col-span-2 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-500" />
        <select value={food.unit} onChange={e => onSetFood("unit", e.target.value)}
          className="col-span-1 border border-gray-200 rounded-lg px-1 py-1.5 text-xs focus:outline-none">
          <option>g</option><option>ml</option><option>un</option><option>col</option><option>xíc</option>
        </select>
        <input type="number" value={food.calories} onChange={e => onSetFood("calories", e.target.value)}
          placeholder="kcal" className="col-span-2 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none" />
        <input type="number" value={food.protein} onChange={e => onSetFood("protein", e.target.value)}
          placeholder="prot" className="col-span-1 border border-gray-200 rounded-lg px-1 py-1.5 text-xs focus:outline-none" />
        <button type="button" onClick={onAddAlt} title="Adicionar alternativa"
          className="col-span-1 text-xs text-blue-500 hover:text-blue-700 font-bold flex items-center justify-center">
          ou+
        </button>
        <button type="button" onClick={onRemove} className="text-red-400 hover:text-red-600 col-span-1 flex justify-center">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      {(alts || []).map((alt, ai) => (
        <div key={ai} className="flex items-center gap-1.5 ml-6 pl-3 border-l-2 border-blue-100">
          <span className="text-xs text-blue-400 font-medium w-5 flex-shrink-0">ou</span>
          <input value={alt.name} onChange={e => onSetAlt(ai, "name", e.target.value)}
            placeholder="Alternativa" className="flex-1 border border-blue-100 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-300 bg-blue-50/30" />
          <input type="number" value={alt.quantity} onChange={e => onSetAlt(ai, "quantity", e.target.value)}
            placeholder="Qtd" className="w-14 border border-blue-100 rounded-lg px-2 py-1 text-xs focus:outline-none bg-blue-50/30" />
          <select value={alt.unit} onChange={e => onSetAlt(ai, "unit", e.target.value)}
            className="w-12 border border-blue-100 rounded-lg px-1 py-1 text-xs focus:outline-none bg-blue-50/30">
            <option>g</option><option>ml</option><option>un</option><option>col</option>
          </select>
          <button type="button" onClick={() => onRemoveAlt(ai)} className="text-red-300 hover:text-red-500">
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white z-10">
          <h2 className="font-bold text-gray-900">{plan?.id ? "Editar Plano" : "Novo Plano Alimentar"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5 space-y-5">
          {/* Header */}
          <div className="grid sm:grid-cols-2 gap-4">
            {!(form.patient_id && plan) && (
              <div>
                <label className="block text-sm text-gray-600 mb-1">Paciente *</label>
                <select value={form.patient_id} onChange={e => handlePatientChange(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">Selecionar</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Título do Plano *</label>
              <input value={form.title} onChange={e => setField("title", e.target.value)} placeholder="Ex: Plano Emagrecimento - Janeiro"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Objetivo</label>
              <select value={form.objective} onChange={e => setField("objective", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="">Selecionar</option>
                <option value="emagrecimento">Emagrecimento</option>
                <option value="hipertrofia">Hipertrofia</option>
                <option value="manutenção">Manutenção</option>
                <option value="saúde">Saúde geral</option>
                <option value="tratamento_clinico">Tratamento Clínico</option>
                <option value="performance">Performance Esportiva</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Início</label>
              <input type="date" value={form.start_date} onChange={e => setField("start_date", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Fim</label>
              <input type="date" value={form.end_date} onChange={e => setField("end_date", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>

          {/* Totals bar */}
          <div className="bg-green-50 border border-green-100 rounded-xl p-4 grid grid-cols-4 gap-3">
            {[
              { label: "Calorias", val: `${totals.cal} kcal`, color: "text-green-800" },
              { label: "Proteínas", val: `${totals.prot}g`, color: "text-blue-700" },
              { label: "Carboidratos", val: `${totals.carbs}g`, color: "text-amber-700" },
              { label: "Gorduras", val: `${totals.fat}g`, color: "text-red-700" },
            ].map((t, i) => (
              <div key={i} className="text-center">
                <p className="text-xs text-gray-500">{t.label}</p>
                <p className={`font-bold ${t.color}`}>{t.val}</p>
              </div>
            ))}
          </div>

          {/* Meals */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">Refeições</h3>
              <div className="flex gap-2 flex-wrap justify-end">
                {MEAL_TEMPLATES.map(name => (
                  <button key={name} onClick={() => addMeal(name)}
                    className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-lg hover:bg-green-100 transition-colors">
                    + {name}
                  </button>
                ))}
                <button onClick={() => addMeal("Nova Refeição")}
                  className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors">
                  + Outra
                </button>
              </div>
            </div>

            {(!form.meals || form.meals.length === 0) ? (
              <p className="text-sm text-gray-400 text-center py-6 bg-gray-50 rounded-xl">Adicione refeições usando os botões acima</p>
            ) : (
              <div className="space-y-4">
                {form.meals.map((meal, mi) => (
                  <div key={mi} className="border border-gray-200 rounded-xl overflow-hidden">
                    {/* Meal header */}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 border-b border-gray-100">
                      <input type="time" value={meal.time || ""} onChange={e => setMeal(mi, "time", e.target.value)}
                        className="border border-gray-200 rounded-lg px-2 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-green-500 w-24" />
                      <input value={meal.name} onChange={e => setMeal(mi, "name", e.target.value)}
                        className="flex-1 font-semibold bg-transparent border-0 border-b border-gray-300 pb-0.5 text-sm focus:outline-none focus:border-green-500 min-w-0" />
                      <button onClick={() => toggleMeal(mi)} className="p-1 hover:bg-gray-200 rounded text-gray-400">
                        {collapsedMeals[mi] ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                      </button>
                      <button onClick={() => removeMeal(mi)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {!collapsedMeals[mi] && (
                      <div className="p-4 space-y-3">
                        {/* Column headers */}
                        <div className="grid grid-cols-12 gap-1.5 text-xs text-gray-400 font-medium">
                          <span className="col-span-4">Alimento</span>
                          <span className="col-span-2">Qtd</span>
                          <span className="col-span-1">Un</span>
                          <span className="col-span-2">kcal</span>
                          <span className="col-span-1">prot</span>
                          <span className="col-span-1 text-blue-400">ou+</span>
                          <span className="col-span-1"></span>
                        </div>

                        {/* Main foods */}
                        {(meal.foods || []).map((food, fi) => (
                          <FoodRow
                            key={fi}
                            food={food}
                            alts={food.alternatives}
                            onSetFood={(k, v) => setFood(mi, fi, k, v)}
                            onRemove={() => removeFood(mi, fi)}
                            onAddAlt={() => addAlt(mi, fi)}
                            onRemoveAlt={(ai) => removeAlt(mi, fi, ai)}
                            onSetAlt={(ai, k, v) => setAlt(mi, fi, ai, k, v)}
                          />
                        ))}

                        <button onClick={() => addFood(mi)}
                          className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 font-medium">
                          <Plus className="w-3 h-3" /> Adicionar alimento
                        </button>

                        {/* Subgroups */}
                        {(meal.subgroups || []).map((sg, si) => (
                          <div key={si} className="border border-dashed border-gray-300 rounded-xl p-3 space-y-2 bg-gray-50/50">
                            <div className="flex items-center gap-2">
                              <input value={sg.title} onChange={e => setSubgroupTitle(mi, si, e.target.value)}
                                className="flex-1 text-xs font-bold uppercase tracking-wider text-gray-600 bg-transparent border-0 border-b border-gray-300 pb-0.5 focus:outline-none focus:border-green-500" />
                              <button onClick={() => removeSubgroup(mi, si)} className="text-red-300 hover:text-red-500">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            {(sg.foods || []).map((food, fi) => (
                              <FoodRow
                                key={fi}
                                food={food}
                                alts={food.alternatives}
                                onSetFood={(k, v) => setSubgroupFood(mi, si, fi, k, v)}
                                onRemove={() => removeSubgroupFood(mi, si, fi)}
                                onAddAlt={() => addSubgroupAlt(mi, si, fi)}
                                onRemoveAlt={(ai) => removeSubgroupAlt(mi, si, fi, ai)}
                                onSetAlt={(ai, k, v) => setSubgroupAlt(mi, si, fi, ai, k, v)}
                              />
                            ))}
                            <button onClick={() => addSubgroupFood(mi, si)}
                              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 font-medium">
                              <Plus className="w-3 h-3" /> Adicionar ao subgrupo
                            </button>
                          </div>
                        ))}

                        <div className="flex gap-3 pt-1">
                          <button onClick={() => addSubgroup(mi)}
                            className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 font-medium">
                            <Layers className="w-3 h-3" /> Adicionar subgrupo
                          </button>
                        </div>

                        {/* Meal notes */}
                        <div className="pt-1">
                          <textarea
                            value={meal.notas || ""}
                            onChange={e => setMeal(mi, "notas", e.target.value)}
                            placeholder="Notas clínicas desta refeição (ex: tomar em jejum, substituição permitida...)"
                            rows={2}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-600 focus:outline-none focus:ring-1 focus:ring-green-500 resize-none bg-amber-50/30 placeholder-gray-400"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Suplementação</label>
            <textarea value={form.supplements} onChange={e => setField("supplements", e.target.value)} rows={2}
              placeholder="Ex: Whey protein 30g pós treino, Vitamina D 2000UI ao dia..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Observações ao paciente</label>
            <textarea value={form.observations} onChange={e => setField("observations", e.target.value)} rows={2}
              placeholder="Instruções, dicas, substituições..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
          </div>
        </div>

        <div className="flex gap-3 p-5 border-t sticky bottom-0 bg-white">
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">Cancelar</button>
          <button onClick={handleSave} disabled={loading}
            className="flex-1 bg-green-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-50">
            {loading ? "Salvando..." : "Salvar Plano"}
          </button>
        </div>
      </div>
    </div>
  );
}
