import type { ResolvedConfig } from 'vite'
import type { PWAAssetsGenerator } from './pwa-assets/types'
import type { ResolvedVitePWAOptions, VitePWAOptions } from './types'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

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
  const _dirname = typeof __dirname !== 'undefined'
    ? __dirname
    : dirname(fileURLToPath(import.meta.url))
  const { version } = JSON.parse(
    readFileSync(resolve(_dirname, '../package.json'), 'utf-8'),
  )
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
