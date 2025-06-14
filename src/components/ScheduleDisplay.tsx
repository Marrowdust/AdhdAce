'use client';

import type { GenerateDailyScheduleOutput } from '@/ai/flows/daily-schedule-generator';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ListChecks, CalendarClock } from 'lucide-react';

interface ScheduleDisplayProps {
  scheduleData?: GenerateDailyScheduleOutput;
}

export function ScheduleDisplay({ scheduleData }: ScheduleDisplayProps) {
  if (!scheduleData || !scheduleData.schedule) {
    return (
      <Card className="min-h-[200px] flex items-center justify-center">
        <CardContent className="text-center">
          <CalendarClock className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">Your personalized schedule will appear here once generated.</p>
        </CardContent>
      </Card>
    );
  }

  // Basic parsing of the schedule string. Assumes schedule items are separated by newlines.
  // This can be improved if the AI provides a more structured output.
  const scheduleItems = scheduleData.schedule.split('\n').map(item => item.trim()).filter(item => item.length > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center"><ListChecks className="mr-2 h-5 w-5 text-primary" />Today's Dynamic Schedule</CardTitle>
        <CardDescription>Here's a plan tailored for you based on your inputs.</CardDescription>
      </CardHeader>
      <CardContent>
        {scheduleItems.length > 0 ? (
          <ScrollArea className="h-[300px] rounded-md border p-4">
            <ul className="space-y-3">
              {scheduleItems.map((item, index) => (
                <li key={index} className="text-sm p-3 bg-secondary/50 rounded-md shadow-sm transition-all hover:shadow-md">
                  {item}
                </li>
              ))}
            </ul>
          </ScrollArea>
        ) : (
          <p className="text-muted-foreground">No schedule items generated. Try adjusting your inputs.</p>
        )}
      </CardContent>
    </Card>
  );
}
