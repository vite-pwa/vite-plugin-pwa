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
