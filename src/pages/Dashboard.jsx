import { useState, useEffect } from "react";
import { db as base44 } from "@/api/localDB";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Users, Calendar, TrendingUp, DollarSign, Plus, ArrowRight, Zap } from "lucide-react";
import { format, isToday, parseISO, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";

/* ── Health Score circular widget ───────────────────────────── */
function HealthScoreRing({ score = 0, size = 88 }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * (score / 100);
  const colors =
    score >= 80 ? ["#16a34a", "#bbf7d0"] :
    score >= 55 ? ["#d97706", "#fef3c7"] :
                  ["#dc2626", "#fee2e2"];

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={colors[1]} strokeWidth={8} />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={colors[0]} strokeWidth={8}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.7s ease" }}
      />
    </svg>
  );
}

/* ── Consultation timeline item ─────────────────────────────── */
function TimelineItem({ c, isLast }) {
  const STATUS = {
    realizada: { dot: "bg-green-500",  badge: "badge badge-green" },
    cancelada:  { dot: "bg-red-400",   badge: "badge badge-red"   },
    falta:      { dot: "bg-orange-400",badge: "badge badge-amber" },
    agendada:   { dot: "bg-blue-500",  badge: "badge badge-blue"  },
  };
  const s = STATUS[c.status] || STATUS.agendada;

  return (
    <div className="flex gap-3 group">
      {/* Timeline line */}
      <div className="flex flex-col items-center">
        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1 ${s.dot} ring-2 ring-white`} />
        {!isLast && <div className="w-px flex-1 bg-gray-100 mt-1" />}
      </div>
      {/* Content */}
      <div className={`flex-1 pb-3 ${isLast ? "" : ""}`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
              {c.patient_name?.[0] || "P"}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800 leading-tight">{c.patient_name || "Paciente"}</p>
              <p className="text-[11px] text-gray-400">{c.time} · {c.type || "Consulta"}</p>
            </div>
          </div>
          <span className={s.badge}>{c.status}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Main page ──────────────────────────────────────────────── */
export default function Dashboard() {
  const [patients,      setPatients]      = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.Patient.list("-created_date", 50),
      base44.entities.Consultation.list("-date", 50),
    ]).then(([p, c]) => {
      setPatients(p);
      setConsultations(c);
      setLoading(false);
    });
  }, []);

  const today          = format(new Date(), "yyyy-MM-dd");
  const todayConsults  = consultations.filter(c => c.date === today);
  const activePatients = patients.filter(p => p.status === "ativo");
  const monthRevenue   = consultations
    .filter(c => c.paid && c.date?.startsWith(format(new Date(), "yyyy-MM")))
    .reduce((acc, c) => acc + (c.price || 0), 0);

  const upcoming = consultations
    .filter(c => c.date >= today && c.status === "agendada")
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .slice(0, 6);

  /* Health Score: heurística simples para demo */
  const totalP    = patients.length || 1;
  const adherence = Math.min(100, Math.round((activePatients.length / totalP) * 100));
  const hsScore   = loading ? 0 : Math.min(100, Math.round(adherence * 0.7 + Math.min(30, todayConsults.length * 5)));

  const stats = [
    { label: "Pacientes Ativos",  value: activePatients.length, icon: Users,       color: "stat-card-green",  sub: "+2 este mês",  iconBg: "bg-green-500/10 text-green-600"  },
    { label: "Consultas Hoje",    value: todayConsults.length,  icon: Calendar,    color: "stat-card-blue",   sub: "agendadas",    iconBg: "bg-blue-500/10 text-blue-600"    },
    { label: "Total Pacientes",   value: patients.length,       icon: TrendingUp,  color: "stat-card-purple", sub: "cadastrados",  iconBg: "bg-purple-500/10 text-purple-600"},
    { label: "Receita do Mês",    value: `R$ ${monthRevenue.toFixed(0)}`, icon: DollarSign, color: "stat-card-amber", sub: "recebido", iconBg: "bg-amber-500/10 text-amber-600"},
  ];

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <div className="space-y-6 fade-up">

      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">{greeting()}! 👋</h1>
          <p className="page-sub">
            {format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to={createPageUrl("Patients")} className="btn-primary">
            <Plus className="w-4 h-4" /> Novo Paciente
          </Link>
          <Link to={createPageUrl("Schedule")} className="btn-ghost">
            <Calendar className="w-4 h-4" /> Agenda
          </Link>
        </div>
      </div>

      {/* ── Stats + Health Score ── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Health Score widget */}
        <div className="col-span-2 lg:col-span-1 card p-5 flex flex-col items-center justify-center gap-2 text-center">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Score Clínico</p>
          <div className="relative">
            <HealthScoreRing score={loading ? 0 : hsScore} size={88} />
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-2xl font-bold text-gray-900 leading-none">{loading ? "—" : hsScore}</span>
              <span className="text-[9px] text-gray-400 font-medium">/100</span>
            </div>
          </div>
          <p className="text-xs font-semibold text-gray-600">
            {hsScore >= 80 ? "Ótimo" : hsScore >= 55 ? "Regular" : "Atenção"}
          </p>
        </div>

        {/* 4 stat cards */}
        {stats.map((stat, i) => (
          <div key={i} className={`stat-card ${stat.color}`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${stat.iconBg}`}>
              <stat.icon className="w-[18px] h-[18px]" />
            </div>
            <p className="text-[26px] font-extrabold text-gray-900 leading-none">
              {loading ? <span className="w-12 h-7 bg-gray-100 rounded-lg inline-block animate-pulse" /> : stat.value}
            </p>
            <p className="text-[13px] text-gray-600 font-medium mt-1">{stat.label}</p>
            <p className="text-xs text-green-600 mt-0.5 font-semibold">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Main grid ── */}
      <div className="grid lg:grid-cols-2 gap-5">

        {/* Timeline de hoje */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-gray-900">Consultas de Hoje</h2>
              <p className="text-xs text-gray-400 mt-0.5">{todayConsults.length} agendadas</p>
            </div>
            <Link to={createPageUrl("Schedule")} className="text-xs font-semibold text-green-600 hover:text-green-700 flex items-center gap-1 transition-colors">
              Ver agenda <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-12 bg-gray-50 rounded-xl animate-pulse" />)}
            </div>
          ) : todayConsults.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-300">
              <Calendar className="w-10 h-10 mb-2" strokeWidth={1.2} />
              <p className="text-sm font-medium text-gray-400">Nenhuma consulta hoje</p>
            </div>
          ) : (
            <div className="space-y-0">
              {todayConsults.map((c, i) => (
                <TimelineItem key={i} c={c} isLast={i === todayConsults.length - 1} />
              ))}
            </div>
          )}
        </div>

        {/* Pacientes recentes */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-gray-900">Pacientes Recentes</h2>
              <p className="text-xs text-gray-400 mt-0.5">{patients.length} cadastrados</p>
            </div>
            <Link to={createPageUrl("Patients")} className="text-xs font-semibold text-green-600 hover:text-green-700 flex items-center gap-1 transition-colors">
              Ver todos <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-14 bg-gray-50 rounded-xl animate-pulse" />)}
            </div>
          ) : (
            <div className="space-y-1.5">
              {patients.slice(0, 5).map((p, i) => (
                <Link
                  key={i}
                  to={createPageUrl(`PatientDetail?id=${p.id}`)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm">
                    {p.full_name?.[0] || "P"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{p.full_name}</p>
                    <p className="text-[11px] text-gray-400 truncate">{p.objective || "sem objetivo definido"}</p>
                  </div>
                  <span className={`badge flex-shrink-0 ${
                    p.status === "ativo" ? "badge-green" :
                    p.status === "novo"  ? "badge-blue"  :
                    "badge-gray"
                  }`}>{p.status}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 bg-green-500/10 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-green-600" />
          </div>
          <h2 className="font-bold text-gray-900">Ações Rápidas</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Nova Consulta",      icon: Calendar,   page: "Schedule",              color: "text-blue-600   bg-blue-500/8   border-blue-100   hover:bg-blue-500/12"   },
            { label: "Novo Plano",         icon: Plus,        page: "MealPlans",             color: "text-green-600  bg-green-500/8  border-green-100  hover:bg-green-500/12"  },
            { label: "Avaliação Corporal", icon: TrendingUp,  page: "Anthropometry",         color: "text-purple-600 bg-purple-500/8 border-purple-100 hover:bg-purple-500/12" },
            { label: "Cadastrar Paciente", icon: Users,       page: "Patients",              color: "text-amber-600  bg-amber-500/8  border-amber-100  hover:bg-amber-500/12"  },
          ].map((action, i) => (
            <Link
              key={i}
              to={createPageUrl(action.page)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all duration-150 active:scale-95 ${action.color}`}
            >
              <action.icon className="w-5 h-5" />
              <span className="text-xs font-semibold leading-tight">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Próximas consultas (mini-agenda) ── */}
      {upcoming.length > 0 && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900">Próximas Consultas</h2>
            <Link to={createPageUrl("Schedule")} className="text-xs font-semibold text-green-600 hover:text-green-700 flex items-center gap-1">
              Ver todas <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-0">
            {upcoming.map((c, i) => (
              <TimelineItem key={i} c={c} isLast={i === upcoming.length - 1} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
