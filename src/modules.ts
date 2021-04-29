import { resolve } from 'path'
import { promises as fs } from 'fs'
import { injectManifest } from 'workbox-build'
import { ResolvedConfig } from 'vite'
import Rollup from 'rollup'
import type { ResolvedVitePWAOptions } from './types'

export async function generateRegisterSW(options: ResolvedVitePWAOptions, mode: 'build' | 'dev', source = 'register') {
  const sw = options.base + options.filename
  const scope = options.scope

  const content = await fs.readFile(resolve(__dirname, `client/${mode}/${source}.mjs`), 'utf-8')

  return content
    .replace('__SW__', sw)
    .replace('__SCOPE__', scope)
    .replace('__SW_AUTO_UPDATE__', `${options.registerType === 'autoUpdate'}`)
}

export async function generateInjectManifest(options: ResolvedVitePWAOptions, viteOptions: ResolvedConfig) {
  // we will have something like this from swSrc:
  /*
  // sw.js
  import { precacheAndRoute } from 'workbox-precaching'
  // self.__WB_MANIFEST is default injection point
  precacheAndRoute(self.__WB_MANIFEST)
  */
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const rollup = require('rollup') as typeof Rollup
  // remove this plugin from the compilation: avoid infinite recursion
  // remove also vite html transform and build to avoid rebuilding index.html
  const excludedPluginNames = [
    'vite-plugin-pwa',
    'vite:build-html',
    'vite:html',
  ]
  const plugins = viteOptions.plugins.filter(p => !excludedPluginNames.includes(p.name)) as Plugin[]
  const bundle = await rollup.rollup({
    input: options.swSrc,
    plugins,
  })
  try {
    await bundle.write({
      format: 'cjs',
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
  delete injectManifestOptions.mode

  // inject the manifest
  await injectManifest(injectManifestOptions)
}
