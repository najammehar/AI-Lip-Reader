import { motion } from 'framer-motion';

const Article = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#e8e8e8', color: '#1a1a1a', position: 'relative' }}>
      {/* Grid background */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'linear-gradient(#cccccc 1px, transparent 1px), linear-gradient(90deg, #cccccc 1px, transparent 1px)',
        backgroundSize: '60px 60px', opacity: 0.25,
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto', padding: '7rem 1.5rem 4rem' }}>
        {/* Page header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: '2.5rem' }}>
          <span style={{
            fontSize: '0.6875rem', fontFamily: 'monospace', color: '#888888',
            textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: '0.75rem',
          }}>
            [research] — published article
          </span>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '900',
            letterSpacing: '-0.04em', textTransform: 'uppercase',
            color: '#1a1a1a', marginBottom: 0, lineHeight: 0.95,
          }}>
            RESEARCH<span style={{ color: '#f97316' }}>.</span>
          </h1>
          <p style={{ fontSize: '0.9375rem', color: '#888888', marginTop: '0.75rem', fontWeight: 400 }}>
            LipReader.AI — Dual-Stream Visual Speech Recognition
          </p>
        </motion.div>

        {/* PDF viewer */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
          style={{
            backgroundColor: '#f0f0f0', border: '1px solid #cccccc',
            borderRadius: '20px', overflow: 'hidden', height: '80vh',
          }}
        >
          <iframe
            src="/article.pdf"
            title="Research Article"
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Article;