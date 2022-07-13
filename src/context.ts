import type { ResolvedConfig } from 'vite'
import type { ResolvedVitePWAOptions, VitePWAOptions } from './types'

let pwaPluginIsSvelteKitPluginPresent = false

export interface PWAPluginContext {
  viteConfig: ResolvedConfig
  userOptions: Partial<VitePWAOptions>
  options: ResolvedVitePWAOptions
  useImportRegister: boolean
  isSvelteKitPluginPresent: () => boolean
  lookupSvelteKitPluginPresent: () => void
}

export function createContext(userOptions: Partial<VitePWAOptions>): PWAPluginContext {
  return {
    userOptions,
    options: undefined!,
    viteConfig: undefined!,
    useImportRegister: false,
    isSvelteKitPluginPresent() {
      return pwaPluginIsSvelteKitPluginPresent
    },
    lookupSvelteKitPluginPresent() {
      pwaPluginIsSvelteKitPluginPresent = !!this.viteConfig.plugins.find(p => p.name === 'vite-plugin-svelte-kit')
    },
  }
}
