import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Send, Plus, Zap, Trash2, MessageCircle } from "lucide-react";
import MessageBubble from "../components/ai/MessageBubble";

export default function NutriAI() {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!activeConversation) return;
    const unsub = base44.agents.subscribeToConversation(activeConversation.id, (data) => {
      setMessages(data.messages || []);
    });
    return unsub;
  }, [activeConversation?.id]);

  const loadConversations = async () => {
    const list = await base44.agents.listConversations({ agent_name: "nutri_assistant" });
    setConversations(list || []);
  };

  const handleNewConversation = async () => {
    const conv = await base44.agents.createConversation({
      agent_name: "nutri_assistant",
      metadata: { name: `Conversa ${new Date().toLocaleDateString("pt-BR")}` }
    });
    setActiveConversation(conv);
    setMessages(conv.messages || []);
    setConversations(prev => [conv, ...prev]);
  };

  const handleSelectConversation = async (conv) => {
    const full = await base44.agents.getConversation(conv.id);
    setActiveConversation(full);
    setMessages(full.messages || []);
  };

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    const msg = input;
    setInput("");
    setSending(true);

    let conv = activeConversation;
    if (!conv) {
      conv = await base44.agents.createConversation({
        agent_name: "nutri_assistant",
        metadata: { name: `Conversa ${new Date().toLocaleDateString("pt-BR")}` }
      });
      setActiveConversation(conv);
      setMessages(conv.messages || []);
      setConversations(prev => [conv, ...prev]);
    }

    await base44.agents.addMessage(conv, { role: "user", content: msg });
    setSending(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const SUGGESTIONS = [
    "Analise os exames da Ana Paula e sugira intervenções",
    "Crie um plano alimentar para emagrecimento de 1600kcal",
    "Quais alimentos aumentam a Vitamina D naturalmente?",
    "Como calcular a necessidade proteica para hipertrofia?",
  ];

  return (
    <div className="flex h-[calc(100vh-120px)] gap-4">
      {/* Sidebar */}
      <div className="hidden lg:flex flex-col w-64 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <button
            onClick={handleNewConversation}
            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Nova Conversa
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {conversations.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-4">Nenhuma conversa ainda</p>
          ) : (
            conversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => handleSelectConversation(conv)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors mb-1 ${
                  activeConversation?.id === conv.id
                    ? "bg-green-50 text-green-800 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <p className="truncate">{conv.metadata?.name || "Conversa"}</p>
                <p className="text-xs text-gray-400 mt-0.5 truncate">
                  {conv.messages?.length || 0} mensagens
                </p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Assistente Nutricional IA</h2>
            <p className="text-xs text-gray-400">Acesso completo aos dados dos pacientes</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {!activeConversation && messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 text-lg mb-1">Olá! Sou seu assistente de nutrição</h3>
              <p className="text-gray-500 text-sm mb-6 max-w-sm">Tenho acesso aos dados de seus pacientes e posso ajudar com análises, planos alimentares e orientações clínicas.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => { setInput(s); }}
                    className="text-left text-sm bg-gray-50 hover:bg-green-50 hover:text-green-700 border border-gray-100 hover:border-green-200 text-gray-600 px-4 py-3 rounded-xl transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <MessageBubble key={i} message={msg} />
              ))}
              {sending && (
                <div className="flex gap-3 justify-start">
                  <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex gap-3 items-end">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Pergunte algo sobre seus pacientes, exames, planos alimentares..."
              rows={1}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
              style={{ maxHeight: "120px", overflowY: "auto" }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className="flex-shrink-0 w-10 h-10 bg-purple-600 text-white rounded-xl flex items-center justify-center hover:bg-purple-700 transition-colors disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">Enter para enviar · Shift+Enter para nova linha</p>
        </div>
      </div>
    </div>
  );
}