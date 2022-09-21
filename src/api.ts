import { resolve } from 'path'
import { existsSync } from 'fs'
import type { OutputBundle } from 'rollup'
import { generateInjectManifest, generateServiceWorker } from './modules'
import { generateWebManifestFile } from './assets'
import { DEV_SW_NAME, FILE_SW_REGISTER } from './constants'
import {
  generateRegisterDevSW,
  generateRegisterSW,
  generateSimpleSWRegister,
  generateWebManifest,
} from './html'
import type { PWAPluginContext } from './context'
import type { ExtendManifestEntriesHook, VitePluginPWAAPI } from './types'

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
    get pwaInDevEnvironment() {
      return ctx?.devEnvironment === true
    },
    webManifestData() {
      const options = ctx?.options
      if (!options || options.disable || !options.manifest || (ctx.devEnvironment && !ctx.options.devOptions.enabled))
        return undefined

      let url = options.manifestFilename
      let manifest: string
      if (ctx.devEnvironment && ctx.options.devOptions.enabled === true) {
        url = ctx.options.devOptions.webManifestUrl ?? options.manifestFilename
        manifest = generateWebManifest(options, true)
      }
      else {
        manifest = generateWebManifest(options, false)
      }

      return {
        href: `${options.base}${url}`,
        useCredentials: ctx.options.useCredentials,
        toLinkTag() {
          return manifest
        },
      }
    },
    registerSWData() {
      // we'll return the info only when it is required
      // 1: exclude if not enabled
      const options = ctx?.options
      if (!options || options.disable || (ctx.devEnvironment && !ctx.options.devOptions.enabled))
        return undefined

      // 2: if manual registration or using virtual
      const mode = options.injectRegister
      if (!mode || ctx.useImportRegister)
        return undefined

      // 3: otherwise we always return the info
      let type: WorkerType = 'classic'
      let script: string | undefined
      let shouldRegisterSW = options.injectRegister === 'inline' || options.injectRegister === 'script'
      if (ctx.devEnvironment && ctx.options.devOptions.enabled === true) {
        type = ctx.options.devOptions.type ?? 'classic'
        script = generateRegisterDevSW()
        shouldRegisterSW = true
      }
      else if (shouldRegisterSW) {
        script = generateRegisterSW(options, false)
      }

      return {
        // hint when required
        shouldRegisterSW,
        inline: options.injectRegister === 'inline',
        scope: options.scope,
        inlinePath: `${options.base}${ctx.devEnvironment ? DEV_SW_NAME : options.filename}`,
        registerPath: `${options.base}${FILE_SW_REGISTER}`,
        type,
        toScriptTag() {
          return script
        },
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
