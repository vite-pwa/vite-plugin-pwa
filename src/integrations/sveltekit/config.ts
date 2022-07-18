import type { ResolvedConfig } from 'vite'
import type { ManifestTransform } from 'workbox-build'
import type { SvelteKitVitePluginOptions, VitePWAOptions } from '../../types'

// Vite generates <name>.<hash>.<ext> layout while SvelteKit generates <name>-<hash>.<ext>
// Vite and SvelteKit are not aligned: pwa plugin will use /\.[a-f0-9]{8}\./ by default: #164 optimize workbox work

// All assets will go to the immutable folder, and so, there is no need to calculate its revision for the sw's precache manifest
export function configureSvelteKitOptions(viteOptions: ResolvedConfig, options: Partial<VitePWAOptions>) {
  const {
    base = viteOptions.build.base ?? '/',
    adapterFallback,
  } = options.svelteKitVitePluginOptions ?? {}

  if (!options.outDir)
    options.outDir = './.svelte-kit/output/client'

  if (typeof options.includeManifest === 'undefined')
    options.includeManifest = 'client-build'

  if (options.strategies === 'injectManifest') {
    options.injectManifest = options.injectManifest ?? {}
    if (!options.injectManifest.globDirectory)
      options.injectManifest.globDirectory = '.svelte-kit/output'

    if (!options.injectManifest.modifyURLPrefix) {
      options.injectManifest.globPatterns = buildGlobPatterns(options.injectManifest.globPatterns)
      options.injectManifest.globIgnores = buildGlobIgnores(options.injectManifest.globIgnores)
    }

    if (!options.injectManifest.dontCacheBustURLsMatching)
      options.injectManifest.dontCacheBustURLsMatching = /-[a-f0-9]{8}\./

    if (!options.injectManifest.manifestTransforms)
      options.injectManifest.manifestTransforms = [createManifestTransform(base, options.svelteKitVitePluginOptions)]
  }
  else {
    options.workbox = options.workbox ?? {}
    if (!options.workbox.globDirectory)
      options.workbox.globDirectory = '.svelte-kit/output'

    if (!options.workbox.modifyURLPrefix) {
      options.workbox.globPatterns = buildGlobPatterns(options.workbox.globPatterns)
      options.workbox.globIgnores = buildGlobIgnores(options.workbox.globIgnores)
    }

    if (!options.workbox.dontCacheBustURLsMatching)
      options.workbox.dontCacheBustURLsMatching = /-[a-f0-9]{8}\./

    if (!options.workbox.navigateFallback)
      options.workbox.navigateFallback = adapterFallback ?? base

    if (!options.workbox.manifestTransforms)
      options.workbox.manifestTransforms = [createManifestTransform(base, options.svelteKitVitePluginOptions)]
  }
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

    return globPatterns.filter(g => g.startsWith('server/'))
  }

  return ['client/**/*.{js,css,ico,png,svg}', 'prerendered/**/*.html']
}

function buildGlobIgnores(globIgnores?: string[]): string[] {
  if (globIgnores) {
    if (!globIgnores.some(g => g.startsWith('server/')))
      globIgnores.push('server/**')

    return globIgnores
  }

  return ['server/**/*.*']
}
