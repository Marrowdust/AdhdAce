
'use server';

/**
 * @fileOverview A daily schedule generation AI agent.
 *
 * - generateDailySchedule - A function that handles the daily schedule generation process.
 * - GenerateDailyScheduleInput - The input type for the generateDailySchedule function.
 * - GenerateDailyScheduleOutput - The return type for the generateDailySchedule function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDailyScheduleInputSchema = z.object({
  energyLevel: z
    .string()
    .describe(
      'The users current energy level, options are: Good, Average, Bad, Crisis.'
    ),
  focusQuality: z
    .string()
    .describe(
      'The users current focus quality, options are: High, Medium, Low.'
    ),
  timeOfDay: z
    .string()
    .describe(
      'The current broad time of day for the user, options are: Morning, Afternoon, Evening.'
    ),
  academicLoad: z
    .string()
    .describe(
      'The amount of academic work required of the user today, options are: High, Medium, Low.'
    ),
  currentHour: z.number().min(0).max(23).describe('The current hour of the day (0-23).'),
  hoursBeforeSleep: z.number().optional().describe('How many hours are left before the user plans to sleep. Helps in planning evening activities.'),
  sleepinessLevel: z.string().describe('The user\'s current sleepiness level (e.g., Not Sleepy, Slightly Sleepy, Moderately Sleepy, Very Sleepy).'),
  isMedicated: z.boolean().describe('Whether the user is currently medicated (e.g., for ADHD).'),
});
export type GenerateDailyScheduleInput = z.infer<typeof GenerateDailyScheduleInputSchema>;

const GenerateDailyScheduleOutputSchema = z.object({
  schedule: z.string().describe('A personalized daily schedule, broken down into manageable tasks with estimated times. Tasks should be suitable for someone with ADHD.'),
  tips: z.string().describe('Personalized tips for managing the day and tasks, considering ADHD principles.'),
});
export type GenerateDailyScheduleOutput = z.infer<typeof GenerateDailyScheduleOutputSchema>;

export async function generateDailySchedule(
  input: GenerateDailyScheduleInput
): Promise<GenerateDailyScheduleOutput> {
  return generateDailyScheduleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDailySchedulePrompt',
  input: {schema: GenerateDailyScheduleInputSchema},
  output: {schema: GenerateDailyScheduleOutputSchema},
  prompt: `You are an AI assistant specializing in creating highly personalized and effective daily schedules for students with ADHD. Your goal is to help them manage their time, energy, and focus to achieve their academic goals while maintaining well-being.

Consider the user's current state meticulously:
- Energy Level: {{{energyLevel}}}
- Focus Quality: {{{focusQuality}}}
- Broad Time of Day: {{{timeOfDay}}} (e.g., Morning, Afternoon, Evening)
- Current Hour: {{{currentHour}}} (0-23)
- Academic Load: {{{academicLoad}}} (High, Medium, Low)
- Hours Before Sleep: {{{hoursBeforeSleep}}} (if provided)
- Sleepiness Level: {{{sleepinessLevel}}}
- Medicated Status: {{#if isMedicated}}Currently Medicated{{else}}Not Currently Medicated{{/if}}

Generate a daily schedule and personalized tips based on ALL of this information.
The schedule should:
- Be broken down into small, manageable tasks with estimated durations (e.g., "Work on Math Ch. 2: 25 mins", "Short break: 5 mins").
- Incorporate regular short breaks (e.g., Pomodoro technique).
- Match task difficulty and type to the user's reported energy and focus levels.
- If it's late and sleepiness is high, prioritize rest or very light tasks.
- Consider medication status (e.g., peak focus times if medicated, strategies for unmedicated periods).

The tips should be:
- Actionable and specific to the generated schedule and the user's current state.
- Reinforce ADHD management strategies (e.g., minimizing distractions, using timers, body doubling if applicable).
- Be encouraging and supportive.

Example for a schedule item: "Review History Notes (Pomodoro 1): 25 minutes. Focus on key dates."
Example for a tip: "During your history review, try putting your phone in another room to maximize focus, especially since your focus quality is medium."

Provide the output in the specified JSON format with 'schedule' and 'tips' keys.
Schedule:
Tips:`,
});

const generateDailyScheduleFlow = ai.defineFlow(
  {
    name: 'generateDailyScheduleFlow',
    inputSchema: GenerateDailyScheduleInputSchema,
    outputSchema: GenerateDailyScheduleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
