import type { Plugin, ResolvedConfig } from 'vite'
import { generateSW, injectManifest } from 'workbox-build'
import { injectServiceWorker } from './html'
import { ResolvedVitePWAOptions, VitePWAOptions } from './types'
import { resolveOptions } from './config'

export function VitePWA(options: Partial<VitePWAOptions> = {}): Plugin {
  let viteConfig: ResolvedConfig | undefined
  let resolvedOptions: ResolvedVitePWAOptions | undefined

  return {
    name: 'vite-plugin-pwa',
    enforce: 'post',
    apply: 'build',
    configResolved(config) {
      viteConfig = config
      resolvedOptions = resolveOptions(options, viteConfig)
    },
    transformIndexHtml: {
      enforce: 'post',
      transform(html) {
        const base = viteConfig!.build.base
        return injectServiceWorker(html, base, resolvedOptions!)
      },
    },
    generateBundle(_, bundle) {
      bundle['manifest.webmanifest'] = {
        isAsset: true,
        type: 'asset',
        name: undefined,
        source: `${JSON.stringify(resolvedOptions!.manifest, null, 2)}\n`,
        fileName: 'manifest.webmanifest',
      }
    },
    buildEnd() {
      const strategies = resolvedOptions!.strategies
      if (strategies === 'generateSW')
        generateSW(resolvedOptions!.workbox)
      if (strategies === 'injectManifest')
        injectManifest(resolvedOptions!.injectManifest)
    },
  }
}

export type { VitePWAOptions as Options }
