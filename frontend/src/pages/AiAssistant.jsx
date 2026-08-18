import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles, MessageSquare, Plus, Trash2, Send, Loader2, Bot, User,
  ShieldAlert, BookOpen, Target, FileText, CheckCircle2, HelpCircle
} from 'lucide-react';
import { aiApi } from '../api/aiApi';
import { useAuth } from '../context/AuthContext';

const QUICK_PROMPTS = [
  'How can I optimize my resume for ATS compliance?',
  'What technical skills should I focus on for Full-Stack Developer roles?',
  'How do I answer "Tell me about a technical challenge you faced"?',
  'Can you analyze my job search strategy based on my recent applications?'
];

const AiAssistant = () => {
  const { user } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  const [loading, setLoading] = useState(false);
  const [fetchingMessages, setFetchingMessages] = useState(false);
  const [error, setError] = useState('');

  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const data = await aiApi.getConversations();
      setConversations(data || []);
      if (data && data.length > 0 && !activeConversationId) {
        selectConversation(data[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch conversations', err);
    }
  };

  const selectConversation = async (cId) => {
    setActiveConversationId(cId);
    setFetchingMessages(true);
    try {
      const msgs = await aiApi.getConversationMessages(cId);
      setMessages(msgs || []);
    } catch (err) {
      console.error('Failed to fetch conversation messages', err);
    } finally {
      setFetchingMessages(false);
    }
  };

  const handleCreateNewConversation = async () => {
    setLoading(true);
    try {
      const newConv = await aiApi.createConversation('New Career Session');
      setConversations((prev) => [newConv, ...prev]);
      setActiveConversationId(newConv.id);
      setMessages([]);
    } catch (err) {
      console.error('Failed to create new conversation', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConversation = async (cId, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Delete this conversation session?')) return;

    try {
      await aiApi.deleteConversation(cId);
      setConversations((prev) => prev.filter((c) => c.id !== cId));
      if (activeConversationId === cId) {
        setActiveConversationId(null);
        setMessages([]);
      }
    } catch (err) {
      console.error('Failed to delete conversation', err);
    }
  };

  const handleSendMessage = async (textToSend = inputText) => {
    if (!textToSend || !textToSend.trim()) return;
    const clean = textToSend.trim();

    let targetCId = activeConversationId;
    if (!targetCId) {
      try {
        const newConv = await aiApi.createConversation(clean.slice(0, 30));
        setConversations((prev) => [newConv, ...prev]);
        targetCId = newConv.id;
        setActiveConversationId(newConv.id);
      } catch (err) {
        console.error('Failed to auto-create conversation', err);
        return;
      }
    }

    const tempUserMsg = { id: Date.now(), sender: 'USER', text: clean, created_at: 'Just now' };
    setMessages((prev) => [...prev, tempUserMsg]);
    setInputText('');
    setLoading(true);

    try {
      const updated = await aiApi.sendMessage(targetCId, clean);
      setMessages(updated);
      fetchConversations(); // refresh title if updated
    } catch (err) {
      console.error('Failed to send message', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col space-y-4 py-2">

      {/* Disclaimer Banner */}
      <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-800 flex items-center justify-between font-medium">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-indigo-600 flex-shrink-0" />
          <span>
            <strong className="font-extrabold text-indigo-900">CareerAI Assistant:</strong> AI career recommendations and suggestions provide guidance and do not guarantee specific hiring outcomes.
          </span>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-200/80 shadow-md flex overflow-hidden">

        {/* Left Sidebar: Conversations */}
        <div className="w-64 sm:w-80 bg-slate-50 border-r border-slate-200 flex flex-col p-4 space-y-4">

          <button
            onClick={handleCreateNewConversation}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 flex items-center justify-center space-x-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Conversation</span>
          </button>

          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase px-2">Recent Chats</span>

            {conversations.length === 0 ? (
              <p className="text-xs text-slate-400 px-2 py-4 font-medium">No chat history yet.</p>
            ) : (
              conversations.map((c) => (
                <div
                  key={c.id}
                  onClick={() => selectConversation(c.id)}
                  className={`p-3 rounded-xl cursor-pointer flex items-center justify-between text-xs transition-all group ${activeConversationId === c.id
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/25'
                      : 'text-slate-700 hover:bg-slate-100 font-semibold'
                    }`}
                >
                  <div className="flex items-center space-x-2 truncate pr-2">
                    <MessageSquare className={`w-3.5 h-3.5 flex-shrink-0 ${activeConversationId === c.id ? 'text-white' : 'text-blue-600'}`} />
                    <span className="truncate">{c.title}</span>
                  </div>

                  <button
                    onClick={(e) => handleDeleteConversation(c.id, e)}
                    className={`p-1 opacity-0 group-hover:opacity-100 transition-opacity ${activeConversationId === c.id ? 'text-white/80 hover:text-white' : 'text-slate-400 hover:text-rose-600'}`}
                    title="Delete Conversation"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Context Badge Footer */}
          <div className="p-3 rounded-2xl bg-white border border-slate-200/80 text-[11px] text-slate-600 space-y-1 font-medium shadow-xs">
            <span className="font-extrabold text-slate-900 block flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>User Context Connected</span>
            </span>
            <p className="text-[10px] text-slate-500">
              Profile skills, uploaded resume details, and applications context enabled.
            </p>
          </div>

        </div>

        {/* Right Chat Stream Area */}
        <div className="flex-1 flex flex-col bg-slate-50/50">

          {/* Messages Stream */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {fetchingMessages ? (
              <div className="flex items-center justify-center py-16 space-y-2 text-slate-500 text-xs font-semibold">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span>Loading conversation...</span>
              </div>
            ) : messages.length === 0 ? (
              <div className="max-w-xl mx-auto py-12 text-center space-y-6">
                <div className="w-16 h-16 rounded-3xl bg-blue-50 border border-blue-100 mx-auto flex items-center justify-center text-blue-600 shadow-sm">
                  <Sparkles className="w-8 h-8" />
                </div>

                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">How can CareerAI help you today?</h2>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    Ask tailored questions about resume improvements, interview preparation, or skill recommendations.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-left">
                  {QUICK_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(prompt)}
                      className="p-4 rounded-2xl bg-white border border-slate-200/80 text-slate-700 hover:text-blue-600 hover:border-blue-300 hover:shadow-md transition-all text-left font-semibold"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m, idx) => (
                <div
                  key={m.id || idx}
                  className={`flex ${m.sender === 'USER' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-3xl ${m.sender === 'USER'
                        ? 'bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-500/25'
                        : 'bg-white border border-slate-200/80 text-slate-800 rounded-bl-none shadow-sm'
                      }`}
                  >
                    <div className="flex items-center space-x-2 text-[11px] opacity-75 mb-1 font-medium">
                      {m.sender === 'USER' ? (
                        <span className="font-bold flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span>You</span>
                        </span>
                      ) : (
                        <span className="font-bold flex items-center space-x-1 text-blue-600">
                          <Bot className="w-3 h-3" />
                          <span>CareerAI Assistant</span>
                        </span>
                      )}
                      <span>•</span>
                      <span>{m.created_at}</span>
                    </div>

                    <p className="text-xs leading-relaxed whitespace-pre-line font-medium">{m.text}</p>
                  </div>
                </div>
              ))
            )}

            {loading && (
              <div className="flex items-center space-x-2 text-slate-500 text-xs py-2 font-semibold">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span>CareerAI Assistant is analyzing your context and generating response...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-4 bg-white border-t border-slate-200 space-y-2">
            <div className="flex items-center space-x-3">
              <textarea
                rows={2}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask about your resume, interview questions, target skills, or career guidance... (Press Enter to send)"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 resize-none leading-relaxed font-medium transition-all"
              />

              <button
                disabled={loading || !inputText.trim()}
                onClick={() => handleSendMessage()}
                className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-blue-500/25 flex items-center space-x-2 transition-all"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default AiAssistant;
