import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, X, TrendingUp, TrendingDown, Minus, FlaskConical, Layers, Brain, BarChart3, ChevronRight } from 'lucide-react';
import Button from '../components/Button';

const experiments = [
  {
    id: 1, number: '001',
    name: 'Transformer Only — Spatial Attention',
    tag: 'Architecture Validation', tagColor: 'indigo',
    dataset: 'LRW-100', params: '3.2M', epochs: 40, valAcc: '61.64%', trainAcc: '74.54%', trend: 'up', icon: Brain,
    description: 'First experiment to validate that facial landmarks alone (without any RGB data) contain enough geometric information for word-level lip reading. Used a pure Transformer with a linear classifier — no MLP pre-projection, no BiLSTM.',
    pipeline: '150-dim input → 4-Layer Transformer (4 heads, 256-dim) → Linear Classifier',
    findings: 'Achieved 61.64% best validation accuracy, proving that geometric features carry strong discriminative signal. The ~13% train-val gap indicated overfitting at this scale.',
    outcome: 'positive',
  },
  {
    id: 2, number: '002',
    name: 'MLP + Temporal Mean Pooling Baseline',
    tag: 'Baseline', tagColor: 'gray',
    dataset: 'LRW-100', params: '130K', epochs: 40, valAcc: '4.48%', trainAcc: '5.71%', trend: 'down', icon: Layers,
    description: 'Established a simple MLP baseline without any temporal modeling. Features per frame were pooled by taking the mean across 29 frames, destroying all motion information.',
    pipeline: '150-dim → MLP (150→256→256) → Temporal Mean Pool → Linear Classifier',
    findings: 'Only 4.48% accuracy. Mean pooling collapses motion direction, making all clips look identical. Confirmed temporal modeling is non-negotiable.',
    outcome: 'negative',
  },
  {
    id: 3, number: '003',
    name: 'Deeper MLP + Mean Pooling',
    tag: 'Ablation', tagColor: 'gray',
    dataset: 'LRW-100', params: '580K', epochs: 40, valAcc: '6.06%', trainAcc: '7.47%', trend: 'down', icon: Layers,
    description: 'Scaled up MLP depth significantly to test whether richer per-frame representations could compensate for the lack of temporal modeling.',
    pipeline: '150-dim → Deep MLP (150→512→512→256) → Temporal Mean Pool → Linear Classifier',
    findings: 'Marginal improvement to 6.06%. Depth alone cannot recover information lost by mean pooling. The mean pooling bottleneck is the fundamental issue.',
    outcome: 'negative',
  },
  {
    id: 4, number: '004',
    name: 'MLP + BiLSTM — Temporal Modeling',
    tag: 'Breakthrough', tagColor: 'green',
    dataset: 'LRW-100', params: '2.25M', epochs: 40, valAcc: '43.96%', trainAcc: '45.97%', trend: 'up', icon: TrendingUp,
    description: 'Replaced mean pooling with a BiLSTM to preserve and model temporal dynamics across the 29-frame sequence. This was the key architectural pivot.',
    pipeline: '150-dim → MLP (150→256→256) → BiLSTM (2-layer, 256-hidden, bidirectional) → Classifier',
    findings: '43.96% accuracy — a ~37× jump from Exp 003. Definitively proves lip reading is inherently sequential. Model had not yet converged at 40 epochs.',
    outcome: 'positive',
  },
  {
    id: 5, number: '005',
    name: 'Transformer + BiLSTM — No MLP',
    tag: 'Failed Arch', tagColor: 'red',
    dataset: 'LRW-100', params: '2.5M', epochs: 40, valAcc: '0.82%', trainAcc: null, trend: 'down', icon: FlaskConical,
    description: 'Replaced the MLP with a direct linear projection into the Transformer. Early stopping triggered almost immediately.',
    pipeline: '150-dim → Linear Projection (256) → PE → Transformer (4-layer, 8-head) → BiLSTM → Classifier',
    findings: 'Collapsed to 0.82% — worse than chance. A single linear projection is too shallow before attention. Architecture flaw confirmed.',
    outcome: 'negative',
  },
  {
    id: 6, number: '006',
    name: 'MLP + Transformer + BiLSTM — Primary Baseline',
    tag: 'Primary Baseline', tagColor: 'indigo',
    dataset: 'LRW-100', params: '2.5M', epochs: 40, valAcc: '61.58%', trainAcc: '71.83%', trend: 'up', icon: Brain,
    description: 'Combined all insights: MLP for per-frame feature learning, Transformer for spatial context, and BiLSTM for temporal dynamics. This became our primary architecture.',
    pipeline: '150-dim → MLP (150→256→256) → Transformer (1-layer, 4-head) → BiLSTM (2-layer, 256) → Classifier (512→100)',
    findings: '61.58% best validation accuracy. This is the landmark-stream primary baseline architecture.',
    outcome: 'positive',
  },
  {
    id: 7, number: '007',
    name: 'Aggressive Data Augmentation',
    tag: 'Regularization', tagColor: 'orange',
    dataset: 'LRW-100', params: '2.5M', epochs: 40, valAcc: '43.2%', trainAcc: '35.08%', trend: 'down', icon: FlaskConical,
    description: 'Applied heavy augmentation (flip, crop, noise, scale) with dropout 0.4 to close the train-val gap from Exp 006.',
    pipeline: 'Same as Exp 006 + Flip, Crop, Noise, Scale augmentation + Dropout 0.4',
    findings: '43.2% — a regression. Train accuracy dropped below val, indicating augmentations destroyed the semantically dense landmark signal.',
    outcome: 'negative',
  },
  {
    id: 8, number: '008',
    name: 'Gentle Augmentation',
    tag: 'Regularization', tagColor: 'orange',
    dataset: 'LRW-100', params: '2.5M', epochs: 40, valAcc: '54.58%', trainAcc: '55.13%', trend: 'neutral', icon: FlaskConical,
    description: 'Softer augmentation to find the boundary between helpful regularization and semantic destruction.',
    pipeline: 'Same as Exp 006 + milder augmentation pipeline',
    findings: '54.58% — below the no-augmentation baseline. Landmark coordinates are too semantically dense for spatial augmentation.',
    outcome: 'negative',
  },
  {
    id: 9, number: '009',
    name: '2-Layer Transformer — Depth Study',
    tag: 'Architecture', tagColor: 'purple',
    dataset: 'LRW-100', params: '3M', epochs: 40, valAcc: '60.14%', trainAcc: '71.99%', trend: 'neutral', icon: Layers,
    description: 'Doubled Transformer depth to test whether deeper spatial modeling could push past the 62% ceiling.',
    pipeline: '150-dim → MLP → Transformer Layer 1 (4-head) → Transformer Layer 2 (4-head) → BiLSTM → Classifier',
    findings: '60.14% — marginally below Exp 006 despite more parameters. Additional depth adds overfitting without commensurate gain at 40 epochs.',
    outcome: 'neutral',
  },
  {
    id: 10, number: '010',
    name: '2-Layer Transformer — 80 Epochs (True Ceiling)',
    tag: 'Ceiling Found', tagColor: 'green',
    dataset: 'LRW-100', params: '3M', epochs: 80, valAcc: '62.66%', trainAcc: '78.34%', trend: 'up', icon: TrendingUp,
    description: 'Extended training to 80 epochs to find the true convergence ceiling. Early stopped at epoch 54.',
    pipeline: 'Same as Exp 009 — 80 epochs, early stopping (patience 20)',
    findings: '62.66% best validation accuracy — our confirmed primary ceiling for LRW-100.',
    outcome: 'positive',
  },
  {
    id: 11, number: '011',
    name: '3-Layer Transformer — 80 Epochs',
    tag: 'Architecture', tagColor: 'purple',
    dataset: 'LRW-100', params: '3.5M', epochs: 80, valAcc: '62.66%', trainAcc: '87.18%', trend: 'neutral', icon: Layers,
    description: 'Added a third Transformer layer to test if deeper spatial modeling could exceed the 62.66% ceiling.',
    pipeline: '150-dim → MLP → 3× Transformer (4-head) → BiLSTM → Classifier',
    findings: 'Identical val accuracy (62.66%) but train jumped to 87.18% — severe overfitting. Third layer cost not justified.',
    outcome: 'neutral',
  },
  {
    id: 12, number: '012',
    name: '2-Layer Transformer + Positional Encoding',
    tag: 'Architecture', tagColor: 'purple',
    dataset: 'LRW-100', params: '3M', epochs: 50, valAcc: '53.08%', trainAcc: '60.27%', trend: 'down', icon: FlaskConical,
    description: 'Added sinusoidal positional encoding before the Transformer to test whether explicit positional info was the missing ingredient.',
    pipeline: '150-dim → MLP → PE (256-dim) → 2× Transformer (4-head) → BiLSTM → Classifier',
    findings: '53.08% — a regression. Positional encoding interferes with the BiLSTM which already captures temporal order.',
    outcome: 'negative',
  },
  {
    id: 13, number: '013',
    name: 'Wider Dimensions — 512-dim MLP',
    tag: 'Scale', tagColor: 'blue',
    dataset: 'LRW-100', params: '16.4M', epochs: 50, valAcc: '60.04%', trainAcc: '89.74%', trend: 'down', icon: Layers,
    description: 'Scaled model width dramatically (4× Exp 010). Session crashed at epoch 23.',
    pipeline: '150-dim → Wide MLP (150→512→512→256→256) → PE → 2× Transformer → BiLSTM → Classifier',
    findings: '60.04% at crash with 89.74% train — severe overfitting. Scale alone cannot break the 62% barrier.',
    outcome: 'negative',
  },
  {
    id: 14, number: '014',
    name: 'Wider Dimensions + Dropout 0.4',
    tag: 'Regularization', tagColor: 'orange',
    dataset: 'LRW-100', params: '16.4M', epochs: 50, valAcc: '59.92%', trainAcc: '97.42%', trend: 'down', icon: FlaskConical,
    description: 'Added stronger dropout to the wide architecture from Exp 013 to combat overfitting.',
    pipeline: 'Same as Exp 013 + Dropout 0.4',
    findings: '59.92% val, 97.42% train — overfitting widened further. Width without architectural changes cannot generalize.',
    outcome: 'negative',
  },
  {
    id: 15, number: '015',
    name: 'LRW-500 Warm Start from Exp 010',
    tag: 'Scale Up', tagColor: 'blue',
    dataset: 'LRW-500', params: '3M', epochs: 60, valAcc: '42.95%', trainAcc: '67.60%', trend: 'neutral', icon: TrendingUp,
    description: 'First full LRW-500 experiment. Warm-started from Exp 010 checkpoint with backbone frozen for 3 warm-up epochs.',
    pipeline: 'Exp 010 weights → Freeze backbone (3 ep) → Unfreeze + train on LRW-500 → Classifier (512→500)',
    findings: '42.95% plateau at epoch 56. Warm start created biases that did not generalize to 500 words.',
    outcome: 'neutral',
  },
  {
    id: 16, number: '016',
    name: 'Landmark-Only Baseline — LRW-500',
    tag: 'Official Baseline', tagColor: 'green',
    dataset: 'LRW-500', params: '3M', epochs: 80, valAcc: '40.84%', trainAcc: null, trend: 'up', icon: BarChart3,
    description: 'Official landmark-only baseline trained from scratch on the full 500-word LRW dataset. The definitive result for geometric-only lip reading.',
    pipeline: '150-dim → MLP → 2× Transformer (4-head) → BiLSTM → Classifier (512→500)',
    findings: '40.84% test accuracy — official landmark-only baseline. Ceiling is robust across vocab sizes, confirming it is a feature-level property.',
    outcome: 'positive',
  },
  {
    id: 17, number: '017',
    name: 'Confusion Matrix Analysis — Exp 010',
    tag: 'Analysis', tagColor: 'gray',
    dataset: 'LRW-100', params: '—', epochs: null, valAcc: '—', trainAcc: null, trend: 'neutral', icon: BarChart3,
    description: 'Post-hoc analysis of the confusion matrix from Exp 010 to identify the hardest and most confused word pairs.',
    pipeline: 'Inference on LRW-100 val set → Per-class accuracy + confusion heatmap',
    findings: 'Bottom-5: class 21 (28%), class 7 (34%), class 72 (36%), class 85 (38%), class 57 (40%). Visually similar phoneme transitions drive errors.',
    outcome: 'neutral',
  },
  {
    id: 18, number: '018',
    name: 'LRW-500 from Scratch — Full Training',
    tag: 'Baseline', tagColor: 'gray',
    dataset: 'LRW-500', params: '3M', epochs: 80, valAcc: '41.78%', trainAcc: '62.58%', trend: 'neutral', icon: Brain,
    description: 'Full LRW-500 training from random initialization. Confusion matrix reveals ~110 words with near-zero accuracy.',
    pipeline: 'Random Init → MLP → 2× Transformer (4-head) → BiLSTM → Classifier (512→500)',
    findings: '41.78% val. ~110 short common words ("about", "action", "child") achieved near-zero accuracy — inherent landmark-feature blind spots.',
    outcome: 'neutral',
  },
  {
    id: 19, number: '019',
    name: 'Appearance-Only Baseline — 3D CNN + BiLSTM',
    tag: 'Official Baseline', tagColor: 'green',
    dataset: 'LRW-500', params: '—', epochs: null, valAcc: '74.30%', trainAcc: null, trend: 'up', icon: BarChart3,
    description: 'Official appearance-only baseline using MC3D + ResNet-18 for spatiotemporal feature extraction, followed by a BiLSTM. Trained on GCP with NVIDIA L4.',
    pipeline: 'Grayscale video → MC3D + ResNet-18 → BiLSTM → Classifier (→500)',
    findings: '74.30% test accuracy — our official appearance-only baseline and upper-bound target for dual-stream fusion.',
    outcome: 'positive',
  },
  {
    id: 20, number: '020',
    name: 'Temporal Concat Fusion',
    tag: 'Fusion Strategy', tagColor: 'blue',
    dataset: 'LRW-500', params: '~4.7M', epochs: 30, valAcc: '~51%', trainAcc: '~95%', trend: 'neutral', icon: Layers,
    description: 'Simplest mid-stream fusion strategy. Pre-extracted BiLSTM sequence features (B,29,512) from both streams are concatenated along the feature dimension, passed through a shared temporal projection, then mean-pooled over time before an MLP classifier.',
    pipeline: '(B,29,512) app + (B,29,512) lm → LayerNorm each → Concat (B,29,1024) → Linear temporal projection (1024→1024) → Mean pool (B,1024) → MLP (1024→512→500)',
    findings: '~51% validation accuracy. High training accuracy (~95%) reveals overfitting — the pre-extracted BiLSTM features carry too much task-specific single-stream signal to enable effective joint generalization. Simple mean pooling also discards valuable temporal dynamics.',
    outcome: 'neutral',
  },
  {
    id: 21, number: '021',
    name: 'Temporal Gated Fusion',
    tag: 'Fusion Strategy', tagColor: 'purple',
    dataset: 'LRW-500', params: '~5.5M', epochs: 30, valAcc: '~74%', trainAcc: '~93%', trend: 'up', icon: Brain,
    description: 'Introduces independent learnable sigmoid gates per modality. Each gate uses the joint context (concat of both streams) to decide how much of each stream to pass through. Replaces mean pooling with temporal attention pooling for richer temporal aggregation.',
    pipeline: '(B,29,512) app + (B,29,512) lm → LayerNorm → Concat joint context (B,29,1024) → Gate app (Sigmoid) + Gate lm (Sigmoid) → Gated concat (B,29,1024) → Temporal attention pool → MLP (1024→512→500)',
    findings: '~74% validation accuracy — a significant improvement over simple concat. The per-modality gates successfully learn to weight each stream by its relevance per timestep, and attention pooling better preserves temporal structure than mean pooling.',
    outcome: 'positive',
  },
  {
    id: 22, number: '022',
    name: 'Temporal Cross-Attention Fusion',
    tag: 'Best Fusion', tagColor: 'orange',
    dataset: 'LRW-500', params: '~7.2M', epochs: 30, valAcc: '~78%', trainAcc: '~94%', trend: 'up', icon: TrendingUp,
    description: 'Most expressive fusion strategy. Landmark features query the full appearance feature space via multi-head cross-attention, allowing the model to selectively attend to the most relevant appearance timesteps for each landmark configuration. A residual gate controls the blend between the original and attended features.',
    pipeline: '(B,29,512) app + (B,29,512) lm → LayerNorm → Cross-attention (lm queries app) → Residual gate (Sigmoid blend) → Concat with app (B,29,1024) → Temporal attention pool (learned query) → MLP (1024→512→500)',
    findings: '~78% validation accuracy — best of all three fusion strategies. Cross-attention gives the landmark stream a targeted mechanism to query appearance features, producing the most discriminative fused representation. Outperforms the appearance-only baseline in controlled evaluation.',
    outcome: 'positive',
  },
];

/* ─── Tag styles ─────────────────────────────────────────────────── */
const TAG = {
  indigo: { bg:'rgba(99,102,241,0.15)',  border:'rgba(99,102,241,0.4)',  text:'#a5b4fc' },
  green:  { bg:'rgba(34,197,94,0.13)',   border:'rgba(34,197,94,0.4)',   text:'#86efac' },
  red:    { bg:'rgba(239,68,68,0.13)',   border:'rgba(239,68,68,0.4)',   text:'#fca5a5' },
  orange: { bg:'rgba(249,115,22,0.13)',  border:'rgba(249,115,22,0.4)',  text:'#fdba74' },
  purple: { bg:'rgba(168,85,247,0.13)',  border:'rgba(168,85,247,0.4)',  text:'#d8b4fe' },
  blue:   { bg:'rgba(59,130,246,0.13)',  border:'rgba(59,130,246,0.4)',  text:'#93c5fd' },
  gray:   { bg:'rgba(156,163,175,0.10)', border:'rgba(156,163,175,0.3)', text:'#d1d5db' },
};

const BORDER = {
  positive:'rgba(99,102,241,0.35)',
  negative:'rgba(239,68,68,0.25)',
  neutral: 'rgba(255,255,255,0.08)',
};
const CARD_BG = {
  positive:'linear-gradient(160deg,rgba(99,102,241,0.07) 0%,rgba(139,92,246,0.04) 100%)',
  negative:'linear-gradient(160deg,rgba(239,68,68,0.06) 0%,rgba(249,115,22,0.03) 100%)',
  neutral: 'linear-gradient(160deg,rgba(255,255,255,0.03) 0%,rgba(255,255,255,0.01) 100%)',
};

/* ─── Trend badge ────────────────────────────────────────────────── */
function Trend({ trend, val }) {
  if (!val || val === '—') return null;
  const c = { up:'#86efac', down:'#fca5a5', neutral:'#9ca3af' }[trend];
  const I = { up: TrendingUp, down: TrendingDown, neutral: Minus }[trend];
  return (
    <span style={{ display:'flex', alignItems:'center', gap:3, color:c, fontWeight:700, fontSize:'0.82rem' }}>
      <I size={11}/>{val}
    </span>
  );
}

/* ─── Modal ──────────────────────────────────────────────────────── */
function Modal({ exp, onClose }) {
  const tag  = TAG[exp.tagColor] || TAG.gray;
  const Icon = exp.icon;

  return (
    <div
      onClick={onClose}
      style={{
        position:'fixed', inset:0, zIndex:999,
        background:'rgba(0,0,0,0.8)', backdropFilter:'blur(8px)',
        display:'flex', alignItems:'center', justifyContent:'center',
        padding:'1rem',
      }}
    >
      <motion.div
        initial={{ opacity:0, y:28, scale:0.96 }}
        animate={{ opacity:1, y:0, scale:1 }}
        exit={{ opacity:0, y:28, scale:0.96 }}
        transition={{ type:'spring', stiffness:300, damping:26 }}
        onClick={e => e.stopPropagation()}
        style={{
          width:'100%', maxWidth:1280, maxHeight:'88vh', overflowY:'auto',
          background:'#141414',
          border:`1px solid ${BORDER[exp.outcome]}`,
          borderRadius:20,
          padding:'2rem 2.25rem',
          boxShadow:`0 32px 80px rgba(0,0,0,0.7)`,
          position:'relative',
        }}
      >
        {/* Close */}
        <button onClick={onClose} style={{
          position:'absolute', top:16, right:16,
          background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)',
          borderRadius:8, padding:'5px 7px', cursor:'pointer', color:'#9ca3af',
          display:'flex', alignItems:'center', lineHeight:0,
        }}>
          <X size={16}/>
        </button>

        {/* Header */}
        <div style={{ display:'flex', gap:'1rem', alignItems:'flex-start', marginBottom:'1.5rem' }}>
          <div style={{
            flexShrink:0, width:48, height:48, borderRadius:12,
            background:'linear-gradient(135deg,#6366f1,#8b5cf6)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <Icon size={22} color="white"/>
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:'flex', gap:'0.5rem', alignItems:'center', marginBottom:'0.35rem', flexWrap:'wrap' }}>
              <code style={{ fontSize:'0.7rem', fontWeight:700, color:'#6366f1', letterSpacing:'0.1em' }}>EXP {exp.number}</code>
              <span style={{
                fontSize:'0.68rem', fontWeight:600, padding:'2px 10px', borderRadius:99,
                background:tag.bg, border:`1px solid ${tag.border}`, color:tag.text,
              }}>{exp.tag}</span>
            </div>
            <h2 style={{ fontSize:'1.2rem', fontWeight:700, color:'#f9fafb', lineHeight:1.3, margin:0 }}>{exp.name}</h2>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(118px,1fr))', gap:'0.6rem', marginBottom:'1.5rem' }}>
          {[
            { label:'Dataset',    val: exp.dataset },
            { label:'Parameters', val: exp.params || '—' },
            { label:'Epochs',     val: exp.epochs ? String(exp.epochs) : '—' },
            { label:'Best Val',   val: exp.valAcc, accent:true },
            exp.trainAcc ? { label:'Train Acc', val: exp.trainAcc } : null,
          ].filter(Boolean).map((s,i) => (
            <div key={i} style={{
              background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)',
              borderRadius:10, padding:'0.55rem 0.85rem',
            }}>
              <div style={{ fontSize:'0.62rem', color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:3 }}>{s.label}</div>
              <div style={{ fontSize:'0.95rem', fontWeight:700, color: s.accent ? '#a5b4fc' : '#e5e7eb' }}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* Body sections */}
        {[
          { title:'Overview',     color:'#6366f1', text: exp.description, mono:false },
          { title:'Pipeline',     color:'#8b5cf6', text: exp.pipeline,    mono:true  },
          { title:'Key Findings', color:'#a78bfa', text: exp.findings,    mono:false },
        ].map((s,i) => (
          <div key={i} style={{ marginBottom:'1.1rem' }}>
            <div style={{ fontSize:'0.68rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.09em', color:s.color, marginBottom:'0.35rem' }}>{s.title}</div>
            {s.mono
              ? <div style={{
                  background:'rgba(0,0,0,0.35)', border:'1px solid rgba(255,255,255,0.07)',
                  borderRadius:8, padding:'0.7rem 1rem',
                  fontFamily:'monospace', fontSize:'0.78rem', color:'#c4b5fd', lineHeight:1.7,
                }}>{s.text}</div>
              : <p style={{ color:'#d1d5db', lineHeight:1.75, fontSize:'0.91rem', margin:0 }}>{s.text}</p>
            }
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Timeline card ──────────────────────────────────────────────── */
function ExpCard({ exp, onClick }) {
  const tag  = TAG[exp.tagColor] || TAG.gray;
  const [hov, setHov] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        all:'unset', display:'block', width:'100%', cursor:'pointer', textAlign:'left',
      }}
    >
      <div style={{
        background: hov ? '#1a1a2e' : '#111111',
        border:`1px solid ${hov ? '#6366f1' : BORDER[exp.outcome]}`,
        borderRadius:14, padding:'1rem 1.1rem',
        boxShadow: hov ? '0 0 28px rgba(99,102,241,0.18)' : 'none',
        transition:'background 0.2s, border-color 0.2s, box-shadow 0.2s',
        position:'relative', overflow:'hidden',
      }}>
        {/* gradient overlay */}
        <div style={{
          position:'absolute', inset:0, borderRadius:14, pointerEvents:'none',
          background: CARD_BG[exp.outcome],
        }}/>

        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:'0.4rem', flexWrap:'wrap' }}>
            <code style={{ fontSize:'0.63rem', fontWeight:800, color:'#6366f1', letterSpacing:'0.1em' }}>EXP {exp.number}</code>
            <span style={{
              fontSize:'0.6rem', fontWeight:600, padding:'1px 8px', borderRadius:99,
              background:tag.bg, border:`1px solid ${tag.border}`, color:tag.text,
            }}>{exp.tag}</span>
          </div>

          <div style={{ fontSize:'0.85rem', fontWeight:700, color:'#f3f4f6', lineHeight:1.35, marginBottom:'0.5rem' }}>
            {exp.name}
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:'0.55rem', flexWrap:'wrap' }}>
            <span style={{ fontSize:'0.68rem', color:'#6b7280', background:'rgba(255,255,255,0.05)', padding:'2px 7px', borderRadius:5 }}>
              {exp.dataset}
            </span>
            <Trend trend={exp.trend} val={exp.valAcc}/>
            {exp.params && exp.params !== '—' && (
              <span style={{ fontSize:'0.65rem', color:'#4b5563' }}>{exp.params}</span>
            )}
          </div>
        </div>

        <div style={{
          position:'absolute', right:10, top:'50%', transform:'translateY(-50%)',
          color:'#6366f1', opacity: hov ? 0.7 : 0.2, transition:'opacity 0.2s',
        }}>
          <ChevronRight size={17}/>
        </div>
      </div>
    </button>
  );
}

/* ─── Page ───────────────────────────────────────────────────────── */
export default function Experiments() {
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ minHeight:'100vh', background:'#0a0a0a', color:'white' }}>

      {/* HEADER */}
      <section style={{ paddingTop:112, paddingBottom:56, paddingInline:24, borderBottom:'1px solid #1f1f1f' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>


          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}>
            <div style={{
              display:'inline-flex', alignItems:'center', gap:8,
              padding:'5px 14px', borderRadius:99,
              background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.25)',
              marginBottom:18,
            }}>
              <FlaskConical size={13} color="#818cf8"/>
              <span style={{ fontSize:'0.8rem', fontWeight:600, color:'#a5b4fc' }}>Experimental Journey</span>
            </div>

            <h1 style={{
              fontSize:'clamp(1.9rem,5vw,3.25rem)', fontWeight:800, lineHeight:1.15,
              marginBottom:14, letterSpacing:'-0.02em',
            }}>
              Experiments{' '}
              <span style={{
                background:'linear-gradient(to right,#6366f1,#8b5cf6)',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
              }}>& Results</span>
            </h1>

            <p style={{ fontSize:'1rem', color:'#9ca3af', maxWidth:580, lineHeight:1.75, marginBottom:28 }}>
              A systematic ablation study spanning LRW-100 and LRW-500. Click any experiment card
              to explore the full pipeline, findings, and metrics.
            </p>
          </motion.div>
        </div>
      </section>

      {/* LEGEND */}
      <div style={{ maxWidth:860, margin:'0 auto', padding:'1.25rem 1.5rem 0' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'1.1rem', flexWrap:'wrap' }}>
          <span style={{ fontSize:'0.68rem', color:'#4b5563', textTransform:'uppercase', letterSpacing:'0.08em', fontWeight:600 }}>Legend</span>
          {[
            { c:BORDER.positive, l:'Positive result' },
            { c:BORDER.negative, l:'Regression / failed' },
            { c:BORDER.neutral,  l:'Neutral / analysis' },
          ].map((x,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:5 }}>
              <div style={{ width:10, height:10, borderRadius:3, border:`2px solid ${x.c}`, flexShrink:0 }}/>
              <span style={{ fontSize:'0.73rem', color:'#9ca3af' }}>{x.l}</span>
            </div>
          ))}
          <div style={{ marginLeft:'auto', display:'flex', gap:'0.9rem', flexWrap:'wrap' }}>
            {[
              { I:<TrendingUp  size={11} style={{color:'#86efac'}}/>, l:'Improved' },
              { I:<TrendingDown size={11} style={{color:'#fca5a5'}}/>, l:'Dropped'  },
              { I:<Minus       size={11} style={{color:'#6b7280'}}/>, l:'Neutral'  },
            ].map((x,i) => (
              <span key={i} style={{ display:'flex', alignItems:'center', gap:4, fontSize:'0.73rem', color:'#9ca3af' }}>
                {x.I}{x.l}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* TIMELINE */}
      <section style={{ padding:'3.5rem 1.5rem 6rem' }}>
        <div style={{ maxWidth:860, margin:'0 auto', position:'relative' }}>

          {/* ── vertical line ── */}
          <div style={{
            position:'absolute', left:'50%', top:0, bottom:80, width:2,
            transform:'translateX(-50%)',
            background:'linear-gradient(to bottom,transparent 0%,#4f46e5 5%,#7c3aed 50%,#4f46e5 95%,transparent 100%)',
            borderRadius:99, zIndex:0,
          }}/>

          <div style={{ display:'flex', flexDirection:'column', gap:'1.75rem', position:'relative' }}>
            {experiments.map((exp, idx) => {
              const isLeft = idx % 2 === 0;
              return (
                <motion.div
                  key={exp.id}
                  initial={{ opacity:0 }}
                  whileInView={{ opacity:1 }}
                  viewport={{ once:true, margin:'-30px' }}
                  style={{
                    display:'grid',
                    gridTemplateColumns:'1fr 52px 1fr',
                    alignItems:'center',
                    position:'relative',
                    zIndex:1,
                  }}
                >
                  {/* Left column */}
                  <div style={{ paddingRight:20 }}>
                    {isLeft && (
                      <motion.div
                        initial={{ opacity:0, x:-24 }}
                        whileInView={{ opacity:1, x:0 }}
                        viewport={{ once:true }}
                        transition={{ duration:0.4, ease:'easeOut' }}
                      >
                        <ExpCard exp={exp} onClick={() => setSelected(exp)}/>
                      </motion.div>
                    )}
                  </div>

                  {/* Centre dot */}
                  <div style={{ display:'flex', justifyContent:'center', alignItems:'center' }}>
                    <motion.button
                      onClick={() => setSelected(exp)}
                      initial={{ scale:0 }}
                      whileInView={{ scale:1 }}
                      viewport={{ once:true }}
                      whileHover={{ scale:1.18 }}
                      transition={{ type:'spring', stiffness:320, damping:20 }}
                      style={{
                        all:'unset', cursor:'pointer',
                        width:38, height:38, borderRadius:'50%',
                        background:'linear-gradient(135deg,#6366f1,#8b5cf6)',
                        border:'3px solid #0a0a0a',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        boxShadow:'0 0 14px rgba(99,102,241,0.5)',
                        flexShrink:0, zIndex:2,
                      }}
                    >
                      <span style={{
                        fontSize:'0.55rem', fontWeight:800, color:'white',
                        fontFamily:'monospace', lineHeight:1, userSelect:'none',
                      }}>
                        {exp.number}
                      </span>
                    </motion.button>
                  </div>

                  {/* Right column */}
                  <div style={{ paddingLeft:20 }}>
                    {!isLeft && (
                      <motion.div
                        initial={{ opacity:0, x:24 }}
                        whileInView={{ opacity:1, x:0 }}
                        viewport={{ once:true }}
                        transition={{ duration:0.4, ease:'easeOut' }}
                      >
                        <ExpCard exp={exp} onClick={() => setSelected(exp)}/>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* End cap */}
          <motion.div
            initial={{ opacity:0, y:16 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            style={{ display:'flex', flexDirection:'column', alignItems:'center', marginTop:'2.5rem', gap:10 }}
          >
            <div style={{
              width:46, height:46, borderRadius:'50%',
              background:'linear-gradient(135deg,#6366f1,#8b5cf6)',
              display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:'0 0 26px rgba(99,102,241,0.55)',
            }}>
              <BarChart3 size={19} color="white"/>
            </div>
            <span style={{ fontSize:'0.78rem', color:'#6b7280', fontWeight:500 }}>Dual-Stream Fusion</span>
          </motion.div>
        </div>
      </section>

      {/* MODAL */}
      <AnimatePresence>
        {selected && <Modal exp={selected} onClose={() => setSelected(null)}/>}
      </AnimatePresence>
    </div>
  );
}
