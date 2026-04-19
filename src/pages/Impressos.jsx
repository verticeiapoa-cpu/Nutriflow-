import { useState } from "react";
import { FileText, Printer, X, ClipboardList, Activity, BarChart2, BookOpen, Calendar, CheckSquare } from "lucide-react";

const FORMS = [
  {
    id: "recordatorio",
    icon: <ClipboardList className="w-6 h-6 text-green-600" />,
    title: "Recordatório 24h",
    description: "Formulário de registro alimentar das últimas 24 horas, organizado por refeições do dia.",
    category: "Avaliação",
    badgeClass: "badge-green",
  },
  {
    id: "anamnese",
    icon: <FileText className="w-6 h-6 text-blue-600" />,
    title: "Anamnese Nutricional",
    description: "Ficha completa de primeira consulta com histórico de saúde, hábitos e queixas.",
    category: "Consulta",
    badgeClass: "badge-blue",
  },
  {
    id: "antropometria",
    icon: <BarChart2 className="w-6 h-6 text-purple-600" />,
    title: "Avaliação Antropométrica",
    description: "Registro de medidas corporais: peso, altura, circunferências e dobras cutâneas.",
    category: "Avaliação",
    badgeClass: "badge-purple",
  },
  {
    id: "rastreamento",
    icon: <Activity className="w-6 h-6 text-amber-600" />,
    title: "Rastreamento Metabólico",
    description: "Questionário com 30 sintomas agrupados por sistema para triagem funcional.",
    category: "Triagem",
    badgeClass: "badge-amber",
  },
  {
    id: "diario3dias",
    icon: <Calendar className="w-6 h-6 text-teal-600" />,
    title: "Diário Alimentar 3 dias",
    description: "Registro detalhado de alimentação em 3 dias com café, almoço, jantar e lanches.",
    category: "Registro",
    badgeClass: "badge-green",
  },
  {
    id: "frequencia",
    icon: <CheckSquare className="w-6 h-6 text-rose-600" />,
    title: "Frequência Alimentar",
    description: "Questionário de frequência de consumo por grupos alimentares.",
    category: "Avaliação",
    badgeClass: "badge-red",
  },
];

/* ── Form HTML generators ─────────────────────────────────────────── */
const BRAND_FOOTER = `
  <div style="margin-top:40px;border-top:1px solid #e5e7eb;padding-top:12px;display:flex;justify-content:space-between;align-items:center;">
    <span style="font-size:11px;color:#6b7280;">NutriFlow — Sistema de Gestão Nutricional</span>
    <span style="font-size:11px;color:#16a34a;font-weight:600;">nutriflow.app</span>
  </div>`;

const fieldLine = (label, wide = false) =>
  `<div style="margin-bottom:12px;">
    <label style="font-size:11px;color:#6b7280;display:block;margin-bottom:2px;">${label}</label>
    <div style="border-bottom:1px solid #9ca3af;height:22px;width:${wide ? "100%" : "60%"};"></div>
  </div>`;

const sectionTitle = (t) =>
  `<div style="background:#f0fdf4;border-left:3px solid #16a34a;padding:6px 12px;margin:18px 0 10px;font-weight:600;font-size:13px;color:#166534;">${t}</div>`;

const mealTable = (meal) =>
  `<div style="margin-bottom:16px;">
    <p style="font-weight:600;font-size:12px;color:#374151;margin-bottom:6px;">${meal}</p>
    <table style="width:100%;border-collapse:collapse;font-size:11px;">
      <thead><tr>
        <th style="border:1px solid #d1d5db;padding:4px 8px;background:#f9fafb;text-align:left;width:50%;">Alimento / Preparação</th>
        <th style="border:1px solid #d1d5db;padding:4px 8px;background:#f9fafb;text-align:left;">Quantidade / Medida caseira</th>
        <th style="border:1px solid #d1d5db;padding:4px 8px;background:#f9fafb;text-align:left;">Modo de preparo</th>
      </tr></thead>
      <tbody>
        ${[1,2,3,4].map(() => `<tr>${["","",""].map(() => `<td style="border:1px solid #d1d5db;padding:8px;">&nbsp;</td>`).join("")}</tr>`).join("")}
      </tbody>
    </table>
  </div>`;

function getFormHTML(id) {
  const h = (body) => `
    <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:760px;margin:0 auto;padding:24px 32px;color:#111827;">
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #16a34a;padding-bottom:12px;margin-bottom:20px;">
        <div>
          <h1 style="margin:0;font-size:20px;font-weight:700;color:#111827;">${FORMS.find(f=>f.id===id)?.title}</h1>
          <p style="margin:4px 0 0;font-size:11px;color:#6b7280;">NutriFlow — Gestão Nutricional</p>
        </div>
        <div style="text-align:right;font-size:11px;color:#6b7280;">
          Data: ___/___/______<br/>Hora: _____:_____
        </div>
      </div>
      ${body}
      ${BRAND_FOOTER}
    </div>`;

  if (id === "recordatorio") return h(`
    ${sectionTitle("Dados do Paciente")}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0 24px;">
      ${fieldLine("Nome completo")}${fieldLine("Data de nascimento")}
      ${fieldLine("Peso atual")}${fieldLine("Altura")}
    </div>
    ${sectionTitle("Café da Manhã — Horário: ______")}${mealTable("Alimentos consumidos")}
    ${sectionTitle("Lanche da Manhã — Horário: ______")}${mealTable("Alimentos consumidos")}
    ${sectionTitle("Almoço — Horário: ______")}${mealTable("Alimentos consumidos")}
    ${sectionTitle("Lanche da Tarde — Horário: ______")}${mealTable("Alimentos consumidos")}
    ${sectionTitle("Jantar — Horário: ______")}${mealTable("Alimentos consumidos")}
    ${sectionTitle("Ceia — Horário: ______")}${mealTable("Alimentos consumidos")}
    ${sectionTitle("Observações")}
    <div style="border:1px solid #d1d5db;border-radius:6px;height:60px;width:100%;margin-top:4px;"></div>
  `);

  if (id === "anamnese") return h(`
    ${sectionTitle("Identificação")}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0 24px;">
      ${fieldLine("Nome completo")}${fieldLine("Data de nascimento")}
      ${fieldLine("Profissão")}${fieldLine("Estado civil")}
      ${fieldLine("Telefone")}${fieldLine("E-mail")}
    </div>
    ${sectionTitle("Motivo da Consulta")}
    ${fieldLine("Queixa principal / objetivo", true)}
    ${fieldLine("Há quanto tempo?", true)}
    ${sectionTitle("Histórico de Saúde")}
    <p style="font-size:12px;color:#374151;margin-bottom:8px;">Doenças diagnosticadas (marque e descreva):</p>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;font-size:11px;margin-bottom:12px;">
      ${["Diabetes","Hipertensão","Dislipidemia","Hipotireoidismo","Hipertireoidismo","Síndrome metabólica","Doenças cardíacas","Doenças renais","Doenças hepáticas","TGI (gastrite, refluxo)","Anemia","SOP / endometriose","Ansiedade / depressão","Outro: _______________","Outro: _______________"].map(d=>`<label style="display:flex;align-items:center;gap:4px;"><input type="checkbox" /> ${d}</label>`).join("")}
    </div>
    ${sectionTitle("Medicamentos e Suplementos")}
    ${fieldLine("Medicamentos em uso", true)}
    ${fieldLine("Suplementos em uso", true)}
    ${sectionTitle("Histórico Alimentar")}
    ${fieldLine("Alergias ou intolerâncias alimentares", true)}
    ${fieldLine("Alimentos que não gosta / evita", true)}
    ${fieldLine("Quantas refeições faz por dia?")}${fieldLine("Quem prepara as refeições?")}
    ${fieldLine("Consome bebidas alcoólicas? Com qual frequência?")}
    ${fieldLine("Consome cigarro?")}
    ${sectionTitle("Atividade Física")}
    ${fieldLine("Pratica atividade física? Qual?")}${fieldLine("Frequência / duração")}
    ${sectionTitle("Hábitos Intestinais e Sono")}
    ${fieldLine("Frequência evacuação")}${fieldLine("Consistência")}
    ${fieldLine("Horas de sono por noite")}${fieldLine("Qualidade do sono")}
    ${sectionTitle("Observações da Nutricionista")}
    <div style="border:1px solid #d1d5db;border-radius:6px;height:60px;width:100%;margin-top:4px;"></div>
  `);

  if (id === "antropometria") return h(`
    ${sectionTitle("Dados do Paciente")}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0 24px;">
      ${fieldLine("Nome completo")}${fieldLine("Data")}
      ${fieldLine("Avaliação nº")}${fieldLine("Avaliador")}
    </div>
    ${sectionTitle("Medidas Básicas")}
    <table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:16px;">
      <thead><tr>
        <th style="border:1px solid #d1d5db;padding:6px 10px;background:#f9fafb;text-align:left;">Medida</th>
        <th style="border:1px solid #d1d5db;padding:6px 10px;background:#f9fafb;">Valor</th>
        <th style="border:1px solid #d1d5db;padding:6px 10px;background:#f9fafb;">Referência</th>
        <th style="border:1px solid #d1d5db;padding:6px 10px;background:#f9fafb;">Classificação</th>
      </tr></thead>
      <tbody>
        ${[["Peso (kg)",""],["Altura (cm)",""],["IMC (kg/m²)","18,5 – 24,9"],["% Gordura",""],["Massa magra (kg)",""],["Massa gorda (kg)",""]].map(([m,r])=>`<tr><td style="border:1px solid #d1d5db;padding:6px 10px;">${m}</td><td style="border:1px solid #d1d5db;padding:6px 10px;">&nbsp;</td><td style="border:1px solid #d1d5db;padding:6px 10px;font-size:10px;color:#6b7280;">${r}</td><td style="border:1px solid #d1d5db;padding:6px 10px;">&nbsp;</td></tr>`).join("")}
      </tbody>
    </table>
    ${sectionTitle("Circunferências (cm)")}
    <table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:16px;">
      <thead><tr>
        ${["Medida","D","E","Medida","D","E"].map(h=>`<th style="border:1px solid #d1d5db;padding:5px 8px;background:#f9fafb;">${h}</th>`).join("")}
      </tr></thead>
      <tbody>
        ${[["Cintura","Quadril"],["Abdômen","Pescoço"],["Braço relaxado","Braço contraído"],["Antebraço","Punho"],["Coxa","Panturrilha"]].map(([a,b])=>`<tr><td style="border:1px solid #d1d5db;padding:6px 8px;">${a}</td><td style="border:1px solid #d1d5db;padding:6px 8px;">&nbsp;</td><td style="border:1px solid #d1d5db;padding:6px 8px;">&nbsp;</td><td style="border:1px solid #d1d5db;padding:6px 8px;">${b}</td><td style="border:1px solid #d1d5db;padding:6px 8px;">&nbsp;</td><td style="border:1px solid #d1d5db;padding:6px 8px;">&nbsp;</td></tr>`).join("")}
      </tbody>
    </table>
    ${sectionTitle("Dobras Cutâneas (mm) — Adipômetro")}
    <table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:16px;">
      <thead><tr>
        ${["Dobra","M1","M2","M3","Média"].map(h=>`<th style="border:1px solid #d1d5db;padding:5px 8px;background:#f9fafb;">${h}</th>`).join("")}
      </tr></thead>
      <tbody>
        ${["Tricipital","Bicipital","Subescapular","Supra-ilíaca","Abdominal","Coxa","Panturrilha medial"].map(d=>`<tr><td style="border:1px solid #d1d5db;padding:6px 8px;">${d}</td>${["","","",""].map(()=>`<td style="border:1px solid #d1d5db;padding:6px 8px;">&nbsp;</td>`).join("")}</tr>`).join("")}
      </tbody>
    </table>
    ${sectionTitle("Protocolo Utilizado / Observações")}
    <div style="border:1px solid #d1d5db;border-radius:6px;height:50px;width:100%;margin-top:4px;"></div>
  `);

  if (id === "rastreamento") {
    const groups = [
      { title: "Sistema Digestivo", symptoms: ["Azia / refluxo","Distensão abdominal","Gases excessivos","Constipação (prisão de ventre)","Diarreia frequente","Náuseas","Dor abdominal","Indigestão"] },
      { title: "Sistema Hormonal / Metabólico", symptoms: ["Ganho de peso fácil","Dificuldade de emagrecer","Frio excessivo / intolerância ao frio","Queda de cabelo","Unhas frágeis","Irregularidade menstrual","TPM intensa","Fogachos"] },
      { title: "Sistema Imunológico / Inflamatório", symptoms: ["Infecções frequentes","Alergias recorrentes","Inflamações articulares","Dores musculares difusas","Feridas que demoram a cicatrizar"] },
      { title: "Sistema Nervoso / Energia", symptoms: ["Cansaço excessivo / fadiga","Dificuldade de concentração","Memória fraca","Insônia ou sono não reparador","Irritabilidade / ansiedade","Depressão / tristeza persistente","Formigamentos"] },
      { title: "Outros Sistemas", symptoms: ["Olhos secos ou irritados","Boca seca","Pele seca / oleosa em excesso","Acne persistente"] },
    ];
    return h(`
      ${sectionTitle("Dados do Paciente")}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0 24px;">
        ${fieldLine("Nome completo")}${fieldLine("Data")}
      </div>
      <p style="font-size:11px;color:#6b7280;margin-bottom:16px;">Marque a frequência de cada sintoma: 0 = Nunca &nbsp;|&nbsp; 1 = Raramente &nbsp;|&nbsp; 2 = Às vezes &nbsp;|&nbsp; 3 = Frequentemente &nbsp;|&nbsp; 4 = Sempre</p>
      ${groups.map(g => `
        ${sectionTitle(g.title)}
        <table style="width:100%;border-collapse:collapse;font-size:11px;margin-bottom:8px;">
          <thead><tr>
            <th style="border:1px solid #d1d5db;padding:4px 8px;background:#f9fafb;text-align:left;width:70%;">Sintoma</th>
            ${[0,1,2,3,4].map(n=>`<th style="border:1px solid #d1d5db;padding:4px;background:#f9fafb;text-align:center;width:6%;">${n}</th>`).join("")}
          </tr></thead>
          <tbody>
            ${g.symptoms.map(s=>`<tr><td style="border:1px solid #d1d5db;padding:5px 8px;">${s}</td>${[0,1,2,3,4].map(()=>`<td style="border:1px solid #d1d5db;padding:5px;text-align:center;"><input type="radio" /></td>`).join("")}</tr>`).join("")}
          </tbody>
        </table>`).join("")}
      ${sectionTitle("Pontuação Total / Observações")}
      <div style="border:1px solid #d1d5db;border-radius:6px;height:50px;width:100%;margin-top:4px;"></div>
    `);
  }

  if (id === "diario3dias") {
    const dias = ["Dia 1", "Dia 2", "Dia 3"];
    const refeicoes = ["Café da Manhã", "Lanche da Manhã", "Almoço", "Lanche da Tarde", "Jantar", "Ceia"];
    return h(`
      ${sectionTitle("Dados do Paciente")}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0 24px;">
        ${fieldLine("Nome completo")}${fieldLine("Período de registro")}
      </div>
      <p style="font-size:11px;color:#6b7280;margin-bottom:16px;">Registre TUDO o que consumiu: alimentos, bebidas, temperos e quantidades (colheres, xícaras, gramas, unidades).</p>
      ${dias.map(dia => `
        <h3 style="font-size:14px;font-weight:700;color:#166534;margin:20px 0 8px;background:#f0fdf4;padding:8px 12px;border-radius:6px;">${dia} — Data: ___/___/______</h3>
        ${refeicoes.map(r => `
          <div style="margin-bottom:10px;">
            <p style="font-size:11px;font-weight:600;color:#374151;margin-bottom:4px;">${r} — Horário: _______</p>
            <table style="width:100%;border-collapse:collapse;font-size:10px;">
              <thead><tr>
                <th style="border:1px solid #d1d5db;padding:3px 6px;background:#f9fafb;text-align:left;width:55%;">Alimento / Preparação</th>
                <th style="border:1px solid #d1d5db;padding:3px 6px;background:#f9fafb;text-align:left;">Quantidade</th>
                <th style="border:1px solid #d1d5db;padding:3px 6px;background:#f9fafb;text-align:left;">Observação</th>
              </tr></thead>
              <tbody>
                ${[1,2].map(() => `<tr>${["","",""].map(()=>`<td style="border:1px solid #d1d5db;padding:7px 6px;">&nbsp;</td>`).join("")}</tr>`).join("")}
              </tbody>
            </table>
          </div>`).join("")}`).join("")}
      ${sectionTitle("Ingestão Hídrica (marque cada copo de 200ml)")}
      <div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:8px;">
        ${Array(16).fill(0).map((_,i)=>`<div style="width:28px;height:28px;border:1px solid #d1d5db;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:10px;color:#6b7280;">${i+1}</div>`).join("")}
      </div>
    `);
  }

  if (id === "frequencia") {
    const grupos = [
      { titulo: "Cereais e Tubérculos", itens: ["Arroz branco","Arroz integral","Pão branco","Pão integral","Macarrão","Batata inglesa","Batata doce","Aveia / cereais"] },
      { titulo: "Carnes e Ovos", itens: ["Frango/aves","Carne bovina","Peixe / frutos do mar","Carne suína","Ovos","Embutidos (presunto, salsicha)"] },
      { titulo: "Laticínios", itens: ["Leite integral","Leite desnatado","Iogurte","Queijo","Queijo cottage / ricota"] },
      { titulo: "Leguminosas", itens: ["Feijão","Lentilha","Grão-de-bico","Ervilha","Soja"] },
      { titulo: "Verduras e Legumes", itens: ["Verduras folhosas (cruas)","Verduras cozidas","Legumes crus","Legumes cozidos"] },
      { titulo: "Frutas", itens: ["Frutas frescas","Sucos naturais","Frutas secas","Sucos industrializados"] },
      { titulo: "Gorduras e Oleaginosas", itens: ["Azeite de oliva","Óleo vegetal","Manteiga","Margarina","Castanhas / nozes","Abacate"] },
      { titulo: "Açúcares e Ultraprocessados", itens: ["Açúcar (adicionado)","Refrigerantes","Doces / sobremesas","Biscoitos / snacks","Fast food","Bebidas alcoólicas"] },
    ];
    const freqs = ["Nunca","1–2×/sem","3–4×/sem","5–6×/sem","1×/dia","2–3×/dia"];
    return h(`
      ${sectionTitle("Dados do Paciente")}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0 24px;">
        ${fieldLine("Nome completo")}${fieldLine("Data")}
      </div>
      <p style="font-size:11px;color:#6b7280;margin-bottom:16px;">Marque com um X a frequência habitual de consumo de cada alimento nos últimos 3 meses.</p>
      ${grupos.map(g => `
        ${sectionTitle(g.titulo)}
        <table style="width:100%;border-collapse:collapse;font-size:10px;margin-bottom:8px;">
          <thead><tr>
            <th style="border:1px solid #d1d5db;padding:4px 6px;background:#f9fafb;text-align:left;width:36%;">Alimento</th>
            ${freqs.map(f=>`<th style="border:1px solid #d1d5db;padding:4px 4px;background:#f9fafb;text-align:center;">${f}</th>`).join("")}
            <th style="border:1px solid #d1d5db;padding:4px 6px;background:#f9fafb;text-align:left;">Porção habitual</th>
          </tr></thead>
          <tbody>
            ${g.itens.map(item=>`<tr><td style="border:1px solid #d1d5db;padding:5px 6px;">${item}</td>${freqs.map(()=>`<td style="border:1px solid #d1d5db;padding:5px;text-align:center;"><input type="radio" /></td>`).join("")}<td style="border:1px solid #d1d5db;padding:5px 6px;">&nbsp;</td></tr>`).join("")}
          </tbody>
        </table>`).join("")}
      ${sectionTitle("Observações / Padrão Alimentar")}
      <div style="border:1px solid #d1d5db;border-radius:6px;height:50px;width:100%;margin-top:4px;"></div>
    `);
  }

  return h(`<p>Formulário não encontrado.</p>`);
}

/* ── Component ─────────────────────────────────────────────────────── */
export default function Impressos() {
  const [activeForm, setActiveForm] = useState(null);

  return (
    <div className="fade-up space-y-6">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Impressos Clínicos</h1>
          <p className="page-sub">Formulários prontos para imprimir e usar nas consultas</p>
        </div>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-700 flex items-start gap-2">
        <Printer className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span>Clique em "Visualizar / Imprimir" para abrir o formulário em tela cheia e usar o botão de impressão do navegador (Ctrl+P).</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FORMS.map((form) => (
          <div key={form.id} className="card p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                {form.icon}
              </div>
              <span className={`badge ${form.badgeClass}`}>{form.category}</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-sm leading-tight">{form.title}</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{form.description}</p>
            </div>
            <button
              onClick={() => setActiveForm(form.id)}
              className="btn-primary w-full justify-center"
            >
              <Printer className="w-4 h-4" />
              Visualizar / Imprimir
            </button>
          </div>
        ))}
      </div>

      {/* Print Modal */}
      {activeForm && (
        <div className="fixed inset-0 z-50 flex items-stretch justify-stretch bg-black/60">
          <div className="flex-1 flex flex-col bg-white">
            {/* Modal toolbar */}
            <div className="flex items-center justify-between px-6 py-3 border-b bg-white shadow-sm print:hidden">
              <span className="font-semibold text-gray-800">
                {FORMS.find(f => f.id === activeForm)?.title}
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="btn-primary"
                >
                  <Printer className="w-4 h-4" />
                  Imprimir
                </button>
                <button
                  onClick={() => setActiveForm(null)}
                  className="btn-ghost"
                >
                  <X className="w-4 h-4" />
                  Fechar
                </button>
              </div>
            </div>

            {/* Form content */}
            <div className="flex-1 overflow-auto bg-gray-100 p-6 print:p-0 print:bg-white">
              <div
                className="bg-white rounded-xl shadow-lg mx-auto print:shadow-none print:rounded-none"
                style={{ maxWidth: 800 }}
                dangerouslySetInnerHTML={{ __html: getFormHTML(activeForm) }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
