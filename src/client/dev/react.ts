import { useState } from 'react'
import type { RegisterSWOptions } from '../type'

export type { RegisterSWOptions }

export function useRegisterSW(_options: RegisterSWOptions = {}) {
  const needRefresh = useState(false)
  const offlineReady = useState(false)
  const installingSW = useState(false)
  const updatingSW = useState(false)

  const updateServiceWorker = (_reloadPage?: boolean) => {}

  return {
    needRefresh,
    offlineReady,
    installingSW,
    updatingSW,
    updateServiceWorker,
  }
}
