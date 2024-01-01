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
  /**
   * Called when the service worker is installing for the first time.
   *
   * The service worker's `installing` event is transient:
   * - this callback is called when the service worker is installing for the first time
   * - once the service worker has been installed, the callback is called again with state `false`
   *
   * This callback will also be called once the service worker is installed with state false.
   *
   * @param state true when the service worker is installing for first time and false when installed.
   * @param sw The service worker instance.
   */
  onInstalling?: (state: boolean, sw?: ServiceWorker) => void
  /**
   * Called when a new service worker version is found and it is installing.
   *
   * The service worker's `installing` event is transient:
   * - this callback is called when a new service worker version has been detected
   * - once the new service worker has been installed, the callback is called again with state `false`
   *
   * This callback will also be called once the service worker is installed with state false.
   *
   * @param state true when the service worker is installing and false when installed.
   * @param sw The service worker instance.
   */
  onUpdateFound?: (state: boolean, sw?: ServiceWorker) => void
}
