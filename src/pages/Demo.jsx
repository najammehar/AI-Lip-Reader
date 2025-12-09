import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, CheckCircle2, AlertCircle, Loader2, BarChart3 } from 'lucide-react';
import FileUpload from '../components/FileUpload';
import Button from '../components/Button';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';

const Demo = () => {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setResult(null);
    setError(null);
    setProgress(0);
  };

  const simulateProcessing = async () => {
    setProcessing(true);
    setError(null);
    setResult(null);
    
    const stages = [
      { progress: 20, delay: 800, message: 'Extracting frames...' },
      { progress: 40, delay: 1000, message: 'Detecting facial landmarks...' },
      { progress: 60, delay: 1200, message: 'Processing visual features...' },
      { progress: 80, delay: 1000, message: 'Running inference...' },
      { progress: 100, delay: 800, message: 'Complete!' },
    ];

    try {
      for (const stage of stages) {
        await new Promise(resolve => setTimeout(resolve, stage.delay));
        setProgress(stage.progress);
      }

      // Simulate result with sentence predictions
      const mockResults = [
        { 
          sentence: 'The weather is absolutely beautiful today', 
          confidence: 0.91,
          words: ['the', 'weather', 'is', 'absolutely', 'beautiful', 'today']
        },
        { 
          sentence: 'The weather is absolutely beautiful now', 
          confidence: 0.84,
          words: ['the', 'weather', 'is', 'absolutely', 'beautiful', 'now']
        },
        { 
          sentence: 'The weather looks absolutely beautiful today', 
          confidence: 0.78,
          words: ['the', 'weather', 'looks', 'absolutely', 'beautiful', 'today']
        },
      ];

      setResult({
        prediction: mockResults[0].sentence,
        confidence: mockResults[0].confidence,
        words: mockResults[0].words,
        alternatives: mockResults,
        processingTime: '2.8s',
        frameCount: 29,
      });
    } catch (err) {
      setError('Processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleProcess = () => {
    if (!file) return;
    simulateProcessing();
  };

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Try the <span className="text-gradient">Demo</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Upload a video to see our AI lip reading system in action
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Upload Section */}
          <Card>
            <h2 className="text-2xl font-semibold mb-6">Upload Video</h2>
            <FileUpload onFileSelect={handleFileSelect} maxSize={50} />
            
            {file && !processing && !result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex justify-end"
              >
                <Button
                  icon={Play}
                  size="lg"
                  className="cursor-pointer"
                  onClick={handleProcess}
                >
                  Process Video
                </Button>
              </motion.div>
            )}
          </Card>

          {/* Processing Section */}
          <AnimatePresence>
            {processing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card glow>
                  <div className="flex items-center gap-4 mb-6">
                    <Loader2 className="animate-spin text-indigo-500" size={28} />
                    <h3 className="text-2xl font-semibold">Processing Video...</h3>
                  </div>
                  <ProgressBar progress={progress} className="mb-6" />
                  <div className="grid grid-cols-2 gap-6 text-sm">
                    <div>
                      <span className="block text-white font-medium mb-2">Current Stage</span>
                      <span className="text-gray-400">
                        {progress < 20 && 'Extracting frames'}
                        {progress >= 20 && progress < 40 && 'Detecting landmarks'}
                        {progress >= 40 && progress < 60 && 'Processing features'}
                        {progress >= 60 && progress < 80 && 'Running inference'}
                        {progress >= 80 && 'Finalizing results'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-white font-medium mb-2">Progress</span>
                      <span className="text-gray-400">{progress}%</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Section */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <Card glow>
                  <div className="flex items-center gap-3 mb-8">
                    <CheckCircle2 className="text-emerald-500" size={32} />
                    <h3 className="text-2xl font-semibold">Transcription Result</h3>
                  </div>

                  {/* Main Prediction */}
                  <div className="bg-[#0a0a0a] rounded-lg p-8 mb-8 border border-indigo-500/20">
                    <div className="text-sm text-gray-400 mb-3 uppercase tracking-wider">Predicted Text</div>
                    <div className="text-2xl md:text-3xl font-medium text-white mb-6 leading-relaxed">
                      "{result.prediction}"
                    </div>
                    <div className="flex flex-wrap items-center gap-6">
                      <div className="flex items-center gap-2">
                        <BarChart3 size={18} className="text-indigo-400" />
                        <span className="text-sm text-gray-400">
                          Confidence: <span className="text-white font-semibold">{(result.confidence * 100).toFixed(1)}%</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">
                          Words: <span className="text-white font-semibold">{result.words.length}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Word Breakdown */}
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold mb-4">Word Breakdown</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.words.map((word, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-sm font-medium"
                        >
                          {word}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-[#0a0a0a] rounded-lg p-6 border border-[#1f1f1f]">
                      <div className="text-sm text-gray-400 mb-2">Processing Time</div>
                      <div className="text-2xl font-semibold">{result.processingTime}</div>
                    </div>
                    <div className="bg-[#0a0a0a] rounded-lg p-6 border border-[#1f1f1f]">
                      <div className="text-sm text-gray-400 mb-2">Frames Analyzed</div>
                      <div className="text-2xl font-semibold">{result.frameCount}</div>
                    </div>
                  </div>

                  {/* Alternative Predictions */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Alternative Predictions</h4>
                    <div className="space-y-3">
                      {result.alternatives.map((alt, index) => (
                        <div key={index} className="bg-[#0a0a0a] rounded-lg p-5 border border-[#1f1f1f]">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <span className="text-gray-200 flex-1">"{alt.sentence}"</span>
                            <span className="text-sm text-gray-400 shrink-0">
                              {(alt.confidence * 100).toFixed(1)}%
                            </span>
                          </div>
                          <ProgressBar progress={alt.confidence * 100} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <Button
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => {
                        setFile(null);
                        setResult(null);
                        setProgress(0);
                      }}
                    >
                      Process Another Video
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Section */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card>
                  <div className="flex items-center gap-3 text-red-500">
                    <AlertCircle size={24} />
                    <p>{error}</p>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Instructions */}
          {!result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card hover={false} className="bg-[#0a0a0a]">
                <h3 className="text-lg font-semibold mb-6">Guidelines for Best Results</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3 text-indigo-400">Video Requirements</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-500 mt-1">•</span>
                        <span>Clear visibility of lips and mouth</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-500 mt-1">•</span>
                        <span>Good lighting conditions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-500 mt-1">•</span>
                        <span>Face centered in frame</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-500 mt-1">•</span>
                        <span>Minimal occlusions (no masks/hands)</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3 text-purple-400">Technical Specs</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 mt-1">•</span>
                        <span>Formats: MP4, AVI, MOV, MKV, WebM</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 mt-1">•</span>
                        <span>Max file size: 50MB</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 mt-1">•</span>
                        <span>Optimal duration: 1-3 seconds</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 mt-1">•</span>
                        <span>Resolution: 480p or higher</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Demo;
