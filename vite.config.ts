import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron/simple'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

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
}))
