import { useRef } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap.js';
import { useContent } from '../lib/content.jsx';
import SectionHead from '../components/SectionHead.jsx';

export default function About() {
  const { profile } = useContent();
  const root = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        '.about__word',
        { opacity: 0.14 },
        { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: '.about__bio', start: 'top 80%', end: 'bottom 50%', scrub: true } }
      );
      gsap.from('.about__photo', {
        clipPath: 'inset(100% 0% 0% 0%)',
        duration: 1.4,
        ease: 'power4.inOut',
        scrollTrigger: { trigger: '.about__photo', start: 'top 80%', once: true },
      });
      gsap.from('.about__photo img', {
        scale: 1.3,
        duration: 1.8,
        ease: 'power3.out',
        clearProps: 'transform',
        scrollTrigger: { trigger: '.about__photo', start: 'top 80%', once: true },
      });
    },
    { scope: root, dependencies: [profile.bio], revertOnUpdate: true }
  );

  const facts = [
    ['Location', profile.location],
    ['Status', profile.status],
    ['Focus', profile.focus],
    ['Email', <a href={`mailto:${profile.email}`}>{profile.email}</a>],
    profile.phone && ['Phone', <a href={`tel:${profile.phone.replace(/\s/g, '')}`}>{profile.phone}</a>],
  ].filter(Boolean);

  return (
    <section className="section about container" id="about" ref={root}>
      <SectionHead
        index="01"
        label="About"
        title={
          <>
            Building for the web, <em>end to end.</em>
          </>
        }
      />

      <div className="about__grid">
        <figure className="about__photo" data-cursor="Hi!">
          <img className="about__img" src={profile.photo} alt={`Portrait of ${profile.name}`} />
          <figcaption className="mono">( {profile.name} )</figcaption>
        </figure>

        <div className="about__content">
          <p className="about__bio">
            {profile.bio.split(' ').map((word, i) => (
              <span className="about__word" key={i}>
                {word}{' '}
              </span>
            ))}
          </p>

          <dl className="about__facts mono">
            {facts.map(([term, value]) => (
              <div className="about__fact" key={term} data-reveal>
                <dt>{term}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
