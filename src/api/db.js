// src/api/db.js
// Wrapper único que decide entre Supabase (nuvem) e localStorage (offline).
//
// Prioridade:
//   1. Se VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY estiverem definidos,
//      usa Supabase (dados persistentes na nuvem, multi-device).
//   2. Caso contrário, cai no localDB (funciona 100% offline).
//
// Todos os componentes devem importar daqui:
//     import { db } from "@/api/db";
//
// Os arquivos existentes que usam "@/api/localDB" continuam funcionando —
// este wrapper apenas oferece um ponto único quando você quiser migrar.

import { supabaseEnabled } from './supabaseClient';
import { db as localDb } from './localDB';
import { db as supaDb }  from './supabaseDB';

export const db = supabaseEnabled ? supaDb : localDb;
export const backend = supabaseEnabled ? 'supabase' : 'local';

// Helper para exibir no Settings / rodapé
export function getBackendLabel() {
  return supabaseEnabled
    ? '☁️ Sincronizando com Supabase'
    : '💾 Modo offline (localStorage)';
}

export default db;
