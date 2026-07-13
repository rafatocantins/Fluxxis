import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  // Also copy tokens.css to dist
  onSuccess: 'cp src/tokens.css dist/tokens.css',
});
