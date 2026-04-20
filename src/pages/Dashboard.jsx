import { useState, useEffect } from "react";
import { db as base44 } from "@/api/localDB";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Users, Calendar, Utensils, Activity, FlaskConical,
  BookOpen, Printer, MessageSquare, Zap, DollarSign,
  Plus, ArrowRight, TrendingUp, CheckCircle2
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// ── Avatar com iniciais colorido ──────────────────────────────────────────
const AVATAR_COLORS = [
  ["#E1F5EE", "#0F6E56"], ["#EDE9FE", "#6D28D9"], ["#FEF3C7", "#92400E"],
  ["#DBEAFE", "#1D4ED8"], ["#FCE7F3", "#9D174D"], ["#D1FAE5", "#065F46"],
];

function Avatar({ name, size = "md" }) {
  const idx    = (name?.charCodeAt(0) || 0) % AVATAR_COLORS.length;
  const [bg, fg] = AVATAR_COLORS[idx];
  const initials = (name || "?").split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
  const sz = size === "sm" ? "w-8 h-8 text-xs" : "w-9 h-9 text-sm";
  return (
    <div className={`${sz} rounded-full flex items-center justify-center font-bold flex-shrink-0`}
      style={{ background: bg, color: fg }}>
      {initials}
    </div>
  );
}

// ── Dot de status da consulta ─────────────────────────────────────────────
const TYPE_COLORS = {
  "Retorno":     "#1D9E75",
  "Primeira":    "#3B82F6",
  "Avaliação":   "#8B5CF6",
  "Online":      "#F59E0B",
  "Consulta":    "#1D9E75",
};

// ── 8 cards de módulos ────────────────────────────────────────────────────
const MODULES = [
  { name: "Planos Alimentares", icon: Utensils,    page: "MealPlans",     desc: "Crie e gerencie prescrições",    color: "#E1F5EE", fg: "#0F6E56" },
  { name: "Antropometria",      icon: Activity,    page: "Anthropometry", desc: "Avaliações e medidas corporais", color: "#EDE9FE", fg: "#6D28D9" },
  { name: "Diário Alimentar",   icon: BookOpen,    page: "DiarioAlimentar",desc: "Registro do dia a dia",         color: "#FEF3C7", fg: "#92400E" },
  { name: "Exames Lab.",        icon: FlaskConical,page: "LabExams",      desc: "Glicemia, lipidograma e mais",   color: "#DBEAFE", fg: "#1D4ED8" },
  { name: "Assistente NutriAI", icon: Zap,         page: "NutriAI",       desc: "Geração de planos com IA",       color: "#FCE7F3", fg: "#9D174D" },
  { name: "Impressos",          icon: Printer,     page: "Impressos",     desc: "Atestados, recibos, pedidos",    color: "#D1FAE5", fg: "#065F46" },
  { name: "Financeiro",         icon: DollarSign,  page: "Financial",     desc: "Receitas e controle de caixa",   color: "#FEF9C3", fg: "#854D0E" },
  { name: "Mensagens",          icon: MessageSquare,page:"ModelosMensagens",desc:"Templates e envio automático", color: "#E0F2FE", fg: "#0369A1" },
];

// ── Main ──────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [patients,      setPatients]      = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [mealPlans,     setMealPlans]     = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [patientTab,    setPatientTab]    = useState("todos");

  useEffect(() => {
    Promise.all([
      base44.entities.Patient.list("-created_date", 100),
      base44.entities.Consultation.list("-date", 200),
      base44.entities.MealPlan.list("-created_date", 200),
    ]).then(([p, c, m]) => {
      setPatients(p);
      setConsultations(c);
      setMealPlans(m);
      setLoading(false);
    });
  }, []);

  const today       = format(new Date(), "yyyy-MM-dd");
  const thisMonth   = format(new Date(), "yyyy-MM");

  const todayConsults  = consultations.filter(c => c.date === today);
  const activePatients = patients.filter(p => p.status === "ativo");
  const newPatients    = patients.filter(p => p.status === "novo" || p.status === "Novo");
  const plansThisMonth = mealPlans.filter(m => m.created_date?.startsWith(thisMonth));
  const monthRevenue   = consultations
    .filter(c => c.paid && c.date?.startsWith(thisMonth))
    .reduce((sum, c) => sum + (c.price || 0), 0);

  // Patients by tab
  const tabPatients =
    patientTab === "ativos" ? activePatients :
    patientTab === "novos"  ? newPatients    :
    patients;

  // Greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  // ── KPI cards ──
  const kpis = [
    {
      label:   "Pacientes Ativos",
      value:   activePatients.length,
      sub:     `de ${patients.length} cadastrados`,
      icon:    Users,
      palette: { bar: "#1D9E75", bg: "#E1F5EE", fg: "#0F6E56" },
    },
    {
      label:   "Consultas Hoje",
      value:   todayConsults.length,
      sub:     `${todayConsults.filter(c => c.status === "agendada").length} agendadas`,
      icon:    Calendar,
      palette: { bar: "#3B82F6", bg: "#DBEAFE", fg: "#1D4ED8" },
    },
    {
      label:   "Planos do Mês",
      value:   plansThisMonth.length,
      sub:     `${mealPlans.length} no total`,
      icon:    Utensils,
      palette: { bar: "#8B5CF6", bg: "#EDE9FE", fg: "#6D28D9" },
    },
    {
      label:   "Receita do Mês",
      value:   `R$ ${monthRevenue.toFixed(0)}`,
      sub:     "pagamentos confirmados",
      icon:    DollarSign,
      palette: { bar: "#F59E0B", bg: "#FEF3C7", fg: "#92400E" },
    },
  ];

  return (
    <div className="space-y-6 fade-up">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">
            {greeting}! 👋
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to={createPageUrl("Schedule")} className="btn-primary" style={{ background: "#1D9E75" }}>
            <Plus className="w-4 h-4" /> Nova consulta
          </Link>
          <Link to={createPageUrl("Patients")} className="btn-ghost">
            <Users className="w-4 h-4" /> Pacientes
          </Link>
        </div>
      </div>

      {/* ── BLOCO 1: 4 KPI cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <div key={i} className="card p-5 relative overflow-hidden">
            {/* accent bar */}
            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl"
              style={{ background: k.palette.bar }} />
            <div className="flex items-start justify-between mt-1">
              <div>
                <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide mb-2">
                  {k.label}
                </p>
                {loading
                  ? <div className="w-14 h-8 bg-gray-100 rounded-lg animate-pulse" />
                  : <p className="text-[28px] font-extrabold text-gray-900 leading-none">{k.value}</p>
                }
                <p className="text-xs mt-1.5 font-medium" style={{ color: k.palette.fg }}>
                  {k.sub}
                </p>
              </div>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: k.palette.bg }}>
                <k.icon className="w-[18px] h-[18px]" style={{ color: k.palette.fg }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── BLOCO 2: Pacientes + Agenda ── */}
      <div className="grid lg:grid-cols-2 gap-5">

        {/* Pacientes com abas */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 text-[15px]">Pacientes</h2>
            <Link to={createPageUrl("Patients")}
              className="text-xs font-semibold flex items-center gap-1 hover:underline"
              style={{ color: "#1D9E75" }}>
              Ver todos <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Abas */}
          <div className="flex gap-1 mb-4 bg-gray-100 rounded-xl p-1">
            {[
              { key: "todos",  label: `Todos (${patients.length})` },
              { key: "ativos", label: `Ativos (${activePatients.length})` },
              { key: "novos",  label: `Novos (${newPatients.length})` },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setPatientTab(tab.key)}
                className="flex-1 text-xs font-semibold px-2 py-1.5 rounded-lg transition-all"
                style={
                  patientTab === tab.key
                    ? { background: "#1D9E75", color: "#fff" }
                    : { color: "#6B7280" }
                }
              >
                {tab.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-12 bg-gray-50 rounded-xl animate-pulse" />)}
            </div>
          ) : tabPatients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-300">
              <Users className="w-10 h-10 mb-2" strokeWidth={1.2} />
              <p className="text-sm text-gray-400">Nenhum paciente</p>
            </div>
          ) : (
            <div className="space-y-1">
              {tabPatients.slice(0, 6).map((p, i) => (
                <Link
                  key={i}
                  to={createPageUrl(`PatientDetail?id=${p.id}`)}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <Avatar name={p.full_name} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{p.full_name}</p>
                    <p className="text-[11px] text-gray-400 truncate">{p.objective || "—"}</p>
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

        {/* Agenda do dia */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-gray-900 text-[15px]">Agenda de Hoje</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {format(new Date(), "EEEE, d MMM", { locale: ptBR })}
              </p>
            </div>
            <Link to={createPageUrl("Schedule")}
              className="text-xs font-semibold flex items-center gap-1 hover:underline"
              style={{ color: "#1D9E75" }}>
              Ver agenda <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-14 bg-gray-50 rounded-xl animate-pulse" />)}
            </div>
          ) : todayConsults.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-300">
              <Calendar className="w-10 h-10 mb-2" strokeWidth={1.2} />
              <p className="text-sm text-gray-400">Nenhuma consulta hoje</p>
              <Link to={createPageUrl("Schedule")}
                className="mt-3 text-xs font-semibold px-4 py-2 rounded-xl text-white"
                style={{ background: "#1D9E75" }}>
                + Agendar
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {todayConsults
                .sort((a, b) => (a.time || "").localeCompare(b.time || ""))
                .map((c, i) => {
                  const dotColor = TYPE_COLORS[c.type] || "#1D9E75";
                  const done = c.status === "realizada";
                  return (
                    <div key={i}
                      className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                      {/* hora */}
                      <div className="text-center flex-shrink-0 w-10">
                        <p className="text-[11px] font-bold text-gray-700">{c.time || "—"}</p>
                      </div>
                      {/* dot */}
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ background: dotColor }} />
                      {/* info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{c.patient_name}</p>
                        <p className="text-[11px] text-gray-400">{c.type || "Consulta"}</p>
                      </div>
                      {/* status icon */}
                      {done && <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      {/* ── BLOCO 3: 8 módulos clínicos ── */}
      <div>
        <h2 className="font-bold text-gray-900 text-[15px] mb-3">Módulos Clínicos</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {MODULES.map((mod, i) => (
            <Link
              key={i}
              to={createPageUrl(mod.page)}
              className="card p-4 flex flex-col gap-2 hover:shadow-md transition-all active:scale-[0.98] group"
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: mod.color }}>
                <mod.icon className="w-[18px] h-[18px]" style={{ color: mod.fg }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 leading-snug group-hover:text-gray-900">
                  {mod.name}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">{mod.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
