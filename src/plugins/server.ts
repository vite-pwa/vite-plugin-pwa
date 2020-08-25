import type { ServerPlugin } from 'vite'
// import Debug from 'debug'
import { isResolverPath, resolver } from '../resolver'
import { Context } from '../context'

// const debug = Debug('vite-plugin-pwa:koa')

export function createServerPlugin(ctx: Context): ServerPlugin {
  return ({ app }) => {
    app.use(async(koa, next) => {
      if (!isResolverPath(koa.path))
        return next()

      try {
        koa.body = await resolver(ctx)
        koa.type = 'js'
        koa.status = 200
      }
      catch (e) {
        koa.body = {
          error: e.toString(),
        }
        koa.type = 'json'
        koa.status = 500
      }
    })
  }
}
