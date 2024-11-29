import { ref } from 'vue'
import type { RegisterSWOptions } from '../type'
import { registerSW } from './register'

export type { RegisterSWOptions }

export function useRegisterSW(options: RegisterSWOptions = {}) {
  const {
    immediate = true,
    onNeedRefresh,
    onBeginUpdate,
    onOfflineReady,
    onRegistered,
    onRegisteredSW,
    onRegisterError,
  } = options

  const needRefresh = ref(false)
  const offlineReady = ref(false)

  const updateServiceWorker = registerSW({
    immediate,
    onBeginUpdate,
    onNeedRefresh() {
      needRefresh.value = true
      onNeedRefresh?.()
    },
    onOfflineReady() {
      offlineReady.value = true
      onOfflineReady?.()
    },
    onRegistered,
    onRegisteredSW,
    onRegisterError,
  })

  return {
    updateServiceWorker,
    offlineReady,
    needRefresh,
  }
}
