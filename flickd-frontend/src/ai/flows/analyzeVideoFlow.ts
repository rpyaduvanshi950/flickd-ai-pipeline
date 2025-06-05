
'use server';
/**
 * @fileOverview A video analysis AI agent for VibeMatch.
 *
 * - analyzeVideo - A function that handles the video analysis process.
 * - AnalyzeVideoInput - The input type for the analyzeVideo function.
 * - AnalyzeVideoOutput - The return type for the analyzeVideo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductSchema = z.object({
  id: z.string().describe('A unique identifier for the product.'),
  name: z.string().describe('The name of the product.'),
  type: z.string().describe('The type of product (e.g., Pants, T-Shirt, Sneakers).'),
  color: z.string().describe('The primary color of the product.'),
  matchType: z.string().describe('How this product matches the vibe (e.g., Primary Vibe, Visual Similarity, Complementary, Accessory Match).'),
  confidence: z.number().min(0).max(100).describe('A confidence score (0-100) of how well this product matches.'),
  imageUrl: z.string().url().describe("A placeholder image URL for the product. Use https://placehold.co/400x500.png format."),
  imageHint: z.string().optional().describe("One or two keywords for the product image (e.g., 'cargo pants', 'graphic tee').")
});

const AnalyzeVideoInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "The video content, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  fileName: z.string().optional().describe('The original name of the video file, for context if available.'),
});
export type AnalyzeVideoInput = z.infer<typeof AnalyzeVideoInputSchema>;

const AnalyzeVideoOutputSchema = z.object({
  vibes: z.array(z.string()).describe('A list of 3-5 aesthetic vibes detected in the video (e.g., Urban Streetwear, Minimalist, Techwear, Gorpcore).'),
  products: z.array(ProductSchema).min(3).max(5).describe('A list of 3-5 suggested fashion products matching the detected vibes.'),
  advice: z.string().describe("Detailed outfit advice including styling tips, trend insights, and personalized recommendations based on the video's vibe and suggested products. Format this with newlines for readability."),
});
export type AnalyzeVideoOutput = z.infer<typeof AnalyzeVideoOutputSchema>;


export async function analyzeVideo(input: AnalyzeVideoInput): Promise<AnalyzeVideoOutput> {
  return analyzeVideoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeVideoPrompt',
  input: {schema: AnalyzeVideoInputSchema},
  output: {schema: AnalyzeVideoOutputSchema},
  prompt: `You are an expert fashion stylist and trend analyst called VibeMatch.
Your task is to analyze a video to determine its aesthetic vibe, suggest matching fashion products, and provide outfit advice.

Video content: {{media url=videoDataUri}}
{{#if fileName}}Video file name: {{{fileName}}}{{/if}}

Based on the video, please provide the following:

1.  **Vibes:** Identify 3-5 distinct aesthetic vibes or styles present in the video (e.g., "Urban Streetwear", "Minimalist", "Techwear", "Gorpcore", "Vintage", "Bohemian", "Athleisure").
2.  **Matched Products:** Suggest 3-5 fashion products that align with the detected vibes. For each product, provide:
    *   \`id\`: A unique string ID (e.g., "product-1", "product-2").
    *   \`name\`: A descriptive name for the product (e.g., "Tech Cargo Pants", "Oversized Graphic Tee").
    *   \`type\`: The category of the product (e.g., "Pants", "T-Shirt", "Outerwear", "Footwear", "Accessory").
    *   \`color\`: The primary color(s) of the product (e.g., "Black", "White", "Olive Green", "Grey/Neon").
    *   \`matchType\`: Explain how it matches (e.g., "Primary Vibe", "Visual Similarity", "Complementary", "Accessory Match").
    *   \`confidence\`: A score from 0 to 100 indicating how well it matches the vibe.
    *   \`imageUrl\`: Use a placeholder image URL in the format "https://placehold.co/400x500.png".
    *   \`imageHint\`: Provide one or two keywords for a real image search, like "cargo pants" or "graphic tee".
3.  **Outfit Advisor:** Offer comprehensive advice, structured with newlines for readability. Include:
    *   A general statement about the video's overall aesthetic.
    *   Styling Tips: How to combine the suggested products or similar items.
    *   Trend Insights: Current trends related to the detected vibes.
    *   Personalized Recommendations: Suggestions for experimenting with the style further.

Ensure your output strictly adheres to the JSON schema format defined for \`AnalyzeVideoOutputSchema\`.
For product imageURLs, always use "https://placehold.co/400x500.png".
For product IDs, ensure they are unique like "product-1", "product-2", etc.
The advice section should be a single string, but use \\n for newlines to create paragraphs and bullet points (e.g., "- Point 1\\n- Point 2").
`,
});

const analyzeVideoFlow = ai.defineFlow(
  {
    name: 'analyzeVideoFlow',
    inputSchema: AnalyzeVideoInputSchema,
    outputSchema: AnalyzeVideoOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('The video analysis failed to produce an output.');
    }
    // Ensure IDs are unique for products and imageUrl is correct
    const productsWithUniqueIds = output.products.map((product, index) => ({
      ...product,
      id: `product-${index + 1}-${Date.now()}`, 
      imageUrl: product.imageUrl && product.imageUrl.startsWith('https://placehold.co/') ? product.imageUrl : `https://placehold.co/400x500.png`
    }));

    return {
        ...output,
        products: productsWithUniqueIds
    };
  }
);
