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
    onInstalling,
    onUpdateFound,
  } = options

  const needRefresh = writable(false)
  const offlineReady = writable(false)
  const installingSW = writable(false)
  const updatingSW = writable(false)

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
    onInstalling(state, sw) {
      installingSW.set(state)
      onInstalling?.(state, sw)
    },
    onUpdateFound(state, sw) {
      updatingSW.set(state)
      onUpdateFound?.(state, sw)
    },
    onRegistered,
    onRegisteredSW,
    onRegisterError,
  })

  return {
    needRefresh,
    offlineReady,
    installingSW,
    updatingSW,
    updateServiceWorker,
  }
}
