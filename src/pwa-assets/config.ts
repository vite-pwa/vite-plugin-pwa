import { basename, dirname, relative, resolve } from 'node:path'
import { readFile } from 'node:fs/promises'
import type { UserConfig } from '@vite-pwa/assets-generator/config'
import { loadConfig } from '@vite-pwa/assets-generator/config'
import { cyan, red } from 'kolorist'
import { instructions } from '@vite-pwa/assets-generator/api/instructions'
import type { PWAPluginContext } from '../context'
import type { ResolvedPWAAssetsOptions } from '../types'
import type { AssetsGeneratorContext, ResolvedIconAsset } from './types'

export async function loadAssetsGeneratorContext(
  ctx: PWAPluginContext,
  assetsGeneratorContext?: AssetsGeneratorContext,
) {
  const root = ctx.viteConfig.root ?? process.cwd()
  const { config, sources } = await loadConfiguration(root, ctx)
  if (!config.preset) {
    console.error([
      '',
      cyan(`PWA v${ctx.version}`),
      red('ERROR: No preset for assets generator found'),
    ].join('\n'))
    return
  }

  const {
    preset,
    images,
    headLinkOptions: userHeadLinkOptions,
  } = config

  if (!images) {
    console.error([
      '',
      cyan(`PWA v${ctx.version}`),
      red('ERROR: No image provided for assets generator'),
    ].join('\n'))
    return
  }

  if (Array.isArray(images)) {
    if (!images.length) {
      console.error([
        '',
        cyan(`PWA v${ctx.version}`),
        red('ERROR: No image provided for assets generator'),
      ].join('\n'))
      return
    }
    if (images.length > 1) {
      console.error([
        '',
        cyan(`PWA v${ctx.version}`),
        red('ERROR: Only one image is supported for assets generator'),
      ].join('\n'))
      return
    }
  }

  const pwaAssets = ctx.options.pwaAssets as ResolvedPWAAssetsOptions

  const useImage = Array.isArray(images) ? images[0] : images
  // the image must be relative to the root directory
  const imageFile = resolve(root, useImage)
  const publicDir = pwaAssets.integration?.publicDir ?? resolve(root, ctx.viteConfig.publicDir || 'public')
  const outDir = pwaAssets.integration?.outDir ?? resolve(root, ctx.viteConfig.build?.outDir || 'dist')
  // image can be inside public subdirectory: public/pwa/icon.svg => pwa/icon.svg
  const imageName = relative(publicDir, imageFile)
  // resolve the output folder for the image: <outDir>/pwa/icon.svg
  const imageOutDir = dirname(resolve(outDir, imageName))

  const xhtml = userHeadLinkOptions?.xhtml === true
  const includeId = userHeadLinkOptions?.includeId === true
  const assetsInstructions = await instructions({
    imageResolver: () => readFile(imageFile),
    imageName,
    preset,
    faviconPreset: userHeadLinkOptions?.preset ?? pwaAssets.htmlPreset,
    htmlLinks: { xhtml, includeId },
    basePath: pwaAssets.integration?.baseUrl || ctx.viteConfig.base || '/',
    resolveSvgName: userHeadLinkOptions?.resolveSvgName ?? (name => basename(name)),
  })
  const {
    includeHtmlHeadLinks = true,
    overrideManifestIcons: useOverrideManifestIcons,
    injectThemeColor = false,
  } = pwaAssets

  // override manifest icons when:
  // - manifest is defined and
  // - missing manifest.icons entry or manifest.icons present and overrideManifestIcons is enabled
  const overrideManifestIcons = ctx.options.manifest === false || !ctx.options.manifest
    ? false
    : 'icons' in ctx.options.manifest
      ? useOverrideManifestIcons // explicit override
      : true

  if (assetsGeneratorContext === undefined) {
    return {
      lastModified: Date.now(),
      assetsInstructions,
      cache: new Map<string, ResolvedIconAsset>(),
      useImage,
      imageFile,
      publicDir,
      outDir,
      imageName,
      imageOutDir,
      xhtml,
      includeId,
      // normalize sources
      sources: sources.map(source => source.replace(/\\/g, '/')),
      injectThemeColor,
      includeHtmlHeadLinks,
      overrideManifestIcons,
    } satisfies AssetsGeneratorContext
  }

  assetsGeneratorContext.lastModified = Date.now()
  assetsGeneratorContext.assetsInstructions = assetsInstructions
  assetsGeneratorContext.useImage = useImage
  assetsGeneratorContext.imageFile = imageFile
  assetsGeneratorContext.outDir = outDir
  assetsGeneratorContext.imageName = imageName
  assetsGeneratorContext.imageOutDir = imageOutDir
  assetsGeneratorContext.xhtml = xhtml
  assetsGeneratorContext.includeId = includeId
  assetsGeneratorContext.injectThemeColor = injectThemeColor
  assetsGeneratorContext.includeHtmlHeadLinks = includeHtmlHeadLinks
  assetsGeneratorContext.overrideManifestIcons = overrideManifestIcons
  assetsGeneratorContext.cache.clear()
}

async function loadConfiguration(root: string, ctx: PWAPluginContext) {
  const pwaAssets = ctx.options.pwaAssets as ResolvedPWAAssetsOptions
  if (pwaAssets.config === false) {
    return await loadConfig<UserConfig>(root, {
      config: false,
      preset: pwaAssets.preset as UserConfig['preset'],
      images: pwaAssets.images,
      logLevel: 'silent',
    })
  }

  return await loadConfig<UserConfig>(
    root,
    typeof pwaAssets.config === 'boolean'
      ? root
      : { config: pwaAssets.config },
  )
}
