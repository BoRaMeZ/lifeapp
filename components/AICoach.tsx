
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Language, PlayerStats, UserProfile, ProjectCard, AgendaItem, DailyTask } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { Bot, Send, User, Loader2, Zap, Lightbulb, Activity, CheckCheck, Mic, MicOff } from 'lucide-react';
import { getTranslation } from '../utils/translations';

interface AICoachProps {
  lang: Language;
  stats: PlayerStats;
  userProfile: UserProfile;
  agenda: AgendaItem[];
  tasks: DailyTask[];
  onUpdateAgenda: React.Dispatch<React.SetStateAction<AgendaItem[]>>;
  onUpdateTasks: React.Dispatch<React.SetStateAction<DailyTask[]>>;
  onGainXP: (amount: number) => void;
}

const AICoach: React.FC<AICoachProps> = ({ 
    lang, stats, userProfile, agenda, tasks, 
    onUpdateAgenda, onUpdateTasks, onGainXP 
}) => {
  const t = getTranslation(lang);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [lastAction, setLastAction] = useState<string | null>(null);

  // Voice State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  
  useEffect(() => {
    if (messages.length <= 1) {
        setMessages([{
            id: 'welcome',
            role: 'model',
            text: t.aiCoach.initialMsg,
            timestamp: new Date()
        }]);
    }
  }, [lang]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // --- VOICE LOGIC ---
  const toggleMic = () => {
    // Check support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert(t.aiCoach.mic.unsupported);
        return;
    }

    if (isListening) {
        recognitionRef.current?.stop();
        setIsListening(false);
    } else {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = lang === 'es' ? 'es-ES' : 'en-US';

        recognitionRef.current.onstart = () => {
            setIsListening(true);
        };

        recognitionRef.current.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInput(prev => prev ? `${prev} ${transcript}` : transcript);
        };

        recognitionRef.current.onerror = (event: any) => {
            console.error("Speech error", event.error);
            setIsListening(false);
        };

        recognitionRef.current.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current.start();
    }
  };


  const executeAICommand = (responseText: string) => {
    // Regex to extract JSON block inside ```json ... ```
    const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
    if (!jsonMatch) return;

    try {
        const command = JSON.parse(jsonMatch[1]);
        
        // ACTION A: CREATE_AGENDA
        if (command.action === 'CREATE_AGENDA' && Array.isArray(command.payload)) {
            const newAgenda = command.payload.map((item: any, idx: number) => ({
                ...item,
                id: Date.now() + idx.toString(),
                completed: false
            }));
            onUpdateAgenda(newAgenda);
            setLastAction('AGENDA_UPDATED');
        }

        // ACTION B: ADD_TASK
        if (command.action === 'ADD_TASK' && command.payload) {
            const newTask: DailyTask = {
                id: Date.now().toString(),
                title: command.payload.title || 'New Task',
                category: command.payload.category || 'home',
                xp: command.payload.xp || 15,
                completed: false,
                translationKey: ''
            };
            onUpdateTasks(prev => [...prev, newTask]);
            setLastAction('TASK_ADDED');
        }

        // ACTION C: COMPLETE_TASK
        if (command.action === 'COMPLETE_TASK' && command.payload.searchTitle) {
            const search = command.payload.searchTitle.toLowerCase();
            let taskFound = false;
            
            onUpdateTasks(prev => prev.map(t => {
                if (!t.completed && (t.title.toLowerCase().includes(search) || t.translationKey?.toLowerCase().includes(search))) {
                    taskFound = true;
                    onGainXP(t.xp);
                    return { ...t, completed: true };
                }
                return t;
            }));

            if(taskFound) setLastAction('TASK_COMPLETED');
        }

        // Clear feedback after 3s
        setTimeout(() => setLastAction(null), 3000);

    } catch (e) {
        console.error("Failed to parse AI command", e);
    }
  };

  const handleSend = async (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const storedProjects = localStorage.getItem('streamos_projects');
    const projects = storedProjects ? JSON.parse(storedProjects) : [];

    const history = messages.map(m => ({ role: m.role, text: m.text }));
    
    // Pass CURRENT state props, not local storage read, to ensure we have latest synced state
    const responseText = await sendMessageToGemini(
        history, 
        userMsg.text, 
        lang, 
        stats, 
        projects, 
        agenda, 
        tasks,
        userProfile
    );

    // Check for JSON commands
    executeAICommand(responseText);

    // Clean text for display (remove JSON block)
    const displayUserInfo = responseText.replace(/```json[\s\S]*?```/, '').trim();

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: displayUserInfo || (lang === 'es' ? "¡Hecho!" : "Done!"), // Fallback if AI only sends JSON
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  const QuickActionBtn = ({ icon: Icon, label, prompt }: { icon: any, label: string, prompt: string }) => (
      <button 
        onClick={() => handleSend(prompt)}
        disabled={isLoading}
        className="flex items-center gap-2 px-3 py-2 bg-cyber-800 border border-cyber-700 rounded-lg text-xs font-bold text-gray-300 hover:text-cyber-cyan hover:border-cyber-cyan/50 transition-all disabled:opacity-50 whitespace-nowrap"
      >
          <Icon size={14} /> {label}
      </button>
  );

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-cyber-800 rounded-2xl border border-cyber-700 overflow-hidden shadow-2xl relative">
      
      {/* Action Feedback Overlay */}
      {lastAction && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-cyber-green text-black px-4 py-2 rounded-full font-bold shadow-[0_0_20px_rgba(16,185,129,0.5)] flex items-center gap-2 animate-bounce">
              <CheckCheck size={18} />
              {lastAction === 'AGENDA_UPDATED' && (lang === 'es' ? 'Agenda Actualizada' : 'Agenda Updated')}
              {lastAction === 'TASK_ADDED' && (lang === 'es' ? 'Tarea Añadida' : 'Task Added')}
              {lastAction === 'TASK_COMPLETED' && (lang === 'es' ? 'Tarea Completada' : 'Task Completed')}
          </div>
      )}

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
                    {msg.role === 'user' ? userProfile.name : 'StreamOS'}
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

      {/* Quick Actions & Input */}
      <div className="p-4 bg-cyber-900 border-t border-cyber-700 space-y-3">
        
        {/* Quick Actions */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <QuickActionBtn 
                icon={Zap} 
                label={t.aiCoach.actions.plan} 
                prompt={lang === 'es' ? "Planifica mi agenda para esta noche (9PM - 11PM) con bloques de energía." : "Plan my agenda for tonight (9PM - 11PM) using energy blocks."} 
            />
            <QuickActionBtn 
                icon={Lightbulb} 
                label={t.aiCoach.actions.ideas} 
                prompt={lang === 'es' ? "Dame 3 ideas virales para mi próximo clip basadas en mis proyectos actuales." : "Give me 3 viral ideas for my next clip based on my current projects."} 
            />
            <QuickActionBtn 
                icon={Activity} 
                label={t.aiCoach.actions.status} 
                prompt={lang === 'es' ? "Analiza mi sistema y dime qué tareas de Ops Base me faltan completar." : "Analyze my system and tell me which Base Ops tasks are missing."} 
            />
        </div>

        <div className="flex gap-2 items-center">
            <div className="relative flex-1">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={isListening ? t.aiCoach.mic.listening : t.aiCoach.placeholder}
                    className={`w-full bg-cyber-800 border rounded-lg pl-4 pr-10 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors ${isListening ? 'border-red-500 animate-pulse bg-red-500/10' : 'border-cyber-600 focus:border-cyber-cyan'}`}
                    disabled={isLoading}
                />
                <button
                    onClick={toggleMic}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'text-gray-400 hover:text-white hover:bg-cyber-700'}`}
                    title={isListening ? "Stop Recording" : "Start Recording"}
                >
                    {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
            </div>

            <button 
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                className="bg-cyber-cyan text-black px-4 py-3 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold flex items-center justify-center min-w-[50px]"
            >
                <Send size={20} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default AICoach;
