import { useState } from "react";
import { db as base44 } from "@/api/localDB";
import { X, Upload } from "lucide-react";

export default function LabExamForm({ patients, defaultPatient, onClose, onSave }) {
  const [form, setForm] = useState({
    patient_id: defaultPatient?.id || "",
    patient_name: defaultPatient?.full_name || "",
    date: new Date().toISOString().split("T")[0],
    exam_type: "",
    glucose: "", total_cholesterol: "", hdl: "", ldl: "", triglycerides: "",
    hemoglobin: "", ferritin: "", vitamin_d: "", vitamin_b12: "", tsh: "", insulin: "",
    notes: "", file_url: ""
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handlePatientChange = (id) => {
    const p = patients.find(p => p.id === id);
    setForm(f => ({ ...f, patient_id: id, patient_name: p?.full_name || "" }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    set("file_url", file_url);
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.patient_id) return alert("Selecione um paciente");
    setLoading(true);
    const cleaned = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, v === "" ? undefined : (typeof v === "string" && !isNaN(v) && v !== "" && !["patient_id", "patient_name", "date", "exam_type", "notes", "file_url"].includes(k) ? parseFloat(v) : v)])
    );
    await base44.entities.LabExam.create(cleaned);
    onSave();
  };

  const Field = ({ label, k, unit }) => (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label} {unit && <span className="text-gray-400">({unit})</span>}</label>
      <input type="number" step="0.01" value={form[k]} onChange={e => set(k, e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white z-10">
          <h2 className="font-bold text-gray-900">Novo Exame Laboratorial</h2>
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
            <div>
              <label className="block text-sm text-gray-600 mb-1">Tipo de exame</label>
              <input value={form.exam_type} onChange={e => set("exam_type", e.target.value)} placeholder="Ex: Hemograma completo"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Glicemia e Lipídeos</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Field label="Glicose" k="glucose" unit="mg/dL" />
              <Field label="Col. Total" k="total_cholesterol" unit="mg/dL" />
              <Field label="HDL" k="hdl" unit="mg/dL" />
              <Field label="LDL" k="ldl" unit="mg/dL" />
              <Field label="Triglicerídeos" k="triglycerides" unit="mg/dL" />
              <Field label="Insulina" k="insulin" unit="μU/mL" />
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Vitaminas e Minerais</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Field label="Vitamina D" k="vitamin_d" unit="ng/mL" />
              <Field label="Vitamina B12" k="vitamin_b12" unit="pg/mL" />
              <Field label="Ferritina" k="ferritin" unit="ng/mL" />
              <Field label="Hemoglobina" k="hemoglobin" unit="g/dL" />
              <Field label="TSH" k="tsh" unit="mUI/L" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">Arquivo do exame (PDF/imagem)</label>
            <label className="flex items-center gap-2 cursor-pointer border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-green-400 transition-colors">
              <Upload className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-500">{uploading ? "Enviando..." : form.file_url ? "✅ Arquivo enviado" : "Clique para fazer upload"}</span>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Observações</label>
            <textarea value={form.notes} onChange={e => set("notes", e.target.value)} rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
          </div>
        </div>

        <div className="flex gap-3 p-5 border-t sticky bottom-0 bg-white">
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">Cancelar</button>
          <button onClick={handleSave} disabled={loading || uploading}
            className="flex-1 bg-green-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-50">
            {loading ? "Salvando..." : "Salvar Exame"}
          </button>
        </div>
      </div>
    </div>
  );
}