import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap.js';

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, [data-cursor]';

export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const label = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const root = document.documentElement;
    root.classList.add('has-cursor');

    const dotX = gsap.quickTo(dot.current, 'x', { duration: 0.08, ease: 'power3' });
    const dotY = gsap.quickTo(dot.current, 'y', { duration: 0.08, ease: 'power3' });
    const ringX = gsap.quickTo(ring.current, 'x', { duration: 0.45, ease: 'power3' });
    const ringY = gsap.quickTo(ring.current, 'y', { duration: 0.45, ease: 'power3' });

    const onMove = (e) => {
      root.classList.add('cursor-visible');
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };
    const onOver = (e) => {
      const target = e.target.closest?.(INTERACTIVE);
      const text = target?.closest('[data-cursor]')?.dataset.cursor || '';
      ring.current.classList.toggle('is-hover', Boolean(target));
      ring.current.classList.toggle('is-label', Boolean(text));
      label.current.textContent = text;
    };
    const onLeave = () => root.classList.remove('cursor-visible');

    window.addEventListener('pointermove', onMove);
    document.addEventListener('pointerover', onOver);
    document.addEventListener('pointerleave', onLeave);
    return () => {
      root.classList.remove('has-cursor', 'cursor-visible');
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div className="cursor" aria-hidden="true">
      <div className="cursor__ring" ref={ring}>
        <span className="cursor__label mono" ref={label} />
      </div>
      <div className="cursor__dot" ref={dot} />
    </div>
  );
}
