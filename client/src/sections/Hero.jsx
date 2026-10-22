import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap.js';
import { useContent } from '../lib/content.jsx';
import { cvUrl } from '../lib/api.js';
import HeroCanvas from '../components/HeroCanvas.jsx';
import Typewriter from '../components/Typewriter.jsx';
import SectionLink from '../components/SectionLink.jsx';

const chars = (word) =>
  [...word].map((ch, i) => (
    <span className="hero__char-mask" key={i}>
      <span className="hero__char">{ch}</span>
    </span>
  ));

export default function Hero({ ready }) {
  const { profile } = useContent();
  const root = useRef(null);

  useGSAP(
    () => {
      if (!ready) return;
      gsap
        .timeline({ defaults: { ease: 'power4.out' } })
        .from('.hero__char', { yPercent: 115, duration: 1.3, stagger: 0.045 })
        .from('[data-hero-fade]', { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.08 }, '-=0.9');

      // Name drifts apart slightly as the hero scrolls away.
      gsap.to('.hero__line--first', { xPercent: -6, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero__line--last', { xPercent: 6, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } });
    },
    { scope: root, dependencies: [ready] }
  );

  return (
    <section className="hero" id="top" ref={root}>
      <HeroCanvas />

      <div className="hero__meta mono container">
        <span data-hero-fade>(Portfolio ©{new Date().getFullYear()})</span>
        <span data-hero-fade>Based in {profile.location}</span>
        <span data-hero-fade className="hero__status">
          <i className="status-dot" aria-hidden="true" />
          {profile.status}
        </span>
      </div>

      <h1 className="hero__name" aria-label={profile.name}>
        <span className="hero__line hero__line--first" aria-hidden="true">
          {chars(profile.firstName)}
        </span>
        <span className="hero__line hero__line--last" aria-hidden="true">
          {chars(profile.lastName)}
        </span>
      </h1>

      <div className="hero__bottom container">
        <p className="hero__role mono" data-hero-fade>
          <span className="hero__prompt">&gt;</span> <Typewriter words={profile.roles} />
        </p>
        <p className="hero__headline" data-hero-fade>
          {profile.headline}
        </p>
        <div className="hero__ctas" data-hero-fade>
          <a className="btn btn--accent" href={cvUrl('pdf')}>
            Download CV <span className="mono">(PDF)</span>
          </a>
          <a className="btn btn--ghost" href={cvUrl('docx')}>
            DOCX ↓
          </a>
        </div>
        <SectionLink to="about" className="hero__scroll mono" data-hero-fade>
          Scroll <span aria-hidden="true">→</span>
        </SectionLink>
      </div>
    </section>
  );
}
