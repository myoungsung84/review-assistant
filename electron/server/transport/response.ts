import type http from 'node:http'

export function sendJson(res: http.ServerResponse, status: number, payload: unknown): void {
  if (res.writableEnded) return
  res.statusCode = status
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(payload))
}

export function sendSuccess<T extends object>(
  res: http.ServerResponse,
  data: T,
  status = 200,
): void {
  sendJson(res, status, {
    success: true,
    error: null,
    ...data,
  })
}

export function sendError(res: http.ServerResponse, status: number, code: string): void {
  sendJson(res, status, { success: false, error: code })
}

export const sendNotFound = (res: http.ServerResponse) => sendError(res, 404, 'not_found')

export const sendMethodNotAllowed = (res: http.ServerResponse) =>
  sendError(res, 405, 'method_not_allowed')
