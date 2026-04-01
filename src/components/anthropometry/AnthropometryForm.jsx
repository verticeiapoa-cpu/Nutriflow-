import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { X } from "lucide-react";

export default function AnthropometryForm({ patients, defaultPatient, onClose, onSave }) {
  const [form, setForm] = useState({
    patient_id: defaultPatient?.id || "",
    patient_name: defaultPatient?.full_name || "",
    date: new Date().toISOString().split("T")[0],
    weight: "", height: "", body_fat_percent: "", muscle_mass: "", visceral_fat: "",
    waist: "", hip: "", abdomen: "", arm: "", thigh: "", calf: "",
    skinfold_triceps: "", skinfold_subscapular: "", skinfold_abdominal: "", skinfold_thigh: "",
    notes: ""
  });
  const [loading, setLoading] = useState(false);

  const set = (key, value) => setForm(f => {
    const updated = { ...f, [key]: value };
    // Auto-calculate BMI
    if ((key === "weight" || key === "height") && updated.weight && updated.height) {
      const h = parseFloat(updated.height) / 100;
      const w = parseFloat(updated.weight);
      updated.bmi = parseFloat((w / (h * h)).toFixed(1));
    }
    return updated;
  });

  const handlePatientChange = (id) => {
    const p = patients.find(p => p.id === id);
    setForm(f => ({ ...f, patient_id: id, patient_name: p?.full_name || "" }));
  };

  const handleSave = async () => {
    if (!form.patient_id) return alert("Selecione um paciente");
    setLoading(true);
    const cleaned = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, v === "" ? undefined : (typeof v === "string" && !isNaN(v) && v !== "" ? parseFloat(v) : v)])
    );
    await base44.entities.Anthropometry.create(cleaned);
    onSave();
  };

  const Field = ({ label, k, unit }) => (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label} {unit && <span className="text-gray-400">({unit})</span>}</label>
      <input type="number" step="0.1" value={form[k]} onChange={e => set(k, e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white z-10">
          <h2 className="font-bold text-gray-900">Nova Avaliação Antropométrica</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            {!defaultPatient && (
              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Paciente *</label>
                <select value={form.patient_id} onChange={e => handlePatientChange(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">Selecionar</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Data</label>
              <input type="date" value={form.date} onChange={e => set("date", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Medidas Principais</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Field label="Peso" k="weight" unit="kg" />
              <Field label="Altura" k="height" unit="cm" />
              <div>
                <label className="block text-xs text-gray-500 mb-1">IMC (auto)</label>
                <input readOnly value={form.bmi || ""}
                  className="w-full border border-gray-100 bg-green-50 rounded-xl px-3 py-2 text-sm text-green-800 font-semibold" />
              </div>
              <Field label="% Gordura" k="body_fat_percent" unit="%" />
              <Field label="Massa Muscular" k="muscle_mass" unit="kg" />
              <Field label="Gordura Visceral" k="visceral_fat" />
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Circunferências (cm)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Field label="Cintura" k="waist" />
              <Field label="Quadril" k="hip" />
              <Field label="Abdômen" k="abdomen" />
              <Field label="Braço" k="arm" />
              <Field label="Coxa" k="thigh" />
              <Field label="Panturrilha" k="calf" />
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Dobras Cutâneas (mm)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Field label="Tríceps" k="skinfold_triceps" />
              <Field label="Subescapular" k="skinfold_subscapular" />
              <Field label="Abdominal" k="skinfold_abdominal" />
              <Field label="Coxa" k="skinfold_thigh" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Observações</label>
            <textarea value={form.notes} onChange={e => set("notes", e.target.value)} rows={2}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
          </div>
        </div>

        <div className="flex gap-3 p-5 border-t sticky bottom-0 bg-white">
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">Cancelar</button>
          <button onClick={handleSave} disabled={loading}
            className="flex-1 bg-green-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-50">
            {loading ? "Salvando..." : "Salvar Avaliação"}
          </button>
        </div>
      </div>
    </div>
  );
}