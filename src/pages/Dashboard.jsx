import { useState, useEffect } from "react";
import { db as base44 } from "@/api/localDB";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Users, Calendar, TrendingUp, DollarSign, Plus, ArrowRight, Clock, ChevronRight } from "lucide-react";
import { format, isToday, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.Patient.list("-created_date", 50),
      base44.entities.Consultation.list("-date", 50)
    ]).then(([p, c]) => {
      setPatients(p);
      setConsultations(c);
      setLoading(false);
    });
  }, []);

  const today = format(new Date(), "yyyy-MM-dd");
  const todayConsultations = consultations.filter(c => c.date === today);
  const activePatients = patients.filter(p => p.status === "ativo");
  const monthRevenue = consultations
    .filter(c => c.paid && c.date?.startsWith(format(new Date(), "yyyy-MM")))
    .reduce((acc, c) => acc + (c.price || 0), 0);

  const upcomingConsultations = consultations
    .filter(c => c.date >= today && c.status === "agendada")
    .slice(0, 5);

  const stats = [
    { label: "Pacientes Ativos", value: activePatients.length, icon: Users, color: "bg-green-50 text-green-600", trend: "+2 este mês" },
    { label: "Consultas Hoje", value: todayConsultations.length, icon: Calendar, color: "bg-blue-50 text-blue-600", trend: "agendadas" },
    { label: "Total Pacientes", value: patients.length, icon: TrendingUp, color: "bg-purple-50 text-purple-600", trend: "cadastrados" },
    { label: "Receita do Mês", value: `R$ ${monthRevenue.toFixed(0)}`, icon: DollarSign, color: "bg-amber-50 text-amber-600", trend: "recebido" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bom dia! 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </p>
        </div>
        <div className="flex gap-3">
          <Link to={createPageUrl("Patients")} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors">
            <Plus className="w-4 h-4" />
            Novo Paciente
          </Link>
          <Link to={createPageUrl("Schedule")} className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
            <Calendar className="w-4 h-4" />
            Agenda
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{loading ? "..." : stat.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
            <p className="text-xs text-green-600 mt-1 font-medium">{stat.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Consultas de Hoje</h2>
            <Link to={createPageUrl("Schedule")} className="text-sm text-green-600 hover:underline flex items-center gap-1">
              Ver agenda <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 bg-gray-50 rounded-xl animate-pulse" />)}</div>
          ) : todayConsultations.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Calendar className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Nenhuma consulta hoje</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayConsultations.map((c, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-green-50 transition-colors">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm">
                    {c.patient_name?.[0] || "P"}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm">{c.patient_name || "Paciente"}</p>
                    <p className="text-xs text-gray-400">{c.time} · {c.type}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    c.status === "realizada" ? "bg-green-100 text-green-700" :
                    c.status === "cancelada" ? "bg-red-100 text-red-700" :
                    "bg-blue-100 text-blue-700"
                  }`}>{c.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Patients */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Pacientes Recentes</h2>
            <Link to={createPageUrl("Patients")} className="text-sm text-green-600 hover:underline flex items-center gap-1">
              Ver todos <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 bg-gray-50 rounded-xl animate-pulse" />)}</div>
          ) : (
            <div className="space-y-3">
              {patients.slice(0, 5).map((p, i) => (
                <Link key={i} to={createPageUrl(`PatientDetail?id=${p.id}`)} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-green-50 transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {p.full_name?.[0] || "P"}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm">{p.full_name}</p>
                    <p className="text-xs text-gray-400">{p.objective || "sem objetivo definido"}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    p.status === "ativo" ? "bg-green-100 text-green-700" :
                    p.status === "novo" ? "bg-blue-100 text-blue-700" :
                    "bg-gray-100 text-gray-500"
                  }`}>{p.status}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 text-white">
        <h2 className="font-semibold text-lg mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Nova Consulta", icon: Calendar, page: "Schedule" },
            { label: "Novo Plano Alimentar", icon: Plus, page: "MealPlans" },
            { label: "Avaliação Corporal", icon: TrendingUp, page: "Anthropometry" },
            { label: "Cadastrar Paciente", icon: Users, page: "Patients" },
          ].map((action, i) => (
            <Link key={i} to={createPageUrl(action.page)} className="bg-white/15 hover:bg-white/25 transition-colors rounded-xl p-4 flex flex-col items-center gap-2 text-center cursor-pointer">
              <action.icon className="w-6 h-6" />
              <span className="text-xs font-medium">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}