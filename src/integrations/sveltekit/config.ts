import type { ResolvedConfig } from 'vite'
import type { ManifestTransform } from 'workbox-build'
import type { BasePartial, GlobPartial, RequiredGlobDirectoryPartial } from 'workbox-build/src/types'
import type { SvelteKitVitePluginOptions, VitePWAOptions } from '../../types'

// Vite generates <name>.<hash>.<ext> layout while SvelteKit generates <name>-<hash>.<ext>
// Vite and SvelteKit are not aligned: pwa plugin will use /\.[a-f0-9]{8}\./ by default: #164 optimize workbox work

interface WorkboxConfig extends BasePartial, GlobPartial, RequiredGlobDirectoryPartial {}

// All assets will go to the immutable folder, and so, there is no need to calculate its revision for the sw's precache manifest
export function configureSvelteKitOptions(viteOptions: ResolvedConfig, options: Partial<VitePWAOptions>) {
  const {
    base = viteOptions.build.base ?? '/',
    adapterFallback,
  } = options.svelteKitVitePluginOptions ?? {}

  if (typeof options.includeManifest === 'undefined')
    options.includeManifest = 'client-build'

  if (typeof options.iconsFolder === 'undefined')
    options.iconsFolder = 'static'

  let config: WorkboxConfig

  if (options.strategies === 'injectManifest') {
    options.injectManifest = options.injectManifest ?? {}
    config = options.injectManifest as WorkboxConfig
  }
  else {
    options.workbox = options.workbox ?? {}
    if (!options.workbox.navigateFallback)
      options.workbox.navigateFallback = adapterFallback ?? base

    config = options.workbox as WorkboxConfig
  }

  if (!config.globDirectory)
    config.globDirectory = '.svelte-kit/output'

  if (!config.modifyURLPrefix) {
    config.globPatterns = buildGlobPatterns(config.globPatterns)
    config.globIgnores = buildGlobIgnores(config.globIgnores)
  }

  if (!config.dontCacheBustURLsMatching)
    config.dontCacheBustURLsMatching = /-[a-f0-9]{8}\./

  if (!config.manifestTransforms)
    config.manifestTransforms = [createManifestTransform(base, options.svelteKitVitePluginOptions)]
}

function createManifestTransform(base: string, options?: SvelteKitVitePluginOptions): ManifestTransform {
  return async (entries) => {
    const suffix = options?.trailingSlash === 'always' ? '/' : ''
    let adapterFallback = options?.adapterFallback
    let excludeFallback = false
    if (!adapterFallback) {
      adapterFallback = 'prerendered/fallback.html'
      excludeFallback = true
    }

    const manifest = entries.filter(({ url }) => !(excludeFallback && url === adapterFallback)).map((e) => {
      let url = e.url
      if (url.startsWith('client/'))
        url = url.slice(7)
      else if (url.startsWith('prerendered/pages/'))
        url = url.slice(18)
      else if (url.startsWith('prerendered/'))
        url = url.slice(12)

      if (url.endsWith('.html')) {
        if (url.startsWith('/'))
          url = url.slice(1)

        e.url = url === 'index.html' ? `${base}` : `${base}${url.slice(0, url.lastIndexOf('.'))}${suffix}`
      }
      else {
        e.url = url
      }

      return e
    })

    return { manifest }
  }
}

function buildGlobPatterns(globPatterns?: string[]): string[] {
  if (globPatterns) {
    if (!globPatterns.some(g => g.startsWith('prerendered/')))
      globPatterns.push('prerendered/**/*.html')

    if (!globPatterns.some(g => g.startsWith('client/')))
      globPatterns.push('client/**/*.{js,css,ico,png,svg,webp}')

    return globPatterns
  }

  return ['client/**/*.{js,css,ico,png,svg,webp}', 'prerendered/**/*.html']
}

function buildGlobIgnores(globIgnores?: string[]): string[] {
  if (globIgnores) {
    if (!globIgnores.some(g => g.startsWith('server/')))
      globIgnores.push('server/**')

    return globIgnores
  }

  return ['server/**']
}
