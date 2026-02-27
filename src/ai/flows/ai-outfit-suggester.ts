'use server';
/**
 * @fileOverview A Genkit flow for recommending complete outfit combinations from a user's digital wardrobe.
 *
 * - aiOutfitSuggester - A function that handles the AI outfit recommendation process.
 * - AiOutfitSuggesterInput - The input type for the aiOutfitSuggester function.
 * - AiOutfitSuggesterOutput - The return type for the aiOutfitSuggester function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const WardrobeItemSchema = z.object({
  id: z.string().describe('Unique identifier for the wardrobe item.'),
  name: z.string().describe('Name of the clothing item (e.g., "blue t-shirt").'),
  category: z.string().describe('Category of the item (e.g., "top", "bottom", "shoes", "accessory", "outerwear").'),
  color: z.string().describe('Main color of the item.'),
  description: z.string().describe('Brief description of the item.'),
});

const AiOutfitSuggesterInputSchema = z.object({
  occasion: z.string().describe('The occasion for which the outfit is needed (e.g., "casual", "formal", "work", "sporty").'),
  wardrobeItems: z.array(WardrobeItemSchema).describe('A list of available clothing items in the user\u0027s digital wardrobe.'),
});
export type AiOutfitSuggesterInput = z.infer<typeof AiOutfitSuggesterInputSchema>;

const AiOutfitSuggesterOutputSchema = z.object({
  suggestedOutfit: z.array(z.string()).describe('An array of IDs of the suggested clothing items from the wardrobe that form a complete outfit.'),
});
export type AiOutfitSuggesterOutput = z.infer<typeof AiOutfitSuggesterOutputSchema>;

export async function aiOutfitSuggester(input: AiOutfitSuggesterInput): Promise<AiOutfitSuggesterOutput> {
  return aiOutfitSuggesterFlow(input);
}

const outfitSuggesterPrompt = ai.definePrompt({
  name: 'outfitSuggesterPrompt',
  input: { schema: AiOutfitSuggesterInputSchema },
  output: { schema: AiOutfitSuggesterOutputSchema },
  prompt: `You are a professional fashion stylist. Your task is to suggest a complete outfit from the user's digital wardrobe for a specific occasion.
The outfit must consist only of items available in the provided wardrobe.
For each item in the suggested outfit, return only its 'id' from the wardrobe.

**Occasion:** {{{occasion}}}

**Available Wardrobe Items:**
{{#each wardrobeItems}}
- ID: {{id}}, Name: {{name}}, Category: {{category}}, Color: {{color}}, Description: {{description}}
{{/each}}

Please suggest a complete and stylish outfit for the occasion using the available items. The outfit should be appropriate for the specified occasion. Return only the IDs of the chosen items in the 'suggestedOutfit' array. If you cannot form a complete outfit, suggest the best possible combination of items.`,
});

const aiOutfitSuggesterFlow = ai.defineFlow(
  {
    name: 'aiOutfitSuggesterFlow',
    inputSchema: AiOutfitSuggesterInputSchema,
    outputSchema: AiOutfitSuggesterOutputSchema,
  },
  async (input) => {
    const { output } = await outfitSuggesterPrompt(input);
    return output!;
  }
);
