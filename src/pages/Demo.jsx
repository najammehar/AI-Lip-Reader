import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, CheckCircle2, AlertCircle, Loader2, BarChart3, Info, Cpu, Crosshair } from 'lucide-react';
import FileUpload from '../components/FileUpload';
import Button from '../components/Button';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';

const MODELS = {
  cnn: {
    id: 'cnn',
    label: '3D CNN + BiLSTM',
    description: 'Appearance-based model — works on raw pixel frames (grayscale mouth region)',
    apiUrl: import.meta.env.VITE_CNN_API_URL,
    icon: Cpu,
    color: 'indigo',
  },
  landmarks: {
    id: 'landmarks',
    label: 'Landmarks MLP + Transformer + BiLSTM',
    description: 'Geometry-based model — uses MediaPipe lip/chin landmark coordinates',
    apiUrl: import.meta.env.VITE_LANDMARKS_API_URL,
    icon: Crosshair,
    color: 'purple',
  },
};

const Demo = () => {
  const [selectedModel, setSelectedModel] = useState('cnn');
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setResult(null);
    setError(null);
    setProgress(0);
    setStatusMsg('');
  };

  const handleModelChange = (modelId) => {
    setSelectedModel(modelId);
    setResult(null);
    setError(null);
    setProgress(0);
    setStatusMsg('');
  };

  const handleProcess = async () => {
    if (!file) return;

    setProcessing(true);
    setError(null);
    setResult(null);
    setProgress(0);

    try {
      // Stage 1 — uploading
      setStatusMsg('Uploading video...');
      setProgress(20);

      const formData = new FormData();
      formData.append('video', file);

      // Stage 2 — server processing
      setStatusMsg('Extracting frames...');
      setProgress(50);

      const response = await fetch(`${MODELS[selectedModel].apiUrl}/predict`, {
        method: 'POST',
        body: formData,
      });

      setProgress(85);
      setStatusMsg('Running model inference...');

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || errData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      setProgress(100);
      setStatusMsg('Done!');
      setResult(data);

    } catch (err) {
      if (err.message.includes('fetch') || err.message.includes('NetworkError')) {
        setError(`Cannot reach the API server (${MODELS[selectedModel].apiUrl}). Make sure the backend is running.`);
      } else {
        setError(err.message || 'Prediction failed. Please try again.');
      }
    } finally {
      setProcessing(false);
    }
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
            Upload a short video of someone saying a single word — our CNN model will predict it
          </p>
        </motion.div>

        {/* Model Selector */}
        <div className="max-w-4xl mx-auto mb-6">
          <p className="text-sm text-gray-400 mb-3 font-medium uppercase tracking-wider">Select Model</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {Object.values(MODELS).map((m) => {
              const Icon = m.icon;
              const active = selectedModel === m.id;
              const ring = m.color === 'indigo' ? 'border-indigo-500 bg-indigo-500/10' : 'border-purple-500 bg-purple-500/10';
              const iconColor = m.color === 'indigo' ? 'text-indigo-400' : 'text-purple-400';
              return (
                <button
                  key={m.id}
                  onClick={() => handleModelChange(m.id)}
                  className={`flex items-start gap-3 text-left rounded-lg border px-5 py-4 transition-all cursor-pointer ${
                    active ? ring : 'border-[#1f1f1f] bg-[#0a0a0a] hover:border-[#333]'
                  }`}
                >
                  <Icon size={20} className={`mt-0.5 shrink-0 ${active ? iconColor : 'text-gray-500'}`} />
                  <div>
                    <p className={`font-semibold text-sm ${active ? 'text-white' : 'text-gray-400'}`}>{m.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{m.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Model info banner */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className={`flex items-start gap-3 border rounded-lg px-5 py-4 text-sm text-gray-300 ${
            selectedModel === 'cnn'
              ? 'bg-indigo-500/10 border-indigo-500/20'
              : 'bg-purple-500/10 border-purple-500/20'
          }`}>
            <Info size={18} className={`mt-0.5 shrink-0 ${selectedModel === 'cnn' ? 'text-indigo-400' : 'text-purple-400'}`} />
            <div>
              <span className="font-semibold text-white">Single Word Mode</span>
              {selectedModel === 'cnn' ? (
                <span className="text-gray-400"> — 3D CNN + BiLSTM model trained on LRW (500 words). Upload a 1–3 second clip of a single word. Works on raw pixel frames; face crop is applied automatically.</span>
              ) : (
                <span className="text-gray-400"> — MLP + 2× Transformer + BiLSTM model trained on LRW (500 words). Uses MediaPipe to extract 50 lip/chin landmarks per frame. Requires a clearly visible face.</span>
              )}
            </div>
          </div>
        </div>

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
                  Run Prediction
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
                  <div className="text-sm text-gray-400">{statusMsg}</div>
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
                    <h3 className="text-2xl font-semibold">Prediction Result</h3>
                  </div>

                  {/* Top prediction — big display */}
                  <div className="bg-[#0a0a0a] rounded-lg p-8 mb-8 border border-indigo-500/20 text-center">
                    <div className="text-sm text-gray-400 mb-3 uppercase tracking-wider">Predicted Word</div>
                    <div className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-wide uppercase">
                      {result.top_prediction}
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <BarChart3 size={16} className="text-indigo-400" />
                      <span className="text-gray-400 text-sm">
                        Confidence: <span className="text-white font-semibold">{result.confidence}%</span>
                      </span>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-[#0a0a0a] rounded-lg p-5 border border-[#1f1f1f]">
                      <div className="text-sm text-gray-400 mb-1">Processing Time</div>
                      <div className="text-2xl font-semibold">{result.processing_time}</div>
                    </div>
                    <div className="bg-[#0a0a0a] rounded-lg p-5 border border-[#1f1f1f]">
                      <div className="text-sm text-gray-400 mb-1">
                        {result.detection_rate !== undefined ? 'Face Detection Rate' : 'Frames Analyzed'}
                      </div>
                      <div className="text-2xl font-semibold">
                        {result.detection_rate !== undefined
                          ? `${result.detection_rate}%`
                          : result.frame_count}
                      </div>
                    </div>
                  </div>

                  {/* Top-5 alternatives */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Top 5 Candidates</h4>
                    <div className="space-y-3">
                      {result.top5.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.06 }}
                          className={`rounded-lg p-4 border ${
                            index === 0
                              ? 'border-indigo-500/40 bg-indigo-500/5'
                              : 'border-[#1f1f1f] bg-[#0a0a0a]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className={`font-semibold uppercase tracking-wide ${
                              index === 0 ? 'text-white text-base' : 'text-gray-300 text-sm'
                            }`}>
                              {index === 0 && <span className="text-indigo-400 mr-2">✓</span>}
                              {item.word}
                            </span>
                            <span className="text-sm text-gray-400">{item.confidence}%</span>
                          </div>
                          <ProgressBar progress={item.confidence} />
                        </motion.div>
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
                        setStatusMsg('');
                      }}
                    >
                      Try Another Video
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
                  <div className="flex items-start gap-3 text-red-400">
                    <AlertCircle size={22} className="shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">Error</p>
                      <p className="text-sm text-red-300">{error}</p>
                    </div>
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
                        <span>Say a <strong className="text-white">single word</strong> clearly</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-500 mt-1">•</span>
                        <span>Clear visibility of lips and mouth</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-500 mt-1">•</span>
                        <span>Good lighting, face centered in frame</span>
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
                        <span>Optimal duration: 1–3 seconds</span>
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
