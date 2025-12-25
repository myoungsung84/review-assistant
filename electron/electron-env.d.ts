/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    /** Project root directory (set by vite-plugin-electron) */
    APP_ROOT: string
    /** Points to /dist/ or /public/ depending on dev/prod */
    VITE_PUBLIC: string
  }
}

/**
 * Renderer process global types.
 * Exposed by `electron/preload.ts` via contextBridge.
 */
declare global {
  interface Window {
    api: {
      // sanity check
      ping: () => Promise<string>

      // 앞으로 여기에 기능 추가:
      // youtubeDownload: (url: string) => Promise<...>
      // coupangScrape: (url: string) => Promise<...>
    }
  }
}

export {}
