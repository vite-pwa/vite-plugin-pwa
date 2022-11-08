declare module 'virtual:pwa-register/solid' {
  // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
  // @ts-ignore ignore when solid-js is not installed
  import type { Accessor, Setter } from 'solid-js'

  export interface RegisterSWOptions {
    immediate?: boolean
    onNeedRefresh?: () => void
    onOfflineReady?: () => void
    /**
     * Called only if `onRegisteredSW` is not provided.
     *
     * @deprecated Use `onRegisteredSW` instead.
     * @param registration The service worker registration if available.
     */
    onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void
    /**
     * Called once the service worker is registered (requires version `0.12.8+`).
     *
     * @param swScriptUrl The service worker script url.
     * @param registration The service worker registration if available.
     */
    onRegisteredSW?: (swScriptUrl: string, registration: ServiceWorkerRegistration | undefined) => void
    onRegisterError?: (error: any) => void
  }

  export function useRegisterSW(options?: RegisterSWOptions): {
    needRefresh: [Accessor<boolean>, Setter<boolean>]
    offlineReady: [Accessor<boolean>, Setter<boolean>]
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>
  }
}
