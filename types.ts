
export type Language = 'en' | 'es';
export type Theme = 'cyber' | 'matrix' | 'sith';

export type ProjectStatus = 'idea' | 'recording' | 'editing' | 'ready';
export type Platform = 'twitch' | 'tiktok' | 'youtube' | 'kick';

export interface UserProfile {
  name: string;
  avatar: string;
}

export interface ScriptData {
  vibe: string;
  context: string;
  goal: string;
  generatedContent?: string;
}

export interface ProjectCard {
  id: string;
  title: string;
  category: string; // Game or Topic (e.g., "Fortnite", "Tech News")
  platform: Platform;
  status: ProjectStatus;
  createdAt: number;
  script?: ScriptData; // New: Stores the AI script
}

export interface AgendaItem {
  id: string;
  title: string;
  desc: string;
  startTime: string; // Format "HH:mm"
  endTime: string;
  type: 'work' | 'creative' | 'transit' | 'base' | 'learning' | 'sleep';
  completed: boolean;
  xpReward: number;
}

export interface DailyTask {
  id: string;
  title: string;
  xp: number;
  completed: boolean;
  category: 'home' | 'health' | 'admin';
  translationKey: string;
  lastCompletedDate?: string; // To reset daily
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface Badge {
  id: string;
  icon: string; // Lucide icon name or emoji
  translationKey: string;
  unlocked: boolean;
  condition: (stats: PlayerStats) => boolean;
}

export interface PlayerStats {
  level: number;
  currentXP: number;
  nextLevelXP: number;
  streak: number;
  lastLoginDate: string;
}

export interface BackupData {
  streamos_stats: string | null;
  streamos_agenda: string | null;
  streamos_projects: string | null;
  streamos_tasks: string | null;
  streamos_profile: string | null;
  streamos_lang: string | null;
  streamos_theme: string | null;
}

export enum AppTab {
  DASHBOARD = 'DASHBOARD',
  AGENDA = 'AGENDA',
  STUDIO = 'STUDIO',
  BASE_OPS = 'BASE_OPS',
  AI_COACH = 'AI_COACH',
}

// --- Web Speech API Types ---
export interface SpeechRecognition extends EventTarget {
  grammars: any;
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  serviceURI: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: (event: any) => void;
  onstart: (event: any) => void;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
