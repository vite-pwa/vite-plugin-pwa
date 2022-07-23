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
    BuildPlugin(ctx),
    DevPlugin(ctx),
  ]
}

export * from './types'
export { cachePreset } from './cache'
export { defaultInjectManifestVitePlugins } from './constants'
export type { VitePWAOptions as Options }
