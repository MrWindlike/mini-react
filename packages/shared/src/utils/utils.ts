export const isDef = <Value>(value: Value | undefined | null): value is Value => {
  return value !== undefined && value !== null
}

export const isUnDef = (value: unknown): value is (undefined | null) => {
  return value === undefined || value === null
}

export const isFunction = (value: unknown): value is Function => {
  return typeof value === 'function'
}

export const isObject = (value: unknown): value is object => {
  return isDef(value) && typeof value === 'object'
}
