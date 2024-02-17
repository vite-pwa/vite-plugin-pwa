import type { ModuleNode, Plugin, ViteDevServer } from 'vite'
import type { PWAPluginContext } from '../context'
import {
  DEV_PWA_ASSETS_NAME,
  DEV_READY_NAME,
  PWA_ASSETS_HEAD_VIRTUAL,
  PWA_ASSETS_ICONS_VIRTUAL,
  RESOLVED_PWA_ASSETS_HEAD_VIRTUAL,
  RESOLVED_PWA_ASSETS_ICONS_VIRTUAL,
} from '../constants'
import { extractIcons } from '../pwa-assets/utils'

export function AssetsPlugin(ctx: PWAPluginContext) {
  return <Plugin>{
    name: 'vite-plugin-pwa:pwa-assets',
    enforce: 'post',
    transformIndexHtml: {
      order: 'post',
      async handler(html) {
        return await transformIndexHtmlHandler(html, ctx)
      },
      enforce: 'post', // deprecated since Vite 4
      async transform(html) { // deprecated since Vite 4
        return await transformIndexHtmlHandler(html, ctx)
      },
    },
    resolveId(id) {
      switch (true) {
        case id === PWA_ASSETS_HEAD_VIRTUAL:
          return RESOLVED_PWA_ASSETS_HEAD_VIRTUAL
        case id === PWA_ASSETS_ICONS_VIRTUAL:
          return RESOLVED_PWA_ASSETS_ICONS_VIRTUAL
        default:
          return undefined
      }
    },
    async load(id) {
      if (id === RESOLVED_PWA_ASSETS_HEAD_VIRTUAL) {
        const pwaAssetsGenerator = await ctx.pwaAssetsGenerator
        const head = pwaAssetsGenerator?.resolveHtmlAssets() ?? { links: [], themeColor: undefined }
        return `export const pwaAssetsHead = ${JSON.stringify(head)}`
      }

      if (id === RESOLVED_PWA_ASSETS_ICONS_VIRTUAL) {
        const pwaAssetsGenerator = await ctx.pwaAssetsGenerator
        const icons = extractIcons(pwaAssetsGenerator?.instructions())
        return `export const pwaAssetsIcons = ${JSON.stringify(icons)}`
      }
    },
    async handleHotUpdate({ file, server }) {
      const pwaAssetsGenerator = await ctx.pwaAssetsGenerator
      if (await pwaAssetsGenerator?.checkHotUpdate(file)) {
        const modules: ModuleNode[] = []
        const head = server.moduleGraph.getModuleById(RESOLVED_PWA_ASSETS_HEAD_VIRTUAL)
        head && modules.push(head)
        const icons = server.moduleGraph.getModuleById(RESOLVED_PWA_ASSETS_ICONS_VIRTUAL)
        icons && modules.push(icons)
        if (modules)
          return modules

        server.ws.send({ type: 'full-reload' })
        return []
      }
    },
    configureServer(server) {
      server.ws.on(DEV_READY_NAME, createWSResponseHandler(ctx, server))
      server.middlewares.use(async (req, res, next) => {
        const url = req.url
        if (!url)
          return next()

        if (!/\.(ico|png|svg|webp)$/.test(url))
          return next()

        const pwaAssetsGenerator = await ctx.pwaAssetsGenerator
        if (!pwaAssetsGenerator)
          return next()

        const icon = await pwaAssetsGenerator.findIconAsset(url)
        if (!icon)
          return next()

        if (icon.age > 0) {
          const ifModifiedSince = req.headers['if-modified-since'] ?? req.headers['If-Modified-Since']
          const useIfModifiedSince = ifModifiedSince ? Array.isArray(ifModifiedSince) ? ifModifiedSince[0] : ifModifiedSince : undefined
          if (useIfModifiedSince && new Date(icon.lastModified).getTime() / 1000 >= new Date(useIfModifiedSince).getTime() / 1000) {
            res.statusCode = 304
            res.end()
            return
          }
        }

        const buffer = await icon.buffer
        res.setHeader('Age', icon.age / 1000)
        res.setHeader('Content-Type', icon.mimeType)
        res.setHeader('Content-Length', buffer.length)
        res.setHeader('Last-Modified', new Date(icon.lastModified).toUTCString())
        res.statusCode = 200
        res.end(buffer)
      })
    },
  }
}

async function transformIndexHtmlHandler(html: string, ctx: PWAPluginContext) {
  // dev: color-theme and icon links injected using createWSResponseHandler
  if (ctx.devEnvironment && ctx.options.devOptions.enabled)
    return html

  const pwaAssetsGenerator = await ctx.pwaAssetsGenerator
  if (!pwaAssetsGenerator)
    return html

  return pwaAssetsGenerator.transformIndexHtml(html)
}

function createWSResponseHandler(ctx: PWAPluginContext, server: ViteDevServer): () => Promise<void> {
  return async () => {
    const pwaAssetsGenerator = await ctx.pwaAssetsGenerator
    if (pwaAssetsGenerator) {
      const data = pwaAssetsGenerator.resolveHtmlAssets()
      server.ws.send({
        type: 'custom',
        event: DEV_PWA_ASSETS_NAME,
        data,
      })
    }
  }
}
