
/**
 * Sends an image and a prompt to the backend service for AI processing.
 * @param imageFile The image file to edit.
 * @param prompt The text prompt describing the desired edits.
 * @returns A promise that resolves to the base64 encoded string of the generated image.
 */
export const editImageWithAI = async (imageFile: File, prompt: string): Promise<string> => {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('prompt', prompt);

    try {
        const response = await fetch('/api/stylize', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            // If the server returns an error, use the message from the JSON response
            throw new Error(data.error || 'An unknown error occurred on the server.');
        }

        if (data.imageData) {
            return data.imageData;
        } else {
            throw new Error('Invalid response from server: missing imageData.');
        }

    } catch (error) {
        console.error('Error communicating with backend:', error);
        // Re-throw the error to be caught by the UI component
        if (error instanceof Error) {
            throw new Error(`Failed to generate image: ${error.message}`);
        }
        throw new Error('Failed to generate image due to a network or server error.');
    }
};
