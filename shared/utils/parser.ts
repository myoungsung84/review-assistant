import _ from 'lodash'

/* ------------------------------------------------------------------
 * JSON
 * ------------------------------------------------------------------ */

/**
 * JSON 문자열을 안전하게 파싱한다.
 * 파싱 실패 시 원본 문자열을 그대로 반환한다.
 *
 * @param input - JSON 문자열
 * @returns 파싱된 값(T) 또는 null
 */
export function safeJsonParse<T = unknown>(input: string): T | null {
  try {
    return JSON.parse(input) as T
  } catch {
    return null
  }
}

/**
 * 값을 안전하게 JSON 문자열로 변환한다.
 * 순환 참조 등으로 실패할 경우 String(value)를 반환한다.
 *
 * @param value - 변환 대상
 * @returns JSON 문자열
 */
export function safeJsonStringify(value: unknown): string {
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

/* ------------------------------------------------------------------
 * Number
 * ------------------------------------------------------------------ */

/**
 * 문자열을 number로 안전하게 파싱한다.
 * NaN, Infinity 인 경우 null을 반환한다.
 *
 * @param input - 숫자 문자열
 * @returns number 또는 null
 */
export function safeNumberParse(input: string | Nil): number | null {
  if (_.isNil(input)) return null

  const n = Number(input)
  return Number.isFinite(n) ? n : null
}

/**
 * 문자열을 number로 파싱하고 기본값을 적용한다.
 *
 * @param input - 숫자 문자열
 * @param fallback - 실패 시 기본값
 * @returns number
 */
export function parseNumberOr(input: string | Nil, fallback: number): number {
  const n = safeNumberParse(input)
  return n ?? fallback
}

/* ------------------------------------------------------------------
 * Boolean
 * ------------------------------------------------------------------ */

/**
 * 문자열을 boolean으로 안전하게 파싱한다.
 * 'true' / 'false' (소문자 기준) 만 허용한다.
 *
 * @param input - boolean 문자열
 * @returns boolean 또는 null
 */
export function safeBooleanParse(input: string | Nil): boolean | null {
  if (input === 'true') return true
  if (input === 'false') return false
  return null
}

/**
 * 문자열을 boolean으로 파싱하고 기본값을 적용한다.
 *
 * @param input - boolean 문자열
 * @param fallback - 실패 시 기본값
 * @returns boolean
 */
export function parseBooleanOr(input: string | Nil, fallback: boolean): boolean {
  const b = safeBooleanParse(input)
  return b ?? fallback
}

/* ------------------------------------------------------------------
 * String
 * ------------------------------------------------------------------ */

/**
 * unknown 값을 string으로 안전하게 변환한다.
 *
 * @param value - 변환 대상
 * @param fallback - Nil 또는 변환 실패 시 기본값
 * @returns 문자열
 */
export function safeStringify(value: unknown, fallback = ''): string {
  if (_.isNil(value)) return fallback
  return _.isString(value) ? value : String(value)
}
