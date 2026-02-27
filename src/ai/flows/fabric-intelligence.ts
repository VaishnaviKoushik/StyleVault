'use server';
/**
 * @fileOverview A Genkit flow for analyzing fabric properties and providing educational fashion intelligence.
 *
 * - analyzeFabric - A function that handles the AI fabric intelligence process.
 * - FabricIntelligenceInput - The input type.
 * - FabricIntelligenceOutput - The return type.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FabricIntelligenceInputSchema = z.object({
  itemName: z.string(),
  fabricType: z.string().describe('The primary material of the garment (e.g., "Linen", "Wool", "Cotton").'),
  description: z.string().optional(),
});
export type FabricIntelligenceInput = z.infer<typeof FabricIntelligenceInputSchema>;

const FabricIntelligenceOutputSchema = z.object({
  explanation: z.string().describe('Detailed explanation of why this fabric is good for specific conditions.'),
  seasonalWisdom: z.string().describe('Specific seasonal advice for this material.'),
  breathabilityScore: z.number().min(1).max(10).describe('A score from 1-10 for breathability.'),
  careTip: z.string().describe('A pro care tip for this fabric.'),
});
export type FabricIntelligenceOutput = z.infer<typeof FabricIntelligenceOutputSchema>;

export async function analyzeFabric(input: FabricIntelligenceInput): Promise<FabricIntelligenceOutput> {
  return analyzeFabricFlow(input);
}

const fabricPrompt = ai.definePrompt({
  name: 'fabricIntelligencePrompt',
  input: { schema: FabricIntelligenceInputSchema },
  output: { schema: FabricIntelligenceOutputSchema },
  prompt: `You are an expert textile engineer and professional stylist. Analyze the following fabric:

Garment: {{{itemName}}}
Fabric: {{{fabricType}}}
Description: {{{description}}}

Explain:
1. Why this fabric is suitable for certain climates (e.g., why linen for summer, wool for winter).
2. The breathability and comfort factor.
3. Educational value about the fiber structure.

Return a breathability score from 1-10 and professional care tips.`,
});

const analyzeFabricFlow = ai.defineFlow(
  {
    name: 'analyzeFabricFlow',
    inputSchema: FabricIntelligenceInputSchema,
    outputSchema: FabricIntelligenceOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await fabricPrompt(input);
      return output!;
    } catch (error: any) {
      // Fallback for quota limits
      return {
        explanation: `${input.fabricType} is a versatile material known for its natural properties. It adapts well to various conditions.`,
        seasonalWisdom: `Ideal for transitional weather.`,
        breathabilityScore: 7,
        careTip: "Always follow the manufacturer's care label; generally, cool washing is preferred."
      };
    }
  }
);
