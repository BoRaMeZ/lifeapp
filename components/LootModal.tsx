
import React, { useState } from 'react';
import { LootChallenge, Language } from '../types';
import { generateLootChallenge } from '../services/geminiService';
import { Dices, Sparkles, X, Check } from 'lucide-react';
import { getTranslation } from '../utils/translations';

interface LootModalProps {
  lang: Language;
  onClose: () => void;
  onAccept: (xp: number) => void;
}

const LootModal: React.FC<LootModalProps> = ({ lang, onClose, onAccept }) => {
  const t = getTranslation(lang);
  const [challenge, setChallenge] = useState<LootChallenge | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [context, setContext] = useState('');

  const handleOpen = async () => {
      setIsOpening(true);
      setIsLoading(true);
      // Animation delay
      setTimeout(async () => {
          const loot = await generateLootChallenge(lang, context);
          setChallenge(loot);
          setIsLoading(false);
          setIsOpening(false);
      }, 2000);
  };

  const getRarityColor = (r?: string) => {
      if (r === 'legendary') return 'text-yellow-400 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.5)]';
      if (r === 'rare') return 'text-pink-400 border-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.5)]';
      return 'text-cyber-cyan border-cyber-cyan shadow-[0_0_20px_rgba(6,182,212,0.5)]';
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[70] flex items-center justify-center p-4 animate-fade-in">
        <div className="max-w-md w-full relative">
            
            {/* Close Button */}
            {!isOpening && (
                <button onClick={onClose} className="absolute -top-12 right-0 text-gray-400 hover:text-white">
                    <X size={24} />
                </button>
            )}

            {!challenge ? (
                // CRATE STATE
                <div className="flex flex-col items-center justify-center text-center">
                    <div className={`relative w-48 h-48 bg-cyber-900 border-2 border-cyber-cyan flex items-center justify-center rounded-2xl cursor-pointer hover:scale-105 transition-transform group ${isOpening ? 'animate-bounce' : ''}`} onClick={handleOpen}>
                        <div className="absolute inset-0 bg-cyber-cyan/10 blur-xl group-hover:bg-cyber-cyan/30 transition-all"></div>
                        {isOpening ? (
                            <Sparkles size={64} className="text-cyber-cyan animate-spin" />
                        ) : (
                            <Dices size={64} className="text-cyber-cyan group-hover:rotate-12 transition-transform" />
                        )}
                    </div>
                    <h2 className="text-2xl font-display font-bold text-white mt-8 mb-2 tracking-widest">{t.loot.title}</h2>
                    <p className="text-gray-400 text-sm mb-6">{t.loot.desc}</p>
                    
                    {/* Context Input */}
                    <input 
                        type="text" 
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                        placeholder={t.loot.contextPlaceholder}
                        className="w-full bg-cyber-800 border border-cyber-700 rounded p-3 text-white mb-6 focus:border-cyber-cyan outline-none text-center"
                        disabled={isOpening}
                    />

                    <button 
                        onClick={handleOpen}
                        disabled={isOpening}
                        className="bg-cyber-cyan text-black px-8 py-3 rounded-full font-bold hover:bg-white transition-colors disabled:opacity-50"
                    >
                        {isOpening ? 'UNLOCKING...' : t.loot.open}
                    </button>
                </div>
            ) : (
                // REVEAL STATE
                <div className={`bg-cyber-900 border-2 rounded-2xl p-8 text-center animate-fade-in relative overflow-hidden ${getRarityColor(challenge.rarity)}`}>
                    <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-white/10 to-transparent h-20"></div>
                    
                    <div className="uppercase font-mono text-xs font-bold tracking-[0.3em] mb-4 opacity-80">
                        {challenge.rarity}
                    </div>

                    <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4 leading-tight">
                        {challenge.title}
                    </h2>

                    <p className="text-gray-300 mb-8 leading-relaxed">
                        {challenge.description}
                    </p>

                    <div className="bg-cyber-900/50 rounded-lg py-2 px-4 mb-8 inline-block border border-white/10">
                        <span className="font-mono text-xl font-bold text-cyber-green">+{challenge.xpReward} XP</span>
                    </div>

                    <div className="flex gap-3">
                        <button 
                            onClick={handleOpen}
                            className="flex-1 py-3 rounded-lg border border-gray-600 text-gray-400 hover:text-white hover:border-white transition-colors font-bold text-sm"
                        >
                            {t.loot.reroll}
                        </button>
                        <button 
                            onClick={() => { onAccept(challenge.xpReward); onClose(); }}
                            className="flex-[2] py-3 rounded-lg bg-cyber-green text-black font-bold hover:bg-white transition-colors flex items-center justify-center gap-2"
                        >
                            <Check size={18} /> {t.loot.accept}
                        </button>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default LootModal;
