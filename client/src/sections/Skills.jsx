import { useRef } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap.js';
import { useContent } from '../lib/content.jsx';
import SectionHead from '../components/SectionHead.jsx';

const CATEGORIES = ['Frontend', 'Backend', 'Tools & Technologies'];
const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const proficiency = (level) => (level >= 85 ? 'Advanced' : level >= 70 ? 'Proficient' : level >= 55 ? 'Intermediate' : 'Learning');

function Tooltip({ skill }) {
  return (
    <span className="tooltip mono" role="tooltip">
      <strong>
        {proficiency(skill.level)} · {skill.level}%
      </strong>
      {skill.note}
    </span>
  );
}

function Ring({ skill }) {
  return (
    <div className="ring" tabIndex={0} data-reveal>
      <div className="ring__chart">
        <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle className="ring__track" cx="60" cy="60" r={RADIUS} />
        <circle
          className="ring__progress"
          cx="60"
          cy="60"
          r={RADIUS}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - skill.level / 100)}
        />
        </svg>
        <span className="ring__value">
          <span className="js-count">{skill.level}</span>
          <small>%</small>
        </span>
      </div>
      <span className="ring__name mono">{skill.name}</span>
      <Tooltip skill={skill} />
    </div>
  );
}

export default function Skills() {
  const { skills } = useContent();
  const root = useRef(null);
  const top = skills.filter((s) => s.top);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const trigger = (el) => ({ trigger: el, start: 'top 85%', once: true });

      gsap.utils.toArray('.ring').forEach((ring) => {
        gsap.from(ring.querySelector('.ring__progress'), { strokeDashoffset: CIRCUMFERENCE, duration: 1.8, ease: 'power3.out', scrollTrigger: trigger(ring) });
      });
      gsap.utils.toArray('.skill-group').forEach((group) => {
        gsap.from(group.querySelectorAll('.skill__fill'), { scaleX: 0, duration: 1.4, ease: 'power3.out', stagger: 0.08, scrollTrigger: trigger(group) });
      });
      gsap.utils.toArray('.js-count').forEach((el) => {
        gsap.from(el, { textContent: 0, duration: 1.6, ease: 'power2.out', snap: { textContent: 1 }, scrollTrigger: trigger(el) });
      });
    },
    { scope: root, dependencies: [skills], revertOnUpdate: true }
  );

  return (
    <section className="section skills container" id="skills" ref={root}>
      <SectionHead
        index="02"
        label="Skills"
        title={
          <>
            Tools of <em>the trade.</em>
          </>
        }
        aside="Hover or focus any skill to see proficiency."
      />

      <div className="rings">
        {top.map((skill) => (
          <Ring key={skill.name} skill={skill} />
        ))}
      </div>

      <div className="skill-groups">
        {CATEGORIES.map((category) => {
          const items = skills.filter((s) => s.category === category);
          return (
            <div className="skill-group" key={category} data-reveal>
              <h3 className="skill-group__title mono">
                {category} <span>({String(items.length).padStart(2, '0')})</span>
              </h3>
              <ul>
                {items.map((skill) => (
                  <li className="skill" key={skill.name} tabIndex={0}>
                    <div className="skill__row">
                      <span className="skill__name">{skill.name}</span>
                      <span className="skill__pct mono">
                        <span className="js-count">{skill.level}</span>%
                      </span>
                    </div>
                    <div className="skill__track">
                      <div className="skill__fill" style={{ '--level': skill.level / 100 }} />
                    </div>
                    <Tooltip skill={skill} />
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
