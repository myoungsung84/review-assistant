/**
 * 숫자를 min ~ max 범위로 제한한다.
 *
 * @param value - 대상 숫자
 * @param min - 최소값
 * @param max - 최대값
 * @returns 제한된 숫자
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * 소수점 n자리까지 반올림한다.
 *
 * @param value - 대상 숫자
 * @param digits - 소수점 자리수 (기본값: 0)
 * @returns 반올림된 숫자
 */
export function roundTo(value: number, digits = 0): number {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

/**
 * 소수점 n자리까지 버림한다.
 *
 * @param value - 대상 숫자
 * @param digits - 소수점 자리수 (기본값: 0)
 * @returns 버림된 숫자
 */
export function floorTo(value: number, digits = 0): number {
  const factor = 10 ** digits
  return Math.floor(value * factor) / factor
}

/**
 * 퍼센트를 계산한다. (0 ~ 100)
 *
 * @param value - 부분 값
 * @param total - 전체 값
 * @param digits - 소수점 자리수 (기본값: 0)
 * @returns 퍼센트 값
 */
export function percent(value: number, total: number, digits = 0): number {
  if (total === 0) return 0
  return roundTo((value / total) * 100, digits)
}

/**
 * 안전하게 숫자로 변환한다.
 * NaN, Infinity 인 경우 fallback 값을 반환한다.
 *
 * @param value - 변환 대상 값
 * @param fallback - 변환 실패 시 기본값 (기본값: 0)
 * @returns 안전한 숫자
 */
export function toSafeNumber(value: unknown, fallback = 0): number {
  const num = Number(value)
  return Number.isFinite(num) ? num : fallback
}

/**
 * 지정된 범위 내의 랜덤 정수를 반환한다. (min, max 포함)
 *
 * @param min - 최소값
 * @param max - 최대값
 * @returns 랜덤 정수
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 숫자 배열의 합계를 계산한다.
 *
 * @param numbers - 숫자 배열
 * @returns 합계
 */
export function sum(numbers: number[]): number {
  return numbers.reduce((acc, cur) => acc + cur, 0)
}

/**
 * 숫자 배열의 평균을 계산한다.
 *
 * @param numbers - 숫자 배열
 * @returns 평균 값 (빈 배열일 경우 0)
 */
export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0
  return sum(numbers) / numbers.length
}

/**
 * nullable 숫자 배열의 평균을 계산한다.
 * null, undefined 값은 자동으로 제외한다.
 *
 * @param numbers - 숫자 배열 (number | null | undefined)
 * @param digits - 소수점 자리수 (기본값: 1)
 * @returns 평균 값
 */
export function averageNullable(numbers: Array<number | null | undefined>, digits = 1): number {
  const filtered = numbers.filter((n): n is number => typeof n === 'number')

  if (filtered.length === 0) return 0
  return roundTo(average(filtered), digits)
}

/**
 * 숫자를 천 단위 콤마 문자열로 포맷한다.
 *
 * @param value - 대상 숫자
 * @returns 포맷된 문자열
 */
export function formatNumber(value: number | string): string {
  if (typeof value === 'string') {
    const num = Number(value)
    if (Number.isNaN(num)) return value
    return num.toLocaleString()
  }
  return value.toLocaleString()
}
