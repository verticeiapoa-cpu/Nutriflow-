import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Users, Calendar, LayoutDashboard, Utensils,
  Activity, FlaskConical, Menu, X, ChevronRight, Leaf, DollarSign, Zap, Apple, BookOpen, Settings
} from "lucide-react";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, page: "Dashboard" },
  { name: "Pacientes", icon: Users, page: "Patients" },
  { name: "Agenda", icon: Calendar, page: "Schedule" },
  { name: "Planos Alimentares", icon: Utensils, page: "MealPlans" },
  { name: "Avaliação Corporal", icon: Activity, page: "Anthropometry" },
  { name: "Exames", icon: FlaskConical, page: "LabExams" },
  { name: "Tabela de Alimentos", icon: Apple, page: "TabelaAlimentos" },
  { name: "Diário Alimentar", icon: BookOpen, page: "DiarioAlimentar" },
  { name: "Financeiro", icon: DollarSign, page: "Financial" },
  { name: "Assistente IA", icon: Zap, page: "NutriAI" },
  { name: "Configurações", icon: Settings, page: "Settings" },
];

export default function Layout({ children, currentPageName }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <style>{`
        :root {
          --primary: #16a34a;
          --primary-light: #dcfce7;
          --primary-dark: #15803d;
        }
      `}</style>

      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 shadow-sm fixed h-full z-20">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-lg leading-tight">NutriPro</h1>
              <p className="text-xs text-gray-400">Gestão Nutricional</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = currentPageName === item.page;
            return (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-green-50 text-green-700 shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-green-600" : ""}`} />
                {item.name}
                {isActive && <ChevronRight className="w-4 h-4 ml-auto text-green-400" />}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-50">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">N</div>
            <div>
              <p className="text-sm font-medium text-gray-800">Nutricionista</p>
              <p className="text-xs text-gray-400">CRN-0000</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-72 bg-white h-full shadow-2xl flex flex-col">
            <div className="p-5 flex items-center justify-between border-b">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-gray-900 text-lg">NutriPro</span>
              </div>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              {navItems.map((item) => {
                const isActive = currentPageName === item.page;
                return (
                  <Link
                    key={item.page}
                    to={createPageUrl(item.page)}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive ? "bg-green-50 text-green-700" : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar mobile */}
        <header className="lg:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-50">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-green-600 rounded-lg flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">NutriPro</span>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}