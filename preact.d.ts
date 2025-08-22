declare module 'virtual:pwa-register/preact' {
  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-ignore ignore when preact/hooks is not installed
  import type { StateUpdater } from 'preact/hooks'
  import type { RegisterSWOptions } from 'vite-plugin-pwa/types'

  export type { RegisterSWOptions }

  export function useRegisterSW(options?: RegisterSWOptions): {
    needRefresh: [boolean, StateUpdater<boolean>]
    offlineReady: [boolean, StateUpdater<boolean>]
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
