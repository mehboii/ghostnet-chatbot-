import { defineConfig } from 'tsup';

export default defineConfig([
  // Node / bundler-consumed package builds (ESM + CJS).
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: true,
    splitting: false,
    treeshake: true,
    target: 'es2022',
    outDir: 'dist',
  },
  // Standalone browser bundle for no-build static sites. Exposes
  // `window.GhostNetSDK` (IIFE). Only includes the dependency-free
  // GhostSupportBot, so it runs in any browser via a plain <script> tag.
  {
    entry: { 'ghostnet-sdk': 'src/browser.ts' },
    format: ['iife'],
    globalName: 'GhostNetSDK',
    platform: 'browser',
    target: 'es2018',
    sourcemap: false,
    minify: true,
    treeshake: true,
    clean: false,
    outDir: 'dist',
  },
]);
