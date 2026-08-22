import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

export default function NotFound() {
  useDocumentTitle('Page not found');

  return (
    <section
      className="container u-text-center"
      style={{ paddingTop: '6rem', paddingBottom: '6rem' }}
    >
      <p className="eyebrow">404</p>
      <h1 className="home-section-title">Page not found</h1>
      <p className="subtitle" style={{ maxWidth: '480px', margin: '0 auto 2rem' }}>
        That page does not exist — it may have been renamed or removed.
      </p>
      <Link to="/" className="btn-outline-custom">
        Back to Home →
      </Link>
    </section>
  );
}
