import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitest/config'

// Repo name is "gradewise" -> deployed at https://<user>.github.io/gradewise/
export default defineConfig({
  base: '/gradewise/',
  plugins: [react(), tailwindcss()],
  build: {
    sourcemap: false,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
})
