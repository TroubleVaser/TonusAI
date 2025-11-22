export enum EmotionType {
  ANGER = 'anger',
  JOY = 'joy',
  SAD = 'sad',
  FEAR = 'fear',
  DISGUST = 'disgust',
  EMBARRASSMENT = 'embarrassment',
  ANXIETY = 'anxiety',
  ENNUI = 'ennui',
  ENVY = 'envy',
  NEUTRAL = 'neutral',
  SARCASM = 'sarcasm',
  BURNOUT = 'burnout',
  CRASHOUT = 'crashout'
}

export interface EmotionAnalysis {
  emotion: EmotionType;
  confidence: number;
  transcript: string;
  timestamp: number;
}

export interface UserSettings {
  micSensitivity: number;
  highContrast: boolean;
  reducedMotion: boolean;
  theme: 'light' | 'dark';
}

export interface DailyEntry {
  date: string;
  dominantEmotion: EmotionType;
  intensity: number; // 0-1
  entries: EmotionAnalysis[];
}

export interface GamificationState {
  points: number;
  streak: number;
  level: number;
  badges: string[];
}

export interface Task {
  id: string;
  label: string;
  completed: boolean;
  unlocksAt?: number; // Timestamp when this slot becomes available again
}

// For the Orb props
export interface OrbState {
  emotion: EmotionType;
  intensity: number; // 0 to 1 (volume/energy)
  isRecording: boolean;
}