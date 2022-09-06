import { useState } from 'react'
import type { RegisterSWOptions } from '../type'

export type { RegisterSWOptions }

export function useRegisterSW(_options: RegisterSWOptions = {}) {
  const needRefresh = useState(false)
  const offlineReady = useState(false)

  const updateServiceWorker = (_reloadPage?: boolean) => {}

  return {
    needRefresh,
    offlineReady,
    updateServiceWorker,
  }
}
