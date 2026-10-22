import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="not-found container">
      <p className="mono">(Error)</p>
      <h1 className="not-found__code">404</h1>
      <p className="not-found__text">This page wandered off. Let&apos;s get you back.</p>
      <Link to="/" className="btn btn--accent">
        ← Back home
      </Link>
    </main>
  );
}
