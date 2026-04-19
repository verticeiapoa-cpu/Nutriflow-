// src/api/supabaseDB.js
// Adapter que expõe a MESMA interface do localDB.js,
// mas persiste em Supabase. Os componentes não precisam mudar —
// apenas troca-se o import em db.js conforme a variável de ambiente.
//
// Tabelas esperadas (veja supabase/schema.sql):
//   patients, consultations, anthropometry, lab_exams, meal_plans,
//   diario_alimentar, alimentos, prontuario, orientacoes, atestados,
//   recibos, pedido_exames, mensagem_templates, datas_bloqueadas, impressos

import { supabase } from './supabaseClient';

/* ── Mapa de entidade → nome da tabela Supabase ───────── */
const TABLES = {
  Patient:            'patients',
  Consultation:       'consultations',
  Anthropometry:      'anthropometry',
  LabExam:            'lab_exams',
  MealPlan:           'meal_plans',
  DiarioAlimentar:    'diario_alimentar',
  Alimento:           'alimentos',
  Prontuario:         'prontuario',
  Orientacao:         'orientacoes',
  Atestado:           'atestados',
  Recibo:             'recibos',
  PedidoExame:        'pedido_exames',
  MensagemTemplate:   'mensagem_templates',
  DataBloqueada:      'datas_bloqueadas',
  Impresso:           'impressos',
};

function createEntityAPI(table) {
  const applySort = (query, sort) => {
    if (!sort) return query;
    const desc = sort.startsWith('-');
    const field = sort.replace(/^-/, '');
    return query.order(field, { ascending: !desc });
  };

  return {
    list: async (sort, limit) => {
      let q = supabase.from(table).select('*');
      q = applySort(q, sort);
      if (limit) q = q.limit(limit);
      const { data, error } = await q;
      if (error) { console.error(`[${table}] list`, error); return []; }
      return data || [];
    },

    filter: async (where, sort, limit) => {
      let q = supabase.from(table).select('*');
      Object.entries(where || {}).forEach(([k, v]) => { q = q.eq(k, v); });
      q = applySort(q, sort);
      if (limit) q = q.limit(limit);
      const { data, error } = await q;
      if (error) { console.error(`[${table}] filter`, error); return []; }
      return data || [];
    },

    get: async (id) => {
      const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
      if (error) { console.error(`[${table}] get`, error); return null; }
      return data;
    },

    create: async (payload) => {
      const record = { ...payload, created_date: payload.created_date || new Date().toISOString() };
      const { data, error } = await supabase.from(table).insert(record).select().single();
      if (error) { console.error(`[${table}] create`, error); throw error; }
      return data;
    },

    update: async (id, patch) => {
      const { data, error } = await supabase.from(table).update(patch).eq('id', id).select().single();
      if (error) { console.error(`[${table}] update`, error); throw error; }
      return data;
    },

    delete: async (id) => {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) { console.error(`[${table}] delete`, error); throw error; }
    },

    bulkCreate: async (items) => {
      const records = items.map(p => ({ ...p, created_date: p.created_date || new Date().toISOString() }));
      const { data, error } = await supabase.from(table).insert(records).select();
      if (error) { console.error(`[${table}] bulkCreate`, error); throw error; }
      return data || [];
    },
  };
}

/* ── Integrações ───────────────────────────────────────── */
const integrations = {
  Core: {
    // Upload de arquivo — por enquanto lê como data URL (igual ao local).
    // Quando quiser storage de verdade, troque para supabase.storage.from('bucket').upload(...).
    UploadFile: async ({ file }) => new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve({ file_url: e.target.result });
      reader.readAsDataURL(file);
    }),
    InvokeLLM: async () =>
      '⚠️ IA não disponível. Configure a chave OpenAI/Gemini para usar este recurso.',
  },
};

/* ── Auth via Supabase Auth ────────────────────────────── */
const auth = {
  me: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || 'Nutricionista',
      role: user.user_metadata?.role || 'admin',
    };
  },
  logout: async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('nf_auth');
    window.location.reload();
  },
  redirectToLogin: () => {},
};

const agents = {
  listConversations:       () => Promise.resolve([]),
  createConversation:      (opts) => Promise.resolve({ id: crypto.randomUUID(), messages: [], ...opts }),
  getConversation:         (id) => Promise.resolve({ id, messages: [] }),
  addMessage:              (conv, msg) => Promise.resolve({ ...conv, messages: [...(conv.messages||[]), { ...msg, id: crypto.randomUUID(), created_date: new Date().toISOString() }] }),
  subscribeToConversation: () => () => {},
};

/* ── Exporta a mesma forma de objeto que o localDB ─────── */
export const db = {
  entities: Object.fromEntries(
    Object.entries(TABLES).map(([name, table]) => [name, createEntityAPI(table)])
  ),
  integrations,
  auth,
  agents,
};

export default db;
