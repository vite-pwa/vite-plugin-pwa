import fs from 'fs'
import { resolve } from 'path'
import type { Plugin, ResolvedConfig } from 'vite'
import { generateSW, GenerateSWConfig } from 'workbox-build'
import { ManifestOptions, VitePWAOptions } from './types'

export function VitePWA(options: Partial<VitePWAOptions> = {}): Plugin {
  const root = options.root || process.cwd()
  const pkg = JSON.parse(fs.readFileSync(resolve(root, 'package.json'), 'utf-8'))
  const outDir = options.outDir || 'dist'

  const defaultWorkbox: GenerateSWConfig = {
    swDest: `${outDir}/sw.js`,
    globDirectory: outDir,
    offlineGoogleAnalytics: false,
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

  const workbox = Object.assign({}, defaultWorkbox, options.workbox || {})
  const manifest = Object.assign({}, defaultManifest, options.manifest || {})
  let viteConfig: ResolvedConfig | undefined

  return {
    name: 'vite-plugin-pwa',
    enforce: 'post',
    configResolved(config) {
      viteConfig = config
    },
    transformIndexHtml: {
      enforce: 'post',
      transform(html) {
        if (!viteConfig?.isProduction)
          return html

        return html.replace(
          '</head>',
          `
<link rel="manifest" href="/manifest.webmanifest">
<script>
  if('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js', { scope: './' })
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
      generateSW(workbox)
    },
  }
}

export type { VitePWAOptions as Options }
