import * as React from 'react'

import { ServerInfoContext } from '@/app/providers/serverInfo.context'

export function ServerInfoProvider({ children }: { children: React.ReactNode }) {
  const [baseUrl, setBaseUrl] = React.useState<string | null>(null)

  React.useEffect(() => {
    let alive = true
    void (async () => {
      try {
        const info = await window.api.getServerInfo()
        if (!alive) return
        setBaseUrl(info.baseUrl)
      } catch {
        if (!alive) return
        setBaseUrl(null)
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  return <ServerInfoContext.Provider value={{ baseUrl }}>{children}</ServerInfoContext.Provider>
}
