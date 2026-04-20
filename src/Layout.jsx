import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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

// ── Grupos de navegação ────────────────────────────────────────────────────
const NAV_GROUPS = [
  {
    title: "Principal",
    items: [
      { name: "Dashboard",   icon: LayoutDashboard, page: "Dashboard", badge: "patients" },
      { name: "Pacientes",   icon: Users,           page: "Patients",  badge: "patients" },
      { name: "Agenda",      icon: Calendar,        page: "Schedule",  badge: "today" },
    ],
  },
  {
    title: "Clínico",
    items: [
      { name: "Planos Alimentares", icon: Utensils,      page: "MealPlans"              },
      { name: "Antropometria",      icon: Scale,          page: "Anthropometry"          },
      { name: "Diário Alimentar",   icon: BookOpen,       page: "DiarioAlimentar"        },
      { name: "Exames Laboratoriais",icon: FlaskConical,  page: "LabExams"               },
      { name: "Plano Energético",   icon: Flame,          page: "PlanejamentoEnergetico" },
      { name: "Pedido de Exames",   icon: ClipboardList,  page: "PedidoExames"           },
      { name: "Atestados e Recibos",icon: FileCheck,      page: "Atestados"              },
      { name: "Orientações",        icon: BookMarked,     page: "Orientacoes"            },
    ],
  },
  {
    title: "Ferramentas",
    items: [
      { name: "Assistente NutriAI", icon: Zap,           page: "NutriAI"          },
      { name: "Impressos",          icon: Printer,        page: "Impressos"        },
      { name: "Financeiro",         icon: DollarSign,     page: "Financial"        },
      { name: "Modelos de Mensagem",icon: MessageSquare,  page: "ModelosMensagens" },
      { name: "Msg. Automáticas",   icon: Bell,           page: "MensagensAuto"    },
      { name: "Acessos ao Portal",  icon: Shield,         page: "PacientesAcesso"  },
      { name: "Tabela de Alimentos",icon: Apple,          page: "TabelaAlimentos"  },
    ],
  },
];

// Nomes legíveis para o topbar
const PAGE_TITLES = {
  Dashboard: "Dashboard",
  Patients: "Pacientes",
  Schedule: "Agenda",
  MealPlans: "Planos Alimentares",
  Anthropometry: "Antropometria",
  DiarioAlimentar: "Diário Alimentar",
  LabExams: "Exames Laboratoriais",
  PlanejamentoEnergetico: "Plano Energético",
  PedidoExames: "Pedido de Exames",
  Atestados: "Atestados e Recibos",
  Orientacoes: "Orientações",
  NutriAI: "Assistente NutriAI",
  Impressos: "Impressos",
  Financial: "Financeiro",
  ModelosMensagens: "Modelos de Mensagem",
  MensagensAuto: "Mensagens Automáticas",
  PacientesAcesso: "Acessos ao Portal",
  TabelaAlimentos: "Tabela de Alimentos",
  Settings: "Configurações",
  PatientDetail: "Ficha do Paciente",
};

// ── Item de navegação ─────────────────────────────────────────────────────
function NavItem({ item, isActive, collapsed, badges }) {
  const badgeVal =
    item.badge === "patients" && item.page === "Patients" ? badges.patients :
    item.badge === "today"    && item.page === "Schedule"  ? badges.today    : null;

  return (
    <Link
      to={createPageUrl(item.page)}
      title={collapsed ? item.name : undefined}
      className={`nav-item group ${isActive ? "nav-item-active" : ""}`}
    >
      <item.icon
        className={`w-[18px] h-[18px] flex-shrink-0 stroke-[1.6] transition-colors ${
          isActive ? "" : "text-gray-400 group-hover:text-gray-600"
        }`}
        style={isActive ? { color: "#1D9E75" } : {}}
      />
      {!collapsed && (
        <>
          <span className="sidebar-label truncate flex-1">{item.name}</span>
          {badgeVal != null && badgeVal > 0 && (
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-auto"
              style={{ background: "#E1F5EE", color: "#0F6E56" }}
            >
              {badgeVal}
            </span>
          )}
        </>
      )}
      {isActive && !collapsed && !badgeVal && (
        <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-40" style={{ color: "#1D9E75" }} />
      )}
    </Link>
  );
}

// ── Layout principal ──────────────────────────────────────────────────────
export default function Layout({ children, currentPageName }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed,   setCollapsed]   = useState(false);
  const [badges,      setBadges]      = useState({ patients: 0, today: 0 });
  const [search,      setSearch]      = useState("");
  const searchRef = useRef();
  const navigate  = useNavigate();
  const { user, logout } = useAuth();

  // Persist collapsed state
  useEffect(() => {
    const saved = localStorage.getItem("nf_sidebar_collapsed");
    if (saved === "true") setCollapsed(true);
  }, []);

  // Fetch badge counts
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

  return (
    <div className="min-h-screen bg-[#F8FAFB] flex">

      {/* ── Desktop Sidebar ── */}
      <aside
        className={`hidden lg:flex flex-col ${sidebarWidth} bg-white border-r border-[#E9EDF2]
                    fixed h-full z-20 transition-all duration-200 ease-in-out`}
      >
        {/* Logo */}
        <div className={`flex items-center gap-2.5 px-4 py-5 border-b border-[#E9EDF2] ${collapsed ? "justify-center" : ""}`}>
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
            style={{ background: "linear-gradient(135deg, #1D9E75 0%, #0d7a5a 100%)" }}
          >
            <Leaf className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <h1 className="font-display text-[17px] leading-none tracking-tight text-gray-900">
                Nutri<span style={{ color: "#1D9E75" }}>Flow</span>
              </h1>
              <p className="text-[9px] text-gray-400 font-medium tracking-wider uppercase mt-0.5">
                gestão clínica
              </p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2.5 py-4 space-y-4 overflow-y-auto">
          {NAV_GROUPS.map((group) => (
            <div key={group.title}>
              {!collapsed && (
                <p className="text-[9.5px] font-semibold text-gray-400 uppercase tracking-[0.12em] px-3 mb-1.5">
                  {group.title}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavItem
                    key={item.page}
                    item={item}
                    isActive={currentPageName === item.page}
                    collapsed={collapsed}
                    badges={badges}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="border-t border-[#E9EDF2] p-2.5 space-y-0.5">
          <Link
            to={createPageUrl("Settings")}
            className={`nav-item ${currentPageName === "Settings" ? "nav-item-active" : ""}`}
          >
            <Settings className="w-[18px] h-[18px] flex-shrink-0 stroke-[1.6] text-gray-400" />
            {!collapsed && <span className="sidebar-label text-sm">Configurações</span>}
          </Link>

          <button
            onClick={toggleCollapsed}
            title={collapsed ? "Expandir menu" : "Modo Foco"}
            className="nav-item w-full text-left"
          >
            {collapsed
              ? <PanelLeftOpen  className="w-[18px] h-[18px] flex-shrink-0 stroke-[1.6] text-gray-400" />
              : <PanelLeftClose className="w-[18px] h-[18px] flex-shrink-0 stroke-[1.6] text-gray-400" />
            }
            {!collapsed && <span className="sidebar-label text-sm text-gray-500">Modo Foco</span>}
          </button>

          {/* User card */}
          {!collapsed ? (
            <div className="mt-2 flex items-center gap-2.5 px-3 py-2 rounded-xl bg-gray-50 border border-[#E9EDF2]">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #1D9E75 0%, #0d7a5a 100%)" }}
              >
                {user?.nome?.[0]?.toUpperCase() || "N"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-800 truncate">{user?.nome || "Nutricionista"}</p>
                <p className="text-[10px] text-gray-400 truncate">CRN · Admin</p>
              </div>
              <button onClick={logout} title="Sair" className="text-gray-400 hover:text-red-500 transition-colors">
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button onClick={logout} title="Sair" className="nav-item w-full justify-center">
              <LogOut className="w-[18px] h-[18px] text-gray-400 hover:text-red-500 transition-colors" />
            </button>
          )}
        </div>
      </aside>

      {/* ── Mobile Sidebar ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-72 bg-white h-full shadow-2xl flex flex-col">
            <div className="p-4 flex items-center justify-between border-b border-[#E9EDF2]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm"
                  style={{ background: "linear-gradient(135deg, #1D9E75 0%, #0d7a5a 100%)" }}>
                  <Leaf className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="font-display text-[17px] leading-none text-gray-900">
                    Nutri<span style={{ color: "#1D9E75" }}>Flow</span>
                  </span>
                  <p className="text-[9px] text-gray-400 uppercase tracking-wider">gestão clínica</p>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <nav className="flex-1 px-2.5 py-4 space-y-4 overflow-y-auto">
              {NAV_GROUPS.map((group) => (
                <div key={group.title}>
                  <p className="text-[9.5px] font-semibold text-gray-400 uppercase tracking-[0.12em] px-3 mb-1.5">
                    {group.title}
                  </p>
                  <div className="space-y-0.5">
                    {group.items.map((item) => (
                      <Link
                        key={item.page}
                        to={createPageUrl(item.page)}
                        onClick={() => setSidebarOpen(false)}
                        className={`nav-item ${currentPageName === item.page ? "nav-item-active" : ""}`}
                      >
                        <item.icon
                          className={`w-[18px] h-[18px] flex-shrink-0 stroke-[1.6] ${currentPageName === item.page ? "" : "text-gray-400"}`}
                          style={currentPageName === item.page ? { color: "#1D9E75" } : {}}
                        />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
            <div className="p-4 border-t border-[#E9EDF2]">
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-gray-50">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: "linear-gradient(135deg, #1D9E75 0%, #0d7a5a 100%)" }}>
                  {user?.nome?.[0]?.toUpperCase() || "N"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">{user?.nome || "Nutricionista"}</p>
                  <p className="text-[10px] text-gray-400 truncate">CRN · Admin</p>
                </div>
                <button onClick={logout} className="text-gray-400 hover:text-red-500 transition-colors">
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* ── Main Content ── */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-200 ${mainPad}`}>

        {/* Mobile topbar */}
        <header className="lg:hidden bg-white border-b border-[#E9EDF2] px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shadow-sm"
              style={{ background: "linear-gradient(135deg, #1D9E75 0%, #0d7a5a 100%)" }}>
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-base text-gray-900">
              Nutri<span style={{ color: "#1D9E75" }}>Flow</span>
            </span>
          </div>
        </header>

        {/* Desktop topbar */}
        <header className="hidden lg:flex items-center justify-between gap-4 bg-white border-b border-[#E9EDF2] px-6 sticky top-0 z-10"
          style={{ height: "56px" }}>
          {/* Page title */}
          <h2 className="text-[15px] font-semibold text-gray-800 tracking-tight">{pageTitle}</h2>

          {/* Quick search + CTA */}
          <div className="flex items-center gap-3">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                ref={searchRef}
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar paciente..."
                className="pl-9 pr-4 py-1.5 text-sm bg-gray-50 border border-[#E9EDF2] rounded-xl w-52
                           focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                style={{ "--tw-ring-color": "#1D9E75" + "40" }}
              />
            </form>

            <Link
              to={createPageUrl("Schedule")}
              className="inline-flex items-center gap-1.5 text-white text-sm font-semibold px-3.5 py-1.5 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-[0.97]"
              style={{ background: "#1D9E75" }}
            >
              <Plus className="w-3.5 h-3.5" />
              Nova consulta
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
