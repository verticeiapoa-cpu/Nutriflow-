import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, TrendingUp, BarChart2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import AnthropometryForm from "../anthropometry/AnthropometryForm";

export default function AnthropometryTab({ patientId, patientName }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const data = await base44.entities.Anthropometry.filter({ patient_id: patientId });
    setRecords(data.sort((a, b) => a.date?.localeCompare(b.date)));
    setLoading(false);
  };

  useEffect(() => { load(); }, [patientId]);

  const latest = records[records.length - 1];

  const bmiLabel = (bmi) => {
    if (!bmi) return "-";
    if (bmi < 18.5) return "Abaixo do peso";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Sobrepeso";
    return "Obesidade";
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Avaliação Antropométrica</h3>
        <div className="flex gap-2">
          {records.length > 0 && (
            <Link
              to={createPageUrl(`PatientProgress?id=${patientId}`)}
              className="flex items-center gap-1.5 text-sm bg-blue-50 text-blue-700 px-3 py-2 rounded-xl hover:bg-blue-100 transition-colors"
            >
              <BarChart2 className="w-3.5 h-3.5" /> Ver Relatório
            </Link>
          )}
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 text-sm bg-green-600 text-white px-3 py-2 rounded-xl hover:bg-green-700 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Nova Avaliação
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-32 bg-gray-50 rounded-xl animate-pulse" />
      ) : records.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <TrendingUp className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">Nenhuma avaliação registrada</p>
        </div>
      ) : (
        <>
          {latest && (
            <div>
              <p className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wide">Última avaliação · {latest.date}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: "Peso", value: `${latest.weight || "-"} kg` },
                  { label: "Altura", value: `${latest.height || "-"} cm` },
                  { label: "IMC", value: latest.bmi ? `${latest.bmi.toFixed(1)} - ${bmiLabel(latest.bmi)}` : "-" },
                  { label: "% Gordura", value: `${latest.body_fat_percent || "-"}%` },
                  { label: "Massa Muscular", value: `${latest.muscle_mass || "-"} kg` },
                  { label: "Cintura", value: `${latest.waist || "-"} cm` },
                  { label: "Quadril", value: `${latest.hip || "-"} cm` },
                  { label: "Abdômen", value: `${latest.abdomen || "-"} cm` },
                  { label: "Gordura Visceral", value: `${latest.visceral_fat || "-"}` },
                ].filter(i => i.value !== "- cm" && i.value !== "-%" && i.value !== "- kg" && i.value !== "-").map((item, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400">{item.label}</p>
                    <p className="text-sm font-semibold text-gray-800">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {records.length > 1 && (
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-3">Evolução do Peso</p>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={records}>
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis domain={["auto", "auto"]} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="weight" stroke="#16a34a" strokeWidth={2} dot={{ r: 4, fill: "#16a34a" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          <div>
            <p className="text-sm font-semibold text-gray-800 mb-3">Histórico</p>
            <div className="space-y-2">
              {[...records].reverse().map((r, i) => (
                <div key={i} className="flex items-center gap-4 bg-gray-50 rounded-xl p-3 text-sm">
                  <span className="text-gray-400 text-xs w-24 flex-shrink-0">{r.date}</span>
                  <span className="font-medium">{r.weight} kg</span>
                  {r.bmi && <span className="text-gray-500">IMC: {r.bmi?.toFixed(1)}</span>}
                  {r.body_fat_percent && <span className="text-gray-500">G: {r.body_fat_percent}%</span>}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {showForm && (
        <AnthropometryForm
          patients={[{ id: patientId, full_name: patientName }]}
          defaultPatient={{ id: patientId, full_name: patientName }}
          onClose={() => setShowForm(false)}
          onSave={() => { load(); setShowForm(false); }}
        />
      )}
    </div>
  );
}