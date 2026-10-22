import Lenis from 'lenis';
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap.js';

let lenis = null;

export function initSmoothScroll() {
  if (prefersReducedMotion()) return () => {};
  lenis = new Lenis({ lerp: 0.1 });
  lenis.on('scroll', ScrollTrigger.update);
  const tick = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(tick);
    lenis.destroy();
    lenis = null;
  };
}

export function scrollTo(target, { immediate = false } = {}) {
  if (lenis) return lenis.scrollTo(target, { immediate, offset: 0, duration: 1.4 });
  if (typeof target === 'number') return window.scrollTo({ top: target, behavior: immediate ? 'instant' : 'smooth' });
  document.querySelector(target)?.scrollIntoView({ behavior: immediate ? 'instant' : 'smooth' });
}

export const stopScroll = () => lenis?.stop();
export const startScroll = () => lenis?.start();
