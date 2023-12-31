import { dirname, resolve } from 'node:path'
import { promises as fs } from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { BuildResult } from 'workbox-build'
import type { ResolvedConfig } from 'vite'
import type { ResolvedVitePWAOptions } from './types'
import { logWorkboxResult } from './log'

const _dirname = typeof __dirname !== 'undefined'
  ? __dirname
  : dirname(fileURLToPath(import.meta.url))

async function loadWorkboxBuild(): Promise<typeof import('workbox-build')> {
  // Uses require to lazy load.
  // "workbox-build" is very large and it makes config loading slow.
  // Since it is not always used, load this when it is needed.

  try {
    const workbox = await import('workbox-build')
    return workbox.default ?? workbox
  }
  catch (_) {
    // eslint-disable-next-line ts/no-require-imports
    return require('workbox-build')
  }
}

export async function generateRegisterSW(options: ResolvedVitePWAOptions, mode: 'build' | 'dev', source = 'register') {
  const sw = options.buildBase + options.filename
  const scope = options.scope

  const content = await fs.readFile(resolve(_dirname, `client/${mode}/${source}.js`), 'utf-8')

  return content
    .replace(/__SW__/g, sw)
    .replace('__SCOPE__', scope)
    .replace('__SW_AUTO_UPDATE__', `${options.registerType === 'autoUpdate'}`)
    .replace('__SW_SELF_DESTROYING__', `${options.selfDestroying}`)
    .replace('__TYPE__', `${options.devOptions.enabled ? options.devOptions.type : 'classic'}`)
}

export async function generateServiceWorker(options: ResolvedVitePWAOptions, viteOptions: ResolvedConfig): Promise<BuildResult> {
  if (options.selfDestroying) {
    const selfDestroyingSW = `
self.addEventListener('install', (e) => {
  self.skipWaiting();
});
self.addEventListener('activate', (e) => {
  self.registration.unregister()
    .then(() => self.clients.matchAll())
    .then((clients) => {
      clients.forEach((client) => {
        if (client instanceof WindowClient)
          client.navigate(client.url);
      });
      return Promise.resolve();
    })
    .then(() => {
      self.caches.keys().then((cacheNames) => {
        Promise.all(
          cacheNames.map((cacheName) => {
            return self.caches.delete(cacheName);
          }),
        );
      })
    });
});
    `
    await fs.writeFile(options.swDest.replace(/\\/g, '/'), selfDestroyingSW, { encoding: 'utf8' })
    return {
      count: 1,
      size: selfDestroyingSW.length,
      warnings: [],
      filePaths: [options.filename],
    }
  }

  await options.integration?.beforeBuildServiceWorker?.(options)

  const { generateSW } = await loadWorkboxBuild()

  // generate the service worker
  const buildResult = await generateSW(options.workbox)
  // log workbox result
  logWorkboxResult('generateSW', buildResult, viteOptions)

  return buildResult
}

export async function generateInjectManifest(options: ResolvedVitePWAOptions, viteOptions: ResolvedConfig) {
  const { selfDestroying } = options
  if (selfDestroying) {
    await generateServiceWorker(options, viteOptions)
    return
  }

  const [workbox, buildSW] = await Promise.all([
    loadWorkboxBuild(),
    import('./vite-build').then(({ buildSW }) => buildSW),
  ])

  await buildSW(options, viteOptions, workbox)
}
