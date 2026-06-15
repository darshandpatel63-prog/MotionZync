// vite.config.js
// MotionZync v3.0
// Proxy: replaces need for daemon server
// - /api/ollama → localhost:11434 (fixes Ollama CORS)
// - /api/anthropic → Anthropic API (fixes CORS in some browsers)

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // ── Dev server proxy (replaces daemon for local AI) ──
  server: {
    port: 3000,
    host: true,
    proxy: {
      // Ollama local AI — fixes CORS
      '/api/ollama': {
        target: 'http://localhost:11434',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/ollama/, '/api'),
      },
      // Optional: proxy Anthropic (some browsers block direct calls)
      '/api/anthropic': {
        target: 'https://api.anthropic.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/anthropic/, '/v1'),
        secure: true,
      },
    },
  },

  // ── Build optimization ────────────────────────────────
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Three.js — 1MB+ → separate chunk (lazy loaded)
          'three-vendor':    ['three'],
          // Firebase — loaded only when auth used
          'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          // React core
          'react-vendor':    ['react', 'react-dom', 'react-router-dom'],
          // Animation libraries
          'anim-vendor':     ['gsap'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    // Minify for production
    minify: 'esbuild',
    target: 'es2020',
  },

  // ── Pre-bundle for fast dev startup ──────────────────
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'firebase/app', 'firebase/auth', 'firebase/firestore', 'gsap'],
    exclude: ['three'], // lazy loaded — don't pre-bundle
  },
})
