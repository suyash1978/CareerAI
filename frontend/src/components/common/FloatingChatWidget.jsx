import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, MessageSquare, X, Send, Loader2, Bot, User, Trash2, ShieldAlert } from 'lucide-react';
import { aiApi } from '../../api/aiApi';
import { useAuth } from '../../context/AuthContext';

const FloatingChatWidget = () => {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && isAuthenticated && !conversationId) {
      initConversation();
    }
  }, [isOpen, isAuthenticated]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initConversation = async () => {
    try {
      const conversations = await aiApi.getConversations();
      if (conversations && conversations.length > 0) {
        const active = conversations[0];
        setConversationId(active.id);
        fetchMessages(active.id);
      } else {
        const newConv = await aiApi.createConversation('Quick Career Assistant');
        setConversationId(newConv.id);
      }
    } catch (err) {
      console.error('Failed to initialize chatbot conversation', err);
    }
  };

  const fetchMessages = async (cId) => {
    try {
      const data = await aiApi.getConversationMessages(cId);
      setMessages(data || []);
    } catch (err) {
      console.error('Failed to fetch messages', err);
    }
  };

  const handleSend = async (textToSend = inputText) => {
    if (!textToSend.strip && !textToSend.trim()) return;
    const clean = textToSend.trim();

    if (!conversationId) return;

    // Optimistic User Message
    const tempUserMsg = { id: Date.now(), sender: 'USER', text: clean, created_at: 'Just now' };
    setMessages((prev) => [...prev, tempUserMsg]);
    setInputText('');
    setLoading(true);

    try {
      const updatedMessages = await aiApi.sendMessage(conversationId, clean);
      setMessages(updatedMessages);
    } catch (err) {
      console.error('Failed to send chatbot message', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">

      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center space-x-2.5 p-4 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl shadow-indigo-600/40 hover:scale-105 transition-all duration-300 relative"
          title="Open CareerAI Assistant"
        >
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-purple-500"></span>
          </span>
          <Sparkles className="w-6 h-6 animate-pulse" />
          <span className="text-xs font-bold pr-1 hidden sm:inline">Ask AI Assistant</span>
        </button>
      )}

      {/* Floating Quick-Chat Window */}
      {isOpen && (
        <div className="glass-panel w-[350px] sm:w-[400px] h-[520px] rounded-3xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">

          {/* Header */}
          <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-1">
                  <span>CareerAI Assistant</span>
                </h3>
                <p className="text-[10px] text-emerald-400 font-semibold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  <span>Context Aware • Active</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-slate-950/40">
            {messages.length === 0 ? (
              <div className="text-center py-8 space-y-3">
                <Bot className="w-10 h-10 text-indigo-400 mx-auto" />
                <p className="text-slate-300 font-semibold">How can I assist your career today?</p>
                <div className="flex flex-col gap-1.5 text-[11px] text-left pt-2">
                  <button
                    onClick={() => handleSend('How can I optimize my resume for ATS compliance?')}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500/40 transition-colors"
                  >
                    💡 How can I optimize my resume for ATS?
                  </button>
                  <button
                    onClick={() => handleSend('What skills should I learn for Full-Stack Developer roles?')}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500/40 transition-colors"
                  >
                    🚀 What skills should I learn next?
                  </button>
                </div>
              </div>
            ) : (
              messages.map((m, idx) => (
                <div
                  key={m.id || idx}
                  className={`flex ${m.sender === 'USER' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl ${m.sender === 'USER'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                      }`}
                  >
                    <p className="leading-relaxed whitespace-pre-line">{m.text}</p>
                  </div>
                </div>
              ))
            )}

            {loading && (
              <div className="flex items-center space-x-2 text-slate-400 py-2">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                <span className="text-[11px]">CareerAI is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-slate-900/90 border-t border-slate-800 space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about resume, interview prep, skills..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                disabled={loading || !inputText.trim()}
                onClick={() => handleSend()}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[9px] text-slate-500 text-center">
              AI advice is guidance; results are not hiring guarantees.
            </p>
          </div>

        </div>
      )}

    </div>
  );
};

export default FloatingChatWidget;
