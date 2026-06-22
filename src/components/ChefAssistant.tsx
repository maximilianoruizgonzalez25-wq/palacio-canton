/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, RefreshCw, ShoppingCart, Plus, HelpCircle } from 'lucide-react';
import { ChatMessage, MenuItem } from '../types';
import { MENU_ITEMS } from '../data/menu';

interface ChefAssistantProps {
  onDirectAddProduct: (item: MenuItem) => void;
}

const PREDEFINED_QUESTIONS = [
  '¿Qué me recomiendas para un almuerzo de 3 personas?',
  '¿Tienen algún plato picante de carne?',
  '¿Cuál es el plato de arroz más completo?',
  'Háblame de las Lumpias Especiales'
];

export default function ChefAssistant({ onDirectAddProduct }: ChefAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: '¡Un saludo imperial y bienvenido a mi Salón de Té virtual, estimado comensal! 🏮 Soy el Chef Chen. Estoy aquí en la gran cocina del Palacio Cantón listo para guiarte en tu banquete tradicional chino-cantonés. ¿Cuántos comensales se sentarán a la mesa hoy o qué delicias buscan deleitar? (dulce, picante, crujiente, arroz frito especial...)',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to lowest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: 'usr-' + Math.random().toString(36).slice(2, 7),
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsSending(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, text: m.text }))
        })
      });

      if (!response.ok) {
        throw new Error('Lo siento, se ha enfriado el fuego sagrado de mi wok mental. Por favor, reintenta.');
      }

      const data = await response.json();
      
      // Parse recommended items from reply (split on "RECOMENDACION_IDS:")
      let responseText = data.text;
      let suggested: string[] = [];

      if (responseText.includes('RECOMENDACION_IDS:')) {
        const parts = responseText.split('RECOMENDACION_IDS:');
        responseText = parts[0].trim();
        suggested = parts[1]
          .split(',')
          .map((id: string) => id.trim())
          .filter((id: string) => id.length > 0);
      }

      const modelMsg: ChatMessage = {
        id: 'mdl-' + Math.random().toString(36).slice(2, 7),
        role: 'model',
        text: responseText,
        suggestedItems: suggested.length > 0 ? suggested : undefined,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, modelMsg]);

    } catch (err: any) {
      console.error(err);
      const errMsg: ChatMessage = {
        id: 'err-' + Math.random().toString(36).slice(2, 7),
        role: 'model',
        text: 'Mis disculpas imperiales. Hubo un error de conexión con la cocina de Palacio Cantón. ¿Podrías volver a preguntarme en unos segundos?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  // Helper to map suggestion IDs to full product MenuItem objects
  const getSuggestedMenuItems = (ids?: string[]) => {
    if (!ids) return [];
    return MENU_ITEMS.filter((item) => ids.includes(item.id));
  };

  return (
    <section className="py-8 px-4 max-w-4xl mx-auto font-sans flex flex-col h-[calc(100vh-140px)] min-h-[500px]" id="chef-assistant-page">
      {/* Assistant head - Styled as an antique lacquer bar header */}
      <div className="bg-[#1E1212] border-2 border-[#C5A033] p-5 shadow-lg flex items-center justify-between relative rounded-none">
        {/* Ornaments */}
        <div className="corner-ornament-tl" />
        <div className="corner-ornament-tr" />

        <div className="flex items-center space-x-3.5 relative z-10">
          <div className="w-12 h-12 bg-[#800C0D] border border-[#C5A033] rounded-none flex items-center justify-center shadow-md select-none">
            <span className="text-2xl font-calligraphy text-yellow-300 animate-pulse">陳</span>
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-serif font-black text-yellow-405 tracking-widest flex items-center gap-1.5 uppercase">
              <span>Chef Virtual Chen</span>
              <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
            </h2>
            <p className="text-[10px] text-green-400 font-semibold flex items-center tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 inline-block animate-ping" />
              CONECTADO AL BRASERO DEL PALACIO
            </p>
          </div>
        </div>
        <span className="hidden sm:block text-[9px] text-[#C5A033] font-serif font-black uppercase tracking-widest bg-[#110A0A] px-3 py-1.5 border border-[#C5A033]/40">
          Consejero Imperial AI
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto bg-[#110A0A] border-x-2 border-[#C5A033]/60 p-4 sm:p-5 space-y-6 scrollbar-thin">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          const suggestedProducts = getSuggestedMenuItems(m.suggestedItems);

          return (
            <div 
              key={m.id} 
              className={`flex items-start gap-3.5 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              id={`chat-msg-${m.id}`}
            >
              {/* Profile Bubble Avatar */}
              <div className={`w-8 h-8 rounded-none flex items-center justify-center font-bold text-xs shadow-md flex-shrink-0 border ${
                isUser ? 'bg-zinc-800 text-yellow-400 border-zinc-700' : 'bg-[#800C0D] text-yellow-305 border-[#C5A033]'
              }`}>
                {isUser ? <User className="w-4 h-4 text-yellow-405" /> : <span className="font-calligraphy text-sm leading-none">饌</span>}
              </div>

              <div className="space-y-3 w-full">
                {/* Text Bubble */}
                <div className={`p-4 rounded-none shadow-md ${
                  isUser 
                    ? 'bg-[#800C0D] text-yellow-100 border border-[#C5A033] leading-relaxed text-xs sm:text-sm' 
                    : 'silk-parchment text-stone-900 border border-amber-900/10 leading-relaxed text-xs sm:text-sm'
                }`}>
                  <p className="whitespace-pre-wrap font-sans font-medium">{m.text}</p>
                  <span className={`text-[8px] block text-right mt-2 font-mono ${isUser ? 'text-yellow-101/60' : 'text-stone-500'}`}>
                    {m.timestamp}
                  </span>
                </div>

                {/* Sub-item: Render product shortcut card if chef recommended items */}
                {!isUser && suggestedProducts.length > 0 && (
                  <div className="bg-[#1E1212]/80 p-4 border border-[#C5A033]/20 space-y-2.5 animate-fade-in w-full max-w-md rounded-none">
                    <p className="text-[10px] uppercase font-serif font-black text-[#C5A033] tracking-widest flex items-center gap-1.5 mb-1">
                      <ShoppingCart className="w-3.5 h-3.5 text-[#C5A033]" />
                      <span>Manjares Sugeridos por el Chef:</span>
                    </p>
                    
                    {/* Suggested products mini row layout */}
                    <div className="space-y-2">
                       {suggestedProducts.map((p) => (
                        <div 
                          key={p.id} 
                          className="bg-[#1E1212] p-2.5 border border-[#C5A033]/20 flex items-center justify-between gap-3 shadow-xs rounded-none"
                        >
                          <div className="flex items-center space-x-2.5 min-w-0">
                            <img 
                              src={p.image} 
                              alt={p.name} 
                              className="w-10 h-10 object-cover rounded-none flex-shrink-0 border border-[#C5A033]/35"
                            />
                            <div className="min-w-0">
                              <h4 className="font-serif font-bold text-yellow-100 text-xs truncate uppercase tracking-wider">{p.name}</h4>
                              <p className="font-mono text-[10px] font-bold text-[#C5A033] mt-0.5">${p.price.toFixed(2)}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => onDirectAddProduct(p)}
                            className="bg-[#800C0D] hover:bg-[#9B1315] text-[#FCFAF3] font-serif font-bold text-[9px] tracking-widest uppercase px-3 py-1.5 border border-[#C5A033] flex items-center space-x-1 flex-shrink-0 cursor-pointer hover:brightness-110"
                          >
                            <Plus className="w-3 h-3 text-[#C5A033]" />
                            <span>Añadir</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Spinner bubble */}
        {isSending && (
          <div className="flex items-center gap-3 mr-auto max-w-[85%] animate-pulse">
            <div className="w-8 h-8 rounded-none bg-[#800C0D] text-yellow-305 border border-[#C5A033] shadow-md flex items-center justify-center font-bold text-xs flex-shrink-0">
              <span className="font-calligraphy">饌</span>
            </div>
            <div className="bg-[#1E1212] px-4 py-3 rounded-none border border-[#C5A033]/30 flex items-center space-x-2 text-xs text-yellow-100/70">
              <RefreshCw className="w-4 h-4 animate-spin text-[#C5A033]" />
              <span>Chef Chen atizando el wok mental...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Predefined Questions list */}
      {messages.length === 1 && (
        <div className="bg-[#1E1212] border-x-2 border-[#C5A033]/60 p-4 space-y-2">
          <p className="text-[10px] font-serif font-black text-[#C5A033] uppercase tracking-widest mb-1.5">Sugerencias del Palacio:</p>
          <div className="flex flex-wrap gap-2">
            {PREDEFINED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => handleSendMessage(q)}
                className="px-3.5 py-2 bg-[#110A0A] hover:bg-[#800C0D] border border-[#C5A033]/20 hover:border-[#C5A033] text-yellow-100/75 hover:text-[#FCFAF3] text-xs font-serif font-bold rounded-none transition-all cursor-pointer text-left uppercase tracking-wider"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Input panel */}
      <div className="bg-[#1E1212] border-2 border-[#C5A033] p-4 shadow-xl relative rounded-none" id="chef-chat-input-panel">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Pregúntale a Chen: '¿Cuál es el mejor combo familiar para 5 personas?'"
            className="flex-1 px-4 py-3 bg-[#2D1B1B] border border-[#C5A033]/30 text-yellow-101 rounded-none text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#C5A033] focus:border-[#C5A033] transition-all"
            id="chef-chat-input"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="px-5 bg-[#800C0D] hover:bg-[#9B1315] text-[#FCFAF3] border border-[#C5A033] rounded-none flex items-center justify-center shadow-md transition-all cursor-pointer disabled:opacity-35 focus:outline-none"
            id="chef-send-btn"
          >
            <Send className="w-5 h-5 text-[#C5A033]" />
          </button>
        </form>
      </div>

    </section>
  );
}
