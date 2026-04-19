import { useState, useEffect, useMemo } from "react";
import { db as base44 } from "@/api/localDB";
import { getAntropometria, getMetas, saveMetas, calcIMC, labelIMC } from "@/lib/storage";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Zap, Search, User, Calculator, Save, Info, ChevronDown, ChevronUp,
  Flame, Beef, Wheat, Droplet, ArrowRight, Check, AlertTriangle
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import toast from "react-hot-toast";

// ─── Fórmulas de TMB ───────────────────────────────────────────────────────────
function calcTMB(equacao, sexo, peso, alt, idade, mlg) {
  if (!peso || !alt || !idade) return 0;
  const p = parseFloat(peso), a = parseFloat(alt), i = parseFloat(idade), m = parseFloat(mlg) || 0;
  const masc = sexo === "masculino";
  switch(equacao) {
    case "Harris-Benedict":
      return masc ? 88.362 + 13.397*p + 4.799*a - 5.677*i : 447.593 + 9.247*p + 3.098*a - 4.330*i;
    case "Mifflin-St Jeor":
      return masc ? 10*p + 6.25*a - 5*i + 5 : 10*p + 6.25*a - 5*i - 161;
    case "FAO/OMS":
      if (masc) { if(i<30) return 15.3*p+679; if(i<60) return 11.6*p+879; return 13.5*p+487; }
      else { if(i<30) return 14.7*p+496; if(i<60) return 8.7*p+829; return 10.5*p+596; }
    case "Katch-McArdle":
      return m ? 370 + 21.6*m : 370 + 21.6*(p*0.75);
    case "Tinsley (homem)":
      return 24.8*p + 10;
    case "Tinsley (mulher)":
      return 25.9*p - 284;
    case "Owen":
      return masc ? 879 + 10.2*p : 795 + 7.18*p;
    case "Schofield":
      if (masc) { if(i<18) return 17.5*p+651; if(i<30) return 15.3*p+679; if(i<60) return 11.6*p+879; return 13.5*p+487; }
      else { if(i<18) return 13.3*p+690; if(i<30) return 14.7*p+496; if(i<60) return 8.7*p+829; return 10.5*p+596; }
    default: return 10*p + 6.25*a - 5*i + (masc ? 5 : -161);
  }
}

const EQUACOES = [
  { key: "Harris-Benedict", label: "Harris-Benedict (revisada)", desc: "Fórmula clássica revisada por Roza & Shizgal" },
  { key: "Mifflin-St Jeor", label: "Mifflin-St Jeor (1990)", desc: "Mais precisa para eutróficos" },
  { key: "FAO/OMS", label: "FAO/OMS (categorias etárias)", desc: "Faixas etárias por fórmula de regressão" },
  { key: "Katch-McArdle", label: "Katch-McArdle (MLG)", desc: "Usa massa livre de gordura — ideal para atletas" },
  { key: "Tinsley (homem)", label: "Tinsley — Masculino", desc: "Validada para atletas de força" },
  { key: "Tinsley (mulher)", label: "Tinsley — Feminino", desc: "Validada para atletas de força femininas" },
  { key: "Owen", label: "Owen (1986/1987)", desc: "Apenas peso corporal, simples e direta" },
  { key: "Schofield", label: "Schofield (FAO revisada)", desc: "Faixas etárias — recomendada pela OMS" },
];

const MET_ATIVIDADES = [
  { key: "caminhada_leve",   label: "Caminhada leve (< 5km/h)",     met: 2.8  },
  { key: "caminhada_rapida", label: "Caminhada rápida (5-6km/h)",   met: 3.5  },
  { key: "corrida_leve",     label: "Corrida leve (8km/h)",         met: 8.0  },
  { key: "corrida_intensa",  label: "Corrida intensa (>10km/h)",    met: 11.5 },
  { key: "musculacao",       label: "Musculação / Resistência",      met: 5.0  },
  { key: "natacao",          label: "Natação (moderada)",            met: 6.0  },
  { key: "ciclismo",         label: "Ciclismo (moderado)",           met: 6.8  },
  { key: "yoga",             label: "Yoga / Pilates",                met: 2.5  },
  { key: "futebol",          label: "Futebol",                       met: 7.0  },
  { key: "jump_hiit",        label: "HIIT / Aeróbico intenso",       met: 9.0  },
];

const FATORES = [
  { label: "Acamado", val: 1.2, emoji: "🛌" },
  { label: "Sedentário", val: 1.3, emoji: "🪑" },
  { label: "Levemente ativo", val: 1.375, emoji: "🚶" },
  { label: "Moderadamente ativo", val: 1.55, emoji: "🏃" },
  { label: "Muito ativo", val: 1.725, emoji: "💪" },
  { label: "Extremamente ativo", val: 1.9, emoji: "🏋️" },
];

const MACRO_COLORS = {
  ptn: "#16a34a",
  cho: "#2563eb",
  lip: "#f59e0b",
};

const inp = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white";

export default function PlanejamentoEnergetico() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cálculo
  const [equacao, setEquacao] = useState("Mifflin-St Jeor");
  const [fator, setFator] = useState(1.55);
  const [ajuste, setAjuste] = useState(0); // kcal de ajuste (+/-)
  const [pesoManual, setPesoManual] = useState("");
  const [alturaManual, setAlturaManual] = useState("");
  const [mlgManual, setMlgManual] = useState("");
  const [showMET, setShowMET] = useState(false);
  const [metSelected, setMetSelected] = useState("");
  const [metMinutos, setMetMinutos] = useState("60");
  const [metDias, setMetDias] = useState("3");

  // Macros (% do VET — somam 100)
  const [ptnPct, setPtnPct] = useState(25);
  const [choPct, setChoPct] = useState(50);
  const [lipPct, setLipPct] = useState(25);
  const [ptnKg, setPtnKg] = useState(1.2);
  const [macroMode, setMacroMode] = useState("pct"); // "pct" ou "gkg"

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    base44.entities.Patient.list("-created_date", 100).then(p => {
      setPatients(p);
      setLoading(false);
    });
  }, []);

  // Dados derivados do paciente
  const patientData = useMemo(() => {
    if (!selectedPatient) return null;
    const antro = getAntropometria(selectedPatient.id);
    const latest = antro[antro.length - 1];
    const peso = pesoManual || latest?.peso || selectedPatient.weight || "";
    const altura = alturaManual || latest?.altura || selectedPatient.height || "";
    const sexo = selectedPatient.gender || "feminino";
    const idade = selectedPatient.birth_date
      ? Math.floor((new Date() - new Date(selectedPatient.birth_date)) / (365.25 * 24 * 60 * 60 * 1000))
      : 30;
    return { peso, altura, sexo, idade, antroRecords: antro, latest };
  }, [selectedPatient, pesoManual, alturaManual]);

  // TMB e VET
  const tmb = patientData
    ? calcTMB(equacao, patientData.sexo, patientData.peso, patientData.altura, patientData.idade, mlgManual)
    : 0;

  const metKcal = useMemo(() => {
    if (!metSelected || !metMinutos || !metDias || !patientData?.peso) return 0;
    const met = MET_ATIVIDADES.find(a => a.key === metSelected)?.met || 0;
    const peso = parseFloat(patientData.peso);
    const minutos = parseFloat(metMinutos);
    const dias = parseFloat(metDias);
    const kcalSessao = met * peso * (minutos / 60);
    return (kcalSessao * dias) / 7;
  }, [metSelected, metMinutos, metDias, patientData]);

  const vet = Math.round(tmb * fator + ajuste + metKcal);
  const imc = patientData ? calcIMC(patientData.peso, patientData.altura) : null;

  // Macro gramas
  const macros = useMemo(() => {
    if (!vet || vet <= 0) return { ptn_g: 0, cho_g: 0, lip_g: 0 };
    if (macroMode === "gkg") {
      const peso = parseFloat(patientData?.peso) || 60;
      const ptn_g = Math.round(peso * ptnKg);
      const ptn_kcal = ptn_g * 4;
      const remaining = vet - ptn_kcal;
      const cho_g = Math.round((remaining * (choPct / (choPct + lipPct))) / 4);
      const lip_g = Math.round((remaining * (lipPct / (choPct + lipPct))) / 9);
      return { ptn_g, cho_g, lip_g, ptn_pct: Math.round((ptn_kcal / vet) * 100) };
    }
    return {
      ptn_g: Math.round((vet * ptnPct / 100) / 4),
      cho_g: Math.round((vet * choPct / 100) / 4),
      lip_g: Math.round((vet * lipPct / 100) / 9),
    };
  }, [vet, ptnPct, choPct, lipPct, ptnKg, macroMode, patientData]);

  // ─── Sincronizar sliders (soma = 100%) ──────────────────────────────
  const handlePtnChange = (v) => {
    const newPtn = Math.min(v, 100);
    const remaining = 100 - newPtn;
    const ratio = choPct + lipPct > 0 ? choPct / (choPct + lipPct) : 0.67;
    setPtnPct(newPtn);
    setChoPct(Math.round(remaining * ratio));
    setLipPct(remaining - Math.round(remaining * ratio));
  };
  const handleChoChange = (v) => {
    const newCho = Math.min(v, 100);
    const remaining = 100 - newCho;
    const ratio = ptnPct + lipPct > 0 ? ptnPct / (ptnPct + lipPct) : 0.5;
    setChoPct(newCho);
    setPtnPct(Math.round(remaining * ratio));
    setLipPct(remaining - Math.round(remaining * ratio));
  };
  const handleLipChange = (v) => {
    const newLip = Math.min(v, 100);
    const remaining = 100 - newLip;
    const ratio = ptnPct + choPct > 0 ? ptnPct / (ptnPct + choPct) : 0.5;
    setLipPct(newLip);
    setPtnPct(Math.round(remaining * ratio));
    setChoPct(remaining - Math.round(remaining * ratio));
  };

  const totalPct = ptnPct + choPct + lipPct;

  // ─── Salvar como meta ──────────────────────────────────────────────
  const handleSave = () => {
    if (!selectedPatient) return;
    const current = getMetas(selectedPatient.id);
    saveMetas(selectedPatient.id, {
      ...current,
      kcal: vet,
      ptn_g: macros.ptn_g,
      cho_g: macros.cho_g,
      lip_g: macros.lip_g,
      agua_ml: Math.round((parseFloat(patientData?.peso) || 60) * 35),
      base: `${equacao} × ${fator} ${ajuste ? (ajuste > 0 ? `+${ajuste}` : ajuste) + ' kcal' : ''}`.trim(),
    });
    setSaved(true);
    toast.success("Planejamento salvo como meta do paciente!");
    setTimeout(() => setSaved(false), 3000);
  };

  const filteredPatients = patients.filter(p =>
    p.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  const pieData = [
    { name: "Proteína", value: ptnPct, color: MACRO_COLORS.ptn },
    { name: "Carboidrato", value: choPct, color: MACRO_COLORS.cho },
    { name: "Lipídio", value: lipPct, color: MACRO_COLORS.lip },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Zap className="w-6 h-6 text-green-600" /> Planejamento Energético
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Calcule TMB, VET e distribua macronutrientes
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* ─── Painel Esquerdo — Seleção de Paciente ────────────────── */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar paciente..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="space-y-1.5 max-h-[60vh] overflow-y-auto">
              {filteredPatients.map(p => {
                const isActive = selectedPatient?.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => { setSelectedPatient(p); setPesoManual(""); setAlturaManual(""); setSaved(false); }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                      isActive
                        ? "bg-green-50 border border-green-200 shadow-sm"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {p.full_name?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{p.full_name}</p>
                      <p className="text-xs text-gray-400">{p.objective || "—"}</p>
                    </div>
                    {isActive && <Check className="w-4 h-4 text-green-600" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─── Painel Central — Cálculos ────────────────────────────── */}
        <div className="lg:col-span-9 space-y-5">
          {!selectedPatient ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center h-64 text-gray-400">
              <div className="text-center">
                <Calculator className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Selecione um paciente para iniciar o planejamento</p>
              </div>
            </div>
          ) : (
            <>
              {/* Info do paciente + dados antropométricos */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {selectedPatient.full_name?.[0]}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">{selectedPatient.full_name}</h2>
                    <p className="text-xs text-gray-400">
                      {patientData?.sexo === "masculino" ? "♂ Masculino" : "♀ Feminino"} · {patientData?.idade} anos
                    </p>
                  </div>
                  <Link
                    to={createPageUrl(`PatientDetail?id=${selectedPatient.id}`)}
                    className="ml-auto text-xs text-green-600 hover:underline flex items-center gap-1"
                  >
                    Ver ficha <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Peso (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={pesoManual || patientData?.peso || ""}
                      onChange={e => setPesoManual(e.target.value)}
                      className={inp}
                      placeholder="kg"
                    />
                    {patientData?.latest && (
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        Último registro: {patientData.latest.peso} kg ({patientData.latest.data})
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Altura (cm)</label>
                    <input
                      type="number"
                      value={alturaManual || patientData?.altura || ""}
                      onChange={e => setAlturaManual(e.target.value)}
                      className={inp}
                      placeholder="cm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">MLG (kg) <span className="text-gray-400 text-[10px]">— para Katch-McArdle</span></label>
                    <input type="number" value={mlgManual} onChange={e => setMlgManual(e.target.value)} placeholder="Ex: 52.0" className={inp} />
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 flex flex-col justify-center">
                    <p className="text-xs text-gray-400">IMC</p>
                    <p className="text-lg font-bold text-gray-800">{imc || "—"}</p>
                    {imc && <p className="text-xs text-gray-500">{labelIMC(imc)}</p>}
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 flex flex-col justify-center">
                    <p className="text-xs text-green-700">TMB</p>
                    <p className="text-lg font-bold text-green-800">{tmb ? Math.round(tmb) : "—"} <span className="text-xs font-normal">kcal</span></p>
                  </div>
                </div>
              </div>

              {/* Seleção de fórmula e fator */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500" /> Fórmula e Fator de Atividade
                </h3>

                {/* Fórmulas */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {EQUACOES.map(eq => (
                    <button
                      key={eq.key}
                      onClick={() => setEquacao(eq.key)}
                      className={`text-left p-3 rounded-xl border-2 transition-all ${
                        equacao === eq.key
                          ? "border-green-500 bg-green-50"
                          : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <p className="text-sm font-medium text-gray-800">{eq.key}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{eq.desc}</p>
                    </button>
                  ))}
                </div>

                {/* Fator de atividade física */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">Nível de Atividade Física (NAF)</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {FATORES.map(f => (
                      <button
                        key={f.val}
                        onClick={() => setFator(f.val)}
                        className={`text-left p-3 rounded-xl border-2 transition-all ${
                          fator === f.val
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-100 hover:border-gray-200"
                        }`}
                      >
                        <span className="text-lg">{f.emoji}</span>
                        <p className="text-xs font-medium text-gray-800 mt-1">{f.label}</p>
                        <p className="text-xs text-gray-400">× {f.val}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Avançado */}
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-700"
                >
                  {showAdvanced ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  Ajuste fino (déficit/superávit)
                </button>
                {showAdvanced && (
                  <div className="grid sm:grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Ajuste calórico (kcal)</label>
                      <input
                        type="number"
                        step="50"
                        value={ajuste}
                        onChange={e => setAjuste(parseInt(e.target.value) || 0)}
                        className={inp}
                        placeholder="Ex: -500 para déficit"
                      />
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        Negativo = déficit · Positivo = superávit
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {ajuste !== 0 && (
                        <div className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                          ajuste < 0 ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"
                        }`}>
                          {ajuste < 0 ? "Déficit" : "Superávit"} de {Math.abs(ajuste)} kcal
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* MET adicional */}
                <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Adicional por MET</p>
                      <p className="text-xs text-gray-500">Inclua atividade física específica ao GET</p>
                    </div>
                    <button onClick={() => setShowMET(!showMET)} className="text-xs text-blue-600 font-semibold">
                      {showMET ? "Ocultar" : "Adicionar atividade"}
                    </button>
                  </div>
                  {showMET && (
                    <div className="space-y-2">
                      <select value={metSelected} onChange={e => setMetSelected(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                        <option value="">Selecione uma atividade...</option>
                        {MET_ATIVIDADES.map(a => <option key={a.key} value={a.key}>{a.label} (MET {a.met})</option>)}
                      </select>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="text-xs text-gray-500">Duração (min)</label>
                          <input type="number" value={metMinutos} onChange={e => setMetMinutos(e.target.value)} placeholder="60" className={inp} />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs text-gray-500">Dias/semana</label>
                          <input type="number" value={metDias} onChange={e => setMetDias(e.target.value)} placeholder="3" min="1" max="7" className={inp} />
                        </div>
                      </div>
                      {metKcal > 0 && (
                        <div className="bg-white rounded-lg p-3 border border-blue-200">
                          <p className="text-sm font-semibold text-blue-700">+{Math.round(metKcal)} kcal/dia pelo MET</p>
                          <p className="text-xs text-blue-400">({metSelected ? MET_ATIVIDADES.find(a=>a.key===metSelected)?.label : ""} · {metMinutos}min · {metDias}x/semana)</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* VET resultante */}
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-5 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">Valor Energético Total (VET)</p>
                      <p className="text-4xl font-bold mt-1">{vet > 0 ? vet.toLocaleString("pt-BR") : "—"} <span className="text-lg font-normal opacity-80">kcal/dia</span></p>
                    </div>
                    <div className="text-right text-sm text-green-100 space-y-0.5">
                      <p>TMB: {tmb ? Math.round(tmb) : "—"} kcal</p>
                      <p>× {fator} (NAF)</p>
                      {ajuste !== 0 && <p>{ajuste > 0 ? "+" : ""}{ajuste} kcal</p>}
                      {metKcal > 0 && <p>+{Math.round(metKcal)} kcal (MET)</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* ─── Distribuição de Macronutrientes ────────────────── */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Beef className="w-4 h-4 text-green-600" /> Distribuição de Macronutrientes
                  </h3>
                  <div className="flex bg-gray-100 rounded-lg p-0.5">
                    <button
                      onClick={() => setMacroMode("pct")}
                      className={`text-xs px-3 py-1.5 rounded-md transition-all ${
                        macroMode === "pct" ? "bg-white shadow-sm text-gray-800 font-medium" : "text-gray-500"
                      }`}
                    >
                      % do VET
                    </button>
                    <button
                      onClick={() => setMacroMode("gkg")}
                      className={`text-xs px-3 py-1.5 rounded-md transition-all ${
                        macroMode === "gkg" ? "bg-white shadow-sm text-gray-800 font-medium" : "text-gray-500"
                      }`}
                    >
                      g/kg (PTN)
                    </button>
                  </div>
                </div>

                {totalPct !== 100 && macroMode === "pct" && (
                  <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 rounded-xl px-3 py-2">
                    <AlertTriangle className="w-3.5 h-3.5" /> Total: {totalPct}% — deve somar 100%
                  </div>
                )}

                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Sliders */}
                  <div className="space-y-5">
                    {macroMode === "gkg" ? (
                      <>
                        {/* PTN g/kg */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: MACRO_COLORS.ptn }} />
                              <span className="text-sm font-medium text-gray-700">Proteína</span>
                            </div>
                            <span className="text-sm font-bold" style={{ color: MACRO_COLORS.ptn }}>
                              {ptnKg} g/kg → {macros.ptn_g}g
                            </span>
                          </div>
                          <input
                            type="range"
                            min={0.5}
                            max={3}
                            step={0.1}
                            value={ptnKg}
                            onChange={e => setPtnKg(parseFloat(e.target.value))}
                            className="w-full accent-green-600 h-2"
                          />
                          <div className="flex justify-between text-[10px] text-gray-400">
                            <span>0,5 g/kg</span>
                            <span>3,0 g/kg</span>
                          </div>
                        </div>
                        {/* CHO e LIP ficam como % do restante */}
                        {[
                          { label: "Carboidrato", key: "cho", pct: choPct, set: setChoPct, grams: macros.cho_g },
                          { label: "Lipídio", key: "lip", pct: lipPct, set: setLipPct, grams: macros.lip_g },
                        ].map(m => (
                          <div key={m.key} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: MACRO_COLORS[m.key] }} />
                                <span className="text-sm font-medium text-gray-700">{m.label}</span>
                              </div>
                              <span className="text-sm font-bold" style={{ color: MACRO_COLORS[m.key] }}>
                                {m.grams}g
                              </span>
                            </div>
                            <input
                              type="range"
                              min={5}
                              max={70}
                              value={m.pct}
                              onChange={e => {
                                const val = parseInt(e.target.value);
                                if (m.key === "cho") {
                                  setChoPct(val);
                                  setLipPct(100 - val);
                                } else {
                                  setLipPct(val);
                                  setChoPct(100 - val);
                                }
                              }}
                              className="w-full h-2"
                              style={{ accentColor: MACRO_COLORS[m.key] }}
                            />
                          </div>
                        ))}
                      </>
                    ) : (
                      // Modo % do VET — sliders sincronizados
                      [
                        { label: "Proteína", key: "ptn", pct: ptnPct, handler: handlePtnChange, grams: macros.ptn_g, kcal: macros.ptn_g * 4, icon: Beef },
                        { label: "Carboidrato", key: "cho", pct: choPct, handler: handleChoChange, grams: macros.cho_g, kcal: macros.cho_g * 4, icon: Wheat },
                        { label: "Lipídio", key: "lip", pct: lipPct, handler: handleLipChange, grams: macros.lip_g, kcal: macros.lip_g * 9, icon: Droplet },
                      ].map(m => (
                        <div key={m.key} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: MACRO_COLORS[m.key] }} />
                              <span className="text-sm font-medium text-gray-700">{m.label}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-bold" style={{ color: MACRO_COLORS[m.key] }}>{m.pct}%</span>
                              <span className="text-xs text-gray-400 ml-2">({m.grams}g · {m.kcal} kcal)</span>
                            </div>
                          </div>
                          <input
                            type="range"
                            min={5}
                            max={70}
                            value={m.pct}
                            onChange={e => m.handler(parseInt(e.target.value))}
                            className="w-full h-2"
                            style={{ accentColor: MACRO_COLORS[m.key] }}
                          />
                          <div className="flex justify-between text-[10px] text-gray-400">
                            <span>5%</span>
                            <span>70%</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Gráfico de pizza */}
                  <div className="flex flex-col items-center justify-center">
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {pieData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v, name) => [`${v}%`, name]} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex gap-4 mt-2">
                      {pieData.map(d => (
                        <div key={d.name} className="flex items-center gap-1.5 text-xs text-gray-600">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                          {d.name}: {d.value}%
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Resumo por macro */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Proteína", g: macros.ptn_g, kcal: macros.ptn_g * 4, bg: "bg-green-50", text: "text-green-700", gkg: patientData?.peso ? (macros.ptn_g / parseFloat(patientData.peso)).toFixed(1) : "—" },
                    { label: "Carboidrato", g: macros.cho_g, kcal: macros.cho_g * 4, bg: "bg-blue-50", text: "text-blue-700", gkg: patientData?.peso ? (macros.cho_g / parseFloat(patientData.peso)).toFixed(1) : "—" },
                    { label: "Lipídio", g: macros.lip_g, kcal: macros.lip_g * 9, bg: "bg-amber-50", text: "text-amber-700", gkg: patientData?.peso ? (macros.lip_g / parseFloat(patientData.peso)).toFixed(1) : "—" },
                  ].map(m => (
                    <div key={m.label} className={`${m.bg} rounded-xl p-4`}>
                      <p className={`text-xs ${m.text} font-medium`}>{m.label}</p>
                      <p className="text-xl font-bold text-gray-800 mt-1">{m.g}g</p>
                      <p className="text-xs text-gray-500">{m.kcal} kcal · {m.gkg} g/kg</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botão salvar */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleSave}
                  disabled={!vet || vet <= 0}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                    saved
                      ? "bg-green-100 text-green-700"
                      : "bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {saved ? "Salvo!" : "Salvar como Meta do Paciente"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
