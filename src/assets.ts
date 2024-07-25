import { resolve as resolveFs } from 'node:path'
import fs from 'node:fs'
import crypto from 'node:crypto'
import { glob } from 'tinyglobby'
import type { GenerateSWOptions, InjectManifestOptions, ManifestEntry } from 'workbox-build'
import type { ResolvedConfig } from 'vite'
import type { ResolvedVitePWAOptions } from './types'

function buildManifestEntry(
  publicDir: string,
  url: string,
): Promise<ManifestEntry> {
  return new Promise((resolve, reject) => {
    const cHash = crypto.createHash('MD5')
    const stream = fs.createReadStream(resolveFs(publicDir, url))
    stream.on('error', (err) => {
      reject(err)
    })
    stream.on('data', (chunk) => {
      cHash.update(chunk)
    })
    stream.on('end', () => {
      return resolve({
        url,
        revision: `${cHash.digest('hex')}`,
      })
    })
  })
}

function lookupAdditionalManifestEntries(
  useInjectManifest: boolean,
  injectManifest: Partial<InjectManifestOptions>,
  workbox: Partial<GenerateSWOptions>,
): (string | ManifestEntry)[] {
  return useInjectManifest
    ? (injectManifest.additionalManifestEntries || [])
    : (workbox.additionalManifestEntries || [])
}

// we need to make icons relative, we can have for example icon entries with: /pwa.png
// fast-glob will not resolve absolute paths
function normalizeIconPath(path: string) {
  return path.startsWith('/') ? path.substring(1) : path
}

function includeIcons(icons: Record<string, any>[], globs: string[]) {
  Object.keys(icons).forEach((key) => {
    const icon = icons[key as any]
    const src = normalizeIconPath(icon.src as string)
    if (!globs.includes(src))
      globs.push(src)
  })
}

export async function configureStaticAssets(
  resolvedVitePWAOptions: ResolvedVitePWAOptions,
  viteConfig: ResolvedConfig,
) {
  const {
    manifest,
    strategies,
    injectManifest,
    workbox,
    includeAssets,
    includeManifestIcons,
    manifestFilename,
  } = resolvedVitePWAOptions

  const useInjectManifest = strategies === 'injectManifest'
  const { publicDir } = viteConfig
  const globs: string[] = []
  const manifestEntries: (string | ManifestEntry)[] = lookupAdditionalManifestEntries(
    useInjectManifest,
    injectManifest,
    workbox,
  )
  if (includeAssets) {
    // we need to make icons relative, we can have for example icon entries with: /pwa.png
    // fast-glob will not resolve absolute paths
    if (Array.isArray(includeAssets))
      globs.push(...includeAssets.map(normalizeIconPath))
    else
      globs.push(normalizeIconPath(includeAssets))
  }
  if (includeManifestIcons && manifest) {
    manifest.icons && includeIcons(manifest.icons, globs)
    manifest.shortcuts && manifest.shortcuts.forEach((s) => {
      s.icons && includeIcons(s.icons, globs)
    })
  }
  if (globs.length > 0) {
    let assets = await glob({
      patterns: globs,
      cwd: publicDir,
      expandDirectories: false,
      onlyFiles: true,
    })
    // we also need to remove from the list existing included by the user
    if (manifestEntries.length > 0) {
      const included = manifestEntries.map((me) => {
        if (typeof me === 'string')
          return me
        else
          return me.url
      })
      assets = assets.filter(a => !included.includes(a))
    }
    const assetsEntries = await Promise.all(assets.map((a) => {
      return buildManifestEntry(publicDir, a)
    }))
    manifestEntries.push(...assetsEntries)
  }
  if (manifest) {
    const cHash = crypto.createHash('MD5')
    cHash.update(generateWebManifestFile(resolvedVitePWAOptions))
    manifestEntries.push({
      url: manifestFilename,
      revision: `${cHash.digest('hex')}`,
    })
  }
  if (manifestEntries.length > 0) {
    if (useInjectManifest)
      injectManifest.additionalManifestEntries = manifestEntries

    else
      workbox.additionalManifestEntries = manifestEntries
  }
}

export function generateWebManifestFile(options: ResolvedVitePWAOptions): string {
  return `${JSON.stringify(options.manifest, null, options.minify ? 0 : 2)}\n`
}
