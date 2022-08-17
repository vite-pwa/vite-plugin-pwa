import type { Plugin } from 'vite'
import { createContext } from './context'
import type { VitePWAOptions } from './types'
import { BuildPlugin } from './plugins/build'
import { DevPlugin } from './plugins/dev'
import { MainPlugin } from './plugins/main'
import { createBuildEndHook } from './integrations/vitepress'

export function VitePWA(userOptions: Partial<VitePWAOptions> = {}): Plugin[] {
  const ctx = createContext(userOptions)
  return [
    MainPlugin(ctx),
    BuildPlugin(ctx),
    DevPlugin(ctx),
  ]
}

export function VitePressPWA(userOptions: Partial<VitePWAOptions> = {}): {
  VitePWAPlugin: Plugin[]
  buildEnd: (siteConfig: any) => Promise<void>
} {
  return {
    VitePWAPlugin: VitePWA(userOptions),
    buildEnd: createBuildEndHook(userOptions),
  }
}

export * from './types'
export { cachePreset } from './cache'
export { defaultInjectManifestVitePlugins } from './constants'
export type { VitePWAOptions as Options }
