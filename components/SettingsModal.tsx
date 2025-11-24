
import React, { useRef } from 'react';
import { Download, Upload, Trash2, RefreshCcw, X, ShieldAlert, Palette } from 'lucide-react';
import { UserProfile, Language, Theme } from '../types';
import { getTranslation } from '../utils/translations';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  lang: Language;
  theme: Theme;
  onSetTheme: (t: Theme) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, userProfile, onUpdateProfile, lang, theme, onSetTheme }) => {
  const t = getTranslation(lang);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    const data = {
      streamos_stats: localStorage.getItem('streamos_stats'),
      streamos_agenda: localStorage.getItem('streamos_agenda'),
      streamos_projects: localStorage.getItem('streamos_projects'),
      streamos_tasks: localStorage.getItem('streamos_tasks'),
      streamos_profile: localStorage.getItem('streamos_profile'),
      streamos_lang: localStorage.getItem('streamos_lang'),
      streamos_theme: localStorage.getItem('streamos_theme'),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `streamos_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        // Restore keys
        Object.keys(data).forEach(key => {
            if (data[key]) localStorage.setItem(key, data[key]);
        });

        alert("Backup restored successfully. System reloading...");
        window.location.reload();
      } catch (error) {
        alert("Error importing backup. File may be corrupted.");
        console.error(error);
      }
    };
    reader.readAsText(file);
  };

  const handleResetXP = () => {
    if (confirm("Are you sure? This will reset your Level and XP to 0. Badges may be locked again.")) {
        localStorage.removeItem('streamos_stats');
        window.location.reload();
    }
  };

  const handleFactoryReset = () => {
    if (confirm("WARNING: THIS WILL WIPE EVERYTHING. ALL DATA WILL BE LOST. Continue?")) {
        localStorage.clear();
        window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-cyber-900 border border-cyber-700 rounded-xl w-full max-w-lg p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        
        <div className="flex justify-between items-center mb-6 border-b border-cyber-700 pb-4">
            <h3 className="text-xl font-display text-white flex items-center gap-2">
                <RefreshCcw className="text-cyber-cyan" /> {t.settings.title}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
            </button>
        </div>

        <div className="space-y-8">
            
            {/* THEME SECTION */}
            <section>
                <h4 className="text-cyber-cyan font-bold text-sm uppercase mb-3 flex items-center gap-2">
                    <Palette size={16} /> {t.settings.themes}
                </h4>
                <div className="grid grid-cols-3 gap-3">
                    <button 
                        onClick={() => onSetTheme('cyber')}
                        className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${theme === 'cyber' ? 'border-cyan-400 bg-cyan-900/20 text-cyan-400' : 'border-cyber-700 bg-cyber-800 text-gray-400 hover:border-gray-500'}`}
                    >
                        <div className="w-4 h-4 rounded-full bg-[#06b6d4]"></div>
                        <span className="text-xs font-bold">Cyberpunk</span>
                    </button>
                    <button 
                        onClick={() => onSetTheme('matrix')}
                        className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${theme === 'matrix' ? 'border-green-500 bg-green-900/20 text-green-500' : 'border-cyber-700 bg-cyber-800 text-gray-400 hover:border-gray-500'}`}
                    >
                        <div className="w-4 h-4 rounded-full bg-[#22c55e]"></div>
                        <span className="text-xs font-bold">Matrix</span>
                    </button>
                    <button 
                        onClick={() => onSetTheme('sith')}
                        className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${theme === 'sith' ? 'border-red-500 bg-red-900/20 text-red-500' : 'border-cyber-700 bg-cyber-800 text-gray-400 hover:border-gray-500'}`}
                    >
                        <div className="w-4 h-4 rounded-full bg-[#ef4444]"></div>
                        <span className="text-xs font-bold">Sith</span>
                    </button>
                </div>
            </section>

            {/* PROFILE SECTION */}
            <section>
                <h4 className="text-cyber-purple font-bold text-sm uppercase mb-3 flex items-center gap-2">
                    {t.settings.profile}
                </h4>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-gray-500">{t.settings.name}</label>
                        <input 
                            type="text" 
                            value={userProfile.name}
                            onChange={(e) => onUpdateProfile({...userProfile, name: e.target.value})}
                            className="w-full bg-cyber-800 border border-cyber-700 rounded p-2 text-white focus:border-cyber-cyan outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500">{t.settings.avatar}</label>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={userProfile.avatar}
                                onChange={(e) => onUpdateProfile({...userProfile, avatar: e.target.value})}
                                className="flex-1 bg-cyber-800 border border-cyber-700 rounded p-2 text-white focus:border-cyber-cyan outline-none text-sm"
                                placeholder="https://..."
                            />
                            <div className="w-10 h-10 rounded-full bg-cyber-700 overflow-hidden border border-cyber-500">
                                <img src={userProfile.avatar} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* BACKUP SECTION */}
            <section>
                <h4 className="text-cyber-cyan font-bold text-sm uppercase mb-3 flex items-center gap-2">
                    {t.settings.backup}
                </h4>
                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={handleExport}
                        className="flex flex-col items-center justify-center p-4 bg-cyber-800 border border-cyber-700 rounded-lg hover:border-cyber-green hover:bg-cyber-green/10 transition-all group"
                    >
                        <Download className="text-gray-400 group-hover:text-cyber-green mb-2" />
                        <span className="text-sm font-bold text-gray-300 group-hover:text-white">{t.settings.export}</span>
                    </button>

                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center justify-center p-4 bg-cyber-800 border border-cyber-700 rounded-lg hover:border-cyber-cyan hover:bg-cyber-cyan/10 transition-all group"
                    >
                        <Upload className="text-gray-400 group-hover:text-cyber-cyan mb-2" />
                        <span className="text-sm font-bold text-gray-300 group-hover:text-white">{t.settings.import}</span>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept=".json"
                            onChange={handleImport}
                        />
                    </button>
                </div>
            </section>

            {/* DANGER ZONE */}
            <section className="bg-red-500/5 border border-red-500/20 p-4 rounded-xl">
                <h4 className="text-red-500 font-bold text-sm uppercase mb-3 flex items-center gap-2">
                    <ShieldAlert size={16} /> {t.settings.danger}
                </h4>
                <div className="space-y-3">
                    <button 
                        onClick={handleResetXP}
                        className="w-full text-left text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded transition-colors flex items-center gap-2"
                    >
                        <RefreshCcw size={14} /> {t.settings.resetXP}
                    </button>
                    <button 
                        onClick={handleFactoryReset}
                        className="w-full text-left text-sm text-red-500 font-bold hover:bg-red-500/20 p-2 rounded transition-colors flex items-center gap-2"
                    >
                        <Trash2 size={14} /> {t.settings.factoryReset}
                    </button>
                </div>
            </section>
        </div>

        <div className="mt-8 pt-4 border-t border-cyber-700 flex justify-end">
            <button 
                onClick={onClose}
                className="bg-cyber-cyan text-black px-6 py-2 rounded font-bold hover:bg-white transition-colors"
            >
                {t.settings.close}
            </button>
        </div>

      </div>
    </div>
  );
};

export default SettingsModal;
