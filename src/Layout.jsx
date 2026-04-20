import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/lib/AuthContext";
import { db as base44 } from "@/api/localDB";
import {
  Users, Calendar, LayoutDashboard, Utensils,
  Activity, FlaskConical, Menu, X, Leaf,
  DollarSign, Zap, Apple, BookOpen, Settings,
  Flame, PanelLeftClose, PanelLeftOpen, LogOut,
  ChevronRight, Shield, Printer, ClipboardList,
  BookMarked, FileCheck, MessageSquare, Bell,
  Scale, Search, Plus
} from "lucide-react";

// ── Paleta da sidebar ──────────────────────────────────────────────────────
const SIDEBAR_BG     = "#2D4F4F";
const SIDEBAR_HOVER  = "rgba(255,255,255,0.08)";
const SIDEBAR_ACTIVE = "rgba(255,255,255,0.12)";
const SIDEBAR_TEXT   = "rgba(255,255,255,0.70)";
const SIDEBAR_WHITE  = "#ffffff";
const SUCCESS        = "#1D9E75";

// ── Grupos de navegação ────────────────────────────────────────────────────
const NAV_GROUPS = [
  {
    title: "Principal",
    items: [
      { name: "Dashboard",            icon: LayoutDashboard, page: "Dashboard"              },
      { name: "Pacientes",            icon: Users,           page: "Patients",  badge: "patients" },
      { name: "Agenda",               icon: Calendar,        page: "Schedule",  badge: "today"    },
    ],
  },
  {
    title: "Clínico",
    items: [
      { name: "Planos Alimentares",    icon: Utensils,        page: "MealPlans"               },
      { name: "Antropometria",         icon: Scale,           page: "Anthropometry"           },
      { name: "Diário Alimentar",      icon: BookOpen,        page: "DiarioAlimentar"         },
      { name: "Exames Laboratoriais",  icon: FlaskConical,    page: "LabExams"                },
      { name: "Plano Energético",      icon: Flame,           page: "PlanejamentoEnergetico"  },
      { name: "Pedido de Exames",      icon: ClipboardList,   page: "PedidoExames"            },
      { name: "Atestados e Recibos",   icon: FileCheck,       page: "Atestados"               },
      { name: "Orientações",           icon: BookMarked,      page: "Orientacoes"             },
    ],
  },
  {
    title: "Ferramentas",
    items: [
      { name: "Assistente NutriAI",    icon: Zap,             page: "NutriAI"           },
      { name: "Impressos",             icon: Printer,         page: "Impressos"         },
      { name: "Financeiro",            icon: DollarSign,      page: "Financial"         },
      { name: "Modelos de Mensagem",   icon: MessageSquare,   page: "ModelosMensagens"  },
      { name: "Msg. Automáticas",      icon: Bell,            page: "MensagensAuto"     },
      { name: "Acessos ao Portal",     icon: Shield,          page: "PacientesAcesso"   },
      { name: "Tabela de Alimentos",   icon: Apple,           page: "TabelaAlimentos"   },
    ],
  },
];

// Títulos das páginas para o topbar
const PAGE_TITLES = {
  Dashboard: "Dashboard", Patients: "Pacientes", Schedule: "Agenda",
  MealPlans: "Planos Alimentares", Anthropometry: "Antropometria",
  DiarioAlimentar: "Diário Alimentar", LabExams: "Exames Laboratoriais",
  PlanejamentoEnergetico: "Plano Energético", PedidoExames: "Pedido de Exames",
  Atestados: "Atestados e Recibos", Orientacoes: "Orientações",
  NutriAI: "Assistente NutriAI", Impressos: "Impressos",
  Financial: "Financeiro", ModelosMensagens: "Modelos de Mensagem",
  MensagensAuto: "Mensagens Automáticas", PacientesAcesso: "Acessos ao Portal",
  TabelaAlimentos: "Tabela de Alimentos", Settings: "Configurações",
  PatientDetail: "Ficha do Paciente",
};

// ── Item de navegação (sidebar escura) ───────────────────────────────────
function NavItem({ item, isActive, collapsed, badges }) {
  const badgeVal =
    item.badge === "patients" && item.page === "Patients" ? badges.patients :
    item.badge === "today"    && item.page === "Schedule"  ? badges.today    : null;

  return (
    <Link
      to={createPageUrl(item.page)}
      title={collapsed ? item.name : undefined}
      className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer"
      style={{
        color:      isActive ? SIDEBAR_WHITE : SIDEBAR_TEXT,
        background: isActive ? SIDEBAR_ACTIVE : "transparent",
      }}
      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = SIDEBAR_HOVER; }}
      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
    >
      {/* Barra lateral do item ativo */}
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
          style={{ background: SUCCESS }} />
      )}

      <item.icon
        className="w-[18px] h-[18px] flex-shrink-0 stroke-[1.6] transition-colors"
        style={{ color: isActive ? SIDEBAR_WHITE : "rgba(255,255,255,0.55)" }}
      />

      {!collapsed && (
        <>
          <span className="truncate flex-1">{item.name}</span>
          {badgeVal != null && badgeVal > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-auto"
              style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.90)" }}>
              {badgeVal}
            </span>
          )}
          {isActive && !badgeVal && (
            <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-50" style={{ color: SUCCESS }} />
          )}
        </>
      )}
    </Link>
  );
}

// ── Layout ────────────────────────────────────────────────────────────────
export default function Layout({ children, currentPageName }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed,   setCollapsed]   = useState(false);
  const [badges,      setBadges]      = useState({ patients: 0, today: 0 });
  const [search,      setSearch]      = useState("");
  const searchRef = useRef();
  const navigate  = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const saved = localStorage.getItem("nf_sidebar_collapsed");
    if (saved === "true") setCollapsed(true);
  }, []);

  useEffect(() => {
    Promise.all([
      base44.entities.Patient.list("-created_date", 500),
      base44.entities.Consultation.list("-date", 200),
    ]).then(([pts, cons]) => {
      const today = new Date().toISOString().split("T")[0];
      setBadges({
        patients: pts.filter(p => p.status === "ativo").length,
        today:    cons.filter(c => c.date === today && c.status === "agendada").length,
      });
    }).catch(() => {});
  }, []);

  const toggleCollapsed = () => {
    setCollapsed(v => {
      localStorage.setItem("nf_sidebar_collapsed", String(!v));
      return !v;
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const q = search.trim();
    if (q) {
      navigate(createPageUrl("Patients") + `?search=${encodeURIComponent(q)}`);
      setSearch("");
    }
  };

  const sidebarWidth = collapsed ? "w-[68px]" : "w-[220px]";
  const mainPad      = collapsed ? "lg:ml-[68px]" : "lg:ml-[220px]";
  const pageTitle    = PAGE_TITLES[currentPageName] || currentPageName || "NutriFlow";

  // ── Shared sidebar content ──
  const SidebarContent = ({ mobile = false }) => (
    <>
      {/* Logo */}
      <div
        className={`flex items-center gap-2.5 px-4 py-5 ${collapsed && !mobile ? "justify-center" : ""}`}
        style={{ borderBottom: "1px solid rgba(255,255,255,0.10)" }}
      >
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
          style={{ background: "rgba(255,255,255,0.15)" }}>
          <Leaf className="w-4 h-4 text-white" />
        </div>
        {(!collapsed || mobile) && (
          <div className="leading-tight">
            <h1 className="font-display text-[17px] leading-none tracking-tight text-white">
              Nutri<span style={{ color: "#6EE7B7" }}>Flow</span>
            </h1>
            <p className="text-[9px] font-medium tracking-wider uppercase mt-0.5"
              style={{ color: "rgba(255,255,255,0.45)" }}>
              gestão clínica
            </p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2.5 py-4 space-y-4 overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            {(!collapsed || mobile) && (
              <p className="text-[9.5px] font-semibold uppercase tracking-[0.12em] px-3 mb-1.5"
                style={{ color: "rgba(255,255,255,0.35)" }}>
                {group.title}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavItem
                  key={item.page}
                  item={item}
                  isActive={currentPageName === item.page}
                  collapsed={collapsed && !mobile}
                  badges={badges}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-2.5 space-y-0.5" style={{ borderTop: "1px solid rgba(255,255,255,0.10)" }}>
        {/* Configurações */}
        <Link
          to={createPageUrl("Settings")}
          title={collapsed && !mobile ? "Configurações" : undefined}
          className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer"
          style={{
            color:      currentPageName === "Settings" ? SIDEBAR_WHITE : SIDEBAR_TEXT,
            background: currentPageName === "Settings" ? SIDEBAR_ACTIVE : "transparent",
          }}
          onMouseEnter={e => { if (currentPageName !== "Settings") e.currentTarget.style.background = SIDEBAR_HOVER; }}
          onMouseLeave={e => { if (currentPageName !== "Settings") e.currentTarget.style.background = "transparent"; }}
        >
          <Settings className="w-[18px] h-[18px] flex-shrink-0 stroke-[1.6]"
            style={{ color: currentPageName === "Settings" ? SIDEBAR_WHITE : "rgba(255,255,255,0.55)" }} />
          {(!collapsed || mobile) && <span>Configurações</span>}
        </Link>

        {/* Modo Foco (só desktop) */}
        {!mobile && (
          <button
            onClick={toggleCollapsed}
            title={collapsed ? "Expandir menu" : "Modo Foco"}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer w-full text-left"
            style={{ color: SIDEBAR_TEXT }}
            onMouseEnter={e => e.currentTarget.style.background = SIDEBAR_HOVER}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            {collapsed
              ? <PanelLeftOpen  className="w-[18px] h-[18px] stroke-[1.6]" style={{ color: "rgba(255,255,255,0.55)" }} />
              : <PanelLeftClose className="w-[18px] h-[18px] stroke-[1.6]" style={{ color: "rgba(255,255,255,0.55)" }} />
            }
            {!collapsed && <span>Modo Foco</span>}
          </button>
        )}

        {/* User card */}
        {(!collapsed || mobile) ? (
          <div className="mt-1 flex items-center gap-2.5 px-3 py-2 rounded-xl"
            style={{ background: "rgba(255,255,255,0.10)" }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.20)" }}>
              {user?.nome?.[0]?.toUpperCase() || "N"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.nome || "Nutricionista"}</p>
              <p className="text-[10px] truncate" style={{ color: "rgba(255,255,255,0.45)" }}>
                CRN · Admin
              </p>
            </div>
            <button onClick={logout} title="Sair"
              className="transition-colors"
              style={{ color: "rgba(255,255,255,0.45)" }}
              onMouseEnter={e => e.currentTarget.style.color = "#FCA5A5"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.45)"}>
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button onClick={logout} title="Sair"
            className="flex items-center justify-center w-full px-3 py-2.5 rounded-xl transition-all duration-150"
            style={{ color: "rgba(255,255,255,0.45)" }}
            onMouseEnter={e => { e.currentTarget.style.background = SIDEBAR_HOVER; e.currentTarget.style.color = "#FCA5A5"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.45)"; }}>
            <LogOut className="w-[18px] h-[18px]" />
          </button>
        )}
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex" style={{ background: "#F8F9FA" }}>

      {/* ── Desktop Sidebar ── */}
      <aside
        className={`hidden lg:flex flex-col ${sidebarWidth} fixed h-full z-20 transition-all duration-200 ease-in-out`}
        style={{ background: SIDEBAR_BG }}
      >
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar overlay ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-72 h-full shadow-2xl flex flex-col"
            style={{ background: SIDEBAR_BG }}>
            {/* Mobile close button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors z-10"
              style={{ color: "rgba(255,255,255,0.60)" }}
              onMouseEnter={e => e.currentTarget.style.background = SIDEBAR_HOVER}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <X className="w-4 h-4" />
            </button>
            {/* Wrap each Link in mobile so it closes sidebar */}
            <div className="flex flex-col h-full" onClick={() => setSidebarOpen(false)}>
              <SidebarContent mobile />
            </div>
          </aside>
        </div>
      )}

      {/* ── Main area ── */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-200 ${mainPad}`}>

        {/* Mobile topbar */}
        <header className="lg:hidden bg-white px-4 py-3 flex items-center gap-3 sticky top-0 z-10"
          style={{ boxShadow: "0 1px 0 0 rgba(0,0,0,0.07)" }}>
          <button onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shadow-sm"
              style={{ background: SIDEBAR_BG }}>
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-base" style={{ color: SIDEBAR_BG }}>
              Nutri<span style={{ color: SUCCESS }}>Flow</span>
            </span>
          </div>
        </header>

        {/* Desktop topbar */}
        <header
          className="hidden lg:flex items-center justify-between gap-4 bg-white px-6 sticky top-0 z-10"
          style={{ height: "56px", boxShadow: "var(--shadow-topbar)" }}
        >
          {/* Título da página */}
          <h2 className="text-[15px] font-semibold text-gray-800 tracking-tight">{pageTitle}</h2>

          {/* Busca rápida + CTA */}
          <div className="flex items-center gap-3">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                ref={searchRef}
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar paciente..."
                className="pl-9 pr-4 py-1.5 text-sm rounded-xl w-52 transition-all focus:outline-none"
                style={{
                  background: "#F8F9FA",
                  border: "1px solid hsl(214, 20%, 90%)",
                }}
                onFocus={e => { e.target.style.borderColor = SIDEBAR_BG; e.target.style.boxShadow = `0 0 0 3px rgba(45,79,79,0.12)`; }}
                onBlur={e => { e.target.style.borderColor = "hsl(214, 20%, 90%)"; e.target.style.boxShadow = "none"; }}
              />
            </form>

            <Link
              to={createPageUrl("Schedule")}
              className="inline-flex items-center gap-1.5 text-white text-sm font-semibold px-3.5 py-1.5 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-[0.97]"
              style={{ background: SUCCESS }}
            >
              <Plus className="w-3.5 h-3.5" />
              Nova consulta
            </Link>
          </div>
        </header>

        {/* Conteúdo principal */}
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
