import { useState, useEffect, useMemo } from "react";
import { getMetas, saveMetas, getAntropometria } from "@/lib/storage";
import { Target, Calculator, Save, Info } from "lucide-react";
import toast from "react-hot-toast";

const NUTRIENTES = [
  { key: "kcal",      label: "Energia",           un: "kcal",  desc: "VET calculado" },
  { key: "ptn_g",     label: "Proteína",           un: "g",     desc: "g/dia" },
  { key: "cho_g",     label: "Carboidrato",        un: "g",     desc: "g/dia" },
  { key: "lip_g",     label: "Lipídio",            un: "g",     desc: "g/dia" },
  { key: "fibra_g",   label: "Fibra alimentar",    un: "g",     desc: "g/dia" },
  { key: "agua_ml",   label: "Água",               un: "ml",    desc: "ml/dia" },
  { key: "sodio_mg",  label: "Sódio",              un: "mg",    desc: "mg/dia" },
  { key: "calcio_mg", label: "Cálcio",             un: "mg",    desc: "mg/dia" },
  { key: "ferro_mg",  label: "Ferro",              un: "mg",    desc: "mg/dia" },
  { key: "vitD_mcg",  label: "Vitamina D",         un: "mcg",   desc: "mcg/dia" },
  { key: "vitB12_mcg",label: "Vitamina B12",       un: "mcg",   desc: "mcg/dia" },
];

const EQUACOES = ["Harris-Benedict", "Mifflin-St Jeor", "FAO/OMS"];
const FATORES = [
  { label: "Sedentário (1,20)", val: 1.2 },
  { label: "Levemente ativo (1,375)", val: 1.375 },
  { label: "Moderadamente ativo (1,55)", val: 1.55 },
  { label: "Muito ativo (1,725)", val: 1.725 },
  { label: "Extremamente ativo (1,90)", val: 1.9 },
];

function calcTMB(equacao, sexo, peso, alt, idade) {
  if (!peso || !alt || !idade) return 0;
  const p = parseFloat(peso), a = parseFloat(alt), i = parseFloat(idade);
  if (equacao === "Harris-Benedict") {
    return sexo === "masculino"
      ? 88.362 + 13.397 * p + 4.799 * a - 5.677 * i
      : 447.593 + 9.247 * p + 3.098 * a - 4.330 * i;
  }
  if (equacao === "Mifflin-St Jeor") {
    return sexo === "masculino"
      ? 10 * p + 6.25 * a - 5 * i + 5
      : 10 * p + 6.25 * a - 5 * i - 161;
  }
  // FAO/OMS simplificado
  if (sexo === "masculino") {
    if (i < 30) return 15.3 * p + 679;
    if (i < 60) return 11.6 * p + 879;
    return 13.5 * p + 487;
  } else {
    if (i < 30) return 14.7 * p + 496;
    if (i < 60) return 8.7 * p + 829;
    return 10.5 * p + 596;
  }
}

export default function MetasTab({ patientId, patient }) {
  const [metas, setMetas] = useState(getMetas(patientId));
  const [showCalc, setShowCalc] = useState(false);
  const [calc, setCalc] = useState({
    equacao: "Mifflin-St Jeor", fator: 1.55,
    ptn_kg: 1.2, cho_pct: 50, lip_pct: 25
  });

  useEffect(() => { setMetas(getMetas(patientId)); }, [patientId]);

  const setMeta = (k, v) => setMetas(m => ({ ...m, [k]: v }));

  const handleSave = () => {
    saveMetas(patientId, metas);
    toast.success("Metas salvas!");
  };

  const handleCalc = () => {
    const antro = getAntropometria(patientId);
    const latest = antro[antro.length - 1];
    const peso = parseFloat(latest?.peso) || parseFloat(patient?.weight) || 60;
    const altura = parseFloat(latest?.altura) || parseFloat(patient?.height) || 165;
    const idade = patient?.birth_date
      ? Math.floor((new Date() - new Date(patient.birth_date)) / (365.25 * 24 * 60 * 60 * 1000))
      : 30;
    const tmb = calcTMB(calc.equacao, patient?.gender || "feminino", peso, altura, idade);
    const vet = Math.round(tmb * calc.fator);
    const ptn_g = Math.round(peso * calc.ptn_kg);
    const cho_g = Math.round((vet * (calc.cho_pct / 100)) / 4);
    const lip_g = Math.round((vet * (calc.lip_pct / 100)) / 9);
    const agua_ml = Math.round(peso * 35);
    setMetas(m => ({ ...m, kcal: vet, ptn_g, cho_g, lip_g, agua_ml, base: `${calc.equacao} × ${calc.fator}` }));
    setShowCalc(false);
    toast.success("Metas calculadas! Salve para confirmar.");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Target className="w-4 h-4 text-green-600" /> Metas Nutricionais
        </h3>
        <div className="flex gap-2">
          <button onClick={() => setShowCalc(true)}
            className="flex items-center gap-1.5 text-sm bg-blue-50 text-blue-700 px-3 py-2 rounded-xl hover:bg-blue-100 transition-colors">
            <Calculator className="w-3.5 h-3.5" /> Calcular
          </button>
          <button onClick={handleSave}
            className="flex items-center gap-1.5 text-sm bg-green-600 text-white px-3 py-2 rounded-xl hover:bg-green-700 transition-colors">
            <Save className="w-3.5 h-3.5" /> Salvar
          </button>
        </div>
      </div>

      {metas.base && (
        <div className="flex items-center gap-2 text-xs text-blue-700 bg-blue-50 rounded-xl px-3 py-2">
          <Info className="w-3.5 h-3.5 flex-shrink-0" /> Baseado em: {metas.base}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-2 text-gray-500 font-medium">Nutriente</th>
              <th className="text-center py-2 text-gray-500 font-medium w-32">Meta diária</th>
              <th className="text-left py-2 text-gray-500 font-medium w-16">Unidade</th>
            </tr>
          </thead>
          <tbody>
            {NUTRIENTES.map(n => (
              <tr key={n.key} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-2.5 text-gray-700 font-medium">{n.label}</td>
                <td className="py-2.5 text-center">
                  <input
                    type="number"
                    value={metas[n.key] || ""}
                    onChange={e => setMeta(n.key, parseFloat(e.target.value) || 0)}
                    className="w-24 border border-gray-200 rounded-lg px-2 py-1 text-center text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </td>
                <td className="py-2.5 text-gray-400 text-xs">{n.un}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Calculator Modal */}
      {showCalc && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="font-bold text-gray-900">Calcular Metas Automaticamente</h3>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Equação para TMB</label>
              <select value={calc.equacao} onChange={e => setCalc(c => ({ ...c, equacao: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                {EQUACOES.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Fator de atividade</label>
              <select value={calc.fator} onChange={e => setCalc(c => ({ ...c, fator: parseFloat(e.target.value) }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                {FATORES.map(f => <option key={f.val} value={f.val}>{f.label}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">PTN (g/kg)</label>
                <input type="number" step="0.1" value={calc.ptn_kg}
                  onChange={e => setCalc(c => ({ ...c, ptn_kg: parseFloat(e.target.value) }))}
                  className="w-full border border-gray-200 rounded-xl px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">CHO (%VET)</label>
                <input type="number" value={calc.cho_pct}
                  onChange={e => setCalc(c => ({ ...c, cho_pct: parseFloat(e.target.value) }))}
                  className="w-full border border-gray-200 rounded-xl px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">LIP (%VET)</label>
                <input type="number" value={calc.lip_pct}
                  onChange={e => setCalc(c => ({ ...c, lip_pct: parseFloat(e.target.value) }))}
                  className="w-full border border-gray-200 rounded-xl px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowCalc(false)}
                className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-50">
                Cancelar
              </button>
              <button onClick={handleCalc}
                className="flex-1 bg-green-600 text-white py-2.5 rounded-xl text-sm hover:bg-green-700">
                Calcular e Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
