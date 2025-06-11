import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    force: true
  },
  server: {
    hmr: {
      overlay: true
    }
  },
  css: {
    postcss: './postcss.config.cjs',
    modules: {
      localsConvention: 'camelCase',
    },
    devSourcemap: true
  },
  // Clear the cache to ensure fresh rebuilds
  cacheDir: '.vite_cache'
})
