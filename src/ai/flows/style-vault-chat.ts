'use server';
/**
 * @fileOverview A Genkit flow for the StyleVault AI personal stylist chat.
 *
 * - styleVaultChat - A function that handles conversational styling advice.
 * - StyleVaultChatInput - The input type for the styleVaultChat function.
 * - StyleVaultChatOutput - The return type for the styleVaultChat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'model', 'system']),
  content: z.string(),
});

const StyleVaultChatInputSchema = z.object({
  history: z.array(MessageSchema).describe('The conversation history.'),
  message: z.string().describe('The user\'s current message.'),
  wardrobeItems: z.array(z.object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
    color: z.string(),
    description: z.string(),
  })).optional().describe('Context about the user\'s wardrobe.'),
});
export type StyleVaultChatInput = z.infer<typeof StyleVaultChatInputSchema>;

const StyleVaultChatOutputSchema = z.object({
  reply: z.string().describe('The AI stylist\'s response.'),
});
export type StyleVaultChatOutput = z.infer<typeof StyleVaultChatOutputSchema>;

export async function styleVaultChat(input: StyleVaultChatInput): Promise<StyleVaultChatOutput> {
  return styleVaultChatFlow(input);
}

const chatPrompt = ai.definePrompt({
  name: 'styleVaultChatPrompt',
  input: { schema: StyleVaultChatInputSchema },
  output: { schema: StyleVaultChatOutputSchema },
  prompt: `You are StyleVault AI, a professional and highly sophisticated personal fashion stylist. 
Your goal is to provide expert styling advice, trend analysis, and wardrobe coordination tips.

{{#if wardrobeItems}}
You have access to the user's digital wardrobe:
{{#each wardrobeItems}}
- {{name}} ({{category}}, {{color}}): {{description}}
{{/each}}
{{/if}}

Context:
{{#each history}}
{{role}}: {{content}}
{{/each}}

User: {{message}}

Please provide a helpful, encouraging, and stylish response. If the user asks for an outfit, try to reference items from their wardrobe if provided. Maintain a tone that is elegant, knowledgeable, and modern.`,
});

const styleVaultChatFlow = ai.defineFlow(
  {
    name: 'styleVaultChatFlow',
    inputSchema: StyleVaultChatInputSchema,
    outputSchema: StyleVaultChatOutputSchema,
  },
  async (input) => {
    const { output } = await chatPrompt(input);
    return output!;
  }
);
