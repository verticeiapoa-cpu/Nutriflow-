import { useState, useEffect } from "react";
import { db as base44 } from "@/api/localDB";
import { Plus, FlaskConical, Zap } from "lucide-react";
import LabExamForm from "../exams/LabExamForm";
import AIExamAnalysis from "../exams/AIExamAnalysis";

export default function LabExamsTab({ patientId, patientName }) {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [analyzingExam, setAnalyzingExam] = useState(null);

  const load = async () => {
    const data = await base44.entities.LabExam.filter({ patient_id: patientId });
    setExams(data.sort((a, b) => b.date?.localeCompare(a.date)));
    setLoading(false);
  };

  useEffect(() => { load(); }, [patientId]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Exames Laboratoriais</h3>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 text-sm bg-green-600 text-white px-3 py-2 rounded-xl hover:bg-green-700 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Adicionar Exame
        </button>
      </div>

      {loading ? (
        <div className="h-24 bg-gray-50 rounded-xl animate-pulse" />
      ) : exams.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <FlaskConical className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">Nenhum exame registrado</p>
        </div>
      ) : (
        <div className="space-y-3">
          {exams.map(exam => (
            <div key={exam.id} className="border border-gray-100 rounded-xl p-4">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <p className="font-medium text-gray-900">{exam.exam_type || "Exame laboratorial"}</p>
                  <p className="text-xs text-gray-400">{exam.date}</p>
                </div>
                <button onClick={() => setAnalyzingExam(exam)}
                  className="flex items-center gap-1 text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-lg hover:bg-purple-100 transition-colors">
                  <Zap className="w-3 h-3" /> IA
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
                {[
                  { label: "Glicose", val: exam.glucose, unit: "mg/dL" },
                  { label: "Col. Total", val: exam.total_cholesterol, unit: "mg/dL" },
                  { label: "HDL", val: exam.hdl, unit: "mg/dL" },
                  { label: "LDL", val: exam.ldl, unit: "mg/dL" },
                  { label: "Triglicerídeos", val: exam.triglycerides, unit: "mg/dL" },
                  { label: "Vit. D", val: exam.vitamin_d, unit: "ng/mL" },
                ].filter(i => i.val !== undefined && i.val !== null && i.val !== "").map((item, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-400">{item.label}</p>
                    <p className="text-sm font-semibold text-gray-800">{item.val} <span className="text-xs text-gray-400 font-normal">{item.unit}</span></p>
                  </div>
                ))}
              </div>
              {exam.ai_analysis && (
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-3 mt-2">
                  <p className="text-xs font-semibold text-purple-800 mb-1">🤖 Análise IA</p>
                  <p className="text-xs text-purple-700">{exam.ai_analysis}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <LabExamForm
          patients={[{ id: patientId, full_name: patientName }]}
          defaultPatient={{ id: patientId, full_name: patientName }}
          onClose={() => setShowForm(false)}
          onSave={() => { load(); setShowForm(false); }}
        />
      )}

      {analyzingExam && (
        <AIExamAnalysis
          exam={analyzingExam}
          onClose={() => setAnalyzingExam(null)}
          onSave={() => { load(); setAnalyzingExam(null); }}
        />
      )}
    </div>
  );
}