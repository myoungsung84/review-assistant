import _ from 'lodash'

/**
 * 텍스트를 정규화한다.
 * - Nil -> ''
 * - 연속 공백/개행을 단일 공백으로 축약
 * - trim 적용
 * - maxLen 초과 시 잘라냄
 *
 * @param s - 원본 문자열
 * @param maxLen - 최대 길이 (기본값: 5000)
 * @returns 정규화된 문자열
 */
export function normalizeText(s: string | Nil, maxLen = 5000): string {
  const t = _.trim((s ?? '').replace(/\s+/g, ' '))
  if (!t) return ''
  return t.length > maxLen ? t.slice(0, maxLen) : t
}

/**
 * 문자열을 안전하게 trim 한다.
 *
 * @param s - 원본 문자열
 * @returns trim된 문자열 (Nil이면 '')
 */
export function safeTrim(s: string | Nil): string {
  return _.trim(s ?? '')
}

/**
 * 빈 문자열인지 확인한다.
 * (공백만 있는 경우도 빈 문자열로 취급)
 *
 * @param s - 원본 문자열
 * @returns 비어있으면 true
 */
export function isBlank(s: string | Nil): boolean {
  return _.isEmpty(safeTrim(s))
}

/**
 * 최대 길이로 문자열을 자르고 말줄임표를 붙인다.
 *
 * @param s - 원본 문자열
 * @param maxLen - 최대 길이
 * @param ellipsis - 말줄임표 (기본값: '…')
 * @returns 잘린 문자열
 */
export function truncate(s: string | Nil, maxLen: number, ellipsis = '…'): string {
  if (maxLen <= 0) return ''
  return _.truncate(s ?? '', {
    length: maxLen,
    omission: ellipsis,
  })
}

/**
 * 여러 줄 문자열을 줄 단위 배열로 변환한다.
 * 빈 줄은 제거한다.
 *
 * @param s - 원본 문자열
 * @returns 라인 배열
 */
export function splitLines(s: string | Nil): string[] {
  return _(s ?? '')
    .split(/\r?\n/)
    .map(line => _.trim(line))
    .filter(Boolean)
    .value()
}

/**
 * 문자열 배열을 공백 하나로 합친다.
 *
 * @param parts - 문자열 배열
 * @returns 합쳐진 문자열
 */
export function joinWithSpace(parts: Array<string | Nil>): string {
  return _(parts)
    .map(p => _.trim(p ?? ''))
    .filter(Boolean)
    .join(' ')
}

/**
 * 문자열을 lower case + trim 처리한다.
 *
 * @param s - 원본 문자열
 * @returns 정규화된 문자열
 */
export function normalizeLower(s: string | Nil): string {
  return _.toLower(safeTrim(s))
}

/**
 * 문자열이 특정 길이를 초과하는지 확인한다.
 *
 * @param s - 원본 문자열
 * @param maxLen - 기준 길이
 * @returns 초과하면 true
 */
export function isOverLength(s: string | Nil, maxLen: number): boolean {
  return (s?.length ?? 0) > maxLen
}

/**
 * 문자열 배열에서 중복을 제거하고 trim 처리한다.
 *
 * @param values - 문자열 배열
 * @returns 정리된 문자열 배열
 */
export function uniqueStrings(values: Array<string | Nil>): string[] {
  return _(values)
    .map(v => _.trim(v ?? ''))
    .filter(Boolean)
    .uniq()
    .value()
}
