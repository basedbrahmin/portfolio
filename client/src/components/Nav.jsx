import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../lib/theme.js';
import { cvUrl } from '../lib/api.js';
import { stopScroll, startScroll } from '../lib/scroll.js';
import SectionLink from './SectionLink.jsx';

const LINKS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'work', label: 'Work' },
  { id: 'journey', label: 'Journey' },
  { id: 'contact', label: 'Contact' },
];

export default function Nav() {
  const [theme, toggleTheme] = useTheme();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 120 && y > lastY.current);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    stopScroll();
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      startScroll();
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <header className={`nav ${hidden && !open ? 'is-hidden' : ''} ${open ? 'is-open' : ''}`}>
      <div className="nav__bar">
        <SectionLink to="top" className="nav__logo" aria-label="Ashmit Sharma, home">
          AS<sup className="mono">©26</sup>
        </SectionLink>

        <nav className="nav__links mono" aria-label="Sections">
          {LINKS.map((link, i) => (
            <SectionLink key={link.id} to={link.id} className="nav__link">
              <span className="nav__index">0{i + 1}</span>
              {link.label}
            </SectionLink>
          ))}
        </nav>

        <div className="nav__actions">
          <button className="theme-toggle mono" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
            <span className="theme-toggle__icon" aria-hidden="true" />
            <span className="theme-toggle__text">{theme === 'light' ? 'Dark' : 'Light'}</span>
          </button>
          <a className="btn btn--accent btn--sm nav__cv" href={cvUrl('pdf')}>
            Resume ↓
          </a>
          <button className="nav__menu mono" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mobile-menu">
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      <div className="nav__overlay" id="mobile-menu" hidden={!open}>
        <nav aria-label="Mobile">
          {LINKS.map((link, i) => (
            <SectionLink key={link.id} to={link.id} className="nav__overlay-link" onClick={() => setOpen(false)}>
              <span className="mono">0{i + 1}</span>
              {link.label}
            </SectionLink>
          ))}
        </nav>
        <div className="nav__overlay-foot mono">
          <a href={cvUrl('pdf')}>Resume PDF ↓</a>
          <a href={cvUrl('docx')}>Resume DOCX ↓</a>
        </div>
      </div>
    </header>
  );
}
