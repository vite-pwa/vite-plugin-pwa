import type { ResolvedConfig } from 'vite'
import type { ResolvedVitePWAOptions, VitePWAOptions } from './types'
import { VITE_PLUGIN_SVELTE_KIT_NAME } from './constants'

export interface PWAPluginContext {
  viteConfig: ResolvedConfig
  userOptions: Partial<VitePWAOptions>
  options: ResolvedVitePWAOptions
  useImportRegister: boolean
  hasSvelteKitPlugin: () => boolean
}

export function createContext(userOptions: Partial<VitePWAOptions>): PWAPluginContext {
  return {
    userOptions,
    options: undefined!,
    viteConfig: undefined!,
    useImportRegister: false,
    hasSvelteKitPlugin() {
      return Boolean(this.viteConfig.plugins.find(p => p.name === VITE_PLUGIN_SVELTE_KIT_NAME))
    },
  }
}
