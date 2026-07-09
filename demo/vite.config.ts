import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Fluxxis/',
  plugins: [react()],
  define: {
    'process.env': {}
  }
})
