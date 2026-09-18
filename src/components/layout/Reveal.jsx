/**
 * Wraps content in a semantic tag.
 * Entrance animations have been disabled.
 */
export default function Reveal({ as: Tag = 'div', className = '', children, ...rest }) {
  return (
    <Tag className={className.trim() || undefined} {...rest}>
      {children}
    </Tag>
  );
}
