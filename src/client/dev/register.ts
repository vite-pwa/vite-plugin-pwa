import type { RegisterSWOptions } from '../type'

export type { RegisterSWOptions }

export function registerSW(options: RegisterSWOptions = {}) {
  return (reloadPage = true) => {}
}
