import type { RegisterSWOptions } from '../type'
import { createSignal } from 'solid-js'

export type { RegisterSWOptions }

export function useRegisterSW(_options: RegisterSWOptions = {}) {
  const needRefresh = createSignal(false)
  const offlineReady = createSignal(false)

  const updateServiceWorker = (_reloadPage?: boolean) => {}

  return {
    needRefresh,
    offlineReady,
    updateServiceWorker,
  }
}
