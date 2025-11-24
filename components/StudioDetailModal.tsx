
import React, { useState } from 'react';
import { ProjectCard, Language, ScriptData } from '../types';
import { generateVideoScript } from '../services/geminiService';
import { X, Bot, Sparkles, Save, FileText, LayoutTemplate, Copy } from 'lucide-react';
import { getTranslation } from '../utils/translations';

interface StudioDetailModalProps {
  project: ProjectCard;
  lang: Language;
  onClose: () => void;
  onUpdate: (updatedProject: ProjectCard) => void;
}

const StudioDetailModal: React.FC<StudioDetailModalProps> = ({ project, lang, onClose, onUpdate }) => {
  const t = getTranslation(lang);
  const [activeTab, setActiveTab] = useState<'details' | 'script'>('details');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Local State for edits
  const [title, setTitle] = useState(project.title);
  const [category, setCategory] = useState(project.category);
  
  // Script Data State
  const [scriptData, setScriptData] = useState<ScriptData>(project.script || {
      vibe: t.studio.detail.options.vibe.funny,
      context: '',
      goal: t.studio.detail.options.goal.engagement,
      generatedContent: ''
  });

  const handleSave = () => {
      onUpdate({
          ...project,
          title,
          category,
          script: scriptData
      });
      onClose();
  };

  const handleGenerateScript = async () => {
      if (!scriptData.context) return;
      setIsGenerating(true);
      const content = await generateVideoScript(project, scriptData, lang);
      setScriptData(prev => ({ ...prev, generatedContent: content }));
      setIsGenerating(false);
  };

  const copyScript = () => {
      if (scriptData.generatedContent) {
          navigator.clipboard.writeText(scriptData.generatedContent);
      }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-cyber-900 border border-cyber-700 w-full max-w-4xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            
            {/* Header */}
            <div className="p-4 border-b border-cyber-700 flex justify-between items-center bg-cyber-800">
                <div>
                    <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                        {project.title}
                        <span className="text-xs font-mono bg-cyber-700 px-2 py-1 rounded text-cyber-cyan">{project.platform}</span>
                    </h2>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={24}/></button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-cyber-700 bg-cyber-900">
                <button 
                    onClick={() => setActiveTab('details')}
                    className={`flex-1 py-3 font-bold text-sm flex items-center justify-center gap-2 transition-colors ${activeTab === 'details' ? 'text-cyber-cyan border-b-2 border-cyber-cyan bg-cyber-cyan/5' : 'text-gray-500 hover:text-white'}`}
                >
                    <LayoutTemplate size={16} /> {t.studio.detail.tabs.details}
                </button>
                <button 
                    onClick={() => setActiveTab('script')}
                    className={`flex-1 py-3 font-bold text-sm flex items-center justify-center gap-2 transition-colors ${activeTab === 'script' ? 'text-cyber-purple border-b-2 border-cyber-purple bg-cyber-purple/5' : 'text-gray-500 hover:text-white'}`}
                >
                    <Bot size={16} /> {t.studio.detail.tabs.script}
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-cyber-900">
                {activeTab === 'details' ? (
                    <div className="space-y-6 max-w-lg mx-auto">
                        <div>
                            <label className="text-xs text-gray-500 uppercase mb-1 block">Title</label>
                            <input 
                                type="text" 
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="w-full bg-cyber-800 border border-cyber-700 rounded p-3 text-white focus:border-cyber-cyan outline-none font-bold"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 uppercase mb-1 block">Category</label>
                            <input 
                                type="text" 
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                className="w-full bg-cyber-800 border border-cyber-700 rounded p-3 text-white focus:border-cyber-cyan outline-none"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                        {/* Form Side */}
                        <div className="space-y-4">
                            <div className="bg-cyber-800/50 p-4 rounded-xl border border-cyber-700">
                                <h3 className="text-cyber-purple font-bold mb-4 flex items-center gap-2">
                                    <Sparkles size={16} /> {t.studio.detail.mentalBlock}
                                </h3>
                                
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs text-gray-400 uppercase">{t.studio.detail.vibe}</label>
                                        <select 
                                            value={scriptData.vibe}
                                            onChange={e => setScriptData({...scriptData, vibe: e.target.value})}
                                            className="w-full bg-cyber-900 border border-cyber-700 rounded p-2 text-white text-sm outline-none focus:border-cyber-purple"
                                        >
                                            <option value={t.studio.detail.options.vibe.funny}>{t.studio.detail.options.vibe.funny}</option>
                                            <option value={t.studio.detail.options.vibe.serious}>{t.studio.detail.options.vibe.serious}</option>
                                            <option value={t.studio.detail.options.vibe.rage}>{t.studio.detail.options.vibe.rage}</option>
                                            <option value={t.studio.detail.options.vibe.chill}>{t.studio.detail.options.vibe.chill}</option>
                                            <option value={t.studio.detail.options.vibe.epic}>{t.studio.detail.options.vibe.epic}</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 uppercase">{t.studio.detail.goal}</label>
                                        <select 
                                            value={scriptData.goal}
                                            onChange={e => setScriptData({...scriptData, goal: e.target.value})}
                                            className="w-full bg-cyber-900 border border-cyber-700 rounded p-2 text-white text-sm outline-none focus:border-cyber-purple"
                                        >
                                            <option value={t.studio.detail.options.goal.engagement}>{t.studio.detail.options.goal.engagement}</option>
                                            <option value={t.studio.detail.options.goal.viral}>{t.studio.detail.options.goal.viral}</option>
                                            <option value={t.studio.detail.options.goal.followers}>{t.studio.detail.options.goal.followers}</option>
                                            <option value={t.studio.detail.options.goal.sales}>{t.studio.detail.options.goal.sales}</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 uppercase">{t.studio.detail.context}</label>
                                        <textarea 
                                            value={scriptData.context}
                                            onChange={e => setScriptData({...scriptData, context: e.target.value})}
                                            className="w-full bg-cyber-900 border border-cyber-700 rounded p-2 text-white text-sm outline-none focus:border-cyber-purple h-24 resize-none"
                                            placeholder={lang === 'es' ? "Aterricé en Pisos Picados y encontré una Scar dorada..." : "I landed in Tilted Towers and found a gold scar immediately..."}
                                        />
                                    </div>

                                    <button 
                                        onClick={handleGenerateScript}
                                        disabled={isGenerating || !scriptData.context}
                                        className="w-full bg-cyber-purple text-white font-bold py-3 rounded-lg hover:bg-cyber-purple/80 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isGenerating ? <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"/> : <Sparkles size={18} />}
                                        {isGenerating ? t.studio.detail.generating : t.studio.detail.generate}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Result Side */}
                        <div className="bg-cyber-800/50 p-4 rounded-xl border border-cyber-700 flex flex-col h-full min-h-[300px]">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs text-gray-400 uppercase">{t.studio.detail.scriptLabel}</label>
                                {scriptData.generatedContent && (
                                    <button onClick={copyScript} className="text-gray-400 hover:text-white" title="Copy">
                                        <Copy size={16} />
                                    </button>
                                )}
                            </div>
                            <div className="flex-1 bg-cyber-900 rounded-lg p-4 border border-cyber-700/50 overflow-y-auto">
                                {scriptData.generatedContent ? (
                                    <div className="prose prose-invert prose-sm whitespace-pre-wrap font-mono">
                                        {scriptData.generatedContent}
                                    </div>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-gray-600 text-sm italic text-center">
                                        {t.studio.detail.waiting}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-cyber-700 bg-cyber-800 flex justify-end gap-3">
                <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white text-sm">{t.studio.detail.close}</button>
                <button onClick={handleSave} className="bg-cyber-cyan text-black px-6 py-2 rounded font-bold hover:bg-white transition-colors flex items-center gap-2">
                    <Save size={16} /> {t.studio.detail.save}
                </button>
            </div>

        </div>
    </div>
  );
};

export default StudioDetailModal;
