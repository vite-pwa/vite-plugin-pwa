import { ref } from 'vue'
import type { RegisterSWOptions } from '../type'

export type { RegisterSWOptions }

export function useRegisterSW(_options: RegisterSWOptions = {}) {
  const needRefresh = ref(false)
  const offlineReady = ref(false)

  const updateServiceWorker = (_reloadPage?: boolean) => {}

  return {
    updateServiceWorker,
    offlineReady,
    needRefresh,
  }
}
