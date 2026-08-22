import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base '/' because this is the user-page repo (lucacavallotto.github.io),
// served from the domain root rather than a project subdirectory.
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    // Inline assets under 4KB (the SVG favicon) instead of emitting extra requests.
    assetsInlineLimit: 4096,
  },
});
