import { writable } from 'svelte/store'
import type { RegisterSWOptions } from '../type'
import { registerSW } from './register'

export type { RegisterSWOptions }

export function useRegisterSW(options: RegisterSWOptions = {}) {
  const {
    immediate = true,
    onNeedRefresh,
    onOfflineReady,
    onRegistered,
    onRegisteredSW,
    onRegisterError,
  } = options

  const needRefresh = writable(false)
  const offlineReady = writable(false)

  const updateServiceWorker = registerSW({
    immediate,
    onOfflineReady() {
      offlineReady.set(true)
      onOfflineReady?.()
    },
    onNeedRefresh() {
      needRefresh.set(true)
      onNeedRefresh?.()
    },
    onRegistered,
    onRegisteredSW,
    onRegisterError,
  })

  return {
    needRefresh,
    offlineReady,
    updateServiceWorker,
  }
}
