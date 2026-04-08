import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DUMMY = {
  name: 'Sample Candidate', role: 'Software Developer', overall_score: 72,
  ats_score: 65, readability_score: 80, grade: 'B',
  skills_detected: ['JavaScript', 'React', 'CSS', 'Git', 'HTML5'],
  missing_keywords: ['Docker', 'AWS', 'TypeScript', 'CI/CD'],
  section_breakdown: [
    { label: 'Experience', score: 75 }, { label: 'Education', score: 80 },
    { label: 'Skills', score: 70 }, { label: 'Formatting', score: 65 },
    { label: 'Summary', score: 45 }, { label: 'Keywords', score: 60 },
  ],
  suggestions: [
    { type: 'error', text: 'Upload a real resume to get personalized AI analysis.' },
    { type: 'info', text: 'This is sample data. Go to Upload to analyze your actual resume.' },
    { type: 'success', text: 'The dashboard will display your real results after analysis.' },
  ],
};

const sg = {
  error:   { color: '#FCA5A5', bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.2)',   icon: '✕', label: 'Critical' },
  warning: { color: '#FCD34D', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.2)',  icon: '⚠', label: 'Warning' },
  success: { color: '#6EE7B7', bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.2)',  icon: '✓', label: 'Good' },
  info:    { color: '#93C5FD', bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.2)',  icon: 'ℹ', label: 'Tip' },
};

function AnimatedRing({ score, size = 120, stroke = 9, color, label, delay = 0 }) {
  const [current, setCurrent] = useState(0);
  const r = (size / 2) - stroke;
  const circ = 2 * Math.PI * r;

  useEffect(() => {
    const t = setTimeout(() => {
      let n = 0;
      const interval = setInterval(() => {
        n += 2;
        if (n >= score) { setCurrent(score); clearInterval(interval); }
        else setCurrent(n);
      }, 16);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(t);
  }, [score, delay]);

  const progress = (current / 100) * circ;
  const getColor = (s) => s >= 80 ? '#10B981' : s >= 60 ? '#F59E0B' : '#EF4444';
  const c = color || getColor(score);

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={c} strokeWidth={stroke}
            strokeDasharray={`${progress} ${circ}`} strokeLinecap="round"
            transform={`rotate(-90 ${size/2} ${size/2})`}
            style={{ filter: `drop-shadow(0 0 8px ${c}80)` }} />
          <text x={size/2} y={size/2+6} textAnchor="middle" fill={c}
            fontSize={size >= 120 ? '22' : '16'} fontWeight="800" fontFamily="Inter">{current}</text>
        </svg>
      </div>
      {label && <p style={{ fontSize: '12px', color: 'rgba(240,240,255,0.55)', marginTop: '10px', fontWeight: 500 }}>{label}</p>}
    </div>
  );
}

function BarChart({ items }) {
  const [go, setGo] = useState(false);
  useEffect(() => { const t = setTimeout(() => setGo(true), 300); return () => clearTimeout(t); }, []);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {items.map((item) => {
        const c = item.score >= 80 ? '#10B981' : item.score >= 60 ? '#F59E0B' : '#EF4444';
        return (
          <div key={item.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(240,240,255,0.55)' }}>{item.label}</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: c }}>{item.score}</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '99px', height: '7px', overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: '99px', background: `linear-gradient(90deg, ${c}80, ${c})`, width: go ? `${item.score}%` : '0%', transition: 'width 1s cubic-bezier(0.16,1,0.3,1)', boxShadow: `0 0 8px ${c}60` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [isReal, setIsReal] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('resumeResult');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setData(parsed);
        setIsReal(true);
      } catch {
        setData(DUMMY);
      }
    } else {
      setData(DUMMY);
    }
  }, []);

  if (!data) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '50%', border: '3px solid rgba(139,92,246,0.3)', borderTopColor: '#8B5CF6', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: 'rgba(240,240,255,0.45)' }}>Loading results...</p>
      </div>
    </div>
  );

  const gradeColors = { S: '#A78BFA', A: '#10B981', B: '#06B6D4', C: '#F59E0B', D: '#EF4444' };
  const gradeColor = gradeColors[data.grade] || '#A78BFA';
  const keywordMatchScore = Math.round((data.skills_detected.length / Math.max(data.skills_detected.length + data.missing_keywords.length, 1)) * 100);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
      <div className="orb" style={{ width: '500px', height: '500px', background: 'rgba(139,92,246,0.1)', top: '-200px', right: '-150px' }} />
      <div className="orb" style={{ width: '400px', height: '400px', background: 'rgba(6,182,212,0.08)', bottom: '0', left: '-100px', animationDelay: '3s' }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 2rem', position: 'relative', zIndex: 1 }}>

        {/* Banner if using real data */}
        {isReal && (
          <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '12px', padding: '12px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#6EE7B7', fontWeight: 500 }}>
            <span>✅</span> Real AI analysis complete — results below are specific to your resume
          </div>
        )}

        {/* Header */}
        <div className="animate-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 800, color: '#fff', boxShadow: '0 0 24px rgba(139,92,246,0.4)', flexShrink: 0 }}>
              {data.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '3px' }}>{data.name}</h1>
              <p style={{ color: 'rgba(240,240,255,0.45)', fontSize: '14px' }}>{data.role}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button className="btn-ghost" style={{ padding: '10px 20px', fontSize: '13px', borderRadius: '10px' }} onClick={() => window.print()}>📊 Export</button>
            <button className="btn-primary" onClick={() => { sessionStorage.removeItem('resumeResult'); navigate('/upload'); }} style={{ padding: '10px 20px', fontSize: '13px', borderRadius: '10px' }}>↑ New Analysis</button>
          </div>
        </div>

        {/* Score Grid */}
        <div className="animate-up-2" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '20px', marginBottom: '20px' }}>
          <div className="glass-strong" style={{ borderRadius: '24px', padding: '36px 40px', textAlign: 'center', minWidth: '200px', border: '1px solid rgba(139,92,246,0.2)', background: 'rgba(139,92,246,0.05)' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', color: 'rgba(240,240,255,0.4)', marginBottom: '16px', textTransform: 'uppercase' }}>Overall Score</p>
            <AnimatedRing score={data.overall_score} size={130} stroke={10} color="#8B5CF6" delay={100} />
            <div style={{ marginTop: '12px' }}>
              <span style={{ fontSize: '3rem', fontWeight: 900, color: gradeColor, lineHeight: 1 }}>{data.grade}</span>
              <p style={{ fontSize: '12px', color: 'rgba(240,240,255,0.4)', marginTop: '4px' }}>Grade</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '20px' }}>
            <div className="glass" style={{ borderRadius: '20px', padding: '24px', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
              <AnimatedRing score={data.ats_score} size={90} label="ATS Score" delay={300} />
              <AnimatedRing score={data.readability_score} size={90} label="Readability" delay={500} />
              <AnimatedRing score={keywordMatchScore} size={90} label="Keyword Match" delay={700} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {[
                { icon: '✅', label: 'Skills Found', val: data.skills_detected.length, color: '#10B981' },
                { icon: '🔍', label: 'Missing Keys', val: data.missing_keywords.length, color: '#F59E0B' },
                { icon: '💡', label: 'Suggestions', val: data.suggestions.length, color: '#8B5CF6' },
              ].map(m => (
                <div key={m.label} className="glass" style={{ borderRadius: '16px', padding: '18px', textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', marginBottom: '6px' }}>{m.icon}</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: m.color, lineHeight: 1 }}>{m.val}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(240,240,255,0.4)', marginTop: '4px', fontWeight: 500 }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Breakdown + Skills */}
        <div className="animate-up-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '20px' }}>
          <div className="glass" style={{ borderRadius: '20px', padding: '28px' }}>
            <h3 style={{ fontWeight: 700, fontSize: '15px', marginBottom: '22px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(139,92,246,0.15)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>📊</span>
              Section Breakdown
            </h3>
            <BarChart items={data.section_breakdown} />
          </div>

          <div className="glass" style={{ borderRadius: '20px', padding: '28px' }}>
            <h3 style={{ fontWeight: 700, fontSize: '15px', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(16,185,129,0.15)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>✅</span>
              Skills Detected
              <span style={{ marginLeft: 'auto', background: 'rgba(16,185,129,0.15)', color: '#6EE7B7', padding: '2px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: 700 }}>{data.skills_detected.length}</span>
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
              {data.skills_detected.map(s => (
                <span key={s} style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#6EE7B7', padding: '5px 14px', borderRadius: '99px', fontSize: '12.5px', fontWeight: 500 }}>{s}</span>
              ))}
            </div>
            <h3 style={{ fontWeight: 700, fontSize: '15px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(245,158,11,0.15)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>🔍</span>
              Missing Keywords
              <span style={{ marginLeft: 'auto', background: 'rgba(245,158,11,0.15)', color: '#FCD34D', padding: '2px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: 700 }}>{data.missing_keywords.length}</span>
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {data.missing_keywords.map(k => (
                <span key={k} style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#FCA5A5', padding: '5px 14px', borderRadius: '99px', fontSize: '12.5px', fontWeight: 500 }}>{k}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Suggestions */}
        <div className="animate-up-4 glass" style={{ borderRadius: '20px', padding: '28px' }}>
          <h3 style={{ fontWeight: 700, fontSize: '15px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(139,92,246,0.15)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>💡</span>
            AI Suggestions
            <span style={{ marginLeft: 'auto', background: 'rgba(139,92,246,0.15)', color: '#A78BFA', padding: '2px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: 700 }}>{data.suggestions.length} items</span>
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
            {data.suggestions.map((s, i) => {
              const c = sg[s.type] || sg.info;
              return (
                <div key={i} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: '14px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: c.border, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: c.color, flexShrink: 0 }}>{c.icon}</div>
                  <div>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: c.color, letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.8 }}>{c.label}</span>
                    <p style={{ fontSize: '13.5px', color: c.color, lineHeight: 1.6, marginTop: '3px' }}>{s.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;