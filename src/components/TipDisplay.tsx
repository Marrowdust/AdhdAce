'use client';

import type { PersonalizedTipOutput } from '@/ai/flows/personalized-tips-generator';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

interface TipDisplayProps {
  tipData?: PersonalizedTipOutput;
}

export function TipDisplay({ tipData }: TipDisplayProps) {
  if (!tipData || !tipData.tip) {
    return (
       <Card className="min-h-[150px] flex items-center justify-center">
        <CardContent className="text-center">
          <Lightbulb className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">Your daily tip will appear here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-accent/20 border-accent">
      <CardHeader>
        <CardTitle className="font-headline flex items-center text-accent-foreground"><Lightbulb className="mr-2 h-5 w-5 text-accent-foreground" />Personalized Tip</CardTitle>
        <CardDescription className="text-accent-foreground/80">A little boost for your day!</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-accent-foreground leading-relaxed">{tipData.tip}</p>
      </CardContent>
    </Card>
  );
}
