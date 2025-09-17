
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import { SpinnerIcon } from './components/icons/SpinnerIcon';
import { editImageWithAI } from './services/geminiService';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalImagePreview, setOriginalImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('Transform this into a beautiful wedding photo of the couple. They should be in wedding attire, in a romantic, celebratory setting.');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!originalImage) {
      setOriginalImagePreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(originalImage);
    setOriginalImagePreview(objectUrl);

    // Free memory when the component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [originalImage]);

  const handleImageUpload = (file: File) => {
    setOriginalImage(file);
    setGeneratedImage(null);
    setError(null);
  };

  const handleGenerateClick = useCallback(async () => {
    if (!originalImage || !prompt) {
      setError('Please upload an image and provide a prompt.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const generatedImageBase64 = await editImageWithAI(originalImage, prompt);
      const imageUrl = `data:image/png;base64,${generatedImageBase64}`;
      setGeneratedImage(imageUrl);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, prompt]);
  
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans from-gray-900 to-teal-900 bg-gradient-to-br">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-gray-800/50 rounded-2xl shadow-2xl shadow-teal-500/10 backdrop-blur-sm border border-white/10 overflow-hidden">
          <div className="p-8 space-y-8">
            <div>
              <h2 className="text-xl font-bold text-teal-300 mb-2">1. Upload Your Photo</h2>
              <p className="text-gray-400 mb-4">Select an image of a couple you'd like to transform.</p>
              <ImageUploader onImageUpload={handleImageUpload} previewUrl={originalImagePreview} />
            </div>

            {originalImage && (
              <>
                <div>
                  <h2 className="text-xl font-bold text-teal-300 mb-2">2. Describe the Scene</h2>
                  <p className="text-gray-400 mb-4">Tell the AI what kind of wedding photo you envision.</p>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 text-gray-200 resize-none h-28"
                    placeholder="e.g., Make this a vintage wedding photo..."
                  />
                </div>

                <div className="text-center">
                  <button
                    onClick={handleGenerateClick}
                    disabled={isLoading}
                    className="w-full md:w-auto px-12 py-4 bg-teal-600 hover:bg-teal-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg text-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-500/50 flex items-center justify-center mx-auto"
                  >
                    {isLoading ? (
                      <>
                        <SpinnerIcon className="w-6 h-6 mr-3" />
                        Generating...
                      </>
                    ) : (
                      'Create Wedding Photo'
                    )}
                  </button>
                </div>
              </>
            )}
          </div>

          {error && (
            <div className="bg-red-900/50 border-t border-b border-red-500/30 text-red-300 px-4 py-3" role="alert">
                <p className="font-bold text-center">{error}</p>
            </div>
           )}

          {generatedImage && originalImagePreview && (
             <div className="p-8 bg-gray-900/30 border-t border-white/10">
                <h2 className="text-2xl font-bold text-center text-teal-300 mb-6">Your Transformation is Complete!</h2>
                 <ResultDisplay 
                    originalImage={originalImagePreview} 
                    generatedImage={generatedImage} 
                    imageName={originalImage?.name}
                 />
             </div>
          )}
        </div>
      </main>
      <footer className="text-center py-6 text-gray-500">
        <p>created by vinay kumar mahato</p>
      </footer>
    </div>
  );
};

export default App;
