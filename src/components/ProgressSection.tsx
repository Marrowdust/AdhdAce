'use client';

import type { DailyLog } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, LineChart, PieChartIcon, TrendingUp } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Bar, Line, Pie, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend as RechartsLegend, PieChart as RechartsPieChart, Cell } from 'recharts';
import { useMemo } from 'react';

interface ProgressSectionProps {
  dailyLogs: DailyLog[];
}

const chartConfigHours = {
  planned: { label: 'Planned Hours', color: 'hsl(var(--chart-2))' },
  completed: { label: 'Completed Hours', color: 'hsl(var(--chart-1))' },
};

const chartConfigRatings = {
  energy: { label: 'Energy (1-10)', color: 'hsl(var(--chart-4))' },
  focus: { label: 'Focus (1-10)', color: 'hsl(var(--chart-5))' },
};

const COLORS_PIE = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];


export function ProgressSection({ dailyLogs }: ProgressSectionProps) {
  const weeklySummary = useMemo(() => {
    const summary: { [key: string]: { planned: number; completed: number } } = {};
    dailyLogs.forEach(log => {
      const week = getWeekNumber(new Date(log.date));
      const year = new Date(log.date).getFullYear();
      const weekKey = `W${week} ${year}`;
      if (!summary[weekKey]) {
        summary[weekKey] = { planned: 0, completed: 0 };
      }
      summary[weekKey].planned += log.hoursPlanned || 0;
      summary[weekKey].completed += log.hoursCompleted;
    });
    return Object.entries(summary)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a,b) => {
        const [aWeek, aYear] = a.name.substring(1).split(" ").map(Number);
        const [bWeek, bYear] = b.name.substring(1).split(" ").map(Number);
        if (aYear !== bYear) return aYear - bYear;
        return aWeek - bWeek;
      })
      .slice(-8); // Show last 8 weeks
  }, [dailyLogs]);

  const dailyPerformance = useMemo(() => {
    return dailyLogs
      .map(log => ({
        date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        planned: log.hoursPlanned || 0,
        completed: log.hoursCompleted,
        energy: log.energyLevelRating,
        focus: log.focusQualityRating,
      }))
      .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Ensure correct order for line chart
      .slice(-30); // Show last 30 days
  }, [dailyLogs]);
  
  const academicLoadDistribution = useMemo(() => {
    const distribution: { [key: string]: number } = { High: 0, Medium: 0, Low: 0 };
    dailyLogs.forEach(log => {
      if (log.dailyInputAcademicLoad && distribution[log.dailyInputAcademicLoad] !== undefined) {
        distribution[log.dailyInputAcademicLoad]++;
      }
    });
    return Object.entries(distribution)
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0);
  }, [dailyLogs]);


  if (dailyLogs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-primary" />Your Progress</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">Start logging your days to see your progress here!</p>
        </CardContent>
      </Card>
    );
  }
  
  // Helper function to get week number
  function getWeekNumber(d: Date) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-primary" />Your Progress</CardTitle>
        <CardDescription>Visualize your study habits and well-being over time.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center"><BarChart className="mr-2 h-5 w-5 text-accent" />Weekly Study Hours</h3>
          {weeklySummary.length > 0 ? (
            <ChartContainer config={chartConfigHours} className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={weeklySummary} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="planned" fill="var(--color-planned)" radius={4} />
                  <Bar dataKey="completed" fill="var(--color-completed)" radius={4} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : <p className="text-muted-foreground text-sm">Not enough data for weekly summary yet.</p>}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center"><LineChart className="mr-2 h-5 w-5 text-accent" />Daily Performance (Last 30 Days)</h3>
           {dailyPerformance.length > 0 ? (
            <ChartContainer config={chartConfigRatings} className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={dailyPerformance} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis yAxisId="left" orientation="left" stroke="var(--color-energy)" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis yAxisId="right" orientation="right" stroke="var(--color-focus)" tickLine={false} axisLine={false} tickMargin={8} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line yAxisId="left" type="monotone" dataKey="energy" stroke="var(--color-energy)" strokeWidth={2} dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="focus" stroke="var(--color-focus)" strokeWidth={2} dot={false} />
                </RechartsLineChart>
              </ResponsiveContainer>
            </ChartContainer>
           ) : <p className="text-muted-foreground text-sm">Log daily performance to see trends.</p>}
        </div>
        
        {academicLoadDistribution.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center"><PieChartIcon className="mr-2 h-5 w-5 text-accent" />Academic Load Distribution</h3>
            <ChartContainer config={{}} className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', borderRadius: 'var(--radius)' }} 
                  />
                  <RechartsLegend />
                  <Pie
                    data={academicLoadDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {academicLoadDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_PIE[index % COLORS_PIE.length]} />
                    ))}
                  </Pie>
                </RechartsPieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        )}

      </CardContent>
    </Card>
  );
}

// Use Recharts components directly since Shadcn Chart components are wrappers
const RechartsBarChart = Bar; 
const RechartsLineChart = Line;


