
import React from 'react';
import { DownloadIcon } from './icons/DownloadIcon';

interface ResultDisplayProps {
  originalImage: string;
  generatedImage: string;
  imageName?: string;
}

const ImageCard: React.FC<{ src: string; title: string; children?: React.ReactNode }> = ({ src, title, children }) => (
    <div className="flex flex-col items-center space-y-4">
        <h3 className="text-lg font-semibold text-gray-300">{title}</h3>
        <div className="relative w-full aspect-square bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-white/10">
            <img src={src} alt={title} className="object-contain w-full h-full" />
        </div>
        {children}
    </div>
);


const ResultDisplay: React.FC<ResultDisplayProps> = ({ originalImage, generatedImage, imageName }) => {

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = generatedImage;
        const name = imageName ? `wedding_${imageName.split('.').slice(0, -1).join('.')}.png` : 'generated_wedding_photo.png';
        link.download = name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <ImageCard src={originalImage} title="Original Photo" />
      <ImageCard src={generatedImage} title="AI Generated Wedding Photo">
        <button 
            onClick={handleDownload}
            className="w-full flex items-center justify-center px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-500/50">
            <DownloadIcon className="w-5 h-5 mr-2"/>
            Download
        </button>
      </ImageCard>
    </div>
  );
};

export default ResultDisplay;
