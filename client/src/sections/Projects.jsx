import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap, Flip } from '../lib/gsap.js';
import { useContent } from '../lib/content.jsx';
import SectionHead from '../components/SectionHead.jsx';
import ProjectArt from '../components/ProjectArt.jsx';

const SORTS = {
  featured: { label: 'Featured', fn: (a, b) => b.featured - a.featured || a.order - b.order },
  newest: { label: 'Newest', fn: (a, b) => b.year - a.year || a.order - b.order },
  az: { label: 'A–Z', fn: (a, b) => a.title.localeCompare(b.title) },
};

export function ProjectCard({ project, index }) {
  const href = `/projects/${project.slug}`;
  return (
    <article className="project-card" data-cursor="View">
      <Link to={href} className="project-card__media" tabIndex={-1} aria-hidden="true">
        {project.image ? <img src={project.image} alt="" loading="lazy" /> : <ProjectArt seed={project.slug} label="" />}
        <span className="project-card__index mono">{String(index).padStart(2, '0')}</span>
      </Link>
      <div className="project-card__body">
        <div className="project-card__top mono">
          <span>{project.year}</span>
          {project.featured && <span className="pill pill--accent">Featured</span>}
        </div>
        <h3 className="project-card__title">
          <Link to={href}>{project.title}</Link>
        </h3>
        <p className="project-card__desc">{project.description}</p>
        <ul className="badges" aria-label="Tech stack">
          {project.tech.map((t) => (
            <li className="badge mono" key={t}>
              {t}
            </li>
          ))}
        </ul>
        <div className="project-card__links mono">
          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
          )}
          {project.live && (
            <a href={project.live} target="_blank" rel="noreferrer">
              Live demo ↗
            </a>
          )}
          <Link to={href}>Case study →</Link>
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  const { projects } = useContent();
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('featured');
  const grid = useRef(null);
  const flipState = useRef(null);

  const techs = useMemo(() => {
    const counts = {};
    projects.forEach((p) => p.tech.forEach((t) => (counts[t] = (counts[t] || 0) + 1)));
    return ['All', ...Object.keys(counts).sort((a, b) => counts[b] - counts[a] || a.localeCompare(b))];
  }, [projects]);

  const visible = useMemo(
    () => projects.filter((p) => filter === 'All' || p.tech.includes(filter)).sort(SORTS[sort].fn),
    [projects, filter, sort]
  );

  // Capture card positions before the change so Flip can animate them into place after.
  const withFlip = (update) => {
    flipState.current = Flip.getState(grid.current.querySelectorAll('.project-card'));
    update();
  };

  useLayoutEffect(() => {
    if (!flipState.current) return;
    const anim = Flip.from(flipState.current, {
      duration: 0.7,
      ease: 'power3.inOut',
      stagger: 0.03,
      absolute: true,
      onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.6, delay: 0.2 }),
    });
    flipState.current = null;
    return () => anim.kill();
  }, [filter, sort]);

  return (
    <section className="section projects container" id="work">
      <SectionHead
        index="03"
        label="Selected work"
        title={
          <>
            Things I&apos;ve <em>built.</em>
          </>
        }
      />

      <div className="projects__controls" data-reveal>
        <div className="chips" role="group" aria-label="Filter by technology">
          {techs.map((tech) => (
            <button
              key={tech}
              className={`chip mono ${filter === tech ? 'is-active' : ''}`}
              aria-pressed={filter === tech}
              onClick={() => withFlip(() => setFilter(tech))}
            >
              {tech}
            </button>
          ))}
        </div>
        <label className="sort mono">
          <span>Sort</span>
          <select value={sort} onChange={(e) => withFlip(() => setSort(e.target.value))}>
            {Object.entries(SORTS).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {visible.length} project{visible.length === 1 ? '' : 's'}
      </p>

      <div className="projects__grid" ref={grid}>
        {visible.map((project) => (
          <ProjectCard key={project.slug} project={project} index={projects.indexOf(project) + 1} />
        ))}
      </div>
    </section>
  );
}
