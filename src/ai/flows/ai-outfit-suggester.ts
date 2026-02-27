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
  category: z.string().describe('Category of the item (e.g., "top", "bottom", "shoes", "accessory", "outerwear", "dress").'),
  color: z.string().describe('Main color of the item.'),
  description: z.string().describe('Brief description of the item.'),
});

const AiOutfitSuggesterInputSchema = z.object({
  occasion: z.string().describe('The occasion for which the outfit is needed (e.g., "casual", "formal", "work", "sporty").'),
  wardrobeItems: z.array(WardrobeItemSchema).describe('A list of available clothing items in the user\'s digital wardrobe.'),
});
export type AiOutfitSuggesterInput = z.infer<typeof AiOutfitSuggesterInputSchema>;

const AiOutfitSuggesterOutputSchema = z.object({
  suggestedOutfit: z.array(z.string()).describe('An array of IDs of the suggested clothing items from the wardrobe that form a complete outfit.'),
  shoppingAdvised: z.boolean().describe('Set to true if you cannot form a complete, stylish outfit with the current items and recommend shopping for missing pieces.'),
  stylistNote: z.string().describe('Styling advice or explanation of why shopping is recommended.'),
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

**Occasion:** {{{occasion}}}

**Available Wardrobe Items:**
{{#each wardrobeItems}}
- ID: {{id}}, Name: {{name}}, Category: {{category}}, Color: {{color}}, Description: {{description}}
{{/each}}

**Your Task:**
1. Try to form a complete and stylish outfit using ONLY items with the 'id's provided.
2. If you cannot form a complete or appropriate outfit for the '{{{occasion}}}' with the current items (e.g., no formal shoes for a gala, no outerwear for travel), set 'shoppingAdvised' to true.
3. In 'stylistNote', provide professional styling advice. If 'shoppingAdvised' is true, explain exactly what key pieces are missing to perfect the look.
4. Return the IDs of any selected items in 'suggestedOutfit'.`,
});

const aiOutfitSuggesterFlow = ai.defineFlow(
  {
    name: 'aiOutfitSuggesterFlow',
    inputSchema: AiOutfitSuggesterInputSchema,
    outputSchema: AiOutfitSuggesterOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await outfitSuggesterPrompt(input);
      return output!;
    } catch (error) {
      // Fallback
      return {
        suggestedOutfit: [],
        shoppingAdvised: true,
        stylistNote: "I'm having trouble analyzing your full collection right now. It might be time to expand your wardrobe with some high-utility essentials."
      };
    }
  }
);
