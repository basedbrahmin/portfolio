import { useState } from 'react';
import { useContent } from '../lib/content.jsx';
import SectionHead from '../components/SectionHead.jsx';
import Lightbox from '../components/Lightbox.jsx';
import CertificateMedia from '../components/CertificateMedia.jsx';

export default function Certifications() {
  const { certifications, achievements } = useContent();
  const [active, setActive] = useState(null);

  return (
    <section className="section certs container" id="certifications">
      <SectionHead
        index="05"
        label="Certifications & achievements"
        title={
          <>
            Proof of <em>work.</em>
          </>
        }
      />

      {certifications.length > 0 && (
        <div className="certs__grid">
          {certifications.map((cert, i) => (
            <button className="cert-card" key={cert.title} onClick={() => setActive(cert)} data-cursor="Open" data-reveal={(i % 4) * 0.08}>
              <CertificateMedia cert={cert} />
              <span className="cert-card__body">
                <span className="cert-card__title">{cert.title}</span>
                <span className="cert-card__meta mono">
                  {cert.issuer} · {cert.date}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}

      <h3 className={`certs__subhead mono ${certifications.length ? '' : 'is-first'}`} data-reveal>
        (Leadership &amp; achievements)
      </h3>
      <ul className="achievements">
        {achievements.map((a) => (
          <li className="achievement" key={a.title} data-reveal>
            <span className="achievement__year mono">{a.year}</span>
            <span className="achievement__title">{a.title}</span>
            <span className="achievement__detail">{a.detail}</span>
          </li>
        ))}
      </ul>

      <Lightbox item={active} onClose={() => setActive(null)}>
        {active && (
          <>
            <CertificateMedia cert={active} />
            <div className="lightbox__info">
              <div>
                <h3>{active.title}</h3>
                <p className="mono">
                  {active.issuer} · {active.date}
                </p>
              </div>
              {active.url && (
                <a className="btn btn--accent btn--sm" href={active.url} target="_blank" rel="noreferrer">
                  Verify credential ↗
                </a>
              )}
            </div>
          </>
        )}
      </Lightbox>
    </section>
  );
}
