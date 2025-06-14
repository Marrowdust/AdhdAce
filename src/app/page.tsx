'use client';

import { useState, useEffect, useCallback } from 'react';
import { SiteHeader } from '@/components/SiteHeader';
import { DailyInputForm } from '@/components/DailyInputForm';
import { ScheduleDisplay } from '@/components/ScheduleDisplay';
import { TipDisplay } from '@/components/TipDisplay';
import { ProgressSection } from '@/components/ProgressSection';
import { AchievementsSection } from '@/components/AchievementsSection';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { generateDailySchedule, GenerateDailyScheduleOutput, GenerateDailyScheduleInput } from '@/ai/flows/daily-schedule-generator';
import { generatePersonalizedTip, PersonalizedTipOutput, PersonalizedTipInput } from '@/ai/flows/personalized-tips-generator';
import type { DailyLog, AppData } from '@/lib/types';
import { achievements as achievementConfig } from '@/config/achievements';
import { format } from 'date-fns';
import { Loader2, RefreshCw } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'adhdAceData';

export default function Home() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true); // For initial data load
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [currentSchedule, setCurrentSchedule] = useState<GenerateDailyScheduleOutput | undefined>(undefined);
  const [currentTip, setCurrentTip] = useState<PersonalizedTipOutput | undefined>(undefined);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);

  const [lastAiInputs, setLastAiInputs] = useState<GenerateDailyScheduleInput & PersonalizedTipInput | undefined>(undefined);

  const loadData = useCallback(() => {
    setIsLoading(true);
    try {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedData) {
        const parsedData: AppData = JSON.parse(storedData);
        setDailyLogs(parsedData.dailyLogs || []);
        setUnlockedAchievements(parsedData.unlockedAchievements || []);
        
        // Load last AI inputs if available to prefill form
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        const todayLog = parsedData.dailyLogs?.find(log => log.date === todayStr);
        if (todayLog && todayLog.dailyInputAcademicLoad) { // Check one field as proxy
            setLastAiInputs({
                energyLevel: todayLog.dailyInputEnergyLevel,
                focusQuality: todayLog.dailyInputFocusQuality,
                timeOfDay: todayLog.dailyInputTimeOfDay,
                academicLoad: todayLog.dailyInputAcademicLoad,
                currentState: todayLog.dailyInputCurrentState,
                challenges: todayLog.dailyInputChallenges,
            });
            if (todayLog.generatedSchedule) setCurrentSchedule(todayLog.generatedSchedule);
            if (todayLog.generatedTip) setCurrentTip(todayLog.generatedTip);
        }

      }
    } catch (error) {
      console.error("Failed to load data from localStorage:", error);
      toast({ title: "Error", description: "Could not load saved data.", variant: "destructive" });
    }
    setIsLoading(false);
  }, [toast]);

  const saveData = useCallback(() => {
    try {
      const dataToStore: AppData = { dailyLogs, unlockedAchievements };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToStore));
    } catch (error) {
      console.error("Failed to save data to localStorage:", error);
      toast({ title: "Error", description: "Could not save data.", variant: "destructive" });
    }
  }, [dailyLogs, unlockedAchievements, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!isLoading) { // Only save if not in initial load phase
        saveData();
        // Check for new achievements
        const newlyUnlocked = achievementConfig
          .filter(ach => !unlockedAchievements.includes(ach.id) && ach.check(dailyLogs))
          .map(ach => ach.id);
        
        if (newlyUnlocked.length > 0) {
          setUnlockedAchievements(prev => [...prev, ...newlyUnlocked]);
          newlyUnlocked.forEach(id => {
            const ach = achievementConfig.find(a => a.id === id);
            toast({ title: "Achievement Unlocked!", description: ach?.name || "Great job!" });
          });
        }
    }
  }, [dailyLogs, unlockedAchievements, saveData, toast, isLoading]);


  const handleGenerate = async (data: GenerateDailyScheduleInput & PersonalizedTipInput) => {
    setIsGenerating(true);
    setLastAiInputs(data);
    try {
      const [scheduleResponse, tipResponse] = await Promise.all([
        generateDailySchedule({
          energyLevel: data.energyLevel,
          focusQuality: data.focusQuality,
          timeOfDay: data.timeOfDay,
          academicLoad: data.academicLoad,
        }),
        generatePersonalizedTip({
          currentState: data.currentState,
          timeOfDay: data.timeOfDay,
          challenges: data.challenges,
        }),
      ]);

      setCurrentSchedule(scheduleResponse);
      setCurrentTip(tipResponse);

      toast({ title: "Success!", description: "Your schedule and tip have been generated." });
    } catch (error) {
      console.error("AI Generation Error:", error);
      toast({ title: "AI Error", description: "Failed to generate schedule or tip. Please try again.", variant: "destructive" });
    }
    setIsGenerating(false);
  };

  const handleLogMetrics = (data: Omit<DailyLog, 'date' | 'generatedSchedule' | 'generatedTip' | 'dailyInputEnergyLevel' | 'dailyInputFocusQuality' | 'dailyInputTimeOfDay' | 'dailyInputAcademicLoad' | 'dailyInputCurrentState' | 'dailyInputChallenges'>) => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    
    // Estimate planned hours from schedule string (very basic)
    let plannedHours = 0;
    if (currentSchedule?.schedule) {
        const hourMatches = currentSchedule.schedule.match(/(\d+(\.\d+)?)\s*hour/gi);
        if (hourMatches) {
            plannedHours = hourMatches.reduce((sum, match) => sum + parseFloat(match), 0);
        }
    }

    const newLog: DailyLog = {
      ...data,
      date: todayStr,
      generatedSchedule: currentSchedule,
      generatedTip: currentTip,
      hoursPlanned: plannedHours,
      // Store the inputs that generated this day's schedule/tip
      dailyInputEnergyLevel: lastAiInputs?.energyLevel || '',
      dailyInputFocusQuality: lastAiInputs?.focusQuality || '',
      dailyInputTimeOfDay: lastAiInputs?.timeOfDay || '',
      dailyInputAcademicLoad: lastAiInputs?.academicLoad || '',
      dailyInputCurrentState: lastAiInputs?.currentState || '',
      dailyInputChallenges: lastAiInputs?.challenges || '',
    };

    setDailyLogs(prevLogs => {
      const existingLogIndex = prevLogs.findIndex(log => log.date === todayStr);
      if (existingLogIndex > -1) {
        const updatedLogs = [...prevLogs];
        updatedLogs[existingLogIndex] = { ...updatedLogs[existingLogIndex], ...newLog };
        return updatedLogs;
      }
      return [...prevLogs, newLog];
    });
    toast({ title: "Metrics Logged!", description: "Your daily progress has been saved." });
  };
  
  const clearTodayState = () => {
    setCurrentSchedule(undefined);
    setCurrentTip(undefined);
    // Optionally clear lastAiInputs if you want the form to reset fully
    // setLastAiInputs(undefined); 
    toast({ title: "Cleared", description: "Today's generated schedule and tip have been cleared." });
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SiteHeader />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 space-y-8">
        <DailyInputForm onGenerate={handleGenerate} onLogMetrics={handleLogMetrics} isGenerating={isGenerating} defaultValuesAI={lastAiInputs} />
        
        {(currentSchedule || currentTip) && (
          <div className="text-right">
            <Button variant="outline" onClick={clearTodayState} size="sm">
              <RefreshCw className="mr-2 h-4 w-4" /> Clear Today's Plan
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ScheduleDisplay scheduleData={currentSchedule} />
          </div>
          <div className="space-y-6">
            <TipDisplay tipData={currentTip} />
          </div>
        </div>
        
        <ProgressSection dailyLogs={dailyLogs} />
        <AchievementsSection dailyLogs={dailyLogs} unlockedAchievementIds={unlockedAchievements} />
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} ADHD Ace. All rights reserved.
      </footer>
    </div>
  );
}
