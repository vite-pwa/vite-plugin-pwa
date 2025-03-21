import type { Plugin } from 'vite'
import type { VitePWAOptions } from './types'
import { createAPI } from './api'
import { createContext } from './context'
import { BuildPlugin } from './plugins/build'
import { DevPlugin } from './plugins/dev'
import { InfoPlugin } from './plugins/info'
import { MainPlugin } from './plugins/main'
import { AssetsPlugin } from './plugins/pwa-assets'

export function VitePWA(userOptions: Partial<VitePWAOptions> = {}): Plugin[] {
  const ctx = createContext(userOptions)
  const api = createAPI(ctx)
  return [
    MainPlugin(ctx, api),
    InfoPlugin(ctx, api),
    BuildPlugin(ctx),
    DevPlugin(ctx),
    AssetsPlugin(ctx),
  ]
}

export { cachePreset } from './cache'
export { defaultInjectManifestVitePlugins } from './constants'
export * from './types'
export type { VitePWAOptions as Options }
