import { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { X, Camera, Upload, Loader2, Check, ImagePlus, Zap } from "lucide-react";

const REFEICAO_OPTIONS = [
  { value: "cafe_manha", label: "☕ Café da manhã" },
  { value: "lanche_manha", label: "🍎 Lanche manhã" },
  { value: "almoco", label: "🍽️ Almoço" },
  { value: "lanche_tarde", label: "🥪 Lanche tarde" },
  { value: "jantar", label: "🌙 Jantar" },
  { value: "ceia", label: "🌛 Ceia" },
];

export default function AnaliseFotoModal({ onClose, onSave }) {
  const [step, setStep] = useState("upload"); // upload | analyzing | result | saving
  const [fotoUrl, setFotoUrl] = useState(null);
  const [refeicao, setRefeicao] = useState("almoco");
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);
  const fileRef = useRef();

  const handleFile = async (file) => {
    if (!file) return;
    setStep("analyzing");
    setError(null);

    // Upload da foto
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setFotoUrl(file_url);

    // Análise com IA (InvokeLLM com visão)
    const prompt = `Identifique todos os alimentos visíveis nesta foto de refeição.
Para cada item, estime a quantidade em gramas e os valores nutricionais (calorias, proteínas, carboidratos, gorduras).
Use valores nutricionais realistas baseados na tabela TACO ou equivalente brasileiro.
Seja preciso e considere o tamanho visual dos alimentos na foto.
Responda com os dados no formato JSON solicitado.`;

    const aiResult = await base44.integrations.Core.InvokeLLM({
      prompt,
      file_urls: [file_url],
      response_json_schema: {
        type: "object",
        properties: {
          itens: {
            type: "array",
            items: {
              type: "object",
              properties: {
                nome: { type: "string" },
                quantidade_g: { type: "number" },
                calorias: { type: "number" },
                proteinas_g: { type: "number" },
                carboidratos_g: { type: "number" },
                gorduras_g: { type: "number" }
              }
            }
          },
          total: {
            type: "object",
            properties: {
              calorias: { type: "number" },
              proteinas_g: { type: "number" },
              carboidratos_g: { type: "number" },
              gorduras_g: { type: "number" }
            }
          },
          descricao: { type: "string" }
        }
      }
    });

    setResultado(aiResult);
    setStep("result");
  };

  const handleSave = async () => {
    setStep("saving");
    const now = new Date();
    await base44.entities.DiarioAlimentar.create({
      data: now.toISOString().split("T")[0],
      hora: now.toTimeString().slice(0, 5),
      tipo_registro: "foto",
      foto_url: fotoUrl,
      refeicao,
      itens: resultado.itens || [],
      total_calorias: resultado.total?.calorias || 0,
      total_proteinas_g: resultado.total?.proteinas_g || 0,
      total_carboidratos_g: resultado.total?.carboidratos_g || 0,
      total_gorduras_g: resultado.total?.gorduras_g || 0,
      descricao: resultado.descricao || "",
    });
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center">
              <Camera className="w-4 h-4 text-purple-600" />
            </div>
            <h2 className="font-bold text-gray-900">Analisar Refeição por Foto</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Step: Upload */}
          {step === "upload" && (
            <>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Tipo de refeição</label>
                <select
                  value={refeicao}
                  onChange={e => setRefeicao(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {REFEICAO_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center cursor-pointer hover:border-purple-300 hover:bg-purple-50 transition-all group"
              >
                <ImagePlus className="w-10 h-10 mx-auto mb-3 text-gray-300 group-hover:text-purple-400 transition-colors" />
                <p className="font-semibold text-gray-700 group-hover:text-purple-700">Clique para selecionar a foto</p>
                <p className="text-sm text-gray-400 mt-1">JPG, PNG ou WEBP da sua refeição</p>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => handleFile(e.target.files[0])}
                />
              </div>

              <div className="flex items-start gap-2 bg-purple-50 rounded-xl p-3">
                <Zap className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-purple-700">A IA irá identificar os alimentos, estimar as quantidades em gramas e calcular automaticamente os valores nutricionais.</p>
              </div>
            </>
          )}

          {/* Step: Analyzing */}
          {step === "analyzing" && (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
              </div>
              <p className="font-semibold text-gray-800">Analisando sua refeição...</p>
              <p className="text-sm text-gray-400 mt-1">A IA está identificando os alimentos e calculando os nutrientes</p>
            </div>
          )}

          {/* Step: Result */}
          {step === "result" && resultado && (
            <>
              {fotoUrl && (
                <img src={fotoUrl} alt="Refeição" className="w-full h-48 object-cover rounded-2xl" />
              )}

              {resultado.descricao && (
                <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3 italic">"{resultado.descricao}"</p>
              )}

              {/* Totais */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "Calorias", val: resultado.total?.calorias?.toFixed(0), unit: "kcal", color: "text-orange-600" },
                  { label: "Proteínas", val: resultado.total?.proteinas_g?.toFixed(1), unit: "g", color: "text-green-600" },
                  { label: "Carboidratos", val: resultado.total?.carboidratos_g?.toFixed(1), unit: "g", color: "text-yellow-600" },
                  { label: "Gorduras", val: resultado.total?.gorduras_g?.toFixed(1), unit: "g", color: "text-red-500" },
                ].map((m, i) => (
                  <div key={i} className="text-center bg-gray-50 rounded-xl py-2.5">
                    <p className={`text-lg font-bold ${m.color}`}>{m.val}</p>
                    <p className="text-xs text-gray-400">{m.unit}</p>
                    <p className="text-xs text-gray-400 leading-tight">{m.label}</p>
                  </div>
                ))}
              </div>

              {/* Itens */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">{resultado.itens?.length} alimentos identificados</p>
                <div className="space-y-2 max-h-52 overflow-y-auto">
                  {resultado.itens?.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm bg-gray-50 rounded-xl px-3 py-2.5">
                      <div>
                        <span className="font-medium text-gray-800">{item.nome}</span>
                        <span className="text-gray-400 ml-2 text-xs">{item.quantidade_g}g</span>
                      </div>
                      <span className="text-orange-600 font-semibold text-xs">{item.calorias} kcal</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Tipo de refeição</label>
                <select
                  value={refeicao}
                  onChange={e => setRefeicao(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {REFEICAO_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </>
          )}

          {/* Step: Saving */}
          {step === "saving" && (
            <div className="text-center py-10">
              <Loader2 className="w-8 h-8 text-green-600 animate-spin mx-auto mb-3" />
              <p className="font-semibold text-gray-800">Salvando no diário...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-sm text-red-600">{error}</div>
          )}
        </div>

        {/* Footer */}
        {(step === "upload" || step === "result") && (
          <div className="px-5 pb-5 flex gap-3">
            <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-50">
              Cancelar
            </button>
            {step === "result" && (
              <button onClick={handleSave} className="flex-1 bg-green-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 flex items-center justify-center gap-2">
                <Check className="w-4 h-4" /> Salvar no diário
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}