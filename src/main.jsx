import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';

import './styles/base.css';
import './styles/utilities.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/home.css';
import './styles/pages.css';

let currentPathname = window.location.pathname;
let currentHash = window.location.hash;
let needsRewrite = false;

// 1. Remove index.html from the path to keep URLs clean
if (currentPathname.endsWith('index.html')) {
  currentPathname = currentPathname.replace(/index\.html$/, '');
  needsRewrite = true;
}

// 2. Rewrite old bare hashes to HashRouter paths
const legacyHashStr = currentHash.slice(1);
if (legacyHashStr && !legacyHashStr.startsWith('/')) {
  const routerPath = legacyHashStr === 'home' ? '' : legacyHashStr;
  currentHash = `#/${routerPath}`;
  needsRewrite = true;
}

if (needsRewrite) {
  window.history.replaceState(null, '', `${currentPathname}${currentHash}`);
}

// 3. Reliable mobile tap feedback — iOS Safari does not fire :active on
//    elements that trigger client-side navigation (React Router <Link>) or
//    on <button> elements in many contexts. This event-delegated approach
//    toggles a .is-pressed class so CSS can style taps reliably.
const PRESSED_SELECTOR =
  '.btn-outline-custom, .carousel-ctrl, .carousel-link-primary, ' +
  '.carousel-link-outline, .glass-btn, .project-detail-back';

document.addEventListener(
  'touchstart',
  (e) => {
    const el = e.target.closest(PRESSED_SELECTOR);
    if (el) el.classList.add('is-pressed');
  },
  { passive: true },
);

document.addEventListener(
  'touchend',
  () => {
    document.querySelectorAll('.is-pressed').forEach((el) => {
      el.classList.remove('is-pressed');
    });
  },
  { passive: true },
);

document.addEventListener(
  'touchcancel',
  () => {
    document.querySelectorAll('.is-pressed').forEach((el) => {
      el.classList.remove('is-pressed');
    });
  },
  { passive: true },
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>
);
