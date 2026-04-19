import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/lib/AuthContext";
import {
  Users, Calendar, LayoutDashboard, Utensils,
  Activity, FlaskConical, Menu, X, Leaf,
  DollarSign, Zap, Apple, BookOpen, Settings,
  Flame, PanelLeftClose, PanelLeftOpen, LogOut,
  ChevronRight, Shield, Printer, ClipboardList,
  BookMarked, FileCheck, MessageSquare, Bell
} from "lucide-react";

const NAV_GROUPS = [
  {
    title: "Consultório",
    items: [
      { name: "Dashboard",           icon: LayoutDashboard, page: "Dashboard"        },
      { name: "Pacientes",           icon: Users,           page: "Patients"         },
      { name: "Agenda",              icon: Calendar,        page: "Schedule"         },
      { name: "Prescrições",         icon: Utensils,        page: "MealPlans"        },
      { name: "Diário Alimentar",    icon: BookOpen,        page: "DiarioAlimentar"  },
      { name: "Impressos",           icon: Printer,         page: "Impressos"        },
    ],
  },
  {
    title: "Clínica",
    items: [
      { name: "Plano Energético",    icon: Flame,           page: "PlanejamentoEnergetico" },
      { name: "Avaliação Corporal",  icon: Activity,        page: "Anthropometry"          },
      { name: "Exames",              icon: FlaskConical,    page: "LabExams"               },
      { name: "Pedido de Exames",    icon: ClipboardList,   page: "PedidoExames"           },
      { name: "Orientações",         icon: BookMarked,      page: "Orientacoes"            },
      { name: "Atestados e Recibos", icon: FileCheck,       page: "Atestados"              },
    ],
  },
  {
    title: "Comunicação",
    items: [
      { name: "Modelos de Mensagem", icon: MessageSquare,   page: "ModelosMensagens"  },
      { name: "Msg. Automáticas",    icon: Bell,            page: "MensagensAuto"     },
      { name: "Acessos ao Portal",   icon: Shield,          page: "PacientesAcesso"   },
    ],
  },
  {
    title: "Ferramentas",
    items: [
      { name: "Tabela de Alimentos", icon: Apple,           page: "TabelaAlimentos"  },
      { name: "Financeiro",          icon: DollarSign,      page: "Financial"        },
      { name: "Assistente IA",       icon: Zap,             page: "NutriAI"          },
    ],
  },
];

function NavItem({ item, isActive, collapsed }) {
  return (
    <Link
      to={createPageUrl(item.page)}
      title={collapsed ? item.name : undefined}
      className={`nav-item group ${isActive ? "nav-item-active" : ""}`}
    >
      <item.icon
        className={`w-[18px] h-[18px] flex-shrink-0 stroke-[1.6] transition-colors ${
          isActive ? "text-green-600" : "text-gray-400 group-hover:text-gray-600"
        }`}
      />
      {!collapsed && (
        <span className="sidebar-label truncate">{item.name}</span>
      )}
      {isActive && !collapsed && (
        <ChevronRight className="w-3.5 h-3.5 ml-auto text-green-400 opacity-60" />
      )}
    </Link>
  );
}

export default function Layout({ children, currentPageName }) {
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [collapsed,   setCollapsed]     = useState(false);
  const { user, logout } = useAuth();

  // persist collapsed state
  useEffect(() => {
    const saved = localStorage.getItem("nf_sidebar_collapsed");
    if (saved === "true") setCollapsed(true);
  }, []);

  const toggleCollapsed = () => {
    setCollapsed(v => {
      localStorage.setItem("nf_sidebar_collapsed", String(!v));
      return !v;
    });
  };

  const sidebarWidth = collapsed ? "w-[68px]" : "w-64";

  return (
    <div className="min-h-screen bg-[#F8FAFB] flex">

      {/* ── Desktop Sidebar ── */}
      <aside
        className={`hidden lg:flex flex-col ${sidebarWidth} bg-white border-r border-[#E9EDF2]
                    fixed h-full z-20 transition-all duration-200 ease-in-out`}
        style={{ boxShadow: "1px 0 0 0 #E9EDF2" }}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 px-4 py-5 border-b border-[#E9EDF2] ${collapsed ? "justify-center" : ""}`}>
          <div className="w-8 h-8 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold text-gray-900 text-base leading-tight tracking-tight">NutriFlow</h1>
              <p className="text-[10px] text-gray-400 font-medium">Gestão Nutricional</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
          {NAV_GROUPS.map((group) => (
            <div key={group.title}>
              {!collapsed && (
                <p className="sidebar-section-title text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-1.5">
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
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom: Focus Mode + User */}
        <div className="border-t border-[#E9EDF2] p-3 space-y-1">
          <Link
            to={createPageUrl("Settings")}
            className={`nav-item ${currentPageName === "Settings" ? "nav-item-active" : ""}`}
          >
            <Settings className="w-[18px] h-[18px] flex-shrink-0 stroke-[1.6] text-gray-400" />
            {!collapsed && <span className="sidebar-label text-sm">Configurações</span>}
          </Link>

          {/* Focus Mode toggle */}
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
            <div className="mt-2 flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50 border border-[#E9EDF2]">
              <div className="w-7 h-7 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {user?.nome?.[0] || "N"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-800 truncate">{user?.nome || "Nutricionista"}</p>
                <p className="text-[10px] text-gray-400 truncate">{user?.email || "admin"}</p>
              </div>
              <button onClick={logout} title="Sair" className="text-gray-400 hover:text-red-500 transition-colors">
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={logout}
              title="Sair"
              className="nav-item w-full justify-center"
            >
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
            <div className="p-5 flex items-center justify-between border-b border-[#E9EDF2]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-600 rounded-xl flex items-center justify-center shadow-sm">
                  <Leaf className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-gray-900 tracking-tight">NutriFlow</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
              {NAV_GROUPS.map((group) => (
                <div key={group.title}>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-1.5">
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
                        <item.icon className={`w-[18px] h-[18px] flex-shrink-0 stroke-[1.6] ${currentPageName === item.page ? "text-green-600" : "text-gray-400"}`} />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
            <div className="p-4 border-t border-[#E9EDF2]">
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50">
                <div className="w-7 h-7 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {user?.nome?.[0] || "N"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">{user?.nome || "Nutricionista"}</p>
                  <p className="text-[10px] text-gray-400 truncate">{user?.email || "admin"}</p>
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
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-200 ${collapsed ? "lg:ml-[68px]" : "lg:ml-64"}`}>
        {/* Mobile top bar */}
        <header className="lg:hidden bg-white border-b border-[#E9EDF2] px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-green-600 rounded-lg flex items-center justify-center shadow-sm">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 tracking-tight">NutriFlow</span>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
