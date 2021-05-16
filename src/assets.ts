import { relative, resolve } from 'path'
import fs from 'fs'
import crypto from 'crypto'
import { GenerateSWConfig, InjectManifestConfig, ManifestEntry } from 'workbox-build'
import { ResolvedConfig } from 'vite'
import { ResolvedVitePWAOptions } from './types'
import { FILE_MANIFEST } from './constants'

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

function resolveAdditionalManifestEntries(
  useInjectManifest: boolean,
  includeUrl: string[],
  injectManifest: Partial<InjectManifestConfig>,
  workbox: Partial<GenerateSWConfig>,
): ManifestEntry[] {
  let additionalManifestEntries: ManifestEntry[]

  if (useInjectManifest)
    additionalManifestEntries = (injectManifest.additionalManifestEntries = injectManifest.additionalManifestEntries || [])

  else
    additionalManifestEntries = (workbox.additionalManifestEntries = workbox.additionalManifestEntries || [])

  if (additionalManifestEntries.length > 0) {
    additionalManifestEntries
      .filter(me => !includeUrl.includes(me.url))
      .forEach(me => includeUrl.push(me.url))
  }
  return additionalManifestEntries
}

export function configureStaticAssets(
  resolvedVitePWAOptions: ResolvedVitePWAOptions,
  viteConfig: ResolvedConfig,
) {
  const {
    manifest,
    strategies,
    injectManifest,
    workbox,
    include,
    includeManifestIcons,
  } = resolvedVitePWAOptions

  // static assets handling
  // we need to check inject manisfest strategy
  // additionalManifestEntries will go to workbox entry
  // or to injectManifest entry
  const { publicDir } = viteConfig
  const useInjectManifest = strategies === 'injectManifest'
  // include static assets
  const includeUrl: string[] = []
  if (include) {
    const additionalManifestEntries = resolveAdditionalManifestEntries(
      useInjectManifest,
      includeUrl,
      injectManifest,
      workbox,
    )
    const useInclude: string[] = []
    if (Array.isArray(include))
      useInclude.push(...include)
    else
      useInclude.push(include)

    useInclude.forEach((p) => {
      addManifestEntry(
        publicDir,
        resolve(
          publicDir,
          p,
        ),
        includeUrl,
        additionalManifestEntries,
      )
    })
  }

  // include manifest icons and manifest.webmanifest
  if (manifest) {
    const additionalManifestEntries = resolveAdditionalManifestEntries(
      useInjectManifest,
      includeUrl,
      injectManifest,
      workbox,
    )
    // icons
    if (manifest.icons && includeManifestIcons) {
      const icons = manifest.icons
      Object.keys(icons).forEach((key) => {
        const icon = icons[key as any]
        addManifestEntry(
          publicDir,
          resolve(
            publicDir,
            icon.src as string,
          ),
          includeUrl,
          additionalManifestEntries,
        )
      })
    }
    // manifest.webmanifest
    addWebManifestEntry(
      resolvedVitePWAOptions,
      includeUrl,
      additionalManifestEntries,
    )
  }
}

export function generateWebManifestFile(options: ResolvedVitePWAOptions): string {
  return `${JSON.stringify(options.manifest, null, options.minify ? 0 : 2)}\n`
}
