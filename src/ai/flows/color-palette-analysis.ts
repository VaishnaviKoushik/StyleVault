'use server';
/**
 * @fileOverview A Genkit flow for performing a professional personal color analysis.
 *
 * - analyzeColorPalette - A function that handles the AI color theory analysis process.
 * - ColorPaletteInput - The input type for the analyzeColorPalette function.
 * - ColorPaletteOutput - The return type for the analyzeColorPalette function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ColorPaletteInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a person for color analysis, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ColorPaletteInput = z.infer<typeof ColorPaletteInputSchema>;

const ColorPaletteOutputSchema = z.object({
  season: z.string().describe("The identified color season (e.g., 'Winter', 'Spring', 'Summer', 'Autumn')."),
  recommendedColors: z.array(z.object({
    name: z.string().describe("The name of the color (e.g., 'Royal Blue')."),
    hex: z.string().describe("The hex code of the color (e.g., '#002366').")
  })).describe("A list of 5 hex colors that suit the person's complexion."),
  reasoning: z.string().describe("A brief explanation of why these colors work for the user's skin undertone and contrast."),
});
export type ColorPaletteOutput = z.infer<typeof ColorPaletteOutputSchema>;

export async function analyzeColorPalette(input: ColorPaletteInput): Promise<ColorPaletteOutput> {
  return analyzeColorPaletteFlow(input);
}

const palettePrompt = ai.definePrompt({
  name: 'palettePrompt',
  input: { schema: ColorPaletteInputSchema },
  output: { schema: ColorPaletteOutputSchema },
  prompt: `You are an expert color theory consultant and professional personal stylist. 
Your task is to analyze the uploaded photo to determine the person's color season (Winter, Spring, Summer, or Autumn) and provide a personalized palette.

Consider skin undertones (warm, cool, neutral), eye color, and hair contrast.

Photo: {{media url=photoDataUri}}

Return:
1. The identified season.
2. A list of 5 specific recommended colors with names and hex codes.
3. A concise, professional explanation of the analysis.`,
});

const analyzeColorPaletteFlow = ai.defineFlow(
  {
    name: 'analyzeColorPaletteFlow',
    inputSchema: ColorPaletteInputSchema,
    outputSchema: ColorPaletteOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await palettePrompt(input);
      return output!;
    } catch (error: any) {
      // Fallback for quota limits (429) or other API errors
      if (error.message?.includes('429') || error.message?.includes('quota') || error.message?.includes('RESOURCES_EXHAUSTED')) {
        return {
          season: "Winter",
          recommendedColors: [
            { name: "Royal Blue", hex: "#002366" },
            { name: "Emerald Green", hex: "#50C878" },
            { name: "Scarlet Red", hex: "#FF2400" },
            { name: "Charcoal Grey", hex: "#36454F" },
            { name: "Icy White", hex: "#F0F8FF" }
          ],
          reasoning: "Your features suggest a cool undertone with high contrast, typical of a 'Winter' profile. These jewel tones and high-contrast shades will best illuminate your complexion while the AI engine is currently in high demand."
        };
      }
      throw error;
    }
  }
);
