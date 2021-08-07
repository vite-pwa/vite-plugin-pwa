import { useState } from 'react'
import { RegisterSWOptions } from '../type'

export type { RegisterSWOptions }

export function useRegisterSW(options: RegisterSWOptions = {}) {
  const needRefresh = useState(false)
  const offlineReady = useState(false)

  const updateServiceWorker = (reloadPage?: boolean) => {}

  return {
    needRefresh,
    offlineReady,
    updateServiceWorker,
  }
}
