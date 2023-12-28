import type { PWAPluginContext } from '../context'
import type { PWAAssetsGenerator } from './types'
import { loadAssetsGeneratorContext } from './config'
import { generate } from './build'
import { checkHotUpdate, findIconAsset } from './dev'
import { resolveHtmlAssets, transformIndexHtml } from './html'
import { injectManifestIcons } from './manifest'
import { extractIcons } from './utils'

export async function loadInstructions(ctx: PWAPluginContext) {
  const assetsGeneratorContext = await loadAssetsGeneratorContext(ctx)
  if (!assetsGeneratorContext)
    return

  return {
    generate: () => generate(assetsGeneratorContext),
    findIconAsset: (path: string) => findIconAsset(path, assetsGeneratorContext),
    resolveHtmlAssets: () => resolveHtmlAssets(ctx, assetsGeneratorContext),
    transformIndexHtml: (html: string) => transformIndexHtml(html, ctx, assetsGeneratorContext),
    injectManifestIcons: () => injectManifestIcons(ctx, assetsGeneratorContext),
    instructions: () => assetsGeneratorContext.assetsInstructions,
    icons: () => extractIcons(assetsGeneratorContext.assetsInstructions),
    checkHotUpdate: file => checkHotUpdate(file, ctx, assetsGeneratorContext),
  } satisfies PWAAssetsGenerator
}
