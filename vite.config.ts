/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api-guts': {
        target: 'https://api.gutsai.id',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api-guts/, ''),
        headers: {
          'Origin': 'https://api.gutsai.id'
        }
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
