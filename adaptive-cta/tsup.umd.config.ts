import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    'fluxxis-variant-engine': 'src/umd-entry.ts',
  },
  format: ['iife'],
  globalName: 'FluxxisVariantEngine',
  outDir: 'dist',
  dts: false,
  splitting: false,
  sourcemap: true,
  clean: false,
  treeshake: true,
  minify: true,
  target: 'es2020',
  external: ['react', 'react-dom'],
  noExternal: [/(.*)/], // Bundle everything except React
  platform: 'browser',
})
