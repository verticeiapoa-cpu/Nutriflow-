import { useState, useEffect } from "react";
import { db as base44 } from "@/api/localDB";
import {
  Bell, Calendar, Cake, MessageCircle, Check,
  AlertCircle, RefreshCw, ChevronRight, Search
} from "lucide-react";
import { format, parseISO, differenceInDays, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";

function Toast({ msg }) {
  if (!msg) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg fade-up">
      {msg}
    </div>
  );
}

const today = format(new Date(), "yyyy-MM-dd");

function getAge(birthDate) {
  if (!birthDate) return null;
  const bd = parseISO(birthDate);
  const now = new Date();
  let age = now.getFullYear() - bd.getFullYear();
  const m = now.getMonth() - bd.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < bd.getDate())) age--;
  return age;
}

function nextBirthday(birthDate) {
  if (!birthDate) return null;
  const bd = parseISO(birthDate);
  const now = new Date();
  const next = new Date(now.getFullYear(), bd.getMonth(), bd.getDate());
  if (next < now) next.setFullYear(now.getFullYear() + 1);
  return next;
}

function daysUntil(date) {
  if (!date) return null;
  const diff = differenceInDays(date, new Date());
  return diff;
}

export default function MensagensAuto() {
  const [patients,      setPatients]      = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [templates,     setTemplates]     = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [toast,         setToast]         = useState("");
  const [tab,           setTab]           = useState("aniversarios");
  const [sentIds,       setSentIds]       = useState(() => {
    try { return JSON.parse(localStorage.getItem("nf_msgs_enviadas") || "[]"); } catch { return []; }
  });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const load = async () => {
    const [p, c, t] = await Promise.all([
      base44.entities.Patient.list("-created_date", 200),
      base44.entities.Consultation.list("-date", 200),
      base44.entities.MensagemTemplate.list(),
    ]);
    setPatients(p);
    setConsultations(c);
    setTemplates(t);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const markSent = (key) => {
    const updated = [...sentIds, key];
    setSentIds(updated);
    localStorage.setItem("nf_msgs_enviadas", JSON.stringify(updated));
  };

  /* ── Aniversariantes próximos (30 dias) ── */
  const aniversariantes = patients
    .map(p => {
      const next = nextBirthday(p.birth_date);
      if (!next) return null;
      const days = daysUntil(next);
      if (days === null || days > 30 || days < 0) return null;
      return { ...p, nextBirthday: next, daysUntil: days };
    })
    .filter(Boolean)
    .sort((a, b) => a.daysUntil - b.daysUntil);

  /* ── Consultas próximas (48h) sem lembrete ── */
  const lembretes = consultations
    .filter(c => {
      if (c.status !== "agendada") return false;
      const diff = differenceInDays(parseISO(c.date), new Date());
      return diff >= 0 && diff <= 2;
    })
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .map(c => {
      const pat = patients.find(p => p.id === c.patient_id);
      return { ...c, phone: pat?.phone };
    });

  /* ── Templates por tipo ── */
  const tplAniv    = templates.find(t => t.nome?.toLowerCase().includes("aniversário") || t.nome?.toLowerCase().includes("aniversario")) || templates[1];
  const tplLembrete = templates.find(t => t.nome?.toLowerCase().includes("lembrete")) || templates[0];

  const cfg = (() => { try { return JSON.parse(localStorage.getItem("nf_config")) || {}; } catch { return {}; } })();

  const buildMsg = (tpl, pat, consulta) => {
    if (!tpl?.mensagem) return "";
    const d = consulta ? parseISO(consulta.date) : new Date();
    return tpl.mensagem
      .replace(/\|NOME\|/g, pat?.full_name || "")
      .replace(/\|DATA\|/g, consulta?.date ? consulta.date.split("-").reverse().join("/") : d.toLocaleDateString("pt-BR"))
      .replace(/\|HORA\|/g, consulta?.time || "")
      .replace(/\|NUTRICIONISTA\|/g, cfg.prof || "Nutricionista")
      .replace(/\|TELEFONE\|/g, pat?.phone || "")
      .replace(/\|EMAIL\|/g, pat?.email || "");
  };

  const sendWhatsApp = (phone, msg, key) => {
    if (!phone) { showToast("⚠️ Paciente sem telefone cadastrado."); return; }
    const clean = phone.replace(/\D/g, "");
    window.open(`https://wa.me/55${clean}?text=${encodeURIComponent(msg)}`, "_blank");
    markSent(key);
    showToast("✅ WhatsApp aberto!");
  };

  return (
    <div className="space-y-6 fade-up">
      <Toast msg={toast} />

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Bell className="w-6 h-6 text-green-600" /> Mensagens Automáticas
          </h1>
          <p className="page-sub">Lembretes de consulta e parabéns de aniversário via WhatsApp</p>
        </div>
        <button onClick={load} className="btn-ghost py-2">
          <RefreshCw className="w-4 h-4" /> Atualizar
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Aniversários (30 dias)", value: aniversariantes.length, icon: Cake,            cls: "stat-card-green",  iconCls: "bg-green-500/10 text-green-600"  },
          { label: "Lembretes pendentes",    value: lembretes.length,       icon: Calendar,         cls: "stat-card-blue",   iconCls: "bg-blue-500/10 text-blue-600"    },
          { label: "Modelos ativos",         value: templates.filter(t=>t.ativo!==false).length, icon: MessageCircle, cls: "stat-card-purple", iconCls: "bg-purple-500/10 text-purple-600" },
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

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {[["aniversarios","🎂 Aniversários"],["lembretes","📅 Lembretes de Consulta"]].map(([k,l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${tab===k ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
            {l}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="card p-4 h-16 animate-pulse bg-gray-50"/>)}</div>
      ) : tab === "aniversarios" ? (
        <>
          {!tplAniv && (
            <div className="card p-4 bg-amber-50 border-amber-200 text-sm text-amber-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              Crie um modelo chamado "Feliz Aniversário" em <strong>Modelos de Mensagem</strong> para personalizar o texto.
            </div>
          )}
          {aniversariantes.length === 0 ? (
            <div className="card p-12 text-center text-gray-400">
              <Cake className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Nenhum aniversariante nos próximos 30 dias</p>
            </div>
          ) : (
            <div className="space-y-3">
              {aniversariantes.map(p => {
                const key = `aniv-${p.id}-${new Date().getFullYear()}`;
                const wasSent = sentIds.includes(key);
                const msg = buildMsg(tplAniv, p, null) || `Olá ${p.full_name}! 🎂 Feliz aniversário! Que este novo ciclo seja cheio de saúde e conquistas! 💚`;
                return (
                  <div key={p.id} className="card p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {p.full_name?.[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{p.full_name}</p>
                        <p className="text-xs text-gray-400">
                          {p.daysUntil === 0
                            ? "🎉 Hoje é o aniversário!"
                            : `em ${p.daysUntil} dia${p.daysUntil > 1 ? "s" : ""} · ${format(p.nextBirthday, "d 'de' MMMM", { locale: ptBR })}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {wasSent && <Check className="w-4 h-4 text-green-500" title="Enviado" />}
                      <button
                        onClick={() => sendWhatsApp(p.phone, msg, key)}
                        className="btn-primary text-sm py-1.5 px-3"
                        title={p.phone ? "Enviar via WhatsApp" : "Sem telefone cadastrado"}
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        {wasSent ? "Reenviar" : "Enviar"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        /* Lembretes */
        <>
          {!tplLembrete && (
            <div className="card p-4 bg-amber-50 border-amber-200 text-sm text-amber-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              Crie um modelo chamado "Lembrete de Consulta" em <strong>Modelos de Mensagem</strong> para personalizar o texto.
            </div>
          )}
          {lembretes.length === 0 ? (
            <div className="card p-12 text-center text-gray-400">
              <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Nenhuma consulta nas próximas 48h</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lembretes.map(c => {
                const key = `lembrete-${c.id}`;
                const wasSent = sentIds.includes(key);
                const pat = patients.find(p => p.id === c.patient_id);
                const msg = buildMsg(tplLembrete, pat, c) || `Olá ${c.patient_name}! Lembrando que sua consulta é ${c.date} às ${c.time}. Confirma? 😊`;
                return (
                  <div key={c.id} className="card p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {c.patient_name?.[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{c.patient_name}</p>
                        <p className="text-xs text-gray-400">
                          {c.date?.split("-").reverse().join("/")} às {c.time}
                          {differenceInDays(parseISO(c.date), new Date()) === 0 && " — Hoje!"}
                          {differenceInDays(parseISO(c.date), new Date()) === 1 && " — Amanhã!"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {wasSent && <Check className="w-4 h-4 text-green-500" title="Enviado" />}
                      <button
                        onClick={() => sendWhatsApp(c.phone, msg, key)}
                        className="btn-primary text-sm py-1.5 px-3"
                        title={c.phone ? "Enviar lembrete via WhatsApp" : "Sem telefone cadastrado"}
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        {wasSent ? "Reenviar" : "Lembrete"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Dica */}
      <div className="card p-4 bg-green-50 border-green-100">
        <p className="text-sm font-semibold text-green-800 mb-1">Como funciona?</p>
        <ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
          <li>Mensagens são disparadas pelo <strong>WhatsApp</strong> (via wa.me) com um clique.</li>
          <li>Personalize os textos em <strong>Modelos de Mensagem</strong>.</li>
          <li>Aniversários são detectados automaticamente a partir da data de nascimento cadastrada.</li>
          <li>Lembretes aparecem para consultas agendadas nas próximas 48h.</li>
        </ul>
      </div>
    </div>
  );
}
