declare module 'virtual:pwa-register/svelte' {
  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-ignore ignore when svelte is not installed
  import type { Writable } from 'svelte/store'
  import type { RegisterSWOptions } from 'vite-plugin-pwa/types'

  export type { RegisterSWOptions }

  export function useRegisterSW(options?: RegisterSWOptions): {
    needRefresh: Writable<boolean>
    offlineReady: Writable<boolean>
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
