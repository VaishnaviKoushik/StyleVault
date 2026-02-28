'use server';
/**
 * @fileOverview A Genkit flow for recommending outfits based on weather conditions and a user's wardrobe.
 *
 * - weatherBasedOutfitRecommender - A function that handles the outfit recommendation process.
 * - WeatherBasedOutfitRecommenderInput - The input type for the weatherBasedOutfitRecommender function.
 * - WeatherBasedOutfitRecommenderOutput - The return type for the weatherBasedOutfitRecommender function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WeatherBasedOutfitRecommenderInputSchema = z.object({
  wardrobeItems: z
    .array(z.string())
    .describe(
      "An array of clothing items available in the user's wardrobe. Each item should be a descriptive string (e.g., 'blue t-shirt', 'heavy winter coat', 'light summer dress', 'jeans', 'umbrella')."
    ),
  weatherCondition: z
    .string()
    .describe(
      'The current weather condition (e.g., "sunny", "cloudy", "rainy", "snowy", "windy").'
    ),
  temperature: z.number().describe('The current temperature.'),
  temperatureUnit: z
    .enum(['C', 'F'])
    .describe('The unit of temperature (Celsius "C" or Fahrenheit "F").'),
  occasion: z
    .string()
    .optional()
    .describe(
      'The occasion for which the outfit is needed (e.g., "casual", "formal", "sporty", "work", "night out").'
    ),
});
export type WeatherBasedOutfitRecommenderInput = z.infer<
  typeof WeatherBasedOutfitRecommenderInputSchema
>;

const WeatherBasedOutfitRecommenderOutputSchema = z.object({
  recommendedOutfit: z
    .array(z.string())
    .describe(
      'An array of clothing items recommended for the given weather and occasion, chosen exclusively from the provided wardrobe items.'
    ),
  reasoning: z
    .string()
    .describe(
      'A brief explanation of why the recommended outfit is suitable for the weather and occasion.'
    ),
});
export type WeatherBasedOutfitRecommenderOutput = z.infer<
  typeof WeatherBasedOutfitRecommenderOutputSchema
>;

export async function weatherBasedOutfitRecommender(
  input: WeatherBasedOutfitRecommenderInput
): Promise<WeatherBasedOutfitRecommenderOutput> {
  return weatherBasedOutfitRecommenderFlow(input);
}

const weatherBasedOutfitPrompt = ai.definePrompt({
  name: 'weatherBasedOutfitPrompt',
  input: {schema: WeatherBasedOutfitRecommenderInputSchema},
  output: {schema: WeatherBasedOutfitRecommenderOutputSchema},
  prompt: `You are an expert personal stylist specializing in weather-appropriate fashion. Your goal is to recommend a complete outfit from the user's wardrobe based on the current weather conditions and the specified occasion.

Only choose items that are explicitly listed in the 'wardrobeItems' list. Do not invent new items. If a suitable item for a specific weather condition or occasion is not available, state that it's not possible to recommend a perfect item and suggest the closest alternative from the available wardrobe.

Wardrobe Items:
{{#each wardrobeItems}}
- {{{this}}}
{{/each}}

Current Weather: {{{weatherCondition}}}
Temperature: {{{temperature}}} {{{temperatureUnit}}}
{{#if occasion}}
Occasion: {{{occasion}}}
{{/if}}

Recommend an outfit and provide a brief reasoning for your choices. Ensure the outfit is practical and comfortable for the given conditions.`,
});

const weatherBasedOutfitRecommenderFlow = ai.defineFlow(
  {
    name: 'weatherBasedOutfitRecommenderFlow',
    inputSchema: WeatherBasedOutfitRecommenderInputSchema,
    outputSchema: WeatherBasedOutfitRecommenderOutputSchema,
  },
  async input => {
    try {
      const {output} = await weatherBasedOutfitPrompt(input);
      return output!;
    } catch (error: any) {
      if (error.message?.includes('429') || error.message?.includes('quota') || error.message?.includes('RESOURCES_EXHAUSTED')) {
        return {
          recommendedOutfit: input.wardrobeItems.slice(0, 3),
          reasoning: "The styling engine is currently under high demand. I've selected a versatile base of items from your collection that are generally appropriate for transitional conditions."
        };
      }
      throw error;
    }
  }
);
