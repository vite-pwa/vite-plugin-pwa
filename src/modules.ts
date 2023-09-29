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
    // eslint-disable-next-line @typescript-eslint/no-require-imports
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
self.addEventListener('install', function(e) {
  self.skipWaiting();
});
self.addEventListener('activate', function(e) {
  self.registration.unregister()
    .then(function() {
      return self.clients.matchAll();
    })
    .then(function(clients) {
      clients.forEach(client => client.navigate(client.url))
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

  // we will have something like this from swSrc:
  /*
  // sw.js
  import { precacheAndRoute } from 'workbox-precaching'
  // self.__WB_MANIFEST is default injection point
  precacheAndRoute(self.__WB_MANIFEST)
  */

  const { build } = await import('vite')

  const define: Record<string, any> = { ...(viteOptions.define ?? {}) }
  define['process.env.NODE_ENV'] = JSON.stringify(options.mode)

  const { format, plugins, rollupOptions } = options.injectManifestRollupOptions

  await build({
    root: viteOptions.root,
    base: viteOptions.base,
    // don't copy anything from public folder
    resolve: viteOptions.resolve,
    mode: options.mode,
    publicDir: false,
    build: {
      sourcemap: viteOptions.build.sourcemap,
      lib: {
        entry: options.swSrc,
        name: 'app',
        formats: [format],
      },
      rollupOptions: {
        ...rollupOptions,
        plugins,
        output: {
          entryFileNames: options.filename,
        },
      },
      outDir: options.outDir,
      emptyOutDir: false,
    },
    configFile: false,
    define,
  })

  // don't force user to include injection point
  if (!options.injectManifest.injectionPoint)
    return

  const injectManifestOptions = {
    ...options.injectManifest,
    // this will not fail since there is an injectionPoint
    swSrc: options.injectManifest.swDest,
  }

  const { injectManifest } = await loadWorkboxBuild()

  // inject the manifest
  const buildResult = await injectManifest(injectManifestOptions)
  // log workbox result
  logWorkboxResult('injectManifest', buildResult, viteOptions)
}
