import { Github, Mail, Heart, Eye } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#0a0a0a' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1.5rem 2rem' }}>

        {/* Bottom Bar */}
        <div style={{ borderTop: '1px solid #1f1f1f', paddingTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9ca3af', fontSize: '0.9375rem' }}>
            <span>Built for research and education</span>
          </div>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
            © 2025 LipReader Research Project. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
