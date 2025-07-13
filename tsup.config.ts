import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    outDir: 'dist',
    splitting: false,
    clean: true,
  },
  {
    entry: {
      'index': 'src/global.ts',
    },
    format: ['iife'],
    minify: true,
    outDir: 'dist',
    clean: false, // keep other build outputs
  }
]);
