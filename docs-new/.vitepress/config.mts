import { defineConfig } from 'vitepress'

import { pwa } from '../scripts/pwa'

import { buildEnd } from '../scripts/build'
import { en } from '../config/en'
import { zh, search as zhSearch } from '../config/zh'

const ogUrl = 'https://vite-pwa-org.netlify.app/'
const ogImage = 'https://vite-pwa-org.netlify.app/og-image.png'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Vite Plugin PWA',
  description: 'Zero-config PWA Framework-agnostic Plugin for Vite',
  rewrites: {
    'en/:rest*': ':rest*',
  },
  head: [
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'alternate icon', href: '/favicon.ico', type: 'image/png', sizes: '16x16' }],
    ['link', { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#ffffff' }],
    ['meta', { name: 'author', content: 'Anthony Fu' }],
    ['meta', {
      name: 'keywords',
      content: 'PWA, React, Vue, VitePress, Preact, Svelte, SvelteKit, workbox, SolidJS, Vite, vite-plugin, îles, Astro',
    }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Vite Plugin PWA' }],
    ['meta', { property: 'og:image', content: ogImage }],
    ['meta', { property: 'og:description', content: 'Zero-config PWA Framework-agnostic Plugin for Vite' }],
    ['meta', { property: 'og:url', content: ogUrl }],
    ['meta', { name: 'twitter:description', content: 'Zero-config PWA Framework-agnostic Plugin for Vite' }],
    ['meta', { name: 'twitter:title', content: 'Vite Plugin PWA' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: ogImage }],
    ['meta', { name: 'twitter:site', content: '@antfu7' }],
    ['meta', { name: 'twitter:url', content: ogUrl }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' }],
  ],
  lastUpdated: true,
  markdown: {
    theme: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
  },
  vite: {
    plugins: [pwa()],
  },
  buildEnd,
  themeConfig: {
    search: {
      provider: 'algolia',
      options: {
        appId: 'TTO9T0AE3F',
        apiKey: '71bd3d3c7274205843267bb1ccb6b1a8',
        indexName: 'vite-plugin-pwa',
        locales: {
          ...zhSearch,
        },
      },
    },
    socialLinks: [
      { icon: 'discord', link: 'https://chat.antfu.me' },
      { icon: 'github', link: 'https://github.com/antfu/vite-plugin-pwa' },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2021-PRESENT Anthony Fu',
    },
  },
  locales: {
    root: { label: 'English', ...en },
    zh: { label: '简体中文', ...zh },
  },
})
