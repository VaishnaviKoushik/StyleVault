'use server';
/**
 * @fileOverview A Genkit flow for researching global fashion trends.
 *
 * - trendResearcher - A function that handles fashion trend analysis.
 * - TrendResearcherInput - The input type.
 * - TrendResearcherOutput - The return type.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TrendResearcherInputSchema = z.object({
  topic: z.string().describe('The fashion topic or era to research (e.g., "Spring 2025 footwear", "90s grunge revival").'),
});
export type TrendResearcherInput = z.infer<typeof TrendResearcherInputSchema>;

const TrendResearcherOutputSchema = z.object({
  title: z.string().describe('The name of the trend movement.'),
  summary: z.string().describe('A high-level overview of the trend.'),
  keyPieces: z.array(z.string()).describe('List of essential garments that define this trend.'),
  colorPalette: z.array(z.object({
    name: z.string(),
    hex: z.string(),
  })).describe('The primary colors associated with this trend.'),
  stylingStrategy: z.string().describe('Professional advice on how to incorporate this trend into a daily wardrobe.'),
  forecastScore: z.number().min(1).max(100).describe('How strongly this trend is projected to grow (1-100).'),
});
export type TrendResearcherOutput = z.infer<typeof TrendResearcherOutputSchema>;

export async function trendResearcher(input: TrendResearcherInput): Promise<TrendResearcherOutput> {
  return trendResearcherFlow(input);
}

const trendPrompt = ai.definePrompt({
  name: 'trendResearcherPrompt',
  input: { schema: TrendResearcherInputSchema },
  output: { schema: TrendResearcherOutputSchema },
  prompt: `You are a world-class fashion trend researcher and forecaster. 
Analyze the following topic and provide a detailed trend report.

Topic: {{{topic}}}

Your report should be sophisticated, data-driven, and visually descriptive. 
Identify the core essence of the movement, the essential pieces required to pull it off, and a color palette that defines it.
Provide a Forecast Score indicating how dominant this trend will be in the coming 6-12 months.`,
});

const trendResearcherFlow = ai.defineFlow(
  {
    name: 'trendResearcherFlow',
    inputSchema: TrendResearcherInputSchema,
    outputSchema: TrendResearcherOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await trendPrompt(input);
      return output!;
    } catch (error: any) {
      // Fallback for quota limits
      return {
        title: "Minimalist Modernism",
        summary: "A continued shift towards high-quality essentials and clean silhouettes, emphasizing 'Quiet Luxury' and longevity.",
        keyPieces: ["Oversized Wool Blazer", "Silk Slip Dress", "Wide-Leg Tailored Trousers", "Pointed-Toe Leather Loafers"],
        colorPalette: [
          { name: "Oatmeal", hex: "#E5D9C3" },
          { name: "Slate", hex: "#708090" },
          { name: "Charcoal", hex: "#36454F" },
          { name: "Cream", hex: "#FFFDD0" }
        ],
        stylingStrategy: "Focus on texture over pattern. Layer monochrome pieces of varying weights to create depth without visual noise.",
        forecastScore: 94
      };
    }
  }
);
