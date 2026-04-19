import { useState, useEffect } from "react";
import { db as base44 } from "@/api/localDB";
import { Save, Plus, Trash2, Clock, FileText } from "lucide-react";

export default function ProntuarioTab({ patientId, patientName }) {
  const [entries, setEntries] = useState([]);
  const [newText, setNewText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const load = async () => {
    const all = await base44.entities.Prontuario.list("-created_date", 50);
    setEntries(all.filter(e => e.patient_id === patientId));
    setLoading(false);
  };

  useEffect(() => { load(); }, [patientId]);

  const save = async () => {
    if (!newText.trim()) return;
    setSaving(true);
    await base44.entities.Prontuario.create({
      patient_id: patientId,
      patient_name: patientName,
      texto: newText.trim(),
      data: new Date().toLocaleDateString("pt-BR"),
      hora: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    });
    setNewText("");
    setSaving(false);
    showToast("✅ Anotação salva");
    load();
  };

  const remove = async (id) => {
    if (!confirm("Excluir esta anotação?")) return;
    await base44.entities.Prontuario.delete(id);
    showToast("🗑️ Anotação excluída");
    load();
  };

  return (
    <div className="space-y-5">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-sm px-5 py-3 rounded-2xl shadow-xl">
          {toast}
        </div>
      )}

      <div>
        <h3 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
          <FileText className="w-4 h-4 text-green-600" /> Nova Anotação
        </h3>
        <p className="text-xs text-gray-400 mb-3">Registro clínico livre — não visível ao paciente</p>
        <textarea
          value={newText}
          onChange={e => setNewText(e.target.value)}
          placeholder="Escreva a anotação clínica aqui... (evoluções, observações, condutas, etc.)"
          rows={5}
          className="input-modern resize-none"
        />
        <button
          onClick={save}
          disabled={!newText.trim() || saving}
          className="btn-primary mt-2"
        >
          <Save className="w-4 h-4" /> {saving ? "Salvando..." : "Salvar Anotação"}
        </button>
      </div>

      <div>
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" /> Histórico ({entries.length})
        </h3>
        {loading ? (
          <div className="space-y-3">{[1,2].map(i => <div key={i} className="h-24 bg-gray-50 rounded-xl animate-pulse" />)}</div>
        ) : entries.length === 0 ? (
          <div className="text-center py-10 text-gray-300">
            <FileText className="w-10 h-10 mx-auto mb-2" strokeWidth={1.2} />
            <p className="text-sm text-gray-400">Nenhuma anotação registrada</p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map(e => (
              <div key={e.id} className="card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {e.data} às {e.hora}
                  </span>
                  <button onClick={() => remove(e.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{e.texto}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
