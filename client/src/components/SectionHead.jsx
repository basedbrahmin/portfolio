export default function SectionHead({ index, label, title, aside }) {
  return (
    <header className="section-head">
      <div className="section-head__meta mono" data-reveal>
        <span>({index})</span>
        <span>{label}</span>
      </div>
      <h2 className="section-head__title" data-reveal>
        {title}
      </h2>
      {aside && (
        <p className="section-head__aside mono" data-reveal="0.1">
          {aside}
        </p>
      )}
    </header>
  );
}
