declare module 'virtual:pwa-register' {
  import type { RegisterSWOptions } from 'vite-plugin-pwa/register-options'

  export function registerSW(options?: RegisterSWOptions): (reloadPage?: boolean) => Promise<void>
}
