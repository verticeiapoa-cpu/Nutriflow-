import { MEAL_PLAN_TEMPLATES } from '@/data/mealPlanTemplates';

export function calcMealCalories(meal) {
  return meal.foods.reduce((sum, f) => sum + (f.calories || 0), 0);
}

export function calcPlanMacros(meals) {
  return meals.reduce(
    (acc, meal) => {
      meal.foods.forEach((f) => {
        acc.cho += f.macros?.cho || 0;
        acc.ptn += f.macros?.ptn || 0;
        acc.lip += f.macros?.lip || 0;
      });
      return acc;
    },
    { cho: 0, ptn: 0, lip: 0 }
  );
}

export function calcPlanCalories(meals) {
  return meals.reduce((sum, meal) => sum + calcMealCalories(meal), 0);
}

export function filterTemplatesByRestriction(restrictions = []) {
  if (!restrictions.length) return MEAL_PLAN_TEMPLATES;
  return MEAL_PLAN_TEMPLATES.filter((t) =>
    restrictions.every((r) => t.restrictions.includes(r))
  );
}

export function filterTemplatesByObjective(objective) {
  if (!objective) return MEAL_PLAN_TEMPLATES;
  return MEAL_PLAN_TEMPLATES.filter((t) => t.objective === objective);
}

export function applySubstitution(meal, foodId, substitutionId) {
  return {
    ...meal,
    foods: meal.foods.map((food) => {
      if (food.id !== foodId) return food;
      const sub = food.substitutions?.find((s) => s.id === substitutionId);
      if (!sub) return food;
      return {
        ...food,
        name: sub.name,
        quantity: sub.quantity,
        unit: sub.unit,
        grams: sub.grams,
        calories: sub.calories,
        macros: sub.macros,
        _substitutedFrom: food.name,
        _substitutionId: substitutionId,
      };
    }),
  };
}

export function validatePlanName(name) {
  if (!name || typeof name !== 'string') return 'Nome é obrigatório.';
  const trimmed = name.trim();
  if (trimmed.length < 3) return 'Nome deve ter pelo menos 3 caracteres.';
  if (trimmed.length > 100) return 'Nome deve ter no máximo 100 caracteres.';
  return null;
}

export function buildPlanFromTemplate(template, patientId, nutritionistNotes = '') {
  return {
    patientId,
    templateId: template.id,
    templateSlug: template.slug,
    name: template.name,
    objective: template.objective,
    totalCalories: template.totalCalories,
    macros: { ...template.macros },
    mealsPerDay: template.mealsPerDay,
    restrictions: [...template.restrictions],
    tags: [...template.tags],
    meals: template.meals.map((m) => ({
      ...m,
      foods: m.foods.map((f) => ({
        ...f,
        substitutions: f.substitutions ? [...f.substitutions] : [],
      })),
    })),
    clinicalNotes: template.clinicalNotes,
    contraindications: template.contraindications,
    patientInstructions: template.patientInstructions,
    nutritionistNotes,
    status: 'ativo',
    version: 1,
  };
}

export function formatMacroPercent(macros, totalCalories) {
  if (!totalCalories) return { cho: 0, ptn: 0, lip: 0 };
  const choCal = (macros.cho || 0) * 4;
  const ptnCal = (macros.ptn || 0) * 4;
  const lipCal = (macros.lip || 0) * 9;
  return {
    cho: Math.round((choCal / totalCalories) * 100),
    ptn: Math.round((ptnCal / totalCalories) * 100),
    lip: Math.round((lipCal / totalCalories) * 100),
  };
}

export function searchTemplates(query) {
  if (!query || !query.trim()) return MEAL_PLAN_TEMPLATES;
  const q = query.trim().toLowerCase();
  return MEAL_PLAN_TEMPLATES.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
      t.objective.toLowerCase().includes(q) ||
      t.restrictions.some((r) => r.toLowerCase().includes(q))
  );
}
