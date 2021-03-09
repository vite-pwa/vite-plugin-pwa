import { ref } from 'vue'
import { RegisterSWOptions } from '../type'

export type { RegisterSWOptions }

export function useRegisterSW(options: RegisterSWOptions = {}) {
  const needRefresh = ref(false)
  const offlineReady = ref(false)

  const updateServiceWorker = () => {}

  return {
    updateServiceWorker,
    offlineReady,
    needRefresh,
  }
}
