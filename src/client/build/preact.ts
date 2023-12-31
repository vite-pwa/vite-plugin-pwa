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
    onInstalling,
    onUpdateFound,
  } = options

  const [needRefresh, setNeedRefresh] = useState(false)
  const [offlineReady, setOfflineReady] = useState(false)
  const [installingSW, setInstallingSW] = useState(false)
  const [updatingSW, setUpdatingSW] = useState(false)

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
      onInstalling(state, sw) {
        setInstallingSW(state)
        onInstalling?.(state, sw)
      },
      onUpdateFound(state, sw) {
        setUpdatingSW(state)
        onUpdateFound?.(state, sw)
      },
      onRegistered,
      onRegisteredSW,
      onRegisterError,
    })
  })

  return {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    installingSW: [installingSW, setInstallingSW],
    updatingSW: [updatingSW, setUpdatingSW],
    updateServiceWorker,
  }
}
