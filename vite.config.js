// vite.config.js 
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split Three.js into its own chunk (large lib)
          'three-vendor':  ['three'],
          // Split Firebase
          'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          // React core
          'react-vendor':  ['react', 'react-dom', 'react-router-dom'],
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ['three', 'gsap'],
  },
  server: {
    port: 3000,
    host: true,
  }
})
