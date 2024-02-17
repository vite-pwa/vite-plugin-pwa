import { mkdir } from 'node:fs/promises'
import { generateAssets } from '@vite-pwa/assets-generator/api/generate-assets'
import type { AssetsGeneratorContext } from './types'

export async function generate(
  assetsGeneratorContext: AssetsGeneratorContext,
) {
  await mkdir(assetsGeneratorContext.imageOutDir, { recursive: true })
  await generateAssets(assetsGeneratorContext.assetsInstructions, true, assetsGeneratorContext.imageOutDir)
}
