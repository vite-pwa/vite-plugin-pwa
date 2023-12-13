import type { Plugin } from 'vite'

import type { PWAPluginContext } from '../context'

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
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url
        if (!url)
          return next()

        const assetsGenerator = await ctx.assets()
        if (!assetsGenerator)
          return next()

        const icon = await assetsGenerator.findIconAsset(url)
        if (!icon)
          return next()

        const buffer = await icon.buffer
        res.setHeader('Content-Type', icon.mimeType)
        res.setHeader('Content-Length', buffer.length)
        res.setHeader('Cache-Control', 'public,max-age=0,must-revalidate')
        res.statusCode = 200
        res.end(buffer)
      })
    },
  }

  async function transformIndexHtmlHandler(html: string) {
    const assetsGenerator = await ctx.assets()
    if (!assetsGenerator)
      return html

    return assetsGenerator.transformIndexHtmlHandler(html)
  }
}
