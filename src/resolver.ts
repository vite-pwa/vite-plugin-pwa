import Debug from 'debug'
import { Context } from './context'

const debug = Debug('vite-plugin-pwa:resolver')

export function isResolverPath(path: string) {
  debug(path)
  return path === '/'
}

export function resolver(ctx: Context) {
  return ''
}
