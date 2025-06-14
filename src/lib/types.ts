import type { GenerateDailyScheduleOutput } from '@/ai/flows/daily-schedule-generator';
import type { PersonalizedTipOutput } from '@/ai/flows/personalized-tips-generator';

export interface DailyLog {
  date: string; // YYYY-MM-DD
  energyLevelRating: number; // 1-10
  focusQualityRating: number; // 1-10
  hoursPlanned?: number; 
  hoursCompleted: number;
  notes?: string; 
  generatedSchedule?: GenerateDailyScheduleOutput;
  generatedTip?: PersonalizedTipOutput;
  dailyInputEnergyLevel: string;
  dailyInputFocusQuality: string;
  dailyInputTimeOfDay: string;
  dailyInputAcademicLoad: string;
  dailyInputCurrentState: string;
  dailyInputChallenges: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  check: (logs: DailyLog[]) => boolean;
}

export type AppData = {
  dailyLogs: DailyLog[];
  unlockedAchievements: string[];
};
