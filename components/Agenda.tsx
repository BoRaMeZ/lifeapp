
import React, { useState, useEffect } from 'react';
import { Clock, Briefcase, Video, Moon, Coffee, Plus, Trash2, CheckCircle, Circle, Brain, Zap, Play, Radio } from 'lucide-react';
import { Language, AgendaItem } from '../types';
import { getTranslation } from '../utils/translations';
import FocusMode from './FocusMode';

interface AgendaProps {
  lang: Language;
  onGainXP: (amount: number) => void;
  items: AgendaItem[];
  setItems: React.Dispatch<React.SetStateAction<AgendaItem[]>>;
}

const Agenda: React.FC<AgendaProps> = ({ lang, onGainXP, items, setItems }) => {
  const t = getTranslation(lang);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFocusItem, setActiveFocusItem] = useState<AgendaItem | null>(null);
  const [currentTimeMinutes, setCurrentTimeMinutes] = useState(0);

  // Update time every minute to highlight active block
  useEffect(() => {
    const updateTime = () => {
        const now = new Date();
        setCurrentTimeMinutes(now.getHours() * 60 + now.getMinutes());
    };
    updateTime();
    const interval = setInterval(updateTime, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const isBlockActive = (start: string, end: string) => {
    const [sH, sM] = start.split(':').map(Number);
    const [eH, eM] = end.split(':').map(Number);
    const startMins = sH * 60 + sM;
    const endMins = eH * 60 + eM;
    return currentTimeMinutes >= startMins && currentTimeMinutes < endMins;
  };

  const isBlockPast = (end: string) => {
    const [eH, eM] = end.split(':').map(Number);
    return currentTimeMinutes >= (eH * 60 + eM);
  };

  const getProgress = (start: string, end: string) => {
      const [sH, sM] = start.split(':').map(Number);
      const [eH, eM] = end.split(':').map(Number);
      const startMins = sH * 60 + sM;
      const endMins = eH * 60 + eM;
      const now = currentTimeMinutes;

      if (now >= endMins) return 100;
      if (now < startMins) return 0;
      
      const duration = endMins - startMins;
      const elapsed = now - startMins;
      return Math.min(100, Math.max(0, (elapsed / duration) * 100));
  };

  // Form State
  const [newItem, setNewItem] = useState<{
    title: string;
    desc: string;
    startTime: string;
    endTime: string;
    type: AgendaItem['type'];
    isStream: boolean;
  }>({
    title: '',
    desc: '',
    startTime: '09:00',
    endTime: '10:00',
    type: 'work',
    isStream: false
  });

  const toggleComplete = (id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        if (item.completed) {
            onGainXP(-item.xpReward);
        } else {
            onGainXP(item.xpReward);
        }
        return { ...item, completed: !item.completed };
      }
      return item;
    }));
  };

  const deleteItem = (id: string) => {
    const itemToDelete = items.find(i => i.id === id);
    if (confirm('Delete this block?')) {
        if (itemToDelete && itemToDelete.completed) {
            onGainXP(-itemToDelete.xpReward);
        }
        setItems(prev => prev.filter(i => i.id !== id));
    }
  };

  const addNewItem = () => {
    if (!newItem.title) return;
    
    let xp = 10;
    if (newItem.type === 'creative') xp = 100;
    if (newItem.type === 'learning') xp = 30;
    if (newItem.type === 'work') xp = 50;
    // Boost XP if it's a stream event
    if (newItem.isStream) xp = 150;

    const item: AgendaItem = {
        id: Date.now().toString(),
        ...newItem,
        completed: false,
        xpReward: xp
    };

    setItems(prev => [...prev, item].sort((a, b) => a.startTime.localeCompare(b.startTime)));
    setIsModalOpen(false);
    setNewItem({ title: '', desc: '', startTime: '09:00', endTime: '10:00', type: 'work', isStream: false });
  };

  const handleFocusComplete = () => {
      if (activeFocusItem) {
          onGainXP(25); // Bonus XP
          toggleComplete(activeFocusItem.id);
          setActiveFocusItem(null);
      }
  };

  const getIcon = (type: string, isStream?: boolean) => {
    if (isStream) return Radio;
    switch(type) {
        case 'work': return Briefcase;
        case 'transit': return Moon;
        case 'base': return Coffee;
        case 'creative': return Video;
        case 'learning': return Brain;
        case 'sleep': return Moon;
        default: return Clock;
    }
  };

  const getCardStyles = (type: string, completed: boolean, active: boolean, isStream?: boolean) => {
    if (completed) return 'border-cyber-green/30 bg-cyber-green/5 opacity-70';
    if (active) return 'border-cyber-cyan bg-cyber-cyan/10 shadow-[0_0_15px_rgba(6,182,212,0.15)] ring-1 ring-cyber-cyan';
    
    if (isStream) return 'border-pink-500 bg-pink-500/10 shadow-[0_0_10px_rgba(236,72,153,0.1)]';

    switch(type) {
        case 'creative': return 'border-cyber-purple bg-cyber-purple/5';
        case 'learning': return 'border-cyber-cyan bg-cyber-cyan/5';
        case 'base': return 'border-cyber-green bg-cyber-green/5';
        case 'work': return 'border-gray-700 bg-gray-900/50';
        default: return 'border-gray-700 bg-cyber-800';
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-24">
      
      {/* Focus Mode Overlay */}
      {activeFocusItem && (
          <FocusMode 
            item={activeFocusItem} 
            lang={lang} 
            onComplete={handleFocusComplete}
            onCancel={() => setActiveFocusItem(null)}
          />
      )}

      <div className="flex justify-between items-center mb-6 sticky top-0 bg-cyber-900/95 backdrop-blur z-30 py-4 border-b border-cyber-700/50 md:static md:bg-transparent md:border-none md:py-0">
        <h2 className="text-2xl font-display text-white flex items-center gap-2">
            <Clock className="text-cyber-cyan" /> {t.agenda.title}
        </h2>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan px-3 py-2 rounded-lg hover:bg-cyber-cyan hover:text-black transition-all font-bold text-sm"
        >
            <Plus size={18} /> <span className="hidden md:inline">{t.agenda.addBlock}</span>
        </button>
      </div>
      
      <div className="relative ml-4 md:ml-6 space-y-8">
        {items.length === 0 && (
            <div className="ml-8 text-gray-500 italic">{t.agenda.empty}</div>
        )}

        {items.map((item, index) => {
          const Icon = getIcon(item.type, item.isStream);
          const active = isBlockActive(item.startTime, item.endTime);
          const past = isBlockPast(item.endTime);
          const progress = getProgress(item.startTime, item.endTime);
          
          return (
            <div key={item.id} className={`relative pl-6 md:pl-12 group transition-all duration-500 ${past && !item.completed ? 'opacity-60 grayscale-[0.5]' : 'opacity-100'}`}>
              
              {/* --- HYDRAULIC TIMELINE --- */}
              {/* The "Pipe" background (Always visible to connect cards) */}
              <div className="absolute left-[7px] top-6 bottom-[-32px] w-0.5 bg-cyber-700/30 z-0 rounded-full"></div>
              
              {/* The "Fluid" fill (Dynamic) */}
              <div className="absolute left-[7px] top-6 bottom-[-32px] w-0.5 z-0 overflow-hidden rounded-full">
                  <div 
                      className={`w-full transition-all duration-1000 ease-linear ${
                          item.isStream ? 'bg-pink-500 shadow-[0_0_5px_#ec4899]' :
                          item.completed || past ? 'bg-cyber-green shadow-[0_0_5px_#10b981]' : 
                          active ? 'bg-cyber-cyan shadow-[0_0_5px_#06b6d4]' : 'bg-transparent'
                      }`}
                      style={{ height: `${past || item.completed ? 100 : active ? progress : 0}%` }}
                  ></div>
              </div>

              {/* Timeline Dot */}
              <div className={`absolute -left-[9px] top-6 w-4 h-4 rounded-full border-2 transition-all z-10 
                  ${active ? 'bg-cyber-cyan border-cyber-cyan animate-pulse shadow-[0_0_10px_#06b6d4]' : 
                    item.isStream ? 'bg-pink-500 border-pink-500' :
                    item.completed ? 'bg-cyber-green border-cyber-green' : 'bg-cyber-900 border-gray-600'}`}>
              </div>

              {/* ACTIVE INDICATOR LABEL (Mobile) */}
              {active && (
                  <div className="absolute -top-4 left-6 md:left-12 bg-cyber-cyan text-black text-[10px] font-bold px-2 py-0.5 rounded-t animate-bounce z-20 shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                      {t.agenda.nowActive}
                  </div>
              )}
              
              <div className={`rounded-xl border relative overflow-hidden transition-all duration-300 ${getCardStyles(item.type, item.completed, active, item.isStream)}`}>
                
                {/* Mobile Optimized Layout: Header (Time) -> Body (Content) -> Footer (Actions) */}
                <div className="p-4">
                    
                    {/* Header: Icon + Time */}
                    <div className="flex justify-between items-start mb-3">
                         <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${active ? 'bg-cyber-cyan text-black' : item.isStream ? 'bg-pink-500 text-white' : item.completed ? 'bg-cyber-green/20 text-cyber-green' : 'bg-cyber-900 text-gray-400'}`}>
                                <Icon size={20} />
                            </div>
                            <div className="flex flex-col">
                                <span className={`font-mono font-bold text-lg leading-none ${active ? 'text-cyber-cyan' : item.isStream ? 'text-pink-400' : 'text-gray-300'}`}>
                                    {item.startTime}
                                </span>
                                <span className="text-xs text-gray-500 font-mono">
                                    to {item.endTime}
                                </span>
                            </div>
                         </div>
                         
                         <div className="text-right">
                             <span className="text-xs font-mono font-bold text-cyber-cyan bg-cyber-900/50 px-2 py-1 rounded border border-cyber-700/50">
                                +{item.xpReward} XP
                             </span>
                         </div>
                    </div>

                    {/* Body: Title & Desc */}
                    <div className="mb-4">
                        <h3 className={`font-display font-bold text-lg mb-1 ${item.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                            {item.title}
                        </h3>
                        <p className="text-sm text-gray-400 leading-snug">{item.desc}</p>
                    </div>

                    {/* Footer: Actions Row */}
                    <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                        {/* Focus Button - Prominent if Active */}
                        {!item.completed && (
                            <button 
                                onClick={() => setActiveFocusItem(item)}
                                className={`flex-1 py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all
                                    ${active 
                                        ? 'bg-yellow-500 text-black hover:bg-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.2)]' 
                                        : 'bg-transparent border border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10'
                                    }`}
                            >
                                {active ? <Play size={14} fill="black" /> : <Zap size={14} />}
                                {t.agenda.startTimer}
                            </button>
                        )}

                        {/* Complete Button - Main Action */}
                        <button 
                            onClick={() => toggleComplete(item.id)}
                            className={`flex-[2] py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all 
                                ${item.completed 
                                    ? 'bg-cyber-green/20 text-cyber-green border border-cyber-green/50' 
                                    : 'bg-cyber-900 border border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan hover:text-black'}`}
                        >
                            {item.completed ? <CheckCircle size={16} /> : <Circle size={16} />}
                            {item.completed ? 'DONE' : 'COMPLETE'}
                        </button>

                        {/* Delete - Small & Subtle */}
                        <button 
                            onClick={() => deleteItem(item.id)}
                            className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-cyber-900 border border-cyber-700 rounded-xl w-full max-w-md p-6 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-display text-white mb-4">{t.agenda.modal.title}</h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-gray-500 uppercase">{t.agenda.modal.name}</label>
                        <input 
                            type="text" 
                            className="w-full bg-cyber-800 border border-cyber-700 rounded p-2 text-white outline-none focus:border-cyber-cyan"
                            value={newItem.title}
                            onChange={e => setNewItem({...newItem, title: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 uppercase">{t.agenda.modal.desc}</label>
                        <input 
                            type="text" 
                            className="w-full bg-cyber-800 border border-cyber-700 rounded p-2 text-white outline-none focus:border-cyber-cyan"
                            value={newItem.desc}
                            onChange={e => setNewItem({...newItem, desc: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-gray-500 uppercase">{t.agenda.modal.start}</label>
                            <input 
                                type="time" 
                                className="w-full bg-cyber-800 border border-cyber-700 rounded p-2 text-white outline-none focus:border-cyber-cyan"
                                value={newItem.startTime}
                                onChange={e => setNewItem({...newItem, startTime: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 uppercase">{t.agenda.modal.end}</label>
                            <input 
                                type="time" 
                                className="w-full bg-cyber-800 border border-cyber-700 rounded p-2 text-white outline-none focus:border-cyber-cyan"
                                value={newItem.endTime}
                                onChange={e => setNewItem({...newItem, endTime: e.target.value})}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 uppercase">{t.agenda.modal.type}</label>
                        <select 
                            className="w-full bg-cyber-800 border border-cyber-700 rounded p-2 text-white outline-none focus:border-cyber-cyan"
                            value={newItem.type}
                            // @ts-ignore
                            onChange={e => setNewItem({...newItem, type: e.target.value})}
                        >
                            <option value="work">{t.agenda.types.work}</option>
                            <option value="creative">{t.agenda.types.creative}</option>
                            <option value="learning">{t.agenda.types.learning}</option>
                            <option value="base">{t.agenda.types.base}</option>
                            <option value="transit">{t.agenda.types.transit}</option>
                            <option value="sleep">{t.agenda.types.sleep}</option>
                        </select>
                    </div>

                    {/* NEW: IS STREAM CHECKBOX */}
                    <div className="flex items-center gap-3 bg-cyber-800 p-3 rounded border border-pink-500/30">
                        <input 
                            type="checkbox"
                            id="isStream"
                            className="w-5 h-5 accent-pink-500 cursor-pointer"
                            checked={newItem.isStream}
                            onChange={e => setNewItem({...newItem, isStream: e.target.checked})}
                        />
                        <label htmlFor="isStream" className="text-pink-400 font-bold text-sm cursor-pointer select-none flex items-center gap-2">
                            {t.agenda.modal.isStream} <Radio size={16} />
                        </label>
                    </div>

                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button 
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 rounded text-gray-400 hover:text-white"
                    >
                        {t.agenda.modal.cancel}
                    </button>
                    <button 
                        onClick={addNewItem}
                        className="bg-cyber-cyan text-black px-6 py-2 rounded font-bold hover:bg-white transition-colors"
                    >
                        {t.agenda.modal.save}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Agenda;
