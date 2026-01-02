import path from 'node:path'
import { fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron/simple'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const alias = {
  '@': path.resolve(__dirname, 'src'),
  '@e': path.resolve(__dirname, 'electron'),
}

export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [
    react(),
    electron({
      main: {
        entry: 'electron/main.ts',
        vite: {
          resolve: { alias },
        },
      },
      preload: {
        input: path.join(__dirname, 'electron/preload.ts'),
        vite: {
          resolve: { alias },
        },
      },
      renderer: mode === 'test' ? undefined : {},
    }),
  ],
  resolve: { alias },
  server: {
    proxy: {
      '^/events($|/)': {
        target: 'http://127.0.0.1:17355',
        changeOrigin: true,
      },
    },
  },
}))
