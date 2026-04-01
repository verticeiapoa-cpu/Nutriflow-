import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, Search, Filter, Phone, MessageCircle, ChevronRight, Users } from "lucide-react";
import PatientForm from "../components/patients/PatientForm";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const data = await base44.entities.Patient.list("-created_date", 100);
    setPatients(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = patients.filter(p => {
    const matchSearch = p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.phone?.includes(search) || p.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "todos" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleWhatsApp = (phone, name) => {
    const msg = encodeURIComponent(`Olá ${name}! Aqui é da sua nutricionista. Tudo bem?`);
    const num = phone?.replace(/\D/g, "");
    window.open(`https://wa.me/55${num}?text=${msg}`, "_blank");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pacientes</h1>
          <p className="text-gray-500 text-sm">{patients.length} pacientes cadastrados</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Paciente
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome, telefone ou e-mail..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          />
        </div>
        <div className="flex gap-2">
          {["todos", "ativo", "novo", "inativo"].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors capitalize ${
                statusFilter === s ? "bg-green-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Patient Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-40 bg-white rounded-2xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">Nenhum paciente encontrado</p>
          <p className="text-sm mt-1">Clique em "Novo Paciente" para cadastrar</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {p.full_name?.[0] || "P"}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{p.full_name}</h3>
                    <p className="text-xs text-gray-400 capitalize">{p.objective || "objetivo não definido"}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  p.status === "ativo" ? "bg-green-100 text-green-700" :
                  p.status === "novo" ? "bg-blue-100 text-blue-700" :
                  "bg-gray-100 text-gray-500"
                }`}>{p.status}</span>
              </div>
              <div className="space-y-1.5 mb-4">
                {p.phone && <p className="text-sm text-gray-500 flex items-center gap-2"><Phone className="w-3.5 h-3.5" />{p.phone}</p>}
                {p.next_appointment && <p className="text-xs text-gray-400">Próxima consulta: {p.next_appointment}</p>}
              </div>
              <div className="flex gap-2">
                <Link
                  to={createPageUrl(`PatientDetail?id=${p.id}`)}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-50 text-green-700 py-2 rounded-xl text-sm font-medium hover:bg-green-100 transition-colors"
                >
                  Ver Prontuário <ChevronRight className="w-3.5 h-3.5" />
                </Link>
                {p.phone && (
                  <button
                    onClick={() => handleWhatsApp(p.phone, p.full_name)}
                    className="p-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                    title="Enviar WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <PatientForm
          onClose={() => setShowForm(false)}
          onSave={() => { load(); setShowForm(false); }}
        />
      )}
    </div>
  );
}