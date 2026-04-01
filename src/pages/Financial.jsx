import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { DollarSign, TrendingUp, Calendar, Users, CheckCircle, XCircle, Clock, ChevronDown } from "lucide-react";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Financial() {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), "yyyy-MM"));

  useEffect(() => {
    base44.entities.Consultation.list("-date", 500).then(data => {
      setConsultations(data);
      setLoading(false);
    });
  }, []);

  const monthConsultations = consultations.filter(c => c.date?.startsWith(selectedMonth));
  const paidConsultations = monthConsultations.filter(c => c.paid);
  const unpaidConsultations = monthConsultations.filter(c => !c.paid && c.status !== "cancelada");

  const totalRevenue = paidConsultations.reduce((acc, c) => acc + (c.price || 0), 0);
  const pendingRevenue = unpaidConsultations.reduce((acc, c) => acc + (c.price || 0), 0);

  // Últimos 6 meses para o gráfico
  const chartData = Array.from({ length: 6 }, (_, i) => {
    const d = subMonths(new Date(), 5 - i);
    const monthStr = format(d, "yyyy-MM");
    const monthConsults = consultations.filter(c => c.date?.startsWith(monthStr) && c.paid);
    return {
      mes: format(d, "MMM", { locale: ptBR }),
      receita: monthConsults.reduce((acc, c) => acc + (c.price || 0), 0),
      consultas: monthConsults.length,
    };
  });

  const byPaymentMethod = paidConsultations.reduce((acc, c) => {
    const key = c.payment_method || "outros";
    acc[key] = (acc[key] || 0) + (c.price || 0);
    return acc;
  }, {});

  const methodLabels = { pix: "PIX", cartao: "Cartão", dinheiro: "Dinheiro", plano: "Plano" };

  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const d = subMonths(new Date(), i);
    return { value: format(d, "yyyy-MM"), label: format(d, "MMMM yyyy", { locale: ptBR }) };
  });

  const handleMarkPaid = async (id) => {
    await base44.entities.Consultation.update(id, { paid: true });
    setConsultations(prev => prev.map(c => c.id === id ? { ...c, paid: true } : c));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financeiro</h1>
          <p className="text-gray-500 text-sm">Controle de receitas e consultas</p>
        </div>
        <div className="relative">
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 capitalize"
          >
            {monthOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Receita Recebida", value: `R$ ${totalRevenue.toFixed(0)}`, icon: DollarSign, color: "bg-green-50 text-green-600", sub: `${paidConsultations.length} pagas` },
          { label: "A Receber", value: `R$ ${pendingRevenue.toFixed(0)}`, icon: Clock, color: "bg-amber-50 text-amber-600", sub: `${unpaidConsultations.length} pendentes` },
          { label: "Total Consultas", value: monthConsultations.length, icon: Calendar, color: "bg-blue-50 text-blue-600", sub: `no mês` },
          { label: "Taxa de Recebimento", value: monthConsultations.filter(c => c.status !== "cancelada").length > 0 ? `${Math.round((paidConsultations.length / Math.max(monthConsultations.filter(c => c.status !== "cancelada").length, 1)) * 100)}%` : "0%", icon: TrendingUp, color: "bg-purple-50 text-purple-600", sub: "consultas pagas" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-xl font-bold text-gray-900">{loading ? "..." : stat.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Evolução de Receita (6 meses)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barSize={30}>
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `R$${v}`} />
              <Tooltip formatter={(v) => [`R$ ${v}`, "Receita"]} />
              <Bar dataKey="receita" fill="#16a34a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Por forma de pagamento</h2>
          {Object.keys(byPaymentMethod).length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <DollarSign className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Nenhum pagamento neste mês</p>
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(byPaymentMethod).map(([method, value]) => (
                <div key={method} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm text-gray-700 capitalize">{methodLabels[method] || method}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">R$ {value.toFixed(0)}</span>
                </div>
              ))}
              <div className="pt-3 border-t border-gray-100 flex justify-between">
                <span className="text-sm font-semibold text-gray-700">Total</span>
                <span className="text-sm font-bold text-green-700">R$ {totalRevenue.toFixed(0)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Consultation List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Consultas do mês</h2>
        {loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 bg-gray-50 rounded-xl animate-pulse" />)}</div>
        ) : monthConsultations.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Calendar className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Nenhuma consulta neste mês</p>
          </div>
        ) : (
          <div className="space-y-2">
            {monthConsultations.sort((a, b) => a.date?.localeCompare(b.date)).map(c => (
              <div key={c.id} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm flex-shrink-0">
                  {c.patient_name?.[0] || "P"}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{c.patient_name}</p>
                  <p className="text-xs text-gray-400">{c.date} {c.time && `· ${c.time}`} · {c.type}</p>
                </div>
                <div className="text-right">
                  {c.price && <p className="text-sm font-semibold text-gray-800">R$ {c.price}</p>}
                  <p className="text-xs text-gray-400 capitalize">{c.payment_method || "-"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    c.status === "realizada" ? "bg-green-100 text-green-700" :
                    c.status === "cancelada" ? "bg-red-100 text-red-600" :
                    c.status === "falta" ? "bg-orange-100 text-orange-700" :
                    "bg-blue-100 text-blue-700"
                  }`}>{c.status}</span>
                  {c.paid ? (
                    <CheckCircle className="w-5 h-5 text-green-500" title="Pago" />
                  ) : c.status !== "cancelada" ? (
                    <button
                      onClick={() => handleMarkPaid(c.id)}
                      className="flex items-center gap-1 text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-lg hover:bg-amber-100 transition-colors font-medium"
                    >
                      Marcar pago
                    </button>
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-300" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}