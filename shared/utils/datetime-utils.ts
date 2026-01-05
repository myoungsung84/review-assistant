import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

const DEFAULT_TZ = 'Asia/Seoul'

/**
 * 현재 시간을 ISO 문자열로 반환한다.
 *
 * @returns ISODateString
 */
export function nowISO(): ISODateString {
  return dayjs().toISOString()
}

/**
 * 날짜를 ISO 문자열로 변환한다.
 *
 * @param date - Date | string | Nil
 * @returns ISODateString | null
 */
export function toISO(date: Date | string | Nil): ISODateString | null {
  if (!date) return null
  const d = dayjs(date)
  return d.isValid() ? d.toISOString() : null
}

/**
 * 날짜를 지정한 포맷 문자열로 변환한다.
 *
 * @param date - Date | string | Nil
 * @param format - 포맷 문자열 (예: YYYY-MM-DD HH:mm)
 * @param tz - 타임존 (기본값: Asia/Seoul)
 * @returns 포맷된 문자열
 */
export function formatDate(
  date: Date | string | Nil,
  format = 'YYYY-MM-DD HH:mm',
  tz = DEFAULT_TZ,
): string {
  if (!date) return ''
  const d = dayjs(date)
  if (!d.isValid()) return ''
  return d.tz(tz).format(format)
}

/**
 * 두 날짜가 같은 날인지 확인한다.
 *
 * @param a - 날짜 A
 * @param b - 날짜 B
 * @returns 같은 날이면 true
 */
export function isSameDay(a: Date | string | Nil, b: Date | string | Nil): boolean {
  if (!a || !b) return false
  return dayjs(a).isSame(dayjs(b), 'day')
}

/**
 * 기준 날짜가 target 이후인지 확인한다.
 *
 * @param target - 비교 대상
 * @param base - 기준 날짜
 * @returns 이후면 true
 */
export function isAfter(target: Date | string | Nil, base: Date | string | Nil): boolean {
  if (!target || !base) return false
  return dayjs(target).isAfter(dayjs(base))
}

/**
 * 기준 날짜가 target 이전인지 확인한다.
 *
 * @param target - 비교 대상
 * @param base - 기준 날짜
 * @returns 이전이면 true
 */
export function isBefore(target: Date | string | Nil, base: Date | string | Nil): boolean {
  if (!target || !base) return false
  return dayjs(target).isBefore(dayjs(base))
}

/**
 * 상대 시간 문자열을 반환한다.
 * 예: '3분 전', '2시간 전'
 *
 * @param date - 기준 날짜
 * @returns 상대 시간 문자열
 */
export function fromNow(date: Date | string | Nil): string {
  if (!date) return ''
  const d = dayjs(date)
  return d.isValid() ? d.fromNow() : ''
}

/**
 * 날짜 차이를 계산한다.
 *
 * @param a - 날짜 A
 * @param b - 날짜 B
 * @param unit - 단위 (day, hour, minute 등)
 * @returns 차이 값
 */
export function diff(
  a: Date | string | Nil,
  b: Date | string | Nil,
  unit: dayjs.OpUnitType = 'day',
): number {
  if (!a || !b) return 0
  return dayjs(a).diff(dayjs(b), unit)
}
