// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  esbuild: {
    // Bỏ qua lỗi TypeScript khi build với esbuild
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
  server: {
    port: 3006,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
  },
});
