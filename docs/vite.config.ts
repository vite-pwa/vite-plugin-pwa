import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'
import { presetAttributify, presetIcons, presetUno } from 'unocss'
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
      theme: {
        breakpoints: {
          'xs': '468px',
          'sm': '640px',
          'md': '768px',
          'lg': '1024px',
          'xl': '1280px',
          '2xl': '1536px',
        },
      },
      shortcuts: [
        { 'pb-input': 'grid grid-cols-[150px_1fr] gap-x-1rem items-baseline lt-sm:grid-cols-[1fr]' },
        { 'pb-error': 'animate-shake-x animate-count-1 animate-delay-0.5s animate-duration-1s' },
        { 'pb-input-enter': 'animate-zoom-in animate-count-1 animate-duration-0.5s' },
        { 'pb-input-leave': 'animate-zoom-out animate-count-1 animate-duration-0.3s' },
        { 'pb-errors-enter': 'animate-zoom-in animate-count-1 animate-duration-0.5s' },
        { 'pb-errors-leave': 'animate-zoom-out animate-count-1 animate-duration-0.3s' },
      ],
      presets: [
        presetIcons(),
        presetUno(),
        presetAttributify(),
      ],
    }),
  ],
})
