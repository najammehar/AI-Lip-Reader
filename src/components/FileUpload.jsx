import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileVideo, AlertCircle } from 'lucide-react';

const FileUpload = ({ onFileSelect, accept = "video/*", maxSize = 50 }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const validateFile = (selectedFile) => {
    // Validate file type
    const validTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/mkv', 'video/webm'];
    if (!validTypes.includes(selectedFile.type)) {
      return 'INVALID_TYPE';
    }

    // Validate file size (convert MB to bytes)
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (selectedFile.size > maxSizeBytes) {
      return 'FILE_TOO_LARGE';
    }

    return 'VALID';
  };

  const handleFileChange = (selectedFile) => {
    if (!selectedFile) return;
    
    const validation = validateFile(selectedFile);
    
    if (validation === 'INVALID_TYPE') {
      setFile(null);
      setError('Please upload a valid video file (MP4, AVI, MOV, MKV, WebM)');
      return;
    }
    
    if (validation === 'FILE_TOO_LARGE') {
      setFile(null);
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }
    
    setError('');
    setFile(selectedFile);
    onFileSelect(selectedFile);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onFileSelect(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`
          relative border-2 border-dashed rounded transition-all duration-300
          ${dragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-[#1f1f1f] hover:border-indigo-500/50'}
          ${error ? 'border-red-500' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={(e) => handleFileChange(e.target.files[0])}
          className="hidden"
          id="file-upload"
          data-testid="file-upload"
        />

        <AnimatePresence mode="wait">
          {!file ? (
            <motion.label
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center px-6 py-12 cursor-pointer"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-16 h-16 mb-4 rounded bg-[#111111] flex items-center justify-center"
              >
                <Upload size={32} className="text-indigo-500" />
              </motion.div>
              <p className="text-lg font-medium text-white mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-gray-400">
                MP4, AVI, MOV, MKV, WebM (max {maxSize}MB)
              </p>
            </motion.label>
          ) : (
            <motion.div
              key="file"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between px-6 py-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded bg-indigo-500/20 flex items-center justify-center">
                  <FileVideo size={24} className="text-indigo-500" />
                </div>
                <div>
                  <p className="font-medium text-white truncate max-w-xs">
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-400">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleRemoveFile}
                aria-label="Remove"
                className="p-2 rounded hover:bg-[#181818] text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mt-3 text-red-500 text-sm"
        >
          <AlertCircle size={16} />
          <span>{error}</span>
        </motion.div>
      )}
    </div>
  );
};

export default FileUpload;
