import { useEffect, useRef, useState } from 'react';

/**
 * Fades content in when it first scrolls into view.
 *
 * Replaces the global initReveal() that had to be re-run by hand after every
 * render; each instance owns its observer and disconnects once it has fired.
 */
export default function Reveal({ as: Tag = 'div', className = '', children, ...rest }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <Tag ref={ref} className={`reveal ${visible ? 'is-visible' : ''} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
