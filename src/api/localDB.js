// src/api/localDB.js
// Implementação localStorage que replica a interface do base44 entities

const S = {
  get: (k) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch(e) {} },
};

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function createEntityAPI(storageKey) {
  const getAll = () => S.get('nf_' + storageKey) || [];
  const saveAll = (arr) => S.set('nf_' + storageKey, arr);

  // sort helper: "-date" means sort by date desc, "date" means asc
  const sortRecords = (arr, sortField) => {
    if (!sortField) return arr;
    const desc = sortField.startsWith('-');
    const field = sortField.replace(/^-/, '');
    return [...arr].sort((a, b) => {
      const av = a[field] ?? '';
      const bv = b[field] ?? '';
      if (av < bv) return desc ? 1 : -1;
      if (av > bv) return desc ? -1 : 1;
      return 0;
    });
  };

  return {
    list: (sort, limit) => {
      let arr = getAll();
      if (sort) arr = sortRecords(arr, sort);
      if (limit) arr = arr.slice(0, limit);
      return Promise.resolve(arr);
    },
    filter: (where, sort, limit) => {
      let arr = getAll().filter(r => Object.entries(where).every(([k, v]) => r[k] === v));
      if (sort) arr = sortRecords(arr, sort);
      if (limit) arr = arr.slice(0, limit);
      return Promise.resolve(arr);
    },
    get: (id) => {
      const r = getAll().find(r => r.id === id);
      return Promise.resolve(r || null);
    },
    create: (data) => {
      const arr = getAll();
      const record = { ...data, id: genId(), created_date: new Date().toISOString() };
      arr.push(record);
      saveAll(arr);
      return Promise.resolve(record);
    },
    update: (id, data) => {
      const arr = getAll();
      const idx = arr.findIndex(r => r.id === id);
      if (idx === -1) return Promise.reject(new Error('Not found'));
      arr[idx] = { ...arr[idx], ...data };
      saveAll(arr);
      return Promise.resolve(arr[idx]);
    },
    delete: (id) => {
      const arr = getAll().filter(r => r.id !== id);
      saveAll(arr);
      return Promise.resolve();
    },
    bulkCreate: (items) => {
      const arr = getAll();
      const records = items.map(data => ({ ...data, id: genId(), created_date: new Date().toISOString() }));
      records.forEach(r => arr.push(r));
      saveAll(arr);
      return Promise.resolve(records);
    },
  };
}

// Seed demo data if empty
function seedDemoData() {
  const patients = S.get('nf_patients');
  if (patients && patients.length > 0) return; // already seeded

  const hoje = new Date();
  const fmt = (d) => d.toISOString().split('T')[0];
  const diasAtras = (n) => { const d = new Date(hoje); d.setDate(d.getDate() - n); return fmt(d); };
  const diasFrente = (n) => { const d = new Date(hoje); d.setDate(d.getDate() + n); return fmt(d); };

  const ps = [
    { id: 'p1', full_name: 'Ana Paula Silva', email: 'ana@email.com', phone: '(51) 99111-1111', birth_date: '1990-03-15', gender: 'feminino', status: 'ativo', objective: 'Emagrecimento', created_date: diasAtras(30) },
    { id: 'p2', full_name: 'Carlos Eduardo Santos', email: 'carlos@email.com', phone: '(51) 99222-2222', birth_date: '1985-07-22', gender: 'masculino', status: 'ativo', objective: 'Ganho de massa', created_date: diasAtras(25) },
    { id: 'p3', full_name: 'Mariana Costa', email: 'mariana@email.com', phone: '(51) 99333-3333', birth_date: '1995-11-08', gender: 'feminino', status: 'ativo', objective: 'Manutenção', created_date: diasAtras(20) },
    { id: 'p4', full_name: 'Roberto Alves', email: 'roberto@email.com', phone: '(51) 99444-4444', birth_date: '1978-01-30', gender: 'masculino', status: 'inativo', objective: 'Controle glicêmico', created_date: diasAtras(60) },
    { id: 'p5', full_name: 'Fernanda Oliveira', email: 'fernanda@email.com', phone: '(51) 99555-5555', birth_date: '2000-06-18', gender: 'feminino', status: 'ativo', objective: 'Reeducação alimentar', created_date: diasAtras(15) },
    { id: 'p6', full_name: 'Diego Martins', email: 'diego@email.com', phone: '(51) 99666-6666', birth_date: '1992-09-05', gender: 'masculino', status: 'ativo', objective: 'Hipertrofia', created_date: diasAtras(10) },
  ];
  S.set('nf_patients', ps);

  const cs = [
    { id: 'c1', patient_id: 'p1', patient_name: 'Ana Paula Silva', date: diasAtras(20), time: '09:00', status: 'realizada', price: 200, paid: true, notes: 'Primeira consulta. Anamnese completa realizada.', created_date: diasAtras(20) },
    { id: 'c2', patient_id: 'p2', patient_name: 'Carlos Eduardo Santos', date: diasAtras(15), time: '10:30', status: 'realizada', price: 200, paid: true, notes: 'Avaliação corporal. IMC 24,5.', created_date: diasAtras(15) },
    { id: 'c3', patient_id: 'p1', patient_name: 'Ana Paula Silva', date: diasAtras(5), time: '14:00', status: 'realizada', price: 200, paid: false, notes: 'Retorno. Perda de 1,2kg.', created_date: diasAtras(5) },
    { id: 'c4', patient_id: 'p3', patient_name: 'Mariana Costa', date: fmt(hoje), time: '11:00', status: 'agendada', price: 200, paid: false, notes: '', created_date: diasAtras(3) },
    { id: 'c5', patient_id: 'p5', patient_name: 'Fernanda Oliveira', date: diasFrente(2), time: '15:30', status: 'agendada', price: 200, paid: false, notes: '', created_date: diasAtras(2) },
  ];
  S.set('nf_consultations', cs);

  const antro = [
    { id: 'a1', patient_id: 'p1', patient_name: 'Ana Paula Silva', date: diasAtras(20), weight: 72.5, height: 165, bmi: 26.6, body_fat_percent: 28, muscle_mass: 45, notes: 'Avaliação inicial', created_date: diasAtras(20) },
    { id: 'a2', patient_id: 'p1', patient_name: 'Ana Paula Silva', date: diasAtras(5), weight: 71.3, height: 165, bmi: 26.2, body_fat_percent: 27.5, muscle_mass: 45.5, notes: 'Retorno - boa evolução', created_date: diasAtras(5) },
    { id: 'a3', patient_id: 'p2', patient_name: 'Carlos Eduardo Santos', date: diasAtras(15), weight: 82, height: 178, bmi: 25.9, body_fat_percent: 18, muscle_mass: 65, notes: 'Foco em hipertrofia', created_date: diasAtras(15) },
    { id: 'a4', patient_id: 'p3', patient_name: 'Mariana Costa', date: diasAtras(10), weight: 58, height: 162, bmi: 22.1, body_fat_percent: 22, muscle_mass: 42, notes: 'Peso dentro do ideal', created_date: diasAtras(10) },
  ];
  S.set('nf_anthropometry', antro);

  const exams = [
    { id: 'e1', patient_id: 'p1', patient_name: 'Ana Paula Silva', date: diasAtras(18), exam_type: 'Hemograma completo', notes: 'Leve anemia ferropriva', created_date: diasAtras(18) },
    { id: 'e2', patient_id: 'p1', patient_name: 'Ana Paula Silva', date: diasAtras(18), exam_type: 'Glicemia de jejum', glucose: 92, notes: 'Normal', created_date: diasAtras(18) },
    { id: 'e3', patient_id: 'p2', patient_name: 'Carlos Eduardo Santos', date: diasAtras(12), exam_type: 'Lipidograma', total_cholesterol: 185, hdl: 55, ldl: 110, triglycerides: 100, notes: 'Dentro do normal', created_date: diasAtras(12) },
  ];
  S.set('nf_lab_exams', exams);

  const planos = [
    { id: 'mp1', patient_id: 'p1', patient_name: 'Ana Paula Silva', title: 'Plano Emagrecimento - Ana Paula', description: 'Plano hipocalórico com déficit de 500kcal', total_calories: 1600, total_protein: 120, total_carbs: 160, total_fat: 45, status: 'ativo', meals: [{ name: 'Café da Manhã', time: '07:00', foods: [{ name: 'Pão integral', quantity: 2, unit: 'fatias' }, { name: 'Ovo mexido', quantity: 1, unit: 'un' }] }, { name: 'Almoço', time: '12:00', foods: [{ name: 'Frango grelhado', quantity: 150, unit: 'g' }, { name: 'Arroz integral', quantity: 4, unit: 'col' }] }, { name: 'Jantar', time: '19:00', foods: [{ name: 'Peixe grelhado', quantity: 150, unit: 'g' }, { name: 'Batata doce', quantity: 4, unit: 'col' }] }], created_date: diasAtras(19) },
  ];
  S.set('nf_meal_plans', planos);

  const templates = [
    {
      id: 'mt1', nome: 'Lembrete de Consulta', tipo: 'whatsapp', canal: 'whatsapp', ativo: true,
      mensagem: 'Olá *|NOME|*! 😊\n\nPassando para lembrar que sua consulta está agendada para *|DATA|* às *|HORA|*.\n\nConfirme sua presença respondendo esta mensagem!\n\nUm abraço,\n*|NUTRICIONISTA|*',
      created_date: new Date().toISOString()
    },
    {
      id: 'mt2', nome: 'Feliz Aniversário', tipo: 'whatsapp', canal: 'whatsapp', ativo: true,
      mensagem: 'Olá *|NOME|*! 🎂🥳\n\nHoje é um dia especial — seu aniversário!\n\nDesejo que este novo ciclo seja cheio de saúde, disposição e conquistas.\n\nConte sempre comigo nessa jornada! 💚\n\n*|NUTRICIONISTA|*',
      created_date: new Date().toISOString()
    },
    {
      id: 'mt3', nome: 'Envio de Plano Alimentar', tipo: 'whatsapp', canal: 'whatsapp', ativo: true,
      mensagem: 'Olá *|NOME|*! 🥗\n\nSeu plano alimentar atualizado está pronto!\n\n📋 *Orientações importantes:*\n• Siga as quantidades indicadas\n• Mantenha os horários das refeições\n• Hidrate-se bem (mínimo 2L de água/dia)\n\nQualquer dúvida, pode me chamar!\n\n*|NUTRICIONISTA|*',
      created_date: new Date().toISOString()
    },
  ];
  S.set('nf_mensagem_templates', templates);

  const orientacoes = [
    { id: 'or1', titulo: 'Hidratação Adequada', categoria: 'Geral', conteudo: 'Beba no mínimo 35ml de água por kg de peso corporal ao dia. Distribua a ingestão ao longo do dia, evitando grandes quantidades de uma só vez. Prefira água filtrada ou mineral. Evite sucos industrializados e refrigerantes.', tags: ['hidratação', 'geral'], created_date: new Date().toISOString() },
    { id: 'or2', titulo: 'Controle do Sódio', categoria: 'Cardiovascular', conteudo: 'Reduza o consumo de sal para no máximo 5g ao dia (1 colher de chá). Evite alimentos ultraprocessados, embutidos e conservas. Tempere os alimentos com ervas aromáticas, limão e azeite. Leia sempre os rótulos dos produtos.', tags: ['sódio', 'cardiovascular', 'hipertensão'], created_date: new Date().toISOString() },
    { id: 'or3', titulo: 'Fracionamento das Refeições', categoria: 'Geral', conteudo: 'Realize de 4 a 6 refeições ao dia em intervalos regulares de 3 a 4 horas. Não fique mais de 4 horas sem se alimentar. O fracionamento ajuda no controle glicêmico, acelera o metabolismo e evita compulsões alimentares.', tags: ['fracionamento', 'metabolismo', 'geral'], created_date: new Date().toISOString() },
    { id: 'or4', titulo: 'Proteínas no Emagrecimento', categoria: 'Emagrecimento', conteudo: 'Priorize fontes de proteína magra em todas as refeições principais: frango sem pele, peixe, ovos, atum, cottage, iogurte grego. A proteína aumenta a saciedade, preserva massa muscular e acelera o metabolismo. Meta: 1,6 a 2,0g de proteína por kg de peso.', tags: ['proteína', 'emagrecimento', 'saciedade'], created_date: new Date().toISOString() },
    { id: 'or5', titulo: 'Pré-Treino Ideal', categoria: 'Performance', conteudo: 'Consuma uma refeição contendo carboidratos complexos e proteínas 1 a 2 horas antes do treino. Exemplos: banana com pasta de amendoim, iogurte com granola, arroz com frango. Evite gorduras em excesso e alimentos muito pesados antes do exercício.', tags: ['pré-treino', 'performance', 'exercício'], created_date: new Date().toISOString() },
  ];
  S.set('nf_orientacoes', orientacoes);
}

// Fake LLM response for AI features (graceful fallback)
const fakeLLM = (prompt) => {
  return Promise.resolve(
    '⚠️ Funcionalidade de IA não disponível no modo offline. Configure uma chave de API para usar este recurso.'
  );
};

export const db = {
  entities: {
    Patient: createEntityAPI('patients'),
    Consultation: createEntityAPI('consultations'),
    Anthropometry: createEntityAPI('anthropometry'),
    LabExam: createEntityAPI('lab_exams'),
    MealPlan: createEntityAPI('meal_plans'),
    DiarioAlimentar: createEntityAPI('diario_alimentar'),
    Alimento: createEntityAPI('alimentos'),
    Prontuario: createEntityAPI('prontuario'),
    Orientacao: createEntityAPI('orientacoes'),
    Atestado: createEntityAPI('atestados'),
    Recibo: createEntityAPI('recibos'),
    PedidoExame: createEntityAPI('pedido_exames'),
    MensagemTemplate: createEntityAPI('mensagem_templates'),
    DataBloqueada: createEntityAPI('datas_bloqueadas'),
    Impresso: createEntityAPI('impressos'),
  },
  integrations: {
    Core: {
      UploadFile: async ({ file }) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve({ file_url: e.target.result });
          reader.readAsDataURL(file);
        });
      },
      InvokeLLM: ({ prompt }) => fakeLLM(prompt),
    },
  },
  agents: {
    listConversations: () => Promise.resolve([]),
    createConversation: (opts) => Promise.resolve({ id: genId(), messages: [], ...opts }),
    getConversation: (id) => Promise.resolve({ id, messages: [] }),
    addMessage: (conv, msg) => {
      const updated = { ...conv, messages: [...(conv.messages || []), { ...msg, id: genId(), created_date: new Date().toISOString() }] };
      return Promise.resolve(updated);
    },
    subscribeToConversation: (id, cb) => {
      // no-op subscription, return unsubscribe function
      return () => {};
    },
  },
  auth: {
    me: () => Promise.resolve({ id: 'local', email: 'nutricionista@nutriflow.local', full_name: 'Nutricionista', role: 'admin' }),
    logout: () => { localStorage.removeItem('nf_auth'); window.location.reload(); },
    redirectToLogin: () => {},
  },
};

// Seed on first import
seedDemoData();

export default db;
