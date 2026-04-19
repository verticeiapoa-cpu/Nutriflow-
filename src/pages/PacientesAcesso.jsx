import { useState, useEffect } from "react";
import { db as base44 } from "@/api/localDB";
import {
  Shield, Mail, Check, X, Copy, MessageCircle,
  AlertCircle, UserCheck, UserX, ExternalLink, Search, RefreshCw
} from "lucide-react";

const PORTAL_URL = window.location.origin;

function StatusBadge({ active, hasEmail }) {
  if (!hasEmail) return (
    <span className="badge badge-amber flex items-center gap-1">
      <AlertCircle className="w-3 h-3" /> Sem e-mail
    </span>
  );
  return active
    ? <span className="badge badge-green flex items-center gap-1"><UserCheck className="w-3 h-3" /> Acesso ativo</span>
    : <span className="badge badge-gray  flex items-center gap-1"><UserX    className="w-3 h-3" /> Bloqueado</span>;
}

export default function PacientesAcesso() {
  const [patients,  setPatients]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");
  const [toast,     setToast]     = useState("");
  const [saving,    setSaving]    = useState(null); // id do paciente sendo salvo

  /* Carrega pacientes do BD local */
  const load = async () => {
    const data = await base44.entities.Patient.list("-created_date", 200);
    // Sincroniza com nf_pacientes (localStorage legado do index.html)
    const legado = JSON.parse(localStorage.getItem("nf_pacientes") || "[]");

    // Mescla: usa o registro do base44 como fonte principal,
    // mas preserva o flag portalAccess se já existia
    const merged = data.map(p => {
      const leg = legado.find(l => l.id === p.id || l.email === p.email);
      return {
        ...p,
        portalAccess: p.portalAccess ?? leg?.portalAccess ?? true,
        email: p.email || leg?.email || "",
      };
    });

    setPatients(merged);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  /* Alterna acesso e persiste nos dois storages */
  const toggleAccess = async (pat) => {
    const next = pat.portalAccess === false ? true : false;
    setSaving(pat.id);

    // Atualiza base44
    try {
      await base44.entities.Patient.update(pat.id, { portalAccess: next });
    } catch (_) { /* campo extra — ignora erro de schema */ }

    // Atualiza nf_pacientes (legado)
    const legado = JSON.parse(localStorage.getItem("nf_pacientes") || "[]");
    const idx = legado.findIndex(l => l.id === pat.id || l.email === pat.email);
    if (idx >= 0) {
      legado[idx].portalAccess = next;
    } else {
      legado.push({ id: pat.id, email: pat.email, nome: pat.full_name, portalAccess: next });
    }
    localStorage.setItem("nf_pacientes", JSON.stringify(legado));

    setPatients(ps => ps.map(p => p.id === pat.id ? { ...p, portalAccess: next } : p));
    setSaving(null);
    showToast(next ? `✅ Acesso liberado para ${pat.full_name}` : `🔒 Acesso bloqueado para ${pat.full_name}`);
  };

  /* Libera todos de uma vez */
  const liberarTodos = async () => {
    const semAcesso = filtered.filter(p => p.email && p.portalAccess !== true);
    for (const p of semAcesso) await toggleAccess({ ...p, portalAccess: false });
    showToast(`✅ ${semAcesso.length} pacientes liberados`);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(PORTAL_URL);
    showToast("🔗 Link copiado!");
  };

  const sendWhatsApp = (pat) => {
    const phone = pat.phone?.replace(/\D/g, "");
    if (!phone) { showToast("⚠️ Paciente sem telefone cadastrado."); return; }
    const msg = encodeURIComponent(
      `Olá ${pat.full_name}! 🌿\n\n` +
      `Seu acesso ao portal NutriFlow está liberado!\n\n` +
      `👉 Acesse: ${PORTAL_URL}\n` +
      `📧 Use seu e-mail: ${pat.email}\n\n` +
      `Qualquer dúvida, estou à disposição! 😊`
    );
    window.open(`https://wa.me/55${phone}?text=${msg}`, "_blank");
  };

  const filtered = patients.filter(p =>
    p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase())
  );

  const totalAtivos   = patients.filter(p => p.email && p.portalAccess !== false).length;
  const totalBloq     = patients.filter(p => p.email && p.portalAccess === false).length;
  const totalSemEmail = patients.filter(p => !p.email).length;

  return (
    <div className="space-y-6 fade-up">

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-sm px-5 py-3 rounded-2xl shadow-xl fade-up">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Shield className="w-6 h-6 text-green-600" /> Acessos ao Portal
          </h1>
          <p className="page-sub">Gerencie quais pacientes podem entrar no portal de saúde</p>
        </div>
        <div className="flex gap-2">
          <button onClick={copyLink} className="btn-ghost">
            <Copy className="w-4 h-4" /> Copiar link do portal
          </button>
          <a href={PORTAL_URL} target="_blank" rel="noreferrer" className="btn-ghost">
            <ExternalLink className="w-4 h-4" /> Abrir portal
          </a>
        </div>
      </div>

      {/* Link do portal */}
      <div className="card p-5 flex items-center gap-4 bg-green-50 border-green-200">
        <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <ExternalLink className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-green-800 mb-0.5">Link do Portal do Paciente</p>
          <p className="text-sm text-green-700 font-mono truncate">{PORTAL_URL}</p>
        </div>
        <button
          onClick={copyLink}
          className="flex-shrink-0 text-xs font-semibold text-green-700 bg-white border border-green-300 px-3 py-1.5 rounded-xl hover:bg-green-50 transition-colors"
        >
          Copiar
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Acesso ativo",  value: totalAtivos,   icon: UserCheck, cls: "stat-card-green",  iconCls: "bg-green-500/10 text-green-600"  },
          { label: "Bloqueados",    value: totalBloq,     icon: UserX,     cls: "stat-card-amber",  iconCls: "bg-amber-500/10 text-amber-600"  },
          { label: "Sem e-mail",    value: totalSemEmail, icon: AlertCircle,cls:"stat-card-purple", iconCls: "bg-purple-500/10 text-purple-600"},
        ].map(s => (
          <div key={s.label} className={`stat-card ${s.cls}`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${s.iconCls}`}>
              <s.icon className="w-[18px] h-[18px]" />
            </div>
            <p className="text-3xl font-extrabold text-gray-900 leading-none">{loading ? "—" : s.value}</p>
            <p className="text-[13px] text-gray-500 font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-modern pl-10"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="btn-ghost py-2">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={liberarTodos}
            className="btn-primary"
            disabled={filtered.filter(p => p.email && p.portalAccess !== true).length === 0}
          >
            <UserCheck className="w-4 h-4" /> Liberar todos
          </button>
        </div>
      </div>

      {/* Tabela */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1,2,3,4].map(i => <div key={i} className="h-16 bg-gray-50 rounded-xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-300">
            <Shield className="w-12 h-12 mb-3" strokeWidth={1.2} />
            <p className="text-sm font-medium text-gray-400">Nenhum paciente encontrado</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-gray-50/60">
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Paciente</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">E-mail de acesso</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filtered.map((pat) => {
                const hasEmail  = !!pat.email;
                const isActive  = hasEmail && pat.portalAccess !== false;
                const isSavingThis = saving === pat.id;

                return (
                  <tr key={pat.id} className="hover:bg-gray-50/60 transition-colors">
                    {/* Nome */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {pat.full_name?.[0] || "P"}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{pat.full_name}</p>
                          <p className="text-[11px] text-gray-400">{pat.objective || "—"}</p>
                        </div>
                      </div>
                    </td>

                    {/* E-mail */}
                    <td className="px-4 py-4">
                      {hasEmail ? (
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span className="text-sm text-gray-700 font-mono">{pat.email}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 italic">Não cadastrado</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <StatusBadge active={isActive} hasEmail={hasEmail} />
                    </td>

                    {/* Ações */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* Toggle acesso */}
                        {hasEmail && (
                          <button
                            onClick={() => toggleAccess(pat)}
                            disabled={isSavingThis}
                            title={isActive ? "Bloquear acesso" : "Liberar acesso"}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                              isActive ? "bg-green-500" : "bg-gray-200"
                            } ${isSavingThis ? "opacity-50" : ""}`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                              isActive ? "translate-x-6" : "translate-x-1"
                            }`} />
                          </button>
                        )}

                        {/* Enviar convite WhatsApp */}
                        {hasEmail && isActive && (
                          <button
                            onClick={() => sendWhatsApp(pat)}
                            title="Enviar convite via WhatsApp"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Instrução */}
      <div className="card p-5 border-blue-100 bg-blue-50/50">
        <p className="text-sm font-semibold text-blue-800 mb-2">Como funciona?</p>
        <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
          <li>Certifique-se de que o paciente tem um <strong>e-mail cadastrado</strong> no prontuário.</li>
          <li>Ative o <strong>toggle</strong> para liberar o acesso ao portal.</li>
          <li>Clique no ícone do WhatsApp para enviar o <strong>link de convite</strong> automaticamente.</li>
          <li>O paciente acessa <span className="font-mono">{PORTAL_URL}</span>, clica em <strong>"Paciente"</strong> e entra com o e-mail.</li>
        </ol>
      </div>
    </div>
  );
}
