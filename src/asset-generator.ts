import { mkdir, readFile } from 'node:fs/promises'
import { basename, dirname, relative, resolve } from 'node:path'
import { loadConfig } from '@vite-pwa/assets-generator/config'
import { instructions } from '@vite-pwa/assets-generator/api/instructions'
import { generateAssets } from '@vite-pwa/assets-generator/api/generate-assets'
import { generateHtmlMarkup } from '@vite-pwa/assets-generator/api/generate-html-markup'
import type { UserConfig } from '@vite-pwa/assets-generator/config'
import { cyan, red } from 'kolorist'
import { generateManifestIconsEntry } from '@vite-pwa/assets-generator/api/generate-manifest-icons-entry'
import type { PWAPluginContext } from './context'
import type { PWAAssetsGenerator } from './types'

export function loadInstructions(ctx: PWAPluginContext) {
  return async (): Promise<PWAAssetsGenerator | undefined> => {
    // if disabled, no assets enabled or no manifest
    if (!ctx.options.assets || !ctx.options.manifest)
      return

    const root = ctx.viteConfig.root ?? process.cwd()

    const { config } = await loadConfig<UserConfig>(
      root,
      typeof ctx.options.assets.path === 'boolean' ? root : { config: ctx.options.assets.path },
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
    } = ctx.options.assets.options

    return {
      async generate() {
        await mkdir(imageOutDir, { recursive: true })
        await generateAssets(assetsInstructions, true, imageOutDir)
      },
      async findIconAsset(path: string) {
        const result = assetsInstructions.transparent[path]
          ?? assetsInstructions.maskable[path]
          ?? assetsInstructions.apple[path]
          ?? assetsInstructions.favicon[path]
          ?? assetsInstructions.appleSplashScreen[path]

        if (result)
          return { path, mimeType: result.mimeType, buffer: result.buffer() }
      },
      resolveHtmlLinks() {
        return generateHtmlMarkup(assetsInstructions)
      },
      async transformIndexHtmlHandler(html: string) {
        if (injectThemeColor) {
          const manifest = ctx.options.manifest
          if (manifest && 'theme_color' in manifest) {
            html = html.replace(
              '</head>',
                `\n<meta name="theme-color" content="${manifest.theme_color}"></head>`,
            )
          }
        }

        if (includeHtmlHeadLinks) {
          const link = generateHtmlMarkup(assetsInstructions)
          if (link.length)
            html = html.replace('</head>', `\n${link.join('\n')}</head>`)
        }

        return html
      },
      injectManifestIcons() {
        if (!overrideManifestIcons)
          return

        const manifest = ctx.options.manifest
        if (manifest) {
          manifest.icons = generateManifestIconsEntry(
            'object',
            assetsInstructions,
          ).icons
        }
      },
      lookupPWAAssetInstructions() {
        return assetsInstructions
      },
    } satisfies PWAAssetsGenerator
  }
}
