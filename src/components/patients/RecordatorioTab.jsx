import { useState, useEffect } from "react";
import { getRecordatorios, saveRecordatorios, getMetas, fmtData } from "@/lib/storage";
import { BookOpen, Plus, Trash2, X } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import toast from "react-hot-toast";

const REFEICOES_OPTS = ["Café da manhã","Lanche da manhã","Almoço","Lanche da tarde","Jantar","Ceia","Lanche noturno"];
const LOCAIS = ["Casa","Trabalho","Restaurante","Na rua","Outro"];
const _COMPANHIA = ["Sozinho","Família","Colegas","Outros"];

const emptyItem = () => ({ nome: "", qtd: "", un: "g", kcal: "", ptn: "", cho: "", lip: "" });
const emptyRefeicao = () => ({
  horario: "", nome: "Café da manhã", local: "Casa", companhia: "Sozinho",
  obs: "", itens: [emptyItem()]
});
const emptyRec = () => ({
  _id: Date.now(),
  data_ref: new Date().toISOString().split("T")[0],
  dia_tipico: "Sim",
  dia_tipico_obs: "",
  refeicoes: [emptyRefeicao()],
});

function calcTotais(refeicoes) {
  let kcal = 0, ptn = 0, cho = 0, lip = 0, itens = 0;
  (refeicoes || []).forEach(r => (r.itens || []).forEach(it => {
    kcal += parseFloat(it.kcal) || 0;
    ptn += parseFloat(it.ptn) || 0;
    cho += parseFloat(it.cho) || 0;
    lip += parseFloat(it.lip) || 0;
    if (it.nome) itens++;
  }));
  return { kcal: Math.round(kcal), ptn: Math.round(ptn), cho: Math.round(cho), lip: Math.round(lip), itens };
}

const inp = "w-full border border-gray-200 rounded-xl px-2.5 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500";

export default function RecordatorioTab({ patientId }) {
  const [records, setRecords] = useState([]);
  const [metas, setMetas] = useState(null);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setRecords(getRecordatorios(patientId));
    setMetas(getMetas(patientId));
  }, [patientId]);

  const save = (rec) => {
    const updated = editing
      ? records.map(r => r._id === editing._id ? rec : r)
      : [...records, rec];
    setRecords(updated);
    saveRecordatorios(patientId, updated);
    setShowForm(false);
    setEditing(null);
    toast.success("Recordatório salvo!");
  };

  const remove = (id) => {
    const updated = records.filter(r => r._id !== id);
    setRecords(updated);
    saveRecordatorios(patientId, updated);
    toast.success("Recordatório removido");
  };

  const openNew = () => { setEditing(null); setShowForm(true); };
  const openEdit = (rec) => { setEditing(rec); setShowForm(true); };

  // Gráfico: comparativo últimos recordatórios vs meta
  const chartData = records.slice(-5).map((r) => {
    const t = calcTotais(r.refeicoes);
    return { name: fmtData(r.data_ref), kcal: t.kcal, meta: metas?.kcal || 0 };
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-green-600" /> Recordatório Alimentar 24h
        </h3>
        <button onClick={openNew}
          className="flex items-center gap-1.5 text-sm bg-green-600 text-white px-3 py-2 rounded-xl hover:bg-green-700 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Novo Recordatório
        </button>
      </div>

      {records.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">Nenhum recordatório registrado.</p>
        </div>
      ) : (
        <>
          {chartData.length > 1 && (
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-3 font-medium">CONSUMO (kcal) vs META</p>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 9 }} />
                  <Tooltip />
                  <Bar dataKey="kcal" name="Consumo" radius={[4,4,0,0]}>
                    {chartData.map((_, i) => (
                      <Cell key={i} fill={_.kcal > _.meta ? "#dc2626" : "#16a34a"} />
                    ))}
                  </Bar>
                  <Bar dataKey="meta" name="Meta" fill="#e5e7eb" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="space-y-2">
            {[...records].reverse().map((rec) => {
              const t = calcTotais(rec.refeicoes);
              const _pctKcal = metas?.kcal ? Math.round((t.kcal / metas.kcal) * 100) : null;
              return (
                <div key={rec._id} className="border border-gray-100 rounded-xl p-4 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-sm text-gray-800">{fmtData(rec.data_ref)}</p>
                      <p className="text-xs text-gray-400">
                        {rec.refeicoes?.length} refeições · {t.itens} alimentos
                        {!rec.dia_tipico || rec.dia_tipico !== "Sim"
                          ? <span className="text-amber-600 ml-2">⚠ Dia atípico</span>
                          : null}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(rec)}
                        className="text-xs text-blue-500 hover:text-blue-700 px-2 py-1 rounded">Editar</button>
                      <button onClick={() => remove(rec._id)}
                        className="p-1 text-red-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { l: "kcal", v: t.kcal, meta: metas?.kcal, color: "text-green-700" },
                      { l: "PTN", v: `${t.ptn}g`, meta: metas?.ptn_g, color: "text-blue-700" },
                      { l: "CHO", v: `${t.cho}g`, meta: metas?.cho_g, color: "text-amber-700" },
                      { l: "LIP", v: `${t.lip}g`, meta: metas?.lip_g, color: "text-red-700" },
                    ].map(item => (
                      <div key={item.l} className="text-center">
                        <p className="text-xs text-gray-400">{item.l}</p>
                        <p className={`text-sm font-semibold ${item.color}`}>{item.v}</p>
                        {item.meta && (
                          <div className="h-1 bg-gray-200 rounded mt-0.5 overflow-hidden">
                            <div className="h-full rounded"
                              style={{
                                width: `${Math.min(100, (parseFloat(item.v) / item.meta) * 100)}%`,
                                background: parseFloat(item.v) > item.meta ? "#dc2626" : "#16a34a"
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {showForm && (
        <RecordatorioForm
          initial={editing || emptyRec()}
          onSave={save}
          onClose={() => { setShowForm(false); setEditing(null); }}
        />
      )}
    </div>
  );
}

function RecordatorioForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(JSON.parse(JSON.stringify(initial)));

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addRefeicao = () => setForm(f => ({ ...f, refeicoes: [...f.refeicoes, emptyRefeicao()] }));
  const removeRefeicao = (ri) => setForm(f => ({ ...f, refeicoes: f.refeicoes.filter((_, i) => i !== ri) }));
  const setRef = (ri, k, v) => setForm(f => {
    const rs = [...f.refeicoes];
    rs[ri] = { ...rs[ri], [k]: v };
    return { ...f, refeicoes: rs };
  });
  const addItem = (ri) => setForm(f => {
    const rs = [...f.refeicoes];
    rs[ri] = { ...rs[ri], itens: [...rs[ri].itens, emptyItem()] };
    return { ...f, refeicoes: rs };
  });
  const removeItem = (ri, ii) => setForm(f => {
    const rs = [...f.refeicoes];
    rs[ri] = { ...rs[ri], itens: rs[ri].itens.filter((_, i) => i !== ii) };
    return { ...f, refeicoes: rs };
  });
  const setItem = (ri, ii, k, v) => setForm(f => {
    const rs = [...f.refeicoes];
    const its = [...rs[ri].itens];
    its[ii] = { ...its[ii], [k]: v };
    rs[ri] = { ...rs[ri], itens: its };
    return { ...f, refeicoes: rs };
  });

  const totais = calcTotais(form.refeicoes);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white z-10">
          <h2 className="font-bold text-gray-900">Recordatório Alimentar 24h</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Data de referência</label>
              <input type="date" value={form.data_ref} onChange={e => setField("data_ref", e.target.value)} className={inp} />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Este dia representa a alimentação habitual?</label>
              <div className="flex gap-2">
                {["Sim","Não"].map(v => (
                  <button key={v} type="button" onClick={() => setField("dia_tipico", v)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      form.dia_tipico === v ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-600"
                    }`}>{v}</button>
                ))}
              </div>
            </div>
            {form.dia_tipico === "Não" && (
              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Por quê?</label>
                <input value={form.dia_tipico_obs} onChange={e => setField("dia_tipico_obs", e.target.value)} className={inp} placeholder="Explique o que foi diferente" />
              </div>
            )}
          </div>

          {/* Totais */}
          <div className="bg-green-50 rounded-xl p-3 grid grid-cols-4 gap-2 text-center">
            {[
              { l: "kcal", v: totais.kcal, c: "text-green-800" },
              { l: "PTN (g)", v: totais.ptn, c: "text-blue-700" },
              { l: "CHO (g)", v: totais.cho, c: "text-amber-700" },
              { l: "LIP (g)", v: totais.lip, c: "text-red-700" },
            ].map(t => (
              <div key={t.l}>
                <p className="text-xs text-gray-500">{t.l}</p>
                <p className={`font-bold text-sm ${t.c}`}>{t.v}</p>
              </div>
            ))}
          </div>

          {/* Refeições */}
          <div className="space-y-4">
            {form.refeicoes.map((ref, ri) => (
              <div key={ri} className="border border-gray-200 rounded-xl p-4 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Horário</label>
                    <input type="time" value={ref.horario} onChange={e => setRef(ri, "horario", e.target.value)} className={inp} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Refeição</label>
                    <select value={ref.nome} onChange={e => setRef(ri, "nome", e.target.value)} className={inp}>
                      {REFEICOES_OPTS.map(o => <option key={o}>{o}</option>)}
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Local</label>
                    <select value={ref.local} onChange={e => setRef(ri, "local", e.target.value)} className={inp}>
                      {LOCAIS.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button onClick={() => removeRefeicao(ri)}
                      className="ml-auto p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Cabeçalho itens */}
                <div className="grid grid-cols-12 gap-1 text-xs text-gray-400 font-medium">
                  <span className="col-span-4">Alimento</span>
                  <span className="col-span-1">Qtd</span>
                  <span className="col-span-1">Un</span>
                  <span className="col-span-1">kcal</span>
                  <span className="col-span-1">PTN</span>
                  <span className="col-span-1">CHO</span>
                  <span className="col-span-1">LIP</span>
                  <span className="col-span-2"></span>
                </div>

                {ref.itens.map((it, ii) => (
                  <div key={ii} className="grid grid-cols-12 gap-1 items-center">
                    <input value={it.nome} onChange={e => setItem(ri, ii, "nome", e.target.value)}
                      placeholder="Alimento" className="col-span-4 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-500" />
                    <input type="number" value={it.qtd} onChange={e => setItem(ri, ii, "qtd", e.target.value)}
                      placeholder="—" className="col-span-1 border border-gray-200 rounded-lg px-1.5 py-1.5 text-xs focus:outline-none" />
                    <select value={it.un} onChange={e => setItem(ri, ii, "un", e.target.value)}
                      className="col-span-1 border border-gray-200 rounded-lg px-1 py-1.5 text-xs focus:outline-none">
                      <option>g</option><option>ml</option><option>un</option><option>col</option><option>xíc</option><option>prato</option>
                    </select>
                    <input type="number" value={it.kcal} onChange={e => setItem(ri, ii, "kcal", e.target.value)}
                      placeholder="—" className="col-span-1 border border-gray-200 rounded-lg px-1.5 py-1.5 text-xs focus:outline-none" />
                    <input type="number" value={it.ptn} onChange={e => setItem(ri, ii, "ptn", e.target.value)}
                      placeholder="—" className="col-span-1 border border-gray-200 rounded-lg px-1 py-1.5 text-xs focus:outline-none" />
                    <input type="number" value={it.cho} onChange={e => setItem(ri, ii, "cho", e.target.value)}
                      placeholder="—" className="col-span-1 border border-gray-200 rounded-lg px-1 py-1.5 text-xs focus:outline-none" />
                    <input type="number" value={it.lip} onChange={e => setItem(ri, ii, "lip", e.target.value)}
                      placeholder="—" className="col-span-1 border border-gray-200 rounded-lg px-1 py-1.5 text-xs focus:outline-none" />
                    <button onClick={() => removeItem(ri, ii)}
                      className="col-span-2 text-red-400 hover:text-red-600 flex justify-center">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <button onClick={() => addItem(ri)}
                  className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 font-medium">
                  <Plus className="w-3 h-3" /> Adicionar alimento
                </button>
                <div>
                  <input value={ref.obs} onChange={e => setRef(ri, "obs", e.target.value)}
                    placeholder="Observações desta refeição..." className={`${inp} text-xs`} />
                </div>
              </div>
            ))}
            <button onClick={addRefeicao}
              className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium">
              <Plus className="w-4 h-4" /> Adicionar refeição
            </button>
          </div>
        </div>
        <div className="flex gap-3 p-5 border-t sticky bottom-0 bg-white">
          <button onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm hover:bg-gray-50">
            Cancelar
          </button>
          <button onClick={() => onSave({ ...form, _id: form._id || Date.now() })}
            className="flex-1 bg-green-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-green-700">
            Salvar Recordatório
          </button>
        </div>
      </div>
    </div>
  );
}
