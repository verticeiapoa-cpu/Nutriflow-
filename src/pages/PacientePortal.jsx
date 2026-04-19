import { Leaf, LogOut, User, Apple, Calendar, FileText } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

export default function PacientePortal() {
  const { user, logout } = useAuth();

  const pacientes = JSON.parse(localStorage.getItem('nf_pacientes') || '[]');
  const pac = pacientes.find(p => p.id === user?.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900">NutriFlow</h1>
            <p className="text-xs text-gray-400">Portal do Paciente</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </header>

      <main className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Boas vindas */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
              <User className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Olá, {pac?.nome || user?.nome || "Paciente"}!
              </h2>
              <p className="text-gray-500 text-sm">Bem-vindo(a) ao seu portal de saúde.</p>
            </div>
          </div>
        </div>

        {/* Cards rápidos */}
        {pac && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <p className="text-xs text-gray-400 mb-1">Peso atual</p>
              <p className="text-2xl font-bold text-gray-900">{pac.peso || "—"} <span className="text-sm font-normal text-gray-400">kg</span></p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <p className="text-xs text-gray-400 mb-1">IMC</p>
              <p className="text-2xl font-bold text-gray-900">
                {pac.peso && pac.altura
                  ? (pac.peso / Math.pow(pac.altura / 100, 2)).toFixed(1)
                  : "—"}
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <p className="text-xs text-gray-400 mb-1">Objetivo</p>
              <p className="text-sm font-semibold text-gray-800">{pac.objetivo || "—"}</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <p className="text-xs text-gray-400 mb-1">Meta de peso</p>
              <p className="text-2xl font-bold text-green-600">{pac.meta || "—"} <span className="text-sm font-normal text-gray-400">kg</span></p>
            </div>
          </div>
        )}

        {/* Módulos em breve */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Módulos disponíveis</h3>
          <div className="space-y-3">
            {[
              { icon: Apple, label: "Plano Alimentar", desc: "Veja suas refeições do dia" },
              { icon: Calendar, label: "Consultas", desc: "Histórico e próximas consultas" },
              { icon: FileText, label: "Formulário Pré-Consulta", desc: "Responda antes da consulta" },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Icon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{label}</p>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
