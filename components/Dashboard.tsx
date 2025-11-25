
import React, { useMemo, useState } from 'react';
import { PlayerStats, Language, UserProfile, AgendaItem, DailyTask } from '../types';
import { Activity, Zap, Trophy, Settings, Radio, Crosshair, Cpu, Box, Target, Brain, Heart, User, Headphones, Dices } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { getTranslation } from '../utils/translations';
import { generateBriefing } from '../services/geminiService';

interface DashboardProps {
  stats: PlayerStats;
  lang: Language;
  badges: {id: string, unlocked: boolean}[];
  userProfile: UserProfile;
  agenda: AgendaItem[];
  tasks: DailyTask[];
  onOpenSettings: () => void;
  onStartStream: () => void;
  onOpenLoot: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, lang, badges, userProfile, agenda, tasks, onOpenSettings, onStartStream, onOpenLoot }) => {
  const t = getTranslation(lang);
  const xpProgress = Math.min(100, (stats.currentXP / stats.nextLevelXP) * 100);
  const [isPlayingBriefing, setIsPlayingBriefing] = useState(false);

  // --- VOICE BRIEFING LOGIC ---
  const handleBriefing = async () => {
    if (isPlayingBriefing) {
        window.speechSynthesis.cancel();
        setIsPlayingBriefing(false);
        return;
    }

    setIsPlayingBriefing(true);
    const text = await generateBriefing(agenda, stats, lang);
    
    const utterance = new SpeechSynthesisUtterance(text);
    // Try to find a good voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith(lang) && v.name.includes('Google'));
    if (preferredVoice) utterance.voice = preferredVoice;
    
    utterance.onend = () => setIsPlayingBriefing(false);
    window.speechSynthesis.speak(utterance);
  };


  // --- ACTIVE QUEST LOGIC ---
  const getActiveQuest = () => {
      const now = new Date();
      const mins = now.getHours() * 60 + now.getMinutes();
      
      // 1. Is there an Active Agenda Block?
      const activeBlock = agenda.find(i => {
          const [sH, sM] = i.startTime.split(':').map(Number);
          const [eH, eM] = i.endTime.split(':').map(Number);
          const start = sH * 60 + sM;
          const end = eH * 60 + eM;
          return mins >= start && mins < end && !i.completed;
      });

      if (activeBlock) {
          // INTELLIGENT DETECTION: Check explicitly for isStream property
          if (activeBlock.isStream) {
              return { type: 'stream', title: t.dashboard.goLive, desc: activeBlock.title.toUpperCase() };
          }
          
          return { type: 'agenda', title: activeBlock.title, desc: activeBlock.type.toUpperCase() };
      }

      // 1.5 CHECK FOR UPCOMING STREAMS (30 MIN PRE-ROLL)
      const upcomingStream = agenda.find(i => {
          const [sH, sM] = i.startTime.split(':').map(Number);
          const start = sH * 60 + sM;
          // Check if we are within 30 mins before start
          const isPreTime = mins >= (start - 30) && mins < start;
          if (!isPreTime) return false;

          return i.isStream;
      });

      if (upcomingStream) {
            const [sH, sM] = upcomingStream.startTime.split(':').map(Number);
            const start = sH * 60 + sM;
            const diff = start - mins;
            return { type: 'prep', title: t.dashboard.prepStream, desc: `${t.dashboard.startsIn} ${diff}m • ${upcomingStream.title.toUpperCase()}` };
      }

      // 2. Fallback: Is it Prime Time (> 9PM) and user hasn't scheduled anything?
      // Only show this if no other block is active
      if (mins > 21 * 60 && mins < 24 * 60) {
          return { type: 'stream', title: t.dashboard.goLive, desc: 'PRIME TIME' };
      }

      // 3. Priority Task?
      const incompleteTask = tasks.find(t => !t.completed);
      if (incompleteTask) return { type: 'task', title: incompleteTask.title, desc: 'BASE OPS' };

      return null;
  };

  const activeQuest = getActiveQuest();

  // --- RADAR CHART DATA ---
  const radarData = useMemo(() => {
      const completedTasks = tasks.filter(t => t.completed).length;
      const totalTasks = Math.max(1, tasks.length);
      
      const discipline = Math.round((completedTasks / totalTasks) * 100);
      const focus = Math.min(100, stats.streak * 10); 
      const vitality = Math.min(100, stats.level * 5 + 50); 
      const creativity = Math.min(100, 40 + (stats.currentXP % 100)); 
      const technique = Math.min(100, badges.filter(b => b.unlocked).length * 25);

      return [
          { subject: t.dashboard.attributes.creativity, A: creativity, fullMark: 100, key: 'creativity', icon: Brain },
          { subject: t.dashboard.attributes.discipline, A: discipline, fullMark: 100, key: 'discipline', icon: Target },
          { subject: t.dashboard.attributes.focus, A: focus, fullMark: 100, key: 'focus', icon: Crosshair },
          { subject: t.dashboard.attributes.vitality, A: vitality, fullMark: 100, key: 'vitality', icon: Heart },
          { subject: t.dashboard.attributes.technique, A: technique, fullMark: 100, key: 'technique', icon: Cpu },
      ];
  }, [stats, tasks, badges, t]);

  const getBadgeIcon = (id: string) => {
    if (id.includes('streak')) return '🔥';
    if (id.includes('level')) return '⭐';
    if (id.includes('xp')) return '🦾';
    return '🏆';
  };

  return (
    <div className="space-y-6 animate-fade-in pb-24">
      
      {/* --- ACTIVE QUEST BANNER (HUD Style) --- */}
      <div className="relative group">
          <div className={`absolute inset-0 blur-xl opacity-50 animate-pulse-slow ${activeQuest?.type === 'stream' ? 'bg-pink-500/30' : activeQuest?.type === 'prep' ? 'bg-yellow-500/30' : 'bg-cyber-cyan/20'}`}></div>
          <div className={`relative bg-cyber-900/80 border-y md:border p-4 md:rounded-lg flex items-center justify-between backdrop-blur-md overflow-hidden ${activeQuest?.type === 'stream' ? 'border-pink-500/50' : activeQuest?.type === 'prep' ? 'border-yellow-500/50' : 'border-cyber-cyan/50'}`}>
             <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.05),transparent)] w-[50%] skew-x-12 animate-[shimmer_3s_infinite] pointer-events-none"></div>

             <div className="flex items-center gap-4 z-10">
                 <div className={`p-3 rounded-md animate-pulse ${
                     activeQuest?.type === 'stream' ? 'bg-pink-500 text-white' : 
                     activeQuest?.type === 'prep' ? 'bg-yellow-500 text-black' : 
                     activeQuest ? 'bg-cyber-cyan text-black' : 'bg-cyber-800 text-gray-500'
                 }`}>
                    {activeQuest?.type === 'stream' || activeQuest?.type === 'prep' ? <Radio size={24} /> : <Crosshair size={24} />}
                 </div>
                 <div>
                     <div className="flex items-center gap-2">
                        <h3 className={`text-xs font-mono font-bold uppercase tracking-widest mb-0.5 ${
                             activeQuest?.type === 'stream' ? 'text-pink-500' : 
                             activeQuest?.type === 'prep' ? 'text-yellow-500' : 
                             'text-cyber-cyan'
                        }`}>
                            {activeQuest?.type === 'prep' ? t.dashboard.upcomingQuest : t.dashboard.activeQuest}
                        </h3>
                        {activeQuest && <div className={`h-1.5 w-1.5 rounded-full animate-ping ${activeQuest.type === 'stream' ? 'bg-pink-500' : activeQuest.type === 'prep' ? 'bg-yellow-500' : 'bg-cyber-cyan'}`}></div>}
                     </div>
                     <p className="font-display font-bold text-lg md:text-2xl text-white leading-none uppercase">
                        {activeQuest ? activeQuest.title : t.dashboard.noActiveQuest}
                     </p>
                     {activeQuest && <span className="text-[10px] font-mono text-gray-400 bg-cyber-900/50 px-1 rounded border border-cyber-700">{activeQuest.desc}</span>}
                 </div>
             </div>

             <div className="flex items-center gap-3 z-10">
                {/* OMNI-SENSES ACTIONS */}
                <button 
                    onClick={handleBriefing} 
                    className={`p-2 rounded-lg border transition-all ${isPlayingBriefing ? 'bg-cyber-cyan text-black border-cyber-cyan animate-pulse' : 'bg-cyber-800 text-gray-400 border-cyber-700 hover:text-white'}`}
                    title={t.dashboard.briefing}
                >
                    <Headphones size={20} />
                </button>
                <button 
                    onClick={onOpenLoot} 
                    className="p-2 rounded-lg border bg-cyber-800 text-cyber-purple border-cyber-700 hover:text-white hover:border-cyber-purple transition-all"
                    title={t.dashboard.loot}
                >
                    <Dices size={20} />
                </button>

                {(activeQuest?.type === 'stream' || activeQuest?.type === 'prep') && (
                    <button onClick={onStartStream} className={`ml-2 font-bold px-4 py-2 rounded-sm clip-path-polygon transition-all animate-bounce ${
                        activeQuest.type === 'stream' 
                            ? 'bg-pink-600 hover:bg-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.5)]' 
                            : 'bg-yellow-500 hover:bg-yellow-400 text-black shadow-[0_0_15px_rgba(234,179,8,0.5)]'
                    }`}>
                        {t.dashboard.goLive}
                    </button>
                )}
             </div>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* --- LEFT COLUMN: COMPACT OPERATOR ID & STATS (4 Cols) --- */}
        <div className="md:col-span-4 h-full">
            <div className="bg-cyber-800/50 border border-cyber-700 rounded-2xl p-0 overflow-hidden flex flex-col h-full">
                
                {/* 1. COMPACT ID HEADER */}
                <div className="bg-cyber-900/50 p-5 border-b border-cyber-700/50 flex items-center gap-4 relative">
                    {/* Settings Btn */}
                    <button onClick={onOpenSettings} className="absolute top-3 right-3 text-gray-600 hover:text-white transition-colors">
                        <Settings size={16} />
                    </button>

                    {/* Compact Avatar */}
                    <div className="relative w-20 h-20 shrink-0">
                        <div className="absolute inset-0 bg-cyber-cyan/20 blur-md rounded-lg"></div>
                        <div className="w-full h-full rounded-lg overflow-hidden border-2 border-cyber-cyan relative z-10 bg-cyber-900">
                            <img src={userProfile.avatar} alt="Avatar" className="w-full h-full object-cover"/>
                        </div>
                        {/* Status Light */}
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-cyber-900 rounded-full flex items-center justify-center z-20">
                            <div className="w-2.5 h-2.5 bg-cyber-green rounded-full animate-pulse"></div>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">
                            <User size={10} /> {t.dashboard.noviceStreamer}
                        </div>
                        <h2 className="text-xl font-display font-bold text-white uppercase truncate leading-none mb-2">
                            {userProfile.name}
                        </h2>
                        
                        {/* Compact XP Bar */}
                        <div className="flex items-center gap-2">
                            <span className="bg-cyber-purple text-black text-[10px] font-bold px-1.5 rounded">LVL {stats.level}</span>
                            <div className="flex-1 h-1.5 bg-cyber-900 rounded-full overflow-hidden border border-cyber-700">
                                <div 
                                    className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple"
                                    style={{ width: `${xpProgress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. RADAR & ATTRIBUTES */}
                <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-cyber-cyan text-xs font-mono tracking-widest opacity-70 mb-2">
                        <Activity size={14} />
                        DIAGNOSTICS
                    </div>

                    {/* Chart - Slightly smaller to fit compact view */}
                    <div className="h-[180px] w-full mb-6 -ml-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
                                <PolarGrid stroke="#1e293b" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 9, fontFamily: 'monospace' }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="Stats"
                                    dataKey="A"
                                    stroke="var(--color-primary)"
                                    strokeWidth={2}
                                    fill="var(--color-primary)"
                                    fillOpacity={0.2}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Stats List (Compact) */}
                    <div className="space-y-3 mt-auto">
                        {radarData.map((stat, index) => {
                            const Icon = stat.icon;
                            // @ts-ignore
                            const description = t.dashboard.attributeDesc[stat.key];
                            return (
                                <div key={index} className="group">
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <Icon size={12} className="text-gray-500 group-hover:text-cyber-cyan transition-colors" />
                                            <span className="text-[10px] font-bold font-display text-gray-300 group-hover:text-white transition-colors">{stat.subject}</span>
                                        </div>
                                        <span className="text-[10px] font-mono text-cyber-cyan">
                                            {stat.A}
                                        </span>
                                    </div>
                                    <div className="h-1.5 bg-cyber-900 rounded-full overflow-hidden border border-cyber-900">
                                        <div 
                                            className="h-full bg-cyber-700 group-hover:bg-cyber-cyan transition-all duration-500" 
                                            style={{ width: `${stat.A}%` }}
                                        ></div>
                                    </div>
                                    {/* Mobile/Compact Tooltip as subtle text below active item */}
                                    <div className="hidden group-hover:block text-[9px] text-gray-500 mt-0.5 animate-fade-in">
                                        {description}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>

        {/* --- RIGHT COLUMN: STATS & ACTIVITY (8 Cols) --- */}
        <div className="md:col-span-8 space-y-6">
            
            {/* STAT CARDS ROW */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                 <div className="bg-cyber-800/50 border border-cyber-700 p-4 rounded-xl relative overflow-hidden group">
                     <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-30 transition-opacity">
                         <Zap size={40} />
                     </div>
                     <div className="text-gray-400 text-[10px] font-mono uppercase tracking-wider mb-1">{t.dashboard.loginStreak}</div>
                     <div className="text-3xl font-display font-bold text-white group-hover:text-cyber-cyan transition-colors">{stats.streak}</div>
                     <div className="text-xs text-cyber-cyan/60">{t.dashboard.days} Sync</div>
                 </div>

                 <div className="bg-cyber-800/50 border border-cyber-700 p-4 rounded-xl relative overflow-hidden group">
                     <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-30 transition-opacity">
                         <Trophy size={40} />
                     </div>
                     <div className="text-gray-400 text-[10px] font-mono uppercase tracking-wider mb-1">XP Points</div>
                     <div className="text-3xl font-display font-bold text-white">{stats.currentXP}</div>
                     <div className="text-xs text-gray-500">/ {stats.nextLevelXP} Next Rank</div>
                 </div>

                 <div className="bg-cyber-800/50 border border-cyber-700 p-4 rounded-xl relative overflow-hidden group col-span-2 md:col-span-1">
                     <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-30 transition-opacity">
                         <Target size={40} />
                     </div>
                     <div className="text-gray-400 text-[10px] font-mono uppercase tracking-wider mb-1">Total Badges</div>
                     <div className="text-3xl font-display font-bold text-white">{badges.filter(b => b.unlocked).length}</div>
                     <div className="text-xs text-gray-500">/ {badges.length} Unlocked</div>
                 </div>
            </div>

            {/* BADGES GRID */}
            <div className="bg-cyber-800/50 border border-cyber-700 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 font-display">
                    <Box size={16} className="text-cyber-purple"/> {t.dashboard.badges}
                </h3>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                    {badges.map((badge) => (
                        <div 
                            key={badge.id} 
                            className={`aspect-square rounded-lg border flex flex-col items-center justify-center relative group transition-all cursor-help ${
                                badge.unlocked 
                                    ? 'bg-cyber-purple/10 border-cyber-purple/40 shadow-[0_0_10px_rgba(139,92,246,0.1)]' 
                                    : 'bg-cyber-900/50 border-cyber-800 opacity-40 grayscale'
                            }`}
                            title={getTranslation(lang).badges[badge.id]}
                        >
                            <div className="text-2xl mb-1 filter drop-shadow-md">
                                {badge.unlocked ? getBadgeIcon(badge.id) : '🔒'}
                            </div>
                            {badge.unlocked && (
                                <div className="absolute inset-0 bg-cyber-purple/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                            )}
                        </div>
                    ))}
                    {/* Empty Slots Filler */}
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="aspect-square rounded-lg border border-cyber-800 bg-cyber-900/30 flex items-center justify-center opacity-20">
                            <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ACTIVITY HEATMAP */}
            <div className="bg-cyber-800/50 border border-cyber-700 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                     <h3 className="text-sm font-bold text-white flex items-center gap-2 font-display">
                        <Cpu size={16} className="text-cyber-green"/> {t.dashboard.heatmap}
                     </h3>
                     <span className="text-[10px] font-mono text-gray-500">LAST 30 CYCLES</span>
                </div>
                
                <div className="flex gap-1 flex-wrap justify-end">
                    {[...Array(30)].map((_, i) => {
                        const isStreakDay = i >= 30 - stats.streak;
                        const opacity = isStreakDay ? 'opacity-100' : Math.random() > 0.7 ? 'opacity-40' : 'opacity-10';
                        const color = isStreakDay ? 'bg-cyber-green shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 'bg-gray-600';
                        
                        return (
                            <div 
                                key={i} 
                                className={`w-3 h-3 md:w-4 md:h-4 rounded-sm ${color} ${opacity} transition-all duration-500`}
                            ></div>
                        );
                    })}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
