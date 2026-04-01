import { useState, useEffect } from "react";
import { db as base44 } from "@/api/localDB";
import { Plus, ChevronLeft, ChevronRight, Calendar, MessageCircle, Check, X, LayoutGrid, List, ClipboardList } from "lucide-react";
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay,
  addMonths, subMonths, startOfWeek, endOfWeek, addWeeks, subWeeks,
  addDays, parseISO
} from "date-fns";
import { ptBR } from "date-fns/locale";
import ConsultationForm from "../components/schedule/ConsultationForm";

const STATUS_STYLES = {
  realizada: "bg-green-100 text-green-700",
  cancelada:  "bg-red-100 text-red-700",
  falta:      "bg-orange-100 text-orange-700",
  agendada:   "bg-blue-100 text-blue-700",
};

const HOURS = ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30",
               "12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30",
               "16:00","16:30","17:00"];

export default function Schedule() {
  const [consultations, setConsultations] = useState([]);
  const [patients, setPatients] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [editingConsultation, setEditingConsultation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("month"); // "month" | "week"
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const load = async () => {
    const [c, p] = await Promise.all([
      base44.entities.Consultation.list("-date", 200),
      base44.entities.Patient.list("-created_date", 200)
    ]);
    setConsultations(c);
    setPatients(p);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const days = eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) });
  const selectedDateStr = format(selectedDate, "yyyy-MM-dd");
  const dayConsultations = consultations
    .filter(c => c.date === selectedDateStr)
    .sort((a, b) => (a.time || "").localeCompare(b.time || ""));

  const hasDayConsultation = (day) => {
    const ds = format(day, "yyyy-MM-dd");
    return consultations.some(c => c.date === ds);
  };

  const getConsultationsForCell = (day, hour) => {
    const ds = format(day, "yyyy-MM-dd");
    return consultations.filter(c => c.date === ds && c.time === hour);
  };

  const openNew = (dateStr, time) => {
    setEditingConsultation({ date: dateStr, time: time || "" });
    setShowForm(true);
  };

  const handleWhatsApp = (c, type = "lembrete") => {
    const patient = patients.find(p => p.id === c.patient_id);
    const phone = patient?.phone?.replace(/\D/g, "");
    if (!phone) return;
    const msgs = {
      lembrete: `Olá ${c.patient_name}! Lembrando que sua consulta está agendada para ${c.date} às ${c.time}. Confirma? 😊`,
      formulario: `Olá ${c.patient_name}! Por favor, preencha o formulário pré-consulta antes do nosso atendimento. Obrigada! 🥗`,
      confirmar: `Olá ${c.patient_name}! Sua consulta para ${c.date} às ${c.time} foi confirmada. Até lá! 😊`,
    };
    const msg = encodeURIComponent(msgs[type] || msgs.lembrete);
    window.open(`https://wa.me/55${phone}?text=${msg}`, "_blank");
  };

  const handleStatusChange = async (id, status) => {
    await base44.entities.Consultation.update(id, { status });
    load();
  };

  // Weekly view days (Mon–Fri)
  const weekDays = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));

  const ConsultationCard = ({ c, compact }) => (
    <div className={`border border-gray-100 rounded-xl p-3 ${compact ? "p-2" : ""}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-xs flex-shrink-0">
            {c.patient_name?.[0]}
          </div>
          <div>
            <p className={`font-medium text-gray-800 ${compact ? "text-xs" : "text-sm"}`}>{c.patient_name}</p>
            <p className="text-xs text-gray-400">{c.time} · {c.type}</p>
          </div>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${STATUS_STYLES[c.status] || STATUS_STYLES.agendada}`}>
          {c.status}
        </span>
      </div>
      {!compact && (
        <div className="flex flex-wrap gap-1 mt-2">
          <button onClick={() => handleWhatsApp(c, "lembrete")}
            className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded-lg hover:bg-green-100 transition-colors">
            <MessageCircle className="w-3 h-3" /> Lembrete
          </button>
          <button onClick={() => handleWhatsApp(c, "formulario")}
            className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-lg hover:bg-blue-100 transition-colors">
            <ClipboardList className="w-3 h-3" /> Formulário
          </button>
          {c.status === "agendada" && (
            <>
              <button onClick={() => handleStatusChange(c.id, "realizada")}
                className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-lg hover:bg-green-200 transition-colors">
                <Check className="w-3 h-3" /> Confirmar
              </button>
              <button onClick={() => handleStatusChange(c.id, "cancelada")}
                className="flex items-center gap-1 text-xs bg-red-50 text-red-700 px-2 py-1 rounded-lg hover:bg-red-100 transition-colors">
                <X className="w-3 h-3" /> Cancelar
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agenda</h1>
          <p className="text-gray-500 text-sm">{consultations.filter(c => c.status === "agendada").length} consultas agendadas</p>
        </div>
        <div className="flex gap-2">
          {/* View toggle */}
          <div className="flex border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setView("month")}
              className={`flex items-center gap-1 px-3 py-2 text-sm transition-colors ${view === "month" ? "bg-green-600 text-white" : "text-gray-500 hover:bg-gray-50"}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Mês
            </button>
            <button
              onClick={() => setView("week")}
              className={`flex items-center gap-1 px-3 py-2 text-sm transition-colors ${view === "week" ? "bg-green-600 text-white" : "text-gray-500 hover:bg-gray-50"}`}
            >
              <List className="w-3.5 h-3.5" /> Semana
            </button>
          </div>
          <button
            onClick={() => { setEditingConsultation(null); setShowForm(true); }}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Nova Consulta
          </button>
        </div>
      </div>

      {view === "month" ? (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Monthly Calendar */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => setCurrentMonth(m => subMonths(m, 1))} className="p-2 hover:bg-gray-50 rounded-xl">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h2 className="font-semibold text-gray-900 capitalize">
                {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
              </h2>
              <button onClick={() => setCurrentMonth(m => addMonths(m, 1))} className="p-2 hover:bg-gray-50 rounded-xl">
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(d => (
                <div key={d} className="text-center text-xs text-gray-400 font-medium py-2">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array(days[0].getDay()).fill(null).map((_, i) => <div key={`e-${i}`} />)}
              {days.map(day => {
                const isSelected = isSameDay(day, selectedDate);
                const isToday = isSameDay(day, new Date());
                const hasConsultation = hasDayConsultation(day);
                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={`relative aspect-square flex flex-col items-center justify-center rounded-xl text-sm transition-all ${
                      isSelected ? "bg-green-600 text-white font-semibold" :
                      isToday ? "bg-green-50 text-green-700 font-semibold" :
                      "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    {format(day, "d")}
                    {hasConsultation && (
                      <span className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : "bg-green-500"}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Day Consultations */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-1">
              {format(selectedDate, "d 'de' MMMM", { locale: ptBR })}
            </h3>
            <p className="text-sm text-gray-400 mb-4">{dayConsultations.length} consulta(s)</p>

            {dayConsultations.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Calendar className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Nenhuma consulta neste dia</p>
                <button
                  onClick={() => openNew(selectedDateStr)}
                  className="mt-3 text-green-600 text-sm underline"
                >
                  Agendar consulta
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {dayConsultations.map(c => <ConsultationCard key={c.id} c={c} />)}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ── WEEKLY VIEW ── */
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <button onClick={() => setWeekStart(w => subWeeks(w, 1))} className="p-2 hover:bg-gray-50 rounded-xl">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="font-semibold text-gray-900 text-sm">
              {format(weekStart, "d 'de' MMM", { locale: ptBR })} — {format(addDays(weekStart, 4), "d 'de' MMM yyyy", { locale: ptBR })}
            </h2>
            <button onClick={() => setWeekStart(w => addWeeks(w, 1))} className="p-2 hover:bg-gray-50 rounded-xl">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] table-fixed">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="w-16 text-xs text-gray-400 font-medium p-2 text-right pr-3">Hora</th>
                  {weekDays.map(day => (
                    <th key={day.toISOString()} className="text-xs font-medium p-2 text-center">
                      <div className={`rounded-xl py-1.5 ${isSameDay(day, new Date()) ? "bg-green-100 text-green-700" : "text-gray-600"}`}>
                        <div>{format(day, "EEE", { locale: ptBR })}</div>
                        <div className="text-sm font-bold">{format(day, "d")}</div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HOURS.map(hour => (
                  <tr key={hour} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="text-xs text-gray-400 text-right pr-3 py-1 w-16 align-top pt-2">{hour}</td>
                    {weekDays.map(day => {
                      const dateStr = format(day, "yyyy-MM-dd");
                      const cells = getConsultationsForCell(day, hour);
                      return (
                        <td
                          key={day.toISOString()}
                          className="p-0.5 align-top cursor-pointer"
                          onClick={() => cells.length === 0 && openNew(dateStr, hour)}
                        >
                          {cells.map(c => (
                            <div
                              key={c.id}
                              className={`text-xs rounded-lg px-2 py-1 mb-0.5 truncate font-medium cursor-pointer ${
                                c.status === "realizada" ? "bg-green-100 text-green-800" :
                                c.status === "cancelada" ? "bg-red-100 text-red-700 line-through" :
                                c.status === "falta" ? "bg-orange-100 text-orange-700" :
                                "bg-blue-100 text-blue-800"
                              }`}
                              onClick={(e) => { e.stopPropagation(); setEditingConsultation(c); setShowForm(true); }}
                              title={`${c.patient_name} · ${c.type}`}
                            >
                              {c.patient_name?.split(" ")[0]}
                            </div>
                          ))}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && (
        <ConsultationForm
          patients={patients}
          consultation={editingConsultation}
          defaultDate={format(selectedDate, "yyyy-MM-dd")}
          onClose={() => setShowForm(false)}
          onSave={() => { load(); setShowForm(false); }}
        />
      )}
    </div>
  );
}
