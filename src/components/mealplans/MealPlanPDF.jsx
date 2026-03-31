import { useState } from "react";
import { FileDown, Loader2, FileText, X, Download } from "lucide-react";
import jsPDF from "jspdf";
import { getConfig, getFotoPaciente, hexToRGB } from "@/lib/storage";

function calcIMCLabel(peso, alt) {
  if (!peso || !alt) return "";
  const imc = peso / Math.pow(alt / 100, 2);
  if (imc < 18.5) return `${imc.toFixed(1)} — Baixo peso`;
  if (imc < 25) return `${imc.toFixed(1)} — Eutrófico`;
  if (imc < 30) return `${imc.toFixed(1)} — Sobrepeso`;
  if (imc < 35) return `${imc.toFixed(1)} — Obesidade I`;
  if (imc < 40) return `${imc.toFixed(1)} — Obesidade II`;
  return `${imc.toFixed(1)} — Obesidade III`;
}

function calcAge(birth) {
  if (!birth) return null;
  return Math.floor((new Date() - new Date(birth)) / (365.25 * 24 * 60 * 60 * 1000));
}

async function gerarPDFProfissional(plan, patient) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const cfg = getConfig();
  const margin = 18;
  const pageW = 210;
  const corPrincipal = cfg.cor || "#2E7D32";
  const [r, g, b] = hexToRGB(corPrincipal);
  const foto = getFotoPaciente(patient?.id || "");
  let y = 15;

  const checkPage = (space = 15) => {
    if (y + space > 275) { doc.addPage(); y = 15; }
  };

  // ── HEADER ──────────────────────────────────────────────────────────────
  if (cfg.logo) {
    try { doc.addImage(cfg.logo, "JPEG", margin, y, 30, 18); } catch (e) {}
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(r, g, b);
  doc.text(cfg.prof || "Nutricionista", pageW / 2, y + 5, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 100, 100);
  if (cfg.email) doc.text(cfg.email, pageW / 2, y + 11, { align: "center" });
  if (cfg.tel) doc.text(cfg.tel, pageW - margin, y + 5, { align: "right" });
  if (cfg.endereco) doc.text(cfg.endereco, pageW - margin, y + 11, { align: "right" });
  if (cfg.site) doc.text(cfg.site, pageW - margin, y + 17, { align: "right" });
  y += 26;

  // Linha divisória
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageW - margin, y);
  y += 8;

  // ── INFORMAÇÕES DO PACIENTE ───────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(r, g, b);
  doc.text("INFORMAÇÕES DO PACIENTE", margin, y);
  y += 6;

  // Avatar
  const avR = 9;
  const avX = margin, avY = y;
  doc.setFillColor(230, 230, 230);
  doc.circle(avX + avR, avY + avR, avR, "F");
  if (foto) {
    try { doc.addImage(foto, "JPEG", avX, avY, avR * 2, avR * 2, undefined, undefined, undefined, "F"); } catch (e) {}
  } else {
    const initials = (patient?.full_name || "?").split(" ").slice(0, 2).map(w => w[0]).join("");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(initials, avX + avR, avY + avR + 1.5, { align: "center" });
  }

  const dataX = avX + avR * 2 + 5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(30, 30, 30);
  doc.text(patient?.full_name || "—", dataX, y + 5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(120, 120, 120);
  if (patient?.email) doc.text(patient.email, dataX, y + 10);

  // Grid dados
  const idade = calcAge(patient?.birth_date);
  const imcLabel = calcIMCLabel(patient?.weight, patient?.height);
  const grid = [
    { l: "IDADE", v: idade ? `${idade} anos` : "—" },
    { l: "IMC", v: imcLabel || "—" },
    { l: "ALTURA", v: patient?.height ? `${patient.height} cm` : "—" },
    { l: "PESO", v: patient?.weight ? `${patient.weight} kg` : "—" },
  ];
  let gx = dataX + 55;
  grid.forEach(d => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(r, g, b);
    doc.text(d.l, gx, y + 5);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(50, 50, 50);
    doc.text(d.v, gx, y + 10);
    gx += 32;
  });
  y += avR * 2 + 6;

  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y, pageW - margin, y);
  y += 8;

  // ── REFEIÇÕES ─────────────────────────────────────────────────────────────
  if (plan) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(r, g, b);
    doc.text("REFEIÇÕES", margin, y);
    y += 7;

    for (const ref of (plan.meals || [])) {
      checkPage(30);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(40, 40, 40);
      const mealLabel = ref.time
        ? `${ref.time}   ${(ref.name || "").toUpperCase()}`
        : (ref.name || "").toUpperCase();
      doc.text(mealLabel, margin, y);
      y += 5.5;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(60, 60, 60);

      for (const item of (ref.foods || [])) {
        checkPage(7);
        let linha = `• ${item.name}`;
        if (item.quantity) linha += ` (${item.quantity}${item.unit || "g"})`;
        (item.alternatives || []).forEach(alt => {
          if (alt.name) linha += ` ou ${alt.name} (${alt.quantity || "?"}${alt.unit || "g"})`;
        });
        const linhas = doc.splitTextToSize(linha, pageW - margin * 2 - 4);
        doc.text(linhas, margin + 2, y);
        y += linhas.length * 4.5;
      }

      for (const sg of (ref.subgroups || [])) {
        checkPage(10);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(100, 100, 100);
        doc.text((sg.title || "OUTROS").toUpperCase(), margin + 4, y);
        y += 4.5;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(60, 60, 60);
        for (const item of (sg.foods || [])) {
          checkPage(7);
          let linha = `• ${item.name}`;
          if (item.quantity) linha += ` (${item.quantity}${item.unit || "g"})`;
          (item.alternatives || []).forEach(alt => {
            if (alt.name) linha += ` ou ${alt.name} (${alt.quantity || "?"}${alt.unit || "g"})`;
          });
          const linhas = doc.splitTextToSize(linha, pageW - margin * 2 - 8);
          doc.text(linhas, margin + 4, y);
          y += linhas.length * 4.5;
        }
      }

      if (ref.notas && ref.notas.trim()) {
        checkPage(8);
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8);
        doc.setTextColor(130, 130, 130);
        const notasLinhas = doc.splitTextToSize(ref.notas, pageW - margin * 2 - 4);
        doc.text(notasLinhas, margin + 2, y);
        y += notasLinhas.length * 4 + 2;
      }
      y += 4;
    }

    if (plan.supplements) {
      checkPage(20);
      doc.setDrawColor(220, 220, 220);
      doc.line(margin, y, pageW - margin, y);
      y += 6;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(r, g, b);
      doc.text("SUPLEMENTAÇÃO", margin, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(60, 60, 60);
      const supLinhas = doc.splitTextToSize(plan.supplements, pageW - margin * 2);
      doc.text(supLinhas, margin, y);
      y += supLinhas.length * 4.5 + 4;
    }

    if (plan.observations) {
      checkPage(20);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(r, g, b);
      doc.text("OBSERVAÇÕES", margin, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(60, 60, 60);
      const obsLinhas = doc.splitTextToSize(plan.observations, pageW - margin * 2);
      doc.text(obsLinhas, margin, y);
    }
  }

  // ── RODAPÉ ────────────────────────────────────────────────────────────────
  const total = doc.internal.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.2);
    doc.line(margin, 285, pageW - margin, 285);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(180, 180, 180);
    const rod = [cfg.prof, cfg.crn, cfg.email].filter(Boolean).join(" · ");
    doc.text(rod || "NutriPro", margin, 290);
    doc.text(`${i}/${total}`, pageW - margin, 290, { align: "right" });
  }

  const nome = (patient?.full_name || "plano").replace(/\s+/g, "_");
  const dataHoje = new Date().toISOString().split("T")[0];
  doc.save(`plano_${nome}_${dataHoje}.pdf`);
}

// ── Botão simples (mantém compatibilidade com chamadas existentes) ────────────
export default function MealPlanPDF({ plan, patientName, patient, onClose }) {
  const [generating, setGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Se recebeu patient object, usa PDF profissional; senão usa o básico legado
  const handleProfessional = async () => {
    setGenerating(true);
    setShowModal(false);
    try {
      await gerarPDFProfissional(plan, patient);
    } finally {
      setGenerating(false);
      onClose?.();
    }
  };

  const handleBasic = () => {
    setGenerating(true);
    try {
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = doc.internal.pageSize.getWidth();
      const margin = 20;
      const contentW = pageW - margin * 2;
      let y = 20;

      const checkPage = (needed = 20) => { if (y + needed > 270) { doc.addPage(); y = 20; } };

      doc.setFillColor(22, 163, 74);
      doc.rect(0, 0, pageW, 40, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("NutriPro", margin, 18);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text("Plano Alimentar Personalizado", margin, 28);
      doc.setFontSize(9);
      doc.text(`Gerado em ${new Date().toLocaleDateString("pt-BR")}`, pageW - margin, 28, { align: "right" });
      y = 52;

      doc.setTextColor(30, 30, 30);
      doc.setFontSize(15);
      doc.setFont("helvetica", "bold");
      doc.text(plan.title || "Plano Alimentar", margin, y); y += 7;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(`Paciente: ${patientName || plan.patient_name || "-"}`, margin, y); y += 5;
      if (plan.start_date) { doc.text(`Período: ${plan.start_date}${plan.end_date ? ` até ${plan.end_date}` : ""}`, margin, y); y += 5; }
      if (plan.objective) { doc.text(`Objetivo: ${plan.objective}`, margin, y); y += 5; }
      y += 4;
      doc.setDrawColor(220, 220, 220);
      doc.line(margin, y, pageW - margin, y); y += 6;

      doc.setFillColor(240, 253, 244);
      doc.roundedRect(margin, y, contentW, 22, 3, 3, "F");
      const macros = [
        { label: "Calorias", val: `${plan.total_calories || 0} kcal`, color: [22, 163, 74] },
        { label: "Proteínas", val: `${plan.total_protein || 0}g`, color: [37, 99, 235] },
        { label: "Carboidratos", val: `${plan.total_carbs || 0}g`, color: [217, 119, 6] },
        { label: "Gorduras", val: `${plan.total_fat || 0}g`, color: [220, 38, 38] },
      ];
      const colW = contentW / 4;
      macros.forEach((m, i) => {
        const cx = margin + colW * i + colW / 2;
        doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(100, 100, 100);
        doc.text(m.label, cx, y + 8, { align: "center" });
        doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.setTextColor(...m.color);
        doc.text(m.val, cx, y + 17, { align: "center" });
      });
      y += 28;

      if (plan.meals?.length > 0) {
        doc.setTextColor(30, 30, 30); doc.setFontSize(12); doc.setFont("helvetica", "bold");
        doc.text("Refeições", margin, y); y += 8;
        plan.meals.forEach((meal) => {
          checkPage(30);
          doc.setFillColor(22, 163, 74);
          doc.roundedRect(margin, y - 4, contentW, 9, 2, 2, "F");
          doc.setTextColor(255, 255, 255); doc.setFontSize(9); doc.setFont("helvetica", "bold");
          doc.text(`${meal.name}${meal.time ? `  ·  ${meal.time}` : ""}`, margin + 3, y + 2); y += 11;
          if (meal.foods?.length > 0) {
            meal.foods.forEach((food) => {
              checkPage(8);
              doc.setTextColor(60, 60, 60); doc.setFontSize(9); doc.setFont("helvetica", "normal");
              let foodLine = `• ${food.name}${food.quantity ? ` — ${food.quantity}${food.unit || "g"}` : ""}`;
              (food.alternatives || []).forEach(a => { if (a.name) foodLine += ` ou ${a.name}`; });
              const calInfo = food.calories ? `  (${food.calories} kcal)` : "";
              doc.text(foodLine + calInfo, margin + 4, y); y += 6;
            });
          }
          y += 3;
        });
      }

      if (plan.supplements) {
        checkPage(20); y += 2;
        doc.setDrawColor(220, 220, 220); doc.line(margin, y, pageW - margin, y); y += 6;
        doc.setTextColor(30, 30, 30); doc.setFontSize(11); doc.setFont("helvetica", "bold");
        doc.text("Suplementação", margin, y); y += 6;
        doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(80, 80, 80);
        const lines = doc.splitTextToSize(plan.supplements, contentW);
        lines.forEach(l => { checkPage(6); doc.text(l, margin, y); y += 5; });
      }
      if (plan.observations) {
        checkPage(20); y += 2;
        doc.setDrawColor(220, 220, 220); doc.line(margin, y, pageW - margin, y); y += 6;
        doc.setTextColor(30, 30, 30); doc.setFontSize(11); doc.setFont("helvetica", "bold");
        doc.text("Observações", margin, y); y += 6;
        doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(80, 80, 80);
        const lines = doc.splitTextToSize(plan.observations, contentW);
        lines.forEach(l => { checkPage(6); doc.text(l, margin, y); y += 5; });
      }

      const pages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pages; i++) {
        doc.setPage(i);
        doc.setFontSize(8); doc.setTextColor(150, 150, 150);
        doc.text("NutriPro — Sistema de Gestão Nutricional", margin, 290);
        doc.text(`Página ${i} de ${pages}`, pageW - margin, 290, { align: "right" });
      }
      doc.save(`${plan.title || "plano"}_${patientName || "paciente"}.pdf`.replace(/\s+/g, "_"));
    } finally {
      setGenerating(false);
      onClose?.();
    }
  };

  if (patient) {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          disabled={generating}
          className="flex items-center gap-2 text-sm bg-purple-50 text-purple-700 px-3 py-2 rounded-xl font-medium hover:bg-purple-100 transition-colors disabled:opacity-50"
        >
          {generating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
          {generating ? "Gerando..." : "PDF Profissional"}
        </button>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Gerar PDF</h3>
                <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              <p className="text-sm text-gray-600">
                Plano: <strong>{plan?.title}</strong><br />
                Paciente: <strong>{patient?.full_name}</strong>
              </p>
              <div className="flex gap-3 pt-1">
                <button onClick={handleBasic}
                  className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-50">
                  PDF Simples
                </button>
                <button onClick={handleProfessional}
                  className="flex-1 bg-purple-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-purple-700 flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" /> PDF Completo
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <button
      onClick={handleBasic}
      disabled={generating}
      className="flex items-center gap-2 text-sm bg-blue-50 text-blue-700 px-3 py-2 rounded-xl font-medium hover:bg-blue-100 transition-colors disabled:opacity-50"
    >
      {generating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileDown className="w-3.5 h-3.5" />}
      {generating ? "Gerando..." : "Exportar PDF"}
    </button>
  );
}

export { gerarPDFProfissional };
