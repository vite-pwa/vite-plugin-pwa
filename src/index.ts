import type { Plugin } from 'vite'
import { Context } from './context'
import { createRollupPlugin } from './plugins/build'
import { createServerPlugin } from './plugins/server'
import { HTMLTransformer } from './transformers/html'
import { Options } from './types'

const defaultOptions: Options = {
  dirs: 'src/components',
  extensions: 'vue',
  deep: true,
}

function VitePWA(options: Partial<Options> = {}): Plugin {
  const resolvedOptions: Options = Object.assign({}, defaultOptions, options)
  const ctx = new Context(resolvedOptions)

  return {
    configureServer: createServerPlugin(ctx),
    rollupInputOptions: {
      plugins: [
        createRollupPlugin(ctx),
      ],
    },
    transforms: [
      HTMLTransformer(ctx),
    ],
  }
}

export type { Options }
export default VitePWA
