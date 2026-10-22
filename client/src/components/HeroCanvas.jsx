import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../lib/gsap.js';

// A grid of short strokes following a slow flow field. Strokes near the cursor
// (or a drifting "ghost" attractor on touch devices) swirl, grow and turn orange.
export default function HeroCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduce = prefersReducedMotion();
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    let width = 0;
    let height = 0;
    let gap = 34;
    let points = [];
    let colors = readColors();
    let frame = 0;
    let visible = true;
    let time = 0;

    function readColors() {
      const style = getComputedStyle(document.documentElement);
      return { accent: style.getPropertyValue('--accent').trim(), fg: style.getPropertyValue('--fg').trim() };
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      gap = width < 640 ? 26 : 34;
      points = [];
      for (let y = gap / 2; y < height; y += gap) for (let x = gap / 2; x < width; x += gap) points.push({ x, y });
      if (reduce) draw();
    }

    function influenceAt(px, py, ax, ay, radius) {
      const dx = px - ax;
      const dy = py - ay;
      const d = Math.hypot(dx, dy);
      return d < radius ? { amount: (1 - d / radius) ** 2, angle: Math.atan2(dy, dx) + Math.PI / 2 } : null;
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      mouse.x += (mouse.tx - mouse.x) * 0.12;
      mouse.y += (mouse.ty - mouse.y) * 0.12;
      const ghost = { x: width * (0.5 + 0.38 * Math.sin(time * 0.35)), y: height * (0.45 + 0.3 * Math.sin(time * 0.53)) };
      const mouseRadius = Math.min(260, width * 0.35);

      ctx.lineCap = 'round';
      ctx.lineWidth = 1.4;
      ctx.strokeStyle = colors.fg;
      ctx.globalAlpha = 0.13;
      ctx.beginPath();
      const hot = [];

      for (const p of points) {
        const flow = Math.sin(p.x * 0.0032 + time) * Math.cos(p.y * 0.0041 - time * 0.8) * Math.PI;
        const near = influenceAt(p.x, p.y, mouse.x, mouse.y, mouseRadius);
        const drift = influenceAt(p.x, p.y, ghost.x, ghost.y, 190);
        const amount = Math.min(1, (near?.amount || 0) + (drift?.amount || 0) * 0.55);
        const swirl = near && near.amount >= (drift?.amount || 0) * 0.55 ? near.angle : drift?.angle ?? flow;
        const vx = Math.cos(flow) * (1 - amount) + Math.cos(swirl) * amount;
        const vy = Math.sin(flow) * (1 - amount) + Math.sin(swirl) * amount;
        const angle = Math.atan2(vy, vx);
        const len = gap * (0.22 + amount * 0.6);
        const hx = (Math.cos(angle) * len) / 2;
        const hy = (Math.sin(angle) * len) / 2;

        if (amount > 0.04) hot.push([p.x - hx, p.y - hy, p.x + hx, p.y + hy, amount]);
        else {
          ctx.moveTo(p.x - hx, p.y - hy);
          ctx.lineTo(p.x + hx, p.y + hy);
        }
      }
      ctx.stroke();

      ctx.strokeStyle = colors.accent;
      ctx.lineWidth = 2;
      for (const [x1, y1, x2, y2, amount] of hot) {
        ctx.globalAlpha = 0.2 + amount * 0.8;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    function loop() {
      time += 0.006;
      draw();
      frame = requestAnimationFrame(loop);
    }

    function start() {
      if (reduce || frame || !visible || document.hidden) return;
      frame = requestAnimationFrame(loop);
    }

    function stop() {
      cancelAnimationFrame(frame);
      frame = 0;
    }

    const onPointer = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.tx = e.clientX - rect.left;
      mouse.ty = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.tx = -9999;
      mouse.ty = -9999;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const viewObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      visible ? start() : stop();
    });
    viewObserver.observe(canvas);
    const themeObserver = new MutationObserver(() => {
      colors = readColors();
      if (reduce) draw();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    window.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    document.addEventListener('visibilitychange', onVisibility);
    resize();
    start();

    return () => {
      stop();
      resizeObserver.disconnect();
      viewObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas className="hero__canvas" ref={canvasRef} aria-hidden="true" />;
}
