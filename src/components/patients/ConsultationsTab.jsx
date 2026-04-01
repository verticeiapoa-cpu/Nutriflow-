import { useState, useEffect } from "react";
import { db as base44 } from "@/api/localDB";
import { Plus, Calendar, Check, X, MessageCircle } from "lucide-react";
import ConsultationForm from "../schedule/ConsultationForm";

export default function ConsultationsTab({ patientId, patientName }) {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const data = await base44.entities.Consultation.filter({ patient_id: patientId });
    setConsultations(data.sort((a, b) => b.date?.localeCompare(a.date)));
    setLoading(false);
  };

  useEffect(() => { load(); }, [patientId]);

  const handleWhatsApp = (c) => {
    const msg = encodeURIComponent(`Olá ${patientName}! Lembrando que sua consulta está agendada para ${c.date} às ${c.time}. Confirma? 😊`);
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  const handleStatus = async (id, status) => {
    await base44.entities.Consultation.update(id, { status });
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Histórico de Consultas</h3>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 text-sm bg-green-600 text-white px-3 py-2 rounded-xl hover:bg-green-700 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Agendar
        </button>
      </div>

      {loading ? (
        <div className="h-24 bg-gray-50 rounded-xl animate-pulse" />
      ) : consultations.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <Calendar className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">Nenhuma consulta registrada</p>
        </div>
      ) : (
        <div className="space-y-2">
          {consultations.map(c => (
            <div key={c.id} className="flex items-center gap-3 border border-gray-100 rounded-xl p-3">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                c.status === "realizada" ? "bg-green-500" :
                c.status === "cancelada" ? "bg-red-500" :
                c.status === "falta" ? "bg-orange-500" : "bg-blue-500"
              }`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{c.date} {c.time && `às ${c.time}`}</p>
                <p className="text-xs text-gray-400">{c.type} · {c.status} {c.price ? `· R$ ${c.price}` : ""}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleWhatsApp(c)} className="p-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors" title="Lembrete">
                  <MessageCircle className="w-3.5 h-3.5" />
                </button>
                {c.status === "agendada" && (
                  <>
                    <button onClick={() => handleStatus(c.id, "realizada")} className="p-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors" title="Realizada">
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleStatus(c.id, "cancelada")} className="p-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors" title="Cancelar">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <ConsultationForm
          patients={[{ id: patientId, full_name: patientName }]}
          consultation={{ patient_id: patientId, patient_name: patientName }}
          onClose={() => setShowForm(false)}
          onSave={() => { load(); setShowForm(false); }}
        />
      )}
    </div>
  );
}