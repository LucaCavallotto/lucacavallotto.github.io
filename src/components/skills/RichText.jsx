import { Fragment } from 'react';

/**
 * Renders the `details` strings from skills.json, which contain literal <br>
 * tags. Splitting on them keeps the line breaks without handing raw HTML to
 * dangerouslySetInnerHTML.
 */
export default function RichText({ text }) {
  if (!text) return null;

  return text.split(/<br\s*\/?>/i).map((line, i) => (
    <Fragment key={i}>
      {i > 0 ? <br /> : null}
      {line}
    </Fragment>
  ));
}
