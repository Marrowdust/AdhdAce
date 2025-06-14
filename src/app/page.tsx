
'use client';

import { useState, useEffect, useCallback } from 'react';
import { SiteHeader } from '@/components/SiteHeader';
import { DailyInputForm, AiInputFormValues as DailyInputFormAiValues } from '@/components/DailyInputForm';
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

const LOCAL_STORAGE_KEY = 'adhdAceDataV2'; // Incremented version for new data structure

// Combine AI input types for easier state management
type CombinedAiInputs = GenerateDailyScheduleInput & PersonalizedTipInput;

export default function Home() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [currentSchedule, setCurrentSchedule] = useState<GenerateDailyScheduleOutput | undefined>(undefined);
  const [currentTip, setCurrentTip] = useState<PersonalizedTipOutput | undefined>(undefined);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);

  const [lastAiInputs, setLastAiInputs] = useState<Partial<CombinedAiInputs> | undefined>(undefined);

  const loadData = useCallback(() => {
    setIsLoading(true);
    try {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedData) {
        const parsedData: AppData = JSON.parse(storedData);
        setDailyLogs(parsedData.dailyLogs || []);
        setUnlockedAchievements(parsedData.unlockedAchievements || []);
        
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        const todayLog = parsedData.dailyLogs?.find(log => log.date === todayStr);

        if (todayLog) {
            setLastAiInputs({
                energyLevel: todayLog.dailyInputEnergyLevel,
                focusQuality: todayLog.dailyInputFocusQuality,
                timeOfDay: todayLog.dailyInputTimeOfDay,
                academicLoad: todayLog.dailyInputAcademicLoad,
                currentState: todayLog.dailyInputCurrentState,
                challenges: todayLog.dailyInputChallenges,
                currentHour: todayLog.dailyInputCurrentHour,
                hoursBeforeSleep: todayLog.dailyInputHoursBeforeSleep,
                sleepinessLevel: todayLog.dailyInputSleepinessLevel,
                isMedicated: todayLog.dailyInputIsMedicated,
            });
            if (todayLog.generatedSchedule) setCurrentSchedule(todayLog.generatedSchedule);
            if (todayLog.generatedTip) setCurrentTip(todayLog.generatedTip);
        } else {
            // Set defaults if no log for today, especially for new fields
            const currentHour = new Date().getHours();
            setLastAiInputs(prev => ({
                ...prev,
                currentHour: currentHour,
                timeOfDay: prev?.timeOfDay || (currentHour >= 5 && currentHour < 12 ? 'Morning' : currentHour >= 12 && currentHour < 18 ? 'Afternoon' : 'Evening'),
                sleepinessLevel: prev?.sleepinessLevel || 'Not Sleepy',
                isMedicated: prev?.isMedicated === undefined ? false : prev.isMedicated, // Default to false if undefined
            }));
        }
      } else {
        // Initialize with dynamic defaults if no stored data at all
        const currentHour = new Date().getHours();
        setLastAiInputs({
            currentHour: currentHour,
            timeOfDay: currentHour >= 5 && currentHour < 12 ? 'Morning' : currentHour >= 12 && currentHour < 18 ? 'Afternoon' : 'Evening',
            energyLevel: 'Average',
            focusQuality: 'Medium',
            academicLoad: 'Medium',
            sleepinessLevel: 'Not Sleepy',
            isMedicated: false,
            currentState: '',
            challenges: '',
        });
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
    if (!isLoading) { 
        saveData();
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


  const handleGenerate = async (data: DailyInputFormAiValues) => {
    setIsGenerating(true);
    
    // Ensure isMedicated is boolean, and currentHour is set
    const fullAiInputs: CombinedAiInputs = {
      ...data,
      isMedicated: data.isMedicated === 'yes', // DailyInputForm uses string 'yes'/'no'
      currentHour: data.currentHour !== undefined ? data.currentHour : new Date().getHours(),
      hoursBeforeSleep: data.hoursBeforeSleep === undefined || isNaN(data.hoursBeforeSleep) ? undefined : Number(data.hoursBeforeSleep),
    };
    setLastAiInputs(fullAiInputs);


    try {
      const [scheduleResponse, tipResponse] = await Promise.all([
        generateDailySchedule(fullAiInputs),
        generatePersonalizedTip(fullAiInputs),
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

  const handleLogMetrics = (data: Omit<DailyLog, 'date' | 'generatedSchedule' | 'generatedTip' | 
    'dailyInputEnergyLevel' | 'dailyInputFocusQuality' | 'dailyInputTimeOfDay' | 'dailyInputAcademicLoad' | 
    'dailyInputCurrentState' | 'dailyInputChallenges' | 'dailyInputCurrentHour' | 'dailyInputHoursBeforeSleep' |
    'dailyInputSleepinessLevel' | 'dailyInputIsMedicated'
  >) => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    
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
      dailyInputEnergyLevel: lastAiInputs?.energyLevel || 'Average',
      dailyInputFocusQuality: lastAiInputs?.focusQuality || 'Medium',
      dailyInputTimeOfDay: lastAiInputs?.timeOfDay || 'Morning',
      dailyInputAcademicLoad: lastAiInputs?.academicLoad || 'Medium',
      dailyInputCurrentState: lastAiInputs?.currentState || '',
      dailyInputChallenges: lastAiInputs?.challenges || '',
      dailyInputCurrentHour: lastAiInputs?.currentHour !== undefined ? lastAiInputs.currentHour : new Date().getHours(),
      dailyInputHoursBeforeSleep: lastAiInputs?.hoursBeforeSleep,
      dailyInputSleepinessLevel: lastAiInputs?.sleepinessLevel || 'Not Sleepy',
      dailyInputIsMedicated: lastAiInputs?.isMedicated || false,
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
    // Keep lastAiInputs to prefill the form, user might want to regenerate with slight tweaks
    toast({ title: "Cleared", description: "Today's generated schedule and tip have been cleared." });
  };

  const defaultFormValuesForAi = lastAiInputs ? {
      ...lastAiInputs,
      // Ensure isMedicated is in 'yes'/'no' string format for the form's RadioGroup
      isMedicated: typeof lastAiInputs.isMedicated === 'boolean' ? (lastAiInputs.isMedicated ? 'yes' : 'no') : 'no',
  } : undefined;


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 space-y-8">
        <DailyInputForm 
            onGenerate={handleGenerate} 
            onLogMetrics={handleLogMetrics} 
            isGenerating={isGenerating} 
            defaultValuesAI={defaultFormValuesForAi} 
        />
        
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
