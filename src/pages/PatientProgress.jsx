import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, TrendingDown, TrendingUp, Minus, Activity, Scale, Ruler } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import jsPDF from "jspdf";
import { FileDown } from "lucide-react";

export default function PatientProgress() {
  const urlParams = new URLSearchParams(window.location.search);
  const patientId = urlParams.get("id");

  const [patient, setPatient] = useState(null);
  const [anthropometry, setAnthropometry] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId) return;
    Promise.all([
      base44.entities.Patient.filter({ id: patientId }),
      base44.entities.Anthropometry.filter({ patient_id: patientId }),
      base44.entities.Consultation.filter({ patient_id: patientId }),
    ]).then(([p, a, c]) => {
      setPatient(p[0] || null);
      setAnthropometry(a.sort((x, y) => x.date?.localeCompare(y.date)));
      setConsultations(c.sort((x, y) => x.date?.localeCompare(y.date)));
      setLoading(false);
    });
  }, [patientId]);

  const first = anthropometry[0];
  const last = anthropometry[anthropometry.length - 1];

  const diff = (key) => {
    if (!first || !last || first === last) return null;
    const d = (last[key] || 0) - (first[key] || 0);
    return d;
  };

  const DiffBadge = ({ value, inverse = false, unit = "kg" }) => {
    if (value === null || value === undefined || value === 0) return <span className="text-gray-400 text-sm">—</span>;
    const isPositive = value > 0;
    const isGood = inverse ? isPositive : !isPositive;
    return (
      <span className={`flex items-center gap-1 text-sm font-semibold ${isGood ? "text-green-600" : "text-red-500"}`}>
        {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
        {isPositive ? "+" : ""}{value?.toFixed(1)} {unit}
      </span>
    );
  };

  const exportPDF = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 20;
    let y = 20;

    // Header
    doc.setFillColor(22, 163, 74);
    doc.rect(0, 0, pageW, 35, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Relatório de Evolução", margin, 17);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Paciente: ${patient?.full_name}  ·  Gerado em ${new Date().toLocaleDateString("pt-BR")}`, margin, 28);
    y = 48;

    // Summary
    if (first && last) {
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Evolução Geral", margin, y);
      y += 8;

      const rows = [
        ["Peso", first.weight?.toFixed(1), last.weight?.toFixed(1), `${diff("weight")?.toFixed(1)} kg`],
        ["IMC", first.bmi?.toFixed(1), last.bmi?.toFixed(1), `${diff("bmi")?.toFixed(1)}`],
        ["% Gordura", first.body_fat_percent?.toFixed(1), last.body_fat_percent?.toFixed(1), `${diff("body_fat_percent")?.toFixed(1)}%`],
        ["Massa Muscular", first.muscle_mass?.toFixed(1), last.muscle_mass?.toFixed(1), `${diff("muscle_mass")?.toFixed(1)} kg`],
        ["Cintura", first.waist?.toFixed(0), last.waist?.toFixed(0), `${diff("waist")?.toFixed(0)} cm`],
      ].filter(r => r[1] && r[2] && r[1] !== "undefined" && r[2] !== "undefined");

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(100, 100, 100);
      doc.text("Medida", margin, y);
      doc.text("Inicial", margin + 60, y);
      doc.text("Atual", margin + 100, y);
      doc.text("Variação", margin + 140, y);
      y += 5;
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, y, pageW - margin, y);
      y += 5;

      rows.forEach(([label, ini, cur, var_]) => {
        doc.setFont("helvetica", "normal");
        doc.setTextColor(50, 50, 50);
        doc.text(label, margin, y);
        doc.text(ini || "-", margin + 60, y);
        doc.text(cur || "-", margin + 100, y);
        doc.text(var_ || "-", margin + 140, y);
        y += 7;
      });
    }

    // Anthropometry history
    if (anthropometry.length > 0) {
      y += 5;
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Histórico de Avaliações", margin, y);
      y += 8;

      anthropometry.forEach((a) => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(22, 163, 74);
        doc.text(a.date || "-", margin, y);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(60, 60, 60);
        const info = [a.weight ? `Peso: ${a.weight}kg` : "", a.bmi ? `IMC: ${a.bmi?.toFixed(1)}` : "", a.body_fat_percent ? `Gordura: ${a.body_fat_percent}%` : ""].filter(Boolean).join("   ");
        doc.text(info, margin + 25, y);
        y += 6;
      });
    }

    doc.save(`evolucao_${patient?.full_name?.replace(/\s+/g, "_")}.pdf`);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!patient) return (
    <div className="text-center py-16 text-gray-400">
      <p>Paciente não encontrado.</p>
      <Link to={createPageUrl("Patients")} className="text-green-600 underline mt-2 block">Voltar</Link>
    </div>
  );

  const chartData = anthropometry.map(a => ({
    data: a.date,
    Peso: a.weight,
    "% Gordura": a.body_fat_percent,
    "Massa Muscular": a.muscle_mass,
  }));

  const weightDiff = diff("weight");
  const fatDiff = diff("body_fat_percent");
  const muscleDiff = diff("muscle_mass");
  const waistDiff = diff("waist");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to={createPageUrl(`PatientDetail?id=${patientId}`)} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800">
          <ArrowLeft className="w-4 h-4" /> Voltar ao Prontuário
        </Link>
        <button onClick={exportPDF} className="flex items-center gap-2 text-sm bg-green-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-green-700 transition-colors">
          <FileDown className="w-4 h-4" /> Exportar Relatório PDF
        </button>
      </div>

      {/* Patient Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
        <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
          {patient.full_name?.[0]}
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{patient.full_name}</h1>
          <p className="text-sm text-gray-400 capitalize">{patient.objective} · {anthropometry.length} avaliações</p>
        </div>
      </div>

      {/* Progress Summary Cards */}
      {first && last && first !== last && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Peso", icon: Scale, value: weightDiff, unit: "kg", inverse: false },
            { label: "% Gordura", icon: Activity, value: fatDiff, unit: "%", inverse: false },
            { label: "Massa Muscular", icon: TrendingUp, value: muscleDiff, unit: "kg", inverse: true },
            { label: "Cintura", icon: Ruler, value: waistDiff, unit: "cm", inverse: false },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center gap-2 mb-2">
                <item.icon className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-500">{item.label}</p>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-gray-400">Atual</p>
                  <p className="text-xl font-bold text-gray-900">{last[Object.keys(last).find(k => k.includes(item.label.toLowerCase().replace("% ", "").replace(" ", "_"))) || "weight"] || last.weight} {item.unit}</p>
                </div>
                <DiffBadge value={item.value} inverse={item.inverse} unit={item.unit} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Charts */}
      {chartData.length > 1 && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Evolução do Peso (kg)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <XAxis dataKey="data" tick={{ fontSize: 10 }} />
                <YAxis domain={["auto", "auto"]} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="Peso" stroke="#16a34a" strokeWidth={2} dot={{ r: 4, fill: "#16a34a" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Composição Corporal (%)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} barSize={20}>
                <XAxis dataKey="data" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="% Gordura" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Massa Muscular" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Histórico Completo de Avaliações</h3>
        {anthropometry.length === 0 ? (
          <p className="text-center py-8 text-gray-400 text-sm">Nenhuma avaliação registrada</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Data", "Peso", "IMC", "% Gordura", "Massa Musc.", "Cintura", "Quadril"].map(h => (
                    <th key={h} className="text-left text-xs text-gray-400 font-medium py-2 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...anthropometry].reverse().map((a, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-2.5 pr-4 font-medium text-gray-700">{a.date}</td>
                    <td className="py-2.5 pr-4">{a.weight ? `${a.weight} kg` : "—"}</td>
                    <td className="py-2.5 pr-4">{a.bmi ? a.bmi.toFixed(1) : "—"}</td>
                    <td className="py-2.5 pr-4">{a.body_fat_percent ? `${a.body_fat_percent}%` : "—"}</td>
                    <td className="py-2.5 pr-4">{a.muscle_mass ? `${a.muscle_mass} kg` : "—"}</td>
                    <td className="py-2.5 pr-4">{a.waist ? `${a.waist} cm` : "—"}</td>
                    <td className="py-2.5 pr-4">{a.hip ? `${a.hip} cm` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}