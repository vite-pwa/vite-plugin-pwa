import { join, resolve } from 'path'
import { promises as fs } from 'fs'
import { injectManifest } from 'workbox-build'
import { ResolvedConfig } from 'vite'
import Rollup from 'rollup'
import type { ResolvedVitePWAOptions } from './types'
import { slash } from './utils'

export async function generateRegisterSW(options: ResolvedVitePWAOptions, mode: 'build' | 'dev', source = 'register') {
  const sw = slash(join(options.base, options.filename))
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
  const rollup = (await import('rollup')) as typeof Rollup
  // remove this plugin from the compilation: avoid infinite recursion
  // remove also vite html transform and build to avoid rebuilding index.html
  const plugins = (viteOptions.plugins as Plugin[]).filter((p) => {
    return p.name !== 'vite-plugin-pwa'
      && p.name !== 'vite:build-html'
      && p.name !== 'vite:html'
  })
  const bundle = await rollup.rollup({
    input: options.swSrc,
    plugins,
  })
  try {
    await bundle.write({
      format: 'cjs',
      exports: 'none',
      inlineDynamicImports: true,
      dir: options.outDir,
      sourcemap: viteOptions.build.sourcemap,
    })
  }
  finally {
    await bundle.close()
  }
  // this will not fail since there is an injectionPoint
  options.injectManifest.swSrc = options.injectManifest.swDest
  // options.injectManifest.mode won't work!!!
  // error during build: ValidationError: "mode" is not allowed
  if (options.injectManifest.mode)
    delete options.injectManifest.mode

  // inject the manifest
  await injectManifest(options.injectManifest)
}
