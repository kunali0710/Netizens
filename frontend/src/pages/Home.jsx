import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';

const features = [
  { icon: '🧠', title: 'AI-Powered Analysis', desc: 'Deep NLP model reads your resume like a senior recruiter — spotting gaps, patterns, and power words instantly.', color: '#8B5CF6' },
  { icon: '🎯', title: 'ATS Score', desc: 'See exactly how Applicant Tracking Systems rank your resume before it ever reaches a human.', color: '#06B6D4' },
  { icon: '⚡', title: 'Instant Results', desc: 'Upload and get a full multi-dimensional breakdown in under 10 seconds. No waiting, no signup needed.', color: '#F59E0B' },
  { icon: '💡', title: 'Smart Suggestions', desc: 'Role-specific keyword recommendations and rewrite suggestions that get you more callbacks.', color: '#EC4899' },
  { icon: '📊', title: 'Visual Dashboard', desc: 'Beautiful charts and scores that make your resume strength immediately clear and actionable.', color: '#10B981' },
  { icon: '🔒', title: 'Privacy First', desc: 'Your resume stays on your device. We never store, sell, or share your personal data.', color: '#A78BFA' },
];

const stats = [['50K+', 'Resumes Analyzed'], ['92%', 'Interview Rate'], ['4.9★', 'User Rating'], ['< 10s', 'Analysis Time']];

const testimonials = [
  { name: 'Priya S.', role: 'SWE @ Google', text: 'Got 3 callbacks in a week after using Netizens AI suggestions. Wild.', avatar: 'PS' },
  { name: 'Rahul M.', role: 'Product @ Flipkart', text: 'The ATS score feature alone is worth it. My resume was getting rejected by bots.', avatar: 'RM' },
  { name: 'Ananya K.', role: 'Designer @ Swiggy', text: 'Incredibly clean UI. Identified missing keywords I never would have thought of.', avatar: 'AK' },
];

function ParticleCanvas() {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    const particles = [];
    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.5 + 0.3,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.5 + 0.1,
        color: ['#8B5CF6','#06B6D4','#EC4899','#10B981'][Math.floor(Math.random()*4)],
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2,'0');
        ctx.fill();
      });
      particles.forEach((p, i) => {
        particles.slice(i+1).forEach(q => {
          const d = Math.hypot(p.x-q.x, p.y-q.y);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(139,92,246,${0.06 * (1 - d/100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none',
    }} />
  );
}

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)', overflowX: 'hidden' }}>

      {/* Hero */}
      <section style={{ position: 'relative', minHeight: '92vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div className="orb" style={{ width: '600px', height: '600px', background: 'rgba(139,92,246,0.18)', top: '-200px', left: '-200px' }} />
        <div className="orb" style={{ width: '500px', height: '500px', background: 'rgba(6,182,212,0.12)', bottom: '-150px', right: '-150px', animationDelay: '2s' }} />
        <div className="orb" style={{ width: '300px', height: '300px', background: 'rgba(236,72,153,0.1)', top: '40%', left: '60%', animationDelay: '4s' }} />
        <ParticleCanvas />

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 2rem', position: 'relative', zIndex: 2, width: '100%' }}>
          <div style={{ maxWidth: '780px', margin: '0 auto', textAlign: 'center' }}>

            <div className="animate-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '100px', padding: '6px 18px', fontSize: '13px', fontWeight: 600, color: '#A78BFA', marginBottom: '32px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', display: 'inline-block', animation: 'pulse-glow 2s infinite' }} />
              AI-Powered • Free • Instant Results
            </div>

            <h1 className="animate-up-2" style={{ fontSize: 'clamp(2.4rem, 6vw, 4.2rem)', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-2px', marginBottom: '24px' }}>
              Land Your Dream Job with{' '}
              <span className="glow-text">AI Resume</span>
              <br />Intelligence
            </h1>

            <p className="animate-up-3" style={{ fontSize: '1.15rem', color: 'var(--muted2)', maxWidth: '560px', margin: '0 auto 44px', lineHeight: 1.75 }}>
              Upload your resume and get an instant ATS score, keyword gap analysis,
              and tailored suggestions — all in under 10 seconds.
            </p>

            <div className="animate-up-4" style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '64px' }}>
              <button className="btn-primary" onClick={() => navigate('/upload')} style={{ fontSize: '16px', padding: '16px 36px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                ✦ Analyze My Resume
                <span style={{ fontSize: '18px' }}>→</span>
              </button>
              <button className="btn-ghost" onClick={() => navigate('/dashboard')}>
                View Sample Report
              </button>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.06)', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
              {stats.map(([num, label]) => (
                <div key={label} style={{ background: 'rgba(10,10,15,0.8)', padding: '24px 16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.7rem', fontWeight: 800, marginBottom: '4px' }} className="glow-text">{num}</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 500 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '100px 2rem', position: 'relative' }}>
        <div className="orb" style={{ width: '400px', height: '400px', background: 'rgba(6,182,212,0.08)', top: '0', left: '50%', transform: 'translateX(-50%)' }} />
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '16px' }}>
              Why <span className="glow-text">Netizens AI</span>?
            </h2>
            <p style={{ color: 'var(--muted2)', fontSize: '16px', maxWidth: '480px', margin: '0 auto' }}>
              Everything you need to stand out in the most competitive job markets.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {features.map((f, i) => (
              <div key={f.title} className="glass card-hover" style={{ borderRadius: '20px', padding: '32px', position: 'relative', overflow: 'hidden', animationDelay: `${i * 0.07}s` }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${f.color}, transparent)` }} />
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: `${f.color}18`, border: `1px solid ${f.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '18px' }}>
                  {f.icon}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '17px', marginBottom: '10px', color: '#fff' }}>{f.title}</h3>
                <p style={{ color: 'var(--muted2)', fontSize: '14px', lineHeight: 1.7 }}>{f.desc}</p>
                <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: `${f.color}08`, filter: 'blur(20px)' }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '80px 2rem', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '16px' }}>
            How it <span className="glow-text">works</span>
          </h2>
          <p style={{ color: 'var(--muted2)', marginBottom: '64px', fontSize: '16px' }}>Three steps. Ten seconds. Life-changing results.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '40px', left: '16%', right: '16%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.4), rgba(6,182,212,0.4), transparent)', zIndex: 0 }} />
            {[
              { n: '01', icon: '📤', title: 'Upload Resume', desc: 'Drop your PDF or Word file. Instant parsing.', color: '#8B5CF6' },
              { n: '02', icon: '🤖', title: 'AI Analyzes', desc: 'Our engine scans every word and structure.', color: '#06B6D4' },
              { n: '03', icon: '🏆', title: 'Get Results', desc: 'Review your score, gaps, and suggestions.', color: '#10B981' },
            ].map((s) => (
              <div key={s.n} className="glass card-hover" style={{ borderRadius: '20px', padding: '32px 24px', zIndex: 1 }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: `${s.color}18`, border: `2px solid ${s.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '26px', boxShadow: `0 0 24px ${s.color}30` }}>
                  {s.icon}
                </div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: s.color, letterSpacing: '2px', marginBottom: '10px' }}>{s.n}</div>
                <h3 style={{ fontWeight: 700, fontSize: '16px', marginBottom: '8px' }}>{s.title}</h3>
                <p style={{ color: 'var(--muted2)', fontSize: '13.5px', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '100px 2rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '56px' }}>
            Loved by <span className="glow-text">job seekers</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {testimonials.map((t) => (
              <div key={t.name} className="glass card-hover" style={{ borderRadius: '20px', padding: '28px' }}>
                <div style={{ display: 'flex', marginBottom: '12px', gap: '2px' }}>
                  {[...Array(5)].map((_,i) => <span key={i} style={{ color: '#F59E0B', fontSize: '14px' }}>★</span>)}
                </div>
                <p style={{ color: 'var(--muted2)', fontSize: '14.5px', lineHeight: 1.7, marginBottom: '20px', fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>{t.avatar}</div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '14px' }}>{t.name}</p>
                    <p style={{ fontSize: '12px', color: 'var(--muted)' }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '0 2rem 100px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(6,182,212,0.1))', border: '1px solid rgba(139,92,246,0.25)', borderRadius: '28px', padding: '72px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div className="orb" style={{ width: '300px', height: '300px', background: 'rgba(139,92,246,0.2)', top: '-100px', left: '-100px' }} />
          <div className="orb" style={{ width: '250px', height: '250px', background: 'rgba(6,182,212,0.15)', bottom: '-80px', right: '-80px', animationDelay: '3s' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', animation: 'float 4s ease-in-out infinite' }}>🚀</div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 800, letterSpacing: '-0.8px', marginBottom: '16px' }}>
              Ready to <span className="glow-text">supercharge</span> your resume?
            </h2>
            <p style={{ color: 'var(--muted2)', marginBottom: '36px', fontSize: '16px', maxWidth: '460px', margin: '0 auto 36px' }}>
              Join 50,000+ job seekers who landed interviews faster with Netizens AI.
            </p>
            <button className="btn-primary" onClick={() => navigate('/upload')} style={{ fontSize: '16px', padding: '16px 40px', borderRadius: '14px' }}>
              Get Started — It's Free ✦
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;