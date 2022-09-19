export const FILE_SW_REGISTER = 'registerSW.js'

export const VIRTUAL_MODULES_MAP: Record<string, string> = {
  'virtual:pwa-register': 'register',
  'virtual:pwa-register/vue': 'vue',
  'virtual:pwa-register/svelte': 'svelte',
  'virtual:pwa-register/react': 'react',
  'virtual:pwa-register/preact': 'preact',
  'virtual:pwa-register/solid': 'solid',
}
export const VIRTUAL_MODULES_RESOLVE_PREFIX = '/@vite-plugin-pwa/'
export const VIRTUAL_MODULES = Object.keys(VIRTUAL_MODULES_MAP)
export const defaultInjectManifestVitePlugins = [
  'alias',
  'commonjs',
  'vite:resolve',
  'vite:esbuild',
  'replace',
  'vite:define',
  'rollup-plugin-dynamic-import-variables',
  'vite:esbuild-transpile',
  'vite:json',
  'vite:terser',
]

export const PWA_INFO_VIRTUAL = 'virtual:pwa-info'
export const RESOLVED_PWA_INFO_VIRTUAL = `\0${PWA_INFO_VIRTUAL}`

export const DEV_SW_NAME = 'dev-sw.js?dev-sw'
export const DEV_SW_VIRTUAL = `${VIRTUAL_MODULES_RESOLVE_PREFIX}pwa-entry-point-loaded`
export const RESOLVED_DEV_SW_VIRTUAL = `\0${DEV_SW_VIRTUAL}`
export const DEV_READY_NAME = 'vite-pwa-plugin:dev-ready'
export const DEV_REGISTER_SW_NAME = 'vite-plugin-pwa:register-sw'

