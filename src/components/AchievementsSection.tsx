'use client';

import type { DailyLog, Achievement as AchievementType } from '@/lib/types';
import { achievements as achievementConfig } from '@/config/achievements';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Lock } from 'lucide-react';
import { useMemo } from 'react';

interface AchievementsSectionProps {
  dailyLogs: DailyLog[];
  unlockedAchievementIds: string[];
}

export function AchievementsSection({ dailyLogs, unlockedAchievementIds }: AchievementsSectionProps) {
  
  const processedAchievements = useMemo(() => {
    return achievementConfig.map(ach => ({
      ...ach,
      isUnlocked: unlockedAchievementIds.includes(ach.id) || ach.check(dailyLogs),
    }));
  }, [dailyLogs, unlockedAchievementIds]);

  const unlockedCount = processedAchievements.filter(a => a.isUnlocked).length;
  const totalCount = processedAchievements.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
          <Award className="mr-2 h-5 w-5 text-primary" />
          Achievements
          <Badge variant="secondary" className="ml-auto">{unlockedCount}/{totalCount}</Badge>
        </CardTitle>
        <CardDescription>Celebrate your progress and consistency!</CardDescription>
      </CardHeader>
      <CardContent>
        {processedAchievements.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {processedAchievements.map((ach) => (
              <Card 
                key={ach.id} 
                className={`p-4 flex flex-col items-center text-center transition-all duration-300 ${
                  ach.isUnlocked ? 'border-primary shadow-lg transform hover:scale-105' : 'border-muted opacity-60'
                }`}
              >
                <div className={`p-3 rounded-full mb-2 ${ach.isUnlocked ? 'bg-primary/10' : 'bg-muted'}`}>
                  {ach.isUnlocked ? 
                    <ach.icon className="h-8 w-8 text-primary" /> :
                    <Lock className="h-8 w-8 text-muted-foreground" />
                  }
                </div>
                <h3 className={`font-semibold ${ach.isUnlocked ? 'text-primary' : 'text-muted-foreground'}`}>{ach.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{ach.isUnlocked ? ach.description : "Keep going to unlock!"}</p>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No achievements configured yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
