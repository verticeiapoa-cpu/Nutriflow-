import { useState, useEffect } from "react";
import { db as base44 } from "@/api/localDB";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, Search, Activity, TrendingUp, User } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import AnthropometryForm from "../components/anthropometry/AnthropometryForm";

export default function Anthropometry() {
  const [records, setRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const [r, p] = await Promise.all([
      base44.entities.Anthropometry.list("-date", 200),
      base44.entities.Patient.list("-created_date", 100)
    ]);
    setRecords(r);
    setPatients(p);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filteredPatients = patients.filter(p =>
    p.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  const patientRecords = selectedPatient
    ? records.filter(r => r.patient_id === selectedPatient.id).sort((a, b) => a.date?.localeCompare(b.date))
    : [];

  const latestRecord = patientRecords[patientRecords.length - 1];

  const bmiCategory = (bmi) => {
    if (!bmi) return { label: "N/A", color: "text-gray-500" };
    if (bmi < 18.5) return { label: "Abaixo do peso", color: "text-blue-600" };
    if (bmi < 25) return { label: "Peso normal", color: "text-green-600" };
    if (bmi < 30) return { label: "Sobrepeso", color: "text-amber-600" };
    return { label: "Obesidade", color: "text-red-600" };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Avaliação Corporal</h1>
          <p className="text-gray-500 text-sm">{records.length} avaliações registradas</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Nova Avaliação
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Patient List */}
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
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredPatients.map(p => {
              const pRecords = records.filter(r => r.patient_id === p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPatient(p)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${
                    selectedPatient?.id === p.id ? "bg-green-50 border border-green-200" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {p.full_name?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{p.full_name}</p>
                    <p className="text-xs text-gray-400">{pRecords.length} avaliação(ões)</p>
                  </div>
                  <TrendingUp className={`w-4 h-4 ${pRecords.length > 1 ? "text-green-500" : "text-gray-300"}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Patient Data */}
        <div className="lg:col-span-2 space-y-5">
          {!selectedPatient ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center h-64 text-gray-400">
              <div className="text-center">
                <Activity className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Selecione um paciente para ver as avaliações</p>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900">{selectedPatient.full_name}</h2>
                  <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-1 text-sm text-green-600 hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" /> Nova avaliação
                  </button>
                </div>

                {latestRecord ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { label: "Peso", value: `${latestRecord.weight || "-"} kg` },
                      { label: "Altura", value: `${latestRecord.height || "-"} cm` },
                      { label: "IMC", value: latestRecord.bmi ? `${latestRecord.bmi.toFixed(1)}` : "-", extra: bmiCategory(latestRecord.bmi) },
                      { label: "% Gordura", value: `${latestRecord.body_fat_percent || "-"}%` },
                      { label: "Massa Muscular", value: `${latestRecord.muscle_mass || "-"} kg` },
                      { label: "Cintura", value: `${latestRecord.waist || "-"} cm` },
                    ].map((item, i) => (
                      <div key={i} className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-400 mb-0.5">{item.label}</p>
                        <p className="font-semibold text-gray-800">{item.value}</p>
                        {item.extra && <p className={`text-xs font-medium mt-0.5 ${item.extra.color}`}>{item.extra.label}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm text-center py-6">Nenhuma avaliação registrada para este paciente.</p>
                )}
              </div>

              {/* Weight Evolution Chart */}
              {patientRecords.length > 1 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h3 className="font-semibold text-gray-900 mb-4">Evolução do Peso</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={patientRecords}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(v) => [`${v} kg`, "Peso"]} />
                      <Line type="monotone" dataKey="weight" stroke="#16a34a" strokeWidth={2} dot={{ fill: "#16a34a", r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* History */}
              {patientRecords.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h3 className="font-semibold text-gray-900 mb-4">Histórico de Avaliações</h3>
                  <div className="space-y-2">
                    {[...patientRecords].reverse().map((r, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl text-sm">
                        <span className="text-gray-400 text-xs w-24 flex-shrink-0">{r.date}</span>
                        <span className="font-medium text-gray-800">{r.weight} kg</span>
                        <span className="text-gray-500">IMC: {r.bmi?.toFixed(1)}</span>
                        <span className="text-gray-500">Gordura: {r.body_fat_percent}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showForm && (
        <AnthropometryForm
          patients={patients}
          defaultPatient={selectedPatient}
          onClose={() => setShowForm(false)}
          onSave={() => { load(); setShowForm(false); }}
        />
      )}
    </div>
  );
}