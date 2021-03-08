declare module 'vite-plugin-pwa-register' {
  export type RegisterSWOptions = {
    immediate?: boolean
    onNeedRefresh?: () => void
    onOfflineReady?: () => void
  }

  export function registerSW(options?: RegisterSWOptions): () => Promise<void>
}

declare module 'vite-plugin-pwa-register/vue' {
  import type { Ref } from 'vue'

  export type RegisterSWOptions = {
    immediate?: boolean
    onNeedRefresh?: () => void
    onOfflineReady?: () => void
  }

  export function useRegisterSW(options?: RegisterSWOptions): {
    needRefresh: Ref<boolean>
    offlineReady: Ref<boolean>
    updateServiceWorker: () => Promise<void>
  }
}
