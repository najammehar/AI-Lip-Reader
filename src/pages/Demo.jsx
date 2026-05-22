import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, CheckCircle2, AlertCircle, Loader2, Cpu, Crosshair,
  RefreshCw, Upload, FileVideo, X, Clock, Eye, Layers, Zap, GitMerge, Link2,
} from 'lucide-react';

const MODELS = {
  cnn: {
    id: 'cnn',
    label: '3D CNN + BiLSTM',
    description: 'Trained on raw pixel frames of the mouth region (grayscale, 96×96)',
    apiUrl: import.meta.env.VITE_CNN_API_URL,
    icon: Cpu,
    color: 'indigo',
    accent: '#6366f1',
    accuracy: '~75%',
    vocab: '500 words',
    tag: 'Best Accuracy',
  },
  landmarks: {
    id: 'landmarks',
    label: 'Landmarks + Transformer + BiLSTM',
    description: 'Uses MediaPipe to extract 50 lip/chin landmark coordinates per frame',
    apiUrl: import.meta.env.VITE_LANDMARKS_API_URL,
    icon: Crosshair,
    color: 'purple',
    accent: '#a855f7',
    accuracy: '~51%',
    vocab: '500 words',
    tag: 'Geometry-Based',
  },
  landmarks100: { 
    id: 'landmarks100',
    label: 'Landmarks BiLSTM (100-class)',
    description: 'Smaller landmark model trained on 100 LRW words — faster inference',
    apiUrl: import.meta.env.VITE_LANDMARKS_100_API_URL,
    icon: Zap,
    color: 'teal',
    accent: '#14b8a6',
    accuracy: '~63%',
    vocab: '100 words',
    tag: 'Lightweight',
  },
  fusion: {
    id: 'fusion',
    label: 'Fusion Models',
    description: 'Combines CNN appearance + landmark geometry streams for joint prediction',
    apiUrl: null,
    icon: Layers,
    color: 'orange',
    accent: '#f97316',
    accuracy: 'Up to ~78%',
    vocab: '500 words',
    tag: 'Fusion',
  },
};

const FUSION_SUBMODELS = {
  crossattn: {
    id: 'crossattn',
    label: 'Cross-Attention',
    description: 'Landmark features attend over appearance via multi-head cross-attention',
    apiUrl: import.meta.env.VITE_FUSION_CROSSATTN_API_URL,
    icon: Layers,
    color: 'orange',
    accent: '#f97316',
    tag: 'Best Fusion',
  },
  gated: {
    id: 'gated',
    label: 'Temporal Gated',
    description: 'Per-modality sigmoid gates with temporal attention pooling',
    apiUrl: import.meta.env.VITE_FUSION_GATED_API_URL,
    icon: GitMerge,
    color: 'rose',
    accent: '#f43f5e',
    tag: 'Gated Fusion',
  },
  concat: {
    id: 'concat',
    label: 'Temporal Concat',
    description: 'Simple concatenation with shared temporal projection and mean pooling',
    apiUrl: import.meta.env.VITE_FUSION_CONCAT_API_URL,
    icon: Link2,
    color: 'amber',
    accent: '#f59e0b',
    tag: 'Simple Fusion',
  },
};

const COLOR = {
  indigo: { ring: 'border-indigo-500', bg: 'bg-indigo-500/10', text: 'text-indigo-400', bar: 'bg-indigo-500' },
  purple: { ring: 'border-purple-500', bg: 'bg-purple-500/10', text: 'text-purple-400', bar: 'bg-purple-500' },
  teal:   { ring: 'border-teal-500',   bg: 'bg-teal-500/10',   text: 'text-teal-400',   bar: 'bg-teal-500'   },
  orange: { ring: 'border-orange-500', bg: 'bg-orange-500/10', text: 'text-orange-400', bar: 'bg-orange-500' },
  rose:   { ring: 'border-rose-500',   bg: 'bg-rose-500/10',   text: 'text-rose-400',   bar: 'bg-rose-500'   },
  amber:  { ring: 'border-amber-500',  bg: 'bg-amber-500/10',  text: 'text-amber-400',  bar: 'bg-amber-500'  },
};

const STEPS = [
  { n: 1, label: 'Select Model' },
  { n: 2, label: 'Upload Video' },
  { n: 3, label: 'View Results' },
];

const PROCESS_STAGES = [
  { label: 'Uploading video' },
  { label: 'Extracting features' },
  { label: 'Running inference' },
  { label: 'Complete' },
];

// ── Inline drag-and-drop uploader ─────────────────────────────────────────────
const Uploader = ({ onFileSelect, disabled }) => {
  const [localFile, setLocalFile] = useState(null);
  const [drag, setDrag] = useState(false);
  const [err, setErr] = useState('');
  const inputRef = useRef(null);

  const validate = (f) => {
    if (!f) return false;
    const allowed = ['video/mp4', 'video/avi', 'video/mov', 'video/mkv', 'video/webm', 'video/quicktime'];
    if (!allowed.includes(f.type) && !f.name.match(/\.(mp4|avi|mov|mkv|webm)$/i)) {
      setErr('Upload a valid video: MP4, AVI, MOV, MKV or WebM'); return false;
    }
    if (f.size > 50 * 1024 * 1024) { setErr('File must be under 50 MB'); return false; }
    setErr(''); return true;
  };

  const pick = (f) => { if (validate(f)) { setLocalFile(f); onFileSelect(f); } };
  const clear = () => { setLocalFile(null); setErr(''); onFileSelect(null); if (inputRef.current) inputRef.current.value = ''; };
  const fmt = (b) => b < 1024 * 1024 ? `${(b / 1024).toFixed(0)} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`;

  return (
    <div className="w-full">
      <motion.div
        className={`relative border-2 border-dashed rounded-xl transition-all duration-300 ${
          drag ? 'border-indigo-500 bg-indigo-500/5' : err ? 'border-red-500/60' : 'border-white/10 hover:border-white/25'
        }`}
        onDragEnter={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={(e) => { e.preventDefault(); setDrag(false); }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files[0]); }}
      >
        <input ref={inputRef} type="file" accept="video/*" className="hidden" id="vid-input"
          onChange={(e) => pick(e.target.files[0])} disabled={disabled} />

        <AnimatePresence mode="wait">
          {!localFile ? (
            <motion.label key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              htmlFor="vid-input" className="flex flex-col items-center justify-center py-16 px-6 cursor-pointer select-none">
              <motion.div whileHover={{ scale: 1.05 }}
                className="w-20 h-20 mb-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Upload size={34} className="text-gray-400" />
              </motion.div>
              <p className="text-lg font-semibold text-white mb-1">Drop your video here</p>
              <p className="text-sm text-gray-500">or click to browse — MP4, MOV, AVI, WebM · max 50 MB</p>
            </motion.label>
          ) : (
            <motion.div key="file" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-4 px-6 py-5">
              <div className="w-14 h-14 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center shrink-0">
                <FileVideo size={26} className="text-indigo-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">{localFile.name}</p>
                <p className="text-sm text-gray-500 mt-0.5">{fmt(localFile.size)}</p>
              </div>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={clear}
                className="p-2 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-colors shrink-0">
                <X size={18} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      {err && (
        <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-400 mt-2 flex items-center gap-1.5">
          <AlertCircle size={13} /> {err}
        </motion.p>
      )}
    </div>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────
const Demo = () => {
  const [selectedModel, setSelectedModel] = useState('cnn');
  const [selectedFusion, setSelectedFusion] = useState('crossattn');
  const [file,          setFile]          = useState(null);
  const [videoUrl,      setVideoUrl]      = useState(null);
  const [processing,    setProcessing]    = useState(false);
  const [stage,         setStage]         = useState(0);
  const [result,        setResult]        = useState(null);
  const [error,         setError]         = useState(null);
  const [uploadKey,     setUploadKey]     = useState(0);
  const [selectedWord, setSelectedWord] = useState(null);

  const model = MODELS[selectedModel];
  const activeFusion = FUSION_SUBMODELS[selectedFusion];
  const activeColor  = (selectedModel === 'fusion') ? activeFusion.color : model.color;
  const activeAccent = (selectedModel === 'fusion') ? activeFusion.accent : model.accent;
  const c = COLOR[activeColor];
  const currentStep = result ? 3 : file ? 2 : 1;

  const handleFileSelect = useCallback((f) => {
    setFile(f);
    setResult(null);
    setError(null);
    setStage(0);
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoUrl(f ? URL.createObjectURL(f) : null);
  }, [videoUrl]);

  const handleModelChange = (id) => {
    setSelectedModel(id);
    setResult(null);
    setError(null);
    if (id !== 'fusion') setSelectedFusion('crossattn');
  };

  const handleFusionChange = (id) => {
    setSelectedFusion(id);
    setResult(null);
    setError(null);
  };

  const reset = () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setFile(null);
    setResult(null);
    setError(null);
    setStage(0);
    setVideoUrl(null);
    setUploadKey((k) => k + 1);
    setSelectedWord(null);
  };

  const handleProcess = async () => {
    if (!file) return;
    setProcessing(true);
    setError(null);
    setResult(null);
    setStage(0);
    setSelectedWord(null);

    try {
      setStage(1);
      const formData = new FormData();
      formData.append('video', file);

      const activeUrl = selectedModel === 'fusion'
        ? activeFusion.apiUrl
        : model.apiUrl;

      setStage(2);
      const response = await fetch(`${activeUrl}/predict`, { method: 'POST', body: formData });

      setStage(3);
      if (!response.ok) {
        const d = await response.json().catch(() => ({}));
        throw new Error(d.detail || d.error || `Server error ${response.status}`);
      }
      const data = await response.json();
      setStage(4);
      setResult(data);
      setSelectedWord(data.top_prediction);
    } catch (err) {
      const msg = err.message || '';
      const activeUrl = selectedModel === 'fusion' ? activeFusion.apiUrl : model.apiUrl;
      setError(
        msg.includes('fetch') || msg.includes('NetworkError') || msg.includes('Failed to fetch')
          ? `Cannot reach the API server (${activeUrl}). Make sure the backend is running.`
          : msg || 'Prediction failed. Please try again.'
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="container mx-auto max-w-5xl px-6">

        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs font-medium text-gray-400 mb-6 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Demo — AI Lip Reading
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Decode <span className="text-gradient">Speech</span> from Lips
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Upload a short clip of someone saying a single word. Choose a model and see real-time predictions with confidence scores.
          </p>
        </motion.div>

        {/* ── Step Tracker ── */}
        <div className="flex items-center justify-center gap-0 mb-12">
          {STEPS.map((s, i) => (
            <div key={s.n} className="flex items-center">
              <div className={`flex items-center gap-2.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                currentStep === s.n
                  ? `${c.bg} ${c.text} border ${c.ring} border-opacity-60`
                  : currentStep > s.n ? 'text-emerald-400' : 'text-gray-600'
              }`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  currentStep > s.n ? 'bg-emerald-500 text-white'
                    : currentStep === s.n ? `${c.bg} ${c.text} border ${c.ring}`
                    : 'bg-white/5 text-gray-600'
                }`}>
                  {currentStep > s.n ? <CheckCircle2 size={14} /> : s.n}
                </span>
                {s.label}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-8 h-px mx-1 transition-all duration-500 ${currentStep > s.n ? 'bg-emerald-500/50' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>

        {/* ── Model Selector ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
          <p className="text-xs text-gray-600 uppercase tracking-widest font-medium mb-3">Choose Model</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {Object.values(MODELS).map((m) => {
              const Icon = m.icon;
              const col  = COLOR[m.color];
              const active = selectedModel === m.id;
              return (
                <motion.button key={m.id} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  onClick={() => handleModelChange(m.id)} disabled={processing}
                  className={`relative text-left rounded-xl border p-4 transition-all duration-200 cursor-pointer overflow-hidden ${
                    active ? `${col.ring} ${col.bg}` : 'border-white/8 bg-white/2 hover:border-white/15'
                  }`}
                >
                  {active && (
                    <motion.div layoutId="model-glow" className="absolute inset-0 pointer-events-none"
                      style={{ background: `radial-gradient(ellipse at top left, ${m.accent}18 0%, transparent 70%)` }} />
                  )}
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${active ? col.bg : 'bg-white/5'}`}>
                      <Icon size={18} className={active ? col.text : 'text-gray-500'} />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      active ? `${col.bg} ${col.text}` : 'bg-white/5 text-gray-600'
                    }`}>{m.tag}</span>
                  </div>
                  <p className={`font-semibold text-sm leading-snug mb-1 ${active ? 'text-white' : 'text-gray-400'}`}>{m.label}</p>
                  <p className="text-xs text-gray-600 mb-3 leading-relaxed">{m.description}</p>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold ${active ? col.text : 'text-gray-600'}`}>{m.accuracy}</span>
                    <span className="text-gray-700 text-xs">·</span>
                    <span className="text-xs text-gray-600">{m.vocab}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* ── Fusion Sub-Selector (shown only when fusion category is active) ── */}
          <AnimatePresence>
            {selectedModel === 'fusion' && (
              <motion.div
                key="fusion-sub"
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <p className="text-xs text-gray-600 uppercase tracking-widest font-medium mb-3">Choose Fusion Strategy</p>
                <div className="grid sm:grid-cols-3 gap-3">
                  {Object.values(FUSION_SUBMODELS).map((fm) => {
                    const FIcon = fm.icon;
                    const fcol  = COLOR[fm.color];
                    const factive = selectedFusion === fm.id;
                    return (
                      <motion.button key={fm.id} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                        onClick={() => handleFusionChange(fm.id)} disabled={processing}
                        className={`relative text-left rounded-xl border p-4 transition-all duration-200 cursor-pointer overflow-hidden ${
                          factive ? `${fcol.ring} ${fcol.bg}` : 'border-white/8 bg-white/2 hover:border-white/15'
                        }`}
                      >
                        {factive && (
                          <motion.div layoutId="fusion-sub-glow" className="absolute inset-0 pointer-events-none"
                            style={{ background: `radial-gradient(ellipse at top left, ${fm.accent}18 0%, transparent 70%)` }} />
                        )}
                        <div className="flex items-start justify-between mb-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${factive ? fcol.bg : 'bg-white/5'}`}>
                            <FIcon size={16} className={factive ? fcol.text : 'text-gray-500'} />
                          </div>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            factive ? `${fcol.bg} ${fcol.text}` : 'bg-white/5 text-gray-600'
                          }`}>{fm.tag}</span>
                        </div>
                        <p className={`font-semibold text-sm leading-snug mb-1 ${factive ? 'text-white' : 'text-gray-400'}`}>{fm.label}</p>
                        <p className="text-xs text-gray-600 mb-2 leading-relaxed">{fm.description}</p>
                        <span className={`text-xs font-bold ${factive ? fcol.text : 'text-gray-600'}`}>{fm.accuracy}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Main content area ── */}
        <AnimatePresence mode="wait">

          {/* PROCESSING */}
          {processing && (
            <motion.div key="processing" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              className="rounded-2xl border border-white/10 bg-white/3 p-10">
              <div className="flex flex-col items-center text-center mb-10">
                <div className={`w-16 h-16 rounded-2xl ${c.bg} border ${c.ring} flex items-center justify-center mb-5`}>
                  <Loader2 size={28} className={`${c.text} animate-spin`} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-1">Analysing your video</h3>
                <p className="text-sm text-gray-500">{selectedModel === 'fusion' ? activeFusion.label : model.label}</p>
              </div>
              <div className="max-w-md mx-auto space-y-4">
                {PROCESS_STAGES.map((s, i) => {
                  const done   = stage > i + 1;
                  const active = stage === i + 1;
                  return (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className={`flex items-center gap-4 rounded-xl px-4 py-3 border transition-all ${
                        done   ? 'border-emerald-500/30 bg-emerald-500/5' :
                        active ? `${c.ring} ${c.bg} border-opacity-50`   :
                                 'border-white/5 bg-transparent'
                      }`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                        done ? 'bg-emerald-500' : active ? `${c.bg} border ${c.ring}` : 'bg-white/5'
                      }`}>
                        {done   ? <CheckCircle2 size={14} className="text-white" />              :
                         active ? <Loader2 size={12} className={`${c.text} animate-spin`} />    :
                                  <span className="text-[10px] text-gray-600">{i + 1}</span>}
                      </div>
                      <span className={`text-sm font-medium ${done ? 'text-emerald-400' : active ? 'text-white' : 'text-gray-600'}`}>
                        {s.label}
                      </span>
                      {done && <CheckCircle2 size={14} className="text-emerald-500 ml-auto" />}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* RESULT */}
          {result && !processing && (
            <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              className="space-y-4">

              {/* Big prediction — full width */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className={`rounded-2xl border ${c.ring} border-opacity-40 ${c.bg} p-8 flex flex-col justify-center`}
                style={{ boxShadow: `0 0 60px ${activeAccent}18` }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-2 h-2 rounded-full ${c.bar} animate-pulse`} />
                  <span className="text-xs uppercase tracking-widest text-gray-500 font-medium">Top Prediction</span>
                </div>
                <div className={`text-6xl md:text-7xl font-black tracking-tight uppercase mb-4 ${c.text}`}
                  style={{ textShadow: `0 0 40px ${activeAccent}60` }}>
                  {result.top_prediction}
                </div>
                <div className="text-sm text-gray-400">
                  Confidence: <span className="text-white font-bold text-lg">{result.confidence}%</span>
                </div>
                <div className="mt-5 h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${result.confidence}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`h-full rounded-full ${c.bar}`}
                    style={{ boxShadow: `0 0 10px ${activeAccent}` }} />
                </div>
              </motion.div>

              {/* Top-5 */}
              <div className="rounded-2xl border border-white/8 bg-white/3 p-6">
                <p className="text-xs uppercase tracking-widest text-gray-600 font-medium mb-5">Top 5 Candidates</p>
                <div className="space-y-3">
                  {result.top5.map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.07 }}
                      onClick={() => setSelectedWord(item.word)}
                      className={`flex items-center gap-4 rounded-xl px-4 py-3 border transition-all cursor-pointer ${
                        selectedWord === item.word
                          ? `${c.ring} ${c.bg} border-opacity-50`
                          : 'border-white/6 bg-white/2 hover:border-white/20'
                      }`}>
                      <span className={`text-xs font-bold w-5 text-center ${i === 0 ? c.text : 'text-gray-700'}`}>
                        {i === 0 ? '✓' : `#${i + 1}`}
                      </span>
                      <span className={`font-semibold uppercase tracking-wide text-sm w-28 shrink-0 ${i === 0 ? 'text-white' : 'text-gray-400'}`}>
                        {item.word}
                      </span>
                      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${item.confidence}%` }}
                          transition={{ duration: 0.6, delay: 0.35 + i * 0.07, ease: 'easeOut' }}
                          className={`h-full rounded-full ${i === 0 ? c.bar : 'bg-white/20'}`} />
                      </div>
                      <span className={`text-sm font-medium w-12 text-right ${i === 0 ? c.text : 'text-gray-600'}`}>
                        {item.confidence}%
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Try another */}
              <div className="flex justify-end">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={reset}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8 text-sm font-medium text-gray-300 hover:text-white transition-all cursor-pointer">
                  <RefreshCw size={15} />
                  Try Another
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* UPLOAD (default state) */}
          {!processing && !result && (
            <motion.div key="upload" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              className="space-y-4">

              <div className="rounded-2xl border border-white/10 bg-white/3 p-6">
                <p className="text-xs uppercase tracking-widest text-gray-600 font-medium mb-4">Upload Video</p>
                <Uploader key={uploadKey} onFileSelect={handleFileSelect} disabled={processing} />

                {file && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5 flex justify-end">
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={handleProcess}
                      className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-sm text-white cursor-pointer transition-all ${c.bar} hover:opacity-90`}
                      style={{ boxShadow: `0 4px 20px ${activeAccent}40` }}>
                      <Play size={16} fill="white" />
                      Analyse Video
                    </motion.button>
                  </motion.div>
                )}
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="rounded-2xl border border-red-500/30 bg-red-500/8 px-5 py-4 flex items-start gap-3">
                    <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-red-300 mb-0.5">Something went wrong</p>
                      <p className="text-xs text-red-400/80">{error}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="rounded-2xl border border-white/8 bg-white/2 p-6">
                <p className="text-xs uppercase tracking-widest text-gray-600 font-medium mb-5">Tips for Best Results</p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${c.text}`}>Recording</p>
                    {[
                      'Say a single word clearly and at normal pace',
                      'Face the camera straight-on, well lit',
                      'Lips and mouth fully visible — no mask/hand',
                      'Keep duration between 1 and 3 seconds',
                    ].map((t) => (
                      <div key={t} className="flex items-start gap-2 text-sm text-gray-500">
                        <span className={`mt-1.5 w-1 h-1 rounded-full ${c.bar} shrink-0`} />
                        {t}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2.5">
                    <p className="text-xs font-semibold uppercase tracking-wider mb-3 text-purple-400">Technical</p>
                    {[
                      'Format: MP4, MOV, AVI, MKV, WebM',
                      'Max file size: 50 MB',
                      'Recommended resolution: 480p or higher',
                      'Landmarks models need a clearly visible face',
                    ].map((t) => (
                      <div key={t} className="flex items-start gap-2 text-sm text-gray-500">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-purple-500 shrink-0" />
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default Demo;
