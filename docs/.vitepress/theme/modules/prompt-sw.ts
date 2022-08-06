import type { PWABuilderData, PWABuilderResult } from '../types'

export function generatePromptSW(
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
import { NavigationRoute, registerRoute } from 'workbox-routing'

declare let self: ServiceWorkerGlobalScope

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING')
    self.skipWaiting()
})

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
`
    : `
// ${output}
  
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING')
    self.skipWaiting()
})

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
`
}
