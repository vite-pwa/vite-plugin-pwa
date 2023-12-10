import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import type { Plugin } from 'vite'
import type { Preset, ResolvedAssetSize } from '@vite-pwa/assets-generator/config'
import type { HtmlLinkPreset } from '@vite-pwa/assets-generator/api'
import type { AssetSize, ResolvedAppleSplashScreens, ResolvedAssets } from '@vite-pwa/assets-generator'

import type { PWAPluginContext } from '../context'
import type { FaviconAsset, IconAsset, PWAAssets, ResolvedPWAAssets } from '../types'

export function AssetsPlugin(ctx: PWAPluginContext) {
  return <Plugin>{
    name: 'vite-plugin-pwa:assets',
    enforce: 'post',
    async configResolved() {
      /* // if disabled, no assets enabled or no manifest
      if (ctx.userOptions.disable || !ctx.userOptions.assets || !ctx.userOptions.manifest)
        return

      // if dev server and disabled
      if (ctx.devEnvironment && !ctx.userOptions?.devOptions?.enabled)
        return */

      // ctx.disableAssets = false
      ctx.assets = new Promise<ResolvedPWAAssets | undefined>((resolve) => {
        setTimeout(() => {
          resolve(resolvePWAAssets())
        }, 100)
      })
    },
    transformIndexHtml: {
      order: 'post',
      async handler(html) {
        return await transformIndexHtmlHandler(html)
      },
      enforce: 'post', // deprecated since Vite 4
      async transform(html) { // deprecated since Vite 4
        return await transformIndexHtmlHandler(html)
      },
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (ctx.disableAssets)
          return next()

        const url = req.url
        // svg file for favicon will be served by vite
        if (!url)
          return next()

        const assets = await ctx.assets
        if (!assets)
          return next()

        const { pwaIcons, favicons } = assets
        const icon = favicons.get(url) ?? pwaIcons.get(url)
        if (!icon)
          return next()

        const buffer = await icon.buffer()
        res.setHeader('Content-Type', url.endsWith('.webp')
          ? 'image/webp'
          : url.endsWith('.ico')
            ? 'image/x-icon'
            : url.endsWith('.svg')
              ? 'image/svg+xml'
              : 'image/png')
        res.setHeader('Content-Length', buffer.length)
        res.setHeader('Cache-Control', 'public,max-age=0,must-revalidate')
        res.statusCode = 200
        res.end(buffer)
      })
    },
  }

  async function resolvePWAAssets() {
    // if disabled, no assets enabled or no manifest
    if (!ctx.options.assets || !ctx.options.manifest)
      return

    ctx.disableAssets = false
    const { defaultAssetName, defaultPngCompressionOptions, defaultSplashScreenName } = await import('@vite-pwa/assets-generator/config')
    const {
      createFaviconHtmlLink,
      createPngCompressionOptions,
      createResizeOptions,
      generateFavicon,
      generateMaskableAsset,
      generateTransparentAsset,
    } = await import('@vite-pwa/assets-generator/api')
    const { toResolvedAsset } = await import('@vite-pwa/assets-generator')

    const {
      preset = 'minimal',
      image,
      faviconPreset,
      copyToPublicDir = true,
    } = ctx.options.assets as PWAAssets

    let usePreset: Preset
    let htmlPreset: HtmlLinkPreset | undefined
    if (typeof preset === 'object') {
      usePreset = preset
    }
    else {
      switch (preset) {
        case 'minimal':
          usePreset = await import('@vite-pwa/assets-generator/presets/minimal').then(m => m.minimalPreset)
          htmlPreset = 'default'
          break
        case 'minimal-2023':
          usePreset = await import('@vite-pwa/assets-generator/presets/minimal-2023').then(m => m.minimal2023Preset)
          htmlPreset = '2023'
          break
        default:
          throw new Error(`Preset ${preset} not yet implemented`)
      }
    }

    const {
      assetName = defaultAssetName,
      png = defaultPngCompressionOptions,
      appleSplashScreens: useAppleSplashScreens,
    } = usePreset

    let appleSplashScreens: ResolvedAppleSplashScreens | undefined
    if (useAppleSplashScreens) {
      const {
        padding = 0.3,
        resizeOptions: useResizeOptions = {},
        darkResizeOptions: useDarkResizeOptions = {},
        linkMediaOptions: useLinkMediaOptions = {},
        sizes,
        name = defaultSplashScreenName,
        png: usePng = {},
      } = useAppleSplashScreens

      // Initialize defaults
      const resizeOptions = createResizeOptions(false, useResizeOptions)
      const darkResizeOptions = createResizeOptions(true, useDarkResizeOptions)
      const png = createPngCompressionOptions(usePng)

      sizes.forEach((size) => {
        if (typeof size.padding === 'undefined')
          size.padding = padding

        if (typeof size.png === 'undefined')
          size.png = png

        if (typeof size.resizeOptions === 'undefined')
          size.resizeOptions = resizeOptions

        if (typeof size.darkResizeOptions === 'undefined')
          size.darkResizeOptions = darkResizeOptions
      })
      const {
        log = true,
        addMediaScreen = true,
        basePath = '/',
        xhtml = false,
      } = useLinkMediaOptions
      appleSplashScreens = {
        padding,
        sizes,
        linkMediaOptions: {
          log,
          addMediaScreen,
          basePath,
          xhtml,
        },
        name,
        png,
      }
    }

    const assets: ResolvedAssets = {
      assets: {
        transparent: toResolvedAsset('transparent', usePreset.transparent),
        maskable: toResolvedAsset('maskable', usePreset.maskable),
        apple: toResolvedAsset('apple', usePreset.apple),
      },
      png,
      assetName,
    }

    const imageDir = resolve(ctx.viteConfig.root ?? process.cwd(), ctx.viteConfig.publicDir ?? 'public')
    const imageFile = resolve(imageDir, image)

    const base = ctx.options.base ?? '/'

    const useFaviconPreset = htmlPreset ?? faviconPreset ?? 'default'

    const favicons = new Map<string, FaviconAsset>()
    const pwaIcons = new Map<string, IconAsset>()

    const faviconsMap = new Set<string>()
    const transparentAsset = assets.assets.transparent
    // const { sizes, padding, resizeOptions } = transparentAsset
    for (const size of transparentAsset.sizes) {
      const file = assets.assetName('transparent', size)
      const path = `${base}${file}`
      const icon: IconAsset = {
        file: resolve(imageDir, file),
        path,
        buffer: () => generateTransparentAsset('png', imageFile, size, {
          padding: transparentAsset.padding,
          resizeOptions: transparentAsset.resizeOptions,
          outputOptions: assets.png,
        }).then(m => m.toBuffer()),
        save: () => generateTransparentAsset('png', imageFile, size, {
          padding: transparentAsset.padding,
          resizeOptions: transparentAsset.resizeOptions,
          outputOptions: assets.png,
        }).then(m => m.toFile(file)).then(() => {}),
      }
      pwaIcons.set(path, icon)
      const useFavicons = transparentAsset.favicons?.filter(([s]) => sameAssetSize(s, size))
      if (!useFavicons?.length) {
        if (!transparentAsset.favicons?.length)
          continue

        for (const [s, faviconName] of transparentAsset.favicons) {
          if (faviconsMap.has(faviconName))
            continue

          faviconsMap.add(faviconName)
          const faviconFile = resolve(imageDir, faviconName)
          favicons.set(`${base}${faviconName}`, {
            file: faviconFile,
            path: `${base}${faviconName}`,
            link: createFaviconHtmlLink('string', useFaviconPreset, {
              name: faviconName,
              size: s,
              basePath: base,
            }),
            buffer: () => generateTransparentAsset('png', imageFile, s, {
              padding: transparentAsset.padding,
              resizeOptions: transparentAsset.resizeOptions,
              outputOptions: assets.png,
            }).then(m => m.toBuffer()).then(b => generateFavicon('png', b)),
            save: () => generateTransparentAsset('png', imageFile, s, {
              padding: transparentAsset.padding,
              resizeOptions: transparentAsset.resizeOptions,
              outputOptions: assets.png,
            }).then(m => m.toBuffer()).then(b => generateFavicon('png', b)).then(b => writeFile(faviconFile, b)),
          })
        }
        continue
      }

      for (const [_s, faviconName] of useFavicons) {
        const faviconFile = resolve(imageDir, faviconName)
        favicons.set(`${base}${faviconName}`, {
          file: faviconName,
          path: `${base}${faviconName}`,
          link: createFaviconHtmlLink('string', useFaviconPreset, {
            name: faviconName,
            size,
            basePath: base,
          }),
          buffer: () => icon.buffer().then(b => generateFavicon('png', b)),
          save: () => icon.buffer().then(b => generateFavicon('png', b)).then(b => writeFile(faviconFile, b)),
        })
      }
    }
    const maskableAsset = assets.assets.maskable
    // const { sizes, padding, resizeOptions } = maskableAsset
    for (const size of maskableAsset.sizes) {
      const file = assets.assetName('maskable', size)
      const path = `${base}${file}`
      const icon: IconAsset = {
        file: resolve(imageDir, file),
        path,
        buffer: () => generateMaskableAsset('png', imageFile, size, {
          padding: maskableAsset.padding,
          resizeOptions: maskableAsset.resizeOptions,
          outputOptions: assets.png,
        }).then(m => m.toBuffer()),
        save: () => generateMaskableAsset('png', imageFile, size, {
          padding: maskableAsset.padding,
          resizeOptions: maskableAsset.resizeOptions,
          outputOptions: assets.png,
        }).then(m => m.toFile(file)).then(() => {}),
      }
      pwaIcons.set(path, icon)
      const useFavicons = maskableAsset.favicons?.filter(([s]) => sameAssetSize(s, size))
      if (!useFavicons?.length) {
        if (!maskableAsset.favicons?.length)
          continue

        for (const [s, faviconName] of maskableAsset.favicons) {
          if (faviconsMap.has(faviconName))
            continue

          faviconsMap.add(faviconName)
          const faviconFile = resolve(imageDir, faviconName)
          favicons.set(`${base}${faviconName}`, {
            file: faviconFile,
            path: `${base}${faviconName}`,
            link: createFaviconHtmlLink('string', useFaviconPreset, {
              name: faviconName,
              size: s,
              basePath: base,
            }),
            buffer: () => generateMaskableAsset('png', imageFile, s, {
              padding: transparentAsset.padding,
              resizeOptions: transparentAsset.resizeOptions,
              outputOptions: assets.png,
            }).then(m => m.toBuffer()).then(b => generateFavicon('png', b)),
            save: () => generateMaskableAsset('png', imageFile, s, {
              padding: transparentAsset.padding,
              resizeOptions: transparentAsset.resizeOptions,
              outputOptions: assets.png,
            }).then(m => m.toBuffer()).then(b => generateFavicon('png', b)).then(b => writeFile(faviconFile, b)),
          })
        }
        continue
      }

      for (const [_s, faviconName] of useFavicons) {
        const faviconFile = resolve(imageDir, faviconName)
        favicons.set(`${base}${faviconName}`, {
          file: faviconName,
          path: `${base}${faviconName}`,
          link: createFaviconHtmlLink('string', useFaviconPreset, {
            name: faviconName,
            size,
            basePath: base,
          }),
          buffer: () => icon.buffer().then(b => generateFavicon('png', b)),
          save: () => icon.buffer().then(b => generateFavicon('png', b)).then(b => writeFile(faviconFile, b)),
        })
      }
    }

    const appleAsset = assets.assets.apple
    let appleTouchIcon: FaviconAsset | undefined
    // const { sizes, padding, resizeOptions } = transparentAsset
    for (const size of appleAsset.sizes) {
      const file = assets.assetName('transparent', size)
      const path = `${base}${file}`
      const icon: IconAsset = {
        file: resolve(imageDir, file),
        path,
        buffer: () => generateMaskableAsset('png', imageFile, size, {
          padding: appleAsset.padding,
          resizeOptions: appleAsset.resizeOptions,
          outputOptions: assets.png,
        }).then(m => m.toBuffer()),
        save: () => generateMaskableAsset('png', imageFile, size, {
          padding: appleAsset.padding,
          resizeOptions: appleAsset.resizeOptions,
          outputOptions: assets.png,
        }).then(m => m.toFile(file)).then(() => {}),
      }
      appleTouchIcon = {
        ...icon,
        link: createFaviconHtmlLink('string', useFaviconPreset, {
          name: file,
          size,
          basePath: base,
        }),
      }
      pwaIcons.set(path, icon)
      const useFavicons = appleAsset.favicons?.filter(([s]) => sameAssetSize(s, size))
      if (!useFavicons?.length) {
        if (!appleAsset.favicons?.length)
          continue

        for (const [s, faviconName] of appleAsset.favicons) {
          if (faviconsMap.has(faviconName))
            continue

          faviconsMap.add(faviconName)
          const faviconFile = resolve(imageDir, faviconName)
          favicons.set(`${base}${faviconName}`, {
            file: faviconFile,
            path: `${base}${faviconName}`,
            link: '',
            buffer: () => generateTransparentAsset('png', imageFile, s, {
              padding: appleAsset.padding,
              resizeOptions: appleAsset.resizeOptions,
              outputOptions: assets.png,
            }).then(m => m.toBuffer()).then(b => generateFavicon('png', b)),
            save: () => generateTransparentAsset('png', imageFile, s, {
              padding: appleAsset.padding,
              resizeOptions: appleAsset.resizeOptions,
              outputOptions: assets.png,
            }).then(m => m.toBuffer()).then(b => generateFavicon('png', b)).then(b => writeFile(faviconFile, b)),
          })
        }
        continue
      }

      for (const [_s, faviconName] of useFavicons) {
        const faviconFile = resolve(imageDir, faviconName)
        favicons.set(`${base}${faviconName}`, {
          file: faviconName,
          path: `${base}${faviconName}`,
          link: '',
          buffer: () => icon.buffer().then(b => generateFavicon('png', b)),
          save: () => icon.buffer().then(b => generateFavicon('png', b)).then(b => writeFile(faviconFile, b)),
        })
      }
    }

    if (image.endsWith('.svg')) {
      favicons.set(`${base}${image}`, {
        file: imageFile,
        path: `${base}${image}`,
        link: createFaviconHtmlLink('string', useFaviconPreset, {
          name: image,
          basePath: base,
        }),
        buffer: () => readFile(imageFile),
        save: () => Promise.resolve(),
      })
    }

    return {
      favicons,
      pwaIcons,
      appleTouchIcon,
    } satisfies ResolvedPWAAssets
  }

  async function transformIndexHtmlHandler(html: string) {
    if (ctx.disableAssets)
      return html

    const assets = await ctx.assets
    if (!assets)
      return html

    const { appleTouchIcon, favicons } = assets

    if (favicons.size) {
      const faviconLinks = [...favicons.values()].filter(favicon => favicon.link.length).map(favicon => favicon.link)
      html = html.replace('</head>', `\n${faviconLinks.join('\n')}</head>`)
    }

    if (appleTouchIcon)
      html = html.replace('</head>', `\n${appleTouchIcon.link}\n</head>`)

    // eslint-disable-next-line no-console
    console.log(html)

    return html
  }

  function sameAssetSize(a: AssetSize, b: ResolvedAssetSize) {
    if (typeof a === 'number' && typeof b.original === 'number')
      return a === b.original

    if (typeof a !== 'number' && typeof b.original !== 'number')
      return a.width === b.width && a.height === b.height

    return false
  }
}
