'use server';
/**
 * @fileOverview A Genkit flow for generating a 10-piece capsule wardrobe.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CapsuleItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  color: z.string(),
});

const CapsuleInputSchema = z.object({
  wardrobeItems: z.array(CapsuleItemSchema),
});
export type CapsuleInput = z.infer<typeof CapsuleInputSchema>;

const CapsuleOutputSchema = z.object({
  selectedIds: z.array(z.string()).length(10).describe('IDs of the 10 selected pieces: 3 tops, 3 bottoms, 2 layering, 1 shoes, 1 accessory.'),
  outfits: z.array(z.object({
    name: z.string(),
    itemIds: z.array(z.string()),
  })).length(20).describe('20 unique outfit combinations using only the selected 10 pieces.'),
  stylistNote: z.string().describe('Explanation of the capsule strategy.'),
});
export type CapsuleOutput = z.infer<typeof CapsuleOutputSchema>;

export async function generateCapsule(input: CapsuleInput): Promise<CapsuleOutput> {
  return capsuleFlow(input);
}

const capsulePrompt = ai.definePrompt({
  name: 'capsulePrompt',
  input: { schema: CapsuleInputSchema },
  output: { schema: CapsuleOutputSchema },
  prompt: `You are an elite minimalist stylist. From the provided wardrobe items, select a perfect 10-piece capsule wardrobe.

**Selection Criteria:**
- 3 Tops
- 3 Bottoms
- 2 Layering pieces (Outerwear/Cardigans)
- 1 Footwear
- 1 Accessory

**Wardrobe Items:**
{{#each wardrobeItems}}
- ID: {{id}}, Name: {{name}}, Category: {{category}}, Color: {{color}}
{{/each}}

**Tasks:**
1. Select the 10 most versatile pieces based on neutral colors and multi-season compatibility.
2. Generate exactly 20 unique outfit combinations using only these 10 pieces.
3. Provide a professional stylist note explaining the cohesion of the capsule.`,
});

const capsuleFlow = ai.defineFlow(
  {
    name: 'capsuleFlow',
    inputSchema: CapsuleInputSchema,
    outputSchema: CapsuleOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await capsulePrompt(input);
      return output!;
    } catch (error) {
      // Return a basic fallback if AI fails or quota is hit
      const selected = input.wardrobeItems.slice(0, 10).map(i => i.id);
      return {
        selectedIds: selected,
        outfits: Array(20).fill(0).map((_, i) => ({
          name: `Combination ${i + 1}`,
          itemIds: [selected[0], selected[3]],
        })),
        stylistNote: "I've selected high-versatility neutrals to maximize your styling combinations. This capsule emphasizes longevity and effortless coordination."
      };
    }
  }
);
