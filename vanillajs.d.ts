declare module 'virtual:pwa-register' {
  import type { RegisterSWOptions } from 'vite-plugin-pwa/types'

  export type { RegisterSWOptions }

  /**
   * Registers the service worker returning a callback to reload the current page when an update is found.
   *
   * @param options the options to register the service worker.
   * @return (reloadPage?: boolean) => Promise<void> From version 0.14.0+ `reloadPage` param is not used anymore.
   */
  export function registerSW(options?: RegisterSWOptions): {
    (): Promise<void>
    /**
     * @deprecated The `reloadPage` param is not used anymore sice 0.14.0
     */
    (reloadPage: boolean): Promise<void>
  }
}
