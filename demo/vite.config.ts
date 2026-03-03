import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@ia-design-system/react': resolve(__dirname, '../src/index.ts'),
    },
  },
  define: {
    'process.env': {}
  }
})
