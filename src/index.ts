import { join } from 'path'
import { existsSync } from 'fs'
import type { Plugin, ResolvedConfig } from 'vite'
import { generateSW, injectManifest } from 'workbox-build'
import { CustomPluginOptions, LoadResult, ResolveIdResult } from 'rollup'
import { generateSWRegister, injectServiceWorker } from './html'
import { generateRegisterSW } from './modules'
import { ResolvedVitePWAOptions, VitePWAOptions } from './types'
import { resolveOptions } from './config'
import { FILE_MANIFEST, FILE_SW_REGISTER } from './constants'

export function VitePWA(userOptions: Partial<VitePWAOptions> = {}): Plugin {
  let viteConfig: ResolvedConfig
  let options: ResolvedVitePWAOptions
  let virtualFileId: string | undefined

  return {
    name: 'vite-plugin-pwa',
    enforce: 'post',
    apply: 'build',
    configResolved(config) {
      viteConfig = config
      options = resolveOptions(userOptions, viteConfig)
      virtualFileId = options.injectRegister === 'register' ? 'vite-plugin-pwa-register' : undefined
    },
    transformIndexHtml: {
      enforce: 'post',
      transform(html) {
        return injectServiceWorker(html, options)
      },
    },
    generateBundle(_, bundle) {
      bundle[FILE_MANIFEST] = {
        isAsset: true,
        type: 'asset',
        name: undefined,
        source: `${JSON.stringify(options.manifest, null, options.minify ? 0 : 2)}\n`,
        fileName: FILE_MANIFEST,
      }
      if (options.injectRegister === 'import' && !existsSync(join(viteConfig.root, 'public', FILE_SW_REGISTER))) {
        bundle[FILE_SW_REGISTER] = {
          isAsset: true,
          type: 'asset',
          name: undefined,
          source: generateSWRegister(options),
          fileName: FILE_SW_REGISTER,
        }
      }
    },
    async closeBundle() {
      if (!viteConfig.build.ssr) {
        if (options.strategies === 'injectManifest')
          await injectManifest(options.injectManifest)
        else
          await generateSW(options.workbox)
      }
    },
    resolveId(source: string, importer: string | undefined, options: { custom?: CustomPluginOptions }, ssr?: boolean): Promise<ResolveIdResult> | ResolveIdResult {
      return virtualFileId === 'vite-plugin-pwa-register' && !ssr ? virtualFileId : undefined
    },
    load(id: string, ssr?: boolean): Promise<LoadResult> | LoadResult {
      return virtualFileId && id === virtualFileId && !ssr ? generateRegisterSW(options) : undefined
    },
  }
}

export type { VitePWAOptions as Options }
