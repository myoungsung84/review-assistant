import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { app, BrowserWindow, ipcMain } from 'electron'

import { getServerInfo, startApiServer, stopApiServer } from './server'

const __dirname$1 = path.dirname(fileURLToPath(import.meta.url))
process.env.APP_ROOT = path.join(__dirname$1, '..')

const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL
const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname$1, 'preload.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  mainWindow.webContents.on('did-fail-load', (_e, code, desc, url) => {
    console.error('[did-fail-load]', code, desc, url)
  })

  mainWindow.webContents.on('console-message', (_e, level, message, line, sourceId) => {
    if (level >= 2) console.log(`[renderer:${level}] ${message} (${sourceId}:${line})`)
  })

  if (app.isPackaged) {
    mainWindow.loadFile(path.join(app.getAppPath(), 'dist', 'index.html'))
  } else {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL!)
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  }
}

app.whenReady().then(async () => {
  try {
    await startApiServer()
    ipcMain.handle('app:ping', async () => 'pong')

    ipcMain.handle('api:getInfo', async () => {
      const { port, baseUrl } = getServerInfo()
      return { port, baseUrl }
    })

    createWindow()
  } catch (err) {
    console.error('Failed to start API server:', err)
    return app.quit()
  }
})

app.on('before-quit', e => {
  e.preventDefault()
  stopApiServer()
    .catch(err => console.error('[api] stop error', err))
    .finally(() => app.quit())
})

app.on('window-all-closed', () => {
  stopApiServer()
    .catch(err => console.error('[api] stop error', err))
    .finally(() => {
      if (process.platform !== 'darwin') {
        app.quit()
        mainWindow = null
      }
    })
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

export { MAIN_DIST, RENDERER_DIST, VITE_DEV_SERVER_URL }
