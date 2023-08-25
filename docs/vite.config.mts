import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'
import { presetAttributify, presetUno } from 'unocss'
import Unocss from 'unocss/vite'
import NavbarFix from './plugins/navbar'

export default defineConfig({
  ssr: {
    format: 'cjs',
  },
  legacy: {
    buildSsrCjsExternalHeuristics: true,
  },
  build: {
    // sourcemap: true,
    // minify: false,
    ssrManifest: false,
    manifest: false,
  },
  optimizeDeps: {
    exclude: [
      '@vueuse/core',
      'vitepress',
    ],
  },
  server: {
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    // https://github.com/antfu/vite-plugin-components
    Components({
      dirs: [
        '.vitepress/theme/components',
      ],
      // allow auto load markdown components under `./src/components/`
      extensions: ['vue', 'md'],

      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],

      // generate `components.d.ts` for ts support with Volar
      dts: '.vitepress/components.d.ts',
    }),

    NavbarFix(),

    // https://github.com/unocss/unocss
    Unocss({
      presets: [presetUno(), presetAttributify()],
    }),
  ],
})
