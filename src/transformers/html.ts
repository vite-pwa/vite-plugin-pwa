import { Transform } from 'vite'
import Debug from 'debug'
import { Context } from '../context'

const debug = Debug('vite-plugin-pwa:transform:html')

export const HTMLTransformer = (ctx: Context): Transform => ({
  test({ path }) {
    debug(path)
    return path.endsWith('index.html')
  },
  transform({ code }) {
    debug(code)
    return code
  },
})
