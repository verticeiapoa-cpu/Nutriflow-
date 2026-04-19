import { useState, useEffect } from "react";
import { db as base44 } from "@/api/localDB";
import {
  MessageSquare, Plus, X, Edit2, Trash2, Copy,
  Search, MessageCircle
} from "lucide-react";

/* ── Variáveis disponíveis ─────────────────────────────── */
const VARIAVEIS = [
  { tag: "|NOME|",          desc: "Nome do paciente"       },
  { tag: "|DATA|",          desc: "Data da consulta"        },
  { tag: "|HORA|",          desc: "Horário da consulta"     },
  { tag: "|NUTRICIONISTA|", desc: "Nome da nutricionista"   },
  { tag: "|TELEFONE|",      desc: "Telefone do paciente"    },
  { tag: "|EMAIL|",         desc: "E-mail do paciente"      },
];

const CANAIS = ["whatsapp", "email", "sms"];

function Toast({ msg }) {
  if (!msg) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg fade-up">
      {msg}
    </div>
  );
}

/* ── Modal de criação/edição ───────────────────────────── */
function TemplateModal({ template, onClose, onSave, showToast }) {
  const [form, setForm] = useState(template || {
    nome: "", canal: "whatsapp", mensagem: "", ativo: true,
  });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const insertTag = (tag) => {
    setForm(f => ({ ...f, mensagem: (f.mensagem || "") + tag }));
  };

  const handleSave = async () => {
    if (!form.nome.trim() || !form.mensagem.trim()) {
      showToast("⚠️ Preencha nome e mensagem.");
      return;
    }
    setSaving(true);
    if (template?.id) {
      await base44.entities.MensagemTemplate.update(template.id, form);
    } else {
      await base44.entities.MensagemTemplate.create(form);
    }
    showToast("✅ Modelo salvo!");
    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white">
          <h2 className="font-semibold text-gray-900">
            {template?.id ? "Editar Modelo" : "Novo Modelo"}
          </h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Modelo</label>
            <input
              className="input-modern"
              placeholder="Ex: Lembrete de Consulta"
              value={form.nome}
              onChange={e => set("nome", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Canal</label>
            <div className="flex gap-2">
              {CANAIS.map(c => (
                <button
                  key={c}
                  onClick={() => set("canal", c)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
                    form.canal === c
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {c === "whatsapp" ? "WhatsApp" : c === "email" ? "E-mail" : "SMS"}
                </button>
              ))}
            </div>
          </div>

          {/* Variáveis */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Inserir variável
              <span className="ml-1 text-[11px] text-gray-400 font-normal">(clique para inserir na mensagem)</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {VARIAVEIS.map(v => (
                <button
                  key={v.tag}
                  onClick={() => insertTag(v.tag)}
                  title={v.desc}
                  className="px-2.5 py-1 text-xs font-mono bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                >
                  {v.tag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
            <textarea
              className="input-modern resize-none font-mono text-sm"
              rows={7}
              placeholder="Escreva sua mensagem aqui. Use as variáveis acima para personalizar."
              value={form.mensagem}
              onChange={e => set("mensagem", e.target.value)}
            />
            <p className="text-xs text-gray-400 mt-1">{form.mensagem?.length || 0} caracteres</p>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => set("ativo", !form.ativo)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.ativo ? "bg-green-500" : "bg-gray-200"}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.ativo ? "translate-x-6" : "translate-x-1"}`} />
              </div>
              <span className="text-sm text-gray-700">Modelo ativo</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <button onClick={onClose} className="btn-ghost">Cancelar</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? "Salvando…" : "Salvar Modelo"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Modal de preview / envio ──────────────────────────── */
function PreviewModal({ template, patients, onClose, showToast }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const cfg = (() => { try { return JSON.parse(localStorage.getItem("nf_config")) || {}; } catch { return {}; } })();

  const preview = (pat) => {
    if (!template?.mensagem) return "";
    const d = new Date();
    return template.mensagem
      .replace(/\|NOME\|/g, pat?.full_name || "[nome]")
      .replace(/\|DATA\|/g, d.toLocaleDateString("pt-BR"))
      .replace(/\|HORA\|/g, d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }))
      .replace(/\|NUTRICIONISTA\|/g, cfg.prof || "Nutricionista")
      .replace(/\|TELEFONE\|/g, pat?.phone || "[telefone]")
      .replace(/\|EMAIL\|/g, pat?.email || "[email]");
  };

  const sendWhatsApp = () => {
    if (!selected) { showToast("⚠️ Selecione um paciente."); return; }
    const phone = selected.phone?.replace(/\D/g, "");
    if (!phone) { showToast("⚠️ Paciente sem telefone cadastrado."); return; }
    const msg = encodeURIComponent(preview(selected));
    window.open(`https://wa.me/55${phone}?text=${msg}`, "_blank");
  };

  const copyText = () => {
    navigator.clipboard.writeText(preview(selected));
    showToast("📋 Texto copiado!");
  };

  const filtered = patients.filter(p =>
    p.full_name?.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 8);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white">
          <h2 className="font-semibold text-gray-900">Enviar: {template.nome}</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>

        <div className="p-6 space-y-4">
          {/* Busca de paciente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Selecionar paciente</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                className="input-modern pl-9"
                placeholder="Buscar por nome…"
                value={search}
                onChange={e => { setSearch(e.target.value); setSelected(null); }}
              />
            </div>
            {search && !selected && filtered.length > 0 && (
              <div className="border border-gray-200 rounded-xl mt-1 max-h-40 overflow-y-auto shadow-sm">
                {filtered.map(p => (
                  <button key={p.id} onClick={() => { setSelected(p); setSearch(p.full_name); }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors">
                    {p.full_name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prévia da mensagem</label>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-wrap min-h-[100px] font-mono">
              {preview(selected)}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <button onClick={onClose} className="btn-ghost">Fechar</button>
          <button onClick={copyText} className="btn-ghost">
            <Copy className="w-4 h-4" /> Copiar
          </button>
          {template.canal === "whatsapp" && (
            <button onClick={sendWhatsApp} className="btn-primary bg-green-600 hover:bg-green-700">
              <MessageCircle className="w-4 h-4" /> Enviar via WhatsApp
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main ──────────────────────────────────────────────── */
export default function ModelosMensagens() {
  const [templates, setTemplates] = useState([]);
  const [patients,  setPatients]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");
  const [toast,     setToast]     = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing,   setEditing]   = useState(null);
  const [previewing,setPreviewing]= useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const load = async () => {
    const [t, p] = await Promise.all([
      base44.entities.MensagemTemplate.list("-created_date", 50),
      base44.entities.Patient.list("-created_date", 200),
    ]);
    setTemplates(t);
    setPatients(p);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Excluir este modelo?")) return;
    await base44.entities.MensagemTemplate.delete(id);
    showToast("🗑️ Modelo excluído");
    load();
  };

  const duplicar = async (t) => {
    await base44.entities.MensagemTemplate.create({
      ...t, id: undefined, nome: t.nome + " (cópia)", created_date: undefined,
    });
    showToast("📋 Modelo duplicado");
    load();
  };

  const canalBadge = (canal) => {
    if (canal === "whatsapp") return "badge-green";
    if (canal === "email")    return "badge-blue";
    return "badge-gray";
  };

  const canalLabel = (canal) => {
    if (canal === "whatsapp") return "WhatsApp";
    if (canal === "email")    return "E-mail";
    return "SMS";
  };

  const filtered = templates.filter(t =>
    t.nome?.toLowerCase().includes(search.toLowerCase()) ||
    t.mensagem?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 fade-up">
      <Toast msg={toast} />

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-green-600" /> Modelos de Mensagem
          </h1>
          <p className="page-sub">Crie e reutilize mensagens personalizadas para seus pacientes</p>
        </div>
        <button onClick={() => { setEditing(null); setShowModal(true); }} className="btn-primary">
          <Plus className="w-4 h-4" /> Novo Modelo
        </button>
      </div>

      {/* Barra de busca */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar modelos…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-modern pl-10"
        />
      </div>

      {/* Variáveis info */}
      <div className="card p-4 bg-blue-50 border-blue-100">
        <p className="text-sm font-semibold text-blue-800 mb-2">Variáveis disponíveis nas mensagens:</p>
        <div className="flex flex-wrap gap-2">
          {VARIAVEIS.map(v => (
            <span key={v.tag} className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono bg-white border border-blue-200 rounded-lg text-blue-700">
              {v.tag} <span className="font-sans text-blue-400">— {v.desc}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="card p-5 h-24 animate-pulse bg-gray-50" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center text-gray-400">
          <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">
            {search ? "Nenhum modelo encontrado" : "Nenhum modelo criado ainda"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(t => (
            <div key={t.id} className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-gray-900 text-sm">{t.nome}</h3>
                      <span className={`badge ${canalBadge(t.canal)}`}>{canalLabel(t.canal)}</span>
                      {!t.ativo && <span className="badge badge-gray">Inativo</span>}
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2 font-mono leading-relaxed">
                      {t.mensagem}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => setPreviewing(t)}
                    title="Enviar"
                    className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => duplicar(t)}
                    title="Duplicar"
                    className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => { setEditing(t); setShowModal(true); }}
                    title="Editar"
                    className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    title="Excluir"
                    className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <TemplateModal
          template={editing}
          onClose={() => setShowModal(false)}
          onSave={load}
          showToast={showToast}
        />
      )}

      {previewing && (
        <PreviewModal
          template={previewing}
          patients={patients}
          onClose={() => setPreviewing(null)}
          showToast={showToast}
        />
      )}
    </div>
  );
}
