
import React, { useState, useEffect } from 'react';
import { generateStreamTitles } from '../services/geminiService';
import { Language } from '../types';
import { getTranslation } from '../utils/translations';
import { Radio, Mic, Droplets, Monitor, Zap, Copy, X, CheckSquare, Square, Plus, Trash2 } from 'lucide-react';

interface StreamLauncherProps {
  lang: Language;
  onClose: () => void;
  onComplete: () => void;
}

interface ChecklistItem {
    id: string;
    text?: string;
    translationKey?: string;
    checked: boolean;
}

const StreamLauncher: React.FC<StreamLauncherProps> = ({ lang, onClose, onComplete }) => {
  const t = getTranslation(lang);
  const [step, setStep] = useState<'checklist' | 'titles' | 'live'>('checklist');
  const [game, setGame] = useState('');
  const [vibe, setVibe] = useState('');
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newItemText, setNewItemText] = useState('');
  
  // Checklist State
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);

  const [currentTime, setCurrentTime] = useState(new Date());

  // Init Checklist (Load from local or defaults)
  useEffect(() => {
    const savedList = localStorage.getItem('streamos_stream_checklist');
    if (savedList) {
        setChecklistItems(JSON.parse(savedList));
    } else {
        // Defaults
        setChecklistItems([
            { id: 'water', translationKey: 'water', checked: false },
            { id: 'obs', translationKey: 'obs', checked: false },
            { id: 'mic', translationKey: 'mic', checked: false },
            { id: 'lights', translationKey: 'lights', checked: false },
            { id: 'socials', translationKey: 'socials', checked: false },
        ]);
    }
  }, []);

  // Save checklist persistence
  useEffect(() => {
      if (checklistItems.length > 0) {
          localStorage.setItem('streamos_stream_checklist', JSON.stringify(checklistItems));
      }
  }, [checklistItems]);

  useEffect(() => {
    if (step === 'live') {
        const interval = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(interval);
    }
  }, [step]);

  const allChecked = checklistItems.length > 0 && checklistItems.every(i => i.checked);

  const toggleCheck = (id: string) => {
      setChecklistItems(prev => prev.map(item => 
          item.id === id ? { ...item, checked: !item.checked } : item
      ));
  };

  const addItem = () => {
      if (!newItemText.trim()) return;
      const newItem: ChecklistItem = {
          id: Date.now().toString(),
          text: newItemText,
          checked: false
      };
      setChecklistItems(prev => [...prev, newItem]);
      setNewItemText('');
  };

  const removeItem = (id: string) => {
      if (confirm('Remove this item?')) {
          setChecklistItems(prev => prev.filter(i => i.id !== id));
      }
  };

  const getLabel = (item: ChecklistItem) => {
      if (item.translationKey) {
          // @ts-ignore
          return t.stream.items[item.translationKey] || item.translationKey;
      }
      return item.text || 'Unknown';
  };

  const getIcon = (item: ChecklistItem) => {
      if (item.translationKey === 'water') return <Droplets size={18} />;
      if (item.translationKey === 'obs') return <Monitor size={18} />;
      if (item.translationKey === 'mic') return <Mic size={18} />;
      if (item.translationKey === 'lights') return <Zap size={18} />;
      if (item.translationKey === 'socials') return <Radio size={18} />;
      return <Radio size={18} />;
  };

  const handleGenerate = async () => {
      if (!game) return;
      setIsGenerating(true);
      const titles = await generateStreamTitles(game, vibe || 'Chill', lang);
      setGeneratedTitles(titles);
      setIsGenerating(false);
  };

  const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
  };

  if (step === 'live') {
      return (
          <div className="fixed inset-0 bg-black z-[60] flex flex-col items-center justify-center p-6 animate-fade-in border-4 border-pink-600">
              <div className="absolute top-4 right-4 animate-pulse">
                  <div className="bg-red-600 text-white px-4 py-1 rounded font-bold uppercase tracking-widest text-xs">
                      {t.stream.onAir}
                  </div>
              </div>
              
              <div className="text-center space-y-8">
                  <h1 className="text-[120px] md:text-[200px] font-mono font-bold text-white leading-none tracking-tighter">
                      {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </h1>
                  
                  <div className="bg-cyber-900/50 border border-cyber-cyan/30 p-8 rounded-2xl max-w-xl mx-auto">
                      <Droplets size={48} className="mx-auto text-cyber-cyan mb-4 animate-bounce" />
                      <h2 className="text-2xl font-display text-cyber-cyan uppercase tracking-widest mb-2">
                          {t.stream.drinkReminder}
                      </h2>
                      <p className="text-gray-400">Interval: 30m</p>
                  </div>

                  <button 
                    onClick={onClose}
                    className="mt-12 text-gray-600 hover:text-white border border-gray-800 hover:border-white px-8 py-3 rounded-full transition-all"
                  >
                      {t.stream.end}
                  </button>
              </div>
          </div>
      );
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-cyber-900 border border-pink-500/30 w-full max-w-2xl rounded-2xl shadow-[0_0_50px_rgba(236,72,153,0.1)] overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-900/20 to-cyber-900 p-6 border-b border-pink-500/20 flex justify-between items-center">
                <h2 className="text-2xl font-display font-bold text-white flex items-center gap-3">
                    <Radio className="text-pink-500 animate-pulse" /> {t.stream.title}
                </h2>
                <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={24}/></button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
                {step === 'checklist' && (
                    <div className="space-y-4">
                        <p className="text-pink-400 font-mono text-sm uppercase mb-4">{t.stream.checklist}</p>
                        
                        <div className="grid gap-3 max-h-[50vh] overflow-y-auto pr-2">
                            {checklistItems.map((item) => (
                                <div key={item.id} className="flex gap-2">
                                    <button 
                                        onClick={() => toggleCheck(item.id)}
                                        className={`flex-1 flex items-center gap-4 p-4 rounded-xl border transition-all ${item.checked ? 'bg-pink-500/10 border-pink-500 text-white' : 'bg-cyber-800 border-cyber-700 text-gray-400'}`}
                                    >
                                        {item.checked ? <CheckSquare className="text-pink-500"/> : <Square />}
                                        <div className="flex items-center gap-2">
                                            {getIcon(item)}
                                            {getLabel(item)}
                                        </div>
                                    </button>
                                    <button 
                                        onClick={() => removeItem(item.id)}
                                        className="bg-cyber-900 border border-cyber-700 text-gray-600 hover:text-red-500 hover:border-red-500 p-4 rounded-xl transition-all"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Add Item Input */}
                        <div className="flex gap-2 mt-4 pt-4 border-t border-cyber-700/50">
                            <input 
                                type="text" 
                                value={newItemText}
                                onChange={(e) => setNewItemText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addItem()}
                                placeholder={t.stream.addItem}
                                className="flex-1 bg-cyber-800 border border-cyber-700 rounded-lg px-4 py-2 text-white focus:border-pink-500 outline-none"
                            />
                            <button 
                                onClick={addItem}
                                disabled={!newItemText.trim()}
                                className="bg-cyber-800 border border-cyber-700 text-pink-500 hover:bg-pink-500 hover:text-white hover:border-pink-500 px-4 py-2 rounded-lg font-bold transition-all disabled:opacity-50"
                            >
                                <Plus size={20} />
                            </button>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button 
                                onClick={() => setStep('titles')}
                                disabled={!allChecked}
                                className="bg-pink-600 text-white px-8 py-3 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-500 transition-colors shadow-lg"
                            >
                                NEXT PHASE
                            </button>
                        </div>
                    </div>
                )}

                {step === 'titles' && (
                    <div className="space-y-6">
                         <p className="text-pink-400 font-mono text-sm uppercase">{t.stream.generate}</p>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input 
                                type="text"
                                placeholder={t.stream.gamePlaceholder}
                                value={game}
                                onChange={(e) => setGame(e.target.value)}
                                className="bg-cyber-800 border border-cyber-700 rounded-lg p-3 text-white focus:border-pink-500 outline-none"
                            />
                            <input 
                                type="text"
                                placeholder={t.stream.vibePlaceholder}
                                value={vibe}
                                onChange={(e) => setVibe(e.target.value)}
                                className="bg-cyber-800 border border-cyber-700 rounded-lg p-3 text-white focus:border-pink-500 outline-none"
                            />
                         </div>

                         <button 
                            onClick={handleGenerate}
                            disabled={isGenerating || !game}
                            className="w-full bg-pink-500/20 text-pink-500 border border-pink-500 hover:bg-pink-500 hover:text-white py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
                         >
                             {isGenerating ? <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"/> : <Zap size={18} />}
                             {isGenerating ? t.stream.generating : t.stream.btnGenerate}
                         </button>

                         {generatedTitles.length > 0 && (
                             <div className="space-y-3 mt-4">
                                 {generatedTitles.map((title, idx) => (
                                     <div key={idx} className="bg-cyber-800 p-4 rounded-lg border border-cyber-700 flex justify-between items-center group hover:border-pink-500/50 transition-colors">
                                         <span className="font-bold text-white text-sm md:text-base">{title}</span>
                                         <button 
                                            onClick={() => copyToClipboard(title)}
                                            className="text-gray-500 hover:text-white bg-cyber-900 p-2 rounded"
                                         >
                                             <Copy size={16} />
                                         </button>
                                     </div>
                                 ))}
                             </div>
                         )}

                        <div className="flex justify-between mt-8 pt-4 border-t border-cyber-700">
                             <button onClick={() => setStep('checklist')} className="text-gray-500 hover:text-white">Back</button>
                             <button 
                                onClick={() => setStep('live')}
                                className="bg-green-500 text-black px-8 py-3 rounded-lg font-bold hover:bg-green-400 transition-colors shadow-[0_0_20px_rgba(34,197,94,0.3)] animate-pulse"
                             >
                                 GO LIVE
                             </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default StreamLauncher;
