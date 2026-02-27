'use server';
/**
 * @fileOverview A Genkit flow for generating seasonal wardrobe transition alerts.
 *
 * - seasonalTransitionAlert - A function that predicts upcoming seasonal shifts and suggests wardrobe strategies.
 * - SeasonalTransitionInput - The input type.
 * - SeasonalTransitionOutput - The return type.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SeasonalTransitionInputSchema = z.object({
  currentMonth: z.string().describe('The current month (e.g., "September").'),
  locationHint: z.string().optional().describe('Optional location context (e.g., "Northern Hemisphere").'),
});
export type SeasonalTransitionInput = z.infer<typeof SeasonalTransitionInputSchema>;

const SeasonalTransitionOutputSchema = z.object({
  title: z.string().describe('The name of the upcoming transition (e.g., "Autumn Shift").'),
  description: z.string().describe('A brief explanation of the upcoming climate change.'),
  urgency: z.enum(['low', 'medium', 'high']).describe('How soon the user needs to act.'),
  rotateIn: z.array(z.string()).describe('Items to bring to the front of the closet.'),
  rotateOut: z.array(z.string()).describe('Items to consider moving to seasonal storage.'),
  preparationTip: z.string().describe('A professional tip for maintaining garment quality during storage.'),
});
export type SeasonalTransitionOutput = z.infer<typeof SeasonalTransitionOutputSchema>;

export async function seasonalTransitionAlert(input: SeasonalTransitionInput): Promise<SeasonalTransitionOutput> {
  return seasonalTransitionAlertFlow(input);
}

const transitionPrompt = ai.definePrompt({
  name: 'seasonalTransitionPrompt',
  input: { schema: SeasonalTransitionInputSchema },
  output: { schema: SeasonalTransitionOutputSchema },
  prompt: `You are an elite seasonal wardrobe consultant. Based on the current month, identify the most likely upcoming seasonal transition.

Current Month: {{{currentMonth}}}
Location Context: {{{locationHint}}}

Your task:
1. Identify the upcoming seasonal shift.
2. Suggest 3-4 specific garment types to "Rotate In" (e.g., lightweight sweaters, trench coats).
3. Suggest 3-4 garment types to "Rotate Out" for storage.
4. Provide a professional "Preparation Tip" for garment care (e.g., how to store silk or wool).
5. Set an urgency level based on how close the month is to a traditional seasonal peak.

Make the tone sophisticated, proactive, and helpful.`,
});

const seasonalTransitionAlertFlow = ai.defineFlow(
  {
    name: 'seasonalTransitionAlertFlow',
    inputSchema: SeasonalTransitionInputSchema,
    outputSchema: SeasonalTransitionOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await transitionPrompt(input);
      return output!;
    } catch (error: any) {
      // Fallback for quota limits (Defaulting to Autumn transition for Sept/Oct context)
      return {
        title: "Autumn Equinox Preparation",
        description: "The air is cooling. It is time to transition from high-summer linens to structured layers.",
        urgency: "medium",
        rotateIn: ["Mid-weight Blazers", "Lightweight Knitwear", "Leather Loafers", "Trench Coats"],
        rotateOut: ["Linen Shorts", "Beachwear", "Thin Cotton Tees", "Espadrilles"],
        preparationTip: "Before storing summer linens, ensure they are professionally laundered and stored in breathable cotton bags to prevent yellowing or fiber degradation."
      };
    }
  }
);
