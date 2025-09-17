import React from 'react';
import { DownloadIcon } from './icons/DownloadIcon';

interface ImageJob {
    id: string;
    file: File;
    previewUrl: string;
    status: 'queued' | 'processing' | 'done' | 'error';
    generatedUrl: string | null;
    error: string | null;
}

interface ResultDisplayProps {
  jobs: ImageJob[];
}

const ResultCard: React.FC<{ job: ImageJob }> = ({ job }) => {
    
    const handleDownload = () => {
        if (!job.generatedUrl) return;
        const link = document.createElement('a');
        link.href = job.generatedUrl;
        const name = `stylized_${job.file.name.split('.').slice(0, -1).join('.')}.png`;
        link.download = name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (job.status === 'error') {
        return (
            <div className="flex flex-col items-center space-y-2 p-4 bg-red-900/30 rounded-xl border border-red-500/50">
                <h3 className="text-lg font-semibold text-red-200 truncate w-full text-center" title={job.file.name}>{job.file.name}</h3>
                <div className="relative w-full aspect-square bg-gray-900 rounded-xl overflow-hidden shadow-lg flex items-center justify-center p-4">
                    <p className="text-center text-red-300">{job.error}</p>
                </div>
            </div>
        )
    }

    if (job.status !== 'done' || !job.generatedUrl) return null;

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col items-center">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Original</h4>
                    <img src={job.previewUrl} alt="Original" className="object-contain w-full h-full rounded-lg" />
                </div>
                <div className="flex flex-col items-center">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Stylized</h4>
                    <img src={job.generatedUrl} alt="Generated" className="object-contain w-full h-full rounded-lg" />
                </div>
            </div>
             <button 
                onClick={handleDownload}
                className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500/50">
                <DownloadIcon className="w-5 h-5 mr-2"/>
                Download
            </button>
        </div>
    );
};


const ResultDisplay: React.FC<ResultDisplayProps> = ({ jobs }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {jobs.map(job => (
        <ResultCard key={job.id} job={job}/>
      ))}
    </div>
  );
};

export default ResultDisplay;
