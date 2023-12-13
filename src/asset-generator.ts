import { mkdir, readFile } from 'node:fs/promises'
import { basename, dirname, relative, resolve } from 'node:path'
import { loadConfig } from '@vite-pwa/assets-generator/config'
import { instructions } from '@vite-pwa/assets-generator/api/instructions'
import { generateAssets } from '@vite-pwa/assets-generator/api/generate-assets'
import { generateHtmlMarkup } from '@vite-pwa/assets-generator/api/generate-html-markup'
import type { UserConfig } from '@vite-pwa/assets-generator/config'
import { cyan, red } from 'kolorist'
import { generateManifestIconsEntry } from '@vite-pwa/assets-generator/api/generate-manifest-icons-entry'
import type { ImageAssetsInstructions } from '@vite-pwa/assets-generator/api'
import type { PWAPluginContext } from './context'
import type { PWAAssetsGenerator, ResolvedIconAsset } from './types'

interface AssetsGeneratorContext {
  lastModified: number
  assetsInstructions: ImageAssetsInstructions
  cache: Map<string, ResolvedIconAsset>
  useImage: string
  imageFile: string
  publicDir: string
  outDir: string
  imageName: string
  imageOutDir: string
  xhtml: boolean
  includeId: boolean
  sources: string[]
  injectThemeColor: boolean
  includeHtmlHeadLinks: boolean
  overrideManifestIcons: boolean
}

export function loadInstructions(ctx: PWAPluginContext) {
  return async (): Promise<PWAAssetsGenerator | undefined> => {
    // if disabled, no assets enabled or no manifest
    if (!ctx.options.assets || !ctx.options.manifest)
      return

    const assetsContext = await loadContext()
    if (!assetsContext)
      return

    return {
      async generate() {
        await mkdir(assetsContext.imageOutDir, { recursive: true })
        await generateAssets(assetsContext.assetsInstructions, true, assetsContext.imageOutDir)
      },
      async findIconAsset(path: string) {
        let resolved = assetsContext.cache.get(path)
        if (resolved) {
          resolved.age = Date.now() - resolved.lastModified
          return resolved
        }

        const iconAsset = assetsContext.assetsInstructions.transparent[path]
          ?? assetsContext.assetsInstructions.maskable[path]
          ?? assetsContext.assetsInstructions.apple[path]
          ?? assetsContext.assetsInstructions.favicon[path]
          ?? assetsContext.assetsInstructions.appleSplashScreen[path]

        if (iconAsset) {
          resolved = {
            path,
            mimeType: iconAsset.mimeType,
            buffer: iconAsset.buffer(),
            lastModified: assetsContext.lastModified,
            age: 0,
          } satisfies ResolvedIconAsset
          assetsContext.cache.set(path, resolved)
          return resolved
        }
      },
      resolveHtmlLinks() {
        return generateHtmlMarkup(assetsContext.assetsInstructions)
      },
      async transformIndexHtmlHandler(html: string) {
        if (assetsContext.injectThemeColor) {
          const manifest = ctx.options.manifest
          if (manifest && 'theme_color' in manifest) {
            html = html.replace(
              '</head>',
                `\n<meta name="theme-color" content="${manifest.theme_color}"></head>`,
            )
          }
        }

        if (assetsContext.includeHtmlHeadLinks) {
          const link = generateHtmlMarkup(assetsContext.assetsInstructions)
          if (link.length)
            html = html.replace('</head>', `\n${link.join('\n')}</head>`)
        }

        return html
      },
      injectManifestIcons() {
        if (!assetsContext.overrideManifestIcons)
          return

        const manifest = ctx.options.manifest
        if (manifest) {
          manifest.icons = generateManifestIconsEntry(
            'object',
            assetsContext.assetsInstructions,
          ).icons
        }
      },
      lookupPWAAssetInstructions() {
        return assetsContext.assetsInstructions
      },
      async checkHotUpdate(file) {
        const result = assetsContext.sources.includes(file)
        if (result)
          await loadContext(assetsContext)

        return result
      },
    } satisfies PWAAssetsGenerator

    async function loadContext(assetContext?: AssetsGeneratorContext) {
      const root = ctx.viteConfig.root ?? process.cwd()
      const { config, sources } = await loadConfig<UserConfig>(
        root,
        typeof ctx.options.assets!.path === 'boolean' ? root : { config: ctx.options.assets!.path },
      )
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

      const useImage = Array.isArray(images) ? images[0] : images
      const imageFile = resolve(root, useImage)
      const publicDir = resolve(root, ctx.viteConfig.publicDir ?? 'public')
      const outDir = resolve(root, ctx.viteConfig.build?.outDir ?? 'dist')
      const imageName = relative(publicDir, imageFile)
      const imageOutDir = dirname(resolve(outDir, imageName))

      const xhtml = userHeadLinkOptions?.xhtml === true
      const includeId = userHeadLinkOptions?.includeId === true
      const assetsInstructions = await instructions({
        imageResolver: () => readFile(resolve(root, useImage)),
        imageName,
        preset,
        faviconPreset: userHeadLinkOptions?.preset,
        htmlLinks: { xhtml, includeId },
        basePath: ctx.viteConfig.base ?? '/',
        resolveSvgName: userHeadLinkOptions?.resolveSvgName ?? (name => basename(name)),
      })
      const {
        includeHtmlHeadLinks = true,
        overrideManifestIcons = false,
        injectThemeColor = false,
      } = ctx.options.assets!.options

      if (assetContext === undefined) {
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

      assetContext.lastModified = Date.now()
      assetContext.assetsInstructions = assetsInstructions
      assetContext.useImage = useImage
      assetContext.imageFile = imageFile
      assetContext.outDir = outDir
      assetContext.imageName = imageName
      assetContext.imageOutDir = imageOutDir
      assetContext.xhtml = xhtml
      assetContext.includeId = includeId
      assetContext.injectThemeColor = injectThemeColor
      assetContext.includeHtmlHeadLinks = includeHtmlHeadLinks
      assetContext.overrideManifestIcons = overrideManifestIcons
      assetContext.cache.clear()
    }
  }
}
