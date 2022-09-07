import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
  ],
  clean: true,
  declaration: true,
  externals: [
    'vite',
    'workbox-build',
  ],
  rollup: {
    emitCJS: true,
    alias: {
      entries: {
        'workbox-build': './node_modules/@types/workbox-build/index.d.ts'
      }
    },
    dts: {
      respectExternal: true,
    }
  },
})
