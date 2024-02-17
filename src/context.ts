import type { ResolvedConfig } from 'vite'
import { version } from '../package.json'
import type { ResolvedVitePWAOptions, VitePWAOptions } from './types'
import type { PWAAssetsGenerator } from './pwa-assets/types'

export interface PWAPluginContext {
  version: string
  viteConfig: ResolvedConfig
  userOptions: Partial<VitePWAOptions>
  options: ResolvedVitePWAOptions
  useImportRegister: boolean
  devEnvironment: boolean
  pwaAssetsGenerator: Promise<PWAAssetsGenerator | undefined>
}

export function createContext(userOptions: Partial<VitePWAOptions>): PWAPluginContext {
  return {
    version,
    userOptions,
    options: undefined!,
    viteConfig: undefined!,
    useImportRegister: false,
    devEnvironment: false,
    pwaAssetsGenerator: Promise.resolve(undefined),
  }
}
