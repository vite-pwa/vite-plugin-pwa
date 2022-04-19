import { createSignal } from 'solid-js'
import type { RegisterSWOptions } from '../type'

export type { RegisterSWOptions }

export function useRegisterSW(options: RegisterSWOptions = {}) {
  const needRefresh = createSignal(false)
  const offlineReady = createSignal(false)

  const updateServiceWorker = (reloadPage?: boolean) => {}

  return {
    needRefresh,
    offlineReady,
    updateServiceWorker,
  }
}
