import { useState } from "react";
import { db as base44 } from "@/api/localDB";
import { X, Plus, Trash2, Tag } from "lucide-react";

const TAG_COLORS = [
  "bg-green-100 text-green-700 border-green-200",
  "bg-blue-100 text-blue-700 border-blue-200",
  "bg-purple-100 text-purple-700 border-purple-200",
  "bg-amber-100 text-amber-700 border-amber-200",
  "bg-rose-100 text-rose-700 border-rose-200",
  "bg-teal-100 text-teal-700 border-teal-200",
];

const TAG_SUGESTOES = [
  "Diabético(a)", "Hipertenso(a)", "Vegano(a)", "Vegetariano(a)",
  "Atleta", "Grávida", "Lactante", "Idoso(a)", "Criança",
  "Intolerante à lactose", "Celíaco(a)", "Cardíaco(a)",
  "Dislipidemia", "Hipotireoidismo", "SOP", "Ansiedade",
];

export default function PatientForm({ patient, onClose, onSave }) {
  const [form, setForm] = useState(patient || {
    full_name: "", birth_date: "", gender: "", phone: "", email: "",
    address: "", objective: "", status: "novo", anamnesis: "", notes: "",
    allergies: [], medications: [], diseases: [], tags: [], next_appointment: ""
  });
  const [loading, setLoading] = useState(false);
  const [newAllergy, setNewAllergy] = useState("");
  const [newMedication, setNewMedication] = useState("");
  const [newDisease, setNewDisease] = useState("");
  const [newTag, setNewTag] = useState("");

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const addToArray = (key, value, setValue) => {
    if (!value.trim()) return;
    setForm(f => ({ ...f, [key]: [...(f[key] || []), value.trim()] }));
    setValue("");
  };

  const removeFromArray = (key, index) => {
    setForm(f => ({ ...f, [key]: f[key].filter((_, i) => i !== index) }));
  };

  const handleSave = async () => {
    if (!form.full_name) return alert("Nome é obrigatório");
    setLoading(true);
    let saved;
    if (patient?.id) {
      saved = await base44.entities.Patient.update(patient.id, form);
    } else {
      saved = await base44.entities.Patient.create(form);
    }
    onSave(saved);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white rounded-t-2xl z-10">
          <h2 className="text-lg font-bold text-gray-900">{patient ? "Editar Paciente" : "Novo Paciente"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-5">
          {/* Basic Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Informações Básicas</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Nome Completo *</label>
                <input value={form.full_name} onChange={e => set("full_name", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Data de Nascimento</label>
                <input type="date" value={form.birth_date} onChange={e => set("birth_date", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Sexo</label>
                <select value={form.gender} onChange={e => set("gender", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">Selecionar</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Telefone / WhatsApp</label>
                <input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="(11) 99999-9999"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">E-mail</label>
                <input value={form.email} onChange={e => set("email", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Objetivo</label>
                <select value={form.objective} onChange={e => set("objective", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">Selecionar</option>
                  <option value="emagrecimento">Emagrecimento</option>
                  <option value="hipertrofia">Hipertrofia</option>
                  <option value="manutenção">Manutenção</option>
                  <option value="saúde">Saúde geral</option>
                  <option value="tratamento_clinico">Tratamento clínico</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Status</label>
                <select value={form.status} onChange={e => set("status", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="novo">Novo</option>
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Próxima Consulta</label>
                <input type="date" value={form.next_appointment} onChange={e => set("next_appointment", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>
          </div>

          {/* Clinical Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Informações Clínicas</h3>
            {[
              { key: "allergies", label: "Alergias", state: newAllergy, setter: setNewAllergy },
              { key: "diseases", label: "Doenças / Condições", state: newDisease, setter: setNewDisease },
              { key: "medications", label: "Medicamentos em uso", state: newMedication, setter: setNewMedication },
            ].map(({ key, label, state, setter }) => (
              <div key={key} className="mb-4">
                <label className="block text-sm text-gray-600 mb-2">{label}</label>
                <div className="flex gap-2 mb-2">
                  <input value={state} onChange={e => setter(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addToArray(key, state, setter)}
                    placeholder={`Adicionar ${label.toLowerCase()}...`}
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                  <button onClick={() => addToArray(key, state, setter)}
                    className="px-3 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(form[key] || []).map((item, i) => (
                    <span key={i} className="flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full">
                      {item}
                      <button onClick={() => removeFromArray(key, i)}><Trash2 className="w-3 h-3 text-red-400 hover:text-red-600" /></button>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-1.5">
              <Tag className="w-4 h-4" /> Tags do Paciente
            </h3>
            <div className="flex gap-2 mb-2">
              <input
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addToArray("tags", newTag, setNewTag)}
                placeholder="Adicionar tag personalizada..."
                list="tag-sugestoes"
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <datalist id="tag-sugestoes">
                {TAG_SUGESTOES.map(s => <option key={s} value={s} />)}
              </datalist>
              <button onClick={() => addToArray("tags", newTag, setNewTag)}
                className="px-3 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {/* Sugestões rápidas */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {TAG_SUGESTOES.filter(s => !(form.tags||[]).includes(s)).slice(0, 8).map(s => (
                <button key={s} onClick={() => setForm(f => ({ ...f, tags: [...(f.tags||[]), s] }))}
                  className="text-xs px-2.5 py-1 rounded-full border border-dashed border-gray-300 text-gray-500 hover:border-green-400 hover:text-green-700 transition-colors">
                  + {s}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {(form.tags || []).map((tag, i) => (
                <span key={i} className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border ${TAG_COLORS[i % TAG_COLORS.length]}`}>
                  {tag}
                  <button onClick={() => removeFromArray("tags", i)}><X className="w-3 h-3 hover:text-red-600" /></button>
                </span>
              ))}
            </div>
          </div>

          {/* Anamnesis */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Anamnese Nutricional</h3>
            <textarea value={form.anamnesis} onChange={e => set("anamnesis", e.target.value)}
              rows={5} placeholder="Descreva os hábitos alimentares, estilo de vida, histórico nutricional..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Observações Gerais</label>
            <textarea value={form.notes} onChange={e => set("notes", e.target.value)}
              rows={3} placeholder="Outras observações relevantes..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t sticky bottom-0 bg-white rounded-b-2xl">
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
            Cancelar
          </button>
          <button onClick={handleSave} disabled={loading}
            className="flex-1 bg-green-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50">
            {loading ? "Salvando..." : "Salvar Paciente"}
          </button>
        </div>
      </div>
    </div>
  );
}