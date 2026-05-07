declare module 'virtual:pwa-register/vue' {
  import type { RegisterSWOptions } from 'vite-plugin-pwa/types'
  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-ignore ignore when vue is not installed
  import type { Ref } from 'vue'

  export type { RegisterSWOptions }

  export function useRegisterSW(options?: RegisterSWOptions): {
    needRefresh: Ref<boolean>
    offlineReady: Ref<boolean>
    updateServiceWorker: {
      /**
       * Reloads the current window to allow the service worker take the control.
       */
      (): Promise<void>
      /**
       * @deprecated The `reloadPage` param is not used anymore sice 0.14.0
       */
      (reloadPage: boolean): Promise<void>
    }
  }
}
