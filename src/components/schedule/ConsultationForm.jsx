import { useState } from "react";
import { db as base44 } from "@/api/localDB";
import { X } from "lucide-react";

export default function ConsultationForm({ patients, consultation, defaultDate, onClose, onSave }) {
  const [form, setForm] = useState(consultation || {
    patient_id: "", patient_name: "", date: defaultDate || "", time: "",
    type: "presencial", status: "agendada", notes: "", price: "", paid: false, payment_method: ""
  });
  const [loading, setLoading] = useState(false);

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const handlePatientChange = (id) => {
    const patient = patients.find(p => p.id === id);
    setForm(f => ({ ...f, patient_id: id, patient_name: patient?.full_name || "" }));
  };

  const handleSave = async () => {
    if (!form.patient_id || !form.date) return alert("Paciente e data são obrigatórios");
    setLoading(true);
    if (consultation?.id) {
      await base44.entities.Consultation.update(consultation.id, form);
    } else {
      await base44.entities.Consultation.create(form);
    }
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-bold text-gray-900">{consultation?.id ? "Editar Consulta" : "Nova Consulta"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Paciente *</label>
            <select value={form.patient_id} onChange={e => handlePatientChange(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="">Selecionar paciente</option>
              {patients.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Data *</label>
              <input type="date" value={form.date} onChange={e => set("date", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Horário</label>
              <input type="time" value={form.time} onChange={e => set("time", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Tipo</label>
              <select value={form.type} onChange={e => set("type", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="presencial">Presencial</option>
                <option value="teleconsulta">Teleconsulta</option>
                <option value="retorno">Retorno</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Status</label>
              <select value={form.status} onChange={e => set("status", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="agendada">Agendada</option>
                <option value="realizada">Realizada</option>
                <option value="cancelada">Cancelada</option>
                <option value="falta">Falta</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Valor (R$)</label>
              <input type="number" value={form.price} onChange={e => set("price", parseFloat(e.target.value))} placeholder="0.00"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Pagamento</label>
              <select value={form.payment_method} onChange={e => set("payment_method", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="">Selecionar</option>
                <option value="pix">PIX</option>
                <option value="cartao">Cartão</option>
                <option value="dinheiro">Dinheiro</option>
                <option value="plano">Plano</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="paid" checked={form.paid} onChange={e => set("paid", e.target.checked)}
              className="w-4 h-4 accent-green-600 rounded" />
            <label htmlFor="paid" className="text-sm text-gray-600">Pagamento recebido</label>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Observações</label>
            <textarea value={form.notes} onChange={e => set("notes", e.target.value)} rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
          </div>
        </div>

        <div className="flex gap-3 p-5 border-t">
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Cancelar</button>
          <button onClick={handleSave} disabled={loading}
            className="flex-1 bg-green-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50">
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}