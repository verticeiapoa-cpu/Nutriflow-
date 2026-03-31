// NutriFlow — localStorage helpers para módulos clínicos
const S = {
  get: (k) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch(e) { console.error('Storage error:', e); } },
  del: (k) => localStorage.removeItem(k),
};

// ── Módulo 1 — Anamnese ──────────────────────────────────────────────────────
export const getAnamnese = (pid) => S.get('nf_anamnese_' + pid) || null;
export const saveAnamnese = (pid, d) => S.set('nf_anamnese_' + pid, d);

// ── Módulo 2 — Antropometria completa ────────────────────────────────────────
export const getAntropometria = (pid) => S.get('nf_antro_' + pid) || [];
export const saveAntropometria = (pid, arr) => S.set('nf_antro_' + pid, arr);

// ── Módulo 3 — Recordatório 24h ──────────────────────────────────────────────
export const getRecordatorios = (pid) => S.get('nf_rec_' + pid) || [];
export const saveRecordatorios = (pid, arr) => S.set('nf_rec_' + pid, arr);

// ── Módulo 7 — Foto do paciente ──────────────────────────────────────────────
export const getFotoPaciente = (pid) => S.get('nf_foto_' + pid) || null;
export const saveFotoPaciente = (pid, base64) => S.set('nf_foto_' + pid, base64);

// ── Módulo 8 — Metas nutricionais ────────────────────────────────────────────
export const getMetas = (pid) => S.get('nf_metas_' + pid) || {
  kcal: 2000, ptn_g: 50, cho_g: 275, lip_g: 55, fibra_g: 25,
  agua_ml: 2000, sodio_mg: 2300, calcio_mg: 1000,
  ferro_mg: 18, vitD_mcg: 15, vitB12_mcg: 2.4, base: ''
};
export const saveMetas = (pid, m) => S.set('nf_metas_' + pid, m);

// ── Módulo 6 — Configurações do consultório ──────────────────────────────────
export const getConfig = () => S.get('nf_config') || {};
export const saveConfig = (cfg) => S.set('nf_config', cfg);

// ── Módulo 11 — Diário do portal ─────────────────────────────────────────────
export const getDiarioPortal = (pid) => S.get('nf_diario_portal_' + pid) || [];
export const saveDiarioPortal = (pid, arr) => S.set('nf_diario_portal_' + pid, arr);
export const getMetasDiarias = (pid) => S.get('nf_metas_diarias_' + pid) || { agua: 0, atividade: false, humor: 3, data: '' };
export const saveMetasDiarias = (pid, d) => S.set('nf_metas_diarias_' + pid, d);

// ── Utilitários ──────────────────────────────────────────────────────────────
export const fmtData = (s) => {
  if (!s) return '—';
  const [y, m, d] = s.split('-');
  return `${d}/${m}/${y}`;
};

export const calcIMC = (peso, alt) => {
  if (!peso || !alt) return null;
  return +(peso / Math.pow(alt / 100, 2)).toFixed(1);
};

export const labelIMC = (imc) => {
  if (!imc) return '—';
  if (imc < 18.5) return 'Baixo peso';
  if (imc < 25) return 'Eutrófico';
  if (imc < 30) return 'Sobrepeso';
  if (imc < 35) return 'Obesidade I';
  if (imc < 40) return 'Obesidade II';
  return 'Obesidade III';
};

export const hexToRGB = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
};

export const today = () => new Date().toISOString().split('T')[0];
