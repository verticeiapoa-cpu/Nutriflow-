import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf, Stethoscope, User, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

export default function Login() {
  const { loginAdmin, loginPaciente } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState("admin"); // "admin" | "paciente"
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setLoading(true);
    try {
      if (tab === "admin") {
        if (!email || !senha) { setErro("Preencha e-mail e senha."); setLoading(false); return; }
        loginAdmin(email, senha);
        navigate("/Dashboard");
      } else {
        if (!email) { setErro("Informe seu e-mail cadastrado."); setLoading(false); return; }
        loginPaciente(email);
        navigate("/PacientePortal");
      }
    } catch (err) {
      setErro(err.message || "Erro ao fazer login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl mb-4 shadow-lg">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">NutriFlow</h1>
          <p className="text-gray-500 mt-1">Gestão Nutricional</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Tabs */}
          <div className="grid grid-cols-2">
            <button
              onClick={() => { setTab("admin"); setErro(""); }}
              className={`flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors ${
                tab === "admin"
                  ? "bg-green-600 text-white"
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100"
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              Nutricionista
            </button>
            <button
              onClick={() => { setTab("paciente"); setErro(""); }}
              className={`flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors ${
                tab === "paciente"
                  ? "bg-green-600 text-white"
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100"
              }`}
            >
              <User className="w-4 h-4" />
              Paciente
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {tab === "admin" ? (
              <p className="text-sm text-gray-500 bg-green-50 rounded-lg px-4 py-3 border border-green-100">
                Acesso exclusivo para nutricionistas. Use qualquer e-mail e senha.
              </p>
            ) : (
              <p className="text-sm text-gray-500 bg-blue-50 rounded-lg px-4 py-3 border border-blue-100">
                Use o e-mail cadastrado pela sua nutricionista.
              </p>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {tab === "admin" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                <div className="relative">
                  <input
                    type={showSenha ? "text" : "password"}
                    value={senha}
                    onChange={e => setSenha(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSenha(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {erro && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3 border border-red-100">
                {erro}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors shadow-sm"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          NutriFlow · Gestão Nutricional Inteligente
        </p>
      </div>
    </div>
  );
}
