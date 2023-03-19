declare module 'virtual:pwa-register/vue' {
  // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
  // @ts-ignore ignore when vue is not installed
  import type { Ref } from 'vue'

  import type { RegisterSWOptions } from 'vite-plugin-pwa/register-options'

  export function useRegisterSW(options?: RegisterSWOptions): {
    needRefresh: Ref<boolean>
    offlineReady: Ref<boolean>
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>
  }
}
