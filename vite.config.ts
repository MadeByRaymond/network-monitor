import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: './src/global.ts',
      name: 'NetworkMonitor',
      fileName: 'index.global',
      formats: ['iife']
    },
    rollupOptions: {
      output: {
        globals: {}
      }
    }
  }
});
