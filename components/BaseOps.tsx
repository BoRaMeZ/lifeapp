
import React, { useState, useEffect } from 'react';
import { DailyTask, Language } from '../types';
import { Home, CheckCircle, Circle, Plus, Trash2, X, ChevronUp, ChevronDown } from 'lucide-react';
import { getTranslation } from '../utils/translations';

interface BaseOpsProps {
  onGainXP: (amount: number) => void;
  lang: Language;
  tasks: DailyTask[];
  setTasks: React.Dispatch<React.SetStateAction<DailyTask[]>>;
}

const BaseOps: React.FC<BaseOpsProps> = ({ onGainXP, lang, tasks, setTasks }) => {
  const t = getTranslation(lang);
  const [resetMessage, setResetMessage] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
      title: '',
      category: 'home' as 'home' | 'health' | 'admin',
      xp: 15
  });

  // Display reset message if needed
  useEffect(() => {
     // Check if last modified date is today is handled in App.tsx now
     // We can just show animation on mount if we want, or remove this logic
  }, []);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        if (t.completed) {
            onGainXP(-t.xp);
        } else {
            onGainXP(t.xp);
        }
        return { ...t, completed: !t.completed };
      }
      return t;
    }));
  };

  const addTask = () => {
    if(!newTask.title.trim()) return;

    const task: DailyTask = {
        id: Date.now().toString(),
        title: newTask.title,
        xp: Number(newTask.xp),
        category: newTask.category,
        completed: false,
        translationKey: '' 
    };

    setTasks(prev => [...prev, task]);
    setIsModalOpen(false);
    setNewTask({ title: '', category: 'home', xp: 15 });
  };

  const deleteTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const taskToDelete = tasks.find(t => t.id === id);
    
    if(confirm("Delete this routine task?")) {
        if(taskToDelete && taskToDelete.completed) {
            onGainXP(-taskToDelete.xp);
        }
        setTasks(prev => prev.filter(t => t.id !== id));
    }
  };

  const moveTask = (index: number, direction: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    const newTasks = [...tasks];
    
    if (direction === 'up') {
        if (index === 0) return;
        [newTasks[index - 1], newTasks[index]] = [newTasks[index], newTasks[index - 1]];
    } else {
        if (index === newTasks.length - 1) return;
        [newTasks[index + 1], newTasks[index]] = [newTasks[index], newTasks[index + 1]];
    }
    setTasks(newTasks);
  };

  const getTaskTitle = (task: DailyTask) => {
    // @ts-ignore
    return (task.translationKey && t.baseOps.tasks[task.translationKey]) ? t.baseOps.tasks[task.translationKey] : task.title;
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <div className="bg-cyber-800/50 p-6 rounded-2xl border border-cyber-700 mb-8 backdrop-blur-sm relative overflow-hidden">
        {resetMessage && (
            <div className="absolute top-0 left-0 w-full bg-cyber-purple/90 text-white text-xs text-center py-1 animate-fade-in">
                {t.baseOps.resetMsg}
            </div>
        )}
        <div className="flex items-center justify-between mb-4 mt-2">
            <h2 className="text-2xl font-display text-white flex items-center gap-2">
                <Home className="text-cyber-green" /> {t.baseOps.title}
            </h2>
            <div className="text-right">
                <div className="text-sm text-gray-400">{t.baseOps.subtitle}</div>
                <div className="font-mono text-cyber-green font-bold">{completedCount} / {tasks.length}</div>
            </div>
        </div>
        
        <div className="h-4 bg-cyber-900 rounded-full overflow-hidden border border-cyber-900 shadow-inner">
            <div 
                className="h-full bg-gradient-to-r from-cyber-green to-emerald-400 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
        <div className="flex justify-between items-end mt-4">
             <p className="text-xs text-gray-500">
                {t.baseOps.burnoutWarning}
             </p>
             <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-cyber-green/10 text-cyber-green border border-cyber-green/50 hover:bg-cyber-green hover:text-black px-3 py-1.5 rounded-lg transition-all text-xs font-bold"
             >
                <Plus size={14} /> {t.baseOps.add}
             </button>
        </div>
      </div>

      <div className="space-y-3">
        {tasks.map((task, index) => (
            <div 
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`
                    group flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-200 relative
                    ${task.completed 
                        ? 'bg-cyber-green/5 border-cyber-green/30 opacity-60' 
                        : 'bg-cyber-800 border-cyber-700 hover:border-cyber-cyan/50 hover:bg-cyber-800/80'}
                `}
            >
                <div className="flex items-center gap-4 flex-1">
                    <div className="flex flex-col gap-1 pr-2 border-r border-white/5">
                        <button 
                            onClick={(e) => moveTask(index, 'up', e)}
                            className={`p-0.5 rounded hover:bg-cyber-cyan hover:text-black transition-colors ${index === 0 ? 'text-gray-700 cursor-default hover:bg-transparent hover:text-gray-700' : 'text-gray-500'}`}
                            disabled={index === 0}
                        >
                            <ChevronUp size={14} />
                        </button>
                        <button 
                            onClick={(e) => moveTask(index, 'down', e)}
                            className={`p-0.5 rounded hover:bg-cyber-cyan hover:text-black transition-colors ${index === tasks.length - 1 ? 'text-gray-700 cursor-default hover:bg-transparent hover:text-gray-700' : 'text-gray-500'}`}
                            disabled={index === tasks.length - 1}
                        >
                            <ChevronDown size={14} />
                        </button>
                    </div>

                    <div className={`transition-colors duration-300 ${task.completed ? 'text-cyber-green' : 'text-gray-600 group-hover:text-cyber-cyan'}`}>
                        {task.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
                    </div>
                    <div>
                        <h4 className={`font-medium transition-all ${task.completed ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                            {getTaskTitle(task)}
                        </h4>
                        <span className="text-xs text-gray-500 uppercase tracking-wider">{task.category}</span>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="text-xs font-bold font-mono bg-cyber-900 px-2 py-1 rounded text-cyber-cyan">
                        +{task.xp} XP
                    </div>
                    <button 
                        onClick={(e) => deleteTask(task.id, e)}
                        className="p-2 text-gray-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-cyber-900 border border-cyber-700 rounded-xl w-full max-w-md p-6 shadow-2xl animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-display text-white">{t.baseOps.modal.title}</h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X size={20}/></button>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-gray-500 uppercase">{t.baseOps.modal.name}</label>
                        <input 
                            type="text" 
                            className="w-full bg-cyber-800 border border-cyber-700 rounded p-2 text-white outline-none focus:border-cyber-cyan"
                            value={newTask.title}
                            onChange={e => setNewTask({...newTask, title: e.target.value})}
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-gray-500 uppercase">{t.baseOps.modal.category}</label>
                            <select 
                                className="w-full bg-cyber-800 border border-cyber-700 rounded p-2 text-white outline-none focus:border-cyber-cyan"
                                value={newTask.category}
                                // @ts-ignore
                                onChange={e => setNewTask({...newTask, category: e.target.value})}
                            >
                                <option value="home">Home</option>
                                <option value="health">Health</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 uppercase">{t.baseOps.modal.xp}</label>
                            <input 
                                type="number" 
                                className="w-full bg-cyber-800 border border-cyber-700 rounded p-2 text-white outline-none focus:border-cyber-cyan"
                                value={newTask.xp}
                                onChange={e => setNewTask({...newTask, xp: parseInt(e.target.value) || 0})}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button 
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 rounded text-gray-400 hover:text-white"
                    >
                        {t.baseOps.modal.cancel}
                    </button>
                    <button 
                        onClick={addTask}
                        className="bg-cyber-green text-black px-6 py-2 rounded font-bold hover:bg-white transition-colors"
                    >
                        {t.baseOps.modal.save}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default BaseOps;
