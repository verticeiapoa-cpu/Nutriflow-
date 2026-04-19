// src/api/auth.js — autenticação simples via localStorage
const KEY = 'nf_auth';

export function loginAdmin(email, senha) {
  // Portal do nutricionista: aceita qualquer credencial
  const session = { id: 'admin-local', email, nome: 'Nutricionista', role: 'admin', ts: Date.now() };
  localStorage.setItem(KEY, JSON.stringify(session));
  return session;
}

export function loginPaciente(email) {
  // Portal do paciente: valida pelo email cadastrado + acesso ativo
  const pacientes = JSON.parse(localStorage.getItem('nf_pacientes') || '[]');
  const pac = pacientes.find(p => p.email?.toLowerCase() === email.toLowerCase());
  if (!pac) throw new Error('E-mail não encontrado. Verifique com sua nutricionista.');
  if (pac.portalAccess === false) throw new Error('Acesso ao portal não liberado. Entre em contato com sua nutricionista.');
  const session = { id: pac.id, email: pac.email, nome: pac.nome, role: 'paciente', ts: Date.now() };
  localStorage.setItem(KEY, JSON.stringify(session));
  return session;
}

// Mantém compatibilidade com código legado
export function login(email, senha) {
  return loginAdmin(email, senha);
}

export function logout() {
  localStorage.removeItem(KEY);
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
