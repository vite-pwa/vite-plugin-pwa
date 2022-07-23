import type { Plugin } from 'vite'
import { createContext } from './context'
import type { VitePWAOptions } from './types'
import { BuildPlugin } from './plugins/build'
import { DevPlugin } from './plugins/dev'
import { MainPlugin } from './plugins/main'

export function VitePWA(userOptions: Partial<VitePWAOptions> = {}): Plugin[] {
  const ctx = createContext(userOptions)
  return [
    MainPlugin(ctx),
    BuildPlugin('post', ctx),
    DevPlugin(ctx),
  ]
}

export function ViteSvelteKitPWA(userOptions: Partial<VitePWAOptions> = {}): Plugin[] {
  const ctx = createContext(userOptions)
  return [
    MainPlugin(ctx),
    // - We need the build plugin to run before the kit plugin.
    // - The `closeBundle` hook in kit plugin will call the adapter,
    //   it will copy the kit build output folder, and so,
    //   we need the sw generated before the adapter call.
    // - If the build plugin runs after the kit plugin, the sw will
    //   be not copied to the adapter output)
    BuildPlugin('pre', ctx),
    DevPlugin(ctx),
  ]
}

export * from './types'
export { cachePreset } from './cache'
export { defaultInjectManifestVitePlugins } from './constants'
export type { VitePWAOptions as Options }
