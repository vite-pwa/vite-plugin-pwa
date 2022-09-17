import { useState } from 'preact/hooks'
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

  const [needRefresh, setNeedRefresh] = useState(false)
  const [offlineReady, setOfflineReady] = useState(false)

  const [updateServiceWorker] = useState(() => {
    return registerSW({
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
  })

  return {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  }
}
