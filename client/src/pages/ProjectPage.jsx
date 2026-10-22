import { useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useContent } from '../lib/content.jsx';
import { useReveal } from '../lib/useReveal.js';
import ProjectArt from '../components/ProjectArt.jsx';
import NotFound from './NotFound.jsx';

export default function ProjectPage() {
  const { slug } = useParams();
  const { projects } = useContent();
  const root = useRef(null);
  const index = projects.findIndex((p) => p.slug === slug);
  const project = projects[index];
  useReveal(root, [slug, project]);

  if (!project) return <NotFound />;
  const next = projects[(index + 1) % projects.length];

  return (
    <main className="case container" ref={root}>
      <Link to="/#work" className="case__back mono" data-reveal>
        ← All projects
      </Link>

      <header className="case__head">
        <p className="mono case__kicker" data-reveal>
          ({String(index + 1).padStart(2, '0')}) Case study
        </p>
        <h1 className="case__title" data-reveal>
          {project.title}
        </h1>
        <p className="case__tagline" data-reveal="0.1">
          {project.tagline}
        </p>
      </header>

      <dl className="case__meta mono" data-reveal>
        <div>
          <dt>Year</dt>
          <dd>{project.year}</dd>
        </div>
        <div>
          <dt>Role</dt>
          <dd>{project.role}</dd>
        </div>
        <div>
          <dt>Stack</dt>
          <dd>{project.tech.join(', ')}</dd>
        </div>
        {(project.github || project.live) && (
          <div>
            <dt>Links</dt>
            <dd className="case__links">
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
            </dd>
          </div>
        )}
      </dl>

      <div className="case__media" data-reveal>
        {project.image ? <img src={project.image} alt={`${project.title} screenshot`} /> : <ProjectArt seed={project.slug} label={`${project.title} cover art`} />}
      </div>

      <div className="case__body">
        <section data-reveal>
          <h2 className="mono">(Overview)</h2>
          <p className="case__overview">{project.overview || project.description}</p>
        </section>
        {project.highlights?.length > 0 && (
          <section data-reveal>
            <h2 className="mono">(Highlights)</h2>
            <ul className="case__highlights">
              {project.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {next && next !== project && (
        <Link to={`/projects/${next.slug}`} className="case__next" data-cursor="Next">
          <span className="mono">Next project →</span>
          <span className="case__next-title">{next.title}</span>
        </Link>
      )}
    </main>
  );
}
