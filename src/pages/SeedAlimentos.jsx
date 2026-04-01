import { useState } from "react";
import { db as base44 } from "@/api/localDB";
import { Loader2, CheckCircle2, AlertCircle, Play, Database, ChevronDown, ChevronUp } from "lucide-react";

const BATCHES = [
  { categoria: "fruta", label: "Frutas Tropicais", emoji: "🍍", count: 35, descricao: "frutas tropicais e comuns no Brasil como manga, açaí, goiaba, maracujá, caju, jabuticaba, pitanga, carambola, acerola, cupuaçu, graviola, umbu, murici, cajá, tamarindo, etc." },
  { categoria: "grao", label: "Feijões e Grãos", emoji: "🫘", count: 35, descricao: "feijões, grãos e leguminosas brasileiras como feijão carioca, feijão preto, feijão branco, feijão fradinho, feijão de corda, lentilha, grão-de-bico, soja, ervilha, amendoim, trigo, milho, arroz branco, arroz integral, aveia, etc." },
  { categoria: "proteina", label: "Carnes Comuns", emoji: "🥩", count: 35, descricao: "carnes típicas consumidas no Brasil como frango (peito, coxa, sobrecoxa, asa), carne bovina (patinho, alcatra, picanha, acém, costela, músculo), porco (lombo, pernil, costela), peixe (tilápia, sardinha, atum, bacalhau, salmão, pintado), camarão, ovos, etc." },
  { categoria: "laticinios", label: "Laticínios", emoji: "🧀", count: 30, descricao: "laticínios brasileiros como leite integral, leite desnatado, iogurte natural, iogurte grego, queijo minas, queijo prato, queijo mussarela, queijo coalho, queijo parmesão, requeijão, manteiga, creme de leite, leite condensado, doce de leite, etc." },
  { categoria: "grao", label: "Pães e Farinhas", emoji: "🍞", count: 30, descricao: "pães, farinhas e derivados comuns no Brasil como pão francês, pão de forma, pão integral, bolo simples, biscoito de polvilho, tapioca, farinha de mandioca, farinha de trigo, farinha de milho, fubá, polenta, macarrão, macarrão integral, cuscuz nordestino, biju, pamonha, etc." },
  { categoria: "vegetal", label: "Verduras e Legumes", emoji: "🥦", count: 35, descricao: "verduras e legumes típicos do Brasil como couve, espinafre, rúcula, alface, agrião, chicória, brócolis, couve-flor, chuchu, abobrinha, berinjela, pimentão, tomate, cenoura, batata, batata-doce, mandioca, inhame, cará, quiabo, maxixe, jiló, abóbora, etc." },
];

export default function SeedAlimentos() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState([]);
  const [currentBatch, setCurrentBatch] = useState(null);
  const [done, setDone] = useState(false);
  const [expandedBatch, setExpandedBatch] = useState(null);

  const totalExpected = BATCHES.reduce((s, b) => s + b.count, 0);
  const totalInserted = results.reduce((s, r) => s + (r.inserted || 0), 0);

  const runSeed = async () => {
    setRunning(true);
    setResults([]);
    setDone(false);

    for (const batch of BATCHES) {
      setCurrentBatch(batch.label);

      const prompt = `Você é um nutricionista e especialista em tabela TACO (Tabela Brasileira de Composição de Alimentos).
Gere exatamente ${batch.count} alimentos diferentes da categoria: ${batch.descricao}

IMPORTANTE:
- Todos os alimentos devem ser típicos do Brasil
- Valores nutricionais por 100g (porção padrão)
- Use valores realistas baseados na tabela TACO ou IBGE
- Não repita alimentos
- Inclua variedade (crus, cozidos, diferentes formas de preparo quando relevante)
- Para carnes: inclua crus e cozidos separadamente quando pertinente
- fonte: "verificado" para alimentos bem conhecidos da tabela TACO, "usuario" para os demais

Retorne EXATAMENTE ${batch.count} alimentos no array "alimentos".`;

      const schema = {
        type: "object",
        properties: {
          alimentos: {
            type: "array",
            items: {
              type: "object",
              properties: {
                nome: { type: "string" },
                marca: { type: "string" },
                porcao_gramas: { type: "number" },
                calorias: { type: "number" },
                proteinas_g: { type: "number" },
                carboidratos_g: { type: "number" },
                gorduras_g: { type: "number" },
                fibras_g: { type: "number" },
                sodio_mg: { type: "number" },
                calcio_mg: { type: "number" },
                ferro_mg: { type: "number" },
                vitamina_c_mg: { type: "number" },
                vitamina_d_mcg: { type: "number" },
                fonte: { type: "string" },
                categoria: { type: "string" }
              }
            }
          }
        }
      };

      let inserted = 0;
      let error = null;
      let items = [];

      const aiResult = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: schema
      });

      items = aiResult?.alimentos || [];

      const toInsert = items.map(item => ({
        ...item,
        categoria: batch.categoria,
        porcao_gramas: item.porcao_gramas || 100,
        fonte: item.fonte || "verificado",
        marca: item.marca || null,
        sodio_mg: item.sodio_mg || 0,
        calcio_mg: item.calcio_mg || 0,
        ferro_mg: item.ferro_mg || 0,
        vitamina_c_mg: item.vitamina_c_mg || 0,
        vitamina_d_mcg: item.vitamina_d_mcg || 0,
        fibras_g: item.fibras_g || 0,
      }));

      if (toInsert.length > 0) {
        await base44.entities.Alimento.bulkCreate(toInsert);
        inserted = toInsert.length;
      }

      setResults(prev => [...prev, {
        label: batch.label,
        emoji: batch.emoji,
        categoria: batch.categoria,
        inserted,
        error,
        items: toInsert
      }]);
    }

    setCurrentBatch(null);
    setRunning(false);
    setDone(true);
  };

  const categoryLabels = {
    fruta: "Frutas",
    grao: "Grãos/Pães",
    proteina: "Carnes",
    laticinios: "Laticínios",
    vegetal: "Verduras/Legumes"
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-2xl">🌱</div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Seed de Alimentos Brasileiros</h1>
            <p className="text-sm text-gray-500">Gera e insere {totalExpected} alimentos com IA na tabela nutricional</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5">
          {BATCHES.map(b => (
            <div key={b.label} className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="text-xl mb-1">{b.emoji}</div>
              <p className="text-xs font-medium text-gray-700">{b.label}</p>
              <p className="text-xs text-gray-400">{b.count} itens</p>
            </div>
          ))}
        </div>

        <button
          onClick={runSeed}
          disabled={running}
          className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {running ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Gerando e inserindo dados...</>
          ) : (
            <><Play className="w-5 h-5" /> Executar Seed ({totalExpected} alimentos)</>
          )}
        </button>

        {running && currentBatch && (
          <div className="mt-3 flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-xl px-4 py-2.5">
            <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
            Processando lote: <strong>{currentBatch}</strong>
          </div>
        )}
      </div>

      {/* Progress */}
      {results.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-gray-900">Progresso</h2>
            <span className="text-sm text-gray-500">{results.length}/{BATCHES.length} lotes</span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-100 rounded-full h-2.5 mb-4">
            <div
              className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${(results.length / BATCHES.length) * 100}%` }}
            />
          </div>

          {results.map((r, i) => (
            <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedBatch(expandedBatch === i ? null : i)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{r.emoji}</span>
                  <div className="text-left">
                    <p className="font-medium text-gray-800">{r.label}</p>
                    <p className="text-xs text-gray-400">{r.inserted} alimentos inseridos</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {r.error ? (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  )}
                  {expandedBatch === i ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
              </button>

              {expandedBatch === i && r.items?.length > 0 && (
                <div className="border-t border-gray-100 p-4 bg-gray-50">
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {r.items.map((item, j) => (
                      <div key={j} className="flex items-center justify-between text-xs py-1 border-b border-gray-100 last:border-0">
                        <span className="text-gray-700 font-medium">{item.nome}</span>
                        <span className="text-gray-400">{item.calorias} kcal · P:{item.proteinas_g}g · C:{item.carboidratos_g}g · G:{item.gorduras_g}g</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Final Report */}
      {done && (
        <div className="bg-white rounded-2xl border border-green-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Database className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Relatório Final</h2>
              <p className="text-sm text-gray-500">Seed concluído com sucesso</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            {results.map((r, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                <span className="text-2xl">{r.emoji}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{r.inserted}</p>
                  <p className="text-xs text-gray-400">{r.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-green-700">{totalInserted}</p>
            <p className="text-sm text-green-600 mt-1">alimentos inseridos na base de dados</p>
          </div>
        </div>
      )}
    </div>
  );
}