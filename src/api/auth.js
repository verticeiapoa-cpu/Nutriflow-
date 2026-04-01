// src/api/auth.js — autenticação simples via localStorage
const KEY = 'nf_auth';

export function login(email, senha) {
  // Aceita qualquer credencial no modo local
  const session = { id: 'local', email, nome: 'Nutricionista', role: 'admin', ts: Date.now() };
  localStorage.setItem(KEY, JSON.stringify(session));
  return session;
}

export function logout() {
  localStorage.removeItem(KEY);
  window.location.reload();
}

export function getSession() {
  try {
    const s = localStorage.getItem(KEY);
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}

export function isAuthenticated() {
  return getSession() !== null;
}
