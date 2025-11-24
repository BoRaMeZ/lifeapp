
export type Language = 'en' | 'es';

export type ProjectStatus = 'idea' | 'recording' | 'editing' | 'ready';
export type Platform = 'twitch' | 'tiktok' | 'youtube' | 'kick';

export interface ProjectCard {
  id: string;
  title: string;
  category: string; // Game or Topic (e.g., "Fortnite", "Tech News")
  platform: Platform;
  status: ProjectStatus;
  createdAt: number;
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

export enum AppTab {
  DASHBOARD = 'DASHBOARD',
  AGENDA = 'AGENDA',
  STUDIO = 'STUDIO',
  BASE_OPS = 'BASE_OPS',
  AI_COACH = 'AI_COACH',
}
