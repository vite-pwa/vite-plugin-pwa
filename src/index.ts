import fs, { promises as fsp } from 'fs'
import path from 'path'
import { generateSW } from 'rollup-plugin-workbox'
import type { Plugin } from 'vite'
import { GenerateSWConfig } from 'workbox-build'
import { HTMLTransformer } from './transformers/html'
import { ManifestOptions, VitePWAOptions } from './types'

export function VitePWA(options: Partial<VitePWAOptions> = {}): Plugin {
  const root = options.root || process.cwd()
  const pkg = JSON.parse(fs.readFileSync(path.resolve(root, 'package.json'), 'utf-8'))
  const outDir = options.outDir || 'dist'

  const defaultWorkbox: GenerateSWConfig = {
    swDest: `${outDir}/sw.js`,
    globDirectory: outDir,
    offlineGoogleAnalytics: false,
    mode: process.env.NODE_ENV,
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

  const resolvedOptions: VitePWAOptions = {
    workbox,
    manifest,
  }

  return {
    indexHtmlTransforms: [HTMLTransformer(resolvedOptions)],
    rollupInputOptions: {
      pluginsPostBuild: [
        generateSW(workbox),
        {
          name: 'vite-plugin-pwa-manifest',
          async writeBundle() {
            fsp.writeFile(`${outDir}/manifest.webmanifest`, `${JSON.stringify(manifest, null, 2)}\n`, 'utf-8')
          },
        },
      ],
    },
  }
}

export type { VitePWAOptions as Options }
