import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // ponytail: dev-only; prod serves /api from same host so no proxy needed
      '/api': 'http://localhost:3000',
    },
  },
})
