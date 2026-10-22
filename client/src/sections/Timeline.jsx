import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from '../lib/gsap.js';
import { useContent } from '../lib/content.jsx';
import SectionHead from '../components/SectionHead.jsx';

export default function Timeline() {
  const { timeline } = useContent();
  const root = useRef(null);

  useGSAP(
    () => {
      gsap.utils.toArray('.timeline__item').forEach((item) => {
        ScrollTrigger.create({ trigger: item, start: 'top 65%', toggleClass: 'is-active' });
      });
      if (prefersReducedMotion()) return;
      gsap.from('.timeline__progress', {
        scaleY: 0,
        ease: 'none',
        scrollTrigger: { trigger: '.timeline', start: 'top 65%', end: 'bottom 65%', scrub: true },
      });
      gsap.utils.toArray('.timeline__card').forEach((card, i) => {
        gsap.from(card, {
          x: window.innerWidth > 900 ? (i % 2 ? 60 : -60) : 40,
          autoAlpha: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 85%', once: true },
        });
      });
    },
    { scope: root, dependencies: [timeline], revertOnUpdate: true }
  );

  return (
    <section className="section journey container" id="journey" ref={root}>
      <SectionHead
        index="04"
        label="Journey"
        title={
          <>
            Education <em>&amp; experience.</em>
          </>
        }
      />

      <div className="timeline">
        <div className="timeline__line" aria-hidden="true">
          <div className="timeline__progress" />
        </div>
        <ol className="timeline__list">
        {timeline.map((item) => (
          <li className="timeline__item" key={`${item.title}-${item.start}`}>
            <span className="timeline__dot" aria-hidden="true" />
            <article className="timeline__card">
              <div className="timeline__meta mono">
                <span className={`pill ${item.type === 'Experience' ? 'pill--accent' : ''}`}>{item.type}</span>
                <span>
                  {item.start}
                  {item.end && item.end !== item.start ? ` — ${item.end}` : ''}
                </span>
              </div>
              <h3 className="timeline__title">{item.title}</h3>
              <p className="timeline__org mono">
                {item.org}
                {item.location && ` · ${item.location}`}
              </p>
              <p className="timeline__desc">{item.description}</p>
            </article>
          </li>
        ))}
        </ol>
      </div>
    </section>
  );
}
