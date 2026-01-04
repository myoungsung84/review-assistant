import * as React from 'react'

import { ServerInfoContext } from '@/app/providers/serverInfo.context'

export function useServerInfo() {
  const ctx = React.useContext(ServerInfoContext)
  if (!ctx) throw new Error('useServerInfo must be used within ServerInfoProvider')
  return ctx
}
