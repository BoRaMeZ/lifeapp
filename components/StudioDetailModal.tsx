
import React, { useState, useRef } from 'react';
import { ProjectCard, Language, ScriptData, VisionAnalysis } from '../types';
import { generateVideoScript, analyzeThumbnail } from '../services/geminiService';
import { X, Bot, Sparkles, Save, FileText, LayoutTemplate, Copy, Eye, Upload, Image as ImageIcon } from 'lucide-react';
import { getTranslation } from '../utils/translations';

interface StudioDetailModalProps {
  project: ProjectCard;
  lang: Language;
  onClose: () => void;
  onUpdate: (updatedProject: ProjectCard) => void;
}

const StudioDetailModal: React.FC<StudioDetailModalProps> = ({ project, lang, onClose, onUpdate }) => {
  const t = getTranslation(lang);
  const [activeTab, setActiveTab] = useState<'details' | 'script' | 'vision'>('details');
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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

  // Vision Data State
  const [visionData, setVisionData] = useState<VisionAnalysis | undefined>(project.visionAnalysis);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleSave = () => {
      onUpdate({
          ...project,
          title,
          category,
          script: scriptData,
          visionAnalysis: visionData
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

  const handleVisionUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = async () => {
          const base64 = reader.result as string;
          setPreviewImage(base64);
          setIsGenerating(true);
          const analysis = await analyzeThumbnail(base64, lang);
          setVisionData(analysis);
          setIsGenerating(false);
      };
      reader.readAsDataURL(file);
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
                <button 
                    onClick={() => setActiveTab('vision')}
                    className={`flex-1 py-3 font-bold text-sm flex items-center justify-center gap-2 transition-colors ${activeTab === 'vision' ? 'text-pink-500 border-b-2 border-pink-500 bg-pink-500/5' : 'text-gray-500 hover:text-white'}`}
                >
                    <Eye size={16} /> {t.studio.detail.tabs.vision}
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-cyber-900">
                
                {/* --- DETAILS TAB --- */}
                {activeTab === 'details' && (
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
                )}

                {/* --- SCRIPT TAB --- */}
                {activeTab === 'script' && (
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

                {/* --- VISION TAB --- */}
                {activeTab === 'vision' && (
                    <div className="h-full flex flex-col md:flex-row gap-6">
                         <div className="md:w-1/2 flex flex-col gap-4">
                             <div 
                                className="flex-1 bg-cyber-900 border-2 border-dashed border-cyber-700 rounded-xl flex items-center justify-center relative cursor-pointer hover:border-pink-500 transition-colors group overflow-hidden"
                                onClick={() => fileInputRef.current?.click()}
                             >
                                 {previewImage ? (
                                     <img src={previewImage} alt="Preview" className="w-full h-full object-contain" />
                                 ) : (
                                     <div className="text-center p-6">
                                         <ImageIcon size={48} className="mx-auto text-gray-600 group-hover:text-pink-500 mb-2 transition-colors" />
                                         <p className="text-gray-400 font-bold">{t.studio.detail.vision.upload}</p>
                                         <p className="text-xs text-gray-600">{t.studio.detail.vision.drop}</p>
                                     </div>
                                 )}
                                 <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleVisionUpload} 
                                    accept="image/*" 
                                    className="hidden" 
                                />
                                {isGenerating && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                                        <div className="bg-cyber-900 border border-pink-500 rounded-lg p-4 flex items-center gap-3">
                                            <div className="animate-spin w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full"></div>
                                            <span className="text-pink-500 font-mono text-sm">{t.studio.detail.vision.analyzing}</span>
                                        </div>
                                    </div>
                                )}
                             </div>
                         </div>

                         <div className="md:w-1/2 bg-cyber-800/50 border border-cyber-700 rounded-xl p-6 overflow-y-auto">
                             {visionData ? (
                                 <div className="space-y-6">
                                     <div className="flex items-center justify-between">
                                         <h3 className="text-pink-500 font-bold uppercase tracking-wider">{t.studio.detail.vision.score}</h3>
                                         <div className="text-3xl font-display font-bold text-white">{visionData.score}/100</div>
                                     </div>
                                     <div className="h-2 bg-cyber-900 rounded-full overflow-hidden">
                                         <div 
                                            className={`h-full transition-all duration-1000 ${visionData.score > 80 ? 'bg-green-500' : visionData.score > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                            style={{ width: `${visionData.score}%` }}
                                         ></div>
                                     </div>

                                     <div className="p-4 bg-cyber-900/50 rounded-lg border border-cyber-700/50">
                                         <p className="text-gray-200 italic">"{visionData.critique}"</p>
                                     </div>

                                     <div>
                                         <h4 className="text-xs text-gray-500 uppercase mb-2">Improvements</h4>
                                         <ul className="space-y-2">
                                             {visionData.improvements.map((imp, i) => (
                                                 <li key={i} className="flex gap-2 text-sm text-gray-300">
                                                     <span className="text-pink-500 font-bold">•</span>
                                                     {imp}
                                                 </li>
                                             ))}
                                         </ul>
                                     </div>
                                 </div>
                             ) : (
                                 <div className="h-full flex flex-col items-center justify-center text-gray-500">
                                     <Eye size={32} className="mb-2 opacity-50"/>
                                     <p>{t.studio.detail.waiting}</p>
                                 </div>
                             )}
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
