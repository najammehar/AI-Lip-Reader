import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const Article = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', flexDirection: 'column' }}>

      <section style={{ flex: 1, paddingTop: 100, paddingInline: 24, paddingBottom: 40 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', height: '85vh' }}>
          <iframe
            src="/article.pdf"
            title="Research Article"
            style={{ width: '100%', height: '100%', border: 'none', borderRadius: 12 }}
          />
        </div>
      </section>
    </div>
  );
};

export default Article;