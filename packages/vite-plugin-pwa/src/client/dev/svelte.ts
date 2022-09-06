import { writable } from 'svelte/store'
import type { RegisterSWOptions } from '../type'

export type { RegisterSWOptions }

export function useRegisterSW(_options: RegisterSWOptions = {}) {
  const needRefresh = writable(false)
  const offlineReady = writable(false)

  const updateServiceWorker = (_reloadPage?: boolean) => {}

  return {
    needRefresh,
    offlineReady,
    updateServiceWorker,
  }
}
