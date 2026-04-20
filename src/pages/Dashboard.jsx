import { useState, useEffect } from "react";
import { db as base44 } from "@/api/localDB";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Users, Calendar, Utensils, Activity, FlaskConical,
  BookOpen, Printer, MessageSquare, Zap, DollarSign,
  Plus, ArrowRight, TrendingUp, CheckCircle2, TrendingDown
} from "lucide-react";
import { format, parseISO, subMonths, startOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ReferenceLine
} from "recharts";

// ── Paleta de design ──────────────────────────────────────────────────────
const PRIMARY  = "#2D4F4F";
const SUCCESS  = "#1D9E75";
const SLATE    = "#64748B";

// ── Avatar com iniciais colorido ──────────────────────────────────────────
const AVATAR_COLORS = [
  ["#E1F5EE", "#0F6E56"], ["#EDE9FE", "#6D28D9"], ["#FEF3C7", "#92400E"],
  ["#DBEAFE", "#1D4ED8"], ["#FCE7F3", "#9D174D"], ["#D1FAE5", "#065F46"],
];
function Avatar({ name, size = "md" }) {
  const idx      = (name?.charCodeAt(0) || 0) % AVATAR_COLORS.length;
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

// ── Dot de tipo de consulta ────────────────────────────────────────────────
const TYPE_COLORS = {
  "Retorno": SUCCESS, "Primeira": "#3B82F6", "Avaliação": "#8B5CF6",
  "Online": "#F59E0B", "Consulta": SUCCESS,
};

// ── Tooltip personalizado para o gráfico ─────────────────────────────────
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl shadow-lg px-3 py-2.5 text-xs"
      style={{ background: "white", border: "1px solid #E2E8F0" }}>
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-gray-500">{p.name}:</span>
          <span className="font-semibold text-gray-800">{p.value ?? "—"}</span>
        </div>
      ))}
    </div>
  );
}

// ── Gráfico de Evolução das Avaliações ───────────────────────────────────
function EvolutionChart({ data, loading }) {
  // data = [{ mes: "Jan/25", pesoMedio: 72.3, imcMedio: 24.1, count: 3 }, ...]
  const hasData   = !loading && data.length >= 2;
  const lastEntry = hasData ? data[data.length - 1] : null;
  const firstEntry= hasData ? data[0] : null;

  const weightDelta = hasData && firstEntry?.pesoMedio && lastEntry?.pesoMedio
    ? +(lastEntry.pesoMedio - firstEntry.pesoMedio).toFixed(1) : null;

  return (
    <div className="card p-5">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
        <div>
          <h2 className="font-semibold text-gray-900 text-[15px]">
            Evolução das Avaliações
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Peso médio e IMC médio dos pacientes avaliados por mês
          </p>
        </div>

        {/* Delta resumo */}
        {hasData && weightDelta !== null && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
            style={{
              background: weightDelta <= 0 ? "#E1F5EE" : "#FEF3C7",
              color:      weightDelta <= 0 ? "#0F6E56"  : "#92400E",
            }}>
            {weightDelta <= 0
              ? <TrendingDown className="w-3.5 h-3.5" />
              : <TrendingUp   className="w-3.5 h-3.5" />
            }
            {weightDelta > 0 ? "+" : ""}{weightDelta} kg
            <span className="font-normal opacity-70 ml-0.5">no período</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="h-44 bg-gray-50 rounded-xl animate-pulse" />
      ) : !hasData ? (
        /* Placeholder com dados de exemplo */
        <div className="relative">
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <div className="rounded-xl px-4 py-2.5 text-center"
              style={{ background: "rgba(45,79,79,0.07)" }}>
              <p className="text-sm font-semibold" style={{ color: PRIMARY }}>
                Sem avaliações suficientes
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Registre 2+ avaliações antropométricas para ver a evolução
              </p>
            </div>
          </div>
          {/* Gráfico placeholder semitransparente */}
          <div className="opacity-20 pointer-events-none">
            <ResponsiveContainer width="100%" height={176}>
              <AreaChart data={[
                { mes: "Out", pesoMedio: 78, imcMedio: 26.2 },
                { mes: "Nov", pesoMedio: 76.5, imcMedio: 25.7 },
                { mes: "Dez", pesoMedio: 75,  imcMedio: 25.2 },
                { mes: "Jan", pesoMedio: 73.8, imcMedio: 24.8 },
                { mes: "Fev", pesoMedio: 72.4, imcMedio: 24.3 },
                { mes: "Mar", pesoMedio: 71,  imcMedio: 23.9 },
              ]} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradPeso" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={PRIMARY} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={PRIMARY} stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Area type="monotone" dataKey="pesoMedio" stroke={PRIMARY} fill="url(#gradPeso)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        /* Gráfico real */
        <ResponsiveContainer width="100%" height={176}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="gradPesoReal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={PRIMARY} stopOpacity={0.25} />
                <stop offset="95%" stopColor={PRIMARY} stopOpacity={0}    />
              </linearGradient>
              <linearGradient id="gradIMC" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={SLATE} stopOpacity={0.15} />
                <stop offset="95%" stopColor={SLATE} stopOpacity={0}    />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
            <YAxis
              yAxisId="peso" orientation="left"
              tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false}
              label={{ value: "kg", angle: -90, position: "insideLeft", offset: 20, style: { fontSize: 10, fill: "#9CA3AF" } }}
            />
            <YAxis
              yAxisId="imc" orientation="right"
              tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false}
              label={{ value: "IMC", angle: 90, position: "insideRight", offset: 12, style: { fontSize: 10, fill: "#9CA3AF" } }}
            />
            <Tooltip content={<ChartTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
              formatter={v => <span style={{ color: "#6B7280" }}>{v}</span>}
            />
            <Area
              yAxisId="peso" type="monotone" dataKey="pesoMedio" name="Peso médio (kg)"
              stroke={PRIMARY} fill="url(#gradPesoReal)" strokeWidth={2}
              dot={{ r: 3, fill: PRIMARY, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
            <Line
              yAxisId="imc" type="monotone" dataKey="imcMedio" name="IMC médio"
              stroke={SLATE} strokeWidth={1.5} dot={{ r: 3, fill: SLATE, strokeWidth: 0 }}
              activeDot={{ r: 5 }} strokeDasharray="4 2"
            />
            <ReferenceLine yAxisId="imc" y={25} stroke="#F59E0B" strokeDasharray="3 3"
              label={{ value: "Eutrófico", position: "right", style: { fontSize: 9, fill: "#F59E0B" } }} />
          </AreaChart>
        </ResponsiveContainer>
      )}

      {/* Mini legenda de avaliações */}
      {hasData && (
        <div className="flex items-center gap-4 mt-3 pt-3" style={{ borderTop: "1px solid #F1F5F9" }}>
          {data.slice(-3).reverse().map((d, i) => (
            <div key={i} className="text-xs">
              <span className="text-gray-400">{d.mes}</span>
              <span className="font-semibold text-gray-800 ml-1.5">{d.pesoMedio ?? "—"} kg</span>
              <span className="text-gray-400 ml-1">· {d.count} aval.</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── 8 módulos clínicos ────────────────────────────────────────────────────
const MODULES = [
  { name: "Planos Alimentares", icon: Utensils,    page: "MealPlans",      desc: "Prescrições nutricionais",     color: "#E1F5EE", fg: "#0F6E56" },
  { name: "Antropometria",      icon: Activity,    page: "Anthropometry",  desc: "Avaliações corporais",         color: "#EDE9FE", fg: "#6D28D9" },
  { name: "Diário Alimentar",   icon: BookOpen,    page: "DiarioAlimentar",desc: "Registro do dia a dia",        color: "#FEF3C7", fg: "#92400E" },
  { name: "Exames Lab.",        icon: FlaskConical,page: "LabExams",       desc: "Glicemia, lipidograma...",     color: "#DBEAFE", fg: "#1D4ED8" },
  { name: "Assistente NutriAI", icon: Zap,         page: "NutriAI",        desc: "Geração de planos com IA",    color: "#FCE7F3", fg: "#9D174D" },
  { name: "Impressos",          icon: Printer,     page: "Impressos",      desc: "Atestados, recibos, pedidos", color: "#D1FAE5", fg: "#065F46" },
  { name: "Financeiro",         icon: DollarSign,  page: "Financial",      desc: "Receitas e controle de caixa",color: "#FEF9C3", fg: "#854D0E" },
  { name: "Mensagens",          icon: MessageSquare,page:"ModelosMensagens",desc:"Templates e automação",       color: "#E0F2FE", fg: "#0369A1" },
];

// ── Página ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [patients,      setPatients]      = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [mealPlans,     setMealPlans]     = useState([]);
  const [anthropometry, setAnthropometry] = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [patientTab,    setPatientTab]    = useState("todos");

  useEffect(() => {
    Promise.all([
      base44.entities.Patient.list("-created_date", 200),
      base44.entities.Consultation.list("-date", 500),
      base44.entities.MealPlan.list("-created_date", 200),
      base44.entities.Anthropometry.list("-date", 200),
    ]).then(([p, c, m, a]) => {
      setPatients(p);
      setConsultations(c);
      setMealPlans(m);
      setAnthropometry(a);
      setLoading(false);
    });
  }, []);

  // ── KPIs ──
  const today      = format(new Date(), "yyyy-MM-dd");
  const thisMonth  = format(new Date(), "yyyy-MM");

  const todayConsults  = consultations.filter(c => c.date === today);
  const activePatients = patients.filter(p => p.status === "ativo");
  const newPatients    = patients.filter(p => p.status === "novo" || p.status === "Novo");
  const plansThisMonth = mealPlans.filter(m => m.created_date?.startsWith(thisMonth));
  const monthRevenue   = consultations
    .filter(c => c.paid && c.date?.startsWith(thisMonth))
    .reduce((sum, c) => sum + (c.price || 0), 0);

  // ── Dados do gráfico de evolução ──
  // Agrupa antropometria por mês, calcula peso médio e IMC médio
  const evolutionData = (() => {
    if (!anthropometry.length) return [];

    const byMonth = {};
    anthropometry.forEach(a => {
      if (!a.date || !a.weight) return;
      try {
        const m = format(parseISO(a.date), "MMM/yy", { locale: ptBR });
        if (!byMonth[m]) byMonth[m] = { mes: m, pesos: [], imcs: [], rawDate: a.date };
        byMonth[m].pesos.push(parseFloat(a.weight));
        if (a.bmi) byMonth[m].imcs.push(parseFloat(a.bmi));
      } catch { /* datas inválidas */ }
    });

    // Ordena por data e pega últimos 6 meses
    return Object.values(byMonth)
      .sort((a, b) => a.rawDate.localeCompare(b.rawDate))
      .slice(-6)
      .map(({ mes, pesos, imcs }) => ({
        mes,
        pesoMedio: pesos.length ? +(pesos.reduce((s, v) => s + v, 0) / pesos.length).toFixed(1) : null,
        imcMedio:  imcs.length  ? +(imcs.reduce((s, v) => s + v, 0)  / imcs.length).toFixed(1)  : null,
        count: pesos.length,
      }));
  })();

  // ── Pacientes por aba ──
  const tabPatients =
    patientTab === "ativos" ? activePatients :
    patientTab === "novos"  ? newPatients    :
    patients;

  // ── Saudação ──
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  // ── KPI config ──
  const kpis = [
    {
      label:   "Pacientes Ativos",
      value:   activePatients.length,
      sub:     `de ${patients.length} cadastrados`,
      icon:    Users,
      palette: { bar: SUCCESS, bg: "#E1F5EE", fg: "#0F6E56" },
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
    <div className="space-y-5 fade-up">

      {/* ── Saudação ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-semibold text-gray-900 tracking-tight">
            {greeting}! 👋
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to={createPageUrl("Schedule")}
            className="inline-flex items-center gap-2 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
            style={{ background: SUCCESS }}>
            <Plus className="w-4 h-4" /> Nova consulta
          </Link>
          <Link to={createPageUrl("Patients")} className="btn-ghost">
            <Users className="w-4 h-4" /> Pacientes
          </Link>
        </div>
      </div>

      {/* ── BLOCO 0: Gráfico de Evolução (ANTES dos KPIs) ── */}
      <EvolutionChart data={evolutionData} loading={loading} />

      {/* ── BLOCO 1: 4 KPI cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <div key={i} className="card p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px]"
              style={{ background: k.palette.bar, borderRadius: "12px 12px 0 0" }} />
            <div className="flex items-start justify-between mt-1">
              <div>
                <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide mb-2">
                  {k.label}
                </p>
                {loading
                  ? <div className="w-14 h-8 bg-gray-100 rounded-lg animate-pulse" />
                  : <p className="text-[28px] font-bold text-gray-900 leading-none">{k.value}</p>
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

      {/* ── BLOCO 2: Pacientes (abas) + Agenda do dia ── */}
      <div className="grid lg:grid-cols-2 gap-5">

        {/* Pacientes com abas */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 text-[15px]">Pacientes</h2>
            <Link to={createPageUrl("Patients")}
              className="text-xs font-semibold flex items-center gap-1 hover:underline"
              style={{ color: SUCCESS }}>
              Ver todos <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Abas */}
          <div className="flex gap-1 mb-4 rounded-xl p-1" style={{ background: "#F1F5F9" }}>
            {[
              { key: "todos",  label: `Todos (${patients.length})` },
              { key: "ativos", label: `Ativos (${activePatients.length})` },
              { key: "novos",  label: `Novos (${newPatients.length})` },
            ].map(tab => (
              <button key={tab.key} onClick={() => setPatientTab(tab.key)}
                className="flex-1 text-xs font-semibold px-2 py-1.5 rounded-lg transition-all"
                style={patientTab === tab.key
                  ? { background: PRIMARY, color: "#fff" }
                  : { color: "#6B7280" }
                }>
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
            <div className="space-y-0.5">
              {tabPatients.slice(0, 6).map((p, i) => (
                <Link key={i}
                  to={createPageUrl(`PatientDetail?id=${p.id}`)}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors group">
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
              <h2 className="font-semibold text-gray-900 text-[15px]">Agenda de Hoje</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {format(new Date(), "EEEE, d MMM", { locale: ptBR })}
              </p>
            </div>
            <Link to={createPageUrl("Schedule")}
              className="text-xs font-semibold flex items-center gap-1 hover:underline"
              style={{ color: SUCCESS }}>
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
                style={{ background: SUCCESS }}>
                + Agendar
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {todayConsults
                .sort((a, b) => (a.time || "").localeCompare(b.time || ""))
                .map((c, i) => {
                  const dotColor = TYPE_COLORS[c.type] || SUCCESS;
                  const done     = c.status === "realizada";
                  return (
                    <div key={i}
                      className="flex items-center gap-3 p-3 rounded-xl border transition-colors"
                      style={{ borderColor: "#F1F5F9" }}>
                      <div className="text-center flex-shrink-0 w-10">
                        <p className="text-[11px] font-bold text-gray-700">{c.time || "—"}</p>
                      </div>
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ background: dotColor }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{c.patient_name}</p>
                        <p className="text-[11px] text-gray-400">{c.type || "Consulta"}</p>
                      </div>
                      {done && <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: SUCCESS }} />}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      {/* ── BLOCO 3: 8 módulos clínicos ── */}
      <div>
        <h2 className="font-semibold text-gray-900 text-[15px] mb-3">Módulos Clínicos</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {MODULES.map((mod, i) => (
            <Link key={i}
              to={createPageUrl(mod.page)}
              className="card p-4 flex flex-col gap-2 hover:shadow-md transition-all active:scale-[0.98] group cursor-pointer">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: mod.color }}>
                <mod.icon className="w-[18px] h-[18px]" style={{ color: mod.fg }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 leading-snug">{mod.name}</p>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">{mod.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
