
import React from 'react';
import { PlayerStats, Language, UserProfile } from '../types';
import { Activity, Zap, Trophy, Clock, Award, Lock, Settings } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { getTranslation } from '../utils/translations';
import { translations } from '../utils/translations';

interface DashboardProps {
  stats: PlayerStats;
  lang: Language;
  badges: {id: string, unlocked: boolean}[];
  userProfile: UserProfile;
  onOpenSettings: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, lang, badges, userProfile, onOpenSettings }) => {
  const t = getTranslation(lang);
  const xpProgress = Math.min(100, (stats.currentXP / stats.nextLevelXP) * 100);

  const data = [
    { name: t.dashboard.completed, value: stats.currentXP },
    { name: t.dashboard.remaining, value: Math.max(0, stats.nextLevelXP - stats.currentXP) },
  ];
  // Safe fallback if data is empty or zero to prevent chart errors
  const chartData = data.every(d => d.value === 0) 
    ? [{ name: 'Start', value: 1 }] 
    : data;

  const COLORS = ['#06b6d4', '#1e293b'];

  const getBadgeName = (id: string) => {
    // @ts-ignore
    return t.badges[id] || id;
  };

  const getBadgeIcon = (id: string) => {
    // Simple lookup based on ID prefix or manual map
    if (id.includes('streak')) return '🔥';
    if (id.includes('level')) return '⭐';
    if (id.includes('xp')) return '🦾';
    return '🏆';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Dynamic Header for Mobile (also visible on desktop in specific grid spot) */}
      <div className="flex md:hidden items-center justify-between bg-cyber-800/50 p-4 rounded-xl border border-cyber-700/50">
         <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-cyber-700 overflow-hidden border-2 border-cyber-cyan">
                <img src={userProfile.avatar} alt="Avatar" className="w-full h-full object-cover"/>
             </div>
             <div>
                 <h3 className="font-bold text-white leading-tight">{userProfile.name}</h3>
                 <p className="text-xs text-cyber-cyan">Lvl {stats.level}</p>
             </div>
         </div>
         <button onClick={onOpenSettings} className="p-2 text-gray-400 hover:text-white bg-cyber-900 rounded-lg">
             <Settings size={20} />
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Level Card */}
        <div className="bg-cyber-800 border border-cyber-cyan/30 rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <Trophy size={64} />
          </div>
          <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">{t.dashboard.currentLevel}</h3>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-4xl font-display font-bold text-cyber-cyan">{stats.level}</span>
            <span className="text-sm text-cyber-cyan/60 mb-1">{t.dashboard.noviceStreamer}</span>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>{t.dashboard.xp}: {stats.currentXP}</span>
              <span>{t.dashboard.target}: {stats.nextLevelXP}</span>
            </div>
            <div className="h-2 bg-cyber-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple transition-all duration-500"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Streak Card */}
        <div className="bg-cyber-800 border border-cyber-pink/30 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10">
            <Zap size={64} className="text-cyber-pink" />
          </div>
          <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">{t.dashboard.loginStreak}</h3>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-4xl font-display font-bold text-cyber-pink">{stats.streak}</span>
            <span className="text-sm text-cyber-pink/60 mb-1">{t.dashboard.days}</span>
          </div>
          <p className="text-xs text-gray-500 mt-4">{t.dashboard.consistency}</p>
        </div>

        {/* Next Slot Card */}
        <div className="bg-cyber-800 border border-cyber-green/30 rounded-xl p-6 relative overflow-hidden md:col-span-2">
           <div className="absolute top-0 right-0 p-2 opacity-10">
            <Clock size={64} className="text-cyber-green" />
          </div>
          <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">{t.dashboard.nextBlock}</h3>
          <div className="mt-2">
            <span className="text-2xl font-display font-bold text-white">21:00 - 21:45</span>
            <span className="ml-3 text-cyber-green font-medium">Focused Creation</span>
          </div>
          <p className="text-gray-400 text-sm mt-2">
            {t.dashboard.objective}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Stats */}
        <div className="bg-cyber-800 border border-cyber-700 rounded-xl p-6 flex flex-col">
            <h3 className="text-lg font-display text-white mb-4">{t.dashboard.xpDist}</h3>
            {/* Added min-w-0 to fix grid overflow issues and forced height style */}
            <div className="h-64 w-full min-w-0 relative flex-1">
                 <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                      />
                    </PieChart>
                 </ResponsiveContainer>
                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="text-2xl font-bold text-white">{Math.round(xpProgress)}%</div>
                    <div className="text-xs text-gray-400">{t.dashboard.toLevel} {stats.level + 1}</div>
                 </div>
            </div>
        </div>

        {/* Badges / Achievements */}
        <div className="lg:col-span-2 bg-cyber-800 border border-cyber-700 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-display text-white flex items-center gap-2">
                    <Award className="text-cyber-purple" size={20}/> {t.dashboard.badges}
                </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {badges.map((badge) => (
                    <div 
                        key={badge.id} 
                        className={`p-4 rounded-lg border flex flex-col items-center justify-center text-center transition-all ${
                            badge.unlocked 
                                ? 'bg-cyber-purple/10 border-cyber-purple/50 text-white shadow-[0_0_10px_rgba(139,92,246,0.2)]' 
                                : 'bg-cyber-900/50 border-cyber-800 text-gray-600 opacity-50'
                        }`}
                    >
                        <div className="text-3xl mb-2">
                            {badge.unlocked ? getBadgeIcon(badge.id) : <Lock size={24}/>}
                        </div>
                        <span className="text-xs font-bold leading-tight">
                            {getBadgeName(badge.id)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
