import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: false,
  treeshake: true,
  splitting: false,
  external: ['react', 'react-dom', 'zustand'],
  injectStyle: false,
  outDir: 'dist',
  target: 'es2020',
  platform: 'browser',
  metafile: true,
  bundle: true,
  env: {
    NODE_ENV: 'production',
  },
});
