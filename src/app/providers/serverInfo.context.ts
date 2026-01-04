import * as React from 'react'

export type ServerInfo = {
  baseUrl: string | null
}

export const ServerInfoContext = React.createContext<ServerInfo | null>(null)
