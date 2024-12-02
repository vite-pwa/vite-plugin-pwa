declare module 'virtual:pwa-register/react' {
  // eslint-disable-next-line ts/prefer-ts-expect-error
  // @ts-ignore ignore when react is not installed
  import type { Dispatch, SetStateAction } from 'react'
  import type { RegisterSWOptions } from 'vite-plugin-pwa/types'

  export type { RegisterSWOptions }

  export function useRegisterSW(options?: RegisterSWOptions): {
    needRefresh: [boolean, Dispatch<SetStateAction<boolean>>]
    offlineReady: [boolean, Dispatch<SetStateAction<boolean>>]
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
