import { useState, useEffect } from "react";
import { db as base44 } from "@/api/localDB";
import jsPDF from "jspdf";
import { FileText, Plus, X, Download, Receipt, Award, Search } from "lucide-react";

const today = () => new Date().toISOString().split("T")[0];
const fmtDate = (s) => { if (!s) return "—"; const [y,m,d]=s.split("-"); return `${d}/${m}/${y}`; };

const ATESTADO_TIPOS = [
  "Atestado de Comparecimento",
  "Atestado de Acompanhamento Nutricional",
  "Atestado de Condição de Saúde",
  "Declaração Nutricional",
];

const TEMPLATES = {
  "Atestado de Comparecimento": (nome, data) =>
    `Atestamos que o/a paciente [NOME] compareceu a consulta nutricional no dia [DATA], na cidade de Porto Alegre/RS.`
    .replace("[NOME]", nome || "[NOME]").replace("[DATA]", fmtDate(data)),
  "Atestado de Acompanhamento Nutricional": (nome, data) =>
    `Atestamos que o/a paciente [NOME] encontra-se em acompanhamento nutricional regular desde [DATA], sob responsabilidade desta nutricionista.`
    .replace("[NOME]", nome || "[NOME]").replace("[DATA]", fmtDate(data)),
  "Atestado de Condição de Saúde": (nome, data) =>
    `Atestamos que o/a paciente [NOME], atendido/a nesta data [DATA], apresenta condições de saúde compatíveis com as atividades propostas, conforme avaliação nutricional realizada.`
    .replace("[NOME]", nome || "[NOME]").replace("[DATA]", fmtDate(data)),
  "Declaração Nutricional": (nome, data) =>
    `Declaramos, para os devidos fins, que o/a paciente [NOME] está sob orientação nutricional individualizada desde [DATA], seguindo plano alimentar prescrito por esta profissional.`
    .replace("[NOME]", nome || "[NOME]").replace("[DATA]", fmtDate(data)),
};

const PAYMENT_METHODS = ["PIX", "Cartão de Crédito", "Cartão de Débito", "Dinheiro", "Convênio"];

function Toast({ msg }) {
  if (!msg) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg">
      {msg}
    </div>
  );
}

function getConfig() {
  try { return JSON.parse(localStorage.getItem("nf_config")) || {}; } catch { return {}; }
}

function generateAtestadoPDF(atestado) {
  const cfg = getConfig();
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();

  // Header green band
  doc.setFillColor(22, 163, 74);
  doc.rect(0, 0, W, 38, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("NutriFlow", 20, 18);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(cfg.prof || "Nutricionista", 20, 26);
  doc.text(cfg.crn || "", 20, 32);

  // Tipo badge
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(22, 163, 74);
  doc.roundedRect(W - 80, 8, 65, 22, 3, 3, "FD");
  doc.setTextColor(22, 101, 52);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  const tipoLines = doc.splitTextToSize(atestado.tipo, 55);
  tipoLines.forEach((line, i) => doc.text(line, W - 47.5, 17 + i * 5, { align: "center" }));

  // Title
  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(atestado.tipo.toUpperCase(), W / 2, 56, { align: "center" });

  // Divider
  doc.setDrawColor(22, 163, 74);
  doc.setLineWidth(0.5);
  doc.line(20, 60, W - 20, 60);

  // Body text
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  const bodyLines = doc.splitTextToSize(atestado.texto, W - 40);
  doc.text(bodyLines, 20, 76);

  // Signature area
  const sigY = 200;
  doc.setDrawColor(100, 116, 139);
  doc.setLineWidth(0.3);
  doc.line(W / 2 - 40, sigY, W / 2 + 40, sigY);
  doc.setFontSize(10);
  doc.setTextColor(75, 85, 99);
  doc.setFont("helvetica", "bold");
  doc.text(cfg.prof || "Nutricionista", W / 2, sigY + 5, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.text(cfg.crn || "", W / 2, sigY + 10, { align: "center" });

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(156, 163, 175);
  doc.text(`Porto Alegre, ${fmtDate(atestado.data)}`, 20, 280);
  doc.text("NutriFlow — Sistema de Gestão Nutricional", W / 2, 287, { align: "center" });

  doc.save(`atestado-${atestado.patient_name?.split(" ")[0] || "paciente"}-${atestado.data}.pdf`);
}

function generateReciboPDF(recibo) {
  const cfg = getConfig();
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();

  doc.setFillColor(22, 163, 74);
  doc.rect(0, 0, W, 38, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("NutriFlow", 20, 18);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(cfg.prof || "Nutricionista", 20, 26);
  doc.text(cfg.crn || "", 20, 32);

  // Recibo label
  doc.setFillColor(255, 255, 255);
  doc.setTextColor(22, 163, 74);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("RECIBO DE PAGAMENTO", W - 20, 24, { align: "right" });

  // Title
  doc.setTextColor(17, 24, 39);
  doc.setFontSize(14);
  doc.text("RECIBO", W / 2, 56, { align: "center" });
  doc.setDrawColor(22, 163, 74);
  doc.setLineWidth(0.5);
  doc.line(20, 60, W - 20, 60);

  // Value highlight
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(20, 67, W - 40, 22, 3, 3, "F");
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(22, 101, 52);
  const valor = parseFloat(recibo.valor || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  doc.text(valor, W / 2, 81, { align: "center" });

  // Details
  const rows = [
    ["Paciente", recibo.patient_name || "—"],
    ["Data da Consulta", fmtDate(recibo.data)],
    ["Serviço", recibo.descricao || "Consulta nutricional"],
    ["Forma de Pagamento", recibo.pagamento || "—"],
  ];

  let y = 106;
  doc.setFontSize(11);
  rows.forEach(([label, val]) => {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(75, 85, 99);
    doc.text(label + ":", 20, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(17, 24, 39);
    doc.text(val, 80, y);
    y += 9;
  });

  // Signature
  const sigY = 200;
  doc.setDrawColor(100, 116, 139);
  doc.setLineWidth(0.3);
  doc.line(W / 2 - 40, sigY, W / 2 + 40, sigY);
  doc.setFontSize(10);
  doc.setTextColor(75, 85, 99);
  doc.setFont("helvetica", "bold");
  doc.text(cfg.prof || "Nutricionista", W / 2, sigY + 5, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.text(cfg.crn || "", W / 2, sigY + 10, { align: "center" });

  doc.setFontSize(9);
  doc.setTextColor(156, 163, 175);
  doc.text(`Porto Alegre, ${fmtDate(recibo.data)}`, 20, 280);
  doc.text("NutriFlow — Sistema de Gestão Nutricional", W / 2, 287, { align: "center" });

  doc.save(`recibo-${recibo.patient_name?.split(" ")[0] || "paciente"}-${recibo.data}.pdf`);
}

/* ── Atestado Modal ─ */
function AtestadoModal({ patients, onClose, onSaved, showToast }) {
  const [form, setForm] = useState({ patient_id: "", patient_name: "", tipo: ATESTADO_TIPOS[0], data: today(), texto: "" });
  const [pSearch, setPSearch] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handlePatient = (p) => {
    set("patient_id", p.id);
    set("patient_name", p.full_name);
    setPSearch(p.full_name);
    set("texto", TEMPLATES[form.tipo]?.(p.full_name, form.data) || "");
  };

  const handleTipo = (tipo) => {
    set("tipo", tipo);
    set("texto", TEMPLATES[tipo]?.(form.patient_name, form.data) || "");
  };

  const handleSave = async () => {
    if (!form.patient_id || !form.texto.trim()) { showToast("Selecione um paciente e preencha o texto."); return; }
    const saved = await base44.entities.Atestado.create(form);
    showToast("Atestado salvo!");
    onSaved(saved);
    onClose();
  };

  const handlePDF = () => {
    if (!form.patient_id) { showToast("Selecione um paciente primeiro."); return; }
    generateAtestadoPDF(form);
  };

  const pFiltered = patients.filter(p => p.full_name?.toLowerCase().includes(pSearch.toLowerCase())).slice(0, 8);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white">
          <h2 className="font-semibold text-gray-900">Novo Atestado</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="p-6 space-y-4">
          {/* Patient search */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                className="input-modern pl-9"
                placeholder="Buscar paciente..."
                value={pSearch}
                onChange={e => { setPSearch(e.target.value); set("patient_id", ""); set("patient_name", ""); }}
              />
            </div>
            {pSearch && !form.patient_id && pFiltered.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                {pFiltered.map(p => (
                  <button key={p.id} onClick={() => handlePatient(p)} className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors">
                    {p.full_name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Documento</label>
            <select className="input-modern" value={form.tipo} onChange={e => handleTipo(e.target.value)}>
              {ATESTADO_TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
            <input type="date" className="input-modern" value={form.data}
              onChange={e => { set("data", e.target.value); set("texto", TEMPLATES[form.tipo]?.(form.patient_name, e.target.value) || form.texto); }} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Texto do Documento</label>
            <textarea className="input-modern resize-none" rows={5} value={form.texto} onChange={e => set("texto", e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <button onClick={onClose} className="btn-ghost">Cancelar</button>
          <button onClick={handlePDF} className="btn-ghost">
            <Download className="w-4 h-4" /> Gerar PDF
          </button>
          <button onClick={handleSave} className="btn-primary">Salvar</button>
        </div>
      </div>
    </div>
  );
}

/* ── Recibo Modal ─ */
function ReciboModal({ patients, onClose, onSaved, showToast }) {
  const [form, setForm] = useState({ patient_id: "", patient_name: "", data: today(), descricao: "Consulta nutricional", valor: "", pagamento: "PIX" });
  const [pSearch, setPSearch] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const pFiltered = patients.filter(p => p.full_name?.toLowerCase().includes(pSearch.toLowerCase())).slice(0, 8);

  const handleSave = async () => {
    if (!form.patient_id || !form.valor) { showToast("Preencha paciente e valor."); return; }
    const saved = await base44.entities.Recibo.create(form);
    showToast("Recibo salvo!");
    onSaved(saved);
    onClose();
  };

  const handlePDF = () => {
    if (!form.patient_id || !form.valor) { showToast("Preencha paciente e valor."); return; }
    generateReciboPDF(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-gray-900">Novo Recibo</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input className="input-modern pl-9" placeholder="Buscar paciente..." value={pSearch}
                onChange={e => { setPSearch(e.target.value); set("patient_id",""); set("patient_name",""); }} />
            </div>
            {pSearch && !form.patient_id && pFiltered.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                {pFiltered.map(p => (
                  <button key={p.id} onClick={() => { set("patient_id",p.id); set("patient_name",p.full_name); setPSearch(p.full_name); }} className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50">
                    {p.full_name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data da Consulta</label>
              <input type="date" className="input-modern" value={form.data} onChange={e => set("data", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
              <input type="number" step="0.01" className="input-modern" placeholder="200,00" value={form.valor} onChange={e => set("valor", e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição do Serviço</label>
            <input className="input-modern" value={form.descricao} onChange={e => set("descricao", e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Forma de Pagamento</label>
            <select className="input-modern" value={form.pagamento} onChange={e => set("pagamento", e.target.value)}>
              {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <button onClick={onClose} className="btn-ghost">Cancelar</button>
          <button onClick={handlePDF} className="btn-ghost"><Download className="w-4 h-4" /> PDF</button>
          <button onClick={handleSave} className="btn-primary">Salvar</button>
        </div>
      </div>
    </div>
  );
}

/* ── Main ─ */
export default function Atestados() {
  const [tab, setTab] = useState("atestados");
  const [atestados, setAtestados] = useState([]);
  const [recibos, setRecibos] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAtestadoModal, setShowAtestadoModal] = useState(false);
  const [showReciboModal, setShowReciboModal] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const load = async () => {
    const [a, r, p] = await Promise.all([
      base44.entities.Atestado.list("-created_date", 50),
      base44.entities.Recibo.list("-created_date", 50),
      base44.entities.Patient.list(),
    ]);
    setAtestados(a);
    setRecibos(r);
    setPatients(p);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="fade-up space-y-6">
      <Toast msg={toast} />

      <div className="page-header">
        <div>
          <h1 className="page-title">Atestados & Recibos</h1>
          <p className="page-sub">Gere documentos profissionais em PDF</p>
        </div>
        {tab === "atestados" ? (
          <button onClick={() => setShowAtestadoModal(true)} className="btn-primary">
            <Plus className="w-4 h-4" /> Novo Atestado
          </button>
        ) : (
          <button onClick={() => setShowReciboModal(true)} className="btn-primary">
            <Plus className="w-4 h-4" /> Novo Recibo
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {[["atestados","Atestados"],["recibos","Recibos"]].map(([k,l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${tab === k ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
            {l}
          </button>
        ))}
      </div>

      {/* Lists */}
      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="card p-4 h-16 animate-pulse bg-gray-50" />)}</div>
      ) : tab === "atestados" ? (
        atestados.length === 0 ? (
          <div className="card p-12 text-center text-gray-400">
            <Award className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium">Nenhum atestado criado ainda</p>
          </div>
        ) : (
          <div className="space-y-3">
            {atestados.map(a => (
              <div key={a.id} className="card p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
                    <FileText className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">{a.patient_name}</p>
                    <p className="text-xs text-gray-500">{a.tipo} · {fmtDate(a.data)}</p>
                  </div>
                </div>
                <button onClick={() => generateAtestadoPDF(a)} className="btn-ghost text-xs py-1.5 px-3">
                  <Download className="w-3.5 h-3.5" /> PDF
                </button>
              </div>
            ))}
          </div>
        )
      ) : (
        recibos.length === 0 ? (
          <div className="card p-12 text-center text-gray-400">
            <Receipt className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium">Nenhum recibo criado ainda</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recibos.map(r => (
              <div key={r.id} className="card p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Receipt className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">{r.patient_name}</p>
                    <p className="text-xs text-gray-500">
                      {r.descricao} · {fmtDate(r.data)} ·{" "}
                      <span className="font-semibold text-green-700">
                        {parseFloat(r.valor||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}
                      </span>
                    </p>
                  </div>
                </div>
                <button onClick={() => generateReciboPDF(r)} className="btn-ghost text-xs py-1.5 px-3">
                  <Download className="w-3.5 h-3.5" /> PDF
                </button>
              </div>
            ))}
          </div>
        )
      )}

      {showAtestadoModal && (
        <AtestadoModal
          patients={patients}
          onClose={() => setShowAtestadoModal(false)}
          onSaved={(a) => setAtestados(prev => [a, ...prev])}
          showToast={showToast}
        />
      )}

      {showReciboModal && (
        <ReciboModal
          patients={patients}
          onClose={() => setShowReciboModal(false)}
          onSaved={(r) => setRecibos(prev => [r, ...prev])}
          showToast={showToast}
        />
      )}
    </div>
  );
}
