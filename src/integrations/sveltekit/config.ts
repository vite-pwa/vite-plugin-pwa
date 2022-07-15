import type { VitePWAOptions } from '../../types'

// Vite generates <name>.<hash>.<ext> layout while SvelteKit generates <name>-<hash>.<ext>
// Vite and SvelteKit are not aligned: pwa plugin will use /\.[a-f0-9]{8}\./ by default: #164 optimize workbox work

// All assets will go to the immutable folder, and so, there is no need to calculate its revision for the sw's precache manifest
export function configureSvelteKitOptions(options: Partial<VitePWAOptions>) {
  if (options.strategies === 'injectManifest') {
    options.injectManifest = options.injectManifest ?? {}
    if (!options.injectManifest.globDirectory)
      options.injectManifest.globDirectory = '.svelte-kit/output'

    if (!options.injectManifest.modifyURLPrefix)
      options.injectManifest.modifyURLPrefix = { 'client/': '/', 'prerendered/pages/': '/' }

    if (!options.injectManifest.dontCacheBustURLsMatching)
      options.injectManifest.dontCacheBustURLsMatching = /-[a-f0-9]{8}\./
  }
  else {
    options.workbox = options.workbox ?? {}
    if (!options.workbox.globDirectory)
      options.workbox.globDirectory = '.svelte-kit/output'

    if (!options.workbox.modifyURLPrefix)
      options.workbox.modifyURLPrefix = { 'client/': '/', 'prerendered/pages/': '/' }

    if (!options.workbox.dontCacheBustURLsMatching)
      options.workbox.dontCacheBustURLsMatching = /-[a-f0-9]{8}\./
  }
}
