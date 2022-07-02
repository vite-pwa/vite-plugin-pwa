import { resolve } from 'path'
import { existsSync } from 'fs'
import type { OutputBundle } from 'rollup'
import { generateInjectManifest, generateServiceWorker } from './modules'
import { generateWebManifestFile } from './assets'
import { FILE_SW_REGISTER } from './constants'
import { generateSimpleSWRegister } from './html'
import type { PWAPluginContext } from './context'

export async function _generateSW({ options, viteConfig }: PWAPluginContext) {
  if (options.disable)
    return

  if (options.strategies === 'injectManifest')
    await generateInjectManifest(options, viteConfig)
  else
    await generateServiceWorker(options, viteConfig)
}

export function _generateBundle({ options, viteConfig, useImportRegister }: PWAPluginContext, bundle: OutputBundle) {
  if (options.disable)
    return

  if (options.manifest) {
    bundle[options.manifestFilename] = {
      isAsset: true,
      type: 'asset',
      name: undefined,
      source: generateWebManifestFile(options),
      fileName: options.manifestFilename,
    }
  }

  // if virtual register is requested, do not inject.
  if (options.injectRegister === 'auto')
    options.injectRegister = useImportRegister ? null : 'script'

  if (options.injectRegister === 'script' && !existsSync(resolve(viteConfig.publicDir, FILE_SW_REGISTER))) {
    bundle[FILE_SW_REGISTER] = {
      isAsset: true,
      type: 'asset',
      name: undefined,
      source: generateSimpleSWRegister(options, false),
      fileName: FILE_SW_REGISTER,
    }
  }
  return bundle
}
