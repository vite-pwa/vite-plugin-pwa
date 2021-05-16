import crypto from 'crypto'
import fs from 'fs'
import { resolve, extname, relative } from 'path'
import { ResolvedConfig } from 'vite'
import { GenerateSWConfig, InjectManifestConfig, ManifestEntry } from 'workbox-build'
import { ManifestOptions, VitePWAOptions, ResolvedVitePWAOptions } from './types'
import { FILE_MANIFEST } from './constants'

export function resolveBathPath(base: string) {
  if (isAbsolute(base))
    return base
  return !base.startsWith('/') && !base.startsWith('./')
    ? `/${base}`
    : base
}

export function isAbsolute(url: string) {
  return url.match(/^(?:[a-z]+:)?\/\//i)
}

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

function addManifestEntry(
  publicDir: string,
  path: string,
  includeUrl: string[],
  additionalManifestEntries: ManifestEntry[],
) {
  const url = relative(publicDir, path)
  if (!includeUrl.includes(url) && fs.existsSync(path)) {
    const cHash = crypto.createHash('MD5')
    cHash.update(fs.readFileSync(path))
    additionalManifestEntries.push({
      url,
      revision: `${cHash.digest('hex')}`,
    })
    includeUrl.push(url)
  }
}

function addWebManifestEntry(
  options: ResolvedVitePWAOptions,
  includeUrl: string[],
  additionalManifestEntries: ManifestEntry[],
) {
  if (!includeUrl.includes(FILE_MANIFEST)) {
    const cHash = crypto.createHash('MD5')
    cHash.update(generateWebManifestFile(options))
    additionalManifestEntries.push({
      url: FILE_MANIFEST,
      revision: `${cHash.digest('hex')}`,
    })
    includeUrl.push(FILE_MANIFEST)
  }
}

export function generateWebManifestFile(options: ResolvedVitePWAOptions): string {
  return `${JSON.stringify(options.manifest, null, options.minify ? 0 : 2)}\n`
}

export function resolveOptions(options: Partial<VitePWAOptions>, viteConfig: ResolvedConfig): ResolvedVitePWAOptions {
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
    strategies = 'generateSW',
    minify = true,
    base = viteConfig.base,
    include = undefined,
    includeManifestIcons = true,
  } = options

  const basePath = resolveBathPath(base)
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

  const defaultWorkbox: GenerateSWConfig = {
    swDest,
    globDirectory: outDirRoot,
    offlineGoogleAnalytics: false,
    cleanupOutdatedCaches: true,
    mode,
    navigateFallback: 'index.html',
  }

  const defaultInjectManifest: InjectManifestConfig = {
    swSrc,
    swDest,
    globDirectory: outDirRoot,
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
  const manifest = typeof options.manifest === 'boolean' && !options.manifest
    ? false
    : Object.assign({}, defaultManifest, options.manifest || {})
  const injectManifest = Object.assign({}, defaultInjectManifest, options.injectManifest || {})

  if ((injectRegister === 'auto' || registerType == null) && registerType === 'autoUpdate') {
    workbox.skipWaiting = true
    workbox.clientsClaim = true
  }

  // include static assets
  const includeUrl: string[] = []
  if (include) {
    workbox.additionalManifestEntries = workbox.additionalManifestEntries || []
    if (workbox.additionalManifestEntries.length > 0)
      includeUrl.push(...workbox.additionalManifestEntries.map(m => m.url))

    const useInclude: string[] = []
    if (Array.isArray(include))
      useInclude.push(...include)
    else
      useInclude.push(include)

    const publicDir = viteConfig.publicDir
    useInclude.forEach((p) => {
      addManifestEntry(
        publicDir,
        resolve(
          publicDir,
          p,
        ),
        includeUrl,
        workbox.additionalManifestEntries!,
      )
    })
  }

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
    strategies,
    workbox,
    manifest,
    injectManifest,
    scope,
    minify,
    include,
    includeManifestIcons,
  }

  // include manifest icons and manifest.webmanifest
  if (options.manifest) {
    workbox.additionalManifestEntries = workbox.additionalManifestEntries || []
    // icons
    if (options.manifest.icons && includeManifestIcons) {
      const publicDir = viteConfig.publicDir
      const icons = options.manifest.icons
      Object.keys(icons).forEach((key) => {
        const icon = icons[key as any]
        addManifestEntry(
          publicDir,
          resolve(
            publicDir,
            icon.src as string,
          ),
          includeUrl,
          workbox.additionalManifestEntries!,
        )
      })
    }
    // manifest.webmanifest
    addWebManifestEntry(
      resolvedVitePWAOptions,
      includeUrl,
      workbox.additionalManifestEntries!,
    )
  }

  return resolvedVitePWAOptions
}
