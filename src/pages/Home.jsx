import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Video, Zap, Globe, Play, BookOpen, CheckCircle2, Eye, ChevronDown } from 'lucide-react';

const predictions = [
  { word: 'ABOUT',    pct: 94, color: '#f97316' },
  { word: 'ACTION',   pct: 78, color: '#fb923c' },
  { word: 'ALREADY',  pct: 61, color: '#fdba74' },
  { word: 'ALWAYS',   pct: 42, color: '#d1d5db' },
  { word: 'ANOTHER',  pct: 29, color: '#d1d5db' },
];

const landmarks = [
  { x: 47, y: 62 }, { x: 50, y: 61 }, { x: 53, y: 62 },
  { x: 44, y: 65 }, { x: 50, y: 64 }, { x: 56, y: 65 },
  { x: 42, y: 68 }, { x: 47, y: 67 }, { x: 50, y: 68 }, { x: 53, y: 67 }, { x: 58, y: 68 },
  { x: 43, y: 71 }, { x: 50, y: 72 }, { x: 57, y: 71 },
  { x: 45, y: 74 }, { x: 50, y: 75 }, { x: 55, y: 74 },
  { x: 42, y: 78 }, { x: 47, y: 80 }, { x: 50, y: 81 }, { x: 53, y: 80 }, { x: 58, y: 78 },
];

const MockPrediction = () => (
  <div style={{
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid #cccccc',
    backgroundColor: '#f0f0f0',
    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
  }}>
    {/* header bar */}
    <div style={{
      display: 'flex', alignItems: 'center', gap: '8px',
      padding: '12px 20px',
      borderBottom: '1px solid #cccccc',
      backgroundColor: '#e8e8e8',
    }}>
      <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'rgba(239,68,68,0.6)' }} />
      <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'rgba(234,179,8,0.6)' }} />
      <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'rgba(34,197,94,0.6)' }} />
      <span style={{ marginLeft: '12px', fontSize: '11px', color: '#888888', fontFamily: 'monospace' }}>LipReader — inference output</span>
    </div>

    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* landmark face preview */}
      <div style={{
        position: 'relative', width: '100%', height: '140px',
        borderRadius: '12px', backgroundColor: '#e8e8e8',
        border: '1px solid #cccccc', overflow: 'hidden',
      }}>
        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
          <ellipse cx="50" cy="50" rx="22" ry="28" fill="none" stroke="#00000010" strokeWidth="0.8" />
          <ellipse cx="43" cy="42" rx="4" ry="2.5" fill="none" stroke="#f9731640" strokeWidth="0.6" />
          <ellipse cx="57" cy="42" rx="4" ry="2.5" fill="none" stroke="#f9731640" strokeWidth="0.6" />
          {landmarks.map((pt, i) => (
            <motion.circle
              key={i} cx={pt.x} cy={pt.y} r="1.2" fill="#f97316"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + i * 0.04, type: 'spring', stiffness: 300, damping: 18 }}
            />
          ))}
          <motion.path
            d="M42,68 Q50,64 58,68 Q54,74 50,75 Q46,74 42,68Z"
            fill="none" stroke="#f9731660" strokeWidth="0.7"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
            viewport={{ once: true }} transition={{ delay: 1.2, duration: 0.6 }}
          />
        </svg>
        <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '6px' }}>
          <span style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(249,115,22,0.15)', color: '#c2410c', fontFamily: 'monospace', border: '1px solid rgba(249,115,22,0.2)' }}>appearance</span>
          <span style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(249,115,22,0.08)', color: '#c2410c', fontFamily: 'monospace', border: '1px solid rgba(249,115,22,0.15)' }}>landmarks</span>
        </div>
      </div>

      {/* top-5 predictions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {predictions.map((p, i) => (
          <motion.div
            key={p.word}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 + i * 0.08 }}
            style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
          >
            <span style={{ width: '16px', textAlign: 'right', fontSize: '11px', fontFamily: 'monospace', color: i === 0 ? '#f97316' : '#aaaaaa' }}>{i + 1}</span>
            <div style={{ flex: 1, position: 'relative', height: '28px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#e0e0e0', border: '1px solid #cccccc' }}>
              <motion.div
                style={{ position: 'absolute', left: 0, top: 0, height: '100%', backgroundColor: p.color, opacity: i === 0 ? 0.4 : 0.2 }}
                initial={{ width: 0 }}
                whileInView={{ width: `${p.pct}%` }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.7, ease: 'easeOut' }}
              />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px' }}>
                <span style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.05em', fontFamily: 'monospace', color: i === 0 ? '#1a1a1a' : '#666666' }}>{p.word}</span>
                <span style={{ fontSize: '11px', fontFamily: 'monospace', color: i === 0 ? '#f97316' : '#aaaaaa' }}>{p.pct}%</span>
              </div>
            </div>
            {i === 0 ? <CheckCircle2 size={13} style={{ color: '#f97316', flexShrink: 0 }} /> : <div style={{ width: '13px' }} />}
          </motion.div>
        ))}
      </div>

      {/* footer stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px', borderTop: '1px solid #cccccc' }}>
        <span style={{ fontSize: '10px', color: '#aaaaaa', fontFamily: 'monospace' }}>streams fused · top-500</span>
        <div style={{ display: 'flex', gap: '12px' }}>
          <span style={{ fontSize: '10px', color: '#888888', fontFamily: 'monospace' }}>29 frames</span>
          <span style={{ fontSize: '10px', color: '#f97316', fontFamily: 'monospace' }}>112 ms</span>
        </div>
      </div>
    </div>
  </div>
);

const Home = () => {
  const features = [
    {
      icon: Video,
      title: 'Read Lips, Not Audio',
      description: 'Upload any short video of someone speaking and the system figures out the word — purely from the movement of their lips.',
      accent: '#f97316',
    },
    {
      icon: Eye,
      title: 'Two Eyes Are Better Than One',
      description: 'The system looks at the scene from two angles at once — texture and shape — then combines what it sees for a more confident answer.',
      accent: '#ea580c',
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Predictions come back in milliseconds. No waiting, no buffering — just a ranked list of the most likely words the speaker said.',
      accent: '#c2410c',
    },
    {
      icon: Globe,
      title: 'Built to Generalise',
      description: 'Trained and tested across hundreds of real-world words and speakers, so it holds up beyond the lab.',
      accent: '#9a3412',
    },
  ];

  const stats = [
    { value: '500', label: 'Words Recognized', icon: Video },
    { value: '19+', label: 'Experiments Run', icon: Zap },
    { value: '100%', label: 'Audio-Free', icon: Globe },
  ];

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const useCases = [
    {
      title: 'Surveillance & Security',
      description: 'Security cameras capture everything — including conversations. LipReader can help make sense of what was said in footage where audio was never recorded.',
      image: '📷',
    },
    {
      title: 'Recovering Corrupted Audio',
      description: 'Old recordings, damaged files, interference-heavy footage — when the audio is gone or unusable, the video still holds the answer.',
      image: '🎬',
    },
    {
      title: 'Robots in Noisy Environments',
      description: 'Factory floors, construction sites, loud public spaces — robots can read your lips to understand commands when a microphone would be useless.',
      image: '🤖',
    },
    {
      title: 'Silent Communication',
      description: "Mouth a word, get a response. No wake word, no speaking aloud — ideal for situations where silence matters or audio hardware isn't available.",
      image: '🤫',
    },
  ];

  return (
    <div style={{ backgroundColor: '#e8e8e8', minHeight: '100vh', color: '#1a1a1a' }}>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>

        {/* Subtle grid pattern */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(#cccccc 1px, transparent 1px), linear-gradient(90deg, #cccccc 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          opacity: 0.3,
        }} />

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: isMobile ? '7rem 1.5rem 5rem' : '0 1.5rem', minHeight: '100vh', height: isMobile ? 'auto' : '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 1 }}>

          {/* Slide counter */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ fontSize: '0.8125rem', color: '#888888', letterSpacing: '0.05em', fontFamily: 'monospace', marginTop: '2rem', display: 'block' }}
          >
            [1/5]
          </motion.span>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '2.5rem' : '4rem', alignItems: 'center' }}>

            {/* Left column */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h1 style={{
                fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                fontWeight: '800',
                lineHeight: '1.0',
                letterSpacing: '-0.03em',
                color: '#1a1a1a',
                marginBottom: '1.5rem',
                textTransform: 'uppercase',
              }}>
                READING<br />
                LIPS<span style={{ color: '#f97316' }}>.</span><br />
                NOT<br />
                AUDIO<span style={{ color: '#f97316' }}>.</span>
              </h1>

              <p style={{ fontSize: '1.0625rem', color: '#555555', lineHeight: '1.65', maxWidth: '440px', marginBottom: '2.5rem' }}>
                An AI system that watches a video of someone speaking and tells you what word they said — no microphone, no audio, no guesswork.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/demo" style={{ textDecoration: 'none' }}>
                  <button
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      padding: '0.75rem 1.75rem',
                      borderRadius: '8px',
                      fontSize: '0.9375rem',
                      fontWeight: '600',
                      color: '#ffffff',
                      backgroundColor: '#f97316',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#ea580c')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f97316')}
                  >
                    <Play size={16} /> Try Live Demo
                  </button>
                </Link>
                <Link to="/article" style={{ textDecoration: 'none' }}>
                  <button
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      padding: '0.75rem 1.75rem',
                      borderRadius: '8px',
                      fontSize: '0.9375rem',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      backgroundColor: 'transparent',
                      border: '1.5px solid #aaaaaa',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s, color 0.2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#1a1a1a'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#aaaaaa'; }}
                  >
                    <BookOpen size={16} /> Read Article
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* Right column — Face landmark SVG illustration */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <div style={{
                borderRadius: '16px', overflow: 'hidden',
                border: '1px solid #cccccc', backgroundColor: '#f0f0f0',
                boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
              }}>
                {/* Window chrome */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '10px 16px', borderBottom: '1px solid #cccccc',
                  backgroundColor: '#e8e8e8',
                }}>
                  <div style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: 'rgba(239,68,68,0.55)' }} />
                  <div style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: 'rgba(234,179,8,0.55)' }} />
                  <div style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: 'rgba(34,197,94,0.55)' }} />
                  <span style={{ marginLeft: '8px', fontSize: '10px', color: '#888888', fontFamily: 'monospace' }}>lip_landmark_detector · live</span>
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                    <span style={{ fontSize: '9px', color: '#22c55e', fontFamily: 'monospace' }}>active</span>
                  </div>
                </div>

                {/* SVG illustration */}
                <svg viewBox="0 0 360 300" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block' }}>
                  <defs>
                    <pattern id="heroGrid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e4e4e4" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="360" height="300" fill="#f0f0f0" />
                  <rect width="360" height="300" fill="url(#heroGrid)" />

                  {/* ── HEAD OUTLINE ── */}
                  <ellipse cx="150" cy="148" rx="68" ry="88" fill="none" stroke="#cccccc" strokeWidth="1.2" />
                  {/* Neck */}
                  <path d="M132,232 L128,270 M168,232 L172,270" fill="none" stroke="#d8d8d8" strokeWidth="1" strokeLinecap="round" />

                  {/* ── FACE DETECTION BOX (outer, full face) ── */}
                  <motion.rect
                    x="78" y="56" width="148" height="190"
                    rx="3" fill="none" stroke="#cccccc" strokeWidth="0.7" strokeDasharray="5 4"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  />
                  <motion.text
                    x="82" y="70" fontSize="7" fill="#aaaaaa" fontFamily="monospace" letterSpacing="0.08em"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                  >FACE</motion.text>

                  {/* ── EYEBROWS ── */}
                  <path d="M106,104 Q120,96 136,100" fill="none" stroke="#aaaaaa" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M164,100 Q180,96 194,104" fill="none" stroke="#aaaaaa" strokeWidth="1.5" strokeLinecap="round" />

                  {/* ── EYES ── */}
                  <ellipse cx="120" cy="118" rx="15" ry="9" fill="none" stroke="#bbbbbb" strokeWidth="1" />
                  <circle cx="120" cy="118" r="5" fill="#cacaca" />
                  <circle cx="120" cy="118" r="2.5" fill="#888888" />
                  <circle cx="121.5" cy="116.5" r="1" fill="#f0f0f0" />

                  <ellipse cx="180" cy="118" rx="15" ry="9" fill="none" stroke="#bbbbbb" strokeWidth="1" />
                  <circle cx="180" cy="118" r="5" fill="#cacaca" />
                  <circle cx="180" cy="118" r="2.5" fill="#888888" />
                  <circle cx="181.5" cy="116.5" r="1" fill="#f0f0f0" />

                  {/* ── NOSE ── */}
                  <path d="M146,134 L142,160 Q150,167 158,160 L154,134" fill="none" stroke="#cacaca" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M138,162 Q143,166 148,164" fill="none" stroke="#c0c0c0" strokeWidth="0.8" strokeLinecap="round" />
                  <path d="M152,164 Q157,166 162,162" fill="none" stroke="#c0c0c0" strokeWidth="0.8" strokeLinecap="round" />

                  {/* ── MOUTH (subtle outline) ── */}
                  <path d="M120,198 C130,188 145,185 150,185 C155,185 170,188 180,198" fill="none" stroke="#c8c8c8" strokeWidth="0.8" />
                  <path d="M120,198 C127,212 143,220 150,221 C157,220 173,212 180,198" fill="none" stroke="#c8c8c8" strokeWidth="0.8" />

                  {/* ── LIP LANDMARK DOTS ── orange, the hero feature ── */}
                  {[
                    // outer upper lip (9 points)
                    [120,198],[127,191],[135,187],[143,184],[150,183],[157,184],[165,187],[173,191],[180,198],
                    // outer lower lip (7 points, corners shared)
                    [173,205],[165,212],[157,217],[150,219],[143,217],[135,212],[127,205],
                    // inner upper lip (5 points)
                    [128,199],[140,195],[150,195],[160,195],[172,199],
                    // inner lower lip (3 points)
                    [160,206],[150,209],[140,206],
                  ].map(([cx, cy], i) => (
                    <motion.circle
                      key={`lm-${i}`}
                      cx={cx} cy={cy} r="2.3" fill="#f97316"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.9 + i * 0.045, type: 'spring', stiffness: 300, damping: 18 }}
                    />
                  ))}

                  {/* ── LIP REGION BOUNDING BOX ── */}
                  <motion.rect
                    x="104" y="177" width="92" height="50"
                    fill="none" stroke="#f97316" strokeWidth="1.2" strokeDasharray="4 3"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 1.9, duration: 0.4 }}
                  />
                  {/* Corner L-marks */}
                  {[
                    [[104,185],[104,177],[112,177]],
                    [[188,177],[196,177],[196,185]],
                    [[104,219],[104,227],[112,227]],
                    [[188,227],[196,227],[196,219]],
                  ].map((pts, i) => (
                    <motion.polyline
                      key={`corner-${i}`}
                      points={pts.map(p => p.join(',')).join(' ')}
                      fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="square"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: 2.0 + i * 0.05 }}
                    />
                  ))}
                  <motion.text
                    x="108" y="175" fontSize="7.5" fill="#f97316" fontFamily="monospace" fontWeight="600" letterSpacing="0.07em"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1 }}
                  >LIP REGION</motion.text>

                  {/* ── SCAN LINE (animates inside mouth box) ── */}
                  <motion.rect
                    x="105" width="90" height="1.2" fill="#f97316" opacity="0.55"
                    initial={{ y: 177 }}
                    animate={{ y: [177, 226, 177] }}
                    transition={{ delay: 2.5, duration: 2.8, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.8 }}
                  />

                  {/* ── CONNECTION DASHES to output panel ── */}
                  <motion.path
                    d="M196,202 C226,202 226,182 252,182"
                    fill="none" stroke="#f97316" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.5"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ delay: 2.3, duration: 0.7 }}
                  />
                  <motion.circle cx="196" cy="202" r="2.5" fill="#f97316"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.3 }} />
                  <motion.circle cx="252" cy="182" r="2.5" fill="#f97316"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.9 }} />

                  {/* ── OUTPUT PANEL ── */}
                  <motion.rect
                    x="252" y="152" width="96" height="80" rx="8" fill="#1a1a1a"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 2.4, duration: 0.3 }}
                  />
                  <motion.text x="300" y="170" textAnchor="middle" fontSize="7" fill="#555555" fontFamily="monospace" letterSpacing="0.1em"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.6 }}
                  >TOP PREDICTION</motion.text>
                  <motion.text x="300" y="194" textAnchor="middle" fontSize="20" fontWeight="800" fill="#ffffff" fontFamily="monospace" letterSpacing="-0.02em"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.7 }}
                  >ABOUT</motion.text>
                  {/* Confidence bar track */}
                  <motion.rect x="264" y="204" width="72" height="5" rx="2.5" fill="#2e2e2e"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8 }} />
                  {/* Confidence bar fill */}
                  <motion.rect x="264" y="204" height="5" rx="2.5" fill="#f97316"
                    initial={{ width: 0, opacity: 0 }} animate={{ width: 68, opacity: 1 }}
                    transition={{ delay: 2.9, duration: 0.7, ease: 'easeOut' }} />
                  <motion.text x="264" y="220" fontSize="7.5" fill="#f97316" fontFamily="monospace" fontWeight="700"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.1 }}
                  >94.2%</motion.text>
                  <motion.text x="346" y="220" textAnchor="end" fontSize="7" fill="#555555" fontFamily="monospace"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.1 }}
                  >confidence</motion.text>

                  {/* ── BOTTOM STATUS BAR ── */}
                  <rect x="0" y="280" width="360" height="20" fill="#e8e8e8" />
                  <line x1="0" y1="280" x2="360" y2="280" stroke="#cccccc" strokeWidth="0.5" />
                  <text x="14" y="293" fontSize="7.5" fill="#888888" fontFamily="monospace">50 landmarks · 29 frames · dual-stream</text>
                  <circle cx="340" cy="290" r="3.5" fill="#f97316" opacity="0.85" />
                  <text x="334" y="293" textAnchor="end" fontSize="7.5" fill="#f97316" fontFamily="monospace">live</text>
                </svg>
              </div>
            </motion.div>
          </div>

          {/* Bottom strip */}
          <div style={{
            position: isMobile ? 'relative' : 'absolute',
            bottom: isMobile ? 'auto' : '2rem',
            left: isMobile ? 'auto' : '1.5rem',
            right: isMobile ? 'auto' : '1.5rem',
            marginTop: isMobile ? '2rem' : 0,
            pointerEvents: 'none',
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          }}>
            {/* Watermark */}
            <span style={{
              fontSize: 'clamp(3rem, 8vw, 7rem)',
              fontWeight: '900',
              color: 'rgba(0,0,0,0.04)',
              letterSpacing: '-0.04em',
              lineHeight: 1,
              textTransform: 'uppercase',
              userSelect: 'none',
              pointerEvents: 'none',
            }}>
              LIPREADER
            </span>
          </div>


        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#dcdcdc', borderTop: '1px solid #cccccc', borderBottom: '1px solid #cccccc', padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? '1.5rem' : '2rem' }}>
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                style={{ textAlign: 'center' }}
              >
                <stat.icon style={{ width: '28px', height: '28px', margin: '0 auto 0.75rem', color: '#f97316' }} />
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1a1a1a', letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '0.4rem' }}>{stat.value}</div>
                <div style={{ fontSize: '0.875rem', color: '#666666', fontWeight: '500' }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────── */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: '#e8e8e8' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginBottom: '4rem' }}
          >
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '800', color: '#1a1a1a', letterSpacing: '-0.03em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              How It Works
            </h2>
            <p style={{ fontSize: '1.125rem', color: '#666666', maxWidth: '480px', lineHeight: '1.6' }}>
              Four ideas that make silent lip reading fast, accurate, and practical.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                style={{
                  backgroundColor: '#f0f0f0',
                  border: '1px solid #cccccc',
                  borderRadius: '16px',
                  padding: '2rem',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}
              >
                <div style={{
                  width: '48px', height: '48px', borderRadius: '10px',
                  backgroundColor: `${feature.accent}18`,
                  border: `1px solid ${feature.accent}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '1.5rem',
                }}>
                  <feature.icon size={22} style={{ color: feature.accent }} />
                </div>
                <h3 style={{ fontSize: '1.0625rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>{feature.title}</h3>
                <p style={{ fontSize: '0.9rem', color: '#666666', lineHeight: '1.65' }}>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEMO PREVIEW ──────────────────────────────────────── */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: '#dcdcdc', borderTop: '1px solid #cccccc', borderBottom: '1px solid #cccccc' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '2.5rem' : '4rem', alignItems: 'center' }}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '800', color: '#1a1a1a', letterSpacing: '-0.03em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                Try It<br />Yourself
              </h2>
              <p style={{ fontSize: '1.0625rem', color: '#555555', lineHeight: '1.65', marginBottom: '2rem' }}>
                Upload a clip of someone speaking — and see the word prediction appear in real time.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
                {[
                  { label: 'Drop in a video', desc: "Any short clip where the speaker's face is visible and front-facing" },
                  { label: 'The system analyses the lips', desc: 'It watches every frame and picks up on the shape and movement of the mouth' },
                  { label: 'Get a ranked prediction', desc: 'See the top matches with confidence scores — the most likely word sits at the top' },
                ].map(({ label, desc }, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: '#f97316', fontFamily: 'monospace' }}>{i + 1}</span>
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: '#1a1a1a', marginBottom: '0.25rem' }}>{label}</div>
                      <div style={{ fontSize: '0.875rem', color: '#666666', lineHeight: '1.5' }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/demo" style={{ textDecoration: 'none' }}>
                <button
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.75rem 1.75rem', borderRadius: '8px',
                    fontSize: '0.9375rem', fontWeight: '600',
                    color: '#ffffff', backgroundColor: '#1a1a1a',
                    border: 'none', cursor: 'pointer', transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#333333')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1a1a1a')}
                >
                  Try Live Demo <ArrowRight size={16} />
                </button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <MockPrediction />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── USE CASES ─────────────────────────────────────────── */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: '#e8e8e8' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginBottom: '4rem' }}
          >
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '800', color: '#1a1a1a', letterSpacing: '-0.03em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Where It Makes<br />A Difference
            </h2>
            <p style={{ fontSize: '1.125rem', color: '#666666', maxWidth: '420px', lineHeight: '1.6' }}>
              Anywhere audio lets you down, lips still work.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                style={{
                  backgroundColor: '#f0f0f0',
                  border: '1px solid #cccccc',
                  borderRadius: '16px',
                  padding: '2rem',
                  transition: 'transform 0.2s',
                }}
                whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.08)' }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '1.25rem' }}>{useCase.image}</div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>{useCase.title}</h3>
                <p style={{ fontSize: '0.9rem', color: '#666666', lineHeight: '1.65' }}>{useCase.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: '#1a1a1a' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.03em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
              See It For<br />Yourself<span style={{ color: '#f97316' }}>.</span>
            </h2>
            <p style={{ fontSize: '1.125rem', color: '#888888', lineHeight: '1.65', marginBottom: '2.5rem', maxWidth: '500px', margin: '0 auto 2.5rem' }}>
              Try the live demo, or read the full article to see how far silent lip reading has come.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/demo" style={{ textDecoration: 'none' }}>
                <button
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.875rem 2rem', borderRadius: '8px',
                    fontSize: '0.9375rem', fontWeight: '600',
                    color: '#ffffff', backgroundColor: '#f97316',
                    border: 'none', cursor: 'pointer', transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#ea580c')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f97316')}
                >
                  <Play size={16} /> Try Demo Now
                </button>
              </Link>
              <Link to="/article" style={{ textDecoration: 'none' }}>
                <button
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.875rem 2rem', borderRadius: '8px',
                    fontSize: '0.9375rem', fontWeight: '600',
                    color: '#1a1a1a', backgroundColor: '#e8e8e8',
                    border: 'none', cursor: 'pointer', transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#e8e8e8')}
                >
                  <BookOpen size={16} /> Learn More
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
