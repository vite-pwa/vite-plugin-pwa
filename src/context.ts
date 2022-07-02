import type { ResolvedConfig } from 'vite'
import type { ResolvedVitePWAOptions, VitePWAOptions } from './types'
import { resolveOptions } from './options'

export interface PWAPluginContext {
  viteConfig: ResolvedConfig
  options: ResolvedVitePWAOptions
  useImportRegister: boolean
}

export type PWAPluginContextResolver = () => PWAPluginContext

export async function resolvePWAPluginContext(viteConfig: ResolvedConfig, userOptions: Partial<VitePWAOptions>) {
  return <PWAPluginContext>{
    viteConfig,
    options: await resolveOptions(userOptions, viteConfig),
    useImportRegister: false,
  }
}
