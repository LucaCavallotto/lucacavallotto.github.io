import RichText from './RichText.jsx';

/**
 * Education and Experience share the exact same shape, so they share one
 * component instead of the two near-identical builders of the old code.
 *
 * @param {{ title: string, id: string, items: {title: string, subtitle: string, details?: string}[], className?: string }} props
 */
export default function TimelineCard({ title, id, items, className = '' }) {
  return (
    <section className={`card ${className}`.trim()} aria-labelledby={id}>
      <h2 id={id}>{title}</h2>
      <ul>
        {items.map((item) => (
          <li key={`${item.title}-${item.subtitle}`}>
            <strong>{item.title}</strong> - {item.subtitle}
            {item.details ? (
              <>
                <br />
                <small className="text-muted">
                  <RichText text={item.details} />
                </small>
              </>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
