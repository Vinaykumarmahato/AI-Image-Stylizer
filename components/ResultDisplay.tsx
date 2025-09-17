import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DownloadIcon } from './icons/DownloadIcon';
import type { ImageJob } from '../App';

interface ResultDisplayProps {
  jobs: ImageJob[];
}

const ImageComparisonSlider: React.FC<{ original: string, stylized: string }> = ({ original, stylized }) => {
    const [sliderPos, setSliderPos] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    const handleMove = (clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const percent = (x / rect.width) * 100;
        setSliderPos(percent);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true;
        handleMove(e.clientX);
    };
    
    const handleTouchStart = (e: React.TouchEvent) => {
        isDragging.current = true;
        handleMove(e.touches[0].clientX);
    }

    const handleMouseUp = () => {
        isDragging.current = false;
    };
    
    const handleTouchEnd = () => {
        isDragging.current = false;
    }

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging.current) return;
        handleMove(e.clientX);
    };
    
    const handleTouchMove = (e: TouchEvent) => {
        if (!isDragging.current) return;
        handleMove(e.touches[0].clientX);
    }

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleTouchEnd);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, []);

    return (
        <div 
          ref={containerRef}
          className="relative w-full aspect-square rounded-xl overflow-hidden select-none cursor-ew-resize group"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
            <img src={original} alt="Original" className="absolute inset-0 w-full h-full object-contain" draggable="false" />
            <div className="absolute inset-0 w-full h-full object-contain" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)`}}>
                <img src={stylized} alt="Stylized" className="absolute inset-0 w-full h-full object-contain" draggable="false" />
            </div>
            <div className="absolute inset-y-0 bg-white/50 w-1 backdrop-blur-sm transition-opacity duration-300 opacity-50 group-hover:opacity-100" style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}>
                <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-9 h-9 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
                </div>
            </div>
             <div className="absolute top-2 left-2 px-2 py-1 text-xs bg-black/50 text-white rounded-full">Original</div>
             <div className="absolute top-2 right-2 px-2 py-1 text-xs bg-black/50 text-white rounded-full">Stylized</div>
        </div>
    )
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

    return (
      <motion.div
        className="flex flex-col space-y-4 bg-gray-800/50 p-4 rounded-xl border border-white/10"
        variants={{
          hidden: { opacity: 0, y: 30, scale: 0.95 },
          visible: { opacity: 1, y: 0, scale: 1 },
        }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <h3 className="text-sm font-semibold text-gray-300 truncate w-full text-center" title={job.file.name}>{job.file.name}</h3>
        {job.status === 'done' && job.generatedUrl ? (
          <>
            <ImageComparisonSlider original={job.previewUrl} stylized={job.generatedUrl} />
            <motion.button 
                onClick={handleDownload}
                className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
            >
              <DownloadIcon className="w-5 h-5 mr-2"/>
              Download
            </motion.button>
          </>
        ) : (
          <div className="relative w-full aspect-square bg-red-900/30 rounded-xl overflow-hidden shadow-lg flex items-center justify-center p-4 border border-red-500/50">
              <p className="text-center text-red-300">{job.error}</p>
          </div>
        )}
      </motion.div>
    );
};


const ResultDisplay: React.FC<ResultDisplayProps> = ({ jobs }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {jobs.map(job => (
        <ResultCard key={job.id} job={job}/>
      ))}
    </motion.div>
  );
};

export default ResultDisplay;