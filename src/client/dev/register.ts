import type { RegisterSWOptions } from '../type'

export type { RegisterSWOptions }

export function registerSW(_options: RegisterSWOptions = {}) {
  return (_reloadPage = true) => {}
}
