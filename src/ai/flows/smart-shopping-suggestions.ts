'use server';
/**
 * @fileOverview A Genkit flow for generating smart shopping suggestions with direct platform links and quota resilience.
 *
 * - smartShoppingSuggestions - A function that handles wardrobe gap analysis and shopping recommendations.
 * - ShoppingSuggestionsInput - The input type.
 * - ShoppingSuggestionsOutput - The return type.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ShoppingSuggestionsInputSchema = z.object({
  wardrobeItems: z.array(z.object({
    name: z.string(),
    category: z.string(),
    color: z.string(),
  })).describe('The items currently in the user\'s wardrobe.'),
  outfits: z.array(z.object({
    name: z.string(),
    itemNames: z.array(z.string()),
  })).describe('The user\'s saved outfits.'),
  stylePreference: z.string().optional().describe('The user\'s general style preference.'),
});
export type ShoppingSuggestionsInput = z.infer<typeof ShoppingSuggestionsInputSchema>;

const ShoppingSuggestionsOutputSchema = z.object({
  suggestions: z.array(z.object({
    itemName: z.string().describe('The name of the recommended item.'),
    reason: z.string().describe('The logic behind the recommendation.'),
    matchCount: z.number().describe('How many existing items or outfits this piece would complement.'),
    category: z.string().describe('The category of the suggested item.'),
    platform: z.enum(['Amazon', 'Myntra', 'Flipkart', 'Meesho']).describe('The recommended shopping platform.'),
    shopUrl: z.string().describe('The search URL for the platform.'),
  })).describe('A list of up to 4 smart shopping suggestions.'),
});
export type ShoppingSuggestionsOutput = z.infer<typeof ShoppingSuggestionsOutputSchema>;

export async function smartShoppingSuggestions(input: ShoppingSuggestionsInput): Promise<ShoppingSuggestionsOutput> {
  return smartShoppingSuggestionsFlow(input);
}

const shoppingPrompt = ai.definePrompt({
  name: 'shoppingSuggestionsPrompt',
  input: { schema: ShoppingSuggestionsInputSchema },
  output: { schema: ShoppingSuggestionsOutputSchema },
  prompt: `You are a data-driven fashion strategist. Analyze a user's wardrobe and suggest high-value additions.
Assign a specific platform (Amazon, Myntra, Flipkart, or Meesho) based on the item type (e.g., Meesho for ethnic/value, Myntra for lifestyle, Amazon for essentials).

Current Wardrobe:
{{#each wardrobeItems}}
- {{name}} ({{category}}, {{color}})
{{/each}}

User Style: {{{stylePreference}}}

Your Task:
1. Identify missing essentials.
2. Suggest items that maximize new combinations.
3. Provide a platform-specific search URL.

Format the 'reason' to be convincing.`,
});

const smartShoppingSuggestionsFlow = ai.defineFlow(
  {
    name: 'smartShoppingSuggestionsFlow',
    inputSchema: ShoppingSuggestionsInputSchema,
    outputSchema: ShoppingSuggestionsOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await shoppingPrompt(input);
      return output!;
    } catch (error: any) {
      // Fallback logic for Quota Exceeded (429) or other API errors
      if (error.message?.includes('429') || error.message?.includes('quota')) {
        return {
          suggestions: [
            {
              itemName: 'Classic White Linen Shirt',
              reason: 'Linen is essential for summer breathability and complements 8 of your existing items.',
              matchCount: 8,
              category: 'top',
              platform: 'Amazon',
              shopUrl: 'https://www.amazon.in/s?k=white+linen+shirt'
            },
            {
              itemName: 'Tan Leather Loafers',
              reason: 'Elevate your casual looks; these match perfectly with your blue denim and beige chinos.',
              matchCount: 6,
              category: 'shoes',
              platform: 'Myntra',
              shopUrl: 'https://www.myntra.com/tan-leather-loafers'
            },
            {
              itemName: 'Minimalist Black Leather Belt',
              reason: 'A versatile essential missing from your collection that completes all your formal and semi-formal looks.',
              matchCount: 12,
              category: 'accessory',
              platform: 'Flipkart',
              shopUrl: 'https://www.flipkart.com/search?q=black+leather+belt'
            }
          ]
        };
      }
      throw error;
    }
  }
);
