import { useState, useCallback } from 'react';
import { buildPlanFromTemplate, validatePlanName } from '@/utils/mealPlanUtils';

function makeStore(key) {
  const K = 'nf_' + key;
  const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const getAll = () => { try { return JSON.parse(localStorage.getItem(K)) || []; } catch { return []; } };
  const saveAll = (arr) => { try { localStorage.setItem(K, JSON.stringify(arr)); } catch { } };
  return {
    list: () => getAll(),
    filter: (fn) => getAll().filter(fn),
    get: (id) => getAll().find((r) => r.id === id) || null,
    create: (data) => {
      const arr = getAll();
      const record = { ...data, id: genId(), created_date: new Date().toISOString() };
      arr.push(record);
      saveAll(arr);
      return record;
    },
    update: (id, data) => {
      const arr = getAll();
      const idx = arr.findIndex((r) => r.id === id);
      if (idx === -1) return null;
      arr[idx] = { ...arr[idx], ...data };
      saveAll(arr);
      return arr[idx];
    },
  };
}

const plansStore = makeStore('patient_meal_plans');
const favoritesStore = makeStore('favorite_templates');
const historyStore = makeStore('substitution_history');

export function useMealPlans(patientId) {
  const [error, setError] = useState(null);

  const getPatientPlans = useCallback(() => {
    if (!patientId) return [];
    return plansStore.filter((p) => p.patientId === patientId && !p.deletedAt);
  }, [patientId]);

  const getActivePlan = useCallback(() => {
    if (!patientId) return null;
    const plans = plansStore.filter(
      (p) => p.patientId === patientId && p.status === 'ativo' && !p.deletedAt
    );
    return plans[0] || null;
  }, [patientId]);

  const createFromTemplate = useCallback(
    (template, nutritionistNotes = '') => {
      setError(null);
      if (!patientId) {
        setError('ID do paciente é obrigatório.');
        return null;
      }
      try {
        const planData = buildPlanFromTemplate(template, patientId, nutritionistNotes);
        return plansStore.create(planData);
      } catch {
        setError('Erro ao criar plano alimentar.');
        return null;
      }
    },
    [patientId]
  );

  const updatePlan = useCallback((planId, changes) => {
    setError(null);
    if (changes.name !== undefined) {
      const nameError = validatePlanName(changes.name);
      if (nameError) { setError(nameError); return null; }
    }
    try {
      return plansStore.update(planId, changes);
    } catch {
      setError('Erro ao atualizar plano.');
      return null;
    }
  }, []);

  const archivePlan = useCallback((planId) => {
    setError(null);
    try {
      return plansStore.update(planId, { status: 'arquivado', archivedAt: new Date().toISOString() });
    } catch {
      setError('Erro ao arquivar plano.');
      return null;
    }
  }, []);

  const softDeletePlan = useCallback((planId) => {
    setError(null);
    try {
      return plansStore.update(planId, { deletedAt: new Date().toISOString() });
    } catch {
      setError('Erro ao excluir plano.');
      return null;
    }
  }, []);

  const newVersionFromPlan = useCallback((existingPlan) => {
    setError(null);
    try {
      plansStore.update(existingPlan.id, {
        status: 'arquivado',
        archivedAt: new Date().toISOString(),
      });
      const { id: _id, created_date: _c, ...rest } = existingPlan;
      return plansStore.create({
        ...rest,
        status: 'ativo',
        version: (existingPlan.version || 1) + 1,
        previousVersionId: existingPlan.id,
      });
    } catch {
      setError('Erro ao criar nova versão do plano.');
      return null;
    }
  }, []);

  const toggleFavoriteTemplate = useCallback((templateId) => {
    setError(null);
    try {
      const existing = favoritesStore.filter((f) => f.templateId === templateId);
      if (existing.length) {
        const next = !existing[0].active;
        favoritesStore.update(existing[0].id, { active: next });
        return next;
      }
      favoritesStore.create({ templateId, active: true });
      return true;
    } catch {
      setError('Erro ao atualizar favorito.');
      return false;
    }
  }, []);

  const isFavoriteTemplate = useCallback((templateId) => {
    return favoritesStore.filter((f) => f.templateId === templateId && f.active).length > 0;
  }, []);

  const recordSubstitution = useCallback(
    (planId, mealId, foodId, substitutionId, note = '') => {
      setError(null);
      try {
        return historyStore.create({
          patientId,
          planId,
          mealId,
          foodId,
          substitutionId,
          note,
          recordedAt: new Date().toISOString(),
        });
      } catch {
        setError('Erro ao registrar substituição.');
        return null;
      }
    },
    [patientId]
  );

  const getSubstitutionHistory = useCallback((planId) => {
    if (!planId) return [];
    return historyStore.filter((h) => h.planId === planId);
  }, []);

  return {
    error,
    getPatientPlans,
    getActivePlan,
    createFromTemplate,
    updatePlan,
    archivePlan,
    softDeletePlan,
    newVersionFromPlan,
    toggleFavoriteTemplate,
    isFavoriteTemplate,
    recordSubstitution,
    getSubstitutionHistory,
  };
}
