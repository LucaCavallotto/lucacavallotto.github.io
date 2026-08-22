/**
 * Languages and Interests: a name plus an optional trailing note.
 *
 * @param {{ title: string, id: string, items: {name: string, note?: string}[], parenthesiseNote?: boolean, className?: string }} props
 */
export default function ListCard({ title, id, items, parenthesiseNote = false, className = '' }) {
  return (
    <section className={`card ${className}`.trim()} aria-labelledby={id}>
      <h2 id={id}>{title}</h2>
      <ul>
        {items.map((item) => (
          <li key={item.name}>
            <strong>{item.name}</strong>
            {item.note ? (
              <>
                {' '}
                {parenthesiseNote ? (
                  <small className="text-muted">({item.note})</small>
                ) : (
                  item.note
                )}
              </>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
