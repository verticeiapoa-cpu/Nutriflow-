import { useState, useEffect } from "react";
import { db as base44 } from "@/api/localDB";
import { Plus, Search, Copy, MessageCircle, Eye, X, Tag, BookOpen } from "lucide-react";

const CATEGORIAS = ["Todos", "Geral", "Emagrecimento", "Cardiovascular", "Performance", "Diabetes", "Outros"];

const CAT_BADGE = {
  Geral: "badge-gray",
  Emagrecimento: "badge-green",
  Cardiovascular: "badge-red",
  Performance: "badge-blue",
  Diabetes: "badge-amber",
  Outros: "badge-purple",
};

function Toast({ msg }) {
  if (!msg) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg animate-fade-in">
      {msg}
    </div>
  );
}

export default function Orientacoes() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("Todos");
  const [toast, setToast] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const [form, setForm] = useState({ titulo: "", categoria: "Geral", conteudo: "", tags: "" });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const load = async () => {
    const data = await base44.entities.Orientacao.list("-created_date", 100);
    setItems(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = items.filter(o => {
    const matchSearch = o.titulo?.toLowerCase().includes(search.toLowerCase()) ||
      (Array.isArray(o.tags) ? o.tags.join(" ") : (o.tags || "")).toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "Todos" || o.categoria === catFilter;
    return matchSearch && matchCat;
  });

  const handleSave = async () => {
    if (!form.titulo.trim() || !form.conteudo.trim()) return;
    const tags = form.tags.split(",").map(t => t.trim()).filter(Boolean);
    await base44.entities.Orientacao.create({ ...form, tags });
    setShowForm(false);
    setForm({ titulo: "", categoria: "Geral", conteudo: "", tags: "" });
    showToast("Orientação salva com sucesso!");
    load();
  };

  const handleCopy = (o) => {
    navigator.clipboard.writeText(`${o.titulo}\n\n${o.conteudo}`);
    showToast("Copiado para a área de transferência!");
  };

  const handleWhatsApp = (o) => {
    const text = encodeURIComponent(`*${o.titulo}*\n\n${o.conteudo}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <div className="fade-up space-y-6">
      <Toast msg={toast} />

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Orientações Nutricionais</h1>
          <p className="page-sub">{items.length} orientações cadastradas</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus className="w-4 h-4" />
          Nova Orientação
        </button>
      </div>

      {/* Search + Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por título ou tag..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-modern pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIAS.map(c => (
            <button
              key={c}
              onClick={() => setCatFilter(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                catFilter === c ? "bg-green-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="card p-5 h-40 animate-pulse bg-gray-50" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center text-gray-400">
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="font-medium">Nenhuma orientação encontrada</p>
          <p className="text-sm mt-1">Tente ajustar os filtros ou crie uma nova orientação.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(o => {
            const tags = Array.isArray(o.tags) ? o.tags : (o.tags ? o.tags.split(",").map(t=>t.trim()) : []);
            const isExpanded = expandedId === o.id;
            return (
              <div key={o.id} className="card p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-gray-900 text-sm leading-snug flex-1">{o.titulo}</h3>
                  <span className={`badge ${CAT_BADGE[o.categoria] || "badge-gray"} flex-shrink-0`}>{o.categoria}</span>
                </div>

                <p className={`text-xs text-gray-600 leading-relaxed ${isExpanded ? "" : "line-clamp-2"}`}>
                  {o.conteudo}
                </p>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {tags.map(t => (
                      <span key={t} className="inline-flex items-center gap-0.5 text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        <Tag className="w-2.5 h-2.5" />{t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 mt-auto pt-1 border-t border-gray-100 flex-wrap">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : o.id)}
                    className="btn-ghost text-xs py-1.5 px-3"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    {isExpanded ? "Recolher" : "Ver completo"}
                  </button>
                  <button onClick={() => handleCopy(o)} className="btn-ghost text-xs py-1.5 px-3">
                    <Copy className="w-3.5 h-3.5" />
                    Copiar
                  </button>
                  <button onClick={() => handleWhatsApp(o)} className="inline-flex items-center gap-1 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors">
                    <MessageCircle className="w-3.5 h-3.5" />
                    WhatsApp
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Orientacao Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="font-semibold text-gray-900">Nova Orientação</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                  className="input-modern"
                  placeholder="Ex: Hidratação Adequada"
                  value={form.titulo}
                  onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select
                  className="input-modern"
                  value={form.categoria}
                  onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}
                >
                  {CATEGORIAS.filter(c => c !== "Todos").map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Conteúdo</label>
                <textarea
                  className="input-modern resize-none"
                  rows={6}
                  placeholder="Escreva a orientação completa aqui..."
                  value={form.conteudo}
                  onChange={e => setForm(f => ({ ...f, conteudo: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (separadas por vírgula)</label>
                <input
                  className="input-modern"
                  placeholder="hidratação, geral, água"
                  value={form.tags}
                  onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t">
              <button onClick={() => setShowForm(false)} className="btn-ghost">Cancelar</button>
              <button
                onClick={handleSave}
                disabled={!form.titulo.trim() || !form.conteudo.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Salvar Orientação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
