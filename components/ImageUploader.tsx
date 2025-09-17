import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  onImagesUpload: (files: FileList) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onImagesUpload(e.target.files);
      e.target.value = ''; // Reset for re-uploading same file
    }
  };
  
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onImagesUpload(e.dataTransfer.files);
    }
  }, [onImagesUpload]);

  return (
    <div className="w-full">
      <motion.label
        htmlFor="image-upload"
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 border-gray-600 bg-gray-800/50"
        variants={{
          idle: { borderColor: '#4B5563', backgroundColor: 'rgba(31, 41, 55, 0.5)', scale: 1 },
          dragging: { borderColor: '#818cf8', backgroundColor: 'rgba(67, 56, 202, 0.3)', scale: 1.05 }
        }}
        animate={isDragging ? 'dragging' : 'idle'}
        transition={{ duration: 0.2 }}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadIcon className="w-10 h-10 mb-3 text-gray-400"/>
            <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-gray-500">PNG, JPG, or WEBP (Multiple files supported)</p>
        </div>
        <input id="image-upload" type="file" multiple className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
      </motion.label>
    </div>
  );
};

export default ImageUploader;