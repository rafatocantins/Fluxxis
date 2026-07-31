import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'intent-resolver': 'src/intent-resolver.ts',
    tracking: 'src/tracking.ts',
    'ds-adapter': 'src/ds-adapter.ts',
    'resolver/index': 'src/resolver/index.ts',
    'engine/index': 'src/engine/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: true,
  external: ['react', 'react-dom'],
  outDir: 'dist',
})
