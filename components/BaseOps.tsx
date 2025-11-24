
import React, { useState, useEffect } from 'react';
import { DailyTask, Language } from '../types';
import { Home, CheckCircle, Circle, RefreshCw } from 'lucide-react';
import { getTranslation } from '../utils/translations';

interface BaseOpsProps {
  onGainXP: (amount: number) => void;
  lang: Language;
}

const DEFAULT_TASKS: DailyTask[] = [
    { id: 't1', title: 'Dishes Cleared', translationKey: 't1', xp: 25, completed: false, category: 'home' },
    { id: 't2', title: 'Backpack Packed', translationKey: 't2', xp: 20, completed: false, category: 'admin' },
    { id: 't3', title: 'Outfit Laid Out', translationKey: 't3', xp: 15, completed: false, category: 'admin' },
    { id: 't4', title: 'Drink Water', translationKey: 't4', xp: 10, completed: false, category: 'health' },
    { id: 't5', title: 'Desk Wipe', translationKey: 't5', xp: 30, completed: false, category: 'home' },
];

const BaseOps: React.FC<BaseOpsProps> = ({ onGainXP, lang }) => {
  const t = getTranslation(lang);
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [resetMessage, setResetMessage] = useState(false);

  // Load daily tasks
  useEffect(() => {
      const savedTasks = localStorage.getItem('streamos_tasks');
      const lastTaskDate = localStorage.getItem('streamos_tasks_date');
      const today = new Date().toDateString();

      if (savedTasks && lastTaskDate === today) {
          setTasks(JSON.parse(savedTasks));
      } else {
          // Reset for new day
          setTasks(DEFAULT_TASKS);
          localStorage.setItem('streamos_tasks_date', today);
          if (lastTaskDate && lastTaskDate !== today) {
              setResetMessage(true);
              setTimeout(() => setResetMessage(false), 5000);
          }
      }
  }, []);

  // Save on change
  useEffect(() => {
      if (tasks.length > 0) {
        localStorage.setItem('streamos_tasks', JSON.stringify(tasks));
      }
  }, [tasks]);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        if (t.completed) {
            // Unchecking -> Remove XP
            onGainXP(-t.xp);
        } else {
            // Checking -> Add XP
            onGainXP(t.xp);
        }
        return { ...t, completed: !t.completed };
      }
      return t;
    }));
  };

  const getTaskTitle = (task: DailyTask) => {
    // @ts-ignore
    return t.baseOps.tasks[task.translationKey] || task.title;
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <div className="max-w-2xl mx-auto">
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
        
        {/* Progress Bar */}
        <div className="h-4 bg-cyber-900 rounded-full overflow-hidden border border-cyber-900 shadow-inner">
            <div 
                className="h-full bg-gradient-to-r from-cyber-green to-emerald-400 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
        <p className="text-center text-xs text-gray-500 mt-2">
            {t.baseOps.burnoutWarning}
        </p>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
            <div 
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`
                    group flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200
                    ${task.completed 
                        ? 'bg-cyber-green/5 border-cyber-green/30 opacity-60' 
                        : 'bg-cyber-800 border-cyber-700 hover:border-cyber-cyan/50 hover:bg-cyber-800/80'}
                `}
            >
                <div className="flex items-center gap-4">
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
                
                <div className="text-xs font-bold font-mono bg-cyber-900 px-2 py-1 rounded text-cyber-cyan">
                    +{task.xp} XP
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default BaseOps;
