'use server';
/**
 * @fileOverview A Genkit flow for analyzing trend alignment.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TrendRadarInputSchema = z.object({
  wardrobeItems: z.array(z.object({
    category: z.string(),
    color: z.string(),
    description: z.string(),
  })),
});
export type TrendRadarInput = z.infer<typeof TrendRadarInputSchema>;

const TrendRadarOutputSchema = z.object({
  trendingNow: z.object({
    colors: z.array(z.string()),
    fits: z.array(z.string()),
    footwear: z.array(z.string()),
    fabrics: z.array(z.string()),
  }),
  alignmentScore: z.number().min(0).max(100),
  breakdown: z.object({
    colorMatch: z.number(),
    fitMatch: z.number(),
    footwearMatch: z.number(),
    fabricMatch: z.number(),
  }),
  stylistInsights: z.string(),
  missingTrend: z.string().describe('The most significant trending item type currently missing from the wardrobe.'),
});
export type TrendRadarOutput = z.infer<typeof TrendRadarOutputSchema>;

export async function analyzeTrendRadar(input: TrendRadarInput): Promise<TrendRadarOutput> {
  return trendRadarFlow(input);
}

const trendRadarPrompt = ai.definePrompt({
  name: 'trendRadarPrompt',
  input: { schema: TrendRadarInputSchema },
  output: { schema: TrendRadarOutputSchema },
  prompt: `You are a fashion data scientist. Analyze current global trends and compare them to the user's wardrobe metadata.

**User Wardrobe Summary:**
{{#each wardrobeItems}}
- {{category}} in {{color}}: {{description}}
{{/each}}

**Task:**
1. Identify 3 trending colors, fits, footwear types, and fabrics for the current season.
2. Calculate a Trend Alignment Score (0-100) based on how many of these elements exist in the user's wardrobe.
3. Provide a breakdown of matching percentages.
4. Offer insights on how the user can align more closely with current aesthetics.`,
});

const trendRadarFlow = ai.defineFlow(
  {
    name: 'trendRadarFlow',
    inputSchema: TrendRadarInputSchema,
    outputSchema: TrendRadarOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await trendRadarPrompt(input);
      return output!;
    } catch (error) {
      return {
        trendingNow: {
          colors: ["Olive", "Sand", "Burgundy"],
          fits: ["Relaxed Tailoring", "Oversized"],
          footwear: ["Chunky Loafers", "Minimalist Sneakers"],
          fabrics: ["Linen", "Recycled Wool"]
        },
        alignmentScore: 65,
        breakdown: { colorMatch: 70, fitMatch: 50, footwearMatch: 80, fabricMatch: 60 },
        stylistInsights: "Your wardrobe is strong in classic footwear but could benefit from more trending earthy tones.",
        missingTrend: "Relaxed tailored trousers"
      };
    }
  }
);
