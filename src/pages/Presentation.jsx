import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Brain } from 'lucide-react';

const TOTAL_SLIDES = 13;

/* ── Pre-computed random data (avoids re-render jitter) ───────── */
const TITLE_PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  w: 20 + (i * 37) % 80, h: 20 + (i * 53) % 80,
  x: (i * 67) % 100, y: (i * 43) % 100,
  dur: 3 + (i * 17) % 4, delay: (i * 29) % 200 / 100,
}));

const THANKS_PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  w: 20 + (i * 41) % 60, h: 20 + (i * 41) % 60,
  x: (i * 71) % 100, y: (i * 47) % 100,
  dur: 3 + (i * 19) % 3, delay: (i * 31) % 200 / 100,
  color: ['#f97316', '#1a1a1a', '#555555'][i % 3],
}));

/* ── Slide transition variants ────────────────────────────────── */
const slideVariants = {
  enter:  (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
};

/* ── Reusable primitives ──────────────────────────────────────── */
function Badge({ children, color = '#f97316' }) {
  return (
    <span style={{
      backgroundColor: `${color}18`, color,
      border: `1px solid ${color}40`,
      borderRadius: '999px', padding: '2px 14px',
      fontSize: '0.68rem', fontWeight: 700,
      display: 'inline-block', letterSpacing: '0.1em', textTransform: 'uppercase',
    }}>
      {children}
    </span>
  );
}

function GlassCard({ children, style, className = '' }) {
  return (
    <div
      style={{
        backgroundColor: '#f0f0f0',
        border: '1px solid #cccccc',
        borderRadius: '16px',
        padding: '1.25rem',
        ...style,
      }}
      className={className}
    >
      {children}
    </div>
  );
}

/* ── SLIDE 1 · Title ──────────────────────────────────────────── */
function TitleSlide() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 relative overflow-hidden">
      {/* ambient particles */}
      {TITLE_PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{ width: p.w, height: p.h, left: `${p.x}%`, top: `${p.y}%`, background: '#1a1a1a0a' }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay }}
        />
      ))}

      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative z-10">
        <motion.div
          className="mx-auto mb-6 w-20 h-20 rounded-2xl flex items-center justify-center"
          style={{ background: '#1a1a1a' }}
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <Eye size={40} color="white" />
        </motion.div>

        <h1
          className="text-7xl font-black mb-4 leading-none"
          style={{ color: '#1a1a1a' }}
        >
          LipReader.AI
        </h1>
        <h2 className="text-2xl font-light text-gray-300 mb-3 tracking-wide">
          Dual-Stream Visual Speech Recognition
        </h2>
        <p className="text-gray-600 text-base mb-10">Final Year Project · COMSATS University Lahore · 2026</p>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          {['CNN + Transformer', 'Landmark Fusion', 'LRW · LRS2', 'Dual-Stream'].map((tag, i) => (
            <motion.div key={tag} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }}>
              <Badge color={['#f97316','#1a1a1a','#9333ea','#16a34a'][i]}>{tag}</Badge>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ── SLIDE 2 · Introduction ───────────────────────────────────── */
function IntroSlide() {
  const apps = [
    { icon: '♿', title: 'Accessibility', desc: 'Assistive aid for deaf and hard-of-hearing individuals; language teaching tools' },
    { icon: '📡', title: 'Surveillance', desc: 'Silent speech understanding in security-critical, noisy, or audio-restricted environments' },
    { icon: '🤖', title: 'Robotics', desc: 'Visual input processing module paired with an NLP pipeline for natural human-robot interaction' },
    { icon: '🎬', title: 'A/V Restoration', desc: 'Recover speech intent from degraded, muted, or corrupted audio-visual recordings' },
  ];
  return (
    <div className="flex flex-col h-full px-10 py-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Badge color="#6366f1">Introduction</Badge>
        <h1 className="text-5xl font-bold mt-3 mb-2 text-white">What is Visual Speech Recognition?</h1>
        <p className="text-gray-400 text-xl mb-7">
          Predicting spoken words purely from lip and face movement — no audio required.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 flex-1">
        {apps.map((app, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.1 }}>
            <GlassCard className="h-full hover:border-indigo-500/30 transition-colors duration-300">
              <div className="text-3xl mb-3">{app.icon}</div>
              <h3 className="text-white font-semibold text-lg mb-1">{app.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{app.desc}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-4 p-4 rounded-xl border border-purple-500/30 bg-purple-500/10"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
      >
        <p className="text-purple-300 text-sm leading-relaxed">
          <span className="font-semibold text-white">Why we chose this:</span> VSR combines CNNs for spatial feature extraction with Transformers for temporal attention modelling — making it a rich vehicle for learning core deep learning approaches and producing genuinely impactful research.
        </p>
      </motion.div>
    </div>
  );
}

/* ── SLIDE 3 · Our Contribution ───────────────────────────────── */
function NoveltySlide() {
  return (
    <div className="flex flex-col h-full px-10 py-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Badge color="#ec4899">Our Contribution</Badge>
        <h1 className="text-5xl font-bold mt-3 mb-6 text-white">Pioneering Dual-Stream Fusion</h1>
      </motion.div>

      <div className="grid grid-cols-2 gap-6 mb-5">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <GlassCard className="h-full border-indigo-500/30">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                <Eye size={16} className="text-indigo-400" />
              </div>
              <span className="text-indigo-400 font-semibold text-xs uppercase tracking-widest">Stream 1 — Appearance</span>
            </div>
            <h3 className="text-white font-bold text-xl mb-2">Raw Frames → 3D-CNN</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Primary practice in VSR. Spatial and textural features extracted from lip-region video frames using a 3D-CNN with ResNet-18 backbone, followed by BiLSTM temporal modelling.
            </p>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <GlassCard className="h-full border-violet-500/30">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                <Brain size={16} className="text-violet-400" />
              </div>
              <span className="text-violet-400 font-semibold text-xs uppercase tracking-widest">Stream 2 — Geometry</span>
            </div>
            <h3 className="text-white font-bold text-xl mb-2">50 Landmarks → Transformer</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              3D coordinates of 50 lip and chin landmarks detected by Mediapipe. Geometric motion patterns encoded by a Transformer + BiLSTM — architecture-agnostic and lightweight.
            </p>
          </GlassCard>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
        <GlassCard className="border-amber-500/20 bg-amber-500/5">
          <h3 className="text-amber-400 font-semibold mb-3 text-xs uppercase tracking-widest">Research Questions</h3>
          <div className="space-y-2.5">
            {[
              'Are landmarks helpful at all as an assisting modality alongside appearance features?',
              'Benchmark landmarks-only on the full LRW dataset — an unexplored research gap in the literature.',
              'Can we build a lightweight, non-resource-intensive model trainable on a single GPU?',
            ].map((q, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-amber-400 font-black text-sm mt-0.5 shrink-0">RQ{i + 1}</span>
                <p className="text-gray-300 text-sm leading-relaxed">{q}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}

/* ── SLIDE 4 · Datasets ───────────────────────────────────────── */
function DatasetsSlide() {
  const rows = [
    { name: 'LRW',       type: 'Words',     size: '173 hrs', vocab: '500',  why: 'Benchmarked, manageable', chosen: true  },
    { name: 'LRS2',      type: 'Sentences', size: '140 hrs', vocab: 'Open', why: 'Real-world complexity',   chosen: true  },
    { name: 'GRID',      type: 'Words',     size: '34 hrs',  vocab: '51',   why: 'Too simple',              chosen: false },
    { name: 'LRS3',      type: 'Sentences', size: '439 hrs', vocab: 'Open', why: 'Not available',           chosen: false },
    { name: 'AVSpeech',  type: 'Variable',  size: '4700 hrs',vocab: 'Open', why: 'Noisy labels',            chosen: false },
  ];

  const cols = ['Dataset', 'Type', 'Size', 'Vocab', 'Why?'];

  return (
    <div className="flex flex-col h-full px-10 py-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Badge color="#10b981">Datasets</Badge>
        <h1 className="text-5xl font-bold mt-3 mb-2 text-white">Dataset Selection Strategy</h1>
        <p className="text-gray-400 text-sm mb-5">We carefully selected datasets to balance research goals with practical constraints.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex-1">
        <GlassCard className="p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                {cols.map((c) => (
                  <th key={c} className="text-left px-5 py-3 text-gray-400 font-semibold text-xs uppercase tracking-wider">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <motion.tr
                  key={row.name}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className={row.chosen ? 'bg-indigo-500/10' : 'bg-transparent'}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <td className="px-5 py-3.5">
                    <span className={`font-bold ${row.chosen ? 'text-white' : 'text-gray-500'}`}>{row.name}</span>
                  </td>
                  <td className={`px-5 py-3.5 ${row.chosen ? 'text-gray-300' : 'text-gray-500'}`}>{row.type}</td>
                  <td className={`px-5 py-3.5 ${row.chosen ? 'text-gray-300' : 'text-gray-500'}`}>{row.size}</td>
                  <td className={`px-5 py-3.5 ${row.chosen ? 'text-gray-300' : 'text-gray-500'}`}>{row.vocab}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      row.chosen
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-white/5 text-gray-500 border border-white/10'
                    }`}>{row.why}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      </motion.div>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-4 text-sm text-gray-400">
        <span className="text-white font-semibold">Strategy:</span> Validate with LRW, then scale to LRS2 for real-world scenarios.
      </motion.p>
    </div>
  );
}

/* ── SLIDE 5 · Architecture ───────────────────────────────────── */
function ArchitectureSlide() {
  function Cyl({ label, delay = 0 }) {
    return (
      <motion.div
        className="flex flex-col items-center shrink-0"
        initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.45, type: 'spring', stiffness: 240, damping: 20 }}
      >
        <svg width="52" height="68" viewBox="0 0 52 68" fill="none">
          <rect x="2" y="12" width="48" height="44" fill="#166534" stroke="#22c55e" strokeWidth="1.5" />
          <ellipse cx="26" cy="56" rx="24" ry="8" fill="#14532d" stroke="#22c55e" strokeWidth="1.5" />
          <ellipse cx="26" cy="12" rx="24" ry="8" fill="#22c55e" stroke="#16a34a" strokeWidth="1.5" />
        </svg>
        <p className="text-xs font-semibold text-gray-300 mt-1.5 text-center leading-tight w-16">{label}</p>
      </motion.div>
    );
  }

  function Arr({ delay = 0 }) {
    return (
      <motion.div
        className="flex items-center shrink-0 mx-0.5"
        initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay, duration: 0.22 }}
        style={{ transformOrigin: 'left center' }}
      >
        <div style={{ width: 18, height: 1.5, background: '#6b7280' }} />
        <div style={{ width: 0, height: 0, borderStyle: 'solid', borderWidth: '4px 0 4px 6px', borderColor: 'transparent transparent transparent #6b7280' }} />
      </motion.div>
    );
  }

  function Box({ label }) {
    return (
      <div className="px-3 py-1.5 rounded-lg border border-white/15 bg-[#111128] text-xs text-gray-200 text-center font-medium whitespace-nowrap">
        {label}
      </div>
    );
  }

  function Group({ title, children, bg = 'rgba(99,102,241,0.07)', border = 'rgba(99,102,241,0.22)', delay = 0 }) {
    return (
      <motion.div
        className="relative rounded-xl p-2.5 pt-5 shrink-0"
        style={{ background: bg, border: `1px solid ${border}` }}
        initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.45, type: 'spring', stiffness: 240, damping: 20 }}
      >
        <span className="absolute top-1.5 left-2.5 text-[9px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{title}</span>
        {children}
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col h-full px-8 py-6">
      <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
        <Badge color="#f59e0b">Architecture</Badge>
        <h1 className="text-4xl font-bold mt-2 text-white">System Architecture</h1>
      </motion.div>

      <div className="flex-1 flex items-center justify-center overflow-x-auto slide-scroll">
        <div className="flex items-center gap-1.5 min-w-max px-2">
          <Cyl label="Video Input" delay={0.1} />
          <Arr delay={0.28} />

          <Group title="Preprocessing" delay={0.38}>
            <div className="flex flex-col gap-1.5">
              <Box label="Face Detection" />
              <Box label="Lip ROI Extraction" />
              <Box label="Normalization" />
            </div>
          </Group>
          <Arr delay={0.55} />

          <Group title="Parallel Encoders" bg="rgba(139,92,246,0.07)" border="rgba(139,92,246,0.25)" delay={0.62}>
            <div className="flex flex-col gap-2.5">
              <Group title="RNN Branch" bg="rgba(99,102,241,0.07)" border="rgba(99,102,241,0.2)" delay={0.72}>
                <div className="flex flex-col gap-1.5">
                  <Box label="3D Conv Frontend" />
                  <Box label="RNN" />
                </div>
              </Group>
              <Group title="Landmarks Branch" bg="rgba(139,92,246,0.07)" border="rgba(139,92,246,0.2)" delay={0.78}>
                <div className="flex flex-col gap-1.5">
                  <Box label="Linear Projection" />
                  <Box label="Transformer Layer" />
                </div>
              </Group>
            </div>
          </Group>
          <Arr delay={0.88} />

          {/* Fusion Layer — entrance + continuous glow pulse */}
          <motion.div
            className="rounded-xl px-5 py-4 text-sm font-bold text-white text-center shrink-0 leading-snug"
            style={{ background: 'linear-gradient(135deg,#6d28d9,#9d4edd)', border: '1px solid #9d4edd88', minWidth: 86 }}
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{
              opacity: 1,
              scale: 1,
              boxShadow: [
                '0 0 18px rgba(124,58,237,0.4)',
                '0 0 38px rgba(167,68,255,0.82)',
                '0 0 18px rgba(124,58,237,0.4)',
              ],
            }}
            transition={{
              opacity: { delay: 0.94, duration: 0.4 },
              scale: { delay: 0.94, duration: 0.4, type: 'spring', stiffness: 260, damping: 18 },
              boxShadow: { delay: 1.4, duration: 1.9, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            Fusion<br />Layer
          </motion.div>
          <Arr delay={1.12} />

          <Group title="CTC Head" bg="rgba(236,72,153,0.07)" border="rgba(236,72,153,0.22)" delay={1.34}>
            <div className="flex flex-col gap-1.5">
              <Box label="Linear + Softmax" />
              <Box label="CTC Loss" />
              <Box label="CTC Decode" />
            </div>
          </Group>
          <Arr delay={1.28} />

          <Cyl label="Output Text" delay={1.58} />
        </div>
      </div>
    </div>
  );
}

/* ── SLIDE 6 · Landmark Validation ───────────────────────────── */
function ValidationSlide() {
  return (
    <div className="flex flex-col h-full px-10 py-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Badge color="#10b981">Experiment 001</Badge>
        <h1 className="text-5xl font-bold mt-3 mb-2 text-white">Landmark Validation</h1>
        <p className="text-gray-400 text-xl mb-7">Do landmarks carry any useful signal for lip reading?</p>
      </motion.div>

      <div className="grid grid-cols-3 gap-5 mb-6">
        {[
          { icon: '🔬', label: 'Model', val: '4-Layer Transformer', sub: 'Simple baseline — no CNN, no BiLSTM' },
          { icon: '📊', label: 'Dataset', val: '100-Word Subset', sub: 'Harder LRW cluster via CMUDICT + K-Means' },
          { icon: '📍', label: 'Input', val: '50 Landmarks Only', sub: 'Pure geometry — zero appearance info' },
        ].map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
            <GlassCard className="text-center h-full">
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="text-gray-500 text-xs uppercase tracking-wide mb-1">{item.label}</div>
              <div className="text-white font-bold text-base mb-1">{item.val}</div>
              <div className="text-gray-500 text-xs">{item.sub}</div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="flex-1 flex items-center"
        initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
      >
        <GlassCard className="w-full border-emerald-500/30 bg-emerald-500/5 text-center py-8">
          <p className="text-emerald-400 text-xs uppercase tracking-widest mb-3 font-semibold">Validation Accuracy</p>
          <div className="text-8xl font-black text-white mb-3">
            61.64<span className="text-4xl text-emerald-400">%</span>
          </div>
          <p className="text-gray-400 text-sm max-w-lg mx-auto leading-relaxed mb-4">
            Achieved using <strong className="text-white">landmarks only</strong> — no pixel data whatsoever. This confirms that geometric lip motion carries sufficient discriminative signal to meaningfully assist visual speech recognition.
          </p>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">
            <span className="text-emerald-300 text-sm font-semibold">✓ RQ1 Answered — Landmarks DO carry signal</span>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}

/* ── SLIDE 7 · Landmark Baselines ────────────────────────────── */
function BaselinesSlide() {
  const exps = [
    { range: 'Exp 002–003', label: 'MLP Only',              detail: 'Varied depths — 2, 3, 4 fully-connected layers',                   result: '~55%', status: 'base' },
    { range: 'Exp 004',     label: 'MLP + BiLSTM',          detail: 'Added temporal modelling over landmark sequences',                  result: '~58%', status: 'up'   },
    { range: 'Exp 005–006', label: 'Transformer + BiLSTM',  detail: 'Self-attention over landmark time-steps',                          result: '~61%', status: 'up'   },
    { range: 'Exp 007–008', label: '+ Data Augmentation',   detail: 'Gentle and aggressive augmentation strategies compared',           result: '~61%', status: 'same' },
    { range: 'Exp 009–014', label: 'Hyperparameter Search', detail: 'Transformer depth, positional encoding, output dims, dropout',     result: '~62%', status: 'final'},
  ];
  const colors = { base: '#6b7280', up: '#6366f1', same: '#f59e0b', final: '#10b981' };
  const icons  = { base: '—', up: '↑', same: '→', final: '★' };

  return (
    <div className="flex flex-col h-full px-10 py-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Badge color="#8b5cf6">Experiments 002–014</Badge>
        <h1 className="text-5xl font-bold mt-3 mb-1 text-white">Landmark-Only Baselines</h1>
        <p className="text-gray-400 text-lg mb-6">Systematically building the best landmark pipeline on the 100-word subset</p>
      </motion.div>

      <div className="space-y-2.5 flex-1">
        {exps.map((e, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.1 }}>
            <div className="flex items-center gap-4 px-5 py-3.5 rounded-xl border border-white/8 bg-white/[0.03] hover:border-white/15 transition-colors">
              <span className="text-gray-700 text-xs font-mono w-20 shrink-0">{e.range}</span>
              <div className="flex-1">
                <div className="text-white font-semibold text-sm">{e.label}</div>
                <div className="text-gray-500 text-xs">{e.detail}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span style={{ color: colors[e.status] }} className="text-sm font-bold">{icons[e.status]}</span>
                <span style={{ color: colors[e.status] }} className="font-black text-xl">{e.result}</span>
                <span className="text-gray-600 text-xs">val acc</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-4 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <span className="text-emerald-400 font-bold text-lg">Exp 010 — Finalized Baseline</span>
            <p className="text-gray-400 text-sm mt-0.5">2-Transformer + BiLSTM, 80 epochs · matches Exp 001 → <em className="text-white">architecture-agnostic ceiling detected</em></p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-black text-emerald-400">62%</div>
            <div className="text-gray-500 text-xs">100-word subset</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ── SLIDE 8 · Scaling to 500 Words ──────────────────────────── */
function ScalingSlide() {
  return (
    <div className="flex flex-col h-full px-10 py-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Badge color="#f59e0b">Experiments 015–018</Badge>
        <h1 className="text-5xl font-bold mt-3 mb-2 text-white">Scaling to Full LRW</h1>
        <p className="text-gray-400 text-xl mb-7">Extending the landmark pipeline from 100 → 500 words</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-5 mb-6">
        {[
          {
            exp: 'Exp 015–016', title: 'Warm-Start Training', icon: '🔥', color: '#f59e0b',
            desc: 'Initialized from Exp 010 weights, then fine-tuned on the full 500-word LRW dataset.',
            sub: 'Crash-safe checkpoint system implemented',
          },
          {
            exp: 'Exp 017–018', title: 'From Scratch + Confusion Analysis', icon: '🌱', color: '#6366f1',
            desc: 'Fresh initialization on full LRW — direct comparison with warm-start approach.',
            sub: 'Confusion matrix analysis included',
          },
        ].map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.15 }}>
            <GlassCard className="h-full" style={{ borderColor: `${item.color}33` }}>
              <div className="text-2xl mb-2">{item.icon}</div>
              <span className="text-xs font-mono" style={{ color: item.color }}>{item.exp}</span>
              <h3 className="text-white font-bold text-lg mt-1 mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-2">{item.desc}</p>
              <p className="text-gray-600 text-xs">{item.sub}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="flex items-center gap-8 p-6 rounded-2xl border border-amber-500/30 bg-amber-500/5"
        initial={{ opacity: 0, scale: 0.93 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
      >
        <div className="text-center shrink-0">
          <div className="text-6xl font-black text-amber-400">51%</div>
          <div className="text-gray-400 text-sm mt-1">Validation Accuracy</div>
          <div className="text-gray-600 text-xs">500 words · Full LRW</div>
        </div>
        <div className="w-px h-16 bg-white/10 shrink-0" />
        <div className="space-y-2">
          <div className="text-white font-semibold">Landmarks-Only on Full LRW — First Benchmark</div>
          <p className="text-gray-400 text-sm leading-relaxed">
            51% accuracy on a 500-class problem using pure geometric features is significant. No prior published work reports a landmarks-only model benchmarked on the complete LRW dataset — this fills an identified research gap.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30">
            <span className="text-amber-300 text-xs font-semibold">✓ RQ2 Answered — First landmarks-only LRW benchmark</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ── SLIDE 9 · Appearance Baseline ───────────────────────────── */
function AppearanceSlide() {
  return (
    <div className="flex flex-col h-full px-10 py-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Badge color="#6366f1">Appearance Baseline</Badge>
        <h1 className="text-5xl font-bold mt-3 mb-2 text-white">3D-CNN Visual Stream</h1>
        <p className="text-gray-400 text-xl mb-7">Establishing the upper bound for the appearance-only modality</p>
      </motion.div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { icon: '🎥', label: 'Input',    val: 'Video Frames',   sub: 'Cropped lip region' },
          { icon: '🏗',  label: 'Backbone', val: '3D-CNN',         sub: 'ResNet-18 based encoder' },
          { icon: '🔁', label: 'Temporal', val: 'BiLSTM',         sub: 'Sequence-level modelling' },
        ].map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
            <GlassCard className="text-center h-full">
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="text-gray-500 text-xs uppercase tracking-wide mb-1">{item.label}</div>
              <div className="text-white font-bold text-lg">{item.val}</div>
              <div className="text-gray-500 text-xs mt-1">{item.sub}</div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="flex-1 flex items-center gap-8 p-6 rounded-2xl border border-indigo-500/30 bg-indigo-500/5"
        initial={{ opacity: 0, scale: 0.93 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
      >
        <div className="text-center shrink-0">
          <div className="text-7xl font-black text-indigo-400">75%</div>
          <div className="text-gray-400 text-sm mt-1">Validation Accuracy</div>
          <div className="text-gray-500 text-xs">Full LRW · 500 words</div>
        </div>
        <div className="w-px h-16 bg-white/10 shrink-0" />
        <div className="space-y-3">
          <p className="text-white font-semibold">Strong appearance-only baseline established</p>
          <p className="text-gray-400 text-sm leading-relaxed">
            The 3D-CNN + BiLSTM pipeline achieves 75% validation accuracy on the full 500-class LRW dataset — comparable to published state-of-the-art for similarly-sized single-stream models.
          </p>
          <div className="flex gap-2.5 flex-wrap">
            {[
              { label: '~11M params (ResNet backbone)', color: 'indigo' },
              { label: 'Single GPU trainable', color: 'indigo' },
              { label: '✓ RQ3: Lightweight model achieved', color: 'emerald' },
            ].map((c, i) => (
              <span key={i} className={`px-3 py-1 rounded-full border border-${c.color}-500/30 bg-${c.color}-500/10 text-${c.color}-300 text-xs`}>
                {c.label}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ── SLIDE 10 · Fusion Experiments ───────────────────────────── */
function FusionSlide() {
  const strategies = [
    { exp: 'Exp 020', name: 'Simple Concatenation', icon: '➕', color: '#6366f1', desc: 'Concatenate appearance & landmark feature vectors along the feature dimension', train: '~78%' },
    { exp: 'Exp 021', name: 'Gated Fusion',         icon: '🔐', color: '#8b5cf6', desc: 'Learnable sigmoid gates control the contribution ratio of each modality',      train: '~95%' },
    { exp: 'Exp 022', name: 'Cross-Attention',       icon: '⚡', color: '#ec4899', desc: 'Landmark features query the appearance feature space using scaled dot-product', train: '~91%' },
  ];

  return (
    <div className="flex flex-col h-full px-10 py-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Badge color="#ec4899">Experiments 020–022</Badge>
        <h1 className="text-5xl font-bold mt-3 mb-1 text-white">Fusion Strategies</h1>
        <p className="text-gray-400 text-lg mb-6">Combining appearance & landmark features extracted <em>after</em> BiLSTM</p>
      </motion.div>

      <div className="grid grid-cols-3 gap-4 mb-5">
        {strategies.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
            <GlassCard className="h-full" style={{ borderColor: `${s.color}33` }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{s.icon}</span>
                <span className="text-xs font-mono text-gray-600">{s.exp}</span>
              </div>
              <h3 className="text-white font-bold text-sm mb-2">{s.name}</h3>
              <p className="text-gray-400 text-xs leading-relaxed mb-3">{s.desc}</p>
              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                <span className="text-gray-600">Training Acc</span>
                <span className="font-black text-emerald-400">{s.train}</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-gray-600">Validation</span>
                <span className="font-bold text-red-400">Overfit</span>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <motion.div className="p-4 rounded-xl border border-red-500/30 bg-red-500/5 mb-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
        <div className="flex items-start gap-3">
          <span className="text-xl shrink-0">⚠️</span>
          <div>
            <h3 className="text-red-400 font-semibold text-sm mb-1">All strategies overfit on training data</h3>
            <p className="text-gray-400 text-xs leading-relaxed">High training accuracy (~93–95%) but poor generalization to validation. Features extracted <strong className="text-white">after</strong> BiLSTM carry too much task-specific signal from single-stream pre-training, preventing effective joint learning.</p>
          </div>
        </div>
      </motion.div>

      <motion.div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}>
        <div className="flex items-start gap-3">
          <span className="text-xl shrink-0">💡</span>
          <div>
            <h3 className="text-amber-400 font-semibold text-sm mb-1">Identified Fix</h3>
            <p className="text-gray-400 text-xs leading-relaxed">Extract features <strong className="text-white">before BiLSTM</strong> — fuse richer, less-processed representations so the BiLSTM can learn joint temporal dynamics from both modalities simultaneously.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ── SLIDE 11 · LRS2 Challenges & Limitations ────────────────── */
function LRS2ChallengesSlide() {
  return (
    <div className="flex flex-col h-full px-10 py-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Badge color="#ef4444">Challenges &amp; Limitations</Badge>
        <h1 className="text-5xl font-bold mt-3 mb-1 text-white">LRS2 Sentence-Level VSR</h1>
        <p className="text-gray-400 text-lg mb-5">Appearance stream attempt — hardware constraints prevented full convergence</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 flex-1">
        {/* Left column */}
        <div className="flex flex-col gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
            <GlassCard style={{ borderColor: '#ef444433' }}>
              <div className="text-xl mb-2">🖥️</div>
              <h3 className="text-white font-bold text-sm mb-2">Hardware Constraint (T4 GPU · 16 GB)</h3>
              <ul className="space-y-1">
                {[
                  'Physical batch size forced to 2 throughout all training',
                  'BatchNorm computes statistics from 2 samples → noisy normalisation',
                  '8-step gradient accumulation helped gradients, not BatchNorm',
                  '~16 min/epoch on full LRS2 Main — severe iteration ceiling',
                ].map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
                    <span className="text-red-500 mt-0.5 shrink-0">•</span>{t}
                  </li>
                ))}
              </ul>
            </GlassCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
            <GlassCard style={{ borderColor: '#6366f133' }}>
              <div className="text-xl mb-2">🏗️</div>
              <h3 className="text-white font-bold text-sm mb-2">Architecture (MC3D + ResNet18 + BiLSTM)</h3>
              <ul className="space-y-1">
                {[
                  'Matches architecture used in competitive published LRS2 work',
                  'CTC loss with curriculum learning (≤50 chars → full dataset)',
                  'V1 custom CNN hit hard ceiling at val loss 2.98 → switched to MC3D',
                  'MC3D + ResNet18 reached val loss 2.608 on pretrain subset',
                ].map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
                    <span className="text-indigo-400 mt-0.5 shrink-0">•</span>{t}
                  </li>
                ))}
              </ul>
            </GlassCard>
          </motion.div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <GlassCard style={{ borderColor: '#f59e0b33' }}>
              <div className="text-xl mb-2">📉</div>
              <h3 className="text-white font-bold text-sm mb-3">Training Results vs Published Threshold</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Best val loss (ours)', value: '2.67', color: '#f59e0b' },
                  { label: 'Consonant threshold', value: '~2.0', color: '#10b981' },
                  { label: 'Compute gap', value: '~100 h', color: '#ef4444' },
                  { label: 'Published batch size', value: '16–32', color: '#6366f1' },
                ].map((m, i) => (
                  <div key={i} className="rounded-xl bg-white/[0.03] border border-white/8 px-3 py-2 text-center">
                    <div className="text-lg font-black" style={{ color: m.color }}>{m.value}</div>
                    <div className="text-[10px] text-gray-600 mt-0.5 leading-tight">{m.label}</div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <GlassCard style={{ borderColor: '#8b5cf633' }}>
              <div className="text-xl mb-2">👄</div>
              <h3 className="text-white font-bold text-sm mb-2">Partial Viseme Collapse</h3>
              <ul className="space-y-1">
                {[
                  'Decoder output limited to 3 vowel shapes: I/E (spread), U/O (rounded)',
                  'Cannot discriminate consonants — they overlap visually with vowels',
                  'Consonant discrimination requires val loss well below 2.5',
                  'Fine-grained temporal dynamics only emerge with sufficient compute',
                ].map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
                    <span className="text-purple-400 mt-0.5 shrink-0">•</span>{t}
                  </li>
                ))}
              </ul>
            </GlassCard>
          </motion.div>
        </div>
      </div>

      <motion.div className="mt-4 p-3 rounded-xl border border-gray-700/50 bg-white/[0.02]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
        <p className="text-gray-500 text-xs leading-relaxed">
          <strong className="text-gray-400">Root cause:</strong> Not an architecture problem — MC3D + ResNet18 + BiLSTM is architecturally equivalent to published approaches (Afouras et al., Ma et al.).{' '}
          Published results used multi-GPU V100/A100 clusters with batch size 16–32. The gap is entirely in compute resources.
        </p>
      </motion.div>
    </div>
  );
}

/* ── SLIDE 12 · Future Work ───────────────────────────────────── */
function FutureWorkSlide() {
  return (
    <div className="flex flex-col h-full px-10 py-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Badge color="#f59e0b">Future Work</Badge>
        <h1 className="text-5xl font-bold mt-3 mb-2 text-white">What&apos;s Next</h1>
        <p className="text-gray-400 text-xl mb-7">Core model is complete — next step is fusion layer refinement</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-6 flex-1">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex flex-col gap-4">
          <GlassCard className="border-amber-500/30 flex-1">
            <div className="text-2xl mb-3">🔀</div>
            <h3 className="text-white font-bold text-lg mb-2">Pre-BiLSTM Feature Fusion</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-3">
              Current fusion extracts features <strong className="text-white">after</strong> the BiLSTM — both streams are already independently optimized, making joint learning difficult. The improvement is to fuse <strong className="text-white">before</strong> temporal modelling, so the BiLSTM learns directly from combined multimodal representations.
            </p>
            <div className="text-xs text-amber-400 flex items-center gap-1.5">
              <span>→</span> Expected to resolve overfitting and improve validation accuracy
            </div>
          </GlassCard>

          <GlassCard className="border-purple-500/30">
            <div className="text-xl mb-2">📐</div>
            <h3 className="text-white font-bold text-sm mb-1">Fusion Strategy Re-evaluation</h3>
            <p className="text-gray-400 text-xs leading-relaxed">Re-run concat, gated fusion, and cross-attention experiments on pre-BiLSTM features to determine which strategy generalizes best.</p>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="flex flex-col gap-4">
          <GlassCard className="border-indigo-500/30">
            <div className="text-xl mb-2">📊</div>
            <h3 className="text-white font-bold text-sm mb-2">Comprehensive Benchmarking</h3>
            <p className="text-gray-400 text-xs leading-relaxed">Report final fusion results against both baselines — quantifying the marginal gain from adding the landmark modality and validating the dual-stream hypothesis.</p>
          </GlassCard>

          <GlassCard className="border-emerald-500/30">
            <div className="text-xl mb-2">📝</div>
            <h3 className="text-white font-bold text-sm mb-2">Research Documentation</h3>
            <p className="text-gray-400 text-xs leading-relaxed">Document findings for the FYP report and potential publication — pioneering dual-stream fusion with geometric landmarks as secondary modality on LRW.</p>
          </GlassCard>

          <GlassCard className="border-white/8 bg-white/[0.02]">
            <p className="text-gray-600 text-xs leading-relaxed">
              <strong className="text-gray-500">Scope note:</strong> This is not adding new features. The research is complete — future work is a targeted improvement to the existing fusion layer to address the identified overfitting problem.
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}

/* ── SLIDE 13 · Thank You ─────────────────────────────────────── */
function ThanksSlide() {

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 relative overflow-hidden">
      {THANKS_PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{ width: p.w, height: p.h, left: `${p.x}%`, top: `${p.y}%`, background: `${p.color}18` }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay }}
        />
      ))}

      <motion.div initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative z-10">
        <h1
          className="text-8xl font-black mb-4 leading-none"
          style={{ color: '#1a1a1a' }}
        >
          Thank You
        </h1>
        <p className="text-gray-400 text-xl mb-2">LipReader.AI — Dual-Stream Visual Speech Recognition</p>
        <p className="text-gray-600 text-base mb-10">Final Year Project · COMSATS University Lahore · 2026</p>

        <motion.div
          className="p-5 rounded-2xl max-w-md mx-auto"
          style={{ border: '1px solid #cccccc', backgroundColor: '#f0f0f0' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}
        >
          <p style={{ color: '#555555' }}>Questions &amp; Discussion</p>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ── Slide registry ───────────────────────────────────────────── */
const SLIDE_COMPONENTS = [
  TitleSlide, IntroSlide, NoveltySlide, DatasetsSlide,
  ArchitectureSlide, ValidationSlide, BaselinesSlide, ScalingSlide,
  AppearanceSlide, FusionSlide, LRS2ChallengesSlide, FutureWorkSlide, ThanksSlide,
];

const SLIDE_TITLES = [
  'Title', 'Introduction', 'Our Contribution', 'Datasets',
  'Architecture', 'Landmark Validation', 'Baselines', 'Scaling to LRW',
  'Appearance Baseline', 'Fusion Experiments', 'LRS2 Challenges', 'Future Work', 'Thank You',
];

/* ── Main Presentation ────────────────────────────────────────── */
export default function Presentation() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const go = useCallback((index) => {
    if (index === current) return;
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  }, [current]);

  const prev = useCallback(() => { if (current > 0) go(current - 1); }, [current, go]);
  const next = useCallback(() => { if (current < TOTAL_SLIDES - 1) go(current + 1); }, [current, go]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next();
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  const SlideComponent = SLIDE_COMPONENTS[current];

  return (
    <div className="min-h-screen flex flex-col" style={{ paddingTop: '64px', backgroundColor: '#e8e8e8', color: '#1a1a1a' }}>
      {/* Global CSS overrides for Tailwind dark classes inside slides */}
      <style>{`
        .pres-content [class~="text-white"] { color: #1a1a1a !important; }
        .pres-content [class~="text-gray-200"] { color: #222222 !important; }
        .pres-content [class~="text-gray-300"] { color: #333333 !important; }
        .pres-content [class~="text-gray-400"] { color: #555555 !important; }
        .pres-content [class~="text-gray-500"] { color: #777777 !important; }
        .pres-content [class~="text-gray-600"] { color: #888888 !important; }
        .pres-content [class~="text-gray-700"] { color: #999999 !important; }
        .pres-content h1, .pres-content h2, .pres-content h3 { color: #1a1a1a; }
        .pres-content strong { color: inherit !important; }
      `}</style>
      {/* ── top progress bar */}
      <div className="fixed top-[64px] left-0 right-0 z-40 h-0.5" style={{ backgroundColor: '#e0e0e0' }}>
        <motion.div
          className="h-full"
          style={{ background: '#f97316' }}
          animate={{ width: `${((current + 1) / TOTAL_SLIDES) * 100}%` }}
          transition={{ duration: 0.35 }}
        />
      </div>

      {/* ── slide viewport */}
      <div className="relative overflow-hidden pres-content" style={{ height: 'calc(100vh - 64px - 60px)' }}>
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0 overflow-y-auto slide-scroll"
          >
            <SlideComponent />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── bottom navigation bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between px-8"
        style={{
          height: '60px',
          background: 'rgba(240,240,240,0.95)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid #cccccc',
        }}
      >
        {/* slide counter + name */}
        <div className="flex items-center gap-3 w-48">
          <span className="text-xs font-mono tabular-nums" style={{ color: '#888888' }}>
            {String(current + 1).padStart(2, '0')}&nbsp;/&nbsp;{TOTAL_SLIDES}
          </span>
          <span className="text-sm truncate" style={{ color: '#555555' }}>{SLIDE_TITLES[current]}</span>
        </div>

        {/* dot navigation */}
        <div className="flex items-center gap-1.5">
          {SLIDE_TITLES.map((title, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              title={title}
              className="rounded-full transition-all duration-200 hover:scale-125 focus:outline-none"
              style={{
                width: i === current ? 22 : 7,
                height: 7,
                background: i === current ? '#f97316' : i < current ? '#f9731666' : '#cccccc',
              }}
            />
          ))}
        </div>

        {/* prev / next */}
        <div className="flex items-center gap-2 w-48 justify-end">
          <button
            onClick={prev}
            disabled={current === 0}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-25 transition-colors"
            style={{ border: '1px solid #cccccc', color: '#555555', background: '#f0f0f0' }}
          >
            ← Prev
          </button>
          <button
            onClick={next}
            disabled={current === TOTAL_SLIDES - 1}
            className="flex items-center gap-1 px-4 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-25 text-white transition-opacity"
            style={{ background: '#1a1a1a', border: 'none', color: 'white' }}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
