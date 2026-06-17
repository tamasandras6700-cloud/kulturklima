import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/statbank': {
        target: 'https://api.statbank.dk',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/statbank/, ''),
      },
    },
  },
  preview: {
    proxy: {
      '/api/statbank': {
        target: 'https://api.statbank.dk',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/statbank/, ''),
      },
    },
  },
})
