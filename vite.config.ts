import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// GitHub Pages: use base for repo deployment (e.g. /Rohit-Kurmi-01.github.io/)
// For custom domain rohit.codes use base: '/'
export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  build: {
    rollupOptions: {
      output: {
        // GSAP and framer-motion are on every page load and change far less
        // often than the app, so naming them keeps a copy edit from forcing a
        // re-download.
        //
        // three.js is deliberately NOT listed. Naming a manual chunk pulls it
        // into the entry's modulepreload graph, which made the browser fetch
        // 938 KB eagerly even for reduced-motion visitors who never render it.
        // Left unnamed, Rollup keeps it inside the dynamically imported
        // ForestBackground chunk, where it belongs.
        manualChunks: {
          gsap: ['gsap', 'gsap/ScrollTrigger', 'gsap/DrawSVGPlugin', 'gsap/MorphSVGPlugin', 'gsap/SplitText'],
          motion: ['framer-motion'],
        },
      },
    },
    chunkSizeWarningLimit: 700,
  },
});
