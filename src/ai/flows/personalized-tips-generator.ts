
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating personalized tips based on the user's current state and time of day.
 *
 * - generatePersonalizedTip - A function that generates a personalized tip.
 * - PersonalizedTipInput - The input type for the generatePersonalizedTip function.
 * - PersonalizedTipOutput - The return type for the generatePersonalizedTip function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedTipInputSchema = z.object({
  currentState: z
    .string()
    .describe(
      'The current state of the user (e.g., tired, stressed, focused).'
    ),
  timeOfDay: z
    .string()
    .describe('The current broad time of day (e.g., morning, afternoon, evening).'),
  challenges: z
    .string()
    .describe(
      'Any blocks or challenges the user is currently facing (e.g., distraction, procrastination).'
    ),
  currentHour: z.number().min(0).max(23).describe('The current hour of the day (0-23).'),
  hoursBeforeSleep: z.number().optional().describe('How many hours are left before the user plans to sleep.'),
  sleepinessLevel: z.string().describe('The user\'s current sleepiness level (e.g., Not Sleepy, Slightly Sleepy, Moderately Sleepy, Very Sleepy).'),
  isMedicated: z.boolean().describe('Whether the user is currently medicated (e.g., for ADHD).'),
});
export type PersonalizedTipInput = z.infer<typeof PersonalizedTipInputSchema>;

const PersonalizedTipOutputSchema = z.object({
  tip: z.string().describe('A highly personalized, actionable, and clear tip for the user.'),
});
export type PersonalizedTipOutput = z.infer<typeof PersonalizedTipOutputSchema>;

export async function generatePersonalizedTip(
  input: PersonalizedTipInput
): Promise<PersonalizedTipOutput> {
  return personalizedTipFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedTipPrompt',
  input: {schema: PersonalizedTipInputSchema},
  output: {schema: PersonalizedTipOutputSchema},
  prompt: `You are an AI assistant expert in ADHD coaching. Your task is to provide ONE extremely clear, actionable, and personalized tip.

User's Context:
- Current State: {{{currentState}}}
- Broad Time of Day: {{{timeOfDay}}}
- Specific Hour: {{{currentHour}}}
- Current Challenges/Blocks: {{{challenges}}}
- Hours Before Sleep: {{{hoursBeforeSleep}}} (if available)
- Sleepiness Level: {{{sleepinessLevel}}}
- Medicated Status: {{#if isMedicated}}Currently Medicated{{else}}Not Currently Medicated{{/if}}

Based on ALL the details above, generate a single, highly specific, and immediately implementable tip.
The tip should directly address the user's situation. Be very explicit.

Examples of good, clear tips:
- "Since you're feeling {{{currentState}}} and facing {{{challenges}}}, try the '5-minute rule': commit to working on [specific task related to challenge] for just 5 minutes. Often, starting is the hardest part."
- "Given it's {{{currentHour}}}:00 and your sleepiness is '{{{sleepinessLevel}}}', if you have {{{hoursBeforeSleep}}} hours before bed, consider a 15-minute screen-free wind-down now to prepare for better sleep."
- "As you're {{{currentState}}} and {{#if isMedicated}}medicated{{else}}not medicated{{/if}}, tackle the part of {{{challenges}}} that requires the most focus first, for about 20 minutes, then take a brief walk."

The tip should be:
1.  **Personalized**: Directly reference the user's inputs.
2.  **Actionable**: Tell the user *what* to do.
3.  **Clear & Concise**: Easy to understand and implement immediately.
4.  **Supportive**: Maintain an encouraging tone.

Generate only one such tip.
`,
});

const personalizedTipFlow = ai.defineFlow(
  {
    name: 'personalizedTipFlow',
    inputSchema: PersonalizedTipInputSchema,
    outputSchema: PersonalizedTipOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
