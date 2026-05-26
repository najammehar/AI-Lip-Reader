import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { path: '/', label: 'Home' },
    { path: '/demo', label: 'Demo' },
    { path: '/experiments', label: 'Experiments' },
    { path: '/article', label: 'Article' },
    { path: '/presentation', label: 'Slides' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: scrolled ? '#e8e8e8' : 'transparent',
        borderBottom: scrolled ? '1px solid #cccccc' : '1px solid transparent',
        transition: 'background-color 0.3s ease, border-color 0.3s ease',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0.875rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '2.5px',
              width: '30px',
              height: '30px',
              padding: '4px',
            }}>
              {[0,1,2,3,4,5,6,7,8].map((i) => (
                <div key={i} style={{
                  backgroundColor: i === 0 || i === 3 || i === 6 ? '#f97316' : '#1a1a1a',
                  borderRadius: '1.5px',
                }} />
              ))}
            </div>
            <span style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1a1a1a', letterSpacing: '-0.02em' }}>
              Lip<span style={{ color: '#f97316' }}>Reader</span>
            </span>
          </Link>

          {/* Desktop Navigation — pill container */}
          <nav className="hidden md:flex" style={{
            alignItems: 'center',
            gap: '0.125rem',
            backgroundColor: scrolled ? '#d4d4d4' : 'rgba(0,0,0,0.06)',
            borderRadius: '10px',
            padding: '0.3rem',
            transition: 'background-color 0.3s ease',
          }}>
            {links.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '7px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  textDecoration: 'none',
                  transition: 'all 0.15s',
                  color: isActive(path) ? '#1a1a1a' : '#666666',
                  backgroundColor: isActive(path) ? '#f5f5f5' : 'transparent',
                  boxShadow: isActive(path) ? '0 1px 4px rgba(0,0,0,0.12)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive(path)) {
                    e.currentTarget.style.color = '#1a1a1a';
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.45)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(path)) {
                    e.currentTarget.style.color = '#666666';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right — CTA button */}
          <div className="hidden md:flex" style={{ alignItems: 'center' }}>
            <Link to="/demo" style={{ textDecoration: 'none' }}>
              <button
                style={{
                  padding: '0.55rem 1.375rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#ffffff',
                  backgroundColor: '#1a1a1a',
                  border: 'none',
                  cursor: 'pointer',
                  letterSpacing: '0.01em',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#333333')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1a1a1a')}
              >
                Try Demo
              </button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden"
            style={{ padding: '0.5rem', color: '#1a1a1a', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden"
              style={{ overflow: 'hidden', marginTop: '0.75rem' }}
            >
              {links.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: 'block',
                    padding: '0.75rem 1rem',
                    marginBottom: '0.25rem',
                    borderRadius: '8px',
                    fontSize: '0.9375rem',
                    fontWeight: '500',
                    textDecoration: 'none',
                    color: isActive(path) ? '#1a1a1a' : '#666666',
                    backgroundColor: isActive(path) ? 'rgba(255,255,255,0.6)' : 'transparent',
                  }}
                >
                  {label}
                </Link>
              ))}
              <Link to="/demo" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none' }}>
                <button style={{
                  width: '100%',
                  marginTop: '0.5rem',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  fontSize: '0.9375rem',
                  fontWeight: '600',
                  color: '#ffffff',
                  backgroundColor: '#1a1a1a',
                  border: 'none',
                  cursor: 'pointer',
                }}>
                  Try Demo
                </button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;
