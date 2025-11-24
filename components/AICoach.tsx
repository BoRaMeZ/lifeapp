
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Language, PlayerStats } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { Bot, Send, User, Loader2 } from 'lucide-react';
import { getTranslation } from '../utils/translations';

interface AICoachProps {
  lang: Language;
  stats: PlayerStats;
}

const AICoach: React.FC<AICoachProps> = ({ lang, stats }) => {
  const t = getTranslation(lang);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Reset initial message when language changes if the history is empty or default
  useEffect(() => {
    if (messages.length <= 1) {
        setMessages([{
            id: 'welcome',
            role: 'model',
            text: t.aiCoach.initialMsg,
            timestamp: new Date()
        }]);
    }
  }, [lang]); // eslint-disable-line react-hooks/exhaustive-deps

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Prepare history for API (simplified)
    const history = messages.map(m => ({ role: m.role, text: m.text }));
    const responseText = await sendMessageToGemini(history, userMsg.text, lang, stats);

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-cyber-800 rounded-2xl border border-cyber-700 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-cyber-900 p-4 border-b border-cyber-700 flex items-center gap-3">
        <div className="p-2 bg-cyber-purple/20 rounded-lg">
            <Bot className="text-cyber-purple" size={24} />
        </div>
        <div>
            <h3 className="font-display font-bold text-white">{t.aiCoach.title}</h3>
            <p className="text-xs text-cyber-purple animate-pulse">{t.aiCoach.status}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] rounded-xl p-4 ${
                msg.role === 'user' 
                ? 'bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyan-50' 
                : 'bg-cyber-700/50 border border-cyber-700 text-gray-200'
            }`}>
                <div className="flex items-center gap-2 mb-1 opacity-50 text-xs uppercase tracking-wider font-bold">
                    {msg.role === 'user' ? <User size={12}/> : <Bot size={12}/>}
                    {msg.role === 'user' ? 'Operator' : 'StreamOS'}
                </div>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                 <div className="bg-cyber-700/50 border border-cyber-700 text-gray-200 rounded-xl p-4 flex items-center gap-2">
                    <Loader2 className="animate-spin text-cyber-cyan" size={16} />
                    <span className="text-xs text-gray-400">{t.aiCoach.analyzing}</span>
                 </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-cyber-900 border-t border-cyber-700">
        <div className="flex gap-2">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t.aiCoach.placeholder}
                className="flex-1 bg-cyber-800 border border-cyber-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan transition-colors"
                disabled={isLoading}
            />
            <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-cyber-cyan text-black px-4 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold"
            >
                <Send size={20} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default AICoach;
