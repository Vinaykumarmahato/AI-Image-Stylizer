import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import { SpinnerIcon } from './components/icons/SpinnerIcon';
import { editImageWithAI } from './services/geminiService';
import { XCircleIcon } from './components/icons/XCircleIcon';

export interface ImageJob {
  id: string;
  file: File;
  previewUrl: string;
  status: 'queued' | 'processing' | 'done' | 'error';
  generatedUrl: string | null;
  error: string | null;
}

const stylePresets = [
  { name: 'Cinematic', prompt: 'cinematic lighting, dramatic, high detail, photorealistic' },
  { name: 'Vintage', prompt: 'vintage photo, retro, grainy, warm tones, 1970s style' },
  { name: 'Fantasy', prompt: 'fantasy art, magical, epic, illustrative, glowing elements' },
  { name: 'Watercolor', prompt: 'watercolor painting, soft edges, vibrant colors, artistic' },
  { name: 'Anime', prompt: 'anime style, vibrant, detailed, Japanese animation aesthetic' },
];

const App: React.FC = () => {
  const [imageJobs, setImageJobs] = useState<ImageJob[]>([]);
  const [prompt, setPrompt] = useState<string>('A beautiful, highly detailed, photorealistic image.');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  const handleImagesUpload = (files: FileList) => {
    const newJobs: ImageJob[] = Array.from(files).map(file => ({
      id: uuidv4(),
      file,
      previewUrl: URL.createObjectURL(file),
      status: 'queued',
      generatedUrl: null,
      error: null,
    }));
    setImageJobs(prev => [...prev, ...newJobs]);
  };

  const removeJob = (id: string) => {
    setImageJobs(prev => prev.filter(job => {
      if (job.id === id) {
        URL.revokeObjectURL(job.previewUrl);
        return false;
      }
      return true;
    }));
  };
  
  const applyStyle = (stylePrompt: string) => {
    setPrompt(prev => `${prev.split(',')[0]}, ${stylePrompt}`);
  };

  const handleGenerateClick = useCallback(async () => {
    const jobsToProcess = imageJobs.filter(job => job.status === 'queued');
    if (jobsToProcess.length === 0) return;

    setIsProcessing(true);

    for (const job of jobsToProcess) {
      setImageJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'processing' } : j));
      try {
        const generatedImageBase64 = await editImageWithAI(job.file, prompt);
        const imageUrl = `data:image/png;base64,${generatedImageBase64}`;
        setImageJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'done', generatedUrl: imageUrl } : j));
      } catch (err) {
        console.error(err);
        const message = err instanceof Error ? err.message : 'An unknown error occurred.';
        setImageJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'error', error: message } : j));
      }
    }

    setIsProcessing(false);
  }, [imageJobs, prompt]);

  const queuedJobs = imageJobs.filter(job => job.status === 'queued' || job.status === 'processing');
  const completedJobs = imageJobs.filter(job => job.status === 'done' || job.status === 'error');

  return (
    <div className="min-h-screen text-white font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-6xl mx-auto bg-black/30 rounded-2xl shadow-2xl shadow-indigo-500/10 backdrop-blur-xl border border-white/10 overflow-hidden"
        >
          <div className="p-8 space-y-8">
            <h2 className="text-2xl font-bold text-indigo-300 mb-4 border-b-2 border-indigo-500/20 pb-4">1. Setup Your Transformation</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                 <h3 className="text-xl font-semibold text-gray-200">Upload Images</h3>
                 <ImageUploader onImagesUpload={handleImagesUpload} />
                 
                 <h3 className="text-xl font-semibold text-gray-200 pt-4">Describe the Scene</h3>
                 <p className="text-gray-400">Enter a prompt, or start with one of our styles.</p>
                 <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 text-gray-200 resize-none h-28"
                    placeholder="e.g., A photo of a cat in a spacesuit on Mars..."
                  />

                  <h3 className="text-xl font-semibold text-gray-200">Style Presets</h3>
                  <div className="flex flex-wrap gap-2">
                    {stylePresets.map(style => (
                        <motion.button 
                          key={style.name} 
                          onClick={() => applyStyle(style.prompt)} 
                          className="px-4 py-2 bg-gray-700/50 hover:bg-indigo-600 text-gray-200 rounded-lg transition-colors duration-200"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                            {style.name}
                        </motion.button>
                    ))}
                  </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-200">Processing Queue ({queuedJobs.length})</h3>
                <div className="w-full h-96 bg-gray-900/50 rounded-lg p-4 border border-gray-700 overflow-y-auto space-y-4">
                  <AnimatePresence>
                    {queuedJobs.length > 0 ? (
                      queuedJobs.map(job => (
                        <motion.div 
                          key={job.id}
                          layout
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                          className="flex items-center bg-gray-800/70 p-2 rounded-lg"
                        >
                          <img src={job.previewUrl} alt={job.file.name} className="w-16 h-16 rounded-md object-cover mr-4" />
                          <div className="flex-grow overflow-hidden">
                            <p className="text-sm font-medium truncate">{job.file.name}</p>
                            <p className={`text-xs font-bold ${job.status === 'processing' ? 'text-yellow-400 animate-pulse' : 'text-gray-400'}`}>
                              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                            </p>
                          </div>
                          {job.status === 'processing' ? <SpinnerIcon className="w-5 h-5 mr-2" /> : (
                              <motion.button whileTap={{scale:0.8}} onClick={() => removeJob(job.id)} disabled={isProcessing} className="p-1 text-gray-500 hover:text-red-500 disabled:opacity-50">
                                  <XCircleIcon className="w-6 h-6"/>
                              </motion.button>
                          )}
                        </motion.div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                          <p>Upload images to get started</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="text-center pt-4">
              <motion.button
                onClick={handleGenerateClick}
                disabled={isProcessing || queuedJobs.length === 0}
                className="w-full md:w-auto px-16 py-4 bg-indigo-600 text-white font-bold rounded-lg text-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 flex items-center justify-center mx-auto disabled:bg-gray-600 disabled:cursor-not-allowed"
                whileHover={{ scale: isProcessing || queuedJobs.length === 0 ? 1 : 1.05, y: isProcessing || queuedJobs.length === 0 ? 0 : -2 }}
                whileTap={{ scale: isProcessing || queuedJobs.length === 0 ? 1 : 0.95 }}
              >
                {isProcessing ? (
                  <>
                    <SpinnerIcon className="w-6 h-6 mr-3" />
                    Processing...
                  </>
                ) : (
                  `Stylize ${queuedJobs.length > 0 ? queuedJobs.length : ''} Image(s)`
                )}
              </motion.button>
            </div>
          </div>
          
          <AnimatePresence>
            {completedJobs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="p-8 bg-gray-900/30 border-t border-white/10"
              >
                <h2 className="text-2xl font-bold text-center text-indigo-300 mb-6">2. Your Transformed Images</h2>
                <ResultDisplay jobs={completedJobs} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
      <footer className="text-center py-6 text-gray-500">
        <p>created by vinay kumar mahato</p>
      </footer>
    </div>
  );
};

export default App;