import type { Plugin } from 'vite'
import type { VitePWAOptions } from './types'
import { CreatePlugin } from './plugins'
import { BuildPlugin } from './plugins/build'
import { DevPlugin } from './plugins/dev'

export function VitePWA(userOptions: Partial<VitePWAOptions> = {}): Plugin[] {
  const [contextResolver, VirtualPlugin] = CreatePlugin(userOptions)
  return [
    VirtualPlugin,
    BuildPlugin(contextResolver),
    DevPlugin(contextResolver),
  ]
}

export * from './types'
export { cachePreset } from './cache'
export { defaultInjectManifestVitePlugins } from './constants'
export type { VitePWAOptions as Options }
