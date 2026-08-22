import { useEffect } from 'react';

const SITE_NAME = 'Luca Cavallotto';

/** Keeps the tab title in sync with the route — the old site had one fixed title. */
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} • ${SITE_NAME}` : `${SITE_NAME} — MSc AI & Data Analytics`;
  }, [title]);
}
