
import React, { useState, useEffect } from 'react';
import { AppTab, PlayerStats, Language, Badge, UserProfile, AgendaItem, DailyTask, Theme } from './types';
import Dashboard from './components/Dashboard';
import Agenda from './components/Agenda';
import Studio from './components/Studio';
import BaseOps from './components/BaseOps';
import AICoach from './components/AICoach';
import SettingsModal from './components/SettingsModal';
import LevelUpModal from './components/LevelUpModal';
import StreamLauncher from './components/StreamLauncher';
import LootModal from './components/LootModal';
import { LayoutDashboard, Calendar, Video, Home, MessageSquare, Terminal, Globe, Award, Settings } from 'lucide-react';
import { getTranslation } from './utils/translations';

// --- INITIAL DATA & UTILS ---

const INITIAL_STATS: PlayerStats = {
  level: 1,
  currentXP: 0,
  nextLevelXP: 500,
  streak: 1,
  lastLoginDate: new Date().toDateString(),
};

const INITIAL_PROFILE: UserProfile = {
  name: "Ninja Urbano",
  avatar: "https://cdn-icons-png.flaticon.com/512/3959/3959542.png"
};

const DEFAULT_SCHEDULE_TEMPLATE: AgendaItem[] = [
    { id: '1', startTime: '08:30', endTime: '19:30', title: 'The Grind (Work)', desc: 'Keep head down. Save energy.', type: 'work', completed: false, xpReward: 50 },
    { id: '2', startTime: '19:30', endTime: '20:30', title: 'Transit', desc: 'Podcast / Music', type: 'transit', completed: false, xpReward: 10 },
    { id: '3', startTime: '20:30', endTime: '21:00', title: 'Base Ops', desc: 'Shower & Reset', type: 'base', completed: false, xpReward: 20 },
    { id: '4', startTime: '21:00', endTime: '22:00', title: 'Creative Block', desc: 'Focus Mode', type: 'creative', completed: false, xpReward: 100 },
    { id: '5', startTime: '22:00', endTime: '23:00', title: 'Shutdown', desc: 'Sleep prep', type: 'sleep', completed: false, xpReward: 10 },
];

const DEFAULT_TASKS_TEMPLATE: DailyTask[] = [
    { id: 't1', title: 'Dishes Cleared', translationKey: 't1', xp: 25, completed: false, category: 'home' },
    { id: 't2', title: 'Backpack Packed', translationKey: 't2', xp: 20, completed: false, category: 'admin' },
    { id: 't3', title: 'Outfit Laid Out', translationKey: 't3', xp: 15, completed: false, category: 'admin' },
    { id: 't4', title: 'Drink Water', translationKey: 't4', xp: 10, completed: false, category: 'health' },
    { id: 't5', title: 'Desk Wipe', translationKey: 't5', xp: 30, completed: false, category: 'home' },
];

const BADGES_DEF = [
  { id: 'streak3', icon: '🔥', translationKey: 'streak3', condition: (s: PlayerStats) => s.streak >= 3 },
  { id: 'streak7', icon: '⚡', translationKey: 'streak7', condition: (s: PlayerStats) => s.streak >= 7 },
  { id: 'level5', icon: '⭐', translationKey: 'level5', condition: (s: PlayerStats) => s.level >= 5 },
  { id: 'xp1000', icon: '🦾', translationKey: 'xp1000', condition: (s: PlayerStats) => s.currentXP >= 1000 },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [lang, setLang] = useState<Language>('es');
  const [theme, setTheme] = useState<Theme>('cyber');
  
  // -- PERSISTENT STATE --
  const [stats, setStats] = useState<PlayerStats>(INITIAL_STATS);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [badges, setBadges] = useState<{id: string, unlocked: boolean}[]>([]);
  
  // Lifted State for AI manipulation
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);

  const [isInitialized, setIsInitialized] = useState(false);

  // -- MODAL STATE --
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showStreamLauncher, setShowStreamLauncher] = useState(false); 
  const [showLoot, setShowLoot] = useState(false);

  // 1. LOAD DATA ON MOUNT
  useEffect(() => {
    const savedStats = localStorage.getItem('streamos_stats');
    const savedLang = localStorage.getItem('streamos_lang') as Language;
    const savedTheme = localStorage.getItem('streamos_theme') as Theme;
    const savedProfile = localStorage.getItem('streamos_profile');
    
    // Load Agenda
    const savedAgenda = localStorage.getItem('streamos_agenda');
    const lastAgendaDate = localStorage.getItem('streamos_agenda_date');
    // Load Tasks
    const savedTasks = localStorage.getItem('streamos_tasks');
    const lastTaskDate = localStorage.getItem('streamos_tasks_date');

    const today = new Date().toDateString();

    if (savedLang) setLang(savedLang);
    if (savedTheme) setTheme(savedTheme);
    if (savedProfile) setUserProfile(JSON.parse(savedProfile));

    // Stats Logic
    if (savedStats) {
      const parsedStats: PlayerStats = JSON.parse(savedStats);
      const lastLogin = parsedStats.lastLoginDate;
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      let newStreak = parsedStats.streak;

      if (lastLogin !== today) {
        if (lastLogin === yesterday) newStreak += 1;
        else newStreak = 1;
        const updatedStats = { ...parsedStats, streak: newStreak, lastLoginDate: today };
        setStats(updatedStats);
        localStorage.setItem('streamos_stats', JSON.stringify(updatedStats));
      } else {
        setStats(parsedStats);
      }
    } else {
      localStorage.setItem('streamos_stats', JSON.stringify(INITIAL_STATS));
    }

    // Agenda Logic (Reset Daily)
    if (savedAgenda) {
        let parsed: AgendaItem[] = JSON.parse(savedAgenda);
        if (lastAgendaDate !== today) {
            parsed = parsed.map(i => ({ ...i, completed: false }));
            localStorage.setItem('streamos_agenda_date', today);
        }
        setAgendaItems(parsed);
    } else {
        setAgendaItems(DEFAULT_SCHEDULE_TEMPLATE);
        localStorage.setItem('streamos_agenda_date', today);
    }

    // Tasks Logic (Reset Daily)
    if (savedTasks) {
        let parsed: DailyTask[] = JSON.parse(savedTasks);
        if (lastTaskDate !== today) {
            parsed = parsed.map(t => ({ ...t, completed: false }));
            localStorage.setItem('streamos_tasks_date', today);
        }
        setDailyTasks(parsed);
    } else {
        setDailyTasks(DEFAULT_TASKS_TEMPLATE);
        localStorage.setItem('streamos_tasks_date', today);
    }
    
    setIsInitialized(true);
  }, []);

  // 2. SAVE EFFECTS
  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem('streamos_stats', JSON.stringify(stats));
    // Badge Check
    const newBadges = BADGES_DEF.map(def => ({
      id: def.id,
      unlocked: def.condition(stats)
    }));
    setBadges(newBadges);
  }, [stats, isInitialized]);

  useEffect(() => {
    localStorage.setItem('streamos_lang', lang);
  }, [lang]);

  useEffect(() => {
      localStorage.setItem('streamos_theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem('streamos_profile', JSON.stringify(userProfile));
  }, [userProfile, isInitialized]);

  // Save Agenda & Tasks whenever they change
  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem('streamos_agenda', JSON.stringify(agendaItems));
  }, [agendaItems, isInitialized]);

  useEffect(() => {
      if (!isInitialized) return;
      localStorage.setItem('streamos_tasks', JSON.stringify(dailyTasks));
  }, [dailyTasks, isInitialized]);


  // --- GAMIFICATION CORE ---
  const t = getTranslation(lang);

  const gainXP = (amount: number) => {
    setStats(prev => {
      let newXP = prev.currentXP + amount;
      let newLevel = prev.level;
      let nextXP = prev.nextLevelXP;
      let leveledUp = false;

      if (newXP >= nextXP) {
        newXP = newXP - nextXP;
        newLevel += 1;
        nextXP = Math.floor(nextXP * 1.5);
        leveledUp = true;
      }
      if (newXP < 0) newXP = 0;

      if (leveledUp) {
        setTimeout(() => setShowLevelUp(true), 500);
      }

      return { ...prev, level: newLevel, currentXP: newXP, nextLevelXP: nextXP };
    });
  };

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'es' : 'en');
  };

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.DASHBOARD:
        return <Dashboard 
          stats={stats} 
          badges={badges} 
          lang={lang} 
          userProfile={userProfile}
          agenda={agendaItems} // Pass data for HUD
          tasks={dailyTasks}   // Pass data for HUD
          onOpenSettings={() => setIsSettingsOpen(true)}
          onStartStream={() => setShowStreamLauncher(true)}
          onOpenLoot={() => setShowLoot(true)}
        />;
      case AppTab.AGENDA:
        return <Agenda 
            lang={lang} 
            onGainXP={gainXP} 
            items={agendaItems} 
            setItems={setAgendaItems} 
        />;
      case AppTab.STUDIO:
        return <Studio onGainXP={gainXP} lang={lang} />;
      case AppTab.BASE_OPS:
        return <BaseOps 
            onGainXP={gainXP} 
            lang={lang} 
            tasks={dailyTasks} 
            setTasks={setDailyTasks} 
        />;
      case AppTab.AI_COACH:
        return <AICoach 
            lang={lang} 
            stats={stats} 
            userProfile={userProfile} 
            agenda={agendaItems}
            tasks={dailyTasks}
            onUpdateAgenda={setAgendaItems}
            onUpdateTasks={setDailyTasks}
            onGainXP={gainXP}
        />;
      default:
        return <Dashboard 
            stats={stats} 
            badges={badges} 
            lang={lang} 
            userProfile={userProfile} 
            agenda={agendaItems}
            tasks={dailyTasks}
            onOpenSettings={() => setIsSettingsOpen(true)} 
            onStartStream={() => setShowStreamLauncher(true)} 
            onOpenLoot={() => setShowLoot(true)}
        />;
    }
  };

  const navItems = [
    { id: AppTab.DASHBOARD, label: t.nav.dashboard, icon: LayoutDashboard },
    { id: AppTab.AGENDA, label: t.nav.agenda, icon: Calendar },
    { id: AppTab.STUDIO, label: t.nav.studio, icon: Video },
    { id: AppTab.BASE_OPS, label: t.nav.baseOps, icon: Home },
    { id: AppTab.AI_COACH, label: t.nav.aiCoach, icon: MessageSquare },
  ];

  if (!isInitialized) return <div className="min-h-screen bg-[#050b14] flex items-center justify-center text-cyber-cyan font-mono">BOOTING KAIROS...</div>;

  return (
    <div className={`theme-${theme} min-h-screen bg-transparent text-gray-200 font-sans selection:bg-cyber-cyan selection:text-black transition-colors duration-500`}>
      {/* Mobile Header */}
      <div className="md:hidden bg-cyber-900/80 backdrop-blur-md border-b border-cyber-700 p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
            <Terminal className="text-cyber-cyan" size={24} />
            <span className="font-display font-bold text-lg tracking-wider">KAIROS.OS</span>
        </div>
        <div className="flex items-center gap-3">
             <button 
                onClick={toggleLanguage}
                className="text-xs font-mono font-bold border border-cyber-700 bg-cyber-800/50 px-2 py-1 rounded text-cyber-cyan hover:bg-cyber-700"
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
        <aside className="hidden md:flex w-64 bg-cyber-900/80 backdrop-blur-md border-r border-cyber-800 flex-col p-4 relative z-20">
          <div className="flex items-center gap-3 mb-10 px-2 mt-2">
            <div className="bg-cyber-cyan/20 p-2 rounded-lg border border-cyber-cyan/50">
                <Terminal className="text-cyber-cyan" size={28} />
            </div>
            <div>
                <h1 className="font-display font-bold text-xl text-white tracking-wider">KAIROS</h1>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">OS v5.0 OMNI</p>
            </div>
          </div>

          <div className="mb-6 px-2 flex items-center gap-3 bg-cyber-800/50 p-3 rounded-xl border border-cyber-700/50">
              <div className="w-10 h-10 rounded-full bg-cyber-700 overflow-hidden border-2 border-cyber-cyan">
                  <img src={userProfile.avatar} alt="Avatar" className="w-full h-full object-cover"/>
              </div>
              <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-white truncate">{userProfile.name}</h3>
                  <p className="text-[10px] text-cyber-green flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse"></span>
                      Online
                  </p>
              </div>
              <button onClick={() => setIsSettingsOpen(true)} className="text-gray-400 hover:text-white">
                  <Settings size={16} />
              </button>
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
                      ? 'bg-cyber-cyan text-black font-bold shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.4)]' 
                      : 'text-gray-400 hover:bg-cyber-800/50 hover:text-white'
                  }`}
                >
                  <Icon size={20} className={`${isActive ? 'text-black' : 'group-hover:text-cyber-cyan transition-colors'}`} />
                  <span>{item.label}</span>
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-black animate-pulse" />}
                </button>
              );
            })}
          </nav>

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
            <div className="bg-grid fixed inset-0 pointer-events-none z-0"></div>
            
            <div className="max-w-6xl mx-auto relative z-10 pb-20 md:pb-0">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-display font-bold text-white uppercase tracking-wide drop-shadow-lg">
                            {navItems.find(n => n.id === activeTab)?.label}
                        </h2>
                        <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
                           <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse"></span>
                           System Status: Nominal
                        </p>
                    </div>
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
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-cyber-900/90 backdrop-blur-md border-t border-cyber-700 p-2 flex justify-around z-50 pb-safe">
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

        {/* MODALS */}
        <SettingsModal 
            isOpen={isSettingsOpen} 
            onClose={() => setIsSettingsOpen(false)} 
            userProfile={userProfile}
            onUpdateProfile={setUserProfile}
            lang={lang}
            theme={theme}
            onSetTheme={setTheme}
        />
        
        {showLevelUp && (
          <LevelUpModal 
            newLevel={stats.level} 
            lang={lang} 
            onClose={() => setShowLevelUp(false)} 
          />
        )}
        
        {showStreamLauncher && (
            <StreamLauncher 
                lang={lang}
                onClose={() => setShowStreamLauncher(false)}
                onComplete={() => {}}
            />
        )}

        {showLoot && (
            <LootModal
                lang={lang}
                onClose={() => setShowLoot(false)}
                onAccept={gainXP}
            />
        )}

      </div>
    </div>
  );
};

export default App;
