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
      'The current time of day for the user, options are: Morning, Afternoon, Evening.'
    ),
  academicLoad: z
    .string()
    .describe(
      'The amount of academic work required of the user today, options are: High, Medium, Low.'
    ),
});
export type GenerateDailyScheduleInput = z.infer<typeof GenerateDailyScheduleInputSchema>;

const GenerateDailyScheduleOutputSchema = z.object({
  schedule: z.string().describe('A personalized daily schedule.'),
  tips: z.string().describe('Personalized tips for the day.'),
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
  prompt: `You are an AI assistant designed to generate personalized daily schedules and tips for users with ADHD, based on their current state and needs.\n\nGiven the following information about the user's current state:\n- Energy Level: {{{energyLevel}}}\n- Focus Quality: {{{focusQuality}}}\n- Time of Day: {{{timeOfDay}}}\n- Academic Load: {{{academicLoad}}}\n\nGenerate a daily schedule and personalized tips that are tailored to their specific circumstances. Consider the principles of ADHD management, such as breaking tasks into smaller steps, incorporating breaks, and matching task difficulty to energy levels.\n\nSchedule:\nTips:`,
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
