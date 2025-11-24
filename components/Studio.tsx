
import React, { useState, useEffect } from 'react';
import { ProjectCard, ProjectStatus, Platform, Language } from '../types';
import { Plus, ChevronLeft, ChevronRight, Video, Scissors, Upload, Smartphone, Trash2, Save, X } from 'lucide-react';
import { getTranslation } from '../utils/translations';
import StudioDetailModal from './StudioDetailModal';

interface StudioProps {
  onGainXP: (amount: number) => void;
  lang: Language;
}

const Studio: React.FC<StudioProps> = ({ onGainXP, lang }) => {
  const t = getTranslation(lang);
  const [projects, setProjects] = useState<ProjectCard[]>([]);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newPlatform, setNewPlatform] = useState<Platform>('tiktok');

  // Detail Modal State
  const [selectedProject, setSelectedProject] = useState<ProjectCard | null>(null);

  // Load from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('streamos_projects');
    if (saved) {
      setProjects(JSON.parse(saved));
    }
  }, []);

  // Save to LocalStorage on change
  useEffect(() => {
    localStorage.setItem('streamos_projects', JSON.stringify(projects));
  }, [projects]);

  // --- ACTIONS ---

  const addProject = () => {
    if (!newTitle.trim()) return;

    const newProject: ProjectCard = {
      id: Date.now().toString(),
      title: newTitle,
      category: newCategory || 'General',
      platform: newPlatform,
      status: 'idea',
      createdAt: Date.now()
    };

    setProjects(prev => [...prev, newProject]);
    onGainXP(10); // Small XP for brainstorming
    
    // Reset Modal
    setNewTitle('');
    setNewCategory('');
    setIsModalOpen(false);
  };

  const updateProject = (updated: ProjectCard) => {
      setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const moveProject = (id: string, nextStatus: ProjectStatus) => {
    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, status: nextStatus };
      }
      return p;
    }));
    
    if (nextStatus === 'ready') onGainXP(50);
    if (nextStatus === 'editing') onGainXP(20);
  };

  const moveProjectBack = (id: string, currentStatus: ProjectStatus) => {
    if (!confirm(t.studio.actions.confirmBack)) return;

    let prevStatus: ProjectStatus = 'idea';
    let xpPenalty = 0;

    // Determine Previous Status and XP Reversal
    if (currentStatus === 'ready') {
        prevStatus = 'editing';
        xpPenalty = 50; // Reverse the reward for finishing
    } else if (currentStatus === 'editing') {
        prevStatus = 'recording';
        xpPenalty = 20; // Reverse the reward for reaching editing
    } else if (currentStatus === 'recording') {
        prevStatus = 'idea';
        xpPenalty = 0; // No specific reward for reaching recording currently
    }

    setProjects(prev => prev.map(p => {
        if (p.id === id) {
            return { ...p, status: prevStatus };
        }
        return p;
    }));

    if (xpPenalty > 0) {
        onGainXP(-xpPenalty);
    }
  };

  const deleteProject = (id: string) => {
    const project = projects.find(p => p.id === id);
    if (!project) return;
    
    // XP Subtraction Logic to prevent exploits
    // Calculate total XP gained by this project based on its current status
    // Idea (Creation): +10
    // Recording: +0 (transition)
    // Editing: +20
    // Ready: +50
    
    if (confirm(t.studio.actions.confirmDelete)) {
        let xpToDeduct = 10; // Base creation XP

        if (project.status === 'editing' || project.status === 'ready') {
            xpToDeduct += 20;
        }
        if (project.status === 'ready') {
            xpToDeduct += 50;
        }

        // Apply deduction
        onGainXP(-xpToDeduct);
        setProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  // --- RENDERING HELPERS ---

  const getPlatformIcon = (p: Platform) => {
    switch (p) {
        case 'tiktok': return <Smartphone size={14} className="text-pink-500" />;
        case 'twitch': return <Video size={14} className="text-purple-500" />;
        case 'youtube': return <Video size={14} className="text-red-500" />;
        case 'kick': return <div className="w-3.5 h-3.5 bg-green-500 rounded-sm" />;
        default: return <Video size={14} />;
    }
  };

  const renderColumn = (status: ProjectStatus, title: string) => {
    const colProjects = projects.filter(p => p.status === status);

    return (
        <div className="min-w-[280px] w-full max-w-[350px] flex flex-col bg-cyber-800/50 rounded-xl border border-cyber-700/50">
            <div className="p-4 border-b border-cyber-700/50 flex justify-between items-center bg-cyber-900/30 rounded-t-xl">
                <span className="font-display font-bold text-gray-200">{title}</span>
                <span className="bg-cyber-700 text-xs px-2 py-0.5 rounded-full text-gray-300">{colProjects.length}</span>
            </div>
            
            <div className="p-3 flex-1 overflow-y-auto space-y-3 min-h-[200px]">
                {colProjects.length === 0 && (
                    <div className="h-full border-2 border-dashed border-cyber-700/50 rounded-lg flex items-center justify-center text-gray-600 text-sm p-4 text-center opacity-50">
                        {t.studio.emptySlot}
                    </div>
                )}
                {colProjects.map((p) => (
                    <div 
                        key={p.id} 
                        onClick={() => setSelectedProject(p)}
                        className="bg-cyber-800 p-4 rounded-lg border border-cyber-700 shadow-lg group hover:border-cyber-cyan/50 hover:bg-cyber-700/50 transition-all cursor-pointer relative"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-mono text-cyber-cyan bg-cyber-900/80 px-1.5 py-0.5 rounded">{p.category}</span>
                            {getPlatformIcon(p.platform)}
                        </div>
                        <h4 className="font-medium text-gray-100 text-sm leading-tight mb-4">{p.title}</h4>
                        
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-cyber-700/50">
                            {/* DELETE ACTION - Stop Propagation to prevent opening modal */}
                            <button 
                                onClick={(e) => { e.stopPropagation(); deleteProject(p.id); }}
                                className="text-gray-600 hover:text-red-500 transition-colors p-1.5"
                                title={t.studio.actions.delete}
                            >
                                <Trash2 size={16} />
                            </button>

                            {/* MOVE ACTIONS - Stop Propagation */}
                            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                {/* MOVE BACK */}
                                {status !== 'idea' && (
                                    <button 
                                        onClick={() => moveProjectBack(p.id, status)} 
                                        className="text-gray-400 hover:text-white bg-gray-700/50 hover:bg-gray-700 p-1.5 rounded transition-all"
                                        title={t.studio.actions.move}
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                )}

                                {/* MOVE FORWARD */}
                                {status === 'idea' && (
                                    <button onClick={() => moveProject(p.id, 'recording')} className="text-cyber-purple hover:text-white bg-cyber-purple/10 hover:bg-cyber-purple p-1.5 rounded transition-all">
                                        <Video size={16} />
                                    </button>
                                )}
                                {status === 'recording' && (
                                    <button onClick={() => moveProject(p.id, 'editing')} className="text-cyber-cyan hover:text-black bg-cyber-cyan/10 hover:bg-cyber-cyan p-1.5 rounded transition-all">
                                        <Scissors size={16} />
                                    </button>
                                )}
                                {status === 'editing' && (
                                    <button onClick={() => moveProject(p.id, 'ready')} className="text-green-400 hover:text-black bg-green-400/10 hover:bg-green-400 p-1.5 rounded transition-all">
                                        <Upload size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col relative">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h2 className="text-2xl font-display text-white flex items-center gap-2">
                <Video className="text-cyber-purple" /> {t.studio.title}
            </h2>
            <p className="text-gray-400 text-sm">{t.studio.subtitle}</p>
        </div>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan hover:bg-cyber-cyan hover:text-black transition-all px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold"
        >
            <Plus size={16} /> {t.studio.newIdea}
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 h-full">
        {renderColumn('idea', t.studio.cols.idea)}
        {renderColumn('recording', t.studio.cols.recording)}
        {renderColumn('editing', t.studio.cols.editing)}
        {renderColumn('ready', t.studio.cols.ready)}
      </div>

      {/* CREATE MODAL */}
      {isModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-cyber-900 border border-cyber-700 rounded-xl w-full max-w-md p-6 shadow-2xl animate-fade-in">
                  <h3 className="text-xl font-display text-white mb-4">{t.studio.addModal.title}</h3>
                  
                  <div className="space-y-4">
                      <div>
                          <label className="block text-xs text-gray-500 mb-1">PLATFORM</label>
                          <div className="flex gap-2">
                              {(['twitch', 'tiktok', 'youtube', 'kick'] as Platform[]).map(p => (
                                  <button
                                    key={p}
                                    onClick={() => setNewPlatform(p)}
                                    className={`px-3 py-2 rounded border text-sm capitalize ${newPlatform === p ? 'bg-cyber-cyan text-black border-cyber-cyan' : 'bg-cyber-800 border-cyber-700 text-gray-400'}`}
                                  >
                                      {p}
                                  </button>
                              ))}
                          </div>
                      </div>
                      
                      <input 
                        type="text" 
                        placeholder={t.studio.addModal.inputTitle}
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full bg-cyber-800 border border-cyber-700 rounded p-3 text-white focus:border-cyber-cyan outline-none"
                      />

                      <input 
                        type="text" 
                        placeholder={t.studio.addModal.inputCategory}
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full bg-cyber-800 border border-cyber-700 rounded p-3 text-white focus:border-cyber-cyan outline-none"
                      />
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                      <button 
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 rounded text-gray-400 hover:text-white"
                      >
                          {t.studio.addModal.btnCancel}
                      </button>
                      <button 
                        onClick={addProject}
                        className="bg-cyber-cyan text-black px-6 py-2 rounded font-bold hover:bg-white transition-colors"
                      >
                          {t.studio.addModal.btnCreate}
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* DEEP DIVE MODAL */}
      {selectedProject && (
          <StudioDetailModal 
            project={selectedProject} 
            lang={lang} 
            onClose={() => setSelectedProject(null)} 
            onUpdate={updateProject}
          />
      )}
    </div>
  );
};

export default Studio;
