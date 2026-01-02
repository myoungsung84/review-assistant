import type http from 'node:http'

import { badRequest } from '@e/server/lib/errors'

export type QueryValue = string | string[]
export type QueryObject = Record<string, QueryValue>

export function getUrl(req: http.IncomingMessage): URL {
  const host = req.headers.host
  if (!host) badRequest('missing_host')
  return new URL(req.url ?? '/', `http://${host}`)
}

export function getQuery(req: http.IncomingMessage): QueryObject {
  const url = getUrl(req)
  const out: QueryObject = {}

  url.searchParams.forEach((v, k) => {
    const cur = out[k]
    if (cur === undefined) out[k] = v
    else if (Array.isArray(cur)) cur.push(v)
    else out[k] = [cur, v]
  })

  return out
}

export function getParam(params: Record<string, string>, key: string): string {
  const v = params[key]
  if (!v) badRequest('invalid_params')
  return v
}

/** raw body → unknown */
export async function readJsonBody(req: http.IncomingMessage): Promise<unknown | null> {
  const chunks: Buffer[] = []

  await new Promise<void>((resolve, reject) => {
    req.on('data', (c: Buffer) => chunks.push(c))
    req.on('end', resolve)
    req.on('error', reject)
  })

  const raw = Buffer.concat(chunks).toString('utf-8').trim()
  if (!raw) return null

  try {
    return JSON.parse(raw) as unknown
  } catch {
    throw badRequest('invalid_json')
  }
}

export async function readJsonBodyAs<T>(
  req: http.IncomingMessage,
  isT: (v: unknown) => v is T,
): Promise<T | null> {
  const body = await readJsonBody(req)

  if (body === null) throw badRequest('empty_body')
  if (!isT(body)) throw badRequest('invalid_body')

  return body
}
