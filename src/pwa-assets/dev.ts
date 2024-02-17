import type { PWAPluginContext } from '../context'
import type { AssetsGeneratorContext, ResolvedIconAsset } from './types'
import { loadAssetsGeneratorContext } from './config'

export async function findIconAsset(
  path: string,
  { assetsInstructions, cache, lastModified }: AssetsGeneratorContext,
) {
  let resolved = cache.get(path)
  if (resolved) {
    resolved.age = Date.now() - lastModified
    return resolved
  }

  const iconAsset = assetsInstructions.transparent[path]
    ?? assetsInstructions.maskable[path]
    ?? assetsInstructions.apple[path]
    ?? assetsInstructions.favicon[path]
    ?? assetsInstructions.appleSplashScreen[path]

  if (!iconAsset)
    return

  if (iconAsset) {
    resolved = {
      path,
      mimeType: iconAsset.mimeType,
      buffer: iconAsset.buffer(),
      lastModified: Date.now(),
      age: 0,
    } satisfies ResolvedIconAsset
    cache.set(path, resolved)
    return resolved
  }
}

export async function checkHotUpdate(
  file: string,
  ctx: PWAPluginContext,
  assetsGeneratorContext: AssetsGeneratorContext,
) {
  // watch pwa assets configuration file
  const result = assetsGeneratorContext.sources.includes(file)
  if (result)
    await loadAssetsGeneratorContext(ctx, assetsGeneratorContext)

  return result
}
