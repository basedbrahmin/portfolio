export default function Marquee({ items, reverse = false, accent = false }) {
  return (
    <div className={`marquee ${accent ? 'marquee--accent' : ''}`} aria-hidden="true">
      <div className={`marquee__track ${reverse ? 'is-reverse' : ''}`}>
        {[0, 1].map((copy) => (
          <div className="marquee__group" key={copy}>
            {items.map((item) => (
              <span className="marquee__item" key={item}>
                {item}
                <span className="marquee__sep">✳</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
