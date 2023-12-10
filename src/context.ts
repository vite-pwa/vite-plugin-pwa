import type { ResolvedConfig } from 'vite'
import type { ResolvedPWAAssets, ResolvedVitePWAOptions, VitePWAOptions } from './types'

export interface PWAPluginContext {
  viteConfig: ResolvedConfig
  userOptions: Partial<VitePWAOptions>
  options: ResolvedVitePWAOptions
  useImportRegister: boolean
  devEnvironment: boolean
  disableAssets: boolean
  assets: Promise<ResolvedPWAAssets | undefined>
}

export function createContext(userOptions: Partial<VitePWAOptions>): PWAPluginContext {
  return {
    userOptions,
    options: undefined!,
    viteConfig: undefined!,
    useImportRegister: false,
    devEnvironment: false,
    disableAssets: true,
    assets: Promise.resolve(undefined),
  }
}
