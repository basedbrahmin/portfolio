import { useMemo } from 'react';

// Deterministic generative cover for projects without a screenshot.
function seededRandom(text) {
  let seed = 2166136261;
  for (const ch of text) seed = Math.imul(seed ^ ch.charCodeAt(0), 16777619);
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const W = 400;
const H = 300;

const patterns = {
  rings(rand) {
    const cx = 120 + rand() * 160;
    const cy = 90 + rand() * 120;
    return (
      <>
        {Array.from({ length: 9 }, (_, i) => (
          <circle key={i} cx={cx} cy={cy} r={18 + i * 26} className="art-line" />
        ))}
        <circle cx={cx} cy={cy} r={44 + rand() * 30} className="art-accent" />
      </>
    );
  },
  bars(rand) {
    return Array.from({ length: 14 }, (_, i) => {
      const h = 40 + rand() * 210;
      return <rect key={i} x={14 + i * 27.5} y={H - h} width={18} height={h} className={rand() > 0.78 ? 'art-accent' : 'art-fg'} />;
    });
  },
  dots(rand) {
    const cells = [];
    for (let y = 0; y < 8; y++)
      for (let x = 0; x < 11; x++) {
        const hit = rand() > 0.86;
        cells.push(
          hit ? (
            <rect key={`${x}-${y}`} x={20 + x * 35} y={22 + y * 35} width={26} height={26} className="art-accent" />
          ) : (
            <circle key={`${x}-${y}`} cx={33 + x * 35} cy={35 + y * 35} r={3} className="art-fg" />
          )
        );
      }
    return cells;
  },
  arcs(rand) {
    const size = 100;
    const tiles = [];
    for (let y = 0; y < 3; y++)
      for (let x = 0; x < 4; x++) {
        const rot = Math.floor(rand() * 4) * 90;
        const cls = rand() > 0.7 ? 'art-accent' : rand() > 0.5 ? 'art-fg' : 'art-line';
        tiles.push(
          <path
            key={`${x}-${y}`}
            d={`M0 0 H${size} A${size} ${size} 0 0 1 0 ${size} Z`}
            transform={`translate(${x * size + size / 2} ${y * size + size / 2}) rotate(${rot}) translate(${-size / 2} ${-size / 2})`}
            className={cls}
          />
        );
      }
    return tiles;
  },
};

export default function ProjectArt({ seed, label }) {
  const art = useMemo(() => {
    const rand = seededRandom(seed);
    const keys = Object.keys(patterns);
    return patterns[keys[Math.floor(rand() * keys.length)]](rand);
  }, [seed]);

  return (
    <svg className="project-art" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" role="img" aria-label={label}>
      <rect width={W} height={H} className="art-bg" />
      {art}
    </svg>
  );
}
