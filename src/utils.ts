export function slash(str: string) {
  return str.replace(/\\/g, '/')
}

export function resolveBathPath(base: string) {
  if (isAbsolute(base))
    return base
  return !base.startsWith('/') && !base.startsWith('./')
    ? `/${base}`
    : base
}

export function isAbsolute(url: string) {
  return url.match(/^(?:[a-z]+:)?\/\//i)
}

export function normalizePath(path: string) {
  return path.replace(/\\/g, '/')
}
