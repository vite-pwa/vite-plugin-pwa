import { dirname, resolve } from 'path'
import { promises as fs } from 'fs'
import { fileURLToPath } from 'url'
import type { BuildResult } from 'workbox-build'
import type { ResolvedConfig } from 'vite'
import type { ResolvedVitePWAOptions } from './types'
import { logWorkboxResult } from './log'
import { defaultInjectManifestVitePlugins } from './constants'

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
    return require('workbox-build')
  }
}

export async function generateRegisterSW(options: ResolvedVitePWAOptions, mode: 'build' | 'dev', source = 'register') {
  const sw = options.base + options.filename
  const scope = options.scope

  const content = await fs.readFile(resolve(_dirname, `client/${mode}/${source}.mjs`), 'utf-8')

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
  const vitePlugins = options.vitePlugins
  const includedPluginNames: string[] = []
  if (typeof vitePlugins === 'function')
    includedPluginNames.push(...vitePlugins(viteOptions.plugins.map(p => p.name)))
  else
    includedPluginNames.push(...vitePlugins)

  if (includedPluginNames.length === 0)
    includedPluginNames.push(...defaultInjectManifestVitePlugins)

  const plugins = viteOptions.plugins.filter(p => includedPluginNames.includes(p.name))
  const { rollup } = await import('rollup')
  const bundle = await rollup({
    input: options.swSrc,
    // @ts-expect-error Vite and Rollup plugin shouldn't be aligned?
    plugins,
  })
  try {
    await bundle.write({
      format: options.rollupFormat,
      exports: 'none',
      inlineDynamicImports: true,
      file: options.injectManifest.swDest,
      sourcemap: viteOptions.build.sourcemap,
    })
  }
  finally {
    await bundle.close()
  }

  const injectManifestOptions = {
    ...options.injectManifest,
    // this will not fail since there is an injectionPoint
    swSrc: options.injectManifest.swDest,
  }

  // options.injectManifest.mode won't work!!!
  // error during build: ValidationError: "mode" is not allowed
  // delete injectManifestOptions.mode

  const { injectManifest } = await loadWorkboxBuild()

  // inject the manifest
  const buildResult = await injectManifest(injectManifestOptions)
  // log workbox result
  logWorkboxResult('injectManifest', buildResult, viteOptions)
}
