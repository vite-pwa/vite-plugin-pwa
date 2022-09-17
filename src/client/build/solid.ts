import { createSignal } from 'solid-js'
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

  const [needRefresh, setNeedRefresh] = createSignal(false)
  const [offlineReady, setOfflineReady] = createSignal(false)

  const updateServiceWorker = registerSW({
    immediate,
    onOfflineReady() {
      setOfflineReady(true)
      onOfflineReady?.()
    },
    onNeedRefresh() {
      setNeedRefresh(true)
      onNeedRefresh?.()
    },
    onRegistered,
    onRegisteredSW,
    onRegisterError,
  })

  return {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  }
}
