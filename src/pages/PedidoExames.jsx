import { useState, useEffect } from "react";
import { db as base44 } from "@/api/localDB";
import {
  ClipboardList, Plus, X, Download, Search,
  Trash2, Printer, ChevronDown, ChevronUp
} from "lucide-react";
import jsPDF from "jspdf";

const today = () => new Date().toISOString().split("T")[0];
const fmtDate = (s) => { if (!s) return "—"; const [y,m,d]=s.split("-"); return `${d}/${m}/${y}`; };

/* ── Grupos de exames pré-cadastrados ──────────────────── */
const EXAMES_GRUPOS = [
  {
    grupo: "Hemograma e Hematologia",
    exames: ["Hemograma completo","Eritrograma","Leucograma","Plaquetas","Reticulócitos","VHS","Ferritina","Ferro sérico","TIBC / Saturação de transferrina","Folato sérico","Vitamina B12"],
  },
  {
    grupo: "Glicemia e Metabolismo",
    exames: ["Glicemia de jejum","Hemoglobina glicada (HbA1c)","Insulina basal","HOMA-IR","Frutosamina","Peptídeo C","Teste oral de tolerância à glicose (TOTG)"],
  },
  {
    grupo: "Lipidograma",
    exames: ["Colesterol total","LDL colesterol","HDL colesterol","VLDL colesterol","Triglicerídeos","Lipoproteína (a)","Apolipoproteína A1","Apolipoproteína B"],
  },
  {
    grupo: "Tireoide",
    exames: ["TSH","T3 livre","T4 livre","T3 total","T4 total","Anti-TPO","Anti-tireoglobulina","Tireoglobulina"],
  },
  {
    grupo: "Função Renal",
    exames: ["Ureia","Creatinina","TFG estimada","Ácido úrico","Microalbuminúria","Proteinúria 24h","Exame de urina (EAS)"],
  },
  {
    grupo: "Função Hepática",
    exames: ["TGO (AST)","TGP (ALT)","GGT","Fosfatase alcalina","Bilirrubinas (total, direta, indireta)","Albumina","Proteínas totais","LDH","Tempo de protrombina (TP/INR)"],
  },
  {
    grupo: "Vitaminas e Minerais",
    exames: ["Vitamina D (25-OH)","Vitamina A","Vitamina E","Cálcio sérico","Magnésio","Zinco","Cobre","Selênio","Fósforo","Potássio","Sódio","Cloro"],
  },
  {
    grupo: "Hormônios",
    exames: ["Cortisol basal","DHEA-S","Testosterona total","Testosterona livre","Estradiol","FSH","LH","Prolactina","GH","IGF-1","Progesterona","Androstenediona","SHBG"],
  },
  {
    grupo: "Inflamação e Imunologia",
    exames: ["PCR ultrassensível","PCR convencional","Homocisteína","Fibrinogênio","Interleucina-6","TNF-alfa","IgE total","ASLO"],
  },
  {
    grupo: "Outros",
    exames: ["PSA total","PSA livre","CEA","CA 19-9","CA 125","AFP","BHCG","Cortisol urinário 24h","Catecolaminas urinárias","Amilase","Lipase"],
  },
];

function getConfig() {
  try { return JSON.parse(localStorage.getItem("nf_config")) || {}; } catch { return {}; }
}

function generatePDF(pedido) {
  const cfg = getConfig();
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();

  // Header
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
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("PEDIDO DE EXAMES", W - 20, 24, { align: "right" });

  // Title
  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("PEDIDO DE EXAMES LABORATORIAIS", W / 2, 56, { align: "center" });
  doc.setDrawColor(22, 163, 74);
  doc.setLineWidth(0.5);
  doc.line(20, 60, W - 20, 60);

  // Patient info
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(75, 85, 99);
  doc.text("Paciente:", 20, 72);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(17, 24, 39);
  doc.text(pedido.patient_name || "—", 55, 72);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(75, 85, 99);
  doc.text("Data:", W - 60, 72);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(17, 24, 39);
  doc.text(fmtDate(pedido.data), W - 40, 72);

  if (pedido.observacao) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text("Obs: " + pedido.observacao, 20, 80);
  }

  // Exames list
  let y = 92;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(17, 24, 39);
  doc.text("Exames solicitados:", 20, y);
  y += 8;

  const exames = Array.isArray(pedido.exames) ? pedido.exames : [];
  exames.forEach((ex, i) => {
    if (y > 270) { doc.addPage(); y = 20; }
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(17, 24, 39);
    doc.text(`${i + 1}. ${ex}`, 25, y);
    y += 7;
  });

  // Preparo
  if (pedido.preparo) {
    y += 4;
    if (y > 260) { doc.addPage(); y = 20; }
    doc.setFillColor(240, 253, 244);
    const preparoLines = doc.splitTextToSize(pedido.preparo, W - 50);
    doc.roundedRect(20, y, W - 40, preparoLines.length * 6 + 14, 3, 3, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(22, 101, 52);
    doc.text("Preparo / Orientações:", 26, y + 7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(22, 101, 52);
    preparoLines.forEach((l, i) => doc.text(l, 26, y + 14 + i * 6));
    y += preparoLines.length * 6 + 20;
  }

  // Signature
  const sigY = Math.max(y + 20, 220);
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
  doc.text(`Porto Alegre, ${fmtDate(pedido.data)}`, 20, 285);
  doc.text("NutriFlow — Sistema de Gestão Nutricional", W / 2, 287, { align: "center" });

  doc.save(`pedido-exames-${pedido.patient_name?.split(" ")[0] || "paciente"}-${pedido.data}.pdf`);
}

function Toast({ msg }) {
  if (!msg) return null;
  return <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg">{msg}</div>;
}

/* ── Modal de novo pedido ────────────────────────────── */
function PedidoModal({ patients, onClose, onSaved, showToast }) {
  const [form, setForm] = useState({
    patient_id: "", patient_name: "", data: today(),
    exames: [], preparo: "", observacao: "",
  });
  const [pSearch,    setPSearch]    = useState("");
  const [exSearch,   setExSearch]   = useState("");
  const [openGrupos, setOpenGrupos] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleExame = (ex) => {
    setForm(f => ({
      ...f,
      exames: f.exames.includes(ex) ? f.exames.filter(e => e !== ex) : [...f.exames, ex],
    }));
  };

  const pFiltered = patients.filter(p => p.full_name?.toLowerCase().includes(pSearch.toLowerCase())).slice(0, 8);

  const allExames = EXAMES_GRUPOS.flatMap(g => g.exames);
  const exFiltered = exSearch
    ? allExames.filter(e => e.toLowerCase().includes(exSearch.toLowerCase()))
    : null;

  const handleSave = async () => {
    if (!form.patient_id || form.exames.length === 0) {
      showToast("⚠️ Selecione um paciente e ao menos um exame.");
      return;
    }
    const saved = await base44.entities.PedidoExame.create(form);
    showToast("✅ Pedido salvo!");
    onSaved(saved);
    onClose();
  };

  const handlePDF = () => {
    if (!form.patient_id || form.exames.length === 0) {
      showToast("⚠️ Selecione um paciente e ao menos um exame.");
      return;
    }
    generatePDF(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-gray-900">Novo Pedido de Exames</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Paciente */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Paciente *</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input className="input-modern pl-9" placeholder="Buscar paciente…"
                value={pSearch} onChange={e => { setPSearch(e.target.value); set("patient_id",""); set("patient_name",""); }} />
            </div>
            {pSearch && !form.patient_id && pFiltered.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                {pFiltered.map(p => (
                  <button key={p.id} onClick={() => { set("patient_id",p.id); set("patient_name",p.full_name); setPSearch(p.full_name); }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50">{p.full_name}</button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
              <input type="date" className="input-modern" value={form.data} onChange={e => set("data", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Observação</label>
              <input className="input-modern" placeholder="Ex: Jejum de 12h" value={form.observacao} onChange={e => set("observacao", e.target.value)} />
            </div>
          </div>

          {/* Seleção de exames */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Exames *{" "}
                {form.exames.length > 0 && (
                  <span className="ml-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                    {form.exames.length} selecionado(s)
                  </span>
                )}
              </label>
              {form.exames.length > 0 && (
                <button onClick={() => set("exames",[])} className="text-xs text-red-500 hover:text-red-600">Limpar</button>
              )}
            </div>

            {/* Busca de exame */}
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input className="input-modern pl-9" placeholder="Buscar exame…"
                value={exSearch} onChange={e => setExSearch(e.target.value)} />
            </div>

            {exFiltered ? (
              <div className="border border-gray-200 rounded-xl p-3 max-h-40 overflow-y-auto space-y-1">
                {exFiltered.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-2">Nenhum exame encontrado</p>
                ) : exFiltered.map(ex => (
                  <label key={ex} className="flex items-center gap-2 px-2 py-1 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <input type="checkbox" checked={form.exames.includes(ex)} onChange={() => toggleExame(ex)} className="accent-green-600" />
                    <span className="text-sm text-gray-700">{ex}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="border border-gray-200 rounded-xl overflow-hidden max-h-64 overflow-y-auto">
                {EXAMES_GRUPOS.map(g => (
                  <div key={g.grupo}>
                    <button
                      onClick={() => setOpenGrupos(prev => ({ ...prev, [g.grupo]: !prev[g.grupo] }))}
                      className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-sm font-semibold text-gray-700 transition-colors"
                    >
                      <span>{g.grupo}</span>
                      <div className="flex items-center gap-2">
                        {g.exames.filter(e => form.exames.includes(e)).length > 0 && (
                          <span className="text-xs bg-green-100 text-green-700 px-1.5 rounded-full">
                            {g.exames.filter(e => form.exames.includes(e)).length}
                          </span>
                        )}
                        {openGrupos[g.grupo] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>
                    {openGrupos[g.grupo] && (
                      <div className="px-4 py-2 space-y-1 border-b border-gray-100">
                        {g.exames.map(ex => (
                          <label key={ex} className="flex items-center gap-2 py-0.5 hover:bg-gray-50 cursor-pointer">
                            <input type="checkbox" checked={form.exames.includes(ex)} onChange={() => toggleExame(ex)} className="accent-green-600" />
                            <span className="text-sm text-gray-700">{ex}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Preparo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preparo / Orientações</label>
            <textarea className="input-modern resize-none" rows={3}
              placeholder="Ex: Jejum de 12h para glicemia e lipidograma. Evitar exercícios nas 24h anteriores."
              value={form.preparo} onChange={e => set("preparo", e.target.value)} />
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

/* ── Main ─────────────────────────────────────────────── */
export default function PedidoExames() {
  const [pedidos,   setPedidos]   = useState([]);
  const [patients,  setPatients]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search,    setSearch]    = useState("");
  const [toast,     setToast]     = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const load = async () => {
    const [p, pa] = await Promise.all([
      base44.entities.PedidoExame.list("-created_date", 100),
      base44.entities.Patient.list(),
    ]);
    setPedidos(p);
    setPatients(pa);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Excluir este pedido?")) return;
    await base44.entities.PedidoExame.delete(id);
    showToast("🗑️ Pedido excluído");
    load();
  };

  const filtered = pedidos.filter(p =>
    p.patient_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 fade-up">
      <Toast msg={toast} />

      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-green-600" /> Pedido de Exames
          </h1>
          <p className="page-sub">Gere pedidos de exames laboratoriais em PDF</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Novo Pedido
        </button>
      </div>

      {/* Busca */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por paciente…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-modern pl-10"
        />
      </div>

      {/* Lista */}
      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="card p-4 h-16 animate-pulse bg-gray-50"/>)}</div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center text-gray-400">
          <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">{search ? "Nenhum pedido encontrado" : "Nenhum pedido criado ainda"}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(p => (
            <div key={p.id} className="card p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ClipboardList className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">{p.patient_name}</p>
                  <p className="text-xs text-gray-400">
                    {fmtDate(p.data)} · {Array.isArray(p.exames) ? p.exames.length : 0} exame(s)
                    {p.observacao && ` · ${p.observacao}`}
                  </p>
                  {Array.isArray(p.exames) && p.exames.length > 0 && (
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                      {p.exames.slice(0, 5).join(", ")}{p.exames.length > 5 ? `… +${p.exames.length-5}` : ""}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => generatePDF(p)} className="btn-ghost text-xs py-1.5 px-3">
                  <Download className="w-3.5 h-3.5" /> PDF
                </button>
                <button onClick={() => handleDelete(p.id)}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <PedidoModal
          patients={patients}
          onClose={() => setShowModal(false)}
          onSaved={(p) => { setPedidos(prev => [p, ...prev]); }}
          showToast={showToast}
        />
      )}
    </div>
  );
}
