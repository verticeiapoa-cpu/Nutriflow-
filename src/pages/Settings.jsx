import { useState, useEffect, useRef } from "react";
import { getConfig, saveConfig } from "@/lib/storage";
import { Settings as SettingsIcon, Save, Upload, User, Building, Phone, Mail, Globe, Instagram, FileText } from "lucide-react";
import toast from "react-hot-toast";

export default function Settings() {
  const [cfg, setCfg] = useState({
    prof: "", crn: "", email: "", tel: "", endereco: "", site: "", instagram: "",
    assinatura: "", cor: "#8B1A4A", logo: "", foto_prof: ""
  });
  const logoRef = useRef();
  const fotoRef = useRef();

  useEffect(() => {
    const saved = getConfig();
    if (saved) setCfg(prev => ({ ...prev, ...saved }));
  }, []);

  const set = (k, v) => setCfg(c => ({ ...c, [k]: v }));

  const handleFile = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => set(field, ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    saveConfig(cfg);
    toast.success("Configurações salvas!");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-green-600" /> Configurações
        </h1>
        <p className="text-gray-500 text-sm mt-1">Dados do consultório usados no PDF profissional</p>
      </div>

      {/* Dados da profissional */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-800 flex items-center gap-2"><User className="w-4 h-4 text-green-600" /> Dados Profissionais</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Nome da profissional</label>
            <input value={cfg.prof} onChange={e => set("prof", e.target.value)} placeholder="Dra. Carmen Silva"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">CRN</label>
            <input value={cfg.crn} onChange={e => set("crn", e.target.value)} placeholder="CRN-0 00000"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1 flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> Email profissional</label>
            <input type="email" value={cfg.email} onChange={e => set("email", e.target.value)} placeholder="contato@nutri.com.br"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1 flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Telefone</label>
            <input value={cfg.tel} onChange={e => set("tel", e.target.value)} placeholder="(51) 99999-9999"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-600 mb-1 flex items-center gap-1"><Building className="w-3.5 h-3.5" /> Endereço / Clínica</label>
            <input value={cfg.endereco} onChange={e => set("endereco", e.target.value)} placeholder="Rua das Flores, 123 — Porto Alegre/RS"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1 flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> Site (opcional)</label>
            <input value={cfg.site} onChange={e => set("site", e.target.value)} placeholder="www.seusite.com.br"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1 flex items-center gap-1"><Instagram className="w-3.5 h-3.5" /> Instagram (opcional)</label>
            <input value={cfg.instagram} onChange={e => set("instagram", e.target.value)} placeholder="@seuinstagram"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-600 mb-1 flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> Assinatura no rodapé do PDF</label>
            <input value={cfg.assinatura} onChange={e => set("assinatura", e.target.value)} placeholder="Nutricionista · CRN-0 00000"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
        </div>
      </div>

      {/* Visual */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-800">Visual do PDF</h2>
        <div className="flex flex-wrap gap-6 items-start">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Cor principal</label>
            <div className="flex items-center gap-3">
              <input type="color" value={cfg.cor} onChange={e => set("cor", e.target.value)}
                className="h-10 w-16 rounded-xl border border-gray-200 cursor-pointer p-0.5" />
              <span className="text-sm text-gray-500 font-mono">{cfg.cor}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">Logo do consultório</label>
            <div className="flex items-center gap-3">
              {cfg.logo ? (
                <img src={cfg.logo} alt="Logo" className="h-14 w-14 object-contain rounded-xl border border-gray-200 bg-gray-50" />
              ) : (
                <div className="h-14 w-14 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300">
                  <Upload className="w-5 h-5" />
                </div>
              )}
              <div>
                <button onClick={() => logoRef.current?.click()}
                  className="text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-xl hover:bg-green-100 transition-colors">
                  {cfg.logo ? "Trocar logo" : "Adicionar logo"}
                </button>
                {cfg.logo && <button onClick={() => set("logo", "")} className="block mt-1 text-xs text-red-400 hover:text-red-600">Remover</button>}
                <input ref={logoRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleFile(e, "logo")} />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">Foto da profissional</label>
            <div className="flex items-center gap-3">
              {cfg.foto_prof ? (
                <img src={cfg.foto_prof} alt="Foto" className="h-14 w-14 object-cover rounded-full border border-gray-200" />
              ) : (
                <div className="h-14 w-14 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300">
                  <User className="w-5 h-5" />
                </div>
              )}
              <div>
                <button onClick={() => fotoRef.current?.click()}
                  className="text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-xl hover:bg-green-100 transition-colors">
                  {cfg.foto_prof ? "Trocar foto" : "Adicionar foto"}
                </button>
                {cfg.foto_prof && <button onClick={() => set("foto_prof", "")} className="block mt-1 text-xs text-red-400 hover:text-red-600">Remover</button>}
                <input ref={fotoRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleFile(e, "foto_prof")} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <button onClick={handleSave}
        className="flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors">
        <Save className="w-4 h-4" /> Salvar Configurações
      </button>
    </div>
  );
}
