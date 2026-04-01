import { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Search, SlidersHorizontal, ShieldCheck } from "lucide-react";
import AlimentoCard from "../components/alimentos/AlimentoCard";
import AlimentoModal from "../components/alimentos/AlimentoModal";

const CATEGORIAS = [
  { value: "", label: "Todos", emoji: "🍽️" },
  { value: "fruta", label: "Frutas", emoji: "🍍" },
  { value: "vegetal", label: "Verduras/Legumes", emoji: "🥦" },
  { value: "proteina", label: "Carnes/Proteínas", emoji: "🥩" },
  { value: "grao", label: "Grãos e Pães", emoji: "🫘" },
  { value: "laticinios", label: "Laticínios", emoji: "🧀" },
  { value: "ultraprocessado", label: "Ultraprocessados", emoji: "🍟" },
  { value: "outro", label: "Outros", emoji: "🥡" },
];

export default function TabelaAlimentos() {
  const [alimentos, setAlimentos] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState("");
  const [apenasVerificados, setApenasVerificados] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    base44.entities.Alimento.list("-created_date", 500).then(data => {
      setAlimentos(data);
      setFiltered(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let result = alimentos;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(a => a.nome?.toLowerCase().includes(q) || a.marca?.toLowerCase().includes(q));
    }
    if (categoria) result = result.filter(a => a.categoria === categoria);
    if (apenasVerificados) result = result.filter(a => a.fonte === "verificado");
    setFiltered(result);
  }, [search, categoria, apenasVerificados, alimentos]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tabela de Alimentos</h1>
        <p className="text-sm text-gray-500">{alimentos.length} alimentos cadastrados · {filtered.length} exibidos</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar filtros */}
        <aside className="lg:w-56 flex-shrink-0 space-y-4">
          {/* Verificados toggle */}
          <div
            onClick={() => setApenasVerificados(v => !v)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-all select-none ${
              apenasVerificados
                ? "bg-green-50 border-green-300 text-green-700"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="text-sm font-medium">Apenas verificados</span>
          </div>

          {/* Categorias */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-3 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Categorias
            </p>
            <div className="space-y-1">
              {CATEGORIAS.map(c => (
                <button
                  key={c.value}
                  onClick={() => setCategoria(c.value)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors ${
                    categoria === c.value
                      ? "bg-green-50 text-green-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span>{c.emoji}</span> {c.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar alimento por nome ou marca..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-sm"
              autoFocus
            />
          </div>

          {/* Results */}
          {loading ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="h-36 bg-white rounded-2xl animate-pulse border border-gray-100" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Nenhum alimento encontrado</p>
              <p className="text-sm mt-1">Tente outro termo ou categoria</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(alimento => (
                <AlimentoCard
                  key={alimento.id}
                  alimento={alimento}
                  onClick={() => setSelected(alimento)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {selected && (
        <AlimentoModal alimento={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}