import { defineConfig } from 'vitepress'
import { version } from '../../package.json'
import { VitePressPWA } from '../../dist'
import { optimizePages } from '../scripts/assets'

const { VitePWAPlugin, buildEnd } = VitePressPWA({
  outDir: '.vitepress/dist',
  registerType: 'prompt',
  includeManifestIcons: false,
  integrationHook: optimizePages,
  manifest: {
    id: '/',
    name: 'Vite Plugin PWA',
    short_name: 'PWA for Vite',
    description: 'Zero-config PWA for Vite',
    theme_color: '#ffffff',
    icons: [
      {
        src: 'pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: 'icon_light.svg',
        sizes: '155x155',
        type: 'image/svg',
        purpose: 'any maskable',
      },
    ],
  },
  workbox: {
    globPatterns: ['**/*.{css,js,html,svg,png,ico,txt,woff2}'],
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts-cache',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'gstatic-fonts-cache',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'jsdelivr-images-cache',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 7, // <== 7 days
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
    ],
  },
})

const Guide = [
  {
    text: 'Getting Started',
    link: '/guide/',
  },
  {
    text: 'Register Service Worker',
    link: '/guide/register-service-worker',
  },
  {
    text: 'Service Worker Precache',
    link: '/guide/service-worker-precache',
  },
  {
    text: 'PWA Minimal Requirements',
    link: '/guide/pwa-minimal-requirements',
  },
  {
    text: 'Service Worker Strategies And Behaviors',
    link: '/guide/service-worker-strategies-and-behaviors',
  },
  {
    text: 'Automatic reload',
    link: '/guide/auto-update',
  },
  {
    text: 'Prompt for update',
    link: '/guide/prompt-for-update',
  },
  {
    text: 'Advanced (injectManifest)',
    link: '/guide/inject-manifest',
  },
  {
    text: 'Static assets handling',
    link: '/guide/static-assets',
  },
  {
    text: 'Periodic SW updates',
    link: '/guide/periodic-sw-updates',
  },
  {
    text: 'Development',
    link: '/guide/development',
  },
  {
    text: 'Unregister Service Worker',
    link: '/guide/unregister-service-worker',
  },
  {
    text: 'FAQ',
    link: '/guide/faq',
  },
]

const Deployment = [
  {
    text: 'Getting Started',
    link: '/deployment/',
  },
  {
    text: 'Netlify',
    link: '/deployment/netlify',
  },
  {
    text: 'AWS Amplify',
    link: '/deployment/aws',
  },
  {
    text: 'Vercel',
    link: '/deployment/vercel',
  },
  {
    text: 'NGINX',
    link: '/deployment/nginx',
  },
  {
    text: 'Apache Http Server 2.4+',
    link: '/deployment/apache',
  },
]

const Frameworks = [
  {
    text: 'Getting Started',
    link: '/frameworks/',
  },
  {
    text: 'Vue',
    link: '/frameworks/vue',
  },
  {
    text: 'React',
    link: '/frameworks/react',
  },
  {
    text: 'Svelte',
    link: '/frameworks/svelte',
  },
  {
    text: 'SvelteKit',
    link: '/frameworks/sveltekit',
  },
  {
    text: 'SolidJS',
    link: '/frameworks/solidjs',
  },
  {
    text: 'Preact',
    link: '/frameworks/preact',
  },
  {
    text: 'VitePress',
    link: '/frameworks/vitepress',
  },
  {
    text: 'îles',
    link: '/frameworks/iles',
  },
  {
    text: 'Astro (WIP)',
    link: '/frameworks/astro',
  },
]

const Examples = [
  {
    text: 'Getting Started',
    link: '/examples/',
  },
  {
    text: 'Vue',
    link: '/examples/vue',
  },
  {
    text: 'React',
    link: '/examples/react',
  },
  {
    text: 'Svelte',
    link: '/examples/svelte',
  },
  {
    text: 'SvelteKit',
    link: '/examples/sveltekit',
  },
  {
    text: 'SolidJS',
    link: '/examples/solidjs',
  },
  {
    text: 'Preact',
    link: '/examples/preact',
  },
  {
    text: 'VitePress',
    link: '/examples/vitepress',
  },
  {
    text: 'îles',
    link: '/examples/iles',
  },
  {
    text: 'Astro (WIP)',
    link: '/examples/astro',
  },
]

const Workbox = [
  {
    text: 'Getting Started',
    link: '/workbox/',
  },
  {
    text: 'generateSW',
    link: '/workbox/generate-sw',
  },
  {
    text: 'injectManifest',
    link: '/workbox/inject-manifest',
  },
]

function prepareSidebar(idx: number) {
  return [
    {
      text: 'Guide',
      collapsible: true,
      collapsed: true,
      items: Guide,
    },
    {
      text: 'Frameworks',
      collapsible: true,
      collapsed: true,
      items: Frameworks,
    },
    {
      text: 'Examples',
      collapsible: true,
      collapsed: true,
      items: Examples,
    },
    {
      text: 'Deploy',
      collapsible: true,
      collapsed: true,
      items: Deployment,
    },
    {
      text: 'Workbox',
      collapsible: true,
      collapsed: true,
      items: Workbox,
    },
  ].map((entry, i) => {
    if (idx === i)
      entry.collapsed = false

    return entry
  })
}

const ogUrl = 'https://vite-plugin-pwa.netlify.app/'
const ogImage = 'https://vite-plugin-pwa.netlify.app/og-image.png'

// @ts-expect-error avoid TS2321: Excessive stack depth comparing types
export default defineConfig({
  lang: 'en-US',
  title: 'Vite Plugin PWA',
  description: 'Zero-config PWA Framework-agnostic Plugin for Vite',
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
  themeConfig: {
    // logo: '/favicon.svg',
    editLink: {
      pattern: 'https://github.com/antfu/vite-plugin-pwa/edit/main/docs/:path',
      text: 'Suggest changes to this page',
    },
    algolia: {
      appId: 'TTO9T0AE3F',
      apiKey: '71bd3d3c7274205843267bb1ccb6b1a8',
      indexName: 'vite-plugin-pwa',
    },
    socialLinks: [
      { icon: 'discord', link: 'https://chat.antfu.me' },
      { icon: 'github', link: 'https://github.com/antfu/vite-plugin-pwa' },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2021-PRESENT Anthony Fu',
    },
    nav: [
      {
        text: 'Guide',
        items: [
          {
            text: 'Getting Started',
            link: '/guide/',
          },
          {
            text: 'Frameworks',
            link: '/frameworks/',
          },
          {
            text: 'Examples',
            link: '/examples/',
          },
        ],
      },
      {
        text: 'Deploy',
        link: '/deployment/',
      },
      {
        text: 'Workbox',
        link: '/workbox/',
      },
      {
        text: `v${version}`,
        items: [
          {
            text: 'Release Notes',
            link: 'https://github.com/antfu/vite-plugin-pwa/releases',
          },
          {
            text: 'Contributing',
            link: 'https://github.com/antfu/vite-plugin-pwa/blob/main/CONTRIBUTING.md',
          },
        ],
      },
    ],
    sidebar: {
      '/guide/': prepareSidebar(0),
      '/frameworks/': prepareSidebar(1),
      '/examples/': prepareSidebar(2),
      '/deployment/': prepareSidebar(3),
      '/workbox/': prepareSidebar(4),
    },
  },
  vite: {
    plugins: [
      // @ts-expect-error Vite 2 types in Vite 3
      VitePWAPlugin,
    ],
  },
  buildEnd,
})
