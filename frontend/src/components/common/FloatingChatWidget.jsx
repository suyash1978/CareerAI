import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, MessageSquare, X, Send, Loader2, Bot, User, Trash2 } from 'lucide-react';
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
    if (!textToSend || !textToSend.trim()) return;
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

      {/* HospiWise Styled Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center space-x-2.5 px-5 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/30 hover:scale-105 transition-all duration-300 relative border border-blue-500/20"
          title="Open CareerAI Assistant"
        >
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-blue-400"></span>
          </span>
          <Sparkles className="w-5 h-5 text-white" />
          <span className="text-xs font-bold pr-1 hidden sm:inline">AI Career Assistant</span>
        </button>
      )}

      {/* Floating Quick-Chat Window */}
      {isOpen && (
        <div className="w-[350px] sm:w-[400px] h-[530px] rounded-3xl bg-white border border-slate-200/90 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">

          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-white/15 backdrop-blur-md text-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold flex items-center space-x-1">
                  <span>CareerAI Assistant</span>
                </h3>
                <p className="text-[10px] text-blue-100 font-semibold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  <span>Online • Ready to assist</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl text-blue-100 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-slate-50/60">
            {messages.length === 0 ? (
              <div className="text-center py-8 space-y-3">
                <Bot className="w-10 h-10 text-blue-600 mx-auto" />
                <p className="text-slate-800 font-bold">How can I assist your career today?</p>
                <div className="flex flex-col gap-2 text-[11px] text-left pt-2">
                  <button
                    onClick={() => handleSend('How can I optimize my resume for ATS compliance?')}
                    className="p-3 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 shadow-sm transition-all text-xs font-medium"
                  >
                    💡 How can I optimize my resume for ATS?
                  </button>
                  <button
                    onClick={() => handleSend('What skills should I learn for Full-Stack Developer roles?')}
                    className="p-3 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 shadow-sm transition-all text-xs font-medium"
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
                    className={`max-w-[85%] p-3.5 rounded-2xl shadow-sm ${m.sender === 'USER'
                      ? 'bg-blue-600 text-white rounded-br-none font-medium'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                      }`}
                  >
                    <p className="leading-relaxed whitespace-pre-line">{m.text}</p>
                  </div>
                </div>
              ))
            )}

            {loading && (
              <div className="flex items-center space-x-2 text-slate-500 py-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span className="text-[11px] font-medium">CareerAI is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-slate-200 space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about resume, interview prep, skills..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
              <button
                disabled={loading || !inputText.trim()}
                onClick={() => handleSend()}
                className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white shadow-md shadow-blue-500/20 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[9px] text-slate-400 text-center font-medium">
              AI advice is guidance; results are not hiring guarantees.
            </p>
          </div>

        </div>
      )}

    </div>
  );
};

export default FloatingChatWidget;
