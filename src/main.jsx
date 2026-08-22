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

// The pre-React site used bare hashes (#skills, #project/foo); HashRouter
// expects a path (#/skills). Rewrite old links before the router reads them.
const legacyHash = window.location.hash.slice(1);
if (legacyHash && !legacyHash.startsWith('/')) {
  const path = legacyHash === 'home' ? '' : legacyHash;
  window.history.replaceState(null, '', `${window.location.pathname}#/${path}`);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>
);
