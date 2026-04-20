import { useState, useEffect, useRef } from "react";
import { getConfig, saveConfig } from "@/lib/storage";
import { supabaseEnabled, supabase } from "@/api/supabaseClient";
import {
  Settings as SettingsIcon, Save, Upload, User, Building,
  Phone, Mail, Globe, Instagram, FileText, Palette, Cloud, HardDrive
} from "lucide-react";
import toast from "react-hot-toast";

// ── Helpers Supabase para configuracoes ──────────────────────────────────
async function loadConfigFromSupabase() {
  if (!supabaseEnabled) return null;
  try {
    const { data, error } = await supabase
      .from("configuracoes")
      .select("*")
      .limit(1)
      .maybeSingle();
    if (error) return null;
    return data?.dados || null;
  } catch { return null; }
}

async function saveConfigToSupabase(cfg) {
  if (!supabaseEnabled) return;
  try {
    // Upsert baseado em id fixo "1" (único registro por consultório)
    const { error } = await supabase
      .from("configuracoes")
      .upsert({ id: "1", dados: cfg, updated_at: new Date().toISOString() });
    if (error) console.warn("Supabase config save:", error.message);
  } catch (e) { console.warn("Supabase config:", e); }
}

// ── Componente principal ──────────────────────────────────────────────────
export default function Settings() {
  const [cfg, setCfg] = useState({
    prof: "", crn: "", email: "", tel: "", endereco: "",
    site: "", instagram: "", assinatura: "",
    cor: "#1D9E75", cor_sec: "#0F6E56",
    logo: "", foto_prof: ""
  });
  const [saving, setSaving] = useState(false);
  const logoRef = useRef();
  const fotoRef = useRef();

  useEffect(() => {
    // 1. Carrega do localStorage imediatamente
    const local = getConfig();
    if (local && Object.keys(local).length > 0) {
      setCfg(prev => ({ ...prev, ...local }));
    }
    // 2. Tenta sobrescrever com Supabase se disponível
    loadConfigFromSupabase().then(remote => {
      if (remote) setCfg(prev => ({ ...prev, ...remote }));
    });
  }, []);

  const set = (k, v) => setCfg(c => ({ ...c, [k]: v }));

  const handleFile = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => set(field, ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      saveConfig(cfg);                    // localStorage sempre
      await saveConfigToSupabase(cfg);    // Supabase se disponível
      toast.success(
        supabaseEnabled
          ? "Configurações salvas na nuvem ☁️"
          : "Configurações salvas localmente 💾"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-gray-900 flex items-center gap-2">
            <SettingsIcon className="w-6 h-6" style={{ color: "#1D9E75" }} /> Configurações
          </h1>
          <p className="text-gray-500 text-sm mt-1">Dados usados nos PDFs e identidade visual</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border"
          style={
            supabaseEnabled
              ? { background: "#E1F5EE", color: "#0F6E56", borderColor: "#a7f3d0" }
              : { background: "#F3F4F6", color: "#6B7280", borderColor: "#E5E7EB" }
          }>
          {supabaseEnabled
            ? <><Cloud className="w-3.5 h-3.5" /> Sincronizando com Supabase</>
            : <><HardDrive className="w-3.5 h-3.5" /> Modo local</>
          }
        </div>
      </div>

      {/* Dados profissionais */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-800 flex items-center gap-2">
          <User className="w-4 h-4" style={{ color: "#1D9E75" }} /> Dados Profissionais
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Nome da profissional</label>
            <input value={cfg.prof} onChange={e => set("prof", e.target.value)}
              placeholder="Dra. Carmen Silva"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ "--tw-ring-color": "#1D9E7540" }} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">CRN</label>
            <input value={cfg.crn} onChange={e => set("crn", e.target.value)}
              placeholder="CRN-0 00000"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" /> E-mail profissional
            </label>
            <input type="email" value={cfg.email} onChange={e => set("email", e.target.value)}
              placeholder="contato@nutri.com.br"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" /> Telefone
            </label>
            <input value={cfg.tel} onChange={e => set("tel", e.target.value)}
              placeholder="(51) 99999-9999"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-600 mb-1 flex items-center gap-1">
              <Building className="w-3.5 h-3.5" /> Endereço / Clínica
            </label>
            <input value={cfg.endereco} onChange={e => set("endereco", e.target.value)}
              placeholder="Rua das Flores, 123 — Porto Alegre/RS"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> Site (opcional)
            </label>
            <input value={cfg.site} onChange={e => set("site", e.target.value)}
              placeholder="www.seusite.com.br"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1 flex items-center gap-1">
              <Instagram className="w-3.5 h-3.5" /> Instagram (opcional)
            </label>
            <input value={cfg.instagram} onChange={e => set("instagram", e.target.value)}
              placeholder="@seuinstagram"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-600 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" /> Assinatura no rodapé do PDF
            </label>
            <input value={cfg.assinatura} onChange={e => set("assinatura", e.target.value)}
              placeholder="Nutricionista · CRN-0 00000"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent" />
          </div>
        </div>
      </div>

      {/* Identidade Visual */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h2 className="font-semibold text-gray-800 flex items-center gap-2">
          <Palette className="w-4 h-4" style={{ color: "#1D9E75" }} /> Identidade Visual
        </h2>

        {/* Cores */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Cor principal</label>
            <div className="flex items-center gap-3">
              <input type="color" value={cfg.cor} onChange={e => set("cor", e.target.value)}
                className="h-10 w-16 rounded-xl border border-gray-200 cursor-pointer p-0.5" />
              <div>
                <p className="text-sm font-mono text-gray-700">{cfg.cor}</p>
                <p className="text-[10px] text-gray-400">Cabeçalhos e títulos do PDF</p>
              </div>
            </div>
            {/* Preview swatch */}
            <div className="mt-2 h-3 rounded-full" style={{ background: cfg.cor }} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">Cor secundária</label>
            <div className="flex items-center gap-3">
              <input type="color" value={cfg.cor_sec} onChange={e => set("cor_sec", e.target.value)}
                className="h-10 w-16 rounded-xl border border-gray-200 cursor-pointer p-0.5" />
              <div>
                <p className="text-sm font-mono text-gray-700">{cfg.cor_sec}</p>
                <p className="text-[10px] text-gray-400">Destaques e subtítulos</p>
              </div>
            </div>
            <div className="mt-2 h-3 rounded-full" style={{ background: cfg.cor_sec }} />
          </div>
        </div>

        {/* Preview de combinação */}
        <div className="rounded-xl overflow-hidden border border-gray-100">
          <div className="p-3 text-white text-sm font-semibold" style={{ background: cfg.cor }}>
            Cabeçalho do PDF — {cfg.prof || "Nome da Nutricionista"}
          </div>
          <div className="p-3 text-sm font-medium" style={{ color: cfg.cor_sec, background: "#F9FAFB" }}>
            Subtítulo de seção — REFEIÇÕES · OBSERVAÇÕES
          </div>
        </div>

        {/* Logo + Foto */}
        <div className="grid sm:grid-cols-2 gap-6">
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
              <div className="space-y-1">
                <button onClick={() => logoRef.current?.click()}
                  className="block text-xs px-3 py-1.5 rounded-xl font-medium transition-colors"
                  style={{ background: "#E1F5EE", color: "#0F6E56" }}>
                  {cfg.logo ? "Trocar logo" : "Adicionar logo"}
                </button>
                {cfg.logo && (
                  <button onClick={() => set("logo", "")} className="block text-xs text-red-400 hover:text-red-600">
                    Remover
                  </button>
                )}
                <input ref={logoRef} type="file" accept="image/*" className="hidden"
                  onChange={e => handleFile(e, "logo")} />
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
              <div className="space-y-1">
                <button onClick={() => fotoRef.current?.click()}
                  className="block text-xs px-3 py-1.5 rounded-xl font-medium transition-colors"
                  style={{ background: "#E1F5EE", color: "#0F6E56" }}>
                  {cfg.foto_prof ? "Trocar foto" : "Adicionar foto"}
                </button>
                {cfg.foto_prof && (
                  <button onClick={() => set("foto_prof", "")} className="block text-xs text-red-400 hover:text-red-600">
                    Remover
                  </button>
                )}
                <input ref={fotoRef} type="file" accept="image/*" className="hidden"
                  onChange={e => handleFile(e, "foto_prof")} />
              </div>
            </div>
          </div>
        </div>

        {/* SQL hint para quem usa Supabase */}
        {supabaseEnabled && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
            <p className="font-semibold mb-1">⚠️ Primeira vez com Supabase?</p>
            <p>Execute no SQL Editor do Supabase para ativar a sincronização de configurações:</p>
            <pre className="mt-1.5 bg-amber-100 rounded-lg p-2 font-mono text-[10px] overflow-auto">
{`create table if not exists public.configuracoes (
  id   text primary key default '1',
  dados jsonb,
  updated_at timestamptz default now()
);`}
            </pre>
          </div>
        )}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-60"
        style={{ background: "#1D9E75" }}
      >
        <Save className="w-4 h-4" />
        {saving ? "Salvando..." : "Salvar Configurações"}
      </button>
    </div>
  );
}
