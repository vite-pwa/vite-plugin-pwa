import { ref } from 'vue'
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

  const needRefresh = ref(false)
  const offlineReady = ref(false)
  const installingSW = ref(false)
  const updatingSW = ref(false)

  const updateServiceWorker = registerSW({
    immediate,
    onNeedRefresh() {
      needRefresh.value = true
      onNeedRefresh?.()
    },
    onOfflineReady() {
      offlineReady.value = true
      onOfflineReady?.()
    },
    onInstalling(state, sw) {
      installingSW.value = state
      onInstalling?.(state, sw)
    },
    onUpdateFound(state, sw) {
      updatingSW.value = state
      onUpdateFound?.(state, sw)
    },
    onRegistered,
    onRegisteredSW,
    onRegisterError,
  })

  return {
    updateServiceWorker,
    offlineReady,
    needRefresh,
    installingSW,
    updatingSW,
  }
}
