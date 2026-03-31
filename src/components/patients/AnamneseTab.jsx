import { useState, useEffect } from "react";
import { getAnamnese, saveAnamnese } from "@/lib/storage";
import { ClipboardList, Save, ChevronDown, ChevronUp, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

const SECOES = [
  "Dados Clínicos",
  "Hábitos Alimentares",
  "Hábito Intestinal",
  "Atividade Física",
  "Aspectos Emocionais",
  "Histórico de Peso",
  "Exames Clínicos",
  "Objetivos",
];

const DOENCAS = ["Diabetes tipo 1","Diabetes tipo 2","Hipertensão","Dislipidemia","Hipotireoidismo","Hipertireoidismo","SIRS","Doença renal","Doença hepática","Doença cardiovascular","Câncer"];
const ALERGIAS = ["Glúten","Lactose","Frutos do mar","Nozes","Ovo","Soja"];
const RESTRICOES = ["Vegetariano","Vegano","Kosher","Halal","Nenhuma"];
const SINT_GI = ["Gases","Distensão abdominal","Refluxo","Azia","Náuseas","Diarreia frequente","Constipação","Dor abdominal"];

const EMPTY = {
  // Seção 1
  queixa: "", doencas: [], doenca_outro: "", medicamentos: "", suplementos: "", cirurgias: "",
  hist_familiar: "", alergias: [], alergia_outro: "", restricoes: [],
  // Seção 2
  refeicoes_dia: 5, horario_acordar: "", horario_dormir: "", quem_prepara: "", local_refeicoes: "",
  agua_litros: 2, alcool: "", tipo_alcool: "", cafe: "", belisca: "", velocidade_comer: "",
  mastiga: "", fome_excessiva: "", compulsao: "", compulsao_freq: "",
  alimentos_pref: "", alimentos_evita: "", dietas_anteriores: "",
  // Seção 3
  freq_intestinal: "", bristol: "", sint_gi: [], saude_bucal: "", dificuldade_degluticao: "",
  // Seção 4
  pratica_af: "", tipo_af: "", freq_af: 3, duracao_af: "", tempo_pratica: "", trabalho: "",
  // Seção 5
  estresse: 3, come_estresse: "", come_ansioso: "", come_triste: "",
  qualidade_sono: "", horas_sono: 7, acorda_comer: "",
  // Seção 6
  peso_max: "", peso_max_quando: "", peso_min: "", peso_min_quando: "",
  peso_bem: "", hist_variacao: "", medicamentos_emagrecer: "",
  // Seção 7
  data_exames: "", glicemia: "", hba1c: "", col_total: "", ldl: "", hdl: "", trigli: "",
  tsh: "", t4l: "", vitD: "", vitB12: "", hemoglobina: "", ferritina: "", pressao: "",
  obs_medico: "",
  // Seção 8
  objetivo_principal: "", meta_peso: "", prazo_meses: "", tentou: "", motivacao: "",
  comprometimento: 4,
};

function Secao({ idx, title, isOpen, onToggle, isComplete, children }) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors ${isOpen ? "bg-gray-50" : ""}`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
            isComplete ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
          }`}>
            {isComplete ? <CheckCircle className="w-4 h-4" /> : idx + 1}
          </div>
          <span className="font-medium text-gray-800 text-sm">{title}</span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {isOpen && <div className="p-5 border-t border-gray-100 space-y-4">{children}</div>}
    </div>
  );
}

function Field({ label, children, col2 }) {
  return (
    <div className={col2 ? "sm:col-span-2" : ""}>
      <label className="block text-sm text-gray-600 mb-1">{label}</label>
      {children}
    </div>
  );
}

function CheckGroup({ options, value, onChange }) {
  const toggle = (opt) => {
    if (value.includes(opt)) onChange(value.filter(v => v !== opt));
    else onChange([...value, opt]);
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => toggle(opt)}
          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
            value.includes(opt)
              ? "bg-green-600 text-white border-green-600"
              : "border-gray-200 text-gray-600 hover:border-green-300"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function RadioGroup({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
            value === opt
              ? "bg-blue-600 text-white border-blue-600"
              : "border-gray-200 text-gray-600 hover:border-blue-300"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

const inp = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500";
const ta = `${inp} resize-none`;

export default function AnamneseTab({ patientId }) {
  const [data, setData] = useState(EMPTY);
  const [openSecao, setOpenSecao] = useState(0);

  useEffect(() => {
    const saved = getAnamnese(patientId);
    if (saved) setData(prev => ({ ...prev, ...saved }));
  }, [patientId]);

  const set = (k, v) => setData(d => ({ ...d, [k]: v }));

  const handleSave = () => {
    saveAnamnese(patientId, { ...data, _savedAt: new Date().toISOString() });
    toast.success("Anamnese salva!");
  };

  const toggle = (idx) => setOpenSecao(i => i === idx ? -1 : idx);

  const progress = [
    !!data.queixa || data.doencas.length > 0,
    !!data.refeicoes_dia,
    !!data.freq_intestinal,
    !!data.pratica_af,
    !!data.estresse,
    !!data.peso_max,
    !!data.data_exames || !!data.glicemia,
    !!data.objetivo_principal,
  ];
  const done = progress.filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-green-600" /> Anamnese Nutricional
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">{done} de 8 seções preenchidas</p>
        </div>
        <button onClick={handleSave}
          className="flex items-center gap-1.5 text-sm bg-green-600 text-white px-3 py-2 rounded-xl hover:bg-green-700 transition-colors">
          <Save className="w-3.5 h-3.5" /> Salvar
        </button>
      </div>

      {/* Barra de progresso */}
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 rounded-full transition-all"
          style={{ width: `${(done / 8) * 100}%` }}
        />
      </div>

      <div className="space-y-3">
        {/* SEÇÃO 1 — Dados Clínicos */}
        <Secao idx={0} title="Dados Pessoais e Clínicos" isOpen={openSecao === 0} onToggle={() => toggle(0)} isComplete={progress[0]}>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Queixa principal" col2>
              <textarea rows={2} value={data.queixa} onChange={e => set("queixa", e.target.value)} className={ta} />
            </Field>
            <Field label="Histórico de doenças" col2>
              <CheckGroup options={DOENCAS} value={data.doencas} onChange={v => set("doencas", v)} />
              <input className={`${inp} mt-2`} placeholder="Outro..." value={data.doenca_outro} onChange={e => set("doenca_outro", e.target.value)} />
            </Field>
            <Field label="Medicamentos em uso (nome, dose, frequência)" col2>
              <textarea rows={2} value={data.medicamentos} onChange={e => set("medicamentos", e.target.value)} className={ta} />
            </Field>
            <Field label="Suplementos em uso">
              <textarea rows={2} value={data.suplementos} onChange={e => set("suplementos", e.target.value)} className={ta} />
            </Field>
            <Field label="Cirurgias anteriores">
              <textarea rows={2} value={data.cirurgias} onChange={e => set("cirurgias", e.target.value)} className={ta} />
            </Field>
            <Field label="Histórico familiar de doenças" col2>
              <textarea rows={2} value={data.hist_familiar} onChange={e => set("hist_familiar", e.target.value)} className={ta} />
            </Field>
            <Field label="Alergias e intolerâncias" col2>
              <CheckGroup options={ALERGIAS} value={data.alergias} onChange={v => set("alergias", v)} />
              <input className={`${inp} mt-2`} placeholder="Outra..." value={data.alergia_outro} onChange={e => set("alergia_outro", e.target.value)} />
            </Field>
            <Field label="Restrições religiosas/éticas" col2>
              <RadioGroup options={RESTRICOES} value={data.restricoes[0] || ""} onChange={v => set("restricoes", [v])} />
            </Field>
          </div>
        </Secao>

        {/* SEÇÃO 2 — Hábitos Alimentares */}
        <Secao idx={1} title="Hábitos Alimentares" isOpen={openSecao === 1} onToggle={() => toggle(1)} isComplete={progress[1]}>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Nº de refeições por dia">
              <select value={data.refeicoes_dia} onChange={e => set("refeicoes_dia", e.target.value)} className={inp}>
                {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </Field>
            <Field label="Horário de acordar">
              <input type="time" value={data.horario_acordar} onChange={e => set("horario_acordar", e.target.value)} className={inp} />
            </Field>
            <Field label="Horário de dormir">
              <input type="time" value={data.horario_dormir} onChange={e => set("horario_dormir", e.target.value)} className={inp} />
            </Field>
            <Field label="Quem prepara as refeições">
              <RadioGroup options={["Próprio paciente","Familiar","Empregada doméstica","Restaurante/marmita","Varia"]}
                value={data.quem_prepara} onChange={v => set("quem_prepara", v)} />
            </Field>
            <Field label="Local das refeições">
              <RadioGroup options={["Casa","Trabalho","Restaurante","Misto"]}
                value={data.local_refeicoes} onChange={v => set("local_refeicoes", v)} />
            </Field>
            <Field label={`Consumo de água: ${data.agua_litros} L/dia`} col2>
              <input type="range" min={0} max={4} step={0.25} value={data.agua_litros}
                onChange={e => set("agua_litros", parseFloat(e.target.value))}
                className="w-full accent-green-600" />
            </Field>
            <Field label="Consumo de álcool">
              <RadioGroup options={["Não consome","Ocasional (fins de semana)","Frequente (3+x/semana)","Diário"]}
                value={data.alcool} onChange={v => set("alcool", v)} />
            </Field>
            {data.alcool && data.alcool !== "Não consome" && (
              <Field label="Tipo e quantidade de álcool">
                <input value={data.tipo_alcool} onChange={e => set("tipo_alcool", e.target.value)} className={inp} placeholder="Ex: 2 doses de cerveja nos fins de semana" />
              </Field>
            )}
            <Field label="Consumo de café">
              <RadioGroup options={["Não","1 xícara/dia","2-3 xícaras/dia","4+/dia"]}
                value={data.cafe} onChange={v => set("cafe", v)} />
            </Field>
            <Field label="Belisca entre refeições?">
              <RadioGroup options={["Sim","Não"]} value={data.belisca} onChange={v => set("belisca", v)} />
            </Field>
            <Field label="Velocidade ao comer">
              <RadioGroup options={["Muito rápido","Rápido","Normal","Devagar"]}
                value={data.velocidade_comer} onChange={v => set("velocidade_comer", v)} />
            </Field>
            <Field label="Mastiga bem os alimentos?">
              <RadioGroup options={["Sim","Não"]} value={data.mastiga} onChange={v => set("mastiga", v)} />
            </Field>
            <Field label="Sente fome excessiva?">
              <RadioGroup options={["Sim","Não","Às vezes"]} value={data.fome_excessiva} onChange={v => set("fome_excessiva", v)} />
            </Field>
            <Field label="Compulsão alimentar?">
              <RadioGroup options={["Sim","Não","Às vezes"]} value={data.compulsao} onChange={v => set("compulsao", v)} />
            </Field>
            {data.compulsao === "Sim" && (
              <Field label="Frequência da compulsão">
                <input value={data.compulsao_freq} onChange={e => set("compulsao_freq", e.target.value)} className={inp} placeholder="Ex: 2x por semana" />
              </Field>
            )}
            <Field label="Alimentos preferidos" col2>
              <textarea rows={2} value={data.alimentos_pref} onChange={e => set("alimentos_pref", e.target.value)} className={ta} />
            </Field>
            <Field label="Alimentos que não gosta ou evita" col2>
              <textarea rows={2} value={data.alimentos_evita} onChange={e => set("alimentos_evita", e.target.value)} className={ta} />
            </Field>
            <Field label="Já fez dietas anteriores? Quais resultados?" col2>
              <textarea rows={2} value={data.dietas_anteriores} onChange={e => set("dietas_anteriores", e.target.value)} className={ta} />
            </Field>
          </div>
        </Secao>

        {/* SEÇÃO 3 — Hábito Intestinal */}
        <Secao idx={2} title="Hábito Intestinal e Sintomas" isOpen={openSecao === 2} onToggle={() => toggle(2)} isComplete={progress[2]}>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Frequência intestinal">
              <RadioGroup options={["Diária","A cada 2 dias","2-3x/semana","Irregular","Raro (<2x/semana)"]}
                value={data.freq_intestinal} onChange={v => set("freq_intestinal", v)} />
            </Field>
            <Field label="Consistência das fezes (Escala Bristol)">
              <select value={data.bristol} onChange={e => set("bristol", e.target.value)} className={inp}>
                <option value="">Selecionar</option>
                <option value="1">Tipo 1 — Bolinhas duras e separadas</option>
                <option value="2">Tipo 2 — Em forma de salsicha, grumosa</option>
                <option value="3">Tipo 3 — Salsicha com rachaduras</option>
                <option value="4">Tipo 4 — Salsicha lisa e mole (ideal)</option>
                <option value="5">Tipo 5 — Pedaços moles e bem definidos</option>
                <option value="6">Tipo 6 — Massa mole com bordas irregulares</option>
                <option value="7">Tipo 7 — Líquida, sem pedaços sólidos</option>
              </select>
            </Field>
            <Field label="Sintomas gastrointestinais" col2>
              <CheckGroup options={SINT_GI} value={data.sint_gi} onChange={v => set("sint_gi", v)} />
            </Field>
            <Field label="Saúde bucal">
              <RadioGroup options={["Boa","Regular","Prótese dentária","Dificuldade de mastigação"]}
                value={data.saude_bucal} onChange={v => set("saude_bucal", v)} />
            </Field>
            <Field label="Dificuldade de deglutição?">
              <RadioGroup options={["Sim","Não"]} value={data.dificuldade_degluticao} onChange={v => set("dificuldade_degluticao", v)} />
            </Field>
          </div>
        </Secao>

        {/* SEÇÃO 4 — Atividade Física */}
        <Secao idx={3} title="Atividade Física" isOpen={openSecao === 3} onToggle={() => toggle(3)} isComplete={progress[3]}>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Pratica atividade física?" col2>
              <RadioGroup options={["Sim","Não"]} value={data.pratica_af} onChange={v => set("pratica_af", v)} />
            </Field>
            {data.pratica_af === "Sim" && (
              <>
                <Field label="Tipo de atividade">
                  <RadioGroup options={["Caminhada","Musculação","Natação","Corrida","Dança","Yoga","Outro"]}
                    value={data.tipo_af} onChange={v => set("tipo_af", v)} />
                </Field>
                <Field label="Frequência (vezes/semana)">
                  <select value={data.freq_af} onChange={e => set("freq_af", e.target.value)} className={inp}>
                    {[1,2,3,4,5,6,7].map(n => <option key={n} value={n}>{n}x/semana</option>)}
                  </select>
                </Field>
                <Field label="Duração por sessão">
                  <select value={data.duracao_af} onChange={e => set("duracao_af", e.target.value)} className={inp}>
                    <option value="">Selecionar</option>
                    {["20 min","30 min","45 min","60 min","90 min","120 min+"].map(d => <option key={d}>{d}</option>)}
                  </select>
                </Field>
                <Field label="Há quanto tempo pratica">
                  <input value={data.tempo_pratica} onChange={e => set("tempo_pratica", e.target.value)} className={inp} placeholder="Ex: 6 meses" />
                </Field>
              </>
            )}
            <Field label="Tipo de trabalho" col2>
              <RadioGroup options={["Sedentário (sentado)","Leve (em pé)","Moderado (anda bastante)","Pesado (esforço físico)"]}
                value={data.trabalho} onChange={v => set("trabalho", v)} />
            </Field>
          </div>
        </Secao>

        {/* SEÇÃO 5 — Aspectos Emocionais */}
        <Secao idx={4} title="Aspectos Emocionais e Sono" isOpen={openSecao === 4} onToggle={() => toggle(4)} isComplete={progress[4]}>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={`Nível de estresse: ${data.estresse}/5`} col2>
              <div className="flex items-center gap-3">
                <span className="text-lg">😌</span>
                <input type="range" min={1} max={5} step={1} value={data.estresse}
                  onChange={e => set("estresse", parseInt(e.target.value))}
                  className="flex-1 accent-green-600" />
                <span className="text-lg">😫</span>
              </div>
            </Field>
            <Field label="Come mais quando estressado?">
              <RadioGroup options={["Sim","Não","Às vezes"]} value={data.come_estresse} onChange={v => set("come_estresse", v)} />
            </Field>
            <Field label="Come mais quando ansioso?">
              <RadioGroup options={["Sim","Não","Às vezes"]} value={data.come_ansioso} onChange={v => set("come_ansioso", v)} />
            </Field>
            <Field label="Come mais quando triste?">
              <RadioGroup options={["Sim","Não","Às vezes"]} value={data.come_triste} onChange={v => set("come_triste", v)} />
            </Field>
            <Field label="Qualidade do sono">
              <RadioGroup options={["Ótima","Boa","Regular","Ruim","Péssima"]}
                value={data.qualidade_sono} onChange={v => set("qualidade_sono", v)} />
            </Field>
            <Field label="Horas de sono por noite">
              <select value={data.horas_sono} onChange={e => set("horas_sono", e.target.value)} className={inp}>
                {[4,5,6,7,8,9,10,11,12].map(n => <option key={n} value={n}>{n}h</option>)}
              </select>
            </Field>
            <Field label="Acorda à noite para comer?">
              <RadioGroup options={["Sim","Não"]} value={data.acorda_comer} onChange={v => set("acorda_comer", v)} />
            </Field>
          </div>
        </Secao>

        {/* SEÇÃO 6 — Histórico de Peso */}
        <Secao idx={5} title="Histórico de Peso" isOpen={openSecao === 5} onToggle={() => toggle(5)} isComplete={progress[5]}>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Peso máximo (kg)">
              <input type="number" value={data.peso_max} onChange={e => set("peso_max", e.target.value)} className={inp} />
            </Field>
            <Field label="Quando atingiu o peso máximo">
              <input value={data.peso_max_quando} onChange={e => set("peso_max_quando", e.target.value)} className={inp} placeholder="Ex: 2020" />
            </Field>
            <Field label="Peso mínimo adulto (kg)">
              <input type="number" value={data.peso_min} onChange={e => set("peso_min", e.target.value)} className={inp} />
            </Field>
            <Field label="Quando atingiu o peso mínimo">
              <input value={data.peso_min_quando} onChange={e => set("peso_min_quando", e.target.value)} className={inp} placeholder="Ex: 2018" />
            </Field>
            <Field label="Com qual peso se sente bem (kg)">
              <input type="number" value={data.peso_bem} onChange={e => set("peso_bem", e.target.value)} className={inp} />
            </Field>
            <Field label="Histórico de variações de peso" col2>
              <textarea rows={2} value={data.hist_variacao} onChange={e => set("hist_variacao", e.target.value)} className={ta} />
            </Field>
            <Field label="Medicamentos para emagrecer" col2>
              <textarea rows={2} value={data.medicamentos_emagrecer} onChange={e => set("medicamentos_emagrecer", e.target.value)} className={ta} />
            </Field>
          </div>
        </Secao>

        {/* SEÇÃO 7 — Exames */}
        <Secao idx={6} title="Exames Clínicos Recentes" isOpen={openSecao === 6} onToggle={() => toggle(6)} isComplete={progress[6]}>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Data dos exames" col2>
              <input type="date" value={data.data_exames} onChange={e => set("data_exames", e.target.value)} className={inp} />
            </Field>
            {[
              ["Glicemia em jejum (mg/dL)", "glicemia"],
              ["HbA1c (%)", "hba1c"],
              ["Colesterol Total (mg/dL)", "col_total"],
              ["LDL (mg/dL)", "ldl"],
              ["HDL (mg/dL)", "hdl"],
              ["Triglicerídeos (mg/dL)", "trigli"],
              ["TSH (mUI/L)", "tsh"],
              ["T4 Livre", "t4l"],
              ["Vitamina D (ng/mL)", "vitD"],
              ["Vitamina B12 (pg/mL)", "vitB12"],
              ["Hemoglobina (g/dL)", "hemoglobina"],
              ["Ferritina (ng/mL)", "ferritina"],
              ["Pressão arterial (mmHg)", "pressao"],
            ].map(([label, key]) => (
              <Field key={key} label={label}>
                <input value={data[key] || ""} onChange={e => set(key, e.target.value)} className={inp} placeholder="—" />
              </Field>
            ))}
            <Field label="Observações do médico" col2>
              <textarea rows={2} value={data.obs_medico} onChange={e => set("obs_medico", e.target.value)} className={ta} />
            </Field>
          </div>
        </Secao>

        {/* SEÇÃO 8 — Objetivos */}
        <Secao idx={7} title="Objetivos e Expectativas" isOpen={openSecao === 7} onToggle={() => toggle(7)} isComplete={progress[7]}>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Objetivo principal">
              <select value={data.objetivo_principal} onChange={e => set("objetivo_principal", e.target.value)} className={inp}>
                <option value="">Selecionar</option>
                {["Emagrecimento","Ganho de massa","Manutenção de peso","Saúde geral","Controle de doença","Performance esportiva","Melhora da digestão","Outro"].map(o => <option key={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="Meta de peso (kg)">
              <input type="number" value={data.meta_peso} onChange={e => set("meta_peso", e.target.value)} className={inp} />
            </Field>
            <Field label="Prazo esperado (meses)">
              <input type="number" value={data.prazo_meses} onChange={e => set("prazo_meses", e.target.value)} className={inp} />
            </Field>
            <Field label={`Comprometimento para mudanças: ${data.comprometimento}/5`} col2>
              <div className="flex items-center gap-3">
                <span className="text-lg">😐</span>
                <input type="range" min={1} max={5} step={1} value={data.comprometimento}
                  onChange={e => set("comprometimento", parseInt(e.target.value))}
                  className="flex-1 accent-green-600" />
                <span className="text-lg">💪</span>
              </div>
            </Field>
            <Field label="O que já tentou e não funcionou" col2>
              <textarea rows={2} value={data.tentou} onChange={e => set("tentou", e.target.value)} className={ta} />
            </Field>
            <Field label="Motivação principal" col2>
              <textarea rows={2} value={data.motivacao} onChange={e => set("motivacao", e.target.value)} className={ta} />
            </Field>
          </div>
        </Secao>
      </div>

      {data._savedAt && (
        <p className="text-xs text-gray-400 text-right">
          Última atualização: {new Date(data._savedAt).toLocaleString("pt-BR")}
        </p>
      )}
    </div>
  );
}
