import { generateManifestIconsEntry } from '@vite-pwa/assets-generator/api/generate-manifest-icons-entry'
import type { PWAPluginContext } from '../context'
import type { AssetsGeneratorContext } from './types'

export function injectManifestIcons(
  ctx: PWAPluginContext,
  assetsGeneratorContext: AssetsGeneratorContext,
) {
  if (!assetsGeneratorContext.overrideManifestIcons)
    return

  const manifest = ctx.options.manifest
  if (manifest) {
    manifest.icons = generateManifestIconsEntry(
      'object',
      assetsGeneratorContext.assetsInstructions,
    ).icons
  }
}
