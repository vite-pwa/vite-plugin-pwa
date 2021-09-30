import { resolve } from 'path'
import { existsSync } from 'fs'
import type { OutputBundle } from 'rollup'
import type { Plugin, ResolvedConfig } from 'vite'
import { generateSimpleSWRegister, injectServiceWorker } from './html'
import { generateInjectManifest, generateServiceWorker, generateRegisterSW } from './modules'
import { ExtendManifestEntriesHook, ResolvedVitePWAOptions, VitePluginPWAAPI, VitePWAOptions } from './types'
import { resolveOptions } from './options'
import { generateWebManifestFile } from './assets'
import { FILE_MANIFEST, FILE_SW_REGISTER, VIRTUAL_MODULES, VIRTUAL_MODULES_MAP, VIRTUAL_MODULES_RESOLVE_PREFIX } from './constants'

export function VitePWA(userOptions: Partial<VitePWAOptions> = {}): Plugin[] {
  let viteConfig: ResolvedConfig
  let options: ResolvedVitePWAOptions
  let useImportRegister = false

  async function _generateSW() {
    if (options.strategies === 'injectManifest')
      await generateInjectManifest(options, viteConfig)
    else
      await generateServiceWorker(options, viteConfig)
  }

  function _generateBundle(bundle: OutputBundle = {}) {
    if (options.manifest) {
      bundle[FILE_MANIFEST] = {
        isAsset: true,
        type: 'asset',
        name: undefined,
        source: generateWebManifestFile(options),
        fileName: FILE_MANIFEST,
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
        source: generateSimpleSWRegister(options),
        fileName: FILE_SW_REGISTER,
      }
    }
    return bundle
  }

  return [
    {
      name: 'vite-plugin-pwa',
      enforce: 'post',
      apply: 'build',
      async configResolved(config) {
        viteConfig = config
        options = await resolveOptions(userOptions, viteConfig)
      },
      transformIndexHtml: {
        enforce: 'post',
        transform(html) {
          return injectServiceWorker(html, options)
        },
      },
      generateBundle(_, bundle) {
        _generateBundle(bundle)
      },
      async closeBundle() {
        if (!viteConfig.build.ssr)
          await _generateSW()
      },
      async buildEnd(error) {
        if (error)
          throw error
      },
      api: <VitePluginPWAAPI>{
        generateBundle: _generateBundle,
        generateSW: _generateSW,
        extendManifestEntries(fn: ExtendManifestEntriesHook) {
          const configField = options.strategies === 'generateSW' ? 'workbox' : 'injectManifest'
          const result = fn(options[configField].additionalManifestEntries || [])

          if (result != null)
            options[configField].additionalManifestEntries = result
        },
      },
    },
    {
      name: 'vite-plugin-pwa:virtual',
      async configResolved(config) {
        viteConfig = config
        options = await resolveOptions(userOptions, viteConfig)
      },
      resolveId(id) {
        return VIRTUAL_MODULES.includes(id) ? VIRTUAL_MODULES_RESOLVE_PREFIX + id : undefined
      },
      load(id) {
        if (id.startsWith(VIRTUAL_MODULES_RESOLVE_PREFIX))
          id = id.slice(VIRTUAL_MODULES_RESOLVE_PREFIX.length)
        else
          return

        if (VIRTUAL_MODULES.includes(id)) {
          useImportRegister = true
          return generateRegisterSW(
            options,
            viteConfig.command === 'build' ? 'build' : 'dev',
            VIRTUAL_MODULES_MAP[id],
          )
        }
      },
    },
  ]
}

export * from './types'
export { cachePreset } from './cache'
export type { VitePWAOptions as Options }
