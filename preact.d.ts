declare module 'virtual:pwa-register/preact' {
  // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
  // @ts-ignore ignore when preact/hooks is not installed
  import type { StateUpdater } from 'preact/hooks'

  import type { RegisterSWOptions } from 'vite-plugin-pwa/register-options'

  export function useRegisterSW(options?: RegisterSWOptions): {
    needRefresh: [boolean, StateUpdater<boolean>]
    offlineReady: [boolean, StateUpdater<boolean>]
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>
  }
}
