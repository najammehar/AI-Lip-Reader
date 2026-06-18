// ─── DEMO PAGE — redesigned to match Home theme ───────────────────────────────
import { useState, useEffect, useRef, useCallback } from 'react';
/* eslint-disable-next-line no-unused-vars */
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, CheckCircle2, AlertCircle, Loader2, Cpu, Crosshair,
  RefreshCw, Upload, FileVideo, X, Layers, Zap, GitMerge, Link2, Download,
} from 'lucide-react';

const MODELS = {
  cnn: {
    id: 'cnn', label: '3D CNN + BiLSTM',
    description: 'Trained on raw pixel frames of the mouth region (grayscale, 96×96)',
    apiUrl: import.meta.env.VITE_CNN_API_URL,
    icon: Cpu, accent: '#f97316', accuracy: '~75%', vocab: '500 words', tag: 'Appearance',
  },
  landmarks: {
    id: 'landmarks', label: 'Landmarks + Transformer',
    description: 'Uses MediaPipe to extract 50 lip/chin landmark coordinates per frame',
    apiUrl: import.meta.env.VITE_LANDMARKS_API_URL,
    icon: Crosshair, accent: '#ea580c', accuracy: '~51%', vocab: '500 words', tag: 'Geometry',
  },
  landmarks100: {
    id: 'landmarks100', label: 'Landmarks BiLSTM 100',
    description: 'Smaller landmark model trained on 100 LRW words — faster inference',
    apiUrl: import.meta.env.VITE_LANDMARKS_100_API_URL,
    icon: Zap, accent: '#fb923c', accuracy: '~63%', vocab: '100 words', tag: 'Lightweight',
  },
  fusion: {
    id: 'fusion', label: 'Fusion Models',
    description: 'Combines CNN appearance + landmark geometry streams for joint prediction',
    apiUrl: null,
    icon: Layers, accent: '#f97316', accuracy: 'Up to ~78%', vocab: '500 words', tag: 'Best',
  },
};

const FUSION_SUBMODELS = {
  crossattn: {
    id: 'crossattn', label: 'Cross-Attention',
    description: 'Landmark features attend over appearance via multi-head cross-attention',
    apiUrl: import.meta.env.VITE_FUSION_CROSSATTN_API_URL,
    icon: Layers, accent: '#f97316', tag: 'Best Fusion',
  },
  gated: {
    id: 'gated', label: 'Temporal Gated',
    description: 'Per-modality sigmoid gates with temporal attention pooling',
    apiUrl: import.meta.env.VITE_FUSION_GATED_API_URL,
    icon: GitMerge, accent: '#ea580c', tag: 'Gated',
  },
  concat: {
    id: 'concat', label: 'Temporal Concat',
    description: 'Simple concatenation with shared temporal projection and mean pooling',
    apiUrl: import.meta.env.VITE_FUSION_CONCAT_API_URL,
    icon: Link2, accent: '#fb923c', tag: 'Simple',
  },
};

const PROCESS_STAGES = [
  { label: 'Uploading video' },
  { label: 'Extracting features' },
  { label: 'Running inference' },
  { label: 'Complete' },
];

// ── Uploader ───────────────────────────────────────────────────────────────────
const Uploader = ({ onFileSelect, disabled, accent = '#f97316', isMobile = false }) => {
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
    <div style={{ width: '100%' }}>
      <motion.div
        style={{
          border: `2px dashed ${drag ? accent : err ? '#ef4444' : '#cccccc'}`,
          borderRadius: '14px',
          backgroundColor: drag ? `${accent}08` : '#fafafa',
          transition: 'all 0.2s',
        }}
        onDragEnter={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={(e) => { e.preventDefault(); setDrag(false); }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files[0]); }}
      >
        <input ref={inputRef} type="file" accept="video/*" style={{ display: 'none' }} id="vid-input"
          onChange={(e) => pick(e.target.files[0])} disabled={disabled} />

        <AnimatePresence mode="wait">
          {!localFile ? (
            <motion.label key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              htmlFor="vid-input"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '1.75rem 1rem' : '3.5rem 1.5rem', cursor: disabled ? 'not-allowed' : 'pointer', userSelect: 'none' }}>
              <motion.div whileHover={{ scale: 1.06 }} style={{
                width: '72px', height: '72px', marginBottom: '1.25rem', borderRadius: '16px',
                backgroundColor: `${accent}10`, border: `1.5px solid ${accent}25`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Upload size={30} style={{ color: accent }} />
              </motion.div>
              <p style={{ fontSize: '1rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '0.375rem', letterSpacing: '-0.01em' }}>
                Drop your video here
              </p>
              <p style={{ fontSize: '0.8125rem', color: '#888888' }}>
                or click to browse — MP4, MOV, AVI, WebM · max 50 MB
              </p>
            </motion.label>
          ) : (
            <motion.div key="file" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem 1.5rem' }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '12px', flexShrink: 0,
                backgroundColor: `${accent}10`, border: `1px solid ${accent}25`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <FileVideo size={24} style={{ color: accent }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: '600', color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '2px' }}>{localFile.name}</p>
                <p style={{ fontSize: '0.8125rem', color: '#888888' }}>{fmt(localFile.size)}</p>
              </div>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={clear}
                style={{ padding: '0.4rem', borderRadius: '8px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: '#888888', flexShrink: 0, display: 'flex' }}>
                <X size={18} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      {err && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <AlertCircle size={13} /> {err}
        </motion.p>
      )}
    </div>
  );
};

// ── Main Demo page ─────────────────────────────────────────────────────────────
const Demo = () => {
  const [selectedModel,  setSelectedModel]  = useState('cnn');
  const [selectedFusion, setSelectedFusion] = useState('crossattn');
  const [file,           setFile]           = useState(null);
  const [videoUrl,       setVideoUrl]       = useState(null);
  const [processing,     setProcessing]     = useState(false);
  const [stage,          setStage]          = useState(0);
  const [result,         setResult]         = useState(null);
  const [error,          setError]          = useState(null);
  const [uploadKey,      setUploadKey]      = useState(0);
  const [selectedWord,   setSelectedWord]   = useState(null);
  const [subtitleDownloading, setSubtitleDownloading] = useState(false);
  const [subtitleError,  setSubtitleError]  = useState('');
  const [isMobile,       setIsMobile]       = useState(false);
  const abortControllerRef = useRef(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const model        = MODELS[selectedModel];
  const activeFusion = FUSION_SUBMODELS[selectedFusion];
  const activeAccent = selectedModel === 'fusion' ? activeFusion.accent : model.accent;
  const currentStep  = result ? 3 : file ? 2 : 1;

  const handleFileSelect = useCallback((f) => {
    setFile(f); setResult(null); setError(null); setStage(0);
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoUrl(f ? URL.createObjectURL(f) : null);
  }, [videoUrl]);

  const handleModelChange = (id) => {
    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setSelectedModel(id); setResult(null); setError(null); setFile(null); setVideoUrl(null); setStage(0); setSelectedWord(null); setUploadKey((k) => k + 1);
    if (id !== 'fusion') setSelectedFusion('crossattn');
  };

  const handleFusionChange = (id) => {
    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setSelectedFusion(id); setResult(null); setError(null); setFile(null); setVideoUrl(null); setStage(0); setSelectedWord(null); setUploadKey((k) => k + 1);
  };

  const reset = () => {
    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setFile(null); setResult(null); setError(null); setStage(0);
    setVideoUrl(null); setUploadKey((k) => k + 1); setSelectedWord(null);
    setSubtitleDownloading(false); setSubtitleError('');
  };

  const handleDownload = async () => {
    if (!file || !selectedWord) return;
    setSubtitleDownloading(true); setSubtitleError('');
    try {
      const activeUrl = selectedModel === 'fusion' ? activeFusion.apiUrl : model.apiUrl;
      const base = new URL(activeUrl).origin;
      const fd = new FormData();
      fd.append('video', file);
      fd.append('word', selectedWord);
      const res = await fetch(`${base}/burn-subtitle`, { method: 'POST', body: fd });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.detail || `Server error ${res.status}`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedWord.toLowerCase()}_subtitled.mp4`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setSubtitleError(err.message || 'Download failed');
    } finally {
      setSubtitleDownloading(false);
    }
  };

  const handleProcess = async () => {
    if (!file) return;

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Generate unique request ID to track if this request is still current
    const currentRequestId = ++requestIdRef.current;
    
    setProcessing(true);
    setError(null);
    setResult(null);
    setStage(0);
    setSelectedWord(null);

    // Create abort controller for this request
    abortControllerRef.current = new AbortController();
    const timeoutId = setTimeout(() => {
      abortControllerRef.current.abort();
    }, 120000); // 2 minute timeout

    try {
      setStage(1);
      const formData = new FormData();
      formData.append('video', file);
      const activeUrl = selectedModel === 'fusion' ? activeFusion.apiUrl : model.apiUrl;
      setStage(2);

      const response = await fetch(`${activeUrl}/predict`, {
        method: 'POST',
        body: formData,
        signal: abortControllerRef.current.signal,
      });

      // Check if this request is still current (user hasn't switched models/videos)
      if (currentRequestId !== requestIdRef.current) {
        return;
      }

      setStage(3);

      if (!response.ok) {
        let errorDetail = '';
        try {
          const d = await response.json();
          errorDetail = d.detail || d.error || '';
        } catch {
          errorDetail = '';
        }

        if (response.status === 429) {
          throw new Error(errorDetail || 'Rate limit exceeded. Maximum 3 videos per 60 seconds.');
        }

        throw new Error(errorDetail || `Server error ${response.status}`);
      }

      const data = await response.json();

      // Check again if this request is still current
      if (currentRequestId !== requestIdRef.current) {
        return;
      }

      setStage(4);
      setResult(data);
      setSelectedWord(data.top_prediction);
    } catch (err) {
      // Only update error if this request is still current
      if (currentRequestId !== requestIdRef.current) {
        return;
      }

      if (err.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else {
        const msg = err.message || '';
        const isNetwork = msg.includes('fetch') || msg.includes('NetworkError') || msg.includes('Failed to fetch');
        setError(
          isNetwork
            ? '__network__'
            : msg || 'Prediction failed. Please try again.'
        );
      }
    } finally {
      clearTimeout(timeoutId);
      // Only reset processing if this request is still current
      if (currentRequestId === requestIdRef.current) {
        setProcessing(false);
      }
    }
  };

  return (
    <div style={{ backgroundColor: '#e8e8e8', minHeight: '100vh', color: '#1a1a1a' }}>

      {/* Background grid */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'linear-gradient(#cccccc 1px, transparent 1px), linear-gradient(90deg, #cccccc 1px, transparent 1px)',
        backgroundSize: '60px 60px', opacity: 0.25,
      }} />

      {/* ── Main interface ── */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1280px', margin: '0 auto', padding: '7rem 1.5rem 5rem' }}>

        {/* Step tracker */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '3rem' }}>
          {[{ n: 1, label: 'Select Model' }, { n: 2, label: 'Upload Video' }, { n: 3, label: 'View Results' }].map((s, i) => (
            <div key={s.n} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: isMobile ? '0.375rem' : '0.625rem',
                padding: isMobile ? '0.375rem 0.625rem' : '0.5rem 1rem', borderRadius: '99px',
                backgroundColor: currentStep === s.n ? '#1a1a1a' : currentStep > s.n ? 'rgba(249,115,22,0.08)' : 'transparent',
                border: currentStep === s.n ? '1px solid #1a1a1a' : currentStep > s.n ? '1px solid rgba(249,115,22,0.3)' : '1px solid #cccccc',
                transition: 'all 0.3s',
              }}>
                <div style={{
                  width: isMobile ? '17px' : '22px', height: isMobile ? '17px' : '22px', borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: currentStep === s.n ? '#f97316' : currentStep > s.n ? 'rgba(249,115,22,0.15)' : '#e0e0e0',
                  fontSize: '0.6rem', fontWeight: '700',
                  color: currentStep === s.n ? '#fff' : currentStep > s.n ? '#f97316' : '#888',
                }}>
                  {currentStep > s.n ? <CheckCircle2 size={isMobile ? 10 : 13} /> : s.n}
                </div>
                <span style={{
                  fontSize: isMobile ? '0.7rem' : '0.8125rem', fontWeight: '600',
                  color: currentStep === s.n ? '#ffffff' : currentStep > s.n ? '#f97316' : '#888888',
                  whiteSpace: 'nowrap',
                }}>{s.label}</span>
              </div>
              {i < 2 && <div style={{ width: isMobile ? '1rem' : '2.5rem', height: '1px', backgroundColor: currentStep > s.n ? '#f97316' : '#cccccc', margin: '0 0.125rem', opacity: 0.5, transition: 'background-color 0.4s' }} />}
            </div>
          ))}
        </motion.div>

        {/* ── Model Selector ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} style={{ marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.6875rem', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'monospace', marginBottom: '0.875rem' }}>
            — 01 · select model
          </p>
          {/* ── Desktop model grid ── */}
          {!isMobile && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              {Object.values(MODELS).map((m) => {
                const Icon   = m.icon;
                const active = selectedModel === m.id;
                return (
                  <motion.button key={m.id} whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}
                    onClick={() => handleModelChange(m.id)} disabled={processing}
                    style={{
                      textAlign: 'left', borderRadius: '16px', padding: '1.375rem',
                      border: active ? '1.5px solid #1a1a1a' : '1px solid #cccccc',
                      backgroundColor: active ? '#1a1a1a' : '#f0f0f0',
                      cursor: processing ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s', position: 'relative', overflow: 'hidden',
                      boxShadow: active ? '0 8px 32px rgba(0,0,0,0.18)' : '0 1px 4px rgba(0,0,0,0.04)',
                    }}
                  >
                    {active && <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse at top left, ${m.accent}22 0%, transparent 65%)` }} />}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <div style={{
                        width: '42px', height: '42px', borderRadius: '11px',
                        backgroundColor: `${m.accent}${active ? '22' : '14'}`,
                        border: `1px solid ${m.accent}${active ? '40' : '22'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Icon size={19} style={{ color: m.accent }} />
                      </div>
                      <span style={{
                        fontSize: '0.625rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em',
                        padding: '3px 9px', borderRadius: '99px',
                        backgroundColor: active ? `${m.accent}22` : 'rgba(0,0,0,0.06)',
                        color: active ? m.accent : '#999999',
                        border: `1px solid ${active ? m.accent + '30' : 'transparent'}`,
                      }}>{m.tag}</span>
                    </div>
                    <p style={{ fontSize: '0.875rem', fontWeight: '700', letterSpacing: '-0.01em', lineHeight: 1.3, color: active ? '#ffffff' : '#1a1a1a', marginBottom: '0.375rem' }}>{m.label}</p>
                    <p style={{ fontSize: '0.75rem', color: active ? '#888' : '#777', lineHeight: '1.55', marginBottom: '0.875rem' }}>{m.description}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: m.accent }}>{m.accuracy}</span>
                      <span style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: active ? '#555' : '#ccc' }} />
                      <span style={{ fontSize: '0.75rem', color: active ? '#777' : '#999' }}>{m.vocab}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* ── Mobile model picker ── */}
          {isMobile && (
            <div>
              {/* Horizontal scrollable pills */}
              <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'none' }}>
                {Object.values(MODELS).map((m) => {
                  const active = selectedModel === m.id;
                  return (
                    <motion.button key={m.id} whileTap={{ scale: 0.95 }}
                      onClick={() => handleModelChange(m.id)} disabled={processing}
                      style={{
                        flexShrink: 0, whiteSpace: 'nowrap',
                        display: 'flex', alignItems: 'center', gap: '0.375rem',
                        padding: '0.5rem 1rem', borderRadius: '99px',
                        border: active ? `1.5px solid ${m.accent}` : '1px solid #cccccc',
                        backgroundColor: active ? m.accent : '#f0f0f0',
                        color: active ? '#fff' : '#555555',
                        fontWeight: '600', fontSize: '0.875rem',
                        cursor: processing ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      <span style={{
                        fontSize: '0.55rem', fontWeight: '800', textTransform: 'uppercase',
                        letterSpacing: '0.06em', opacity: 0.75,
                      }}>{m.tag}</span>
                      {m.label}
                    </motion.button>
                  );
                })}
              </div>
              {/* Selected model info strip */}
              <div style={{
                marginTop: '0.75rem',
                backgroundColor: '#1a1a1a', borderRadius: '14px',
                padding: '1rem 1.125rem',
                display: 'flex', alignItems: 'flex-start', gap: '0.875rem',
                border: `1px solid ${model.accent}30`,
              }}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0,
                  backgroundColor: `${model.accent}22`, border: `1px solid ${model.accent}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <model.icon size={17} style={{ color: model.accent }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.25rem' }}>{model.label}</p>
                  <p style={{ fontSize: '0.75rem', color: '#888888', lineHeight: 1.5 }}>{model.description}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: model.accent }}>{model.accuracy}</span>
                    <span style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: '#555' }} />
                    <span style={{ fontSize: '0.7rem', color: '#666' }}>{model.vocab}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Fusion sub-selector */}
          <AnimatePresence>
            {selectedModel === 'fusion' && (
              <motion.div key="fusion-sub"
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <p style={{ fontSize: '0.6875rem', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'monospace', marginBottom: '0.875rem' }}>
                  — fusion strategy
                </p>
                {/* Desktop fusion grid */}
                {!isMobile && <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  {Object.values(FUSION_SUBMODELS).map((fm) => {
                    const FIcon   = fm.icon;
                    const factive = selectedFusion === fm.id;
                    return (
                      <motion.button key={fm.id} whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}
                        onClick={() => handleFusionChange(fm.id)} disabled={processing}
                        style={{
                          textAlign: 'left', borderRadius: '16px', padding: '1.25rem',
                          border: factive ? '1.5px solid #1a1a1a' : '1px solid #cccccc',
                          backgroundColor: factive ? '#1a1a1a' : '#f0f0f0',
                          cursor: processing ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s', position: 'relative', overflow: 'hidden',
                          boxShadow: factive ? '0 8px 32px rgba(0,0,0,0.18)' : '0 1px 4px rgba(0,0,0,0.04)',
                        }}
                      >
                        {factive && <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse at top left, ${fm.accent}22 0%, transparent 65%)` }} />}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                          <div style={{
                            width: '38px', height: '38px', borderRadius: '10px',
                            backgroundColor: `${fm.accent}${factive ? '22' : '14'}`,
                            border: `1px solid ${fm.accent}${factive ? '40' : '22'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <FIcon size={17} style={{ color: fm.accent }} />
                          </div>
                          <span style={{
                            fontSize: '0.625rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em',
                            padding: '2px 8px', borderRadius: '99px',
                            backgroundColor: factive ? `${fm.accent}22` : 'rgba(0,0,0,0.06)',
                            color: factive ? fm.accent : '#999',
                          }}>{fm.tag}</span>
                        </div>
                        <p style={{ fontSize: '0.875rem', fontWeight: '700', letterSpacing: '-0.01em', color: factive ? '#ffffff' : '#1a1a1a', marginBottom: '0.3rem' }}>{fm.label}</p>
                        <p style={{ fontSize: '0.75rem', color: factive ? '#888' : '#777', lineHeight: '1.5' }}>{fm.description}</p>
                      </motion.button>
                    );
                  })}
                </div>}

                {/* Mobile fusion pills */}
                {isMobile && (
                  <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', scrollbarWidth: 'none' }}>
                    {Object.values(FUSION_SUBMODELS).map((fm) => {
                      const factive = selectedFusion === fm.id;
                      return (
                        <motion.button key={fm.id} whileTap={{ scale: 0.95 }}
                          onClick={() => handleFusionChange(fm.id)} disabled={processing}
                          style={{
                            flexShrink: 0, whiteSpace: 'nowrap',
                            display: 'flex', alignItems: 'center', gap: '0.375rem',
                            padding: '0.5rem 1rem', borderRadius: '99px',
                            border: factive ? `1.5px solid ${fm.accent}` : '1px solid #cccccc',
                            backgroundColor: factive ? fm.accent : '#f0f0f0',
                            color: factive ? '#fff' : '#555555',
                            fontWeight: '600', fontSize: '0.875rem',
                            cursor: processing ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                          }}
                        >
                          <span style={{ fontSize: '0.55rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.75 }}>{fm.tag}</span>
                          {fm.label}
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Main content area ── */}
        <AnimatePresence mode="wait">

          {/* PROCESSING */}
          {processing && (
            <motion.div key="processing" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              style={{ backgroundColor: '#f0f0f0', border: '1px solid #cccccc', borderRadius: '20px', padding: '3rem 2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '2.5rem' }}>
                <div style={{
                  width: '68px', height: '68px', borderRadius: '18px', marginBottom: '1.25rem',
                  backgroundColor: `${activeAccent}12`, border: `1.5px solid ${activeAccent}28`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Loader2 size={30} style={{ color: activeAccent, animation: 'spin 1s linear infinite' }} />
                </div>
                <h3 style={{ fontSize: '1.375rem', fontWeight: '800', color: '#1a1a1a', letterSpacing: '-0.02em', marginBottom: '0.3rem' }}>
                  Analysing your video
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#888888', fontFamily: 'monospace' }}>
                  {selectedModel === 'fusion' ? activeFusion.label : model.label}
                </p>
              </div>
              <div style={{ maxWidth: '460px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {PROCESS_STAGES.map((s, i) => {
                  const done   = stage > i + 1;
                  const active = stage === i + 1;
                  return (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '1rem',
                        borderRadius: '12px', padding: '0.875rem 1.125rem', transition: 'all 0.3s',
                        border: done ? '1px solid rgba(34,197,94,0.3)' : active ? `1px solid ${activeAccent}30` : '1px solid #e4e4e4',
                        backgroundColor: done ? 'rgba(34,197,94,0.06)' : active ? `${activeAccent}08` : 'transparent',
                      }}>
                      <div style={{
                        width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backgroundColor: done ? '#22c55e' : active ? `${activeAccent}15` : '#e4e4e4',
                        border: active ? `1px solid ${activeAccent}40` : 'none',
                      }}>
                        {done   ? <CheckCircle2 size={14} style={{ color: '#fff' }} />
                               : active ? <Loader2 size={12} style={{ color: activeAccent, animation: 'spin 1s linear infinite' }} />
                               : <span style={{ fontSize: '0.625rem', color: '#aaa', fontWeight: '600' }}>{i + 1}</span>}
                      </div>
                      <span style={{ fontSize: '0.875rem', fontWeight: '600', color: done ? '#22c55e' : active ? '#1a1a1a' : '#aaaaaa' }}>
                        {s.label}
                      </span>
                      {done && <CheckCircle2 size={13} style={{ color: '#22c55e', marginLeft: 'auto' }} />}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* RESULT */}
          {result && !processing && (
            <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              {/* Big prediction — dark hero card */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                style={{
                  backgroundColor: '#1a1a1a', borderRadius: '20px',
                  border: `1px solid ${activeAccent}30`,
                  padding: isMobile ? '1.25rem' : 'clamp(2rem,4vw,3rem)',
                  boxShadow: `0 24px 64px rgba(0,0,0,0.18), 0 0 0 1px ${activeAccent}10`,
                  position: 'relative', overflow: 'hidden',
                }}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: '320px', height: '320px', pointerEvents: 'none', background: `radial-gradient(circle at top right, ${activeAccent}20 0%, transparent 60%)` }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: activeAccent }} />
                  <span style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#555555', fontFamily: 'monospace' }}>
                    top prediction
                  </span>
                </div>
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                  style={{
                    fontSize: isMobile ? 'clamp(2rem, 10vw, 3.5rem)' : 'clamp(4rem, 10vw, 7.5rem)',
                    fontWeight: '900', letterSpacing: '-0.04em',
                    textTransform: 'uppercase', color: '#ffffff', lineHeight: 0.95, marginBottom: '1.75rem',
                    textShadow: `0 0 80px ${activeAccent}45`,
                  }}>
                  {result.top_prediction}
                  <span style={{ color: activeAccent }}>.</span>
                </motion.div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <div>
                      <span style={{ fontSize: '0.6875rem', color: '#555', fontFamily: 'monospace', display: 'block', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>confidence</span>
                      <span style={{ fontSize: isMobile ? '1.75rem' : '2.25rem', fontWeight: '900', color: activeAccent, letterSpacing: '-0.04em' }}>{result.confidence}%</span>
                    </div>
                    <div style={{ flex: 1, minWidth: '160px' }}>
                      <div style={{ height: '8px', backgroundColor: '#2a2a2a', borderRadius: '4px', overflow: 'hidden' }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${result.confidence}%` }}
                          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
                          style={{ height: '100%', borderRadius: '4px', backgroundColor: activeAccent, boxShadow: `0 0 12px ${activeAccent}80` }} />
                      </div>
                    </div>
                  </div>
              </motion.div>

              {/* Top-5 list */}
              <div style={{ backgroundColor: '#f0f0f0', border: '1px solid #cccccc', borderRadius: '20px', padding: isMobile ? '1.25rem 1rem' : '1.75rem 2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <p style={{ fontSize: '0.6875rem', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'monospace', margin: 0 }}>
                    — top 5 candidates
                  </p>
                  <p style={{ fontSize: '0.6875rem', color: '#aaaaaa', fontFamily: 'monospace', margin: 0 }}>
                    click a row to select for download
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {result.top5.map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 + i * 0.07 }}
                      onClick={() => setSelectedWord(item.word)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '1rem',
                        borderRadius: '12px', padding: '0.875rem 1.125rem', cursor: 'pointer', transition: 'all 0.15s',
                        border: selectedWord === item.word ? `1.5px solid ${activeAccent}50` : i === 0 ? '1px solid #cccccc' : '1px solid #e4e4e4',
                        backgroundColor: selectedWord === item.word ? `${activeAccent}08` : i === 0 ? '#e8e8e8' : '#fafafa',
                      }}>
                      <span style={{ fontSize: '0.6875rem', fontWeight: '700', width: '20px', textAlign: 'center', fontFamily: 'monospace', color: i === 0 ? activeAccent : '#aaaaaa' }}>
                        {i === 0 ? '✓' : `#${i + 1}`}
                      </span>
                      <span style={{ fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.875rem', minWidth: isMobile ? '70px' : '100px', color: i === 0 ? '#1a1a1a' : '#555555' }}>
                        {item.word}
                      </span>
                      <div style={{ flex: 1, height: '6px', backgroundColor: '#e0e0e0', borderRadius: '3px', overflow: 'hidden' }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${item.confidence}%` }}
                          transition={{ duration: 0.6, delay: 0.3 + i * 0.07, ease: 'easeOut' }}
                          style={{ height: '100%', borderRadius: '3px', backgroundColor: i === 0 ? activeAccent : '#bbbbbb' }} />
                      </div>
                      <span style={{ fontSize: '0.875rem', fontWeight: '700', minWidth: '3.5rem', textAlign: 'right', fontFamily: 'monospace', color: i === 0 ? activeAccent : '#888888' }}>
                        {item.confidence}%
                      </span>
                    </motion.div>
                  ))}
                </div>
                </div>

              {/* Model badge + Reset + Download */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', backgroundColor: '#f0f0f0', border: '1px solid #cccccc', borderRadius: '10px', padding: '0.625rem 1rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: activeAccent }} />
                  <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#555555' }}>
                    {selectedModel === 'fusion' ? activeFusion.label : model.label}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
                  {subtitleError && (
                    <span style={{ fontSize: '0.75rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <AlertCircle size={12} /> {subtitleError}
                    </span>
                  )}
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      onClick={handleDownload} disabled={subtitleDownloading || !selectedWord}
                      title={!selectedWord ? 'Select a word from the list above' : `Download with "${selectedWord}" subtitle`}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem',
                        borderRadius: '10px', border: `1px solid ${activeAccent}`,
                        backgroundColor: subtitleDownloading || !selectedWord ? 'transparent' : `${activeAccent}12`,
                        color: subtitleDownloading || !selectedWord ? '#aaaaaa' : activeAccent,
                        fontSize: '0.875rem', fontWeight: '600',
                        cursor: subtitleDownloading || !selectedWord ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        borderColor: subtitleDownloading || !selectedWord ? '#cccccc' : activeAccent,
                      }}>
                      {subtitleDownloading
                        ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Burning…</>
                        : <><Download size={14} /> Download with Subtitle</>}
                    </motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={reset}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.375rem',
                      borderRadius: '10px', backgroundColor: '#1a1a1a', border: '1px solid #1a1a1a',
                      color: '#ffffff', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer', transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#333')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1a1a1a')}
                  >
                    <RefreshCw size={14} /> Try Another
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* UPLOAD (default) */}
          {!processing && !result && (
            <motion.div key="upload" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              {/* Upload card */}
              <div style={{ backgroundColor: '#f0f0f0', border: '1px solid #cccccc', borderRadius: '20px', padding: '2rem' }}>
                <p style={{ fontSize: '0.6875rem', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'monospace', marginBottom: '1.25rem' }}>
                  — 02 · upload video
                </p>
                <Uploader key={uploadKey} onFileSelect={handleFileSelect} disabled={processing} accent={activeAccent} isMobile={isMobile} />
                {file && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleProcess}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 2rem',
                        borderRadius: '10px', backgroundColor: '#1a1a1a', border: 'none',
                        color: '#ffffff', fontSize: '0.9375rem', fontWeight: '700', cursor: 'pointer',
                        letterSpacing: '-0.01em', boxShadow: `0 4px 24px ${activeAccent}35`, transition: 'background-color 0.2s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#333')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1a1a1a')}
                    >
                      <Play size={16} fill="white" style={{ color: '#fff' }} /> Analyse Video
                    </motion.button>
                  </motion.div>
                )}
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{
                      backgroundColor: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)',
                      borderRadius: '14px', padding: '1.125rem 1.5rem',
                      display: 'flex', alignItems: 'flex-start', gap: '0.875rem',
                    }}>
                    <AlertCircle size={18} style={{ color: '#ef4444', flexShrink: 0, marginTop: '1px' }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.875rem', fontWeight: '700', color: '#dc2626', marginBottom: '0.2rem' }}>
                        {error === '__network__' ? 'Server unreachable' : 'Something went wrong'}
                      </p>
                      <p style={{ fontSize: '0.8125rem', color: '#ef4444', opacity: 0.85 }}>
                        {error === '__network__'
                          ? 'The backend server may be waking up (cold start). Please wait a few seconds and try again.'
                          : error}
                      </p>
                      {error === '__network__' && (
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                          onClick={handleProcess} disabled={!file}
                          style={{
                            marginTop: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                            padding: '0.4rem 0.875rem', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.4)',
                            backgroundColor: 'rgba(239,68,68,0.08)', color: '#dc2626',
                            fontSize: '0.8125rem', fontWeight: '600', cursor: 'pointer',
                          }}>
                          <RefreshCw size={12} /> Retry
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tips card */}
              <div style={{ backgroundColor: '#f0f0f0', border: '1px solid #cccccc', borderRadius: '20px', padding: '2rem' }}>
                <p style={{ fontSize: '0.6875rem', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'monospace', marginBottom: '1.5rem' }}>
                  — tips for best results
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: activeAccent, marginBottom: '1rem' }}>Recording</p>
                    {['Say a single word clearly and at normal pace', 'Face the camera straight-on, well lit', 'Lips and mouth fully visible — no mask or hand', 'Keep duration between 1 and 3 seconds'].map((t) => (
                      <div key={t} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', marginBottom: '0.625rem' }}>
                        <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: activeAccent, flexShrink: 0, marginTop: '7px' }} />
                        <span style={{ fontSize: '0.875rem', color: '#555555', lineHeight: '1.55' }}>{t}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888888', marginBottom: '1rem' }}>Technical</p>
                    {['Format: MP4, MOV, AVI, MKV, WebM', 'Max file size: 50 MB', 'Recommended resolution: 480p or higher', 'Landmarks models need a clearly visible face'].map((t) => (
                      <div key={t} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', marginBottom: '0.625rem' }}>
                        <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#cccccc', flexShrink: 0, marginTop: '7px' }} />
                        <span style={{ fontSize: '0.875rem', color: '#777777', lineHeight: '1.55' }}>{t}</span>
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
