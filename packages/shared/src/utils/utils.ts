export const isDef = (value: unknown): boolean => {
  return value !== undefined && value !== null
}

export const isUnDef = (value: unknown): boolean => {
  return value === undefined || value === null
}
