
import React, { useState } from 'react';
import { Clock, Briefcase, Video, Moon, Coffee, Plus, Trash2, CheckCircle, Circle, Brain, Zap } from 'lucide-react';
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

  // Form State
  const [newItem, setNewItem] = useState<{
    title: string;
    desc: string;
    startTime: string;
    endTime: string;
    type: AgendaItem['type'];
  }>({
    title: '',
    desc: '',
    startTime: '09:00',
    endTime: '10:00',
    type: 'work'
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

    const item: AgendaItem = {
        id: Date.now().toString(),
        ...newItem,
        completed: false,
        xpReward: xp
    };

    setItems(prev => [...prev, item].sort((a, b) => a.startTime.localeCompare(b.startTime)));
    setIsModalOpen(false);
    setNewItem({ title: '', desc: '', startTime: '09:00', endTime: '10:00', type: 'work' });
  };

  const handleFocusComplete = () => {
      if (activeFocusItem) {
          onGainXP(25); // Bonus XP
          toggleComplete(activeFocusItem.id);
          setActiveFocusItem(null);
      }
  };

  const getIcon = (type: string) => {
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

  const getColors = (type: string, completed: boolean) => {
    if (completed) return 'border-cyber-green/50 bg-cyber-green/10 text-gray-400';
    
    switch(type) {
        case 'creative': return 'border-cyber-purple bg-cyber-purple/10 text-white';
        case 'learning': return 'border-cyber-cyan bg-cyber-cyan/10 text-white';
        case 'base': return 'border-cyber-green bg-cyber-green/10 text-white';
        case 'work': return 'border-gray-700 bg-gray-900/50 text-gray-500';
        default: return 'border-gray-700 bg-cyber-800 text-gray-400';
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-20">
      
      {/* Focus Mode Overlay */}
      {activeFocusItem && (
          <FocusMode 
            item={activeFocusItem} 
            lang={lang} 
            onComplete={handleFocusComplete}
            onCancel={() => setActiveFocusItem(null)}
          />
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-display text-white flex items-center gap-2">
            <Clock className="text-cyber-cyan" /> {t.agenda.title}
        </h2>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan px-3 py-1.5 rounded-lg hover:bg-cyber-cyan hover:text-black transition-all font-bold text-sm"
        >
            <Plus size={16} /> {t.agenda.addBlock}
        </button>
      </div>
      
      <div className="relative border-l-2 border-cyber-700 ml-4 md:ml-6 space-y-6">
        {items.length === 0 && (
            <div className="ml-8 text-gray-500 italic">{t.agenda.empty}</div>
        )}

        {items.map((item) => {
          const Icon = getIcon(item.type);
          return (
            <div key={item.id} className="relative pl-8 md:pl-12 group">
              <div className={`absolute -left-[9px] top-6 w-4 h-4 rounded-full border-2 transition-colors ${item.completed ? 'bg-cyber-green border-cyber-green' : 'bg-cyber-900 border-gray-600'}`}></div>
              
              <div className={`p-4 rounded-xl border relative ${getColors(item.type, item.completed)} transition-all duration-300`}>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-2">
                    <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg mt-1 ${item.completed ? 'bg-cyber-green/20 text-cyber-green' : 'bg-cyber-900'}`}>
                            <Icon size={18} />
                        </div>
                        <div>
                             <h3 className={`font-display font-bold text-lg ${item.completed ? 'line-through opacity-50' : ''}`}>{item.title}</h3>
                             <p className="text-sm opacity-70 leading-snug max-w-md">{item.desc}</p>
                        </div>
                    </div>
                    <div className="flex flex-row md:flex-col items-center md:items-end gap-2 pl-12 md:pl-0">
                         <span className="font-mono text-sm opacity-80 bg-black/30 px-2 py-1 rounded border border-white/5">
                            {item.startTime} - {item.endTime}
                        </span>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-3 ml-11 border-t border-white/5 pt-2">
                    <span className="text-xs font-mono font-bold text-cyber-cyan/70">+{item.xpReward} XP</span>
                    
                    <div className="flex gap-2">
                        {/* FOCUS BUTTON */}
                        {!item.completed && (
                            <button 
                                onClick={() => setActiveFocusItem(item)}
                                className="flex items-center gap-1 px-3 py-1 rounded text-xs font-bold border border-yellow-500/50 text-yellow-500 hover:bg-yellow-500 hover:text-black transition-all"
                            >
                                <Zap size={12} /> {t.agenda.startTimer}
                            </button>
                        )}

                        <button 
                            onClick={() => deleteItem(item.id)}
                            className="p-1.5 text-gray-600 hover:text-red-500 transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>
                        <button 
                            onClick={() => toggleComplete(item.id)}
                            className={`flex items-center gap-2 px-3 py-1 rounded text-sm font-bold transition-all ${item.completed ? 'bg-cyber-green text-black' : 'bg-cyber-900 border border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan hover:text-black'}`}
                        >
                            {item.completed ? <CheckCircle size={14}/> : <Circle size={14}/>}
                            {item.completed ? 'DONE' : 'COMPLETE'}
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
            <div className="bg-cyber-900 border border-cyber-700 rounded-xl w-full max-w-md p-6 shadow-2xl animate-fade-in">
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
