import { contextBridge, ipcRenderer } from 'electron'

const api = {
  ping: () => ipcRenderer.invoke('app:ping') as Promise<string>,
  getServerInfo: () =>
    ipcRenderer.invoke('api:getInfo') as Promise<{ port: number; baseUrl: string }>,
} as const

contextBridge.exposeInMainWorld('api', api)
