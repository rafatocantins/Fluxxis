import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'tracking/index': 'src/tracking/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,
  external: ['react', 'react-dom'],
  outDir: 'dist',
})
