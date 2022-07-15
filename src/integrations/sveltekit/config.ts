import type { ResolvedConfig } from 'vite'
import type { ManifestTransform } from 'workbox-build'
import type { SvelteKitVitePluginOptions, VitePWAOptions } from '../../types'

// Vite generates <name>.<hash>.<ext> layout while SvelteKit generates <name>-<hash>.<ext>
// Vite and SvelteKit are not aligned: pwa plugin will use /\.[a-f0-9]{8}\./ by default: #164 optimize workbox work

// All assets will go to the immutable folder, and so, there is no need to calculate its revision for the sw's precache manifest
export function configureSvelteKitOptions(viteOptions: ResolvedConfig, options: Partial<VitePWAOptions>) {
  const { base = viteOptions.build.base ?? '/', adapterFallback } = options.svelteKitVitePluginOptions ?? {}
  if (options.strategies === 'injectManifest') {
    options.injectManifest = options.injectManifest ?? {}
    if (!options.injectManifest.globDirectory)
      options.injectManifest.globDirectory = '.svelte-kit/output'

    if (!options.injectManifest.modifyURLPrefix) {
      options.injectManifest.modifyURLPrefix = {
        'client/': `${base}`,
        'prerendered/pages/': `${base}`,
      }
      if (adapterFallback)
        options.injectManifest.modifyURLPrefix[`prerendered/${adapterFallback}`] = `${base}${adapterFallback}`
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
      options.workbox.modifyURLPrefix = {
        'client/': `${base}`,
        'prerendered/pages/': `${base}`,
      }
      if (adapterFallback)
        options.workbox.modifyURLPrefix[`prerendered/${adapterFallback}`] = `${base}${adapterFallback}`
    }

    if (!options.workbox.dontCacheBustURLsMatching)
      options.workbox.dontCacheBustURLsMatching = /-[a-f0-9]{8}\./

    if (!options.workbox.manifestTransforms)
      options.workbox.manifestTransforms = [createManifestTransform(base, options.svelteKitVitePluginOptions)]
  }
}

function createManifestTransform(base: string, options?: SvelteKitVitePluginOptions): ManifestTransform {
  const suffix = options?.trailingSlash === 'always' ? '/' : ''
  return async (entries) => {
    const manifest = entries.map((e) => {
      let url = e.url
      if (url.endsWith('.html')) {
        if (url.startsWith('/'))
          url = url.slice(1)

        e.url = url === 'index.html' ? `${base}` : `${base}${url.slice(0, url.lastIndexOf('.'))}${suffix}`
      }

      return e
    })
    return { manifest }
  }
}
