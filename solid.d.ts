declare module 'virtual:pwa-register/solid' {
  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-ignore ignore when solid-js is not installed
  import type { Accessor, Setter } from 'solid-js'
  import type { RegisterSWOptions } from 'vite-plugin-pwa/types'

  export type { RegisterSWOptions }

  export function useRegisterSW(options?: RegisterSWOptions): {
    needRefresh: [Accessor<boolean>, Setter<boolean>]
    offlineReady: [Accessor<boolean>, Setter<boolean>]
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
