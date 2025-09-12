declare module 'virtual:pwa-register/preact' {
  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-ignore ignore when preact/hooks is not installed
  import type { Dispatch, StateUpdater } from 'preact/hooks'
  import type { RegisterSWOptions } from 'vite-plugin-pwa/types'

  export type { RegisterSWOptions }

  export function useRegisterSW(options?: RegisterSWOptions): {
    needRefresh: [boolean, Dispatch<StateUpdater<boolean>>]
    offlineReady: [boolean, Dispatch<StateUpdater<boolean>>]
    /**
     * Reloads the current window to allow the service worker take the control.
     *
     * @param reloadPage From version 0.13.2+ this param is not used anymore.
     */
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>
  }
}
