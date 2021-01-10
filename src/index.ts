import fs from 'fs'
import { resolve } from 'path'
import type { Plugin, ResolvedConfig } from 'vite'
import { generateSW, GenerateSWConfig } from 'workbox-build'
import { cachePreset } from './cache'
import { ManifestOptions, VitePWAOptions } from './types'

export function VitePWA(options: Partial<VitePWAOptions> = {}): Plugin {
  const outDir = options.outDir || 'dist'

  let viteConfig: ResolvedConfig | undefined
  let workbox: GenerateSWConfig | undefined
  let manifest: Partial<ManifestOptions> = {}

  return {
    name: 'vite-plugin-pwa',
    enforce: 'post',
    configResolved(config) {
      viteConfig = config
      const root = viteConfig.root
      const pkg = fs.existsSync('package.json')
        ? JSON.parse(fs.readFileSync('package.json', 'utf-8'))
        : {}

      const defaultWorkbox: GenerateSWConfig = {
        swDest: resolve(root, `${outDir}/sw.js`),
        globDirectory: resolve(root, outDir),
        offlineGoogleAnalytics: false,
        runtimeCaching: cachePreset,
        // prevent tsup replacing `process.env`
        // eslint-disable-next-line dot-notation
        mode: process['env']['NODE_ENV'] || 'production',
      }

      const defaultManifest: Partial<ManifestOptions> = {
        name: pkg.name,
        short_name: pkg.name,
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        lang: 'en',
      }

      workbox = Object.assign({}, defaultWorkbox, options.workbox || {})
      manifest = Object.assign({}, defaultManifest, options.manifest || {})
    },
    transformIndexHtml: {
      enforce: 'post',
      transform(html) {
        if (viteConfig!.command !== 'build')
          return html

        return html.replace(
          '</head>',
          `
<link rel="manifest" href="/manifest.webmanifest">
<script>
  if('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('${workbox!.swDest.replace(outDir, '')}', { scope: './' })
    })
  }
</script>
</head>`,
        )
      },
    },
    generateBundle(_, bundle) {
      bundle['manifest.webmanifest'] = {
        isAsset: true,
        type: 'asset',
        name: undefined,
        source: `${JSON.stringify(manifest, null, 2)}\n`,
        fileName: 'manifest.webmanifest',
      }
    },
    buildEnd() {
      generateSW(workbox!)
    },
  }
}

export type { VitePWAOptions as Options }
