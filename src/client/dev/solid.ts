import { createSignal } from 'solid-js'
import type { RegisterSWOptions } from '../type'

export type { RegisterSWOptions }

export function useRegisterSW(_options: RegisterSWOptions = {}) {
  const needRefresh = createSignal(false)
  const offlineReady = createSignal(false)
  const installingSW = createSignal(false)
  const updatingSW = createSignal(false)

  const updateServiceWorker = (_reloadPage?: boolean) => {}

  return {
    needRefresh,
    offlineReady,
    installingSW,
    updatingSW,
    updateServiceWorker,
  }
}
