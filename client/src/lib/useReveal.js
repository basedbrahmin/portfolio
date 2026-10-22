import { gsap, useGSAP, prefersReducedMotion } from './gsap.js';

// Fades and slides up every [data-reveal] element inside `scope` as it enters the viewport.
export function useReveal(scope, dependencies = []) {
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 48,
          autoAlpha: 0,
          duration: 1.1,
          ease: 'power3.out',
          delay: Number(el.dataset.reveal) || 0,
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        });
      });
    },
    { scope, dependencies, revertOnUpdate: true }
  );
}
