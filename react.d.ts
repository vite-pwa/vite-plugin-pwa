declare module 'virtual:pwa-register/react' {
  // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
  // @ts-ignore ignore when react is not installed
  import type { Dispatch, SetStateAction } from 'react'

  export function useRegisterSW(options?: import('./types/register-options').RegisterSWOptions): {
    needRefresh: [boolean, Dispatch<SetStateAction<boolean>>]
    offlineReady: [boolean, Dispatch<SetStateAction<boolean>>]
    /**
     * Reloads the current window to allow the service worker take the control.
     *
     * @param reloadPage From version 0.13.2+ this param is not used anymore.
     */
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>
  }
}
