import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const links = [
    { path: '/', label: 'Home' },
    { path: '/demo', label: 'Demo' },
    { path: '/article', label: 'Article' },
  ];
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#1f1f1f]" style={{ backgroundColor: 'rgba(10, 10, 10, 0.8)', backdropFilter: 'blur(12px)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Eye size={22} color="white" />
            </div>
            <span style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              background: 'linear-gradient(to right, #6366f1, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>LipReader</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: '0.5rem' }}>
            {links.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                style={{
                  padding: '0.625rem 1.25rem',
                  borderRadius: '6px',
                  fontSize: '0.9375rem',
                  fontWeight: '500',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  color: isActive(path) ? '#6366f1' : '#9ca3af',
                  backgroundColor: isActive(path) ? 'rgba(99, 102, 241, 0.1)' : 'transparent'
                }}
                onMouseEnter={(e) => {
                  if (!isActive(path)) {
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(path)) {
                    e.currentTarget.style.color = '#9ca3af';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {label}
              </Link>
            ))}
          </div>          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden"
            style={{
              padding: '0.5rem',
              color: '#9ca3af',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
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
              style={{ overflow: 'hidden', marginTop: '1rem' }}
            >
              {links.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.875rem 1rem',
                    marginBottom: '0.25rem',
                    borderRadius: '6px',
                    fontSize: '0.9375rem',
                    fontWeight: '500',
                    textDecoration: 'none',
                    color: isActive(path) ? '#6366f1' : '#9ca3af',
                    backgroundColor: isActive(path) ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                    transition: 'all 0.2s'
                  }}
                >
                  {label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;
