
import React, { useState, useEffect } from 'react';
import { AppTab, PlayerStats, Language, Badge } from './types';
import Dashboard from './components/Dashboard';
import Agenda from './components/Agenda';
import Studio from './components/Studio';
import BaseOps from './components/BaseOps';
import AICoach from './components/AICoach';
import { LayoutDashboard, Calendar, Video, Home, MessageSquare, Terminal, Globe, Award } from 'lucide-react';
import { getTranslation } from './utils/translations';

// --- INITIAL DATA & UTILS ---

const INITIAL_STATS: PlayerStats = {
  level: 1,
  currentXP: 0,
  nextLevelXP: 500,
  streak: 1,
  lastLoginDate: new Date().toDateString(),
};

const BADGES_DEF = [
  { id: 'streak3', icon: '🔥', translationKey: 'streak3', condition: (s: PlayerStats) => s.streak >= 3 },
  { id: 'streak7', icon: '⚡', translationKey: 'streak7', condition: (s: PlayerStats) => s.streak >= 7 },
  { id: 'level5', icon: '⭐', translationKey: 'level5', condition: (s: PlayerStats) => s.level >= 5 },
  { id: 'xp1000', icon: '🦾', translationKey: 'xp1000', condition: (s: PlayerStats) => s.currentXP >= 1000 },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [lang, setLang] = useState<Language>('es');
  
  // -- PERSISTENT STATE --
  const [stats, setStats] = useState<PlayerStats>(INITIAL_STATS);
  const [badges, setBadges] = useState<{id: string, unlocked: boolean}[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // 1. LOAD DATA ON MOUNT
  useEffect(() => {
    const savedStats = localStorage.getItem('streamos_stats');
    const savedLang = localStorage.getItem('streamos_lang') as Language;
    
    if (savedLang) setLang(savedLang);

    if (savedStats) {
      const parsedStats: PlayerStats = JSON.parse(savedStats);
      
      // STREAK LOGIC
      const today = new Date().toDateString();
      const lastLogin = parsedStats.lastLoginDate;
      const yesterday = new Date(Date.now() - 86400000).toDateString();

      let newStreak = parsedStats.streak;

      if (lastLogin !== today) {
        if (lastLogin === yesterday) {
          newStreak += 1;
        } else {
          newStreak = 1; // Streak reset
        }
        // Update stats with new date and streak
        const updatedStats = { ...parsedStats, streak: newStreak, lastLoginDate: today };
        setStats(updatedStats);
        localStorage.setItem('streamos_stats', JSON.stringify(updatedStats));
      } else {
        setStats(parsedStats);
      }
    } else {
      // First time user
      localStorage.setItem('streamos_stats', JSON.stringify(INITIAL_STATS));
    }
    
    setIsInitialized(true);
  }, []);

  // 2. SAVE STATS ON CHANGE & CHECK BADGES
  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem('streamos_stats', JSON.stringify(stats));

    // Check Badges
    const newBadges = BADGES_DEF.map(def => ({
      id: def.id,
      unlocked: def.condition(stats)
    }));
    setBadges(newBadges);

  }, [stats, isInitialized]);

  // 3. SAVE LANG ON CHANGE
  useEffect(() => {
    localStorage.setItem('streamos_lang', lang);
  }, [lang]);

  const t = getTranslation(lang);

  const gainXP = (amount: number) => {
    setStats(prev => {
      let newXP = prev.currentXP + amount;
      let newLevel = prev.level;
      let nextXP = prev.nextLevelXP;

      // Level up logic
      if (newXP >= nextXP) {
        newXP = newXP - nextXP;
        newLevel += 1;
        nextXP = Math.floor(nextXP * 1.5);
      }

      // Prevent negative XP (simplification: don't de-level, just floor at 0)
      if (newXP < 0) newXP = 0;

      return {
        ...prev,
        level: newLevel,
        currentXP: newXP,
        nextLevelXP: nextXP
      };
    });
  };

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'es' : 'en');
  };

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.DASHBOARD:
        return <Dashboard stats={stats} badges={badges} lang={lang} />;
      case AppTab.AGENDA:
        return <Agenda lang={lang} onGainXP={gainXP} />;
      case AppTab.STUDIO:
        return <Studio onGainXP={gainXP} lang={lang} />;
      case AppTab.BASE_OPS:
        return <BaseOps onGainXP={gainXP} lang={lang} />;
      case AppTab.AI_COACH:
        return <AICoach lang={lang} stats={stats} />;
      default:
        return <Dashboard stats={stats} badges={badges} lang={lang} />;
    }
  };

  const navItems = [
    { id: AppTab.DASHBOARD, label: t.nav.dashboard, icon: LayoutDashboard },
    { id: AppTab.AGENDA, label: t.nav.agenda, icon: Calendar },
    { id: AppTab.STUDIO, label: t.nav.studio, icon: Video },
    { id: AppTab.BASE_OPS, label: t.nav.baseOps, icon: Home },
    { id: AppTab.AI_COACH, label: t.nav.aiCoach, icon: MessageSquare },
  ];

  if (!isInitialized) return <div className="min-h-screen bg-[#050b14] flex items-center justify-center text-cyber-cyan font-mono">LOADING SYSTEM...</div>;

  return (
    <div className="min-h-screen bg-[#050b14] text-gray-200 font-sans selection:bg-cyber-cyan selection:text-black">
      {/* Mobile Header */}
      <div className="md:hidden bg-cyber-900 border-b border-cyber-700 p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
            <Terminal className="text-cyber-cyan" size={24} />
            <span className="font-display font-bold text-lg tracking-wider">STREAM.OS</span>
        </div>
        <div className="flex items-center gap-3">
             <button 
                onClick={toggleLanguage}
                className="text-xs font-mono font-bold border border-cyber-700 bg-cyber-800 px-2 py-1 rounded text-cyber-cyan hover:bg-cyber-700"
            >
                {lang.toUpperCase()}
            </button>
            <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-cyber-purple">LVL {stats.level}</span>
                <div className="w-16 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-cyber-cyan" style={{width: `${(stats.currentXP/stats.nextLevelXP)*100}%`}}></div>
                </div>
            </div>
        </div>
      </div>

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar (Desktop) */}
        <aside className="hidden md:flex w-64 bg-cyber-900 border-r border-cyber-800 flex-col p-4">
          <div className="flex items-center gap-3 mb-10 px-2 mt-2">
            <div className="bg-cyber-cyan/20 p-2 rounded-lg border border-cyber-cyan/50">
                <Terminal className="text-cyber-cyan" size={28} />
            </div>
            <div>
                <h1 className="font-display font-bold text-xl text-white tracking-wider">STREAM.OS</h1>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">v3.1.0 BETA</p>
            </div>
          </div>

          <nav className="space-y-2 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? 'bg-cyber-cyan text-black font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                      : 'text-gray-400 hover:bg-cyber-800 hover:text-white'
                  }`}
                >
                  <Icon size={20} className={`${isActive ? 'text-black' : 'group-hover:text-cyber-cyan transition-colors'}`} />
                  <span>{item.label}</span>
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-black animate-pulse" />}
                </button>
              );
            })}
          </nav>

          {/* Language Toggle Desktop */}
          <div className="mb-4 px-2">
             <button 
                onClick={toggleLanguage}
                className="w-full flex items-center justify-between bg-cyber-800/50 border border-cyber-700 rounded-lg p-2 hover:border-cyber-cyan/50 transition-colors group"
             >
                <div className="flex items-center gap-2 text-sm text-gray-400 group-hover:text-white">
                    <Globe size={16} />
                    <span>Language</span>
                </div>
                <div className="flex text-xs font-mono font-bold">
                    <span className={lang === 'en' ? 'text-cyber-cyan' : 'text-gray-600'}>EN</span>
                    <span className="text-gray-600 mx-1">/</span>
                    <span className={lang === 'es' ? 'text-cyber-cyan' : 'text-gray-600'}>ES</span>
                </div>
             </button>
          </div>

          <div className="mt-auto bg-cyber-800/50 p-4 rounded-xl border border-cyber-700/50">
            <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-bold text-gray-400">XP Progress</span>
                <span className="text-xs font-mono text-cyber-cyan">{stats.currentXP} / {stats.nextLevelXP}</span>
            </div>
            <div className="h-1.5 bg-cyber-900 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple transition-all duration-700"
                    style={{width: `${(stats.currentXP/stats.nextLevelXP)*100}%`}}
                />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
            {/* Background Grid Effect */}
            <div className="fixed inset-0 pointer-events-none opacity-5" 
                style={{
                    backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />
            
            <div className="max-w-6xl mx-auto relative z-10 pb-20 md:pb-0">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-display font-bold text-white uppercase tracking-wide">
                            {navItems.find(n => n.id === activeTab)?.label}
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">
                           System Status: <span className="text-green-400">Operational</span>
                        </p>
                    </div>
                    {/* Desktop Date Display */}
                    <div className="hidden md:block text-right">
                        <div className="text-2xl font-mono text-gray-200">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        <div className="text-xs text-cyber-purple uppercase font-bold">
                            {new Date().toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                        </div>
                    </div>
                </header>

                {renderContent()}
            </div>
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-cyber-900 border-t border-cyber-700 p-2 flex justify-around z-50 pb-safe">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
                    isActive ? 'text-cyber-cyan bg-cyber-800' : 'text-gray-500'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-[10px] font-medium">{item.label.split(' ')[0]}</span>
                </button>
              );
            })}
        </nav>
      </div>
    </div>
  );
};

export default App;
