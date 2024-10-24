/// <reference types="vitest" />
/// <reference types="vite/client" />
import { defineConfig } from 'vite'

import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import tsConfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsConfigPaths()],
  envDir: 'config/env',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts', 'setup.ts'],
  },
  server: {
    host: 'localhost',
    port: 3000,
    https: {
      cert: resolve(__dirname, 'config/local-certificate/localhost.crt'),
      key: resolve(__dirname, 'config/local-certificate/localhost.key'),
    },
  },
  build: {
    outDir: 'build',
  },
})
