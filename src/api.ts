import { resolve } from 'path'
import { existsSync } from 'fs'
import type { OutputBundle } from 'rollup'
import { generateInjectManifest, generateServiceWorker } from './modules'
import { generateWebManifestFile } from './assets'
import { DEV_SW_NAME, FILE_SW_REGISTER } from './constants'
import { generateSimpleSWRegister } from './html'
import type { PWAPluginContext } from './context'
import type { ExtendManifestEntriesHook, RegisterSWData, VitePluginPWAAPI } from './types'

export async function _generateSW({ options, viteConfig }: PWAPluginContext) {
  if (options.disable)
    return

  if (options.strategies === 'injectManifest')
    await generateInjectManifest(options, viteConfig)
  else
    await generateServiceWorker(options, viteConfig)
}

export function _generateBundle({ options, viteConfig, useImportRegister }: PWAPluginContext, bundle?: OutputBundle) {
  if (options.disable || !bundle)
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

export function createAPI(ctx: PWAPluginContext): VitePluginPWAAPI {
  return {
    get disabled() {
      return ctx?.options?.disable
    },
    get webManifestUrl() {
      const options = ctx?.options
      if (!options || options.disable)
        return undefined

      return `${options.base}/${options.manifestFilename}`
    },
    registerSWData() {
      const options = ctx?.options
      if (!options || options.disable)
        return undefined

      const mode = options.injectRegister
      if (mode === false || !mode)
        return undefined

      return <RegisterSWData>{
        inline: options.injectRegister === 'inline',
        scope: options.scope,
        inlinePath: `${options.base}${DEV_SW_NAME}`,
        registerPath: `${options.base}${FILE_SW_REGISTER}`,
      }
    },
    generateBundle(bundle) {
      return _generateBundle(ctx, bundle)
    },
    async generateSW() {
      return await _generateSW(ctx)
    },
    extendManifestEntries(fn: ExtendManifestEntriesHook) {
      const { options } = ctx
      if (options.disable)
        return

      const configField = options.strategies === 'generateSW' ? 'workbox' : 'injectManifest'
      const result = fn(options[configField].additionalManifestEntries || [])

      if (result != null)
        options[configField].additionalManifestEntries = result
    },
  }
}
