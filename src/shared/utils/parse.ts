// src/shared/utils/parser.ts

// ---------- JSON ----------

export function safeJsonParse(input: string): unknown {
  try {
    return JSON.parse(input)
  } catch {
    return input
  }
}

export function safeJsonStringify(value: unknown): string {
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

// ---------- Number ----------
// 필요할 때 쓰라고 기본형 하나 깔아둠 (선택)
export function safeNumberParse(input: string): number | null {
  const n = Number(input)
  return Number.isFinite(n) ? n : null
}

// ---------- Boolean ----------
// 선택: 'true'/'false' 문자열 파싱
export function safeBooleanParse(input: string): boolean | null {
  if (input === 'true') return true
  if (input === 'false') return false
  return null
}
