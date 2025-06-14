
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
  // Added fields to mirror daily schedule inputs for richer context, even if not all are directly used in every tip.
  energyLevel: z.string().optional().describe('The users current energy level.'),
  focusQuality: z.string().optional().describe('The users current focus quality.'),
  academicLoad: z.string().optional().describe('The amount of academic work required of the user today.'),
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
The system aims to learn what works best for this user over time. If past data were available, you'd consider it. For now, base your tip on the immediate context.

User's Context:
- Current State: {{{currentState}}}
- Broad Time of Day: {{{timeOfDay}}}
- Specific Hour: {{{currentHour}}}
- Current Challenges/Blocks: {{{challenges}}}
- Hours Before Sleep: {{{hoursBeforeSleep}}} (if available)
- Sleepiness Level: {{{sleepinessLevel}}}
- Medicated Status: {{#if isMedicated}}Currently Medicated{{else}}Not Currently Medicated{{/if}}
{{#if energyLevel}}- Energy Level: {{{energyLevel}}}{{/if}}
{{#if focusQuality}}- Focus Quality: {{{focusQuality}}}{{/if}}
{{#if academicLoad}}- Academic Load: {{{academicLoad}}}{{/if}}


Based on ALL the details above, generate a single, highly specific, and immediately implementable tip.
The tip should directly address the user's situation. Be very explicit and empathetic.

Examples of good, clear tips:
- "Feeling {{{currentState}}} and tackling {{{challenges}}} can be tough. Try this: Set a timer for just 5 minutes to work *only* on the very first small step of [specific task related to challenge]. Often, just starting breaks the inertia. What's one tiny piece you can do in 5 minutes?"
- "It's {{{currentHour}}}:00 and your sleepiness is '{{{sleepinessLevel}}}'. If you have about {{{hoursBeforeSleep}}} hours before bed, how about starting a 15-minute screen-free wind-down routine *now*? This could be reading a physical book or some light stretching. This will signal to your brain it's time to prepare for sleep."
- "Given you're {{{currentState}}} and {{#if isMedicated}}medicated{{else}}not medicated{{/if}}, and facing {{{challenges}}}, try to dedicate your next 20-minute focus block to the most demanding part of that challenge. Afterwards, take a 5-minute break to walk around or get some water. This rhythm can help maintain momentum."

The tip should be:
1.  **Personalized**: Directly reference specific user inputs (e.g., state, challenges, time).
2.  **Actionable**: Clearly state *what* the user can do, step-by-step if necessary.
3.  **Clear & Concise**: Easy to understand and implement immediately. Avoid jargon.
4.  **Supportive & Empathetic**: Maintain an encouraging, understanding tone.

Generate only one such tip.
`,
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  },
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
