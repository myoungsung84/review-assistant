import _ from 'lodash'

/**
 * Nil 여부를 확인한다.
 *
 * @param value - 검사 대상
 * @returns null | undefined 이면 true
 */
export function isNil(value: unknown): value is Nil {
  return _.isNil(value)
}

/**
 * 문자열 여부를 확인한다.
 *
 * @param value - 검사 대상
 * @returns 문자열이면 true
 */
export function isString(value: unknown): value is string {
  return _.isString(value)
}

/**
 * 빈 문자열(공백 포함) 여부를 확인한다.
 *
 * @param value - 검사 대상
 * @returns 빈 문자열이면 true
 */
export function isBlankString(value: unknown): value is string {
  return _.isString(value) && _.isEmpty(_.trim(value))
}

/**
 * boolean 여부를 확인한다.
 *
 * @param value - 검사 대상
 * @returns boolean이면 true
 */
export function isBoolean(value: unknown): value is boolean {
  return _.isBoolean(value)
}

/**
 * number 여부를 확인한다.
 * NaN, Infinity 는 false.
 *
 * @param value - 검사 대상
 * @returns 유한한 number이면 true
 */
export function isNumber(value: unknown): value is number {
  return _.isNumber(value) && Number.isFinite(value)
}

/**
 * 정수 여부를 확인한다.
 *
 * @param value - 검사 대상
 * @returns 정수면 true
 */
export function isInteger(value: unknown): value is number {
  return isNumber(value) && Number.isInteger(value)
}

/**
 * 배열 여부를 확인한다.
 *
 * @param value - 검사 대상
 * @returns 배열이면 true
 */
export function isArray<T = unknown>(value: unknown): value is T[] {
  return _.isArray(value)
}

/**
 * 비어있지 않은 배열 여부를 확인한다.
 *
 * @param value - 검사 대상
 * @returns 길이가 1 이상인 배열이면 true
 */
export function isNonEmptyArray<T = unknown>(value: unknown): value is [T, ...T[]] {
  return isArray<T>(value) && value.length > 0
}

/**
 * "plain object" 여부를 확인한다.
 * (배열/함수/Date/Map/Set 등 제외)
 *
 * @param value - 검사 대상
 * @returns 일반 객체면 true
 */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return _.isPlainObject(value)
}

/**
 * 키 접근이 가능한 객체(plain object)인지 확인한다.
 *
 * @param value - 검사 대상
 * @returns Record<string, unknown>이면 true
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return isPlainObject(value)
}

/**
 * 함수 여부를 확인한다.
 *
 * @param value - 검사 대상
 * @returns 함수면 true
 */
export function isFunction(value: unknown): value is (...args: unknown[]) => unknown {
  return _.isFunction(value)
}

/**
 * Date 객체 여부를 확인한다.
 *
 * @param value - 검사 대상
 * @returns Date면 true
 */
export function isDate(value: unknown): value is Date {
  return _.isDate(value)
}

/**
 * Promise-like(thenable) 여부를 확인한다.
 *
 * @param value - 검사 대상
 * @returns PromiseLike면 true
 */
export function isPromiseLike<T = unknown>(value: unknown): value is PromiseLike<T> {
  if (!value) return false
  if (!isObject(value)) return false

  const maybeThen = value['then']
  return isFunction(maybeThen)
}

/**
 * object 안에 특정 key가 존재하는지 확인한다.
 * (값의 타입까지 보장하진 않음)
 *
 * @param obj - 대상 객체
 * @param key - 키
 * @returns key가 존재하면 true
 */
export function hasKey<K extends string>(obj: unknown, key: K): obj is Record<K, unknown> {
  return isObject(obj) && key in obj
}

/**
 * object 안에 특정 key가 존재하고, 값이 string인지 확인한다.
 *
 * @param obj - 대상 객체
 * @param key - 키
 * @returns 값이 string이면 true
 */
export function hasStringKey<K extends string>(obj: unknown, key: K): obj is Record<K, string> {
  if (!hasKey(obj, key)) return false

  const value = obj[key]
  return isString(value)
}

/**
 * object 안에 특정 key가 존재하고, 값이 number인지 확인한다.
 *
 * @param obj - 대상 객체
 * @param key - 키
 * @returns 값이 number이면 true
 */
export function hasNumberKey<K extends string>(obj: unknown, key: K): obj is Record<K, number> {
  if (!hasKey(obj, key)) return false

  const value = obj[key]
  return isNumber(value)
}

/**
 * object 안에 특정 key가 존재하고, 값이 boolean인지 확인한다.
 *
 * @param obj - 대상 객체
 * @param key - 키
 * @returns 값이 boolean이면 true
 */
export function hasBooleanKey<K extends string>(obj: unknown, key: K): obj is Record<K, boolean> {
  if (!hasKey(obj, key)) return false

  const value = obj[key]
  return isBoolean(value)
}

/**
 * object 안에 특정 key가 존재하고, 값이 배열인지 확인한다.
 *
 * @param obj - 대상 객체
 * @param key - 키
 * @returns 값이 배열이면 true
 */
export function hasArrayKey<K extends string, T = unknown>(
  obj: unknown,
  key: K,
): obj is Record<K, T[]> {
  if (!hasKey(obj, key)) return false

  const value = obj[key]
  return isArray<T>(value)
}

/**
 * object 안에 특정 key가 존재하고, 값이 plain object인지 확인한다.
 *
 * @param obj - 대상 객체
 * @param key - 키
 * @returns 값이 plain object이면 true
 */
export function hasObjectKey<K extends string>(
  obj: unknown,
  key: K,
): obj is Record<K, Record<string, unknown>> {
  if (!hasKey(obj, key)) return false

  const value = obj[key]
  return isObject(value)
}
