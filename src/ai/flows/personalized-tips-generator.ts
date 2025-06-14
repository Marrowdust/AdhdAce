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
    .describe('The current time of day (e.g., morning, afternoon, evening).'),
  challenges: z
    .string()
    .describe(
      'Any blocks or challenges the user is currently facing (e.g., distraction, procrastination).'
    ),
});
export type PersonalizedTipInput = z.infer<typeof PersonalizedTipInputSchema>;

const PersonalizedTipOutputSchema = z.object({
  tip: z.string().describe('A personalized tip for the user.'),
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
  prompt: `You are an AI assistant designed to provide personalized tips to users based on their current state and the time of day.

  Current State: {{{currentState}}}
  Time of Day: {{{timeOfDay}}}
  Challenges: {{{challenges}}}

  Generate a single, actionable tip that the user can implement immediately to improve their focus, reduce stress, and enhance productivity.
  Keep the tip concise and easy to understand. Focus on specific strategies or techniques.
  Consider both the current state, the time of day and the challenges to generate the tip.
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
