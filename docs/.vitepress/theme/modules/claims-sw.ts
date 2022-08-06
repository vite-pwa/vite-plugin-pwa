import type { PWABuilderData, PWABuilderResult } from '../types'

export function generateClaimsSW(
  {
    framework,
    cleanupOldAssets,
    typescript,
  }: PWABuilderData,
  pwaBuilderResult: PWABuilderResult,
) {
  const output = typescript
    ? 'src/sw.ts'
    : framework === 'sveltekit' ? 'static/sw.js' : 'public/sw.js'
  pwaBuilderResult.codeType = typescript ? 'ts' : 'js'
  pwaBuilderResult.code = typescript
    ? `
// ${output}
  
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'
import { NavigationRoute, registerRoute } from 'workbox-routing'

declare let self: ServiceWorkerGlobalScope

// self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST)

// clean old assets
${!cleanupOldAssets ? '// ' : ''}cleanupOutdatedCaches()

let allowlist: undefined | RegExp[]
if (import.meta.env.DEV)
  allowlist = [/^\\/$/]

// to allow work offline
registerRoute(new NavigationRoute(
  createHandlerBoundToURL('index.html'),
  { allowlist },
))

self.skipWaiting()
clientsClaim()
`
    : `
// ${output}
  
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'
import { NavigationRoute, registerRoute } from 'workbox-routing'

// self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST)

// clean old assets
${!cleanupOldAssets ? '// ' : ''}cleanupOutdatedCaches()

let allowlist = undefined
if (import.meta.env.DEV)
  allowlist = [/^\\/$/]

// to allow work offline
registerRoute(new NavigationRoute(
  createHandlerBoundToURL('index.html'),
  { allowlist },
))

self.skipWaiting()
clientsClaim()
`
}
