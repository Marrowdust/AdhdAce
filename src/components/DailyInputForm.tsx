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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Zap, Brain, CalendarDays, BookOpen, AlertTriangle, Info, Edit3 } from 'lucide-react';

const aiInputSchema = z.object({
  energyLevel: z.string().min(1, "Energy level is required."),
  focusQuality: z.string().min(1, "Focus quality is required."),
  timeOfDay: z.string().min(1, "Time of day is required."),
  academicLoad: z.string().min(1, "Academic load is required."),
  currentState: z.string().min(1, "Current state is required.").max(100, "Max 100 chars"),
  challenges: z.string().min(1, "Challenges are required.").max(100, "Max 100 chars"),
});

const metricsLogSchema = z.object({
  hoursCompleted: z.coerce.number().min(0, "Hours must be positive.").max(24),
  energyLevelRating: z.coerce.number().min(1).max(10),
  focusQualityRating: z.coerce.number().min(1).max(10),
  notes: z.string().max(500, "Max 500 chars").optional().default(""),
});

type AiInputFormValues = z.infer<typeof aiInputSchema>;
type MetricsLogFormValues = z.infer<typeof metricsLogSchema>;

interface DailyInputFormProps {
  onGenerate: (data: AiInputFormValues) => Promise<void>;
  onLogMetrics: (data: MetricsLogFormValues) => void;
  isGenerating: boolean;
  defaultValuesAI?: Partial<AiInputFormValues>;
}

export function DailyInputForm({ onGenerate, onLogMetrics, isGenerating, defaultValuesAI }: DailyInputFormProps) {
  const aiForm = useForm<AiInputFormValues>({
    resolver: zodResolver(aiInputSchema),
    defaultValues: defaultValuesAI || {
      energyLevel: 'Average',
      focusQuality: 'Medium',
      timeOfDay: 'Morning',
      academicLoad: 'Medium',
      currentState: '',
      challenges: '',
    },
  });

  const metricsForm = useForm<MetricsLogFormValues>({
    resolver: zodResolver(metricsLogSchema),
    defaultValues: {
      hoursCompleted: 0,
      energyLevelRating: 5,
      focusQualityRating: 5,
      notes: '',
    },
  });

  const energyLevels = [{value: "Good", label: "Good", icon: <Zap className="w-4 h-4 text-green-500" />}, {value: "Average", label: "Average", icon: <Zap className="w-4 h-4 text-yellow-500" />}, {value: "Bad", label: "Bad", icon: <Zap className="w-4 h-4 text-red-500" />}, {value: "Crisis", label: "Crisis", icon: <Zap className="w-4 h-4 text-red-700" />}];
  const focusQualities = [{value: "High", label: "High", icon: <Brain className="w-4 h-4 text-green-500" />}, {value: "Medium", label: "Medium", icon: <Brain className="w-4 h-4 text-yellow-500" />}, {value: "Low", label: "Low", icon: <Brain className="w-4 h-4 text-red-500" />}];
  const timesOfDay = [{value: "Morning", label: "Morning", icon: <CalendarDays className="w-4 h-4 text-blue-500" />}, {value: "Afternoon", label: "Afternoon", icon: <CalendarDays className="w-4 h-4 text-orange-500" />}, {value: "Evening", label: "Evening", icon: <CalendarDays className="w-4 h-4 text-purple-500" />}];
  const academicLoads = [{value: "High", label: "High", icon: <BookOpen className="w-4 h-4 text-red-500" />}, {value: "Medium", label: "Medium", icon: <BookOpen className="w-4 h-4 text-yellow-500" />}, {value: "Low", label: "Low", icon: <BookOpen className="w-4 h-4 text-green-500" />}];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><Info className="mr-2 h-5 w-5 text-primary" />Plan Your Day</CardTitle>
          <CardDescription>Tell us how you're feeling to get a personalized schedule and tips.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...aiForm}>
            <form onSubmit={aiForm.handleSubmit(onGenerate)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  name="timeOfDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><CalendarDays className="mr-1 h-4 w-4" />Time of Day</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select time of day" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timesOfDay.map(time => (
                             <SelectItem key={time.value} value={time.value}><span className="flex items-center">{time.icon}{time.label}</span></SelectItem>
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
          <CardDescription>Track your progress and help the AI learn.</CardDescription>
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
                    <FormLabel>Notes (What worked/didn't work?)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Morning block was great, struggled with afternoon focus..." {...field} />
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
