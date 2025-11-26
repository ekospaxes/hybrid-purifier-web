import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // This fixes the "does not provide an export named 'default'" error
  optimizeDeps: {
    include: ['animejs']
  }
})