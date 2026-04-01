import { useState, useEffect } from "react";
import { db as base44 } from "@/api/localDB";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  ArrowLeft, User, Activity, Utensils, FlaskConical, Calendar,
  MessageCircle, Edit2, Send, FileText, Target, Scale, BookOpen, ClipboardList
} from "lucide-react";
import AnthropometryTab from "../components/patients/AnthropometryTab";
import MealPlanTab from "../components/patients/MealPlanTab";
import LabExamsTab from "../components/patients/LabExamsTab";
import ConsultationsTab from "../components/patients/ConsultationsTab";
import PatientForm from "../components/patients/PatientForm";
import AnamneseTab from "../components/patients/AnamneseTab";
import AntropometriaTab from "../components/patients/AntropometriaTab";
import RecordatorioTab from "../components/patients/RecordatorioTab";
import MetasTab from "../components/patients/MetasTab";
import { getFotoPaciente, getAnamnese } from "@/lib/storage";

const tabs = [
  { id: "overview",      label: "Visão Geral",    icon: User },
  { id: "anamnese",      label: "Anamnese",        icon: ClipboardList },
  { id: "anthropometry", label: "Avaliação",       icon: Activity },
  { id: "antro_full",    label: "Antropometria",   icon: Scale },
  { id: "mealplan",      label: "Plano Alimentar", icon: Utensils },
  { id: "recordatorio",  label: "Recordatório",    icon: BookOpen },
  { id: "metas",         label: "Metas",           icon: Target },
  { id: "exams",         label: "Exames",          icon: FlaskConical },
  { id: "consultations", label: "Consultas",       icon: Calendar },
];

export default function PatientDetail() {
  const [patient, setPatient] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [foto, setFoto] = useState(null);
  const [hasAnamnese, setHasAnamnese] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const patientId = urlParams.get("id");

  useEffect(() => {
    if (patientId) {
      base44.entities.Patient.filter({ id: patientId }).then(data => {
        const p = data[0] || null;
        setPatient(p);
        setLoading(false);
        if (p) {
          setFoto(getFotoPaciente(p.id));
          setHasAnamnese(!!getAnamnese(p.id));
        }
      });
    }
  }, [patientId]);

  const handleWhatsApp = (msg) => {
    const num = patient?.phone?.replace(/\D/g, "");
    const text = encodeURIComponent(msg);
    window.open(`https://wa.me/55${num}?text=${text}`, "_blank");
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

  const infoItems = [
    { label: "Objetivo", value: patient.objective },
    { label: "Telefone", value: patient.phone },
    { label: "E-mail", value: patient.email },
    { label: "Status", value: patient.status },
    { label: "Próxima Consulta", value: patient.next_appointment },
  ].filter(i => i.value);

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link to={createPageUrl("Patients")} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800">
        <ArrowLeft className="w-4 h-4" /> Voltar aos Pacientes
      </Link>

      {/* Header Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-5">
          <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
            {foto ? (
              <img src={foto} alt="Foto" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-3xl">
                {patient.full_name?.[0]}
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">{patient.full_name}</h1>
                  {hasAnamnese && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Anamnese ✓</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {patient.gender && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full capitalize">{patient.gender}</span>}
                  {patient.objective && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full capitalize">{patient.objective}</span>}
                  {patient.status && <span className={`text-xs px-2 py-1 rounded-full capitalize font-medium ${
                    patient.status === "ativo" ? "bg-green-100 text-green-700" :
                    patient.status === "novo" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"
                  }`}>{patient.status}</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowEdit(true)}
                  className="flex items-center gap-2 bg-gray-50 border border-gray-200 text-gray-700 px-3 py-2 rounded-xl text-sm hover:bg-gray-100 transition-colors"
                >
                  <Edit2 className="w-4 h-4" /> Editar
                </button>
                {patient.phone && (
                  <button
                    onClick={() => handleWhatsApp(`Olá ${patient.full_name}! Aqui é da sua nutricionista. Tudo bem? 😊`)}
                    className="flex items-center gap-2 bg-green-500 text-white px-3 py-2 rounded-xl text-sm hover:bg-green-600 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
              {infoItems.map((item, i) => (
                <div key={i} className="bg-gray-50 rounded-xl px-3 py-2">
                  <p className="text-xs text-gray-400">{item.label}</p>
                  <p className="text-sm font-medium text-gray-800 capitalize">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* WhatsApp Quick Actions */}
        {patient.phone && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-2 font-medium">ENVIO RÁPIDO VIA WHATSAPP</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "📋 Enviar Plano Alimentar", msg: `Olá ${patient.full_name}! Segue seu plano alimentar atualizado. Qualquer dúvida, me chame! 🥗` },
                { label: "⏰ Lembrete de Consulta", msg: `Olá ${patient.full_name}! Lembrando que você tem consulta marcada. Confirma sua presença? 😊` },
                { label: "📊 Solicitar Exames", msg: `Olá ${patient.full_name}! Preciso que você faça os seguintes exames antes da próxima consulta. Pode me enviar quando tiver?` },
                { label: "🎉 Parabenizar Resultado", msg: `Olá ${patient.full_name}! Quero te parabenizar pelos seus resultados! Você está arrasando! 💪` },
              ].map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleWhatsApp(action.msg)}
                  className="flex items-center gap-2 text-xs bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded-xl transition-colors font-medium"
                >
                  <Send className="w-3 h-3" /> {action.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex overflow-x-auto border-b border-gray-100">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                activeTab === tab.id
                  ? "text-green-700 border-b-2 border-green-600 bg-green-50/50"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-5">
              {patient.anamnesis && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Anamnese Nutricional</h3>
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-4 whitespace-pre-wrap">{patient.anamnesis}</p>
                </div>
              )}
              {patient.allergies?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Alergias</h3>
                  <div className="flex flex-wrap gap-2">
                    {patient.allergies.map((a, i) => <span key={i} className="bg-red-50 text-red-700 text-xs px-3 py-1 rounded-full">{a}</span>)}
                  </div>
                </div>
              )}
              {patient.diseases?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Doenças/Condições</h3>
                  <div className="flex flex-wrap gap-2">
                    {patient.diseases.map((d, i) => <span key={i} className="bg-amber-50 text-amber-700 text-xs px-3 py-1 rounded-full">{d}</span>)}
                  </div>
                </div>
              )}
              {patient.medications?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Medicamentos</h3>
                  <div className="flex flex-wrap gap-2">
                    {patient.medications.map((m, i) => <span key={i} className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full">{m}</span>)}
                  </div>
                </div>
              )}
              {patient.notes && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Observações</h3>
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-4 whitespace-pre-wrap">{patient.notes}</p>
                </div>
              )}
              {!patient.anamnesis && !patient.allergies?.length && !patient.diseases?.length && (
                <div className="text-center py-10 text-gray-400">
                  <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Nenhuma informação clínica cadastrada ainda.</p>
                  <button onClick={() => setShowEdit(true)} className="mt-3 text-green-600 text-sm underline">Editar prontuário</button>
                </div>
              )}
            </div>
          )}
          {activeTab === "anamnese" && <AnamneseTab patientId={patientId} />}
          {activeTab === "anthropometry" && <AnthropometryTab patientId={patientId} patientName={patient.full_name} />}
          {activeTab === "antro_full" && <AntropometriaTab patientId={patientId} patient={patient} />}
          {activeTab === "mealplan" && <MealPlanTab patientId={patientId} patientName={patient.full_name} patientPhone={patient.phone} patient={patient} />}
          {activeTab === "recordatorio" && <RecordatorioTab patientId={patientId} />}
          {activeTab === "metas" && <MetasTab patientId={patientId} patient={patient} />}
          {activeTab === "exams" && <LabExamsTab patientId={patientId} patientName={patient.full_name} />}
          {activeTab === "consultations" && <ConsultationsTab patientId={patientId} patientName={patient.full_name} />}
        </div>
      </div>

      {showEdit && (
        <PatientForm
          patient={patient}
          onClose={() => setShowEdit(false)}
          onSave={(updated) => { setPatient(updated); setShowEdit(false); setFoto(getFotoPaciente(updated.id)); }}
        />
      )}
    </div>
  );
}