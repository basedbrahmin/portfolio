import { useRef } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap.js';

export default function Loader({ onReveal, onComplete }) {
  const root = useRef(null);
  const count = useRef(null);

  useGSAP(
    () => {
      const fast = prefersReducedMotion();
      const counter = { value: 0 };
      gsap
        .timeline({ onComplete })
        .to(counter, {
          value: 100,
          duration: fast ? 0.3 : 1.9,
          ease: 'power2.inOut',
          onUpdate: () => (count.current.textContent = String(Math.round(counter.value)).padStart(3, '0')),
        })
        .from('.loader__fill', { scaleX: 0, duration: fast ? 0.3 : 1.9, ease: 'power2.inOut' }, 0)
        .call(onReveal, null, '+=0.15')
        .to(root.current, { yPercent: -100, duration: fast ? 0.3 : 1, ease: 'power4.inOut' }, '<');
    },
    { scope: root }
  );

  return (
    <div className="loader" ref={root} aria-hidden="true">
      <div className="loader__top mono">
        <span>Ashmit Sharma</span>
        <span>Portfolio ©{new Date().getFullYear()}</span>
      </div>
      <div className="loader__bottom">
        <span className="loader__count" ref={count}>
          000
        </span>
        <div className="loader__bar">
          <div className="loader__fill" />
        </div>
      </div>
    </div>
  );
}
