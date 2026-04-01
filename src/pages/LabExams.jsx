import { useState, useEffect } from "react";
import { db as base44 } from "@/api/localDB";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, Search, FlaskConical, Zap, FileText, Upload } from "lucide-react";
import LabExamForm from "../components/exams/LabExamForm";
import AIExamAnalysis from "../components/exams/AIExamAnalysis";

export default function LabExams() {
  const [exams, setExams] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [analyzingExam, setAnalyzingExam] = useState(null);

  const load = async () => {
    const [e, p] = await Promise.all([
      base44.entities.LabExam.list("-date", 100),
      base44.entities.Patient.list("-created_date", 100)
    ]);
    setExams(e);
    setPatients(p);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = exams.filter(e =>
    e.patient_name?.toLowerCase().includes(search.toLowerCase()) ||
    e.exam_type?.toLowerCase().includes(search.toLowerCase())
  );

  const examValues = (exam) => {
    const fields = [
      { key: "glucose", label: "Glicose", unit: "mg/dL", ref: [70, 99] },
      { key: "total_cholesterol", label: "Colesterol Total", unit: "mg/dL", ref: [0, 190] },
      { key: "hdl", label: "HDL", unit: "mg/dL", ref: [40, 999] },
      { key: "ldl", label: "LDL", unit: "mg/dL", ref: [0, 130] },
      { key: "triglycerides", label: "Triglicerídeos", unit: "mg/dL", ref: [0, 150] },
    ];
    return fields.filter(f => exam[f.key] !== undefined && exam[f.key] !== null && exam[f.key] !== "");
  };

  const getValueStatus = (value, ref) => {
    if (value < ref[0] || value > ref[1]) return "text-red-600 font-semibold";
    return "text-green-700";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exames Laboratoriais</h1>
          <p className="text-gray-500 text-sm">{exams.length} exames registrados</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Novo Exame
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por paciente ou tipo de exame..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
        />
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-32 bg-white rounded-2xl animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <FlaskConical className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">Nenhum exame cadastrado</p>
          <p className="text-sm mt-1">Adicione exames laboratoriais dos pacientes</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(exam => (
            <div key={exam.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FlaskConical className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <Link to={createPageUrl(`PatientDetail?id=${exam.patient_id}`)} className="font-semibold text-gray-900 hover:text-green-600">
                      {exam.patient_name}
                    </Link>
                    <p className="text-sm text-gray-400">{exam.exam_type || "Exame geral"} · {exam.date}</p>
                  </div>
                </div>
                <button
                  onClick={() => setAnalyzingExam(exam)}
                  className="flex items-center gap-2 text-sm bg-purple-50 text-purple-700 px-3 py-2 rounded-xl font-medium hover:bg-purple-100 transition-colors"
                >
                  <Zap className="w-3.5 h-3.5" /> Analisar com IA
                </button>
              </div>

              {/* Exam values */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-3">
                {examValues(exam).map(({ key, label, unit, ref }) => (
                  <div key={key} className="bg-gray-50 rounded-xl p-2.5 text-center">
                    <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                    <p className={`text-sm font-bold ${getValueStatus(exam[key], ref)}`}>{exam[key]} <span className="text-gray-400 font-normal text-xs">{unit}</span></p>
                  </div>
                ))}
              </div>

              {exam.ai_analysis && (
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-semibold text-purple-800">Análise da IA</span>
                  </div>
                  <p className="text-sm text-purple-700 whitespace-pre-wrap">{exam.ai_analysis}</p>
                </div>
              )}

              {exam.notes && (
                <p className="text-sm text-gray-500 bg-gray-50 rounded-xl p-3 mt-2">{exam.notes}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <LabExamForm
          patients={patients}
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