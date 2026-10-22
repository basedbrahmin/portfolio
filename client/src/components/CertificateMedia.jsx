// Shows the certificate image, or a designed stand-in until one is added.
export default function CertificateMedia({ cert }) {
  if (cert.image) return <img className="cert-media" src={cert.image} alt={`${cert.title} certificate`} loading="lazy" />;

  return (
    <div className="cert-media cert-media--placeholder">
      <span className="mono cert-media__issuer">{cert.issuer}</span>
      <span className="cert-media__kicker mono">Certificate of completion</span>
      <span className="cert-media__title">{cert.title}</span>
      <span className="cert-media__seal" aria-hidden="true">
        ✳
      </span>
      <span className="mono cert-media__date">{cert.date}</span>
    </div>
  );
}
