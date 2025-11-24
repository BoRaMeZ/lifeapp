
import React, { useEffect, useState } from 'react';
import { Trophy, Star, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../utils/translations';

interface LevelUpModalProps {
  newLevel: number;
  lang: Language;
  onClose: () => void;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ newLevel, lang, onClose }) => {
  const t = getTranslation(lang);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
       <div className={`relative flex flex-col items-center transform transition-all duration-700 ${isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-50 opacity-0 translate-y-10'}`}>
          
          {/* Animated Background Glow */}
          <div className="absolute inset-0 bg-cyber-purple/20 blur-[100px] rounded-full animate-pulse"></div>

          {/* Icon */}
          <div className="relative mb-6">
             <Star className="text-yellow-400 animate-[spin_10s_linear_infinite]" size={120} strokeWidth={0.5} />
             <Trophy className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-cyber-cyan drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]" size={60} fill="#06b6d4" />
          </div>

          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-2 text-center tracking-tighter drop-shadow-xl bg-clip-text text-transparent bg-gradient-to-r from-cyber-cyan via-white to-cyber-purple">
            {t.levelUp.congrats}
          </h2>

          <p className="text-cyber-cyan/80 text-lg md:text-xl font-mono mb-8 uppercase tracking-widest">
            {t.levelUp.reached} <span className="text-white font-bold text-2xl">{newLevel}</span>
          </p>

          <button 
            onClick={onClose}
            className="group relative px-8 py-3 bg-transparent overflow-hidden rounded-full"
          >
             <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple opacity-80 group-hover:opacity-100 transition-opacity"></div>
             <div className="relative flex items-center gap-2 text-black font-bold font-display tracking-wide">
                <Sparkles size={18} /> {t.levelUp.continue}
             </div>
          </button>
       </div>
    </div>
  );
};

export default LevelUpModal;
