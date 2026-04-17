import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Base necessário para GitHub Pages (/<repo-name>/)
  base: '/ancora-mental-health/',
})
