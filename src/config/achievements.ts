import type { Achievement, DailyLog } from '@/lib/types';
import { CheckCircle, Star, Zap, Brain, TrendingUp } from 'lucide-react';

export const achievements: Achievement[] = [
  {
    id: 'first_log',
    name: 'First Step Taken',
    description: 'Logged your first day!',
    icon: Star,
    check: (logs: DailyLog[]) => logs.length >= 1,
  },
  {
    id: 'consistent_week',
    name: 'Consistent Week',
    description: 'Logged 7 consecutive days.',
    icon: CheckCircle,
    check: (logs: DailyLog[]) => {
      if (logs.length < 7) return false;
      const sortedLogs = [...logs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      for (let i = 0; i <= sortedLogs.length - 7; i++) {
        let consecutive = true;
        for (let j = 0; j < 6; j++) {
          const day1 = new Date(sortedLogs[i + j].date);
          const day2 = new Date(sortedLogs[i + j + 1].date);
          const diffTime = Math.abs(day2.getTime() - day1.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays !== 1) {
            consecutive = false;
            break;
          }
        }
        if (consecutive) return true;
      }
      return false;
    },
  },
  {
    id: 'high_energy_day',
    name: 'Energy Surge',
    description: 'Completed a day with an energy rating of 8+.',
    icon: Zap,
    check: (logs: DailyLog[]) => logs.some(log => log.energyLevelRating >= 8),
  },
  {
    id: 'peak_focus_day',
    name: 'Laser Focus',
    description: 'Completed a day with a focus rating of 8+.',
    icon: Brain,
    check: (logs: DailyLog[]) => logs.some(log => log.focusQualityRating >= 8),
  },
  {
    id: '20_hours_week',
    name: 'Solid Week',
    description: 'Completed 20 study hours in a week.',
    icon: TrendingUp,
    check: (logs: DailyLog[]) => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const recentLogs = logs.filter(log => new Date(log.date) >= oneWeekAgo);
      const totalHours = recentLogs.reduce((sum, log) => sum + log.hoursCompleted, 0);
      return totalHours >= 20;
    },
  },
];
