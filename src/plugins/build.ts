import type { Plugin } from 'rollup'
import { isResolverPath, resolver } from '../resolver'
import { Context } from '../context'

export function createRollupPlugin(ctx: Context): Plugin {
  return {
    name: 'vite-plugin-pwa',
    resolveId(source) {
      if (isResolverPath(source))
        return source
      return null
    },
    async load(id) {
      if (isResolverPath(id))
        return await resolver(ctx)
      return null
    },
  }
}
