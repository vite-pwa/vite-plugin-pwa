import type { RegisterSWOptions } from '../type'
import { ref } from 'vue'

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
