import type { ResolvedConfig } from 'vite'
import { version } from '../package.json'
import type { PWAAssetsGenerator, ResolvedVitePWAOptions, VitePWAOptions } from './types'

export interface PWAPluginContext {
  version: string
  viteConfig: ResolvedConfig
  userOptions: Partial<VitePWAOptions>
  options: ResolvedVitePWAOptions
  useImportRegister: boolean
  devEnvironment: boolean
  assets: () => Promise<PWAAssetsGenerator | undefined>
}

export function createContext(userOptions: Partial<VitePWAOptions>): PWAPluginContext {
  return {
    version,
    userOptions,
    options: undefined!,
    viteConfig: undefined!,
    useImportRegister: false,
    devEnvironment: false,
    assets: () => Promise.resolve(undefined),
  }
}
