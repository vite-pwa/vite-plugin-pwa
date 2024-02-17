import { resolve } from 'node:path'
import { existsSync } from 'node:fs'
import type { OutputBundle } from 'rollup'
import { cyan, yellow } from 'kolorist'
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

export function _generateBundle(ctx: PWAPluginContext, bundle?: OutputBundle) {
  const { options, viteConfig, useImportRegister } = ctx
  if (options.disable || !bundle)
    return

  if (options.manifest) {
    if (!options.manifest.theme_color) {
      console.warn([
        '',
        `${cyan(`PWA v${ctx.version}`)}`,
        `${yellow('WARNING: "theme_color" is missing from the web manifest, your application will not be able to be installed')}`,
      ].join('\n'))
    }
    bundle[options.manifestFilename] = {
      // @ts-expect-error: for Vite 3 support, Vite 4 has removed `isAsset` property
      isAsset: true,
      type: 'asset',
      name: undefined,
      source: generateWebManifestFile(options),
      fileName: options.manifestFilename,
    }
  }

  // if virtual register is requested, do not inject.
  if (options.injectRegister === 'auto')
    options.injectRegister = useImportRegister ? false : 'script'

  if ((options.injectRegister === 'script' || options.injectRegister === 'script-defer') && !existsSync(resolve(viteConfig.publicDir, FILE_SW_REGISTER))) {
    bundle[FILE_SW_REGISTER] = {
      // @ts-expect-error: for Vite 3 support, Vite 4 has removed `isAsset` property
      isAsset: true,
      type: 'asset',
      name: undefined,
      source: generateSimpleSWRegister(options, false),
      fileName: FILE_SW_REGISTER,
    }
  }
  return bundle
}

export function createAPI(ctx: PWAPluginContext) {
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
        href: `${ctx.devEnvironment ? options.base : options.buildBase}${url}`,
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
      let shouldRegisterSW = options.injectRegister === 'inline' || options.injectRegister === 'script' || options.injectRegister === 'script-defer'
      if (ctx.devEnvironment && ctx.options.devOptions.enabled === true) {
        type = ctx.options.devOptions.type ?? 'classic'
        script = generateRegisterDevSW(ctx.options.base)
        shouldRegisterSW = true
      }
      else if (shouldRegisterSW) {
        script = generateRegisterSW(options, false)
      }

      const base = ctx.devEnvironment ? options.base : options.buildBase

      return {
        // hint when required
        shouldRegisterSW,
        inline: options.injectRegister === 'inline',
        mode: mode === 'auto' ? 'script' : mode,
        scope: options.scope,
        inlinePath: `${base}${ctx.devEnvironment ? DEV_SW_NAME : options.filename}`,
        registerPath: `${base}${FILE_SW_REGISTER}`,
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
    pwaAssetsGenerator() {
      return ctx.pwaAssetsGenerator
    },
  } satisfies VitePluginPWAAPI
}
