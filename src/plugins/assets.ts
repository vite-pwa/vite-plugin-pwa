import type { Plugin } from 'vite'

import type { PWAPluginContext } from '../context'
import { DEV_RELOAD_PAGE_NAME } from '../constants'

export function AssetsPlugin(ctx: PWAPluginContext) {
  return <Plugin>{
    name: 'vite-plugin-pwa:assets',
    enforce: 'post',
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
    async handleHotUpdate({ file, server }) {
      const assetsGenerator = await ctx.assets
      if (await assetsGenerator?.checkHotUpdate(file)) {
        server.ws.send({
          type: 'custom',
          event: DEV_RELOAD_PAGE_NAME,
        })
        return []
      }
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url
        if (!url)
          return next()

        if (!/\.(ico|png|svg|webp)$/.test(url))
          return next()

        const assetsGenerator = await ctx.assets
        if (!assetsGenerator)
          return next()

        const icon = await assetsGenerator.findIconAsset(url)
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

  async function transformIndexHtmlHandler(html: string) {
    const assetsGenerator = await ctx.assets
    if (!assetsGenerator)
      return html

    return assetsGenerator.transformIndexHtmlHandler(html)
  }
}
