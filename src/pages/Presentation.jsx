import { useState, useEffect, useCallback } from 'react';
/* eslint-disable-next-line no-unused-vars */
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye, Brain, VolumeX, Users, Radio, Bot, Film, BookOpen, HelpCircle,
  Target, Layers, GitMerge, Database, BarChart3, TrendingUp, TrendingDown,
  PlayCircle, CheckCircle2, XCircle, Quote, Sparkles, ArrowRight, FlaskConical,
  Flame, Sprout, MapPin, Plus, Lock, Zap,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   SHARED PRIMITIVES (carried over from the progress deck so the
   visual language stays identical between presentations)
   ═══════════════════════════════════════════════════════════════ */

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
    <div className="px-3 py-1.5 rounded-lg border border-white/15 bg-[#111128]/80 text-xs text-gray-100 text-center font-medium whitespace-nowrap">
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

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
};

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

/* small reusable bits new to this deck */
function StatBlock({ value, label, sub, color = '#1a1a1a' }) {
  return (
    <div className="text-center shrink-0">
      <div className="text-6xl font-black" style={{ color }}>{value}</div>
      <div className="text-gray-400 text-sm mt-1">{label}</div>
      {sub && <div className="text-gray-600 text-xs">{sub}</div>}
    </div>
  );
}

function YesNo({ ok }) {
  return ok
    ? <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-semibold"><CheckCircle2 size={14} /> Yes</span>
    : <span className="inline-flex items-center gap-1 text-gray-400 text-xs font-semibold"><XCircle size={14} /> No</span>;
}

/* ═══════════════════════════════════════════════════════════════
   SLIDE 1 · Title
   ═══════════════════════════════════════════════════════════════ */
function TitleSlide() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 relative overflow-hidden">
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

        <h1 className="text-7xl font-black mb-4 leading-none" style={{ color: '#1a1a1a' }}>
          LipReader.AI
        </h1>
        <h2 className="text-2xl font-light text-gray-300 mb-3 tracking-wide">
          Dual-Stream Visual Speech Recognition
        </h2>
        <p className="text-gray-600 text-base mb-2">Final Evaluation Presentation</p>
        <p className="text-gray-600 text-base mb-10">COMSATS University Lahore · 2026</p>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          {['Landmark Validation', 'LRW-500 Benchmark', 'Dual-Stream Fusion', 'Live Demo'].map((tag, i) => (
            <motion.div key={tag} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }}>
              <Badge color={['#f97316', '#1a1a1a', '#9333ea', '#16a34a'][i]}>{tag}</Badge>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SLIDE 2 · The Problem
   ═══════════════════════════════════════════════════════════════ */
function ProblemSlide() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-10 relative">
      <Badge color="#ef4444">The Problem</Badge>
      <h1 className="text-5xl font-bold mt-4 mb-3 text-white">What word is this person saying?</h1>
      <p className="text-gray-400 text-lg mb-8 max-w-xl">There is no audio here, just the shape of a mouth moving. Take a moment and guess.</p>

      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.15 }}
      >
        <svg width="200" height="200" viewBox="0 0 200 200">
          <circle cx="100" cy="95" r="72" fill="#f0f0f0" stroke="#1a1a1a" strokeWidth="2.5" />
          <circle cx="76" cy="80" r="4.5" fill="#1a1a1a" />
          <circle cx="124" cy="80" r="4.5" fill="#1a1a1a" />
          <motion.ellipse
            cx="100" cy="128" rx="20" ry="10" fill="#f9731628" stroke="#f97316" strokeWidth="2.5"
            animate={{ rx: [20, 12, 26, 16, 20], ry: [10, 16, 6, 14, 10] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>
        <motion.div
          className="absolute -top-2 -right-4 w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: '#1a1a1a' }}
          animate={{ y: [0, -6, 0] }} transition={{ duration: 1.6, repeat: Infinity }}
        >
          <VolumeX size={18} color="#f97316" />
        </motion.div>
      </motion.div>

      <motion.p
        className="text-gray-500 text-sm mt-8 max-w-md"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
      >
        Impossible to tell without context. That's exactly the problem. It's genuinely hard for humans, and just as hard for machines.
      </motion.p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SLIDE 3 · Why This Matters
   ═══════════════════════════════════════════════════════════════ */
function WhyMattersSlide() {
  const apps = [
    { Icon: Users, title: 'Accessibility', desc: 'Assistive aid for deaf and hard-of-hearing individuals; language teaching tools' },
    { Icon: Radio, title: 'Audio Restoration', desc: 'Recover speech intent from noisy, muted, or corrupted audio-visual recordings' },
    { Icon: Film, title: 'Silent Video Understanding', desc: 'Understand speech in security-critical or audio-restricted footage' },
    { Icon: Bot, title: 'Robotics & HRI', desc: 'A visual input module paired with NLP for natural human-robot interaction' },
  ];
  return (
    <div className="flex flex-col h-full px-10 py-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Badge color="#6366f1">Why This Matters</Badge>
        <h1 className="text-5xl font-bold mt-3 mb-2 text-white">Applications</h1>
        <p className="text-gray-400 text-xl mb-7">This is useful infrastructure.</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 flex-1">
        {apps.map((app, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.1 }}>
            <GlassCard className="h-full">
              <app.Icon size={26} className="text-indigo-500 mb-3" />
              <h3 className="text-white font-semibold text-lg mb-1">{app.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{app.desc}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SLIDE 4 · Current Approach (REMOVED - MERGED INTO SLIDE 5)
   ═══════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════
   SLIDE 5 · Literature Snapshot
   ═══════════════════════════════════════════════════════════════ */
function LiteratureSlide() {
  const rows = [
    { name: 'LipNet', year: '2016', landmarks: false, drawback: 'Pixels only; no landmark analysis' },
    { name: 'LRW Baseline', year: '2016', landmarks: false, drawback: 'Standard pixel baseline; limited fusion exploration' },
    { name: 'Afouras et al.', year: '2018', landmarks: false, drawback: 'Audio-visual fusion only; ignores pure geometry' },
    { name: 'Auto-AVSR', year: '2021', landmarks: false, drawback: 'Joint training but no landmark isolation study' },
    { name: 'Wu & Xue et al.', year: '2023–24', landmarks: true, drawback: 'Uses landmarks but buried in joint model; no ablation' },
  ];
  return (
    <div className="flex flex-col h-full px-10 py-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Badge color="#8b5cf6">Literature Review</Badge>
        <h1 className="text-5xl font-bold mt-3 mb-2 text-white">Field Status & Research Gap</h1>
        <p className="text-gray-400 text-sm mb-3">Current approaches: pixels (3D-CNN + BiLSTM) are industry standard. Landmark potential remains untested at scale. Key finding: No prior work isolates and benchmarks landmarks alone on full LRW-500.</p>
        <p className="text-gray-400 text-sm mb-5"></p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex-1">
        <GlassCard className="p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                {['Work', 'Year', 'Uses Landmarks?', 'Tests Alone?', 'Drawback'].map((c) => (
                  <th key={c} className="text-left px-5 py-3 text-gray-400 font-semibold text-xs uppercase tracking-wider">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <motion.tr
                  key={row.name}
                  initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.08 }}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <td className="px-5 py-3.5 font-bold text-white">{row.name}</td>
                  <td className="px-5 py-3.5 text-gray-400">{row.year}</td>
                  <td className="px-5 py-3.5"><YesNo ok={row.landmarks} /></td>
                  <td className="px-5 py-3.5"><YesNo ok={false} /></td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs">{row.drawback}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      </motion.div>

      <motion.div
        className="mt-4 p-4 rounded-xl border border-pink-500/30 bg-pink-500/5"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}
      >
        <p className="text-pink-600 text-sm">
          <span className="font-semibold text-white">The Gap:</span> Mouth-shape landmarks have never been validated on their own, at scale. We don't know what pure geometry is worth by itself.
        </p>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SLIDE 6 · Research Questions (formerly SLIDE 7)
   ═══════════════════════════════════════════════════════════════ */
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
              <span className="text-indigo-400 font-semibold text-xs uppercase tracking-widest">Stream 1: Appearance</span>
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
              <span className="text-violet-400 font-semibold text-xs uppercase tracking-widest">Stream 2: Geometry</span>
            </div>
            <h3 className="text-white font-bold text-xl mb-2">50 Landmarks → Transformer</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              3D coordinates of 50 lip and chin landmarks detected by Mediapipe. Geometric motion patterns encoded by a Transformer + BiLSTM. Architecture-agnostic and lightweight.
            </p>
          </GlassCard>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
        <GlassCard className="border-amber-500/20 bg-amber-500/5">
          <h3 className="text-amber-400 font-semibold mb-3 text-xs uppercase tracking-widest">Research Questions</h3>
          <div className="space-y-2.5">
            {[
              'Does mouth-shape geometry carry useful word information on its own?',
              'How accurate is a landmark-only model on LRW-500, the first benchmark of its kind?',
              'Can we simply join landmarks onto an existing pixel model and improve its accuracy?',
            ].map((q, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-amber-400 font-black text-sm mt-0.5 shrink-0">RQ{i + 1}</span>
                <p className="text-gray-300 text-sm leading-relaxed">{q}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      <motion.div
        className="mt-1 p-4 rounded-xltext-center"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
      >
        <p className="text-emerald-700 text-sm">
          Landmarks offer a path past a generalization problem that pixels alone cannot solve. Pixel models struggle when speaker appearance changes; landmarks remain invariant by construction.
        </p>
      </motion.div>
      {/* <motion.div
        className="mt-5 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-center"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
      >
        <p className="text-emerald-700 text-sm">
          Landmarks offer a path past a generalization problem that pixels alone cannot solve. Pixel models struggle when speaker appearance changes; landmarks remain invariant by construction.
        </p>
      </motion.div>
       */}

    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SLIDE 7 · Architecture Deep Dive (formerly SLIDE 9)
   ═══════════════════════════════════════════════════════════════ */
function ArchitectureSlide() {
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

          <Group title="Fusion Strategies" delay={0.94}>
            <div className="flex flex-col gap-2.5">
              <Box label="Concatenation" />
              <Box label="Cross Attention" />
              <Box label="Gated Fusion" />
            </div>
          </Group>
          <Arr delay={1.12} />

          <Group title="Classifier Head" delay={1.28}>
            <Box label="Classifier Head" />
          </Group>
          <Arr delay={1.34} />

          <Cyl label="Output Text" delay={1.58} />
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   SLIDE 10 · Dataset: LRW-500
   ═══════════════════════════════════════════════════════════════ */
function DatasetsSlide() {
  const rows = [
    { name: 'LRW', type: 'Words', vocab: '500', feasible: 'Benchmarked, manageable', why: 'Word-level signals let us measure mouth-shape geometry signal without decoding, language modelling, or word-boundary problems.', chosen: true },
    { name: 'LRS2', type: 'Sentences', vocab: 'Open', feasible: 'Inappropriate for word level', chosen: false },
    { name: 'GRID', type: 'Words', vocab: '51', feasible: 'Too simple', chosen: false },
    { name: 'LRS3', type: 'Sentences', vocab: 'Open', feasible: 'Not available', chosen: false },
    { name: 'AVSpeech', type: 'Variable', vocab: 'Open', feasible: 'Noisy labels', chosen: false },
  ];

  const cols = ['Dataset', 'Type', 'Vocab', 'Feasible?', 'Why?'];

  return (
    <div className="flex flex-col h-full px-10 py-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Badge color="#10b981">Datasets</Badge>
        <h1 className="text-5xl font-bold mt-3 mb-2 text-white">Dataset Selection Strategy</h1>
        <p className="text-gray-400 text-sm mb-5">We carefully selected datasets to balance research goals with practical constraints.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex-1">
        <GlassCard className="p-0 overflow-hidden">
          <table className="w-full table-fixed text-sm">
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
                  <td className=" px-5 py-3.5">
                    <span className={`font-bold ${row.chosen ? 'text-white' : 'text-gray-500'}`}>{row.name}</span>
                  </td>
                  <td className={`px-5 py-3.5 ${row.chosen ? 'text-gray-300' : 'text-gray-500'}`}>{row.type}</td>
                  <td className={`px-5 py-3.5 ${row.chosen ? 'text-gray-300' : 'text-gray-500'}`}>{row.vocab}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${row.chosen
                        ? 'bg-emerald-500/20 text-emerald-700 border border-emerald-500/30'
                        : 'bg-white/5 text-gray-500 border border-white/10'
                      }`}>{row.feasible}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-medium py-1 rounded-full`}>{row.why}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      </motion.div>
      {/* 
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-4 text-sm text-gray-400">
        <span className="text-white font-semibold">Why LRW-500 fits our question:</span> Word-level atomic signals let us measure pure mouth-shape geometry's signal without decoding, language modelling, or word-boundary problems.
      </motion.p> */}
    </div>
  );
}

/* ── SLIDE 9 · Landmark Validation (formerly SLIDE 12) ────────────────── */
function ValidationSlide() {
  return (
    <div className="flex flex-col h-full px-10 py-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Badge color="#10b981">Experiment 001</Badge>
        <h1 className="text-5xl font-bold mt-3 mb-2 text-white">Landmark Validation</h1>
        <p className="text-gray-400 text-l mb-7">Do landmarks carry any useful signal for lip reading?</p>
      </motion.div>

      <div className="grid grid-cols-3 gap-5 mb-6">
        {[
          { Icon: FlaskConical, label: 'Model', val: '4-Layer Transformer', sub: 'Simple baseline, no CNN, no BiLSTM' },
          { Icon: BarChart3, label: 'Dataset', val: '100-Word Subset', sub: 'Harder LRW cluster via CMUDICT + K-Means' },
          { Icon: MapPin, label: 'Input', val: '50 Landmarks Only', sub: 'Pure geometry, zero appearance info' },
        ].map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
            <GlassCard className="text-center h-full">
              <item.Icon size={28} className="mx-auto mb-2 text-indigo-400" />
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
          <p className="text-emerald-400 text-xs uppercase tracking-widest mb-3 font-semibold">Validation Accuracy - ✓ RQ1 Answered. Landmarks carry signal
          </p>
          <div className="text-8xl font-black text-white mb-3">
            61.64<span className="text-4xl text-emerald-400">%</span>
          </div>
          <p className="text-gray-400 text-sm max-w-xlg mx-auto leading-relaxed mb-4">
            Achieved using <strong className="text-white">landmarks only</strong>, no pixel data whatsoever. This confirms that geometric lip motion carries sufficient discriminative signal to meaningfully assist visual speech recognition.
          </p>
          {/* <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">
            <span className="text-emerald-300 text-sm font-semibold">✓ RQ1 Answered. Landmarks carry signal</span>
          </div> */}
        </GlassCard>
      </motion.div>
    </div>
  );
}

/* ── SLIDE 13 · Landmark Baselines ────────────────────────────── */
function BaselinesSlide() {
  const exps = [
    { range: 'Exp 002-003', label: 'MLP Only', detail: 'Varied depths: 2, 3, 4 fully-connected layers', result: '~55%', status: 'base' },
    { range: 'Exp 004', label: 'MLP + BiLSTM', detail: 'Added temporal modelling over landmark sequences', result: '~58%', status: 'up' },
    { range: 'Exp 005–006', label: 'Transformer + BiLSTM', detail: 'Self-attention over landmark time-steps', result: '~61%', status: 'up' },
    { range: 'Exp 007–008', label: '+ Data Augmentation', detail: 'Gentle and aggressive augmentation strategies compared', result: '~61%', status: 'same' },
    { range: 'Exp 009–014', label: 'Hyperparameter Search', detail: 'Transformer depth, positional encoding, output dims, dropout', result: '~62%', status: 'final' },
  ];
  const colors = { base: '#6b7280', up: '#6366f1', same: '#f59e0b', final: '#10b981' };
  const icons = { base: '-', up: '↑', same: '→', final: '★' };

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
            <span className="text-emerald-400 font-bold text-lg">Exp 010: Finalized Baseline</span>
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

/* ── SLIDE 14 · Scaling to 500 Words ──────────────────────────── */
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
            exp: 'Exp 015-016', title: 'Warm-Start Training', Icon: Flame, color: '#f59e0b',
            desc: 'Initialized from Exp 010 weights, then fine-tuned on the full 500-word LRW dataset.',
            // sub: 'Crash-safe checkpoint system implemented',
          },
          {
            exp: 'Exp 017-018', title: 'From Scratch + Confusion Analysis', Icon: Sprout, color: '#6366f1',
            desc: 'Fresh initialization on full LRW. Direct comparison with warm-start approach.',
            // sub: 'Confusion matrix analysis included',
          },
        ].map((item, i) => (
          // <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.15 }}>
          //   <GlassCard className="h-full" style={{ borderColor: `${item.color}33` }}>
          //     <item.Icon size={24} className="mb-2" style={{ color: item.color }} />
          //     <span className="text-xs font-mono" style={{ color: item.color }}>{item.exp}</span>
          //     <h3 className="text-white font-bold text-lg mt-1 mb-2">{item.title}</h3>
          //     <p className="text-gray-400 text-sm leading-relaxed mb-2">{item.desc}</p>
          //     <p className="text-gray-600 text-xs">{item.sub}</p>
          //   </GlassCard>
          // </motion.div>
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.15 }}
          >
            <GlassCard className="h-full" style={{ borderColor: `${item.color}33` }}>
              <span
                className="text-xs font-mono"
                style={{ color: item.color }}
              >
                {item.exp}
              </span>

              <div className="flex items-center gap-2 mt-1 mb-2">
                <item.Icon size={20} style={{ color: item.color }} />
                <h3 className="text-white font-bold text-lg">
                  {item.title}
                </h3>
              </div>

              <p className="text-gray-400 text-sm leading-relaxed mb-2">
                {item.desc}
              </p>

              <p className="text-gray-600 text-xs">
                {item.sub}
              </p>
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
          <div className="text-white font-semibold">Landmarks-Only on Full LRW: First Benchmark</div>
          <p className="text-gray-400 text-sm leading-relaxed">
            51% accuracy on a 500-class problem using pure geometric features is significant. No prior published work reports a landmarks-only model benchmarked on the complete LRW dataset. This fills an identified research gap.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30">
            <span className="text-amber-600 text-xs font-semibold">✓ RQ2 Answered. First landmarks-only LRW benchmark</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ── SLIDE 15 · Appearance Baseline ───────────────────────────── */
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
          { Icon: Film, label: 'Input', val: 'Video Frames', sub: 'Cropped lip region' },
          { Icon: Layers, label: 'Backbone', val: '3D-CNN', sub: 'ResNet-18 based encoder' },
          { Icon: GitMerge, label: 'Temporal', val: 'BiLSTM', sub: 'Sequence-level modelling' },
        ].map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
            <GlassCard className="text-center h-full">
              <item.Icon size={28} className="mx-auto mb-2 text-indigo-400" />
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
          <div className="text-7xl font-black text-indigo-600">75%</div>
          <div className="text-gray-400 text-sm mt-1">Validation Accuracy</div>
          <div className="text-gray-500 text-xs">Full LRW · 500 words</div>
        </div>
        <div className="w-px h-16 bg-white/10 shrink-0" />
        <div className="space-y-3">
          <p className="text-white font-semibold">Strong appearance-only baseline established</p>
          <p className="text-gray-400 text-sm leading-relaxed">
            The 3D-CNN + BiLSTM pipeline achieves 75% validation accuracy on the full 500-class LRW dataset. Comparable to published state-of-the-art for similarly-sized single-stream models.
          </p>
          <div className="flex gap-2.5 flex-wrap">
            {[
              { label: '4.1M params', color: 'indigo' },
              { label: 'Single GPU trainable', color: 'indigo' },
            ].map((c, i) => (
              <span key={i} className={`px-3 py-1 rounded-full border border-${c.color}-500/30 bg-${c.color}-500/20 text-${c.color}-700 text-xs`}>
                {c.label}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ── SLIDE 16 · Fusion Experiments ───────────────────────────── */
function FusionSlide() {
  const strategies = [
    { exp: 'Exp 020', name: 'Combined (Concat)', Icon: Plus, color: '#6366f1', params: '1.8M†', val: '50.77%', test: '50.76%', desc: 'Concatenate appearance & landmark feature vectors along the feature dimension' },
    { exp: 'Exp 021', name: 'Combined (Gated)', Icon: Lock, color: '#8b5cf6', params: '2.3M†', val: '49.41%', test: '49.33%', desc: 'Learnable sigmoid gates control the contribution ratio of each modality' },
    { exp: 'Exp 022', name: 'Combined (Cross-Attention)', Icon: Zap, color: '#ec4899', params: '6.56M†', val: '50.12%', test: '49.05%', desc: 'Landmark features query the appearance feature space using scaled dot-product' },
  ];

  return (
    <div className="flex flex-col h-full px-10 py-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Badge color="#ec4899">Experiments 020-022</Badge>
        <h1 className="text-5xl font-bold mt-3 mb-1 text-white">Fusion Strategies</h1>
        <p className="text-gray-400 text-lg mb-6">Combining appearance & landmark features extracted <em>after</em> BiLSTM</p>
      </motion.div>

      <div className="grid grid-cols-3 gap-4 mb-5">
        {strategies.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
            <GlassCard className="h-full" style={{ borderColor: `${s.color}33` }}>
              <div className="flex items-center justify-between mb-3">
                <s.Icon size={24} style={{ color: s.color }} />
                <span className="text-xs font-mono text-gray-600">{s.exp}</span>
              </div>
              <h3 className="text-white font-bold text-sm mb-2">{s.name}</h3>
              <p className="text-gray-400 text-xs leading-relaxed mb-3">{s.desc}</p>
              <p className="text-gray-500 text-xs mb-2">Params: {s.params}</p>
              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs mb-2">
                <span className="text-gray-600">Val Accuracy</span>
                <span className="font-black text-blue-400">{s.val}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Test Accuracy</span>
                <span className="font-black text-emerald-400">{s.test}</span>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SLIDE 17 · Findings
   ═══════════════════════════════════════════════════════════════ */
// function FindingsSlide() {
//   const findings = [
//     { Icon: CheckCircle2, color: '#10b981', text: 'Mouth-shape geometry alone carries real signal: 44.03% test on LRW-500. The first benchmark of its kind' },
//     { Icon: TrendingUp, color: '#6366f1', text: 'Pixels still win, and they win efficiently: 74.9% test, lightweight, competitive with published systems' },
//     { Icon: XCircle, color: '#ef4444', text: "Simply combining the two signals after training them separately doesn't help. It's a mismatch problem, not an architecture problem" },
//     { Icon: ArrowRight, color: '#f59e0b', text: 'Training both signals together from the start is necessary for landmarks to actually improve results' },
//   ];
//   return (
//     <div className="flex flex-col h-full px-10 py-6 justify-center">
//       <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
//         <Badge color="#10b981">Findings</Badge>
//         <h1 className="text-5xl font-bold mt-3 text-white">Four Things We Now Know</h1>
//       </motion.div>

//       <div className="space-y-3">
//         {findings.map((f, i) => (
//           <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.12 }}>
//             <GlassCard style={{ borderColor: `${f.color}33` }}>
//               <div className="flex items-start gap-3">
//                 <f.Icon size={20} style={{ color: f.color }} className="mt-0.5 shrink-0" />
//                 <p className="text-gray-200 text-base leading-relaxed">{f.text}</p>
//               </div>
//             </GlassCard>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// }

function FindingsSlide() {
  const findings = [
    { Icon: CheckCircle2, color: '#10b981', text: 'Yes, mouth shape geometry carries real word information on its own, even without looking at pixels' },
    { Icon: TrendingUp, color: '#6366f1', text: 'A landmark only model reaches 44.03% on LRW 500, the first benchmark of its kind' },
    { Icon: XCircle, color: '#ef4444', text: "No, you can't just join landmarks onto an existing pixel model. Combining them after training separately doesn't help" },
    { Icon: ArrowRight, color: '#f59e0b', text: 'Landmarks only help when both signals are trained together from the start' },
  ];
  return (
    <div className="flex flex-col h-full px-10 py-6 justify-center">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Badge color="#10b981">Findings</Badge>
        <h1 className="text-5xl font-bold mt-3 text-white">Our Findings</h1>
      </motion.div>

      <div className="space-y-3">
        {findings.map((f, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.12 }}>
            <GlassCard style={{ borderColor: `${f.color}33` }}>
              <div className="flex items-start gap-3">
                <f.Icon size={20} style={{ color: f.color }} className="mt-0.5 shrink-0" />
                <p className="text-gray-200 text-base leading-relaxed">{f.text}</p>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
/* ═══════════════════════════════════════════════════════════════
   SLIDE 18 · Closing / Thank You
   ═══════════════════════════════════════════════════════════════ */
function ClosingSlide() {
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

      <motion.div initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative z-10 max-w-2xl">
        <Quote size={32} className="text-orange-500 mx-auto mb-5" />
        <p className="text-2xl md:text-3xl font-bold mb-8 leading-snug" style={{ color: '#1a1a1a' }}>
          We did not build a perfect lip reader. We built an experiment that tells you exactly what it will take to build one.
        </p>

        <h1 className="text-7xl font-black mb-4 leading-none" style={{ color: '#1a1a1a' }}>Thank You</h1>
        <p className="text-gray-400 text-xl mb-2">LipReader.AI — Dual-Stream Visual Speech Recognition</p>
        <p className="text-gray-600 text-base mb-10">Final Evaluation · COMSATS University Lahore · 2026</p>

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

/* ═══════════════════════════════════════════════════════════════
   SLIDE 19 · Appendix Divider
   ═══════════════════════════════════════════════════════════════ */
function AppendixDividerSlide() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8">
      <Badge color="#6b7280">Appendix</Badge>
      <h1 className="text-6xl font-black mt-5 mb-3" style={{ color: '#1a1a1a' }}>Landmark Ablation</h1>
      <p className="text-gray-500 text-lg">Supplementary detail — the systematic groundwork behind the headline numbers.</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SLIDE 20 · Landmark Ablation Timeline
   ═══════════════════════════════════════════════════════════════ */
function AblationTimelineSlide() {
  const steps = [
    { label: 'First signal check', detail: 'Simple model on raw tracked points, no video, no convolutions — 100-word subset', result: '61.64%', note: 'vs. ~1% random guessing' },
    { label: 'Order matters', detail: 'Shuffling away the frame order (averaging instead) collapsed accuracy', result: '<7%', note: 'temporal order is essential' },
    { label: 'Bigger models, same ceiling', detail: 'Deeper models, different positional encodings, wider layers — all landed in the same range', result: '~62%', note: 'the limit is the feature, not the model' },
    { label: 'Scaled to full LRW-500', detail: 'Carrying the pipeline over to the full 500-word benchmark', result: '44.03%', note: 'became the headline landmark-only benchmark' },
  ];
  return (
    <div className="flex flex-col h-full px-10 py-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Badge color="#8b5cf6">Landmark Ablation</Badge>
        <h1 className="text-5xl font-bold mt-3 mb-1 text-white">Does The Signal Even Work?</h1>
        <p className="text-gray-400 text-lg mb-6">The check we ran before committing to full-scale training.</p>
      </motion.div>

      <div className="space-y-2.5 flex-1">
        {steps.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -25 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.12 }}>
            <div className="flex items-center gap-4 px-5 py-3.5 rounded-xl border border-white/8 bg-white/[0.03]">
              <FlaskConical size={18} className="text-violet-500 shrink-0" />
              <div className="flex-1">
                <div className="text-white font-semibold text-sm">{s.label}</div>
                <div className="text-gray-500 text-xs">{s.detail}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-black text-xl text-violet-600">{s.result}</div>
                <div className="text-gray-600 text-xs">{s.note}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Slide registry
   ═══════════════════════════════════════════════════════════════ */
const SLIDE_COMPONENTS = [
  TitleSlide, ProblemSlide, WhyMattersSlide,
  LiteratureSlide, NoveltySlide, ArchitectureSlide, DatasetsSlide,
  ValidationSlide, BaselinesSlide, ScalingSlide, AppearanceSlide, FusionSlide, FindingsSlide,
  ClosingSlide, AppendixDividerSlide, AblationTimelineSlide,
];

const SLIDE_TITLES = [
  'Title', 'The Problem', 'Why This Matters',
  'Literature', 'Novelty', 'Architecture', 'Datasets',
  'Validation', 'Baselines', 'Scaling', 'Appearance', 'Fusion', 'Findings',
  'Thank You', 'Appendix', 'Ablation',
];

const TOTAL_SLIDES = SLIDE_COMPONENTS.length;

/* ═══════════════════════════════════════════════════════════════
   Main Presentation
   ═══════════════════════════════════════════════════════════════ */
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
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  const SlideComponent = SLIDE_COMPONENTS[current];

  return (
    <div className="min-h-screen flex flex-col" style={{ paddingTop: '64px', backgroundColor: '#e8e8e8', color: '#1a1a1a' }}>
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

      <div className="fixed top-[64px] left-0 right-0 z-40 h-0.5" style={{ backgroundColor: '#e0e0e0' }}>
        <motion.div
          className="h-full"
          style={{ background: '#f97316' }}
          animate={{ width: `${((current + 1) / TOTAL_SLIDES) * 100}%` }}
          transition={{ duration: 0.35 }}
        />
      </div>

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

      <div
        className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between px-8"
        style={{
          height: '60px',
          background: 'rgba(240,240,240,0.95)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid #cccccc',
        }}
      >
        <div className="flex items-center gap-3 w-48">
          <span className="text-xs font-mono tabular-nums" style={{ color: '#888888' }}>
            {String(current + 1).padStart(2, '0')}&nbsp;/&nbsp;{TOTAL_SLIDES}
          </span>
          <span className="text-sm truncate" style={{ color: '#555555' }}>{SLIDE_TITLES[current]}</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-hidden">
          {SLIDE_TITLES.map((title, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              title={title}
              className="rounded-full transition-all duration-200 hover:scale-125 focus:outline-none shrink-0"
              style={{
                width: i === current ? 22 : 7,
                height: 7,
                background: i === current ? '#f97316' : i < current ? '#f9731666' : '#cccccc',
              }}
            />
          ))}
        </div>

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