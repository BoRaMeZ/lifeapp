
import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, CheckCircle, Clock } from 'lucide-react';
import { AgendaItem, Language } from '../types';
import { getTranslation } from '../utils/translations';

interface FocusModeProps {
  item: AgendaItem;
  lang: Language;
  onComplete: () => void;
  onCancel: () => void;
}

const FocusMode: React.FC<FocusModeProps> = ({ item, lang, onComplete, onCancel }) => {
  const t = getTranslation(lang);
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Calculate duration from agenda item strings (e.g. "09:00" to "09:45")
  useEffect(() => {
    try {
        const start = new Date(`2000-01-01T${item.startTime}`);
        const end = new Date(`2000-01-01T${item.endTime}`);
        let diffMs = end.getTime() - start.getTime();
        if (diffMs < 0) diffMs = 30 * 60 * 1000; // Fallback 30 min if invalid
        setTimeLeft(Math.floor(diffMs / 1000));
    } catch (e) {
        setTimeLeft(1500); // 25 min fallback
    }
  }, [item]);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsFinished(true);
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 animate-fade-in">
      {/* Background Pulse */}
      <div className={`absolute inset-0 bg-cyber-cyan/5 transition-all duration-1000 ${isActive ? 'animate-pulse-slow' : ''}`}></div>
      
      <div className="relative z-10 text-center max-w-2xl w-full">
        <h2 className="text-cyber-cyan font-mono tracking-widest text-sm mb-4 animate-pulse">
            {t.focus.title} // SYSTEM LOCKED
        </h2>
        
        <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-8">{item.title}</h1>
        
        {/* Timer Display */}
        <div className="mb-12 font-mono text-[80px] md:text-[150px] leading-none text-white tracking-tighter">
            {formatTime(timeLeft)}
        </div>

        {/* Controls */}
        {!isFinished ? (
            <div className="flex justify-center gap-6">
                <button 
                    onClick={onCancel}
                    className="p-6 rounded-full border border-gray-700 text-gray-500 hover:border-red-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                    title={t.focus.stop}
                >
                    <Square size={32} />
                </button>
                
                <button 
                    onClick={toggleTimer}
                    className={`p-6 rounded-full border-2 transition-all transform hover:scale-105 ${
                        isActive 
                            ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10' 
                            : 'border-cyber-cyan text-cyber-cyan bg-cyber-cyan/10'
                    }`}
                >
                    {isActive ? <Pause size={48} /> : <Play size={48} className="ml-2" />}
                </button>
            </div>
        ) : (
            <div className="animate-fade-in">
                <div className="text-cyber-green text-2xl font-bold mb-4 flex items-center justify-center gap-2">
                    <CheckCircle size={32} /> {t.focus.complete}
                </div>
                <div className="text-gray-400 mb-8 font-mono">
                    {t.focus.bonus}: +25 XP
                </div>
                <button 
                    onClick={onComplete}
                    className="bg-cyber-green text-black px-8 py-3 rounded-full font-bold text-xl hover:bg-white transition-colors"
                >
                    {t.levelUp.continue}
                </button>
            </div>
        )}

        <div className="mt-12 text-gray-600 text-sm font-mono">
            {isActive ? t.focus.locked : t.focus.ready}
        </div>
      </div>
    </div>
  );
};

export default FocusMode;
