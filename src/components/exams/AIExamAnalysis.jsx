import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { X, Zap, Loader2 } from "lucide-react";

export default function AIExamAnalysis({ exam, onClose, onSave }) {
  const [analysis, setAnalysis] = useState(exam.ai_analysis || "");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const prompt = `Você é um nutricionista analisando exames laboratoriais. Analise os seguintes resultados e forneça:
1. Interpretação dos valores (normal, alterado, atenção)
2. Possíveis deficiências nutricionais
3. Sugestões de ajustes alimentares baseadas nos resultados
4. Alimentos recomendados para corrigir possíveis alterações
5. Observações importantes

Resultados do paciente ${exam.patient_name} (${exam.date}):
${exam.glucose ? `Glicose: ${exam.glucose} mg/dL (ref: 70-99)` : ""}
${exam.total_cholesterol ? `Colesterol Total: ${exam.total_cholesterol} mg/dL (ref: <190)` : ""}
${exam.hdl ? `HDL: ${exam.hdl} mg/dL (ref: >40)` : ""}
${exam.ldl ? `LDL: ${exam.ldl} mg/dL (ref: <130)` : ""}
${exam.triglycerides ? `Triglicerídeos: ${exam.triglycerides} mg/dL (ref: <150)` : ""}
${exam.vitamin_d ? `Vitamina D: ${exam.vitamin_d} ng/mL (ref: 30-60)` : ""}
${exam.vitamin_b12 ? `Vitamina B12: ${exam.vitamin_b12} pg/mL (ref: 200-900)` : ""}
${exam.ferritin ? `Ferritina: ${exam.ferritin} ng/mL` : ""}
${exam.hemoglobin ? `Hemoglobina: ${exam.hemoglobin} g/dL` : ""}
${exam.tsh ? `TSH: ${exam.tsh} mUI/L (ref: 0.4-4.0)` : ""}
${exam.insulin ? `Insulina: ${exam.insulin} μU/mL (ref: 2-25)` : ""}
${exam.notes ? `Observações do nutricionista: ${exam.notes}` : ""}

Forneça uma análise clara, objetiva e em português, com foco em intervenções nutricionais.`;

    const result = await base44.integrations.Core.InvokeLLM({ prompt });
    setAnalysis(result);
    setLoading(false);
  };

  const handleSave = async () => {
    await base44.entities.LabExam.update(exam.id, { ai_analysis: analysis });
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center">
              <Zap className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Análise de Exames com IA</h2>
              <p className="text-xs text-gray-400">{exam.patient_name} · {exam.date}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5 space-y-4">
          {!analysis && !loading && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Análise Nutricional com IA</h3>
              <p className="text-sm text-gray-500 mb-4">A IA irá analisar os resultados laboratoriais e fornecer recomendações nutricionais personalizadas.</p>
              <button onClick={handleAnalyze}
                className="bg-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors flex items-center gap-2 mx-auto">
                <Zap className="w-4 h-4" /> Analisar Exames
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center py-12">
              <Loader2 className="w-10 h-10 text-purple-600 animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-500">Analisando exames com IA...</p>
              <p className="text-xs text-gray-400 mt-1">Isso pode levar alguns segundos</p>
            </div>
          )}

          {analysis && !loading && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">Resultado da Análise</h3>
                <button onClick={handleAnalyze} className="text-xs text-purple-600 hover:underline flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Reanalisar
                </button>
              </div>
              <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{analysis}</p>
              </div>
            </div>
          )}
        </div>

        {analysis && !loading && (
          <div className="flex gap-3 p-5 border-t">
            <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">Fechar</button>
            <button onClick={handleSave}
              className="flex-1 bg-purple-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-purple-700">
              Salvar Análise no Prontuário
            </button>
          </div>
        )}
      </div>
    </div>
  );
}