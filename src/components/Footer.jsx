import { Link } from 'react-router-dom';
import { Github, Mail } from 'lucide-react';

const links = [
  { label: 'Home', path: '/' },
  { label: 'Demo', path: '/demo' },
  { label: 'Experiments', path: '/experiments' },
  { label: 'Article', path: '/article' },
  { label: 'Slides', path: '/presentation' },
];

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#dcdcdc', borderTop: '1px solid #cccccc' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1.5rem 2rem' }}>

        {/* Top row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '2rem', marginBottom: '2.5rem' }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2.5px', width: '28px', height: '28px', padding: '3.5px' }}>
                {[0,1,2,3,4,5,6,7,8].map((i) => (
                  <div key={i} style={{ backgroundColor: i === 0 || i === 3 || i === 6 ? '#f97316' : '#1a1a1a', borderRadius: '1.5px' }} />
                ))}
              </div>
              <span style={{ fontSize: '1rem', fontWeight: '700', color: '#1a1a1a', letterSpacing: '-0.02em' }}>
                Lip<span style={{ color: '#f97316' }}>Reader</span>
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#666666', maxWidth: '240px', lineHeight: '1.65', margin: 0 }}>
              Visual speech recognition research project. Understand speech without audio.
            </p>
          </div>

          {/* Nav links */}
          <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem 1.75rem' }}>
            {links.map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                style={{ fontSize: '0.875rem', color: '#555555', textDecoration: 'none', fontWeight: '500', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#1a1a1a')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#555555')}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Social links */}
          {/* <div style={{ display: 'flex', gap: '0.625rem' }}>
            {[
              { href: 'mailto:lipreader@project.ai', icon: <Mail size={15} />, label: 'Email' },
              { href: 'https://github.com', icon: <Github size={15} />, label: 'GitHub' },
            ].map(({ href, icon, label }) => (
              <a
                key={label}
                href={href}
                target={label === 'GitHub' ? '_blank' : undefined}
                rel="noopener noreferrer"
                aria-label={label}
                style={{
                  width: '36px', height: '36px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: '8px', backgroundColor: '#cccccc', color: '#555555',
                  transition: 'all 0.2s', textDecoration: 'none',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1a1a1a'; e.currentTarget.style.color = '#ffffff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#cccccc'; e.currentTarget.style.color = '#555555'; }}
              >
                {icon}
              </a>
            ))}
          </div> */}
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid #cccccc', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <p style={{ fontSize: '0.8125rem', color: '#888888', margin: 0 }}>
            © 2025 LipReader Research Project. All rights reserved.
          </p>
          <p style={{ fontSize: '0.8125rem', color: '#888888', margin: 0 }}>
            Built for research and education
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
