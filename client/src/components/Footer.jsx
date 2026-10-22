import { cvUrl } from '../lib/api.js';
import { useContent } from '../lib/content.jsx';
import SectionLink from './SectionLink.jsx';

export default function Footer() {
  const { profile } = useContent();

  return (
    <footer className="footer">
      <div className="container footer__cols mono">
        <div>
          <h3>(Menu)</h3>
          {['about', 'skills', 'work', 'journey', 'contact'].map((id) => (
            <SectionLink key={id} to={id}>
              {id}
            </SectionLink>
          ))}
        </div>
        <div>
          <h3>(Socials)</h3>
          {profile.socials.map((s) => (
            <a key={s.label} href={s.url} target="_blank" rel="noreferrer">
              {s.label} ↗
            </a>
          ))}
        </div>
        <div>
          <h3>(Resume)</h3>
          <a href={cvUrl('pdf')}>Download PDF ↓</a>
          <a href={cvUrl('docx')}>Download DOCX ↓</a>
        </div>
        <div>
          <h3>(Say hi)</h3>
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </div>
      </div>
      <div className="footer__wordmark" aria-hidden="true">
        {profile.lastName}
      </div>
      <div className="container footer__bottom mono">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span>Built with MongoDB · Express · React · Node</span>
        <SectionLink to="top">Back to top ↑</SectionLink>
      </div>
    </footer>
  );
}
