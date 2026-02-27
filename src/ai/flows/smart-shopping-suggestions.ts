'use server';
/**
 * @fileOverview A Genkit flow for generating smart shopping suggestions based on the user's current wardrobe and outfits.
 *
 * - smartShoppingSuggestions - A function that handles the AI wardrobe gap analysis and shopping recommendations.
 * - ShoppingSuggestionsInput - The input type for the smartShoppingSuggestions function.
 * - ShoppingSuggestionsOutput - The return type for the smartShoppingSuggestions function.
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
  stylePreference: z.string().optional().describe('The user\'s general style preference (e.g., "minimalist", "streetwear").'),
});
export type ShoppingSuggestionsInput = z.infer<typeof ShoppingSuggestionsInputSchema>;

const ShoppingSuggestionsOutputSchema = z.object({
  suggestions: z.array(z.object({
    itemName: z.string().describe('The name of the recommended item.'),
    reason: z.string().describe('The logic behind the recommendation (e.g., "Missing essential", "Complements 5 items").'),
    matchCount: z.number().describe('How many existing items or outfits this piece would complement.'),
    category: z.string().describe('The category of the suggested item.'),
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
  prompt: `You are a data-driven fashion strategist. Your goal is to analyze a user's digital wardrobe and suggest high-value additions that maximize outfit combinations and fill style gaps.

Current Wardrobe:
{{#each wardrobeItems}}
- {{name}} ({{category}}, {{color}})
{{/each}}

Saved Outfits:
{{#each outfits}}
- {{name}}: uses [{{#each itemNames}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}]
{{/each}}

User Style: {{{stylePreference}}}

Your Task:
1. Identify missing "wardrobe essentials" based on their current items (e.g., if they have many formal shirts but no blazer).
2. Suggest items that would create the most NEW combinations with their existing pieces.
3. Be specific with "match counts" (e.g., "Matches 6 existing outfits" or "Complements 4 pairs of trousers").
4. Return exactly 3-4 diverse suggestions.

Format the 'reason' to be punchy and convincing like: "A neutral blazer would bridge your formal shirts with your denim collection, creating 5 new business-casual looks."`,
});

const smartShoppingSuggestionsFlow = ai.defineFlow(
  {
    name: 'smartShoppingSuggestionsFlow',
    inputSchema: ShoppingSuggestionsInputSchema,
    outputSchema: ShoppingSuggestionsOutputSchema,
  },
  async (input) => {
    const { output } = await shoppingPrompt(input);
    return output!;
  }
);
