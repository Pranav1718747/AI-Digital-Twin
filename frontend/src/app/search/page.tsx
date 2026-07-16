"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Bot, ArrowRight, CornerDownLeft, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

type ApiError = {
  response?: {
    data?: {
      detail?: string;
    };
  };
  message?: string;
};

export default function AgentSearch() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "I am SentinelOS. Ask me about organizational topology, access policies, or SOPs, and I will route your query to the Knowledge Graph, Vector Store, or Relational Database." }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMessage = query;
    setQuery("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);
    
    try {
      const response = await api.post('/agent/query', {
        query: userMessage,
        session_id: "default-session"
      });
      
      setMessages(prev => [
        ...prev, 
        { role: "assistant", content: response.data.answer }
      ]);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      setMessages(prev => [
        ...prev, 
        { role: "assistant", content: `Error connecting to AI Agent: ${apiError.response?.data?.detail || apiError.message || "Unknown error"}` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Agent Search</h1>
        <p className="text-gray-400 text-sm">Query your enterprise Digital Twin with natural language.</p>
      </div>

      <div className="flex-1 glass-panel border border-white/10 flex flex-col overflow-hidden">
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 max-w-3xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-indigo-500' : 'bg-gradient-to-tr from-pink-500 to-indigo-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]'
              }`}>
                {msg.role === 'user' ? <ArrowRight size={16} /> : <Bot size={16} />}
              </div>
              <div className={`px-5 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-indigo-500/20 text-indigo-100 border border-indigo-500/30 rounded-tr-sm' 
                  : 'bg-white/5 text-gray-200 border border-white/10 rounded-tl-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 max-w-3xl">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-indigo-500 shadow-[0_0_10px_rgba(236,72,153,0.5)] flex items-center justify-center shrink-0">
                <Bot size={16} />
              </div>
              <div className="px-5 py-3 rounded-2xl text-sm leading-relaxed bg-white/5 text-gray-200 border border-white/10 rounded-tl-sm flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" /> Synthesizing response...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/10 bg-black/20">
          <form onSubmit={handleSearch} className="relative max-w-4xl mx-auto">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl py-4 pl-12 pr-16 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-gray-500"
              placeholder="Ask anything about your organization..."
            />
            <button 
              type="submit"
              disabled={isLoading || !query.trim()}
              className="absolute inset-y-2 right-2 px-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white rounded-lg flex items-center transition-colors"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <CornerDownLeft size={16} />}
            </button>
          </form>
          <div className="text-center mt-3 text-xs text-gray-500">
            Powered by LangGraph, OpenAI, Neo4j, Qdrant, and PostgreSQL
          </div>
        </div>
      </div>
    </div>
  );
}
