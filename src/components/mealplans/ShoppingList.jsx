import { useState } from "react";
import { ShoppingCart, X, Download, MessageCircle } from "lucide-react";
import jsPDF from "jspdf";

const CATEGORIES = {
  proteinas: { label: "Proteínas", color: "bg-red-50 text-red-700", keywords: ["frango","carne","peixe","atum","ovo","salmão","tilápia","whey","albumina","queijo","iogurte","ricota","atum","camarão","cod","sardinha"] },
  carboidratos: { label: "Carboidratos", color: "bg-amber-50 text-amber-700", keywords: ["arroz","macarrão","pão","batata","mandioca","aveia","granola","cuscuz","tapioca","inhame","milho","cereal","biscoito","farinha","feijão","lentilha","grão","quinoa"] },
  gorduras: { label: "Gorduras", color: "bg-yellow-50 text-yellow-700", keywords: ["azeite","óleo","manteiga","amendoim","castanha","abacate","linhaça","chia","nozes","pasta"] },
  frutas: { label: "Frutas", color: "bg-green-50 text-green-700", keywords: ["banana","maçã","laranja","manga","uva","morango","melancia","abacaxi","mamão","kiwi","pera","limão","tangerina","coco","framboesa","mirtilo"] },
  vegetais: { label: "Vegetais e Legumes", color: "bg-emerald-50 text-emerald-700", keywords: ["alface","espinafre","brócolis","cenoura","tomate","pepino","abobrinha","chuchu","couve","rúcula","beterraba","cebola","alho","pimentão","couve-flor","repolho","acelga"] },
  laticinios: { label: "Laticínios", color: "bg-blue-50 text-blue-700", keywords: ["leite","iogurte","queijo","requeijão","nata","creme"] },
  outros: { label: "Outros", color: "bg-gray-50 text-gray-700", keywords: [] },
};

function categorize(name) {
  const n = name.toLowerCase();
  for (const [key, cat] of Object.entries(CATEGORIES)) {
    if (key === "outros") continue;
    if (cat.keywords.some(k => n.includes(k))) return key;
  }
  return "outros";
}

function buildList(plan) {
  const agg = {};
  const addItem = (item) => {
    if (!item.name?.trim()) return;
    const key = item.name.toLowerCase().trim();
    if (agg[key]) {
      const qty = parseFloat(item.quantity || 0);
      agg[key].qty += qty;
    } else {
      agg[key] = {
        name: item.name.trim(),
        qty: parseFloat(item.quantity || 0),
        unit: item.unit || "g",
        cat: categorize(item.name),
      };
    }
  };
  (plan.meals || []).forEach(meal => {
    (meal.foods || []).forEach(addItem);
    (meal.subgroups || []).forEach(sg => (sg.foods || []).forEach(addItem));
  });
  return Object.values(agg).sort((a, b) => a.name.localeCompare(b.name));
}

function groupByCategory(items) {
  const groups = {};
  items.forEach(item => {
    if (!groups[item.cat]) groups[item.cat] = [];
    groups[item.cat].push(item);
  });
  return groups;
}

export default function ShoppingList({ plan, patientName }) {
  const [show, setShow] = useState(false);

  if (!plan) return null;

  const items = buildList(plan);
  const groups = groupByCategory(items);

  const handlePDF = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const margin = 18, pageW = 210;
    let y = 20;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(22, 163, 74);
    doc.text("Lista de Compras", margin, y); y += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    if (patientName) { doc.text(`Paciente: ${patientName}`, margin, y); y += 5; }
    doc.text(`Plano: ${plan.title || "—"} · Gerado em ${new Date().toLocaleDateString("pt-BR")}`, margin, y);
    y += 8;

    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageW - margin, y); y += 6;

    Object.entries(groups).forEach(([cat, catItems]) => {
      if (!catItems.length) return;
      if (y > 260) { doc.addPage(); y = 20; }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(30, 30, 30);
      doc.text((CATEGORIES[cat]?.label || cat).toUpperCase(), margin, y); y += 5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      catItems.forEach(item => {
        if (y > 270) { doc.addPage(); y = 20; }
        const qtdStr = item.qty > 0 ? ` — ${item.qty}${item.unit}` : "";
        doc.text(`☐  ${item.name}${qtdStr}`, margin + 2, y); y += 5;
      });
      y += 4;
    });

    doc.save(`lista_compras_${(patientName || "plano").replace(/\s+/g, "_")}.pdf`);
  };

  const handleWhatsApp = () => {
    let txt = `🛒 *Lista de Compras*\n${patientName ? `Paciente: ${patientName}\n` : ""}Plano: ${plan.title || "—"}\n\n`;
    Object.entries(groups).forEach(([cat, catItems]) => {
      if (!catItems.length) return;
      txt += `*${(CATEGORIES[cat]?.label || cat).toUpperCase()}*\n`;
      catItems.forEach(item => {
        const qtdStr = item.qty > 0 ? ` — ${item.qty}${item.unit}` : "";
        txt += `☐ ${item.name}${qtdStr}\n`;
      });
      txt += "\n";
    });
    window.open(`https://wa.me/?text=${encodeURIComponent(txt)}`, "_blank");
  };

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="flex items-center gap-1.5 text-sm bg-orange-50 text-orange-700 px-3 py-2 rounded-xl hover:bg-orange-100 transition-colors"
      >
        <ShoppingCart className="w-3.5 h-3.5" /> Lista de Compras
      </button>

      {show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white z-10">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-orange-600" /> Lista de Compras
              </h2>
              <button onClick={() => setShow(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {items.length === 0 ? (
                <p className="text-center text-gray-400 py-8 text-sm">Nenhum alimento cadastrado no plano.</p>
              ) : (
                Object.entries(groups).map(([cat, catItems]) => {
                  if (!catItems.length) return null;
                  const catInfo = CATEGORIES[cat];
                  return (
                    <div key={cat}>
                      <h3 className={`text-xs font-bold uppercase tracking-wide px-2 py-1 rounded-lg inline-block mb-2 ${catInfo?.color || "bg-gray-50 text-gray-600"}`}>
                        {catInfo?.label || cat}
                      </h3>
                      <ul className="space-y-1">
                        {catItems.map((item, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm text-gray-700 py-1 border-b border-gray-50">
                            <span className="w-4 h-4 rounded border border-gray-300 flex-shrink-0" />
                            <span className="flex-1">{item.name}</span>
                            {item.qty > 0 && (
                              <span className="text-gray-400 text-xs">{item.qty}{item.unit}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })
              )}
            </div>

            {items.length > 0 && (
              <div className="p-5 border-t flex gap-3">
                <button onClick={handleWhatsApp}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-50 text-green-700 py-2.5 rounded-xl text-sm font-medium hover:bg-green-100">
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </button>
                <button onClick={handlePDF}
                  className="flex-1 flex items-center justify-center gap-2 bg-orange-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-orange-700">
                  <Download className="w-4 h-4" /> Baixar PDF
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
