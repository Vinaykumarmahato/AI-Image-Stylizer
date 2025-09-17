import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import { fileToBase64, getMimeType } from '../utils/fileUtils';

/**
 * Sends an image and a prompt to the Gemini API for processing.
 * @param imageFile The image file to edit.
 * @param prompt The text prompt describing the desired edits.
 * @param apiKey The user's Google AI API key.
 * @returns A promise that resolves to the base64 encoded string of the generated image.
 */
export const editImageWithAI = async (imageFile: File, prompt: string, apiKey: string): Promise<string> => {
    if (!apiKey) {
        throw new Error("Google AI API Key is required.");
    }
    const ai = new GoogleGenAI({ apiKey });

    try {
        const base64ImageData = await fileToBase64(imageFile);
        const mimeType = getMimeType(imageFile);

        const imagePart = {
            inlineData: {
                data: base64ImageData,
                mimeType: mimeType,
            },
        };

        const textPart = {
            text: prompt,
        };

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: {
                parts: [imagePart, textPart],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        const candidate = response.candidates?.[0];

        if (!candidate || !candidate.content || !candidate.content.parts) {
            if (response.promptFeedback?.blockReason) {
                throw new Error(`Request was blocked: ${response.promptFeedback.blockReason}`);
            }
            throw new Error('API response was empty or invalid. The request may have been blocked for safety reasons.');
        }

        const imagePartFromResponse = candidate.content.parts.find(part => part.inlineData);

        if (imagePartFromResponse && imagePartFromResponse.inlineData) {
            return imagePartFromResponse.inlineData.data;
        }
        
        const textPartFromResponse = candidate.content.parts.find(part => part.text);
        if (textPartFromResponse && textPartFromResponse.text) {
             throw new Error(`API returned text instead of an image: "${textPartFromResponse.text}"`);
        }

        throw new Error('API did not return an image. It may have refused the request or returned only text.');

    } catch (error) {
        console.error('Error calling Gemini API:', error);
        if (error instanceof Error) {
            if (error.message.includes('API key not valid')) {
                 throw new Error('The API key is not valid. Please check your key and try again.');
            }
            throw new Error(`Failed to generate image: ${error.message}`);
        }
        throw new Error('An unknown error occurred while generating the image.');
    }
};