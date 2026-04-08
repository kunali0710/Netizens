import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

function Upload() {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef();
  const navigate = useNavigate();

  const allowed = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  const handleFile = (f) => {
    setError('');
    if (!f) return;
    if (!allowed.includes(f.type)) { setError('Only PDF or Word documents are supported.'); return; }
    if (f.size > 5 * 1024 * 1024) { setError('File size must be under 5MB.'); return; }
    setFile(f);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  const simulateProgress = async (targetPercent, durationMs) => {
    const steps = 12;
    const increment = (targetPercent - progress) / steps;
    const delay = durationMs / steps;
    for (let i = 0; i < steps; i++) {
      await new Promise(r => setTimeout(r, delay));
      setProgress(prev => Math.min(prev + increment, targetPercent));
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setProgress(0);
    setError('');

    const formData = new FormData();
    formData.append('resume', file);

    const progressPromise = (async () => {
      await simulateProgress(30, 600);
      await simulateProgress(60, 800);
      await simulateProgress(85, 1200);
    })();

    try {
      const res = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();

      console.log("API RESPONSE:", json);

      await progressPromise;

      if (!res.ok || !json.success) {
        setError(json.error || 'Analysis failed. Please try again.');
        setLoading(false);
        setProgress(0);
        return;
      }

      if (!json.data) {
        setError('No data received from server');
        setLoading(false);
        setProgress(0);
        return;
      }

      setProgress(100);
      await new Promise(r => setTimeout(r, 400));

      sessionStorage.setItem('resumeResult', JSON.stringify(json.data));
      navigate('/dashboard');

    } catch (err) {
      await progressPromise;
      console.error(err);
      setError('Cannot connect to server. Make sure the backend is running on port 5000.');
      setLoading(false);
      setProgress(0);
    }
  };

  const fmt = (b) => b < 1024 * 1024 ? `${(b / 1024).toFixed(1)} KB` : `${(b / (1024 * 1024)).toFixed(1)} MB`;

  const loadingSteps = [
    'Uploading resume...',
    'Parsing document structure...',
    'Extracting text and keywords...',
    'Running ATS simulation...',
    'Scoring sections with AI...',
    'Generating suggestions...',
    'Finalizing report...',
  ];
  const stepIdx = Math.min(Math.floor((progress / 100) * loadingSteps.length), loadingSteps.length - 1);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
      <div className="orb" style={{ width: '500px', height: '500px', background: 'rgba(139,92,246,0.12)', top: '-200px', right: '-150px' }} />
      <div className="orb" style={{ width: '400px', height: '400px', background: 'rgba(6,182,212,0.08)', bottom: '-100px', left: '-100px', animationDelay: '2s' }} />

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '64px 2rem', position: 'relative', zIndex: 1 }}>

        <div className="animate-up" style={{ textAlign: 'center', marginBottom: '52px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: '100px', padding: '5px 16px', fontSize: '12px', fontWeight: 600, color: '#A78BFA', marginBottom: '20px' }}>
            ✦ AI Analysis Engine Ready
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, letterSpacing: '-1.5px', marginBottom: '12px' }}>
            Upload Your <span className="glow-text">Resume</span>
          </h1>
          <p style={{ color: 'rgba(240,240,255,0.65)', fontSize: '15px' }}>Drop your file below and let our AI do the heavy lifting</p>
        </div>

        <div
          className="animate-up-2"
          onClick={() => !loading && fileInputRef.current.click()}
          onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}
          style={{
            border: `2px dashed ${dragging ? '#8B5CF6' : file ? '#10B981' : 'rgba(255,255,255,0.12)'}`,
            background: dragging ? 'rgba(139,92,246,0.08)' : file ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.02)',
            borderRadius: '24px', padding: '60px 32px', textAlign: 'center',
            cursor: loading ? 'default' : 'pointer',
            transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
            boxShadow: dragging ? '0 0 40px rgba(139,92,246,0.15)' : file ? '0 0 40px rgba(16,185,129,0.1)' : 'none',
          }}
        >
          <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />

          {loading ? (
            <div>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(139,92,246,0.15)', border: '3px solid rgba(139,92,246,0.3)', borderTopColor: '#8B5CF6', margin: '0 auto 20px', animation: 'spin 1s linear infinite' }} />
              <p style={{ fontWeight: 700, fontSize: '16px', marginBottom: '8px' }}>Analyzing your resume...</p>
              <p style={{ color: 'rgba(240,240,255,0.45)', fontSize: '13px', marginBottom: '24px', minHeight: '20px' }}>
                {loadingSteps[stepIdx]}
              </p>
              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '99px', height: '6px', overflow: 'hidden', maxWidth: '320px', margin: '0 auto' }}>
                <div style={{ height: '100%', borderRadius: '99px', background: 'linear-gradient(90deg, #8B5CF6, #06B6D4)', width: `${Math.round(progress)}%`, transition: 'width 0.4s ease', boxShadow: '0 0 12px rgba(139,92,246,0.6)' }} />
              </div>
              <p style={{ color: '#A78BFA', fontSize: '13px', marginTop: '10px', fontWeight: 600 }}>{Math.round(progress)}%</p>
            </div>
          ) : file ? (
            <div style={{ animation: 'bounce-in 0.5s cubic-bezier(0.16,1,0.3,1)' }}>
              <div style={{ fontSize: '52px', marginBottom: '12px' }}>✅</div>
              <p style={{ fontWeight: 700, fontSize: '16px', color: '#6EE7B7', marginBottom: '4px' }}>File ready!</p>
              <p style={{ color: 'rgba(240,240,255,0.45)', fontSize: '13px' }}>Click to change file</p>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '52px', marginBottom: '16px', animation: 'float 3s ease-in-out infinite' }}>📄</div>
              <p style={{ fontWeight: 700, fontSize: '17px', marginBottom: '8px' }}>Drag & drop your resume here</p>
              <p style={{ color: 'rgba(240,240,255,0.45)', fontSize: '14px', marginBottom: '20px' }}>or click to browse files</p>
              <span style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', padding: '5px 16px', borderRadius: '99px', fontSize: '12px', color: 'rgba(240,240,255,0.65)', fontWeight: 500 }}>
                PDF, DOC, DOCX • Max 5MB
              </span>
            </div>
          )}
        </div>

        {file && !loading && (
          <div className="glass" style={{ borderRadius: '16px', padding: '16px 20px', marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>📎</div>
              <div>
                <p style={{ fontWeight: 600, fontSize: '14px', marginBottom: '2px' }}>{file.name}</p>
                <p style={{ fontSize: '12px', color: 'rgba(240,240,255,0.45)' }}>{fmt(file.size)} • Ready to analyze</p>
              </div>
            </div>
            <button onClick={e => { e.stopPropagation(); setFile(null); }} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'rgba(240,240,255,0.65)', fontSize: '16px', padding: '6px 10px', cursor: 'pointer' }}>✕</button>
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '12px', padding: '12px 16px', marginTop: '14px', color: '#FCA5A5', fontSize: '13.5px', fontWeight: 500 }}>
            ⚠ {error}
          </div>
        )}

        {!loading && (
          <button
            className="btn-primary"
            onClick={handleAnalyze}
            disabled={!file}
            style={{ width: '100%', marginTop: '20px', padding: '16px', fontSize: '16px', borderRadius: '14px', opacity: file ? 1 : 0.4, cursor: file ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
          >
            🚀 Analyze Resume Now
          </button>
        )}

      </div>
    </div>
  );
}

export default Upload;