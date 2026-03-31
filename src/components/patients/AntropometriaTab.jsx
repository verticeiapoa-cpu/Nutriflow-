import { useState, useEffect } from "react";
import { getAntropometria, saveAntropometria, calcIMC, labelIMC } from "@/lib/storage";
import { Scale, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import toast from "react-hot-toast";

const EMPTY_AVALIACAO = {
  data: "", peso: "", altura: "", cintura: "", quadril: "", abdominal: "",
  pescoco: "", braco: "",
  // Dobras (mm)
  d_tricipital: "", d_bicipital: "", d_subescapular: "", d_suprailíaca: "",
  d_abdominal: "", d_coxa: "", d_perna: "",
  // Composição
  gordura_pct: "", massa_gorda: "", massa_magra: "", agua_pct: "",
  pas: "", pad: "", fc: "",
  // BIA
  bia_equip: "", bia_fase: "", bia_gordura: "", bia_magra: "", bia_agua: "", bia_tmb: "",
  notas: "",
};

const RCV_CINTURA = {
  masculino: { ok: 94, risco: 102 },
  feminino: { ok: 80, risco: 88 },
};
const RCV_RCQ = {
  masculino: { baixo: 0.85, alto: 0.95 },
  feminino: { baixo: 0.80, alto: 0.85 },
};

function rcvCintura(cintura, sexo) {
  const ref = RCV_CINTURA[sexo] || RCV_CINTURA.feminino;
  if (!cintura) return null;
  const c = parseFloat(cintura);
  if (c < ref.ok) return { label: "Sem risco", color: "text-green-600" };
  if (c < ref.risco) return { label: "Risco aumentado", color: "text-amber-600" };
  return { label: "Risco muito aumentado", color: "text-red-600" };
}

function calcRCQ(cintura, quadril) {
  if (!cintura || !quadril) return null;
  return +(parseFloat(cintura) / parseFloat(quadril)).toFixed(2);
}

// Durnin & Womersley (4 dobras) — estimativa de %gordura
function estimarGorduraDurnin(d_tricipital, d_bicipital, d_subescapular, d_suprailíaca, sexo, idade) {
  const t = parseFloat(d_tricipital) || 0;
  const b = parseFloat(d_bicipital) || 0;
  const s = parseFloat(d_subescapular) || 0;
  const si = parseFloat(d_suprailíaca) || 0;
  if (!t && !b && !s && !si) return null;
  const soma = t + b + s + si;
  const logSoma = Math.log10(soma);
  let densidade;
  if (sexo === "masculino") {
    if (idade < 30) densidade = 1.1620 - 0.0630 * logSoma;
    else if (idade < 40) densidade = 1.1631 - 0.0632 * logSoma;
    else if (idade < 50) densidade = 1.1422 - 0.0544 * logSoma;
    else densidade = 1.1620 - 0.0700 * logSoma;
  } else {
    if (idade < 30) densidade = 1.1549 - 0.0678 * logSoma;
    else if (idade < 40) densidade = 1.1423 - 0.0632 * logSoma;
    else if (idade < 50) densidade = 1.1333 - 0.0612 * logSoma;
    else densidade = 1.1339 - 0.0645 * logSoma;
  }
  return +((4.95 / densidade - 4.50) * 100).toFixed(1);
}

const inp = "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500";
const ta = `${inp} resize-none`;

function FieldGrp({ title, children }) {
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-bold uppercase tracking-wide text-gray-500 border-b border-gray-100 pb-1">{title}</h4>
      <div className="grid sm:grid-cols-3 gap-3">{children}</div>
    </div>
  );
}
function F({ label, children }) {
  return <div><label className="block text-xs text-gray-500 mb-1">{label}</label>{children}</div>;
}

export default function AntropometriaTab({ patientId, patient }) {
  const [records, setRecords] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_AVALIACAO });
  const [editIdx, setEditIdx] = useState(null);
  const [openIdx, setOpenIdx] = useState(null);

  useEffect(() => {
    setRecords(getAntropometria(patientId));
  }, [patientId]);

  const sexo = patient?.gender || "feminino";
  const idade = patient?.birth_date
    ? Math.floor((new Date() - new Date(patient.birth_date)) / (365.25 * 24 * 60 * 60 * 1000))
    : 30;

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Auto-calcular campos derivados
  const imc = calcIMC(form.peso, form.altura);
  const rcq = calcRCQ(form.cintura, form.quadril);
  const gordEstimada = form.gordura_pct || estimarGorduraDurnin(
    form.d_tricipital, form.d_bicipital, form.d_subescapular, form.d_suprailíaca, sexo, idade
  );
  const massaGorda = gordEstimada && form.peso
    ? +(parseFloat(form.peso) * gordEstimada / 100).toFixed(1) : "";
  const massaMagra = massaGorda && form.peso
    ? +(parseFloat(form.peso) - massaGorda).toFixed(1) : "";

  const handleSave = () => {
    const avaliacao = {
      ...form,
      imc,
      rcq,
      gordura_calc: gordEstimada,
      massa_gorda: form.massa_gorda || massaGorda,
      massa_magra: form.massa_magra || massaMagra,
      _id: Date.now(),
    };
    const updated = editIdx !== null
      ? records.map((r, i) => i === editIdx ? avaliacao : r)
      : [...records, avaliacao];
    setRecords(updated);
    saveAntropometria(patientId, updated);
    setShowForm(false);
    setForm({ ...EMPTY_AVALIACAO });
    setEditIdx(null);
    toast.success("Avaliação salva!");
  };

  const handleEdit = (idx) => {
    setForm({ ...EMPTY_AVALIACAO, ...records[idx] });
    setEditIdx(idx);
    setShowForm(true);
  };

  const handleDelete = (idx) => {
    const updated = records.filter((_, i) => i !== idx);
    setRecords(updated);
    saveAntropometria(patientId, updated);
    toast.success("Avaliação removida");
  };

  const latest = records[records.length - 1];
  const prev = records[records.length - 2];

  const delta = (key) => {
    if (!latest || !prev) return null;
    const diff = parseFloat(latest[key]) - parseFloat(prev[key]);
    if (isNaN(diff)) return null;
    return diff;
  };

  const DeltaBadge = ({ key: k }) => {
    const d = delta(k);
    if (d === null) return null;
    const positive = d > 0;
    return (
      <span className={`text-xs font-medium ml-1 ${positive ? "text-red-500" : "text-green-600"}`}>
        {positive ? "↑" : "↓"} {Math.abs(d).toFixed(1)}
      </span>
    );
  };

  const chartData = records.map((r, i) => ({
    name: r.data || `#${i + 1}`,
    Peso: parseFloat(r.peso) || 0,
    "% Gordura": parseFloat(r.gordura_pct || r.gordura_calc) || 0,
    "Massa Magra": parseFloat(r.massa_magra) || 0,
    Cintura: parseFloat(r.cintura) || 0,
  }));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Scale className="w-4 h-4 text-green-600" /> Antropometria Completa
        </h3>
        <button onClick={() => { setForm({ ...EMPTY_AVALIACAO }); setEditIdx(null); setShowForm(true); }}
          className="flex items-center gap-1.5 text-sm bg-green-600 text-white px-3 py-2 rounded-xl hover:bg-green-700 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Nova Avaliação
        </button>
      </div>

      {records.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Scale className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">Nenhuma avaliação antropométrica registrada.</p>
        </div>
      ) : (
        <>
          {/* Cards "vs anterior" */}
          {latest && (
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-3">
                Última avaliação · {latest.data}
                {prev && <span className="ml-2 text-green-600">vs anterior</span>}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Peso", val: latest.peso, un: "kg", key: "peso" },
                  { label: "IMC", val: latest.imc, un: "", key: "imc", extra: latest.imc ? labelIMC(latest.imc) : "" },
                  { label: "Cintura", val: latest.cintura, un: "cm", key: "cintura" },
                  { label: "% Gordura", val: latest.gordura_pct || latest.gordura_calc, un: "%", key: "gordura_pct" },
                  { label: "Massa Gorda", val: latest.massa_gorda, un: "kg", key: "massa_gorda" },
                  { label: "Massa Magra", val: latest.massa_magra, un: "kg", key: "massa_magra" },
                  { label: "RCQ", val: latest.rcq, un: "", key: "rcq" },
                  { label: "PA", val: latest.pas ? `${latest.pas}/${latest.pad}` : null, un: "mmHg" },
                ].filter(i => i.val).map((item, i) => {
                  const d = delta(item.key);
                  return (
                    <div key={i} className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400">{item.label}</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {item.val}{item.un && ` ${item.un}`}
                        {d !== null && (
                          <span className={`text-xs font-medium ml-1 ${d > 0 ? "text-red-500" : "text-green-600"}`}>
                            {d > 0 ? "↑" : "↓"} {Math.abs(d).toFixed(1)}
                          </span>
                        )}
                      </p>
                      {item.extra && <p className="text-xs text-gray-400">{item.extra}</p>}
                    </div>
                  );
                })}
              </div>

              {/* RCV */}
              {(() => {
                const rcv = rcvCintura(latest.cintura, sexo);
                return rcv && (
                  <div className={`mt-3 text-xs px-3 py-2 rounded-xl bg-gray-50 ${rcv.color}`}>
                    Risco cardiovascular (cintura): <strong>{rcv.label}</strong>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Gráficos */}
          {records.length > 1 && (
            <div className="space-y-4">
              <p className="text-sm font-semibold text-gray-800">Evolução</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { dataKey: "Peso", color: "#16a34a", label: "Peso (kg)" },
                  { dataKey: "% Gordura", color: "#dc2626", label: "% Gordura" },
                ].map(chart => (
                  <div key={chart.dataKey} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-2">{chart.label}</p>
                    <ResponsiveContainer width="100%" height={120}>
                      <LineChart data={chartData}>
                        <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                        <YAxis domain={["auto","auto"]} tick={{ fontSize: 9 }} />
                        <Tooltip />
                        <Line type="monotone" dataKey={chart.dataKey} stroke={chart.color} strokeWidth={2} dot={{ r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Histórico */}
          <div>
            <p className="text-sm font-semibold text-gray-800 mb-3">Histórico de Avaliações</p>
            <div className="space-y-2">
              {[...records].reverse().map((r, i) => {
                const origIdx = records.length - 1 - i;
                const isOpen = openIdx === origIdx;
                return (
                  <div key={r._id || i} className="border border-gray-100 rounded-xl overflow-hidden">
                    <div className="flex items-center gap-3 p-3 bg-gray-50">
                      <span className="text-gray-400 text-xs w-24 flex-shrink-0">{r.data}</span>
                      <span className="font-medium text-sm">{r.peso ? `${r.peso} kg` : "—"}</span>
                      {r.imc && <span className="text-gray-500 text-xs">IMC: {r.imc}</span>}
                      {(r.gordura_pct || r.gordura_calc) && (
                        <span className="text-gray-500 text-xs">G: {r.gordura_pct || r.gordura_calc}%</span>
                      )}
                      <div className="ml-auto flex gap-1">
                        <button onClick={() => setOpenIdx(isOpen ? null : origIdx)}
                          className="p-1 text-gray-400 hover:text-gray-600">
                          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                        <button onClick={() => handleEdit(origIdx)}
                          className="text-xs text-blue-500 hover:text-blue-700 px-2">Editar</button>
                        <button onClick={() => handleDelete(origIdx)}
                          className="p-1 text-red-400 hover:text-red-600">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    {isOpen && (
                      <div className="p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-gray-600">
                        {[
                          ["Altura", r.altura, "cm"],
                          ["Cintura", r.cintura, "cm"],
                          ["Quadril", r.quadril, "cm"],
                          ["RCQ", r.rcq, ""],
                          ["Abdominal", r.abdominal, "cm"],
                          ["Braço", r.braco, "cm"],
                          ["Massa Magra", r.massa_magra, "kg"],
                          ["Massa Gorda", r.massa_gorda, "kg"],
                          ["PA", r.pas ? `${r.pas}/${r.pad}` : null, "mmHg"],
                          ["FC", r.fc, "bpm"],
                        ].filter(([,v]) => v).map(([l, v, u]) => (
                          <div key={l}><span className="text-gray-400">{l}: </span>{v}{u && ` ${u}`}</div>
                        ))}
                        {r.notas && <div className="col-span-4 text-gray-500 italic">{r.notas}</div>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Modal de formulário */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white z-10">
              <h2 className="font-bold text-gray-900">{editIdx !== null ? "Editar Avaliação" : "Nova Avaliação Antropométrica"}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-xl">✕</button>
            </div>

            <div className="p-5 space-y-5">
              <FieldGrp title="Básico">
                <F label="Data"><input type="date" value={form.data} onChange={e => set("data", e.target.value)} className={inp} /></F>
                <F label="Peso (kg)"><input type="number" step="0.1" value={form.peso} onChange={e => set("peso", e.target.value)} className={inp} /></F>
                <F label="Altura (cm)"><input type="number" value={form.altura} onChange={e => set("altura", e.target.value)} className={inp} /></F>
              </FieldGrp>

              {/* IMC calculado */}
              {imc && (
                <div className="flex items-center gap-3 bg-green-50 rounded-xl px-3 py-2 text-sm">
                  <span className="text-green-700 font-medium">IMC: {imc}</span>
                  <span className="text-green-600">— {labelIMC(imc)}</span>
                </div>
              )}

              <FieldGrp title="Circunferências (cm)">
                <F label="Cintura"><input type="number" step="0.1" value={form.cintura} onChange={e => set("cintura", e.target.value)} className={inp} /></F>
                <F label="Quadril"><input type="number" step="0.1" value={form.quadril} onChange={e => set("quadril", e.target.value)} className={inp} /></F>
                <F label="Abdominal"><input type="number" step="0.1" value={form.abdominal} onChange={e => set("abdominal", e.target.value)} className={inp} /></F>
                <F label="Pescoço"><input type="number" step="0.1" value={form.pescoco} onChange={e => set("pescoco", e.target.value)} className={inp} /></F>
                <F label="Braço"><input type="number" step="0.1" value={form.braco} onChange={e => set("braco", e.target.value)} className={inp} /></F>
                {rcq && <F label={`RCQ (calc.)`}><div className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50">{rcq}</div></F>}
              </FieldGrp>

              <FieldGrp title="Dobras Cutâneas (mm) — Protocolo ISAK">
                {[
                  ["Tricipital", "d_tricipital"],["Bicipital", "d_bicipital"],["Subescapular", "d_subescapular"],
                  ["Suprailíaca", "d_suprailíaca"],["Abdominal", "d_abdominal"],["Coxa", "d_coxa"],["Perna medial", "d_perna"],
                ].map(([l, k]) => (
                  <F key={k} label={l}>
                    <input type="number" step="0.1" value={form[k] || ""} onChange={e => set(k, e.target.value)} className={inp} />
                  </F>
                ))}
              </FieldGrp>

              <FieldGrp title="Composição Corporal">
                <F label="% Gordura (manual)"><input type="number" step="0.1" value={form.gordura_pct} onChange={e => set("gordura_pct", e.target.value)} className={inp} /></F>
                {gordEstimada && !form.gordura_pct && (
                  <F label="% Gordura (Durnin)"><div className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-blue-50 text-blue-700">{gordEstimada}%</div></F>
                )}
                <F label="Massa Gorda (kg)">
                  <input type="number" step="0.1" value={form.massa_gorda || massaGorda || ""} onChange={e => set("massa_gorda", e.target.value)} className={inp} />
                </F>
                <F label="Massa Magra (kg)">
                  <input type="number" step="0.1" value={form.massa_magra || massaMagra || ""} onChange={e => set("massa_magra", e.target.value)} className={inp} />
                </F>
                <F label="Água corporal (%)"><input type="number" step="0.1" value={form.agua_pct} onChange={e => set("agua_pct", e.target.value)} className={inp} /></F>
                <F label="PA sistólica (mmHg)"><input type="number" value={form.pas} onChange={e => set("pas", e.target.value)} className={inp} /></F>
                <F label="PA diastólica (mmHg)"><input type="number" value={form.pad} onChange={e => set("pad", e.target.value)} className={inp} /></F>
                <F label="FC repouso (bpm)"><input type="number" value={form.fc} onChange={e => set("fc", e.target.value)} className={inp} /></F>
              </FieldGrp>

              <FieldGrp title="Bioimpedância (se disponível)">
                <F label="Equipamento"><input value={form.bia_equip} onChange={e => set("bia_equip", e.target.value)} className={inp} /></F>
                <F label="Fase menstrual">
                  <select value={form.bia_fase} onChange={e => set("bia_fase", e.target.value)} className={inp}>
                    <option value="">—</option>
                    <option>Pré-menstrual</option>
                    <option>Pós-menstrual</option>
                    <option>Indiferente</option>
                  </select>
                </F>
                <F label="% Gordura BIA"><input type="number" step="0.1" value={form.bia_gordura} onChange={e => set("bia_gordura", e.target.value)} className={inp} /></F>
                <F label="Massa Magra BIA (kg)"><input type="number" step="0.1" value={form.bia_magra} onChange={e => set("bia_magra", e.target.value)} className={inp} /></F>
                <F label="Água BIA (%)"><input type="number" step="0.1" value={form.bia_agua} onChange={e => set("bia_agua", e.target.value)} className={inp} /></F>
                <F label="TMB estimada (kcal)"><input type="number" value={form.bia_tmb} onChange={e => set("bia_tmb", e.target.value)} className={inp} /></F>
              </FieldGrp>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Observações</label>
                <textarea value={form.notas} onChange={e => set("notas", e.target.value)} rows={2} className={ta} />
              </div>
            </div>

            <div className="flex gap-3 p-5 border-t sticky bottom-0 bg-white">
              <button onClick={() => setShowForm(false)}
                className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm hover:bg-gray-50">
                Cancelar
              </button>
              <button onClick={handleSave}
                className="flex-1 bg-green-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-green-700">
                Salvar Avaliação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
