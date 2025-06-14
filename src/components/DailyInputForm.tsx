
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Zap, Brain, CalendarDays, BookOpen, AlertTriangle, Info, Edit3, Clock, Moon, Pill } from 'lucide-react';
import { useEffect, useState } from 'react';

const aiInputSchema = z.object({
  energyLevel: z.string().min(1, "Energy level is required."),
  focusQuality: z.string().min(1, "Focus quality is required."),
  timeOfDay: z.string().min(1, "Time of day is required."), 
  academicLoad: z.string().min(1, "Academic load is required."),
  currentState: z.string().min(1, "Current state is required.").max(100, "Max 100 chars"),
  challenges: z.string().min(1, "Challenges are required.").max(100, "Max 100 chars"),
  currentHour: z.number().min(0).max(23),
  hoursBeforeSleep: z.coerce.number().min(0).max(24).optional(),
  sleepinessLevel: z.string().min(1, "Sleepiness level is required."),
  isMedicated: z.enum(['yes', 'no'], { required_error: "Medication status is required." }),
});

const metricsLogSchema = z.object({
  hoursCompleted: z.coerce.number().min(0, "Hours must be positive.").max(24),
  energyLevelRating: z.coerce.number().min(1).max(10),
  focusQualityRating: z.coerce.number().min(1).max(10),
  notes: z.string().max(500, "Max 500 characters").optional().default(""),
});

export type AiInputFormValues = z.infer<typeof aiInputSchema>;
type MetricsLogFormValues = z.infer<typeof metricsLogSchema>;

interface DailyInputFormProps {
  onGenerate: (data: AiInputFormValues) => Promise<void>;
  onLogMetrics: (data: MetricsLogFormValues) => void;
  isGenerating: boolean;
  defaultValuesAI?: Partial<AiInputFormValues>;
}

export function DailyInputForm({ onGenerate, onLogMetrics, isGenerating, defaultValuesAI }: DailyInputFormProps) {
  const [dynamicCurrentHour, setDynamicCurrentHour] = useState(new Date().getHours());

  useEffect(() => {
    const timer = setInterval(() => {
      setDynamicCurrentHour(new Date().getHours());
    }, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const aiForm = useForm<AiInputFormValues>({
    resolver: zodResolver(aiInputSchema),
    defaultValues: {
      energyLevel: 'Average',
      focusQuality: 'Medium',
      timeOfDay: getTimeOfDay(dynamicCurrentHour),
      academicLoad: 'Medium',
      currentState: '',
      challenges: '',
      currentHour: dynamicCurrentHour,
      hoursBeforeSleep: undefined,
      sleepinessLevel: 'Not Sleepy',
      isMedicated: 'no',
      ...defaultValuesAI, 
      currentHour: defaultValuesAI?.currentHour !== undefined ? defaultValuesAI.currentHour : dynamicCurrentHour, 
      timeOfDay: defaultValuesAI?.timeOfDay || getTimeOfDay(defaultValuesAI?.currentHour !== undefined ? defaultValuesAI.currentHour : dynamicCurrentHour),
    },
  });

 useEffect(() => {
    // This effect ensures that 'currentHour' and 'timeOfDay' in the form
    // are always in sync with the live `dynamicCurrentHour`.
    const liveHour = new Date().getHours(); // Get the absolute current hour
    setDynamicCurrentHour(liveHour); // Update state for display elsewhere if needed
    aiForm.setValue('currentHour', liveHour);
    aiForm.setValue('timeOfDay', getTimeOfDay(liveHour));
  }, [dynamicCurrentHour, aiForm]); // Re-run if dynamicCurrentHour changes (e.g. due to interval) or aiForm instance changes (shouldn't often)


  const metricsForm = useForm<MetricsLogFormValues>({
    resolver: zodResolver(metricsLogSchema),
    defaultValues: {
      hoursCompleted: 0,
      energyLevelRating: 5,
      focusQualityRating: 5,
      notes: '',
    },
  });
  
  function getTimeOfDay(hour: number) {
    if (hour >= 5 && hour < 12) return 'Morning'; // 5 AM to 11:59 AM
    if (hour >= 12 && hour < 18) return 'Afternoon'; // 12 PM to 5:59 PM
    return 'Evening'; // 6 PM to 4:59 AM (covers overnight)
  }

  const energyLevels = [{value: "Good", label: "Good", icon: <Zap className="w-4 h-4 text-green-500" />}, {value: "Average", label: "Average", icon: <Zap className="w-4 h-4 text-yellow-500" />}, {value: "Bad", label: "Bad", icon: <Zap className="w-4 h-4 text-red-500" />}, {value: "Crisis", label: "Crisis", icon: <Zap className="w-4 h-4 text-red-700" />}];
  const focusQualities = [{value: "High", label: "High", icon: <Brain className="w-4 h-4 text-green-500" />}, {value: "Medium", label: "Medium", icon: <Brain className="w-4 h-4 text-yellow-500" />}, {value: "Low", label: "Low", icon: <Brain className="w-4 h-4 text-red-500" />}];
  const academicLoads = [{value: "High", label: "High", icon: <BookOpen className="w-4 h-4 text-red-500" />}, {value: "Medium", label: "Medium", icon: <BookOpen className="w-4 h-4 text-yellow-500" />}, {value: "Low", label: "Low", icon: <BookOpen className="w-4 h-4 text-green-500" />}];
  const sleepinessLevels = ["Not Sleepy", "Slightly Sleepy", "Moderately Sleepy", "Very Sleepy"];

  const onSubmitAiForm = (data: AiInputFormValues) => {
    onGenerate(data); // No need to convert isMedicated here if DailyInputFormAiValues matches GenerateDailyScheduleInput
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><Info className="mr-2 h-5 w-5 text-primary" />Plan Your Day</CardTitle>
          <CardDescription>
            Tell us how you're feeling to get a personalized schedule and tips. 
            The current time is approximately {String(aiForm.getValues('currentHour')).padStart(2, '0')}:00 ({aiForm.getValues('timeOfDay')}). This app aims to learn from your inputs and logged metrics to provide increasingly tailored advice over time!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...aiForm}>
            <form onSubmit={aiForm.handleSubmit(onSubmitAiForm)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  control={aiForm.control}
                  name="energyLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><Zap className="mr-1 h-4 w-4" />Energy Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select energy level" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {energyLevels.map(level => (
                            <SelectItem key={level.value} value={level.value}><span className="flex items-center">{level.icon}{level.label}</span></SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={aiForm.control}
                  name="focusQuality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><Brain className="mr-1 h-4 w-4" />Focus Quality</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select focus quality" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {focusQualities.map(quality => (
                            <SelectItem key={quality.value} value={quality.value}><span className="flex items-center">{quality.icon}{quality.label}</span></SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={aiForm.control}
                  name="academicLoad"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><BookOpen className="mr-1 h-4 w-4" />Academic Load</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select academic load" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           {academicLoads.map(load => (
                             <SelectItem key={load.value} value={load.value}><span className="flex items-center">{load.icon}{load.label}</span></SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={aiForm.control}
                  name="hoursBeforeSleep"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><Moon className="mr-1 h-4 w-4" />Hours Before Sleep (Optional)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 3" {...field} onChange={event => field.onChange(event.target.value === '' ? undefined : +event.target.value)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={aiForm.control}
                  name="sleepinessLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><Clock className="mr-1 h-4 w-4" />Sleepiness Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select sleepiness level" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {sleepinessLevels.map(level => (
                            <SelectItem key={level} value={level}>{level}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={aiForm.control}
                  name="isMedicated"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="flex items-center"><Pill className="mr-1 h-4 w-4" />Are you currently medicated?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-3"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="yes" />
                            </FormControl>
                            <FormLabel className="font-normal">Yes</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="no" />
                            </FormControl>
                            <FormLabel className="font-normal">No</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
               <FormField
                control={aiForm.control}
                name="currentState"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><Info className="mr-1 h-4 w-4" />Your Current State (e.g., tired, stressed)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Feeling a bit overwhelmed" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={aiForm.control}
                name="challenges"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><AlertTriangle className="mr-1 h-4 w-4" />Current Challenges/Blocks</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Procrastinating on Math assignment" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Hidden field for timeOfDay - it's now derived and set by useEffect */}
              <FormField
                control={aiForm.control}
                name="timeOfDay"
                render={({ field }) => <Input type="hidden" {...field} />}
              />
               {/* Hidden field for currentHour - it's now derived and set by useEffect */}
              <FormField
                control={aiForm.control}
                name="currentHour"
                render={({ field }) => <Input type="hidden" {...field} />}
              />
              <Button type="submit" disabled={isGenerating} className="w-full md:w-auto">
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
                Generate Schedule & Tip
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><Edit3 className="mr-2 h-5 w-5 text-primary" />Log Your Day's Metrics</CardTitle>
          <CardDescription>Track your progress to help the AI learn and refine its suggestions for you. The more you log, the smarter it gets!</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...metricsForm}>
            <form onSubmit={metricsForm.handleSubmit(data => { onLogMetrics(data); metricsForm.reset(); })} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={metricsForm.control}
                  name="hoursCompleted"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hours Completed</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={metricsForm.control}
                  name="energyLevelRating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Energy Level (1-10)</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" max="10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={metricsForm.control}
                  name="focusQualityRating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Focus Quality (1-10)</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" max="10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={metricsForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (What worked/didn't work? How did you feel about the schedule?)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Morning block was great, struggled with afternoon focus. The 25-min tasks felt right." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" variant="secondary" className="w-full md:w-auto">Log Metrics</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
