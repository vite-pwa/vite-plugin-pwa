export const FILE_MANIFEST = 'manifest.webmanifest'
export const FILE_SW_REGISTER = 'registerSW.js'

export const VIRTUAL_MODULES_MAP: Record<string, string> = {
  'vite-plugin-pwa-register': 'register',
  'vite-plugin-pwa-register/vue': 'vue',
}
export const VIRTUAL_MODULES = Object.keys(VIRTUAL_MODULES_MAP)
