import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function NotFound() {
  const navigate = useNavigate();
  const [count, setCount] = useState(5);

  useEffect(() => {
    const t = setInterval(() => setCount(c => { if (c <= 1) { clearInterval(t); navigate('/'); } return c - 1; }), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
      <div className="orb" style={{ width: '400px', height: '400px', background: 'rgba(139,92,246,0.1)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '80px', marginBottom: '8px', animation: 'float 3s ease-in-out infinite' }}>🌌</div>
        <h1 className="glow-text" style={{ fontSize: '6rem', fontWeight: 900, letterSpacing: '-4px', lineHeight: 1 }}>404</h1>
        <p style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '8px', marginBottom: '12px' }}>Page not found</p>
        <p style={{ color: 'var(--muted2)', marginBottom: '36px', fontSize: '15px' }}>Redirecting home in <strong style={{ color: '#A78BFA' }}>{count}s</strong>...</p>
        <button className="btn-primary" onClick={() => navigate('/')} style={{ fontSize: '15px', padding: '14px 32px', borderRadius: '12px' }}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

export default NotFound;