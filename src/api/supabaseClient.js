// src/api/supabaseClient.js
// Cliente Supabase singleton.
// Configure as variáveis no .env (local) ou no dashboard Vercel:
//   VITE_SUPABASE_URL       = https://xxx.supabase.co
//   VITE_SUPABASE_ANON_KEY  = eyJhbGciOiJIUzI1NiIs...
//
// Se qualquer uma das duas faltar, o app automaticamente cai no
// modo localStorage (veja src/api/db.js).

import { createClient } from '@supabase/supabase-js';

const URL = import.meta.env.VITE_SUPABASE_URL;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseEnabled = Boolean(URL && KEY);

export const supabase = supabaseEnabled
  ? createClient(URL, KEY, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;

if (!supabaseEnabled && typeof window !== 'undefined') {
  console.info('[NutriFlow] Modo offline — Supabase desabilitado. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY para sincronizar na nuvem.');
}
