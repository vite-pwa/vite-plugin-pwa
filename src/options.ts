import fs from 'node:fs'
import { extname, resolve } from 'node:path'
import process from 'node:process'
import type { GenerateSWOptions, InjectManifestOptions } from 'workbox-build'
import type { ManifestOptions, ResolvedVitePWAOptions } from './types'
import { configureStaticAssets } from './assets'
import { resolveBasePath, slash } from './utils'
import { defaultInjectManifestVitePlugins } from './constants'
import type { PWAPluginContext } from './context'
import { resolvePWAAssetsOptions } from './pwa-assets/options'

function resolveSwPaths(injectManifest: boolean, root: string, srcDir: string, outDir: string, filename: string): {
  swSrc: string
  swDest: string
  useFilename?: string
} {
  const swSrc = resolve(root, srcDir, filename)
  // check typescript service worker: swDest must have js extension
  if (injectManifest && extname(filename) === '.ts' && fs.existsSync(swSrc)) {
    const useFilename = `${filename.substring(0, filename.lastIndexOf('.'))}.js`
    // we need to change filename on resolved options, it will be used to register the service worker:
    // generateSimpleSWRegister on html.ts
    // generateRegisterSW on modules.ts
    return {
      swSrc,
      swDest: resolve(root, outDir, useFilename),
      useFilename,
    }
  }
  return {
    swSrc,
    swDest: resolve(root, outDir, filename),
  }
}

export async function resolveOptions(ctx: PWAPluginContext): Promise<ResolvedVitePWAOptions> {
  const { userOptions: options, viteConfig } = ctx
  const root = viteConfig.root
  const pkg = fs.existsSync('package.json')
    ? JSON.parse(fs.readFileSync('package.json', 'utf-8'))
    : {}

  const {
    // prevent tsup replacing `process.env`
    // eslint-disable-next-line dot-notation
    mode = (process['env']['NODE_ENV'] || 'production') as ('production' | 'development'),
    srcDir = 'public',
    outDir = viteConfig.build.outDir || 'dist',
    injectRegister = 'auto',
    registerType = 'prompt',
    filename = 'sw.js',
    manifestFilename = 'manifest.webmanifest',
    strategies = 'generateSW',
    minify = true,
    base = viteConfig.base,
    includeAssets = undefined,
    includeManifestIcons = true,
    useCredentials = false,
    disable = false,
    devOptions = { enabled: false, type: 'classic', suppressWarnings: false },
    selfDestroying = false,
    integration = {},
    buildBase,
    pwaAssets,
  } = options

  const basePath = resolveBasePath(base)
  // check typescript service worker for injectManifest strategy
  const { swSrc, swDest, useFilename } = resolveSwPaths(
    strategies === 'injectManifest',
    root,
    srcDir,
    outDir,
    filename,
  )
  const outDirRoot = resolve(root, outDir)
  const scope = options.scope || basePath

  let assetsDir = slash(viteConfig.build.assetsDir ?? 'assets')
  if (assetsDir[assetsDir.length - 1] !== '/')
    assetsDir += '/'

  // remove './' prefix from assetsDir
  const dontCacheBustURLsMatching = new RegExp(`^${assetsDir.replace(/^\.*?\//, '')}`)

  const defaultWorkbox: GenerateSWOptions = {
    swDest,
    globDirectory: outDirRoot,
    offlineGoogleAnalytics: false,
    cleanupOutdatedCaches: true,
    dontCacheBustURLsMatching,
    mode,
    navigateFallback: 'index.html',
  }

  const defaultInjectManifest: InjectManifestOptions = {
    swSrc,
    swDest,
    globDirectory: outDirRoot,
    dontCacheBustURLsMatching,
    injectionPoint: 'self.__WB_MANIFEST',
  }

  const defaultManifest: Partial<ManifestOptions> = {
    name: pkg.name,
    short_name: pkg.name,
    start_url: basePath,
    display: 'standalone',
    background_color: '#ffffff',
    lang: 'en',
    scope,
  }

  const workbox = Object.assign({}, defaultWorkbox, options.workbox || {})
  const manifest = (typeof options.manifest === 'boolean' && !options.manifest)
    ? false
    : Object.assign({}, defaultManifest, options.manifest || {})
  const {
    vitePlugins = defaultInjectManifestVitePlugins,
    plugins,
    rollupOptions = {},
    rollupFormat = 'es',
    target = viteConfig.build.target,
    minify: minifySW = viteConfig.build.minify,
    sourcemap = viteConfig.build.sourcemap,
    enableWorkboxModulesLogs,
    buildPlugins,
    envOptions = {},
    ...userInjectManifest
  } = options.injectManifest || {}
  const injectManifest = Object.assign({}, defaultInjectManifest, userInjectManifest)

  if ((injectRegister === 'auto' || injectRegister == null) && registerType === 'autoUpdate') {
    workbox.skipWaiting = true
    workbox.clientsClaim = true
  }

  // use vite build.sourcemap to configure `generateSW` sourcemap
  if (strategies === 'generateSW' && workbox.sourcemap === undefined) {
    const sourcemap = viteConfig.build?.sourcemap
    workbox.sourcemap = sourcemap === true || sourcemap === 'inline' || sourcemap === 'hidden'
  }

  if (devOptions.enabled && viteConfig.command === 'serve') {
    // `generateSW` will work only with `type: 'classic'`
    if (strategies === 'generateSW')
      devOptions.type = 'classic'
  }
  else {
    devOptions.enabled = false
    devOptions.type = 'classic'
  }

  // convert icons' purpose
  if (manifest) {
    if (manifest.icons) {
      manifest.icons = manifest.icons.map((icon) => {
        if (icon.purpose && Array.isArray(icon.purpose))
          icon.purpose = icon.purpose.join(' ')

        return icon
      })
    }
    if (manifest.shortcuts) {
      manifest.shortcuts.forEach((shortcut) => {
        if (shortcut.icons) {
          shortcut.icons = shortcut.icons.map((icon) => {
            if (icon.purpose && Array.isArray(icon.purpose))
              icon.purpose = icon.purpose.join(' ')

            return icon
          })
        }
      })
    }
  }

  const {
    envDir = viteConfig.envDir,
    envPrefix = viteConfig.envPrefix,
  } = envOptions

  const resolvedVitePWAOptions: ResolvedVitePWAOptions = {
    base: basePath,
    mode,
    swSrc,
    swDest,
    srcDir,
    outDir,
    injectRegister,
    registerType,
    filename: useFilename || filename,
    manifestFilename,
    strategies,
    workbox,
    manifest,
    useCredentials,
    injectManifest,
    scope,
    minify,
    includeAssets,
    includeManifestIcons,
    disable,
    integration,
    devOptions,
    rollupFormat,
    vitePlugins,
    buildPlugins,
    selfDestroying,
    buildBase: buildBase ?? basePath,
    injectManifestRollupOptions: {
      plugins,
      rollupOptions,
      format: rollupFormat,
    },
    injectManifestBuildOptions: {
      target,
      minify: minifySW,
      sourcemap,
      enableWorkboxModulesLogs,
    },
    injectManifestEnvOptions: {
      envDir,
      envPrefix,
    },
    pwaAssets: resolvePWAAssetsOptions(pwaAssets),
  }

  // calculate hash only when required
  const calculateHash = !resolvedVitePWAOptions.disable
    && (resolvedVitePWAOptions.manifest || resolvedVitePWAOptions.includeAssets)
    && (viteConfig.command === 'build' || resolvedVitePWAOptions.devOptions.enabled)

  if (calculateHash)
    await configureStaticAssets(resolvedVitePWAOptions, viteConfig)

  return resolvedVitePWAOptions
}
