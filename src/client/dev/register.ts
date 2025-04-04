import type { RegisterSWOptions } from '../type'

export type { RegisterSWOptions }

export function registerSW(_options: RegisterSWOptions = {}) {
  return async (_reloadPage = true) => {}
}
