import { basename, relative } from 'node:path'
import { promises as fs } from 'node:fs'
import type { InlineConfig, ResolvedConfig } from 'vite'
import type { ResolvedVitePWAOptions } from './types'
import { logSWViteBuild, logWorkboxResult } from './log'
import { normalizePath } from './utils'

export async function buildSW(
  options: ResolvedVitePWAOptions,
  viteOptions: ResolvedConfig,
  workbox: typeof import('workbox-build'),
) {
  // we will have something like this from swSrc:
  /*
  // sw.js
  import { precacheAndRoute } from 'workbox-precaching'
  // self.__WB_MANIFEST is default injection point
  precacheAndRoute(self.__WB_MANIFEST)
  */

  // allow integrations to modify also build options
  await options.integration?.beforeBuildServiceWorker?.(options)

  const { build } = await import('vite')

  const {
    inlineConfig,
    format,
    swName,
    swMjsName,
  } = prepareViteBuild(options, viteOptions)

  // log sw build
  logSWViteBuild(normalizePath(relative(viteOptions.root, options.swSrc)), viteOptions, format)

  await build(inlineConfig)

  if (format !== 'iife') {
    await fs.rename(
        `${options.outDir}/${swMjsName}`,
        `${options.outDir}/${swName}`,
    )
    const sourceMap = await fs.lstat(`${options.outDir}/${swMjsName}.map`).then(s => s.isFile()).catch(() => false)
    if (sourceMap) {
      await Promise.all([
        fs.readFile(`${options.outDir}/${swName}`, 'utf-8').then(content => fs.writeFile(
            `${options.outDir}/${swName}`,
            content.replace(`${swMjsName}.map`, `${swName}.map`),
            'utf-8',
        )),
        fs.rename(`${options.outDir}/${swMjsName}.map`, `${options.outDir}/${swName}.map`),
      ])
    }
  }

  // don't force user to include injection point
  if (!options.injectManifest.injectionPoint)
    return

  const injectManifestOptions = {
    ...options.injectManifest,
    // this will not fail since there is an injectionPoint
    swSrc: options.injectManifest.swDest,
  }

  const { injectManifest } = workbox

  // inject the manifest
  const buildResult = await injectManifest(injectManifestOptions)
  // log workbox result
  logWorkboxResult('injectManifest', buildResult, viteOptions, format)
}

function prepareViteBuild(
  options: ResolvedVitePWAOptions,
  viteOptions: ResolvedConfig,
) {
  const define: Record<string, any> = { ...(viteOptions.define ?? {}) }
  const nodeEnv = options.injectManifestBuildOptions.enableWorkboxModulesLogs
    ? 'development'
    // prevent tsup replacing `process.env`
    // eslint-disable-next-line dot-notation
    : (process['env']['NODE_ENV'] || 'production') as ('production' | 'development')

  define['process.env.NODE_ENV'] = JSON.stringify(nodeEnv)

  const { format, plugins, rollupOptions } = options.injectManifestRollupOptions

  const inlineConfig = {
    root: viteOptions.root,
    base: viteOptions.base,
    resolve: viteOptions.resolve,
    mode: viteOptions.mode,
    // don't copy anything from public folder
    publicDir: false,
    build: {
      target: options.injectManifestBuildOptions.target,
      minify: options.injectManifestBuildOptions.minify,
      sourcemap: options.injectManifestBuildOptions.sourcemap,
      outDir: options.outDir,
      emptyOutDir: false,
    },
    configFile: false,
    define,
  } satisfies InlineConfig

  const swName = basename(options.swDest)
  const swMjsName = swName.replace(/\.js$/, '.mjs')

  if (format === 'iife') {
    Object.assign(inlineConfig.build, {
      ...inlineConfig.build,
      lib: {
        entry: options.swSrc,
        name: 'app',
        formats: [format],
      },
      rollupOptions: {
        ...rollupOptions,
        plugins,
        output: {
          entryFileNames: swName,
        },
      },
    })
  }
  else {
    if (viteOptions.build.sourcemap) {
      Object.assign(inlineConfig, {
        ...inlineConfig,
        esbuild: {
          sourcemap: viteOptions.build.sourcemap === 'hidden' ? true : viteOptions.build.sourcemap,
        },
      } satisfies InlineConfig)
    }

    Object.assign(inlineConfig.build, {
      ...inlineConfig.build,
      modulePreload: false,
      rollupOptions: {
        ...rollupOptions,
        plugins,
        input: options.swSrc,
        output: {
          entryFileNames: swMjsName,
          inlineDynamicImports: true,
        },
      },
    } satisfies InlineConfig['build'])
  }

  return {
    inlineConfig,
    swName,
    swMjsName,
    format,
  }
}
