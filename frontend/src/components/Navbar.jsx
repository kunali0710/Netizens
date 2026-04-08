import { NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  const navStyle = {
    position: 'sticky', top: 0, zIndex: 1000,
    background: scrolled ? 'rgba(10,10,15,0.85)' : 'transparent',
    backdropFilter: scrolled ? 'blur(24px)' : 'none',
    borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
    transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
    padding: '0 2rem',
  };

  const inner = {
    maxWidth: '1200px', margin: '0 auto',
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between',
    height: '68px',
  };

  const logo = {
    display: 'flex', alignItems: 'center', gap: '10px',
    fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.5px',
  };

  const logoMark = {
    width: '36px', height: '36px',
    background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
    borderRadius: '10px',
    display: 'flex', alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px', fontWeight: 900, color: '#fff',
    boxShadow: '0 0 20px rgba(139,92,246,0.5)',
    transition: 'box-shadow 0.3s ease',
  };

  const links = {
    display: 'flex', alignItems: 'center', gap: '4px',
    listStyle: 'none',
  };

  const getLink = ({ isActive }) => ({
    padding: '8px 18px', borderRadius: '10px',
    fontSize: '14px', fontWeight: 500,
    color: isActive ? '#fff' : 'rgba(240,240,255,0.6)',
    background: isActive ? 'rgba(139,92,246,0.2)' : 'transparent',
    border: isActive ? '1px solid rgba(139,92,246,0.4)' : '1px solid transparent',
    transition: 'all 0.22s ease',
    display: 'block',
  });

  return (
    <nav style={navStyle}>
      <div style={inner}>
        <NavLink to="/" style={logo}>
          <div style={logoMark}>N</div>
          <span className="glow-text">Netizens AI</span>
        </NavLink>

        <ul style={links}>
          {[['/', 'Home'], ['/upload', 'Upload'], ['/dashboard', 'Dashboard']].map(([path, label]) => (
            <li key={path}>
              <NavLink to={path} style={getLink} end={path === '/'}>
                {label}
              </NavLink>
            </li>
          ))}
          <li style={{ marginLeft: '8px' }}>
            <NavLink to="/upload">
              <button className="btn-primary" style={{ padding: '9px 22px', fontSize: '14px', borderRadius: '10px' }}>
                ✦ Analyze Resume
              </button>
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;