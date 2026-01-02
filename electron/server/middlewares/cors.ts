import type http from 'node:http'

import type { Middleware } from '@e/server/types/router.types'

const DEV_ORIGINS = new Set(['http://localhost:5173', 'http://127.0.0.1:5173'])

// ✅ 가능하면 네 확장 ID만 허용 (dev 중이면 비워두고 전체 허용도 가능)
const DEV_EXTENSION_IDS = new Set<string>([
  // 'abcdefghijklmnopabcdefghijklmnop',
])

function isAllowedExtensionOrigin(origin: string) {
  // chrome-extension://<id>
  const m = /^chrome-extension:\/\/([a-p]{32})$/i.exec(origin)
  if (!m) return false

  // ✅ ID를 아직 안 박아놨으면(dev 편의) 확장 origin은 모두 허용
  if (DEV_EXTENSION_IDS.size === 0) return true

  return DEV_EXTENSION_IDS.has(m[1].toLowerCase())
}

function isAllowedOrigin(origin: string) {
  return DEV_ORIGINS.has(origin) || isAllowedExtensionOrigin(origin)
}

export function corsMiddleware(): Middleware {
  return async (req: http.IncomingMessage, res: http.ServerResponse, _ctx, next) => {
    const origin = req.headers.origin
    const method = (req.method ?? '').toUpperCase()

    const originOk = typeof origin === 'string' && isAllowedOrigin(origin)

    // ✅ origin 허용된 경우에만 CORS 헤더 내려줌
    if (originOk && typeof origin === 'string') {
      res.setHeader('Access-Control-Allow-Origin', origin)
      res.setHeader('Vary', 'Origin')

      // 필요한 헤더/메서드만
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-App-Token')
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')

      // 필요하면 켜 (쿠키/인증 필요할 때만)
      // res.setHeader('Access-Control-Allow-Credentials', 'true')
    }

    // ✅ preflight는 "허용된 origin"만 통과
    if (method === 'OPTIONS') {
      if (!originOk) {
        res.statusCode = 403
        res.end()
        return
      }
      res.statusCode = 204
      res.end()
      return
    }

    await next()
  }
}
