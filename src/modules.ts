import { resolve } from 'path'
import { promises as fs } from 'fs'
import { BuildResult, injectManifest, generateSW } from 'workbox-build'
import { ResolvedConfig } from 'vite'
import Rollup from 'rollup'
import type { ResolvedVitePWAOptions } from './types'
import { logWorkboxResult } from './log'
import { defaultInjectManifestVitePlugins } from './constants'

export async function generateRegisterSW(options: ResolvedVitePWAOptions, mode: 'build' | 'dev', source = 'register') {
  const sw = options.base + options.filename
  const scope = options.scope

  const content = await fs.readFile(resolve(__dirname, `client/${mode}/${source}.mjs`), 'utf-8')

  return content
    .replace('__SW__', sw)
    .replace('__SCOPE__', scope)
    .replace('__SW_AUTO_UPDATE__', `${options.registerType === 'autoUpdate'}`)
    .replace('__TYPE__', `${options.devOptions.enabled ? options.devOptions.type : 'classic'}`)
}

export async function generateServiceWorker(options: ResolvedVitePWAOptions, viteOptions: ResolvedConfig): Promise<BuildResult> {
  // generate the service worker
  const buildResult = await generateSW(options.workbox)
  // log workbox result
  logWorkboxResult('generateSW', buildResult, viteOptions)

  return buildResult
}

export async function generateInjectManifest(options: ResolvedVitePWAOptions, viteOptions: ResolvedConfig) {
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

  const plugins = viteOptions.plugins.filter(p => includedPluginNames.includes(p.name)) as Plugin[]
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const rollup = require('rollup') as typeof Rollup
  const bundle = await rollup.rollup({
    input: options.swSrc,
    plugins,
  })
  try {
    await bundle.write({
      format: 'es',
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

  // inject the manifest
  const buildResult = await injectManifest(injectManifestOptions)
  // log workbox result
  logWorkboxResult('injectManifest', buildResult, viteOptions)
}
