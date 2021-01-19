import type { Plugin, ResolvedConfig } from 'vite'
import { generateSW, injectManifest } from 'workbox-build'
import { injectServiceWorker } from './html'
import { ResolvedVitePWAOptions, VitePWAOptions } from './types'
import { resolveOptions } from './config'
import { join } from 'path';

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
      const base = viteConfig!.build.base;
      const basePath = base.startsWith('/') ? `/${base}` : base;
      bundle['manifest.webmanifest'] = {
        isAsset: true,
        type: 'asset',
        name: undefined,
        source: `${JSON.stringify(resolvedOptions!.manifest, null, 2)}\n`,
        fileName: 'manifest.webmanifest',
      }
      if (!resolvedOptions!.inlineScript) {
        bundle['registerServiceWorker.js'] = {
          isAsset: true,
          type: 'asset',
          name: undefined,
          source: `if('serviceWorker' in navigator) { window.addEventListener('load', () => { navigator.serviceWorker.register('${join(basePath,resolvedOptions!.filename)}', { scope: './' })})}`.replace(/(?:\r\n|\r|\n)/g, ''),
          fileName: 'registerServiceWorker.js',
        };
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
