
/**
 * Converts a File object to a base64 encoded string, without the data URI prefix.
 * @param file The file to convert.
 * @returns A promise that resolves with the base64 string.
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URI prefix (e.g., "data:image/png;base64,")
      const base64Data = result.split(',')[1];
      if (base64Data) {
        resolve(base64Data);
      } else {
        reject(new Error("Failed to read base64 data from file."));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Gets the IANA MIME type of a file.
 * @param file The file to inspect.
 * @returns The MIME type string (e.g., "image/png").
 */
export const getMimeType = (file: File): string => {
  return file.type;
};
